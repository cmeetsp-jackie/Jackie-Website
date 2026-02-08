import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

interface Comment {
  id: string;
  name: string;
  comment: string;
  timestamp: number;
  approved: boolean;
  passwordHash?: string;
}

// 관리자 전용 댓글 삭제 API
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const lessonId = searchParams.get('lessonId');
    const commentId = searchParams.get('commentId');
    const adminKey = searchParams.get('adminKey');

    // 관리자 키 확인
    const validAdminKey = process.env.ADMIN_KEY || 'default-admin-key-change-me';
    
    if (adminKey !== validAdminKey) {
      return NextResponse.json(
        { error: '관리자 권한이 없습니다.' },
        { status: 403 }
      );
    }

    if (!lessonId || !commentId) {
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
        message: `댓글 삭제 완료 (작성자: ${targetComment.name})`,
        deletedComment: {
          id: targetComment.id,
          name: targetComment.name,
          comment: targetComment.comment
        }
      });

    } catch (kvError) {
      console.error('KV delete error:', kvError);
      return NextResponse.json(
        { error: '댓글 삭제에 실패했습니다.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('Admin comment delete error:', error);
    return NextResponse.json(
      { error: '댓글 삭제에 실패했습니다.' },
      { status: 500 }
    );
  }
}
