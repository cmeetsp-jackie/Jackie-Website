import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { message } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    // OpenClaw Gateway API 호출
    const gatewayUrl = process.env.OPENCLAW_GATEWAY_URL || 'http://localhost:3390';
    const gatewayToken = process.env.OPENCLAW_GATEWAY_TOKEN;

    if (!gatewayToken) {
      console.error('OPENCLAW_GATEWAY_TOKEN is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // Henry Ford에게 메시지 전달 (sessions_send 사용)
    const response = await fetch(`${gatewayUrl}/api/v1/sessions/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${gatewayToken}`,
      },
      body: JSON.stringify({
        sessionKey: 'agent:main:main', // Henry Ford의 메인 세션
        message: `[Website Chat] ${message}`,
        timeoutSeconds: 30,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenClaw API error:', errorText);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    
    return NextResponse.json({
      reply: data.reply || "죄송합니다. 응답을 받지 못했습니다.",
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
