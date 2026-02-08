import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';
import bcrypt from 'bcryptjs';

interface Comment {
  id: string;
  name: string;
  comment: string;
  timestamp: number;
  approved: boolean;
  passwordHash: string;
}

export async function POST(req: NextRequest) {
  try {
    const { name, comment, password, lessonId, lessonTitle } = await req.json();

    // 입력 검증
    if (!name || !comment || !password || !lessonId || !lessonTitle) {
      return NextResponse.json(
        { error: '이름, 댓글, 비밀번호를 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 비밀번호 해시 생성
    const passwordHash = await bcrypt.hash(password, 10);

    // 댓글 데이터 생성
    const commentData: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      comment: comment.trim(),
      timestamp: Date.now(),
      approved: true, // 자동 승인
      passwordHash,
    };

    // Vercel KV에 댓글 저장
    const key = `comments:${lessonId}`;
    try {
      await kv.lpush(key, JSON.stringify(commentData));
    } catch (kvError) {
      console.error('KV storage error:', kvError);
      // KV 에러는 무시하고 슬랙 알림은 계속 진행
    }

    // 슬랙으로 알림 전송
    const slackToken = process.env.SLACK_BOT_TOKEN;
    const slackChannel = 'D0AC44VCLCW'; // Jackie DM

    if (!slackToken) {
      console.error('SLACK_BOT_TOKEN not found');
      return NextResponse.json(
        { error: '서버 설정 오류입니다.' },
        { status: 500 }
      );
    }

    const slackMessage = `🗣️ *새로운 댓글이 작성되었습니다*

📝 *글:* ${lessonTitle}
👤 *작성자:* ${name}
💬 *댓글:*
${comment}

---
https://hyesungjackie.com/principles`;

    const slackResponse = await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${slackToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        channel: slackChannel,
        text: slackMessage,
      }),
    });

    const slackData = await slackResponse.json();

    if (!slackData.ok) {
      console.error('Slack API error:', slackData);
      return NextResponse.json(
        { error: '알림 전송에 실패했습니다.' },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: '댓글이 접수되었습니다. 확인 후 답변드리겠습니다!' 
    });

  } catch (error) {
    console.error('Comment submission error:', error);
    return NextResponse.json(
      { error: '댓글 전송에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 조회 API
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');

    if (!lessonId) {
      return NextResponse.json(
        { error: 'lessonId가 필요합니다.' },
        { status: 400 }
      );
    }

    const key = `comments:${lessonId}`;
    
    try {
      // KV에서 댓글 목록 가져오기
      const comments = await kv.lrange(key, 0, -1);
      
      const parsedComments = comments
        .map((c: any) => {
          try {
            return typeof c === 'string' ? JSON.parse(c) : c;
          } catch {
            return null;
          }
        })
        .filter((c: any) => c !== null)
        .filter((c: Comment) => c.approved) // 승인된 댓글만
        .sort((a: Comment, b: Comment) => a.timestamp - b.timestamp) // 오래된 순
        .map((c: Comment) => {
          // passwordHash는 클라이언트에 보내지 않음
          const { passwordHash, ...commentWithoutPassword } = c;
          return commentWithoutPassword;
        });

      return NextResponse.json({ 
        success: true,
        comments: parsedComments 
      });
    } catch (kvError) {
      console.error('KV fetch error:', kvError);
      // KV 에러 시 빈 배열 반환
      return NextResponse.json({ 
        success: true,
        comments: [] 
      });
    }

  } catch (error) {
    console.error('Comment fetch error:', error);
    return NextResponse.json(
      { error: '댓글 조회에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 삭제 API
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');
    const commentId = searchParams.get('commentId');
    const password = searchParams.get('password');

    if (!lessonId || !commentId || !password) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const key = `comments:${lessonId}`;

    try {
      // 모든 댓글 가져오기
      const comments = await kv.lrange(key, 0, -1);
      
      const parsedComments = comments.map((c: any) => {
        try {
          return typeof c === 'string' ? JSON.parse(c) : c;
        } catch {
          return null;
        }
      }).filter((c: any) => c !== null);

      // 삭제할 댓글 찾기
      const targetComment = parsedComments.find((c: Comment) => c.id === commentId);

      if (!targetComment) {
        return NextResponse.json(
          { error: '댓글을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, targetComment.passwordHash);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: '비밀번호가 일치하지 않습니다.' },
          { status: 401 }
        );
      }

      // 댓글 삭제 (해당 댓글 제외하고 모두 다시 저장)
      const remainingComments = parsedComments.filter((c: Comment) => c.id !== commentId);
      
      // 기존 리스트 삭제
      await kv.del(key);
      
      // 남은 댓글들 다시 저장
      if (remainingComments.length > 0) {
        for (const comment of remainingComments.reverse()) {
          await kv.lpush(key, JSON.stringify(comment));
        }
      }

      return NextResponse.json({ 
        success: true,
        message: '댓글이 삭제되었습니다.' 
      });

    } catch (kvError) {
      console.error('KV delete error:', kvError);
      return NextResponse.json(
        { error: '댓글 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Comment delete error:', error);
    return NextResponse.json(
      { error: '댓글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}

// 댓글 수정 API
export async function PATCH(req: NextRequest) {
  try {
    const { lessonId, commentId, password, newComment } = await req.json();

    if (!lessonId || !commentId || !password || !newComment) {
      return NextResponse.json(
        { error: '필수 정보가 누락되었습니다.' },
        { status: 400 }
      );
    }

    const key = `comments:${lessonId}`;

    try {
      // 모든 댓글 가져오기
      const comments = await kv.lrange(key, 0, -1);
      
      const parsedComments = comments.map((c: any) => {
        try {
          return typeof c === 'string' ? JSON.parse(c) : c;
        } catch {
          return null;
        }
      }).filter((c: any) => c !== null);

      // 수정할 댓글 찾기
      const targetIndex = parsedComments.findIndex((c: Comment) => c.id === commentId);

      if (targetIndex === -1) {
        return NextResponse.json(
          { error: '댓글을 찾을 수 없습니다.' },
          { status: 404 }
        );
      }

      const targetComment = parsedComments[targetIndex];

      // 비밀번호 확인
      const isPasswordValid = await bcrypt.compare(password, targetComment.passwordHash);

      if (!isPasswordValid) {
        return NextResponse.json(
          { error: '비밀번호가 일치하지 않습니다.' },
          { status: 401 }
        );
      }

      // 댓글 수정
      parsedComments[targetIndex].comment = newComment.trim();
      
      // 기존 리스트 삭제
      await kv.del(key);
      
      // 수정된 댓글들 다시 저장
      for (const comment of parsedComments.reverse()) {
        await kv.lpush(key, JSON.stringify(comment));
      }

      return NextResponse.json({ 
        success: true,
        message: '댓글이 수정되었습니다.' 
      });

    } catch (kvError) {
      console.error('KV update error:', kvError);
      return NextResponse.json(
        { error: '댓글 수정에 실패했습니다.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Comment update error:', error);
    return NextResponse.json(
      { error: '댓글 수정에 실패했습니다.' },
      { status: 500 }
    );
  }
}
