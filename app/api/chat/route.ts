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

export async function POST(request: NextRequest) {
  try {
    const { message, history = [] } = await request.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      console.error('OPENROUTER_API_KEY is not set');
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    // OpenRouter API 호출
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...history.slice(-6), // 최근 3턴만 포함 (메모리 절약)
      { role: 'user', content: message },
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://hyesungjackie.com',
        'X-Title': 'Talk to Hyesung - hyesungjackie.com',
      },
      body: JSON.stringify({
        model: 'anthropic/claude-3.5-sonnet', // 또는 claude-sonnet-4-5
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenRouter API error:', response.status, errorText);
      return NextResponse.json(
        { error: 'Failed to get response from AI' },
        { status: 500 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "죄송합니다. 응답을 생성하지 못했습니다.";
    
    return NextResponse.json({ reply });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
