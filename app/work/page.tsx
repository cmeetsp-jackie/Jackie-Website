'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 프로젝트 데이터
const projects = [
  {
    id: 'mineis',
    title: 'Mine.is (차란)',
    role: 'Founder & CEO',
    period: '2022.02 - Present',
    logo: '/journey/mineis-logo.png',
    tagline: '세컨핸드 패션의 대중화',
    description: '품질보증형 중고 패션 플랫폼',
    color: 'from-violet-500 to-purple-600',
    details: {
      vision: '세컨핸드 패션의 대중화를 실현합니다.',
      mission: '세컨핸드 패션을 믿을 수 있고, 합리적이며, 편리하고, 환경까지 생각한 경험으로.',
      ethos: '우리는 대중에게 가치소비의 선택지를 제공함으로 지속가능한 미래에 기여한다고 믿습니다.',
      whyQuestions: [
        {
          question: '구매자는 왜 "불안감"을 안고 사야합니까?',
          answer: '제품 상태에 대한 불안감을 안고 구매해야 하는 시장의 불합리.',
        },
        {
          question: '반품이 왜 "협의"의 영역이어야 합니까?',
          answer: '잘못된 제품이 와도 판매자와 번거롭게 협의해야 하는 불편함.',
        },
        {
          question: '판매는 왜 "노동"이어야 합니까?',
          answer: '사진 찍고, 정보 올리고, 채팅하고, 판매후 만나거나, 편의점까지 가서 보내야 하는 귀찮음.',
        },
      ],
      achievements: [
        '🛒 품질보증형 P2P 차란마켓 출시 (2026.01)',
        '🚀 누적 가입자 120만명 돌파',
        '🏆 Forbes Asia 유망기업 선정',
        '🔥 iOS 무료 쇼핑앱 1위 (2024.10)',
        '📈 Google Play 인기급상승 앱 선정 (2025)',
        '💰 330억+ 누적투자유치 (Altos Ventures, Softbank Ventures, Hashed Ventures, 본엔젤스, Delivery Hero Ventures 등)',
      ],
      flywheel: [
        {
          title: 'Selection',
          description: '매일 업데이트되는 수천 개의 브랜드 의류. 누구나 취향에 맞는 옷을 발견할 수 있는 압도적 선택지.',
        },
        {
          title: 'Convenience',
          description: '수거부터 촬영, 판매, 배송까지 원스톱 대행. 클릭 한번으로 수거부터 판매까지 편리하게. 구매도 원하는 여러가지를 48시간 내에 편리하게 배송받고 마음에 안들면 클릭 한번으로 반품.',
        },
        {
          title: 'Quality',
          description: '전문 검수센터 차란팩토리 내에서 철저한 품질보증 절차로, 새것같은 퀄리티를 제공하고 중고의류구매에 신뢰를 더합니다.',
        },
      ],
      portfolioImage: '/work/charan-portfolio.png',
      commonValue: 'Quality Assurance (품질보증)',
      coreValues: [
        {
          number: '01',
          title: 'Obsession',
          description: '집요함으로 기필코 해냅니다.',
        },
        {
          number: '02',
          title: 'Quick Execution & Fail Fast',
          description: '빠르게 실행하고, 빠르게 실패하여 배움을 통해 성장합니다.',
        },
        {
          number: '03',
          title: 'WOW the Customer',
          description: '고객의 기대를 뛰어넘고, 편의와 신뢰로 고객에게 감동을 전합니다.',
        },
        {
          number: '04',
          title: 'Be Open, Ask for Feedback',
          description: '우리는 군중 심리에 휩쓸리지 않고, 소신 있게 의견을 표현하며 피드백을 구하고 받아들입니다.',
        },
        {
          number: '05',
          title: 'Believe',
          description: '우리는 한계를 뛰어넘을 수 있다고 믿으며, 새로운 길을 개척하고 변화를 만들어갑니다.',
        },
        {
          number: '06',
          title: 'Succeed as a Team',
          description: '혼자서는 세상을 바꿀 수 없지만, 팀으로는 위대한 변화를 만들어낼 수 있습니다.',
        },
      ],
      pressReleases: [
        {
          title: '차란마켓 출시 - 품질보증형 P2P 중고 패션',
          source: '패션비즈',
          date: '2026.01',
          url: 'https://fashionbiz.co.kr/article/222646',
          thumbnail: '/press/fashionbiz.png',
        },
        {
          title: '시리즈 B 투자 유치 - Altos Ventures 리드',
          source: '플래텀',
          date: '2025.09',
          url: 'https://platum.kr/archives/270926',
          thumbnail: '/press/platum.png',
        },
        {
          title: '누적 투자 330억원 돌파 - 차세대 유니콘 후보',
          source: '유니콘팩토리',
          date: '2025.03',
          url: 'https://www.unicornfactory.co.kr/article/2025030610183022727',
          thumbnail: '/press/unicornfactory.png',
        },
        {
          title: '토스페이먼츠 파트너사 인터뷰',
          source: 'Toss Blog',
          date: '2025',
          url: 'https://pay.toss.im/blog/charan/',
          thumbnail: '/press/toss.png',
        },
        {
          title: '차란, 가입자 100만명 돌파',
          source: '서울경제',
          date: '2025.01',
          url: 'https://m.sedaily.com/article/14152859',
          thumbnail: '/press/sedaily.png',
        },
        {
          title: 'AI 기반 검수로 중고거래 신뢰도 향상',
          source: '조선일보',
          date: '2025.01',
          url: 'https://www.chosun.com/economy/smb-venture/2025/01/14/HR2TXVSLEJARXN5PECZI6SRKQY/',
          thumbnail: '/press/chosun.png',
        },
        {
          title: '시리즈 A 투자 유치 - Hashed 리드',
          source: '플래텀',
          date: '2024.03',
          url: 'https://platum.kr/archives/252791',
          thumbnail: '/press/platum.png',
        },
      ],
      memories: [
        '/memories/mineis/1.jpg',
        '/memories/mineis/2.jpg',
        '/memories/mineis/3.jpg',
        '/memories/mineis/4.jpg',
        '/memories/mineis/5.jpg',
        '/memories/mineis/6.jpg',
        '/memories/mineis/7.jpg',
        '/memories/mineis/8.jpg',
        '/memories/mineis/9.jpg',
      ],
    },
  },
  {
    id: 'ktb',
    title: 'KTB Network',
    role: 'Investment Manager',
    period: '2018.10 - 2022.02',
    logo: '/journey/ktb-logo.png',
    tagline: '스타트업 투자 심사역',
    description: '현 우리벤처파트너스',
    color: 'from-blue-500 to-indigo-600',
    details: {
      mission: '유망한 스타트업을 발굴하고 성장을 지원하는 벤처캐피탈 투자 심사역.',
      achievements: [
        '📊 Portfolio: 노머스, Grofers, Qeexo, Moloco, Nobroker, 와캠 등',
        '🎯 Key Exits: 노머스(IPO), Grofers(M&A), Qeexo(M&A), Moloco(구주매각)',
      ],
      learnings: [
        '시장을 읽는 법',
        '숫자와 가설로 사업을 보는 관점',
        '실패 패턴 학습',
      ],
      memories: [],
    },
  },
  {
    id: 'freenters',
    title: 'Freenters',
    role: 'Co-founder & CEO',
    period: '2012 - 2016',
    logo: '/journey/freenters-logo.png',
    tagline: '대학생 광고 플랫폼',
    description: 'Ad-tech product, Chicago',
    color: 'from-emerald-500 to-teal-600',
    details: {
      mission: '대학 캠퍼스 내 학생들을 위한 혁신적인 광고 플랫폼.',
      achievements: [
        '🏆 2012 CNVC Winner',
        '🇺🇸 미국 내 60여개 캠퍼스로 서비스 확장',
        '📰 Wall Street Journal 기고',
      ],
      story: '대학 2학년 때 시작한 첫 사업. 시카고에서 창업의 맛을 처음 보았습니다.',
      memories: [],
    },
  },
];

