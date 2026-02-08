'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// 재키님이 좋아하는 혁신적인 제품/인물 이미지들
const innovationImages = [
  '/innovations/benz-patent.jpg', // 벤츠 특허 자동차 - 최초의 자동차
  '/innovations/apple-1.jpg', // Apple I - 최초의 애플 컴퓨터
  '/innovations/henry-ford.png', // 헨리 포드
  '/innovations/wright-brothers.jpg', // 라이트 형제 첫 비행
  '/innovations/steve-jobs.jpg', // 스티브 잡스 + 매킨토시
  '/innovations/chung-ju-yung.jpg', // 정주영 회장
  '/innovations/sony-walkman.jpg', // 소니 워크맨
  '/innovations/iphone-launch.webp', // 스티브 잡스 아이폰 발표
  '/innovations/edison.jpg', // 토마스 에디슨
  '/innovations/spacex-launch.webp', // SpaceX 로켓 발사
  '/innovations/lee-byung-chul.png', // 이병철 회장
  '/innovations/rockefeller.jpg', // 존 D. 록펠러
  '/innovations/windows98.png', // Windows 98
  '/innovations/walt-disney.jpg', // 월트 디즈니
  '/innovations/bell-telephone.jpg', // 알렉산더 그레이엄 벨
  '/innovations/penicillin.jpg', // 페니실린
];

// 파편적으로 나타나는 위치들 (해상도 깨짐 방지: 최대 ~300px)
const fragmentPositions = [
  { top: '5%', left: '3%' },
  { top: '8%', right: '5%' },
  { top: '25%', left: '1%' },
  { top: '30%', right: '2%' },
  { bottom: '25%', left: '5%' },
  { bottom: '20%', right: '3%' },
  { bottom: '8%', left: '15%' },
  { bottom: '5%', right: '12%' },
];

// 챕터 정보
const chapters = [
  { 
    id: 'origin', 
    korean: '삶 & 인생', 
    english: 'Origin & Story',
    number: 'I',
    images: ['/life/childhood.jpg', '/life/teenage.jpg', '/life/adult.jpg'] // 어릴적, 청소년기, 성인
  },
  { 
    id: 'work', 
    korean: '일 & 열정', 
    english: 'Work & Passion',
    number: 'II',
    images: ['/work/work1.jpg', '/work/work2.jpg', '/work/work3.jpg']
  },
  { 
    id: 'principles', 
    korean: '원칙 & 배움 & 기록', 
    english: 'Principles & Lessons & Record',
    number: 'III',
    images: ['/principles/book.jpg']
  },
  { 
    id: 'archive', 
    korean: '기타정보', 
    english: 'Archive',
    number: 'IV',
    images: null
  },
];

function HomeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [visibleFragments, setVisibleFragments] = useState<number[]>([]);
  const [isEntering, setIsEntering] = useState(false);
  const [showChapters, setShowChapters] = useState(false);
  const [showChat, setShowChat] = useState(false);
  
  // URL에서 chapters=true 감지하여 챕터 선택 화면 자동 열기
  useEffect(() => {
    if (searchParams.get('chapters') === 'true') {
      setIsEntering(true);
      setShowChapters(true);
      // URL에서 파라미터 제거 (깔끔하게)
      router.replace('/', { scroll: false });
    }
  }, [searchParams, router]);
  const [chatMessages, setChatMessages] = useState<{role: 'user' | 'hyesung', content: string}[]>([
    { role: 'hyesung', content: '안녕하세요! 저는 혜성(Jackie)입니다. 무엇이든 물어보세요. 제 경험, 생각, 철학에 대해 이야기할 수 있어요.' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showContent, setShowContent] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // 파편적으로 이미지가 나타났다 사라지는 효과
  useEffect(() => {
    const showFragment = () => {
      setVisibleFragments(prev => {
        // 현재 사용 중인 위치와 이미지 확인
        const usedPositions = prev.map(id => Math.floor(id / 100));
        const usedImages = prev.map(id => id % 100);
        
        // 사용 가능한 위치 찾기
        const availablePositions = fragmentPositions
          .map((_, i) => i)
          .filter(i => !usedPositions.includes(i));
        
        // 사용 가능한 이미지 찾기 (같은 이미지 동시 노출 방지)
        const availableImages = innovationImages
          .map((_, i) => i)
          .filter(i => !usedImages.includes(i));
        
        if (availablePositions.length === 0 || availableImages.length === 0) {
          return prev;
        }
        
        const randomPosition = availablePositions[Math.floor(Math.random() * availablePositions.length)];
        const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
        const fragmentId = randomPosition * 100 + randomImage;
        
        // 3-5초 후 사라짐
        setTimeout(() => {
          setVisibleFragments(p => p.filter(id => id !== fragmentId));
        }, 3000 + Math.random() * 2000);
        
        return [...prev, fragmentId];
      });
    };

    // 초기에 3-4개 표시
    showFragment();
    setTimeout(showFragment, 500);
    setTimeout(showFragment, 1000);
    setTimeout(showFragment, 1500);

    // 1.5-3초마다 새로운 파편 표시
    const interval = setInterval(() => {
      if (Math.random() > 0.2) showFragment();
    }, 1500 + Math.random() * 1500);

    return () => clearInterval(interval);
  }, []);

  // 이름 클릭 또는 스크롤 시 비전 화면으로 전환
  const handleEnter = () => {
    if (isEntering) return;
    setIsEntering(true);
  };

  // 스크롤 감지 - 마우스 휠 + 모바일 터치로 페이지 전환
  useEffect(() => {
    let touchStartY = 0;
    
    // 마우스 휠 (데스크탑)
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY > 30 && !isEntering) {
        setIsEntering(true);
      }
      if (e.deltaY < -30 && isEntering) {
        setIsEntering(false);
      }
    };
    
    // 터치 시작 (모바일)
    const handleTouchStart = (e: TouchEvent) => {
      touchStartY = e.touches[0].clientY;
    };
    
    // 터치 끝 (모바일)
    const handleTouchEnd = (e: TouchEvent) => {
      const touchEndY = e.changedTouches[0].clientY;
      const diff = touchStartY - touchEndY;
      
      // 스와이프 업 (50px 이상) → 다음 페이지로
      if (diff > 50 && !isEntering) {
        setIsEntering(true);
      }
      // 스와이프 다운 (50px 이상) → 이전 페이지로
      if (diff < -50 && isEntering) {
        setIsEntering(false);
      }
    };
    
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isEntering]);

  return (
    <div className="min-h-screen">
      {/* ========== CINEMATIC HERO ========== */}
      <section className="h-dvh relative overflow-hidden bg-gradient-to-br from-amber-50 via-white to-sky-50">
        
        {/* 밝은 배경 그라데이션 */}
        <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-white/20 to-white/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-amber-100/30 via-transparent to-sky-100/30" />

        {/* 파편적으로 나타나는 혁신 이미지들 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <AnimatePresence>
            {fragmentPositions.map((pos, posIndex) => {
              const isVisible = visibleFragments.some(id => Math.floor(id / 100) === posIndex);
              const imageIndex = visibleFragments.find(id => Math.floor(id / 100) === posIndex);
              const imgSrc = imageIndex !== undefined 
                ? innovationImages[imageIndex % 100 % innovationImages.length]
                : innovationImages[0];

              if (!isVisible) return null;

              return (
                <motion.div
                  key={`fragment-${posIndex}-${imageIndex}`}
                  className="absolute rounded-xl overflow-hidden shadow-2xl"
                  style={{
                    top: pos.top,
                    left: pos.left,
                    right: pos.right,
                    bottom: pos.bottom,
                    maxWidth: '280px',
                    maxHeight: '350px',
                  }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 0.5, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 2, ease: 'easeInOut' }}
                >
                  <img 
                    src={imgSrc}
                    alt="Innovation"
                    className="max-w-full max-h-full w-auto h-auto opacity-30 md:opacity-100"
                    style={{ filter: 'grayscale(100%)' }}
                  />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* 시네마틱 레터박스 */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-black/20 to-transparent z-10" />
        <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-black/20 to-transparent z-10" />

        {/* 빛나는 파티클 효과 */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-amber-400/60 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                y: [0, -100, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 4 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: 'easeInOut',
              }}
            />
          ))}
        </div>

        {/* 중앙 콘텐츠 */}
        <div className="relative z-20 h-full flex flex-col items-center justify-center px-4">
          
          <AnimatePresence mode="wait">
            {!isEntering ? (
              <motion.div
                key="hero"
                className="text-center cursor-pointer"
                onClick={handleEnter}
                exit={{
                  opacity: 0,
                  transition: { duration: 0.8, ease: 'easeInOut' }
                }}
              >
                {/* 프로필 이미지 */}
                <motion.div
                  className="relative mx-auto mb-8"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  <div className="relative w-52 h-52 md:w-72 md:h-72 mx-auto">
                    {/* 글로우 효과 */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-amber-200 to-sky-200 blur-2xl opacity-60 animate-pulse" />
                    
                    {/* 이미지 컨테이너 */}
                    <div className="relative w-full h-full rounded-full bg-gradient-to-br from-gray-100 to-gray-200 border-2 border-white shadow-2xl overflow-hidden">
                      <img 
                        src="/profile.png" 
                        alt="Hyesung Kim"
                        className="w-full h-full object-cover object-top"
                      />
                    </div>
                    
                    {/* 외곽 링 */}
                    <motion.div 
                      className="absolute -inset-3 rounded-full border border-amber-200/50"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
                    />
                  </div>
                </motion.div>

                {/* 이름 */}
                <motion.h1
                  className="text-5xl md:text-8xl font-extralight tracking-[0.2em] text-gray-800 mb-2"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.5 }}
                >
                  Hyesung Kim
                </motion.h1>

                {/* 영어 이름 */}
                <motion.p
                  className="text-2xl md:text-3xl text-gray-500 font-extralight tracking-[0.15em] mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  (Jackie)
                </motion.p>

                {/* 부제 */}
                <motion.p
                  className="text-lg md:text-xl text-gray-500 tracking-[0.3em] uppercase font-light mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 0.8 }}
                >
                  Founder · Innovator · Dreamer
                </motion.p>

                {/* 클릭/스크롤 유도 */}
                <motion.div
                  className="mt-8"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1, delay: 1.2 }}
                >
                  <p className="text-gray-400 text-sm tracking-widest uppercase mb-4">
                    Click or Scroll to Enter
                  </p>
                  <motion.div
                    className="w-px h-16 bg-gradient-to-b from-gray-400 to-transparent mx-auto"
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </motion.div>
              </motion.div>
            ) : (
              <motion.div
                key="vision"
                className="text-center max-w-4xl mx-auto px-6"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, ease: 'easeOut' }}
              >
                {/* 비전 텍스트 */}
                <motion.p
                  className="text-xl md:text-4xl font-extralight text-gray-800 leading-relaxed md:leading-relaxed mb-12 md:mb-20"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.3 }}
                >
                  일상에 불편을 주는 큰 문제를 발견하고
                  <span className="hidden md:inline"><br /></span>{' '}
                  뛰어난 팀과 기술을 활용하여 문제를 풀어가며,
                  <span className="hidden md:inline"><br /></span>{' '}
                  우리의 일상에 근본적인 변화가 생기는것을 지켜보며
                  <span className="hidden md:inline"><br /></span>{' '}
                  <span className="text-amber-600 font-light">가장 큰 희열과 행복감</span>을 얻습니다.
                </motion.p>

                {/* JOURNEY 버튼 - 정갈하게 */}
                <motion.button
                  onClick={() => setShowChapters(true)}
                  className="inline-block text-xl md:text-3xl tracking-[0.2em] md:tracking-[0.3em] uppercase font-light text-gray-600 hover:text-amber-600 active:text-amber-600 transition-colors duration-300 mb-12 md:mb-20 border-b border-gray-300 hover:border-amber-500 pb-2 bg-transparent cursor-pointer min-h-[44px]"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.6 }}
                >
                  The Journey
                </motion.button>

                {/* 소셜 링크 */}
                <motion.div
                  className="flex justify-center gap-8 md:gap-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.9 }}
                >
                  <a 
                    href="mailto:cmeetsp@gmail.com"
                    className="text-gray-500 hover:text-amber-600 transition-colors tracking-widest uppercase text-sm md:text-base"
                  >
                    Email
                  </a>
                  <a 
                    href="https://www.instagram.com/hyesung_8149?igsh=MTl0N2NxczI2bXQ0dA%3D%3D&utm_source=qr"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-amber-600 transition-colors tracking-widest uppercase text-sm md:text-base"
                  >
                    Instagram
                  </a>
                  <a 
                    href="https://www.linkedin.com/in/hyesung-kim-9a560259/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-gray-500 hover:text-amber-600 transition-colors tracking-widest uppercase text-sm md:text-base"
                  >
                    LinkedIn
                  </a>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </section>

      {/* ========== CHAPTER SELECTION (영화 챕터 선택) ========== */}
      <AnimatePresence>
        {showChapters && (
          <motion.div
            className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-white to-sky-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* 밝은 배경 오버레이 */}
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 via-transparent to-white/60" />
            
            {/* 레터박스 (밝은 버전) */}
            <div className="absolute top-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-b from-gray-200/50 to-transparent z-10" />
            <div className="absolute bottom-0 left-0 right-0 h-12 md:h-16 bg-gradient-to-t from-gray-200/50 to-transparent z-10" />

            {/* 뒤로가기 버튼 */}
            <motion.button
              onClick={() => setShowChapters(false)}
              className="absolute top-14 md:top-20 left-4 md:left-12 text-gray-400 hover:text-gray-800 active:text-gray-800 transition-colors z-20 flex items-center gap-1 md:gap-2 min-h-[44px] min-w-[44px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
              </svg>
              <span className="text-xs md:text-sm tracking-widest uppercase">Back</span>
            </motion.button>

            {/* 타이틀 */}
            <motion.div
              className="absolute top-14 md:top-20 left-1/2 -translate-x-1/2 text-center z-20"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-gray-500 text-xs md:text-base tracking-[0.3em] md:tracking-[0.5em] uppercase">Select Chapter</h2>
            </motion.div>

            {/* 챕터 그리드 */}
            <div className="absolute inset-0 flex items-center justify-center px-4 md:px-12 pt-24 pb-32 md:pt-0 md:pb-0 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 max-w-5xl w-full my-auto">
                {chapters.map((chapter, index) => (
                  <motion.a
                    key={chapter.id}
                    href={chapter.id === 'origin' ? '/origin' : chapter.id === 'work' ? '/work' : chapter.id === 'principles' ? '/principles' : `#${chapter.id}`}
                    className="group relative bg-white/70 hover:bg-white active:bg-white border border-gray-200 hover:border-amber-300 active:border-amber-300 rounded-xl p-6 md:p-10 transition-all duration-500 shadow-sm hover:shadow-xl active:shadow-xl min-h-[100px]"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.15, duration: 0.6 }}
                    onClick={() => setShowChapters(false)}
                  >
                    {/* 챕터 번호 */}
                    <div className="absolute top-3 md:top-4 right-3 md:right-4 text-gray-200 text-3xl md:text-5xl font-extralight group-hover:text-amber-200 transition-colors">
                      {chapter.number}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      {/* 챕터 내용 */}
                      <div className="relative z-10 flex-1">
                        <h3 className="text-gray-800 text-xl md:text-3xl font-extralight mb-2 md:mb-3 group-hover:text-amber-600 group-active:text-amber-600 transition-colors">
                          {chapter.korean}
                        </h3>
                        <p className="text-gray-400 text-xs md:text-base tracking-wider uppercase group-hover:text-gray-600 transition-colors">
                          {chapter.english}
                        </p>
                      </div>

                      {/* 이미지 (있을 경우) */}
                      {chapter.images && (
                        <div className="flex -space-x-2 md:-space-x-3 mr-2 md:mr-8">
                          {chapter.images.map((img, imgIndex) => (
                            <div 
                              key={imgIndex}
                              className="w-10 h-10 md:w-[4.5rem] md:h-[4.5rem] rounded-full border-2 border-white shadow-md overflow-hidden bg-gray-100"
                            >
                              <img 
                                src={img} 
                                alt={`Life ${imgIndex + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).style.display = 'none';
                                }}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* 화살표 - 모바일에서도 보이게 */}
                    <div className="absolute bottom-3 md:bottom-4 right-3 md:right-4 text-gray-300 md:text-transparent group-hover:text-amber-500 group-active:text-amber-500 transition-all duration-300 transform md:translate-x-2 group-hover:translate-x-0">
                      <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            {/* 하단 - 혜성과 대화하기 */}
            <motion.div
              className="absolute bottom-6 md:bottom-16 left-1/2 -translate-x-1/2 text-center flex flex-col items-center z-30 bg-gradient-to-t from-white/90 via-white/70 to-transparent pt-6 pb-2 px-4 w-full md:w-auto md:bg-transparent md:pt-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2 }}
            >
              <button
                onClick={() => {
                  setShowChapters(false);
                  setShowChat(true);
                }}
                className="text-gray-500 hover:text-amber-600 active:text-amber-600 text-base md:text-xl tracking-wider md:tracking-widest uppercase transition-colors flex items-center justify-center gap-2 md:gap-3 mb-2 md:mb-3 min-h-[44px]"
              >
                <span>💬</span>
                <span>Talk to Hyesung</span>
              </button>
              <p className="text-gray-400 text-[10px] md:text-sm max-w-xs md:max-w-sm text-center leading-relaxed">
                혜성(Jackie)의 자아와 경험, 기억을 동일하게 가지고 있는 AI 와 대화합니다
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== CHAT WITH HYESUNG ========== */}
      <AnimatePresence>
        {showChat && (
          <motion.div
            className="fixed inset-0 z-50 bg-gradient-to-br from-amber-50 via-white to-sky-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* 헤더 */}
            <div className="absolute top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-10">
              <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => setShowChat(false)}
                  className="text-gray-400 hover:text-gray-800 transition-colors flex items-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
                  </svg>
                  <span className="text-sm tracking-widest uppercase">Back</span>
                </button>
                
                <div className="text-center">
                  <h2 className="text-gray-800 font-light text-lg tracking-wider">Talk to Hyesung</h2>
                  <p className="text-gray-400 text-xs tracking-wider">AI powered conversation</p>
                </div>
                
                <div className="w-20" /> {/* Spacer */}
              </div>
            </div>

            {/* 채팅 영역 */}
            <div className="absolute inset-0 top-20 bottom-24 overflow-y-auto px-6 py-8">
              <div className="max-w-2xl mx-auto space-y-6">
                {chatMessages.map((msg, index) => (
                  <motion.div
                    key={index}
                    className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className={`max-w-[80%] ${
                      msg.role === 'user' 
                        ? 'bg-amber-500 text-white rounded-2xl rounded-br-md' 
                        : 'bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-bl-md shadow-sm'
                    } px-5 py-3`}>
                      {msg.role === 'hyesung' && (
                        <p className="text-amber-600 text-xs font-medium mb-1 tracking-wider">HYESUNG</p>
                      )}
                      <p className="text-sm md:text-base leading-relaxed">{msg.content}</p>
                    </div>
                  </motion.div>
                ))}
                
                {isTyping && (
                  <motion.div
                    className="flex justify-start"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <div className="bg-white border border-gray-100 rounded-2xl rounded-bl-md shadow-sm px-5 py-3">
                      <p className="text-amber-600 text-xs font-medium mb-1 tracking-wider">HYESUNG</p>
                      <div className="flex gap-1">
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>

            {/* 입력 영역 */}
            <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-gray-100">
              <div className="max-w-2xl mx-auto px-6 py-4">
                <form 
                  onSubmit={async (e) => {
                    e.preventDefault();
                    if (!chatInput.trim()) return;
                    
                    const userMessage = chatInput.trim();
                    
                    // 사용자 메시지 추가
                    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
                    setChatInput('');
                    setIsTyping(true);
                    
                    try {
                      // 대화 히스토리를 API 형식으로 변환
                      const history = chatMessages.slice(1).map(msg => ({
                        role: msg.role === 'hyesung' ? 'assistant' : 'user',
                        content: msg.content,
                      }));

                      // 실제 AI 응답 받기
                      const response = await fetch('/api/chat', {
                        method: 'POST',
                        headers: {
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ 
                          message: userMessage,
                          history,
                        }),
                      });

                      if (!response.ok) {
                        throw new Error('Failed to get response');
                      }

                      const data = await response.json();
                      
                      setIsTyping(false);
                      setChatMessages(prev => [...prev, { 
                        role: 'hyesung', 
                        content: data.reply 
                      }]);
                    } catch (error) {
                      console.error('Chat error:', error);
                      setIsTyping(false);
                      setChatMessages(prev => [...prev, { 
                        role: 'hyesung', 
                        content: '죄송합니다. 일시적인 오류가 발생했습니다. 다시 시도해주세요.' 
                      }]);
                    }
                  }}
                  className="flex gap-3"
                >
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    placeholder="혜성에게 물어보세요..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-full px-5 py-3 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white rounded-full px-6 py-3 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
                <p className="text-center text-gray-400 text-xs mt-3">
                  This is an AI representation of Hyesung's thoughts and experiences
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========== MAIN CONTENT ========== */}
      {showContent && (
        <motion.div
          ref={contentRef}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Navigation */}
          <nav className="sticky top-0 bg-white/90 backdrop-blur-md border-b border-gray-100 z-50">
            <div className="max-w-6xl mx-auto px-6 py-5">
              <div className="flex justify-between items-center">
                <div className="font-light text-xl tracking-wider text-gray-800">Hyesung Kim</div>
                <div className="hidden md:flex gap-10 text-sm tracking-wider">
                  <a href="#about" className="text-gray-600 hover:text-amber-600 transition-colors">About</a>
                  <a href="#journey" className="text-gray-600 hover:text-amber-600 transition-colors">Journey</a>
                  <a href="#philosophy" className="text-gray-600 hover:text-amber-600 transition-colors">Philosophy</a>
                  <a href="#thoughts" className="text-gray-600 hover:text-amber-600 transition-colors">Thoughts</a>
                  <a href="#contact" className="text-gray-600 hover:text-amber-600 transition-colors">Contact</a>
                </div>
              </div>
            </div>
          </nav>

          {/* About Section */}
          <section id="about" className="min-h-screen flex items-center justify-center px-6 py-32">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl font-extralight tracking-wide mb-16 text-gray-800">About</h2>
                <div className="space-y-8 text-xl text-gray-600 font-light leading-relaxed">
                  <p>
                    1991년, 4남매 중 첫째로 태어났습니다.
                  </p>
                  <p>
                    플로리다와 시카고에서 자라며 경제학을 공부했고, 
                    대학 2학년 때 첫 사업의 맛을 보았습니다.
                  </p>
                  <p>
                    2018년 한국으로 돌아와 벤처캐피탈에서 심사역으로 일하며
                    시장을 읽는 법과 사업을 숫자로 보는 관점을 배웠습니다.
                  </p>
                  <p className="text-gray-800 text-2xl">
                    2022년, <strong className="font-medium text-amber-600">마인이스(Mine.is)</strong>를 창업했습니다.
                  </p>
                  <p>
                    세컨핸드 패션의 대중화라는 비전 아래 
                    <strong className="font-medium"> 차란(Charan)</strong>을 만들고 있습니다.
                  </p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Journey Section */}
          <section id="journey" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-white px-6 py-32">
            <div className="max-w-4xl w-full">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl font-extralight tracking-wide mb-20 text-gray-800">Journey</h2>
                
                <div className="space-y-16">
                  {[
                    {
                      period: '2010 — 2014',
                      title: '시카고대학교 경제학',
                      desc: '경제학을 배우며 세상을 수치와 가설로 이해하는 법을 익혔습니다. 대학 2학년, 첫 사업 Freenters를 시작했습니다.',
                    },
                    {
                      period: '2018 — 2022',
                      title: '벤처캐피탈 심사역',
                      desc: '4년간 스타트업을 심사하며 실패 패턴을 학습했습니다. 시장을 읽는 법, 숫자로 사업을 보는 관점을 배웠습니다.',
                    },
                    {
                      period: '2022 — Present',
                      title: '마인이스 창업',
                      desc: '세컨핸드 패션 플랫폼 차란(Charan)을 만들고 있습니다. 시리즈 B까지 약 268억 투자를 유치했습니다.',
                    },
                  ].map((item, index) => (
                    <motion.div
                      key={item.period}
                      initial={{ opacity: 0, x: -30 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      viewport={{ once: true }}
                      className="group"
                    >
                      <div className="text-sm text-amber-600 tracking-wider mb-3">{item.period}</div>
                      <h3 className="text-3xl font-light text-gray-800 mb-4">{item.title}</h3>
                      <p className="text-lg text-gray-600 font-light leading-relaxed">{item.desc}</p>
                      {index < 2 && <div className="h-px bg-amber-200/50 mt-16" />}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </section>

          {/* Philosophy Section */}
          <section id="philosophy" className="min-h-screen flex items-center justify-center px-6 py-32">
            <div className="max-w-4xl">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl font-extralight tracking-wide mb-16 text-gray-800">Philosophy</h2>
                
                <div className="space-y-12">
                  <blockquote className="text-3xl md:text-4xl font-extralight text-gray-700 leading-relaxed border-l-4 border-amber-400 pl-8">
                    "30% 확신이면 실행한다.<br />
                    결과를 통해 배운다."
                  </blockquote>
                  
                  <div className="grid md:grid-cols-2 gap-8 mt-16">
                    {[
                      { title: 'Obsession', desc: '문제의 근본 원인을 파악해 완전히 해결할 때까지 포기하지 않습니다.' },
                      { title: 'Quick Execution', desc: '완벽함보다 빠른 실행을 추구합니다. 실패를 두려워하지 않습니다.' },
                      { title: 'Customer First', desc: '고객의 문제를 사전에 예측하고 신속하게 해결합니다.' },
                      { title: 'Believe', desc: '비전에 공감하며 성장 가능성을 믿고 적극 참여합니다.' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                        viewport={{ once: true }}
                        className="p-6 bg-gradient-to-br from-amber-50 to-white rounded-xl"
                      >
                        <h3 className="text-xl font-medium text-amber-600 mb-3">{item.title}</h3>
                        <p className="text-gray-600 font-light">{item.desc}</p>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Thoughts Section */}
          <section id="thoughts" className="min-h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-white px-6 py-32">
            <div className="max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl font-extralight tracking-wide mb-16 text-gray-800">Thoughts</h2>
                <p className="text-xl text-gray-500 font-light mb-12">
                  마인이스를 하면서 느낀 점, 힘든 점, 배운 점을 솔직하게 씁니다.
                </p>
                <div className="bg-white/80 rounded-2xl p-16 shadow-lg">
                  <p className="text-gray-400 text-lg">✍️ Coming soon...</p>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Contact Section */}
          <section id="contact" className="min-h-screen flex items-center justify-center px-6 py-32">
            <div className="max-w-4xl text-center">
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
              >
                <h2 className="text-5xl md:text-7xl font-extralight tracking-wide mb-16 text-gray-800">Contact</h2>
                <p className="text-xl text-gray-500 font-light mb-12">
                  이야기하고 싶으신가요?
                </p>
                <div className="flex gap-12 justify-center text-lg">
                  <a href="mailto:jackie@mine.is" className="text-gray-600 hover:text-amber-600 transition-colors tracking-wider">Email</a>
                  <a href="https://linkedin.com" className="text-gray-600 hover:text-amber-600 transition-colors tracking-wider" target="_blank">LinkedIn</a>
                  <a href="https://twitter.com" className="text-gray-600 hover:text-amber-600 transition-colors tracking-wider" target="_blank">Twitter</a>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer className="bg-gray-900 text-white/60 py-12 text-center font-light tracking-wider">
            <p>© 2026 Hyesung Kim. All rights reserved.</p>
          </footer>
        </motion.div>
      )}
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50" />}>
      <HomeContent />
    </Suspense>
  );
}
