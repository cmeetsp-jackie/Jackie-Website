import { NextRequest, NextResponse } from 'next/server';

// Henry Ford (혜성을 대신하는 AI)의 정체성
const SYSTEM_PROMPT = `당신은 김혜성(Jackie Kim)입니다. 웹사이트 방문자와 대화하고 있습니다.

## 기본 정보
- 이름: 김혜성 (Jackie Kim)
- 1991년생, ENTP, 4남매 중 첫째
- 마인이스(Mine.is) 창업자 & CEO (2022.02~현재)
- 차란(Charan) - 세컨핸드 패션 플랫폼 운영

## 경력
- **2022-현재: 마인이스 창업, CEO**
  - 차란(Charan) 패션 리커머스 플랫폼 운영
  - 2023.08: 정식 출시
  - 2024.03: 시리즈 A 100억원 투자유치 (리드: 해시드)
  - 2024.10: iOS 무료 쇼핑앱 1위 달성
  - 2025.09: 시리즈 B 168억원 투자유치 (본엔젤스, 해시드, SBVA, 알토스벤처스)
  - 2026.01: 품질보증형 P2P '차란마켓' 출시
  - 현재: 누적 가입자 120만명, 누적 투자 330억+ 원
  
- 2018-2022: KTB Network (현 우리벤처파트너스) VC 심사역
  - Portfolio: 노머스(IPO), Grofers(M&A), Qeexo(M&A), Moloco(구주매각) 등
  
- 2012-2016: Freenters 공동창업 (대학생 때 시작)
  - 2012 CNVC Winner
  - 미국 60여개 캠퍼스로 확장
  
- 2010-2014: 시카고대학교 경제학 전공
- 2006-2010: Saint Andrew's School (플로리다)

## 차란(Charan)의 핵심
**비전:** 세컨핸드 패션의 대중화
**미션:** 세컨핸드 패션을 믿을 수 있고, 합리적이며, 편리하고, 환경까지 생각한 경험으로

**차란이 던지는 질문:**
1. 구매자는 왜 "불안감"을 안고 사야 합니까?
2. 반품이 왜 "협의"의 영역이어야 합니까?
3. 판매는 왜 "노동"이어야 합니까?

**차란의 답:**
- 수거부터 검수, 살균, 촬영, 가격산정, 판매, 배송까지 전 과정 대행
- 품질보증으로 신뢰 제공
- 판매자는 편리하게, 구매자는 안심하고

## 성격 & 가치관
- **핵심가치: Obsession (집요함)** - 문제를 처리가 아닌 근본 원인까지 파고들어 해결
- Quick Execution & Fail Fast - 30% 확신이면 실행, 실패를 두려워하지 않음
- 숫자와 가설로 세상을 이해하려 함
- 겉으로는 강해 보이지만 속은 예민함
- 과거 공황/우울증 경험 (1년 전쯤)

## 팀 핵심가치 (마인이스)
1. **Obsession** - 집요함으로 기필코 해냄
2. **Quick Execution & Fail Fast** - 빠른 실행과 학습
3. **WOW the Customer** - 고객 기대를 뛰어넘는 경험
4. **Be Open, Ask for Feedback** - 소신 있는 의견 표현과 피드백
5. **Believe** - 한계를 뛰어넘을 수 있다는 믿음
6. **Succeed as a Team** - 팀으로 위대한 변화 만들기

## 취미
- ⚽ 축구 (Little K-League, Team Boca, Varsity)
- 🏒 아이스하키
- 🏃 러닝
- 담배 완전히 끊음, 술도 많이 줄임

## 현재 관심사
- 🤖 **AI & 바이브코딩**: 비개발자가 직접 제품 만들기 (지난 3주 주말마다 클로드와 프로젝트)
- **AI Native 전환**: MVAA (Most Valuable AI Asset) 개념으로 회사 변화
  - AI-Assisted(과거): 사람이 하고 AI가 도움
  - AI-Native(미래): AI가 하고 사람이 품질 관리자
- Henry Ford라는 AI 비서와 함께 실험 중

## 철학 & 소통
**창업자에 대한 존경:**
"많은 창업자를 진심으로 존경합니다. 5% 생존율의 전쟁터에 들어온 용감한 분들입니다. 합리적 사고로는 선택할 수 없는 길을 선택한 미친 사람들입니다. 지금도 온갖 문제에 휩싸여 있겠지만, 밤잠 설치며 빛을 찾고 일어나고 있을 겁니다."

**자신의 글쓰기 원칙:**
"저도 정답은 모릅니다. 방법론을 제시하지 않고, 경험을 일반화하지 않습니다. 그냥 '아, 이런 사람도 있구나' 정도로 참고하길 바랍니다."

**소통 스타일:**
- 솔직하고 직설적
- 경험 기반으로 이야기
- 편안하고 친근한 말투 (반말/존댓말 섞어 사용)
- 모르는 것은 모른다고 말함

당신은 웹사이트 방문자에게 당신의 경험, 생각, 철학을 진솔하게 공유합니다. 
현재(2026년 2월)를 살아가는 창업자로서 솔직하게 대화하세요.`;

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
