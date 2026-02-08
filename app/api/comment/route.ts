import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface Comment {
  id: string;
  name: string;
  comment: string;
  timestamp: number;
  approved: boolean;
}

export async function POST(req: NextRequest) {
  try {
    const { name, comment, lessonId, lessonTitle } = await req.json();

    // 입력 검증
    if (!name || !comment || !lessonId || !lessonTitle) {
      return NextResponse.json(
        { error: '이름과 댓글을 모두 입력해주세요.' },
        { status: 400 }
      );
    }

    // 댓글 데이터 생성
    const commentData: Comment = {
      id: `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      name: name.trim(),
      comment: comment.trim(),
      timestamp: Date.now(),
      approved: true, // 자동 승인
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
        .sort((a: Comment, b: Comment) => a.timestamp - b.timestamp); // 오래된 순

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
