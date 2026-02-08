import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

// Admin API for comment management
// DELETE: Remove a comment without password
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const lessonId = searchParams.get('lessonId');
    const commentId = searchParams.get('commentId');
    const adminKey = searchParams.get('adminKey');

    // Verify admin key
    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized - Invalid admin key' },
        { status: 401 }
      );
    }

    if (!lessonId || !commentId) {
      return NextResponse.json(
        { error: 'lessonId and commentId are required' },
        { status: 400 }
      );
    }

    const key = `comments:${lessonId}`;
    
    // Get all comments
    const comments = await kv.lrange<string>(key, 0, -1);
    
    if (!comments || comments.length === 0) {
      return NextResponse.json(
        { error: 'No comments found' },
        { status: 404 }
      );
    }

    // Parse and find the comment to delete
    const parsedComments = comments.map(c => JSON.parse(c));
    const commentIndex = parsedComments.findIndex(c => c.id === commentId);

    if (commentIndex === -1) {
      return NextResponse.json(
        { error: 'Comment not found' },
        { status: 404 }
      );
    }

    // Delete the comment from Redis list (by index)
    // Redis LREM: removes count occurrences of elements equal to value
    const commentToDelete = comments[commentIndex];
    await kv.lrem(key, 1, commentToDelete);

    return NextResponse.json({
      success: true,
      message: 'Comment deleted successfully',
      deletedComment: parsedComments[commentIndex]
    });

  } catch (error) {
    console.error('Admin delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete comment' },
      { status: 500 }
    );
  }
}

// GET: List all comments for admin review (optional)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminKey = searchParams.get('adminKey');

    if (adminKey !== process.env.ADMIN_KEY) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get all lesson IDs (would need to track this separately in production)
    // For now, return a message indicating available endpoints
    return NextResponse.json({
      message: 'Admin API active',
      endpoints: {
        delete: 'DELETE /api/comment/admin?lessonId={id}&commentId={id}&adminKey={key}',
        list: 'GET /api/comment?lessonId={id}'
      }
    });

  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
