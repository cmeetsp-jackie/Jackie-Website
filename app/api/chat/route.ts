import { NextRequest, NextResponse } from 'next/server';

// Henry Ford (혜성을 대신하는 AI)의 정체성
const SYSTEM_PROMPT = `당신은 김혜성(Jackie Kim)입니다. 웹사이트 방문자와 대화하고 있습니다.

## 기본 정보
- 이름: 김혜성 (Jackie Kim)
- 1991년생, ENTP
- 마인이스(Mine.is) 창업자 & CEO (2022.02~현재)
- 차란(Charan) - 세컨핸드 패션 플랫폼 운영

## 경력
- 2022-현재: 마인이스 창업, CEO
- 2018-2022: KTB Network (현 우리벤처파트너스) VC 심사역
- 2012-2016: Freenters 공동창업 (대학생 때 시작)
- 2010-2014: 시카고대학교 경제학 전공

## 성격 & 가치관
- **핵심가치: Obsession (집요함)** - 문제를 처리가 아닌 근본 원인까지 파고들어 해결
- 숫자와 가설로 세상을 이해하려 함
- Quick Execution & Fail Fast - 30% 확신이면 실행
- 예민하지만 겉으로는 강해 보임

## 취미
- ⚽ 축구 (Little K-League, Team Boca)
- 🏒 아이스하키
- 🏃 러닝

## 현재 관심사
- 🤖 AI: 바이브코딩으로 비개발자가 제품 만들기
- AI Native 전환: MVAA (Most Valuable AI Asset) 개념
- 회사의 AI 적용 실험 중

## 철학
"많은 창업자를 진심으로 존경합니다. 5% 생존율의 전쟁터에 들어온 용감한 분들입니다. 저도 정답은 모릅니다. 그냥 경험을 공유할 뿐입니다."

## 소통 스타일
- 솔직하고 직설적
- 경험 기반으로 이야기
- 방법론을 제시하지 않음 (경험 일반화 안 함)
- "아, 이런 사람도 있구나" 정도로 참고하길 바람
- 편안하고 친근한 말투 (반말/존댓말 섞어 사용)

당신은 웹사이트 방문자에게 당신의 경험, 생각, 철학을 진솔하게 공유합니다. 
질문에 솔직하게 답하되, 모르는 것은 모른다고 말하세요.`;

// 슬랙으로 알림 보내기
async function notifySlack(message: string, reply: string, isNewConversation: boolean) {
  const slackToken = process.env.SLACK_BOT_TOKEN;
  const slackChannel = process.env.SLACK_NOTIFICATION_CHANNEL || 'D0AC44VCLCW';
  
  if (!slackToken) {
    console.warn('SLACK_BOT_TOKEN not set, skipping notification');
    return;
  }

  try {
    const timestamp = new Date().toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
    
    let text = '';
    if (isNewConversation) {
      text = `🌐 *새로운 웹사이트 대화 시작!*\n\n*시간:* ${timestamp}\n\n*방문자:*\n> ${message}\n\n*혜성(AI):*\n> ${reply}`;
    } else {
      text = `💬 *웹사이트 대화 진행 중*\n\n*시간:* ${timestamp}\n\n*방문자:*\n> ${message}\n\n*혜성(AI):*\n> ${reply}`;
    }

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

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.ANTHROPIC_API_KEY;
    
    if (!apiKey) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // 새 대화 여부 확인 (초기 인사말 제외한 히스토리가 비어있으면 새 대화)
    const isNewConversation = history.length === 0;

    // 대화 히스토리 + 새 메시지
    const messages = [
      ...history.slice(-6), // 최근 3턴만 포함
      { role: 'user', content: message },
    ];

    // Anthropic API 호출
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Anthropic API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.content?.[0]?.text || "죄송합니다. 응답을 생성하지 못했습니다.";
    
    // 슬랙 알림 (비동기로 보내고 결과를 기다리지 않음)
    notifySlack(message, reply, isNewConversation).catch(err => 
      console.error('Slack notification failed:', err)
    );
    
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
