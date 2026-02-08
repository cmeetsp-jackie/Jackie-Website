'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Life Journey 타임라인 데이터
const lifeEvents = [
  {
    id: 'mineis',
    period: '2022.02 - Present',
    title: 'Mine.is (차란)',
    role: 'Founder & CEO',
    subtitle: '리커머스 "차란"',
    logo: '/journey/mineis-logo.png',
    highlights: [
      { text: '🛒 품질보증형 P2P 차란마켓 출시 (2026.01)', link: 'https://fashionbiz.co.kr/article/222646' },
      { text: '🚀 누적 가입자 120만명 돌파', link: 'https://www.hankyung.com/article/202509178697i' },
      { text: '🏆 Forbes Asia 유망기업 선정', link: 'https://www.etnews.com/20240828000260' },
      { text: '🔥 iOS 무료 쇼핑앱 1위 (2024.10)', link: 'https://fashionbiz.co.kr/article/211203' },
      { text: '📈 Google Play 인기급상승 앱 선정 (2025)', link: 'https://blog.google/intl/ko-kr/products/android-play-hardware/googleplay-best-of-2025/' },
      { text: '💰 330억+ 누적투자유치 (Altos Ventures, Softbank Ventures, Hashed Ventures, 본엔젤스, Delivery Hero Ventures 등)', link: 'https://www.unicornfactory.co.kr/article/2025091710040669336' },
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
  {
    id: 'ktb',
    period: '2018.10 - 2022.02',
    title: 'KTB Network',
    role: 'Investment Manager',
    subtitle: '현 우리벤처파트너스',
    logo: '/journey/ktb-logo.png',
    highlights: [
      { text: '📊 Portfolio: 노머스, Grofers, Qeexo, Moloco, Nobroker, 와캠 등' },
      { text: '🎯 Key Exits: 노머스(IPO), Grofers(M&A), Qeexo(M&A), Moloco(구주매각)' },
    ],
    memories: [],
  },
  {
    id: 'military',
    period: '2016 - 2018',
    title: 'Military Service',
    role: 'Social Service Agent',
    subtitle: '',
    logo: null,
    highlights: [],
    memories: [],
  },
  {
    id: 'freenters',
    period: '2012 - 2016',
    title: 'Freenters',
    role: 'Co-founder & CEO',
    subtitle: 'Ad-tech product, Chicago',
    logo: '/journey/freenters-logo.png',
    highlights: [
      { text: '🏆 2012 CNVC Winner' },
      { text: '🇺🇸 미국 내 60여개 캠퍼스로 서비스 확장' },
      { text: '📰 Wall Street Journal 기고', link: 'https://www.wsj.com/articles/BL-KRTB-5560' },
    ],
    memories: [],
  },
  {
    id: 'uchicago',
    period: '2010 - 2014',
    title: 'University of Chicago',
    role: 'B.A. in Economics',
    subtitle: '경제학과 졸',
    logo: '/journey/uchicago-logo.png',
    highlights: [],
    memories: [],
  },
  {
    id: 'standrews',
    period: '2006 - 2010',
    title: "Saint Andrew's School",
    role: 'Boca Raton, FL, USA',
    subtitle: '',
    logo: '/journey/standrews-logo.png',
    highlights: [],
    memories: [],
  },
  {
    id: 'childhood',
    period: '1991 - 2005',
    title: 'Global Childhood',
    role: 'Korea → New Zealand → US → Korea',
    subtitle: '',
    logo: null,
    highlights: [],
    memories: [],
  },
];

// 섹션 정보
const sections = [
  {
    id: 'family',
    korean: 'Family Foundation',
    english: '가족 기반',
    icon: '👨‍👩‍👧‍👦',
  },
  {
    id: 'interest',
    korean: '관심사 & 취미 & 잡생각',
    english: 'Interest & Thoughts',
    icon: '🎯',
  },
  {
    id: 'spiritual',
    korean: 'Spiritual Compass',
    english: '영적 나침반',
    icon: '🧭',
  },
  {
    id: 'journey',
    korean: 'Life Journey',
    english: '인생 여정',
    icon: '📅',
  },
];

export default function OriginPage() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [viewingMemory, setViewingMemory] = useState<string | null>(null);
  const [enlargedPhoto, setEnlargedPhoto] = useState<string | null>(null);
  const [interestTab, setInterestTab] = useState<'hobby' | 'thoughts'>('hobby');
  
  // 현재 보고 있는 메모리의 이벤트 찾기
  const memoryEvent = viewingMemory ? lifeEvents.find(e => e.id === viewingMemory) : null;

  // ESC 키로 모달 닫기
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (enlargedPhoto) {
          setEnlargedPhoto(null);
        } else if (viewingMemory) {
          setViewingMemory(null);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [enlargedPhoto, viewingMemory]);

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
            <h1 className="text-gray-800 font-light text-base md:text-lg tracking-wider">삶 & 인생</h1>
            <p className="text-gray-400 text-[10px] md:text-xs tracking-wider uppercase">Origin & Story</p>
          </div>
          
          <div className="w-12 md:w-20" />
        </div>
      </header>

      {/* 메인 콘텐츠 */}
      <main className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          
          {/* 인트로 */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-6xl mb-6 block">I</span>
            <h2 className="text-3xl md:text-4xl font-extralight text-gray-800 mb-4">
              삶 & 인생
            </h2>
            <p className="text-gray-500 font-light">
              어디서 왔고, 무엇이 나를 만들었는가
            </p>
          </motion.div>

          {/* 섹션 그리드 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
            {sections.map((section, index) => (
              <motion.button
                key={section.id}
                onClick={() => setActiveSection(activeSection === section.id ? null : section.id)}
                className={`group relative bg-white/70 hover:bg-white border rounded-xl p-8 transition-all duration-500 shadow-sm hover:shadow-xl text-left ${
                  activeSection === section.id ? 'border-amber-400 ring-2 ring-amber-100' : 'border-gray-200 hover:border-amber-300'
                }`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1, duration: 0.6 }}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-3xl mb-4 block">{section.icon}</span>
                    <h3 className="text-gray-800 text-xl md:text-2xl font-light mb-2 group-hover:text-amber-600 transition-colors">
                      {section.korean}
                    </h3>
                    <p className="text-gray-400 text-sm tracking-wider">
                      {section.english}
                    </p>
                  </div>
                  <div className={`transition-transform duration-300 ${activeSection === section.id ? 'rotate-180' : ''}`}>
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>

          {/* 확장된 섹션 콘텐츠 */}
          <AnimatePresence>
            {activeSection === 'family' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-b from-amber-50/80 via-white to-sky-50/80 rounded-2xl p-8 md:p-12 mb-8 shadow-lg overflow-hidden border border-amber-100/50"
              >
                {/* 타이틀 */}
                <motion.div 
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-3xl md:text-4xl font-extralight text-gray-800 tracking-wide">Family Foundation</h3>
                </motion.div>
                
                {/* 가족 사진 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 items-center">
                  <motion.div 
                    className="flex items-center justify-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <img 
                      src="/family/family1.jpg" 
                      alt="가족사진" 
                      className="rounded-lg shadow-xl max-w-full h-auto"
                    />
                  </motion.div>
                  <motion.div 
                    className="rounded-lg overflow-hidden shadow-xl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <img 
                      src="/family/family2.jpg" 
                      alt="가족사진" 
                      className="w-full block"
                    />
                  </motion.div>
                </div>
                
                {/* 텍스트 */}
                <div className="max-w-3xl mx-auto px-2 md:px-0">
                  <motion.p
                    className="text-lg md:text-2xl font-extralight text-gray-800 leading-relaxed md:leading-loose text-center mb-6 md:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    3남1녀 사남매 중 <span className="text-amber-600 font-light">장남</span>으로,
                    <span className="hidden md:inline"><br /></span>{' '}
                    너무나 존경스러운 아버지와 사랑하는 어머니,
                    <span className="hidden md:inline"><br /></span>{' '}
                    그리고 3명의 동생들과 삶의 여정을 함께하고 있습니다.
                  </motion.p>
                  
                  <motion.div 
                    className="w-12 md:w-16 h-px bg-amber-300 mx-auto mb-6 md:mb-8"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ delay: 0.6, duration: 0.8 }}
                  />
                  
                  <motion.p
                    className="text-base md:text-xl font-extralight text-gray-600 leading-relaxed text-center mb-6 md:mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                  >
                    화목하고 서로 사랑하는 가정에서 태어난 것을{' '}
                    <span className="text-amber-600">큰 축복</span>으로 여기고
                    <span className="hidden md:inline"><br /></span>{' '}
                    감사한 마음을 가지고 살아가고 있습니다.
                  </motion.p>
                  
                  <motion.p
                    className="text-base md:text-xl font-extralight text-gray-600 leading-relaxed text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    부모님이 어릴때부터 저희 사남매를{' '}
                    <span className="text-amber-600">신앙과 사랑</span> 안에서 키우셨고,
                    <span className="hidden md:inline"><br /></span>{' '}
                    끊임없이 저와 저희 동생들의 인생에 여러 도전들을
                    <span className="hidden md:inline"><br /></span>{' '}
                    응원해주시고 지지해주셨습니다.
                  </motion.p>
                </div>
              </motion.div>
            )}

            {activeSection === 'interest' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-br from-white via-amber-50/30 to-white rounded-2xl p-6 md:p-10 mb-8 shadow-lg overflow-hidden border border-amber-100/50"
              >
                <h3 className="text-2xl md:text-3xl font-extralight text-gray-800 mb-6 text-center">🎯 관심사 & 취미 & 잡생각</h3>
                
                {/* 탭 네비게이션 */}
                <div className="flex gap-2 p-1 bg-gray-100/80 rounded-xl mb-8">
                  <button
                    onClick={() => setInterestTab('hobby')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      interestTab === 'hobby'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    🎮 취미
                  </button>
                  <button
                    onClick={() => setInterestTab('thoughts')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      interestTab === 'thoughts'
                        ? 'bg-white text-gray-800 shadow-sm'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    💭 관심사 & 잡생각
                  </button>
                </div>

                {/* 취미 탭 */}
                {interestTab === 'hobby' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    {/* 운동 카테고리 */}
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <span className="text-3xl">⚽</span>
                        <h4 className="text-xl md:text-2xl font-light text-gray-800">운동</h4>
                      </div>
                      
                      <div className="space-y-6 text-gray-600 font-light leading-relaxed">
                        <p>
                          어렸을 때부터 운동을 정말 좋아했어요. 특히 오랫동안 축구를 좋아했는데, 
                          초등학교 때 일기장을 보면 거의 축구 이야기밖에 없었어요. 
                          초등학교 내내 축구했던 기억뿐인 것 같을 정도에요.
                        </p>
                        <p>
                          어렸을 때 <span className="text-amber-600 font-medium">리틀 K-리그 성남 소속</span>으로도 활약했었고, 
                          브라질 호나우두를 우상처럼 생각하고 축구화도 같은 걸 사고 했던 기억이 있네요.
                        </p>
                        <p>
                          고등학교를 미국으로 넘어간 후 학교 축구부 대표(Varsity)를 9학년부터 12학년까지 했고, 
                          지역 축구부 <span className="text-amber-600 font-medium">Team Boca</span>에서도 활동했어요. 
                          고등학교 때는 거의 공부-축구, 이 두 개만 했던 것 같아요.
                        </p>
                        <p className="italic text-gray-500">
                          축구선수를 해볼까? 생각했던 적도 있고, 지금도 가끔 타임머신을 타고 과거로 돌아간다면 
                          커리어를 축구선수로 해보면 어떨까 상상하곤 해요.
                        </p>
                        <p>
                          마인이스를 시작하고 일이 바빠지면서 축구를 자주 못하고 있기는 한데, 
                          어렸을 때부터 같이 축구하던 팀이 있어서 종종 나가서 축구를 해요. 
                          생각해보니 24년, 25년은 정말 거의 축구를 못했네요..
                        </p>
                        <p className="text-amber-600 font-medium">
                          🎯 26년은 체력관리 차원에서라도 다시 나가서 축구 좀 하려고 합니다!
                        </p>
                      </div>

                      {/* 축구 사진들 */}
                      <div className="mt-8 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
                        {[
                          '/interests/soccer/IMG_7053.jpg',
                          '/interests/soccer/IMG_7047.jpg',
                          '/interests/soccer/IMG_7049.jpg',
                          '/interests/soccer/IMG_7050.jpg',
                          '/interests/soccer/IMG_7051.jpg',
                          '/interests/soccer/IMG_7052.jpg',
                          '/interests/soccer/IMG_7046.jpg',
                          '/interests/soccer/IMG_7048.jpg',
                          '/interests/soccer/IMG_7045.jpg',
                        ].map((photo, idx) => (
                          <div 
                            key={idx}
                            className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                            onClick={() => setEnlargedPhoto(photo)}
                          >
                            <img 
                              src={photo}
                              alt={`Soccer ${idx + 1}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        ))}
                      </div>

                      {/* 아이스하키 */}
                      <div className="mt-10 pt-8 border-t border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                          <span className="text-2xl">🏒</span>
                          <h5 className="text-lg md:text-xl font-light text-gray-700">아이스하키</h5>
                        </div>
                        <div className="space-y-4 text-gray-600 font-light leading-relaxed">
                          <p>
                            아이스하키도 어렸을 때부터 했어요. 초등학교 3학년 때쯤 아빠랑 같이 시작했는데, 
                            생각보다 너무 재밌었던 기억이 있어요.
                          </p>
                          <p>
                            유학 시절 동안은 아이스하키를 이어하지는 못했으나, 얼마 전 다시 시작했어요. 
                            24년도 중순쯤 시작했고, 25년은 너무 바빠서 못하다가 올해 다시 몇 번 해보려고 해요.
                          </p>
                        </div>
                        
                        {/* 아이스하키 사진들 */}
                        <div className="mt-6 grid grid-cols-3 gap-2">
                          {[
                            '/interests/hockey/IMG_3357.PNG',
                            '/interests/hockey/IMG_7054.jpg',
                            '/interests/hockey/IMG_2801.JPG',
                          ].map((photo, idx) => (
                            <div 
                              key={idx}
                              className="aspect-square rounded-lg overflow-hidden bg-gray-100 cursor-pointer"
                              onClick={() => setEnlargedPhoto(photo)}
                            >
                              <img 
                                src={photo}
                                alt={`Hockey ${idx + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 관심사 & 잡생각 탭 */}
                {interestTab === 'thoughts' && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="text-center py-12 text-gray-400"
                  >
                    <p className="text-4xl mb-4">💭</p>
                    <p className="italic">콘텐츠 준비 중...</p>
                  </motion.div>
                )}
              </motion.div>
            )}

            {activeSection === 'spiritual' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-b from-amber-50/80 via-white to-sky-50/80 rounded-2xl p-8 md:p-12 mb-8 shadow-lg overflow-hidden border border-amber-100/50"
              >
                {/* 타이틀 */}
                <motion.div 
                  className="text-center mb-10"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-3xl md:text-4xl font-extralight text-gray-800 tracking-wide">Spiritual Compass</h3>
                </motion.div>
                
                <div className="max-w-3xl mx-auto px-2 md:px-0">
                  {/* Isaiah 41:10 */}
                  <motion.blockquote
                    className="text-lg md:text-2xl font-extralight text-gray-800 leading-relaxed md:leading-loose text-center mb-4 italic"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    "두려워하지 말라 내가 너와 함께 함이라
                    <span className="hidden md:inline"><br /></span>{' '}
                    놀라지 말라 나는 네 하나님이 됨이라
                    <span className="hidden md:inline"><br /></span>{' '}
                    내가 너를 굳세게 하리라 참으로 너를 도와주리라
                    <span className="hidden md:inline"><br /></span>{' '}
                    참으로 나의 의로운 오른손으로 너를 붙들리라"
                  </motion.blockquote>
                  
                  <motion.p
                    className="text-sm md:text-base text-amber-600 text-center mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    — Isaiah 41:10
                  </motion.p>
                  
                </div>
              </motion.div>
            )}

            {activeSection === 'journey' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-gradient-to-b from-amber-50/80 via-white to-sky-50/80 rounded-2xl p-8 md:p-12 mb-8 shadow-lg overflow-hidden border border-amber-100/50"
              >
                {/* 타이틀 */}
                <motion.div 
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <h3 className="text-3xl md:text-4xl font-extralight text-gray-800 tracking-wide">Life Journey</h3>
                </motion.div>

                {/* 임팩트 문구 */}
                <motion.div 
                  className="max-w-3xl mx-auto mb-12 px-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <h4 className="text-sm md:text-base uppercase tracking-[0.3em] text-amber-600 text-center mb-6">
                    Hyesung's Life Philosophy
                  </h4>
                  <blockquote className="text-lg md:text-2xl font-extralight text-gray-700 leading-relaxed md:leading-loose text-center">
                    세상에 <span className="text-amber-600 font-light">도전</span>하고 부딪치며, 배우고 학습합니다.
                    <br className="hidden md:block" />{' '}
                    더 나은 내일을 위해 <span className="text-amber-600 font-light">후회 없는 오늘</span>을 보냅니다.
                  </blockquote>
                  
                  <div className="w-16 h-px bg-amber-300 mx-auto my-6" />
                  
                  <p className="text-base md:text-lg font-extralight text-gray-500 leading-relaxed text-center">
                    세상이 정의한 성공의 기준에 매몰되지 않고,
                    <br className="hidden md:block" />{' '}
                    나의 젊음과 열정이 정말 좋은 프로젝트에 쓰이고 있는지,
                    <br className="hidden md:block" />{' '}
                    나는 내가 하는 일에 <span className="text-amber-600">자부심</span>이 있는지를
                    <br className="hidden md:block" />{' '}
                    스스로에게 물어보고 커리어를 정하고 나아갑니다.
                  </p>
                </motion.div>
                
                {/* 타임라인 */}
                <div className="relative max-w-3xl mx-auto">
                  {/* 타임라인 선 */}
                  <div className="absolute left-4 md:left-6 top-0 bottom-0 w-px bg-gradient-to-b from-amber-300 via-amber-200 to-sky-200" />
                  
                  {/* 이벤트들 */}
                  <div className="space-y-8">
                    {lifeEvents.map((event, index) => (
                      <motion.div 
                        key={index} 
                        className="relative pl-12 md:pl-16"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + index * 0.1 }}
                      >
                        {/* 점 */}
                        <div className="absolute left-2 md:left-4 top-3 w-4 h-4 bg-amber-400 rounded-full border-4 border-white shadow-md" />
                        
                        {/* 기간 */}
                        <p className="text-amber-600 text-sm font-medium mb-2 tracking-wider">{event.period}</p>
                        
                        {/* 카드 */}
                        <div className="bg-white/80 rounded-xl p-4 md:p-6 shadow-md border border-gray-100 hover:shadow-lg transition-shadow">
                          {/* 모바일: 세로 레이아웃, 데스크탑: 가로 레이아웃 */}
                          <div className="flex flex-col md:flex-row md:items-start gap-3 md:gap-4">
                            {/* 로고 + 제목 영역 */}
                            <div className="flex items-start gap-3 flex-1 min-w-0">
                              {/* 로고 */}
                              {event.logo && (
                                <div className="w-10 h-10 md:w-14 md:h-14 rounded-lg bg-gray-50 flex items-center justify-center overflow-hidden flex-shrink-0 border border-gray-100">
                                  <img 
                                    src={event.logo} 
                                    alt={event.title}
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = 'none';
                                    }}
                                  />
                                </div>
                              )}
                              
                              {/* 내용 */}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-base md:text-xl font-light text-gray-800 mb-0.5 md:mb-1">{event.title}</h4>
                                <p className="text-gray-500 text-xs md:text-sm mb-0.5 md:mb-1">{event.role}</p>
                                {event.subtitle && (
                                  <p className="text-amber-600 text-xs mb-2 md:mb-3">{event.subtitle}</p>
                                )}
                              </div>
                            </div>
                            
                            {/* View Memory 버튼 - 모바일에서는 숨김 */}
                            <button
                              onClick={() => setViewingMemory(event.id)}
                              className="hidden md:block flex-shrink-0 px-3 py-1.5 text-xs tracking-wider uppercase text-gray-400 hover:text-amber-600 border border-gray-200 hover:border-amber-300 rounded-full transition-colors"
                            >
                              View Memory
                            </button>
                          </div>
                          
                          {/* 하이라이트 */}
                          {event.highlights && event.highlights.length > 0 && (
                            <div className="space-y-1 mt-3 pl-0 md:pl-[4.5rem]">
                              {event.highlights.map((highlight, hIndex) => (
                                <p key={hIndex} className="text-gray-600 text-xs md:text-sm">
                                  {highlight.link ? (
                                    <a 
                                      href={highlight.link} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="hover:text-amber-600 hover:underline transition-colors"
                                    >
                                      {highlight.text}
                                    </a>
                                  ) : (
                                    highlight.text
                                  )}
                                </p>
                              ))}
                            </div>
                          )}
                          
                          {/* View Memory 버튼 - 모바일에서만 보임 */}
                          <button
                            onClick={() => setViewingMemory(event.id)}
                            className="md:hidden mt-3 w-full px-3 py-2 text-xs tracking-wider uppercase text-gray-400 hover:text-amber-600 border border-gray-200 hover:border-amber-300 rounded-full transition-colors text-center"
                          >
                            View Memory
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </main>

      {/* ========== MEMORY MODAL ========== */}
      <AnimatePresence>
        {viewingMemory && memoryEvent && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setViewingMemory(null)}
          >
            {/* 닫기 버튼 */}
            <button
              onClick={() => setViewingMemory(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 콘텐츠 */}
            <motion.div
              className="bg-white rounded-2xl max-w-4xl w-full max-h-[85vh] overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* 헤더 */}
              <div className="p-6 border-b border-gray-100">
                <p className="text-amber-600 text-sm tracking-wider mb-1">{memoryEvent.period}</p>
                <h3 className="text-2xl font-light text-gray-800">{memoryEvent.title}</h3>
                <p className="text-gray-500 text-sm">{memoryEvent.role}</p>
              </div>

              {/* 사진 그리드 */}
              <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(85vh - 120px)' }}>
                {memoryEvent.memories && memoryEvent.memories.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {memoryEvent.memories.map((photo, idx) => (
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
                ) : (
                  <div className="text-center py-16">
                    <p className="text-6xl mb-4">📷</p>
                    <p className="text-gray-400 text-lg">아직 추억 사진이 없습니다</p>
                    <p className="text-gray-300 text-sm mt-2">사진을 추가하면 여기에 표시됩니다</p>
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
            {/* 닫기 버튼 */}
            <button
              onClick={() => setEnlargedPhoto(null)}
              className="absolute top-6 right-6 text-white/60 hover:text-white transition-colors z-10"
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* 확대된 사진 */}
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
