import { NextRequest, NextResponse } from 'next/server';
import { generateAIResponse } from '../route';

// 슬랙으로 승인 완료 알림 보내기
async function notifySlackAfterApproval(conversationId: string, reply: string, userMessage: string) {
  const slackToken = process.env.SLACK_BOT_TOKEN;
  const slackChannel = process.env.SLACK_NOTIFICATION_CHANNEL || 'D0AC44VCLCW';
  
  if (!slackToken) {
    console.warn('SLACK_BOT_TOKEN not set, skipping notification');
    return;
  }

  try {
    const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    
    const text = `✅ *Talk to Hyesung - 승인 완료 & AI 답변 생성*

*시간:* ${timestamp}
*대화 ID:* \`${conversationId}\`

*방문자 질문:*
> ${userMessage}

*AI 답변 (혜성):*
> ${reply}

방문자 화면에 답변이 전달되었습니다.`;

    await fetch('https://slack.com/api/chat.postMessage', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${slackToken}`,
      },
      body: JSON.stringify({
        channel: slackChannel,
        text,
      }),
    });
  } catch (error) {
    console.error('Failed to send Slack notification:', error);
  }
}

// GET: 승인 링크 클릭 → AI 응답 생성
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const conversationId = searchParams.get('id');
    const adminKey = searchParams.get('key');

    // 권한 확인
    if (adminKey !== process.env.ADMIN_KEY) {
      return new NextResponse(
        '<html><body><h1>❌ Unauthorized</h1><p>Invalid admin key</p></body></html>',
        { 
          status: 401,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    if (!conversationId) {
      return new NextResponse(
        '<html><body><h1>❌ Error</h1><p>Conversation ID is required</p></body></html>',
        { 
          status: 400,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

    try {
      // AI 응답 생성
      const { reply, userMessage } = await generateAIResponse(conversationId);
      
      // 슬랙 알림 (비동기)
      notifySlackAfterApproval(conversationId, reply, userMessage).catch(err =>
        console.error('Slack notification failed:', err)
      );

      return new NextResponse(
        `<html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                max-width: 600px;
                margin: 50px auto;
                padding: 20px;
                background: linear-gradient(to bottom, #f8fafc, #e2e8f0);
                min-height: 100vh;
              }
              .card {
                background: white;
                border-radius: 12px;
                padding: 30px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
              }
              h1 {
                color: #059669;
                margin: 0 0 10px 0;
                font-size: 24px;
              }
              p {
                color: #334155;
                line-height: 1.6;
                margin: 10px 0;
              }
              .reply-box {
                background: #f1f5f9;
                border-left: 4px solid #059669;
                padding: 15px;
                margin: 20px 0;
                border-radius: 4px;
                font-size: 14px;
                color: #1e293b;
                white-space: pre-wrap;
                word-wrap: break-word;
              }
              .footer {
                text-align: center;
                margin-top: 20px;
                color: #64748b;
                font-size: 14px;
              }
            </style>
          </head>
          <body>
            <div class="card">
              <h1>✅ 승인 완료!</h1>
              <p>대화가 승인되었고, AI 응답이 방문자에게 전달되었습니다.</p>
              <p><strong>대화 ID:</strong> <code>${conversationId}</code></p>
              <div class="reply-box">${reply}</div>
              <div class="footer">
                <p>이 창을 닫으셔도 됩니다.</p>
              </div>
            </div>
          </body>
        </html>`,
        { 
          status: 200,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );

    } catch (error: any) {
      console.error('Approve error:', error);
      
      return new NextResponse(
        `<html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
              .error { background: #fee2e2; border-left: 4px solid #dc2626; padding: 20px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="error">
              <h1>❌ Error</h1>
              <p>${error.message}</p>
            </div>
          </body>
        </html>`,
        { 
          status: 500,
          headers: { 'Content-Type': 'text/html; charset=utf-8' }
        }
      );
    }

  } catch (error) {
    console.error('Approve API error:', error);
    return new NextResponse(
      '<html><body><h1>❌ Internal Server Error</h1></body></html>',
      { 
        status: 500,
        headers: { 'Content-Type': 'text/html; charset=utf-8' }
      }
    );
  }
}