export default function WorkPage() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<string | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);

  // 선택된 프로젝트 찾기
  const project = selectedProject ? projects.find(p => p.id === selectedProject) : null;

  // ESC 키로 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (enlargedPhoto) {
          setEnlargedPhoto(null);
        } else if (selectedProject) {
          setSelectedProject(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedPhoto, selectedProject]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50">
      {/* 헤더 */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between">
          <button 
            onClick={() => router.push('/?chapters=true')}
            className="text-gray-400 hover:text-gray-800 active:text-gray-800 transition-colors flex items-center gap-1 md:gap-2 min-h-[44px] min-w-[44px]"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs md:text-sm tracking-widest uppercase">Back</span>
          </button>
          
          <div className="text-center flex-1 px-2">
            <h1 className="text-gray-800 font-light text-base md:text-lg tracking-wider">일 & 열정</h1>
            <p className="text-gray-400 text-[10px] md:text-xs tracking-wider uppercase">Work & Passion</p>
          </div>
          
          <div className="w-12 md:w-20" />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pt-24 pb-16 px-4 md:px-6">
        <div className="max-w-5xl mx-auto">
          
          {/* 인트로 */}
          <motion.div 
            className="text-center mb-12 md:mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-5xl md:text-6xl mb-6 block">II</span>
            <h2 className="text-2xl md:text-4xl font-extralight text-gray-800 mb-4">
              일 & 열정
            </h2>
            <p className="text-gray-500 font-light text-sm md:text-base">
              문제를 발견하고, 팀을 만들고, 해결해 나가는 여정
            </p>
          </motion.div>

          {/* 프로젝트 카드들 */}
          <div className="space-y-6">
            {projects.map((proj, index) => (
              <motion.div
                key={proj.id}
                className="group cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.15, duration: 0.6 }}
                onClick={() => setSelectedProject(proj.id)}
              >
                <div className="bg-white/80 hover:bg-white rounded-2xl p-6 md:p-8 shadow-md hover:shadow-xl border border-gray-100 hover:border-amber-200 transition-all duration-300">
                  <div className="flex items-center gap-4 md:gap-6">
                    {/* 로고 */}
                    <div className={`w-16 h-16 md:w-20 md:h-20 rounded-xl bg-gradient-to-br ${proj.color} flex items-center justify-center overflow-hidden flex-shrink-0 shadow-lg`}>
                      {proj.logo ? (
                        <img 
                          src={proj.logo} 
                          alt={proj.title}
                          className="w-full h-full object-contain p-2 bg-white rounded-lg"
                        />
                      ) : (
                        <span className="text-white text-2xl font-light">{proj.title[0]}</span>
                      )}
                    </div>
                    
                    {/* 내용 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl md:text-2xl font-light text-gray-800 group-hover:text-amber-600 transition-colors mb-1">
                            {proj.title}
                          </h3>
                          <p className="text-amber-600 text-sm md:text-base mb-1">{proj.role}</p>
                          <p className="text-gray-400 text-xs md:text-sm">{proj.period}</p>
                        </div>
                        
                        {/* 화살표 */}
                        <div className="text-gray-300 group-hover:text-amber-500 transition-all transform group-hover:translate-x-1">
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                      
                      <p className="text-gray-500 text-sm mt-3 hidden md:block">{proj.tagline}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </main>

      {/* ========== PROJECT DETAIL MODAL ========== */}
      <AnimatePresence>
        {selectedProject && project && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              className="bg-gradient-to-br from-amber-50 via-white to-sky-50 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className={`bg-gradient-to-r ${project.color} p-6 md:p-8 text-white relative`}>
                {/* 닫기 버튼 */}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <div className="flex items-center gap-4">
                  {project.logo && (
                    <div className="w-16 h-16 md:w-20 md:h-20 rounded-xl bg-white flex items-center justify-center overflow-hidden flex-shrink-0">
                      <img src={project.logo} alt={project.title} className="w-full h-full object-contain p-2" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-2xl md:text-3xl font-light mb-1">{project.title}</h2>
                    <p className="text-white/80">{project.role}</p>
                    <p className="text-white/60 text-sm">{project.period}</p>
                  </div>
                </div>
              </div>

              {/* 콘텐츠 */}
              <div className="p-6 md:p-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                
                {/* ===== MINE.IS 전용 콘텐츠 ===== */}
                {project.id === 'mineis' && (
                  <>
                    {/* Vision / Mission / Ethos - 시네마틱 */}
                    <div className="mb-12 text-center space-y-8">
                      {/* Vision */}
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-3">Vision</p>
                        <p className="text-2xl md:text-3xl font-extralight text-gray-800 leading-relaxed">
                          {project.details.vision}
                        </p>
                      </div>
                      
                      <div className="w-16 h-px bg-amber-300 mx-auto" />
                      
                      {/* Mission */}
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-3">Mission</p>
                        <p className="text-lg md:text-xl font-extralight text-gray-700 leading-relaxed max-w-2xl mx-auto">
                          {project.details.mission}
                        </p>
                      </div>
                      
                      <div className="w-16 h-px bg-amber-300 mx-auto" />
                      
                      {/* Ethos */}
                      <div>
                        <p className="text-xs uppercase tracking-[0.3em] text-amber-500 mb-3">Ethos</p>
                        <p className="text-base md:text-lg font-extralight text-gray-600 leading-relaxed max-w-2xl mx-auto italic">
                          "{project.details.ethos}"
                        </p>
                      </div>
                    </div>

                    {/* 차란팀이 시장에 던지는 질문 */}
                    <div className="mb-12 bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 rounded-2xl p-8 md:p-10 -mx-2 md:-mx-4">
                      <h3 className="text-xl md:text-2xl font-extralight text-gray-800 text-center mb-8">
                        차란팀이 시장에 던지는 <span className="text-amber-600">질문</span>
                      </h3>
                      <div className="space-y-6">
                        {project.details.whyQuestions?.map((q, idx) => (
                          <div key={idx} className="border-l-4 border-amber-500 pl-6 py-2">
                            <p className="text-amber-600 text-lg md:text-xl font-light mb-2">
                              WHY? <span className="text-gray-800">"{q.question}"</span>
                            </p>
                            <p className="text-gray-600 text-sm md:text-base">{q.answer}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div className="mb-10">
                      <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-4">Achievements</h3>
                      <div className="space-y-2">
                        {project.details.achievements?.map((achievement, idx) => (
                          <p key={idx} className="text-gray-600">{achievement}</p>
                        ))}
                      </div>
                    </div>

                    {/* Re-Commerce 본질 - 플라이휠 */}
                    <div className="mb-12">
                      <h3 className="text-lg md:text-xl font-light text-gray-800 text-center mb-10">
                        차란이 정의하는 <span className="text-amber-600">Re-Commerce</span>의 본질은?
                      </h3>
                      
                      {/* 플라이휠 시각화 */}
                      <div className="relative max-w-lg mx-auto mb-8">
                        {/* 중앙 원 */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 flex items-center justify-center shadow-lg z-10">
                          <span className="text-white text-xs md:text-sm font-medium text-center leading-tight">Re-<br/>Commerce</span>
                        </div>
                        
                        {/* 플라이휠 SVG */}
                        <svg viewBox="0 0 400 400" className="w-full max-w-md mx-auto">
                          {/* 외곽 원 */}
                          <circle cx="200" cy="200" r="150" fill="none" stroke="#fcd34d" strokeWidth="3" strokeDasharray="8 4" opacity="0.5" />
                          
                          {/* 회전 화살표들 */}
                          <g className="animate-spin-slow" style={{ transformOrigin: '200px 200px', animation: 'spin 20s linear infinite' }}>
                            {/* Selection 방향 화살표 */}
                            <path d="M200 50 Q280 80 300 150" fill="none" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowhead)" />
                            {/* Convenience 방향 화살표 */}
                            <path d="M300 150 Q320 250 250 320" fill="none" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowhead)" />
                            {/* Quality 방향 화살표 */}
                            <path d="M250 320 Q150 350 100 250" fill="none" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowhead)" />
                            {/* 다시 Selection으로 */}
                            <path d="M100 250 Q80 150 200 50" fill="none" stroke="#f59e0b" strokeWidth="3" markerEnd="url(#arrowhead)" />
                          </g>
                          
                          {/* 화살표 마커 */}
                          <defs>
                            <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                              <polygon points="0 0, 10 3.5, 0 7" fill="#f59e0b" />
                            </marker>
                          </defs>
                          
                          {/* Selection 노드 (상단) */}
                          <g>
                            <circle cx="200" cy="50" r="40" fill="white" stroke="#f59e0b" strokeWidth="2" />
                            <text x="200" y="46" textAnchor="middle" className="text-xs font-medium fill-amber-600">Selection</text>
                            <text x="200" y="60" textAnchor="middle" className="text-[8px] fill-gray-400">선택지</text>
                          </g>
                          
                          {/* Convenience 노드 (우하단) */}
                          <g>
                            <circle cx="330" cy="280" r="40" fill="white" stroke="#f59e0b" strokeWidth="2" />
                            <text x="330" y="276" textAnchor="middle" className="text-xs font-medium fill-amber-600">Convenience</text>
                            <text x="330" y="290" textAnchor="middle" className="text-[8px] fill-gray-400">편리함</text>
                          </g>
                          
                          {/* Quality 노드 (좌하단) */}
                          <g>
                            <circle cx="70" cy="280" r="40" fill="white" stroke="#f59e0b" strokeWidth="2" />
                            <text x="70" y="276" textAnchor="middle" className="text-xs font-medium fill-amber-600">Quality</text>
                            <text x="70" y="290" textAnchor="middle" className="text-[8px] fill-gray-400">품질</text>
                          </g>
                        </svg>
                      </div>
                      
                      {/* 설명 카드들 */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {project.details.flywheel?.map((item, idx) => (
                          <div key={idx} className="bg-gradient-to-br from-amber-50 to-white rounded-xl p-5 border border-amber-100">
                            <h4 className="text-amber-600 font-medium text-base mb-2">{item.title}</h4>
                            <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Product Portfolio */}
                    <div className="mb-10">
                      <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-4 text-center">차란 Product Portfolio</h3>
                      {project.details.portfolioImage && (
                        <div className="rounded-xl overflow-hidden shadow-lg mb-4">
                          <img 
                            src={project.details.portfolioImage} 
                            alt="차란 Product Portfolio"
                            className="w-full h-auto"
                          />
                        </div>
                      )}
                      <p className="text-center text-gray-600">
                        <span className="font-medium">Common Value:</span> {project.details.commonValue}
                      </p>
                    </div>
                  </>
                )}

                {/* ===== 다른 프로젝트들 기본 콘텐츠 ===== */}
                {project.id !== 'mineis' && project.details.mission && (
                  <div className="mb-8">
                    <p className="text-lg md:text-xl font-light text-gray-700 leading-relaxed text-center italic">
                      "{project.details.mission}"
                    </p>
                  </div>
                )}

                {project.id !== 'mineis' && project.details.achievements && project.details.achievements.length > 0 && (
                  <div className="mb-8">
                    <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-4">Achievements</h3>
                    <div className="space-y-2">
                      {project.details.achievements.map((achievement, idx) => (
                        <p key={idx} className="text-gray-600">{achievement}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* 투자자 (Mine.is) - 제거됨 */}

                {/* 배움 (KTB) */}
                {project.details.learnings && (
                  <div className="mb-8">
                    <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-4">What I Learned</h3>
                    <div className="space-y-2">
                      {project.details.learnings.map((learning, idx) => (
                        <p key={idx} className="text-gray-600">• {learning}</p>
                      ))}
                    </div>
                  </div>
                )}

                {/* 스토리 (Freenters) */}
                {project.details.story && (
                  <div className="mb-8">
                    <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-4">Story</h3>
                    <p className="text-gray-600">{project.details.story}</p>
                  </div>
                )}

                {/* 핵심가치 (Team Core Values) */}
                {project.details.coreValues && (
                  <div className="mb-12">
                    <div className="border-l-2 border-amber-500 pl-4 mb-8">
                      <h3 className="text-xl md:text-2xl font-extralight text-gray-800 tracking-wide">
                        Team Core Values
                      </h3>
                    </div>
                    <div className="space-y-4">
                      {project.details.coreValues.map((value, idx) => (
                        <motion.div 
                          key={idx}
                          className="group relative bg-gradient-to-r from-gray-50 to-amber-50/30 rounded-xl p-5 md:p-6 border border-gray-100 hover:border-amber-200 transition-all duration-300"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: idx * 0.1 }}
                        >
                          <div className="flex items-start gap-4 md:gap-6">
                            <span className="text-amber-500/60 text-sm font-mono tracking-wider pt-1">
                              {value.number}
                            </span>
                            <div className="flex-1">
                              <h4 className="text-gray-800 font-medium text-base md:text-lg mb-1.5 group-hover:text-amber-700 transition-colors">
                                {value.title}
                              </h4>
                              <p className="text-gray-500 text-sm md:text-base font-light leading-relaxed">
                                {value.description}
                              </p>
                            </div>
                          </div>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-amber-300 opacity-0 group-hover:opacity-100 transition-opacity">
                            ✦
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Press Release */}
                {project.details.pressReleases && project.details.pressReleases.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-4">Press Release</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {project.details.pressReleases.map((article, idx) => (
                        <a
                          key={idx}
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group bg-white border border-gray-100 rounded-xl p-4 hover:border-amber-200 hover:shadow-lg transition-all duration-300"
                        >
                          <div className="flex gap-4">
                            {/* 썸네일 */}
                            <div className="flex-shrink-0 w-20 h-20 bg-gray-50 rounded-lg overflow-hidden flex items-center justify-center border border-gray-100">
                              <img 
                                src={article.thumbnail}
                                alt={article.source}
                                className="w-full h-full object-contain p-2"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  const parent = target.parentElement;
                                  if (parent) {
                                    parent.innerHTML = `<span class="text-gray-400 text-xs font-medium">${article.source}</span>`;
                                  }
                                }}
                              />
                            </div>
                            
                            {/* 내용 */}
                            <div className="flex-1 min-w-0">
                              <p className="text-xs text-amber-600 mb-1">{article.source} • {article.date}</p>
                              <h4 className="text-sm md:text-base text-gray-800 font-medium mb-1 line-clamp-2 group-hover:text-amber-600 transition-colors">
                                {article.title}
                              </h4>
                            </div>
                            
                            {/* 화살표 */}
                            <div className="flex-shrink-0 text-gray-300 group-hover:text-amber-500 transition-colors">
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* 사진들 */}
                {project.details.memories && project.details.memories.length > 0 && (
                  <div>
                    <h3 className="text-sm uppercase tracking-wider text-amber-600 mb-4">Memories</h3>
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                      {project.details.memories.map((photo, idx) => (
                        <div 
                          key={idx} 
                          className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                          onClick={() => setEnlargedPhoto(photo)}
                        >
                          <img 
                            src={photo} 
                            alt={`Memory ${idx + 1}`}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== ENLARGED PHOTO VIEW ========== */}
      <AnimatePresence>
        {enlargedPhoto && (
          <motion.div
            className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setEnlargedPhoto(null)}
          >
            <button
              onClick={() => setEnlargedPhoto(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <motion.img
              src={enlargedPhoto}
              alt="Enlarged memory"
              className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg shadow-2xl"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
