import { NextRequest, NextResponse } from 'next/server';

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
