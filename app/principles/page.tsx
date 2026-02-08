'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Career Core Values
const coreValues = [
  {
    icon: '⚡',
    title: 'Quick Execution',
    subtitle: '압도적인 빠른 실행',
    content: '완벽함은 존재하지 않습니다. 깊은 고민만으로는 길을 찾을 수 없습니다. 오직 빠른 실행과 시행착오를 통한 배움(Lesson)만이 우리를 올바른 다음 단계로 안내한다고 믿습니다.',
  },
  {
    icon: '💎',
    title: 'Benevolent View of the World',
    subtitle: '세상을 향한 선한 시선',
    content: `인류의 역사는 산업혁명부터 AI에 이르기까지 끊임없이 진보해 왔습니다. 세상을 더 낫고 편리한 곳으로 만들고자 하는 이 진보는 지독하게 순수하고 선한 의도에서 비롯되었다고 믿습니다.

우리는 혁신을 논하기 이전에, 세상을 이처럼 선하게 바라보는 동료들과 함께 미래를 그리고 싶습니다.

선한 시선이란 거창한 것이 아닙니다. 다음 세대의 안위를 걱정하고 우리 자녀들이 살아갈 사회를 위하는 마음입니다. 지금의 치열한 고민과 혁신을 통해 다음 세대에게 훌륭한 기술적·문화적 유산을 남기겠다는 의지, 그것이 우리의 가장 큰 동기부여가 되어야 합니다.

그래야만 결과의 성패나 수익을 떠나 우리가 하는 일 그 자체에 자부심을 느끼고, 긴 여정 속에서 마주할 수많은 '악'한 유혹에 흔들리지 않을 수 있습니다.`,
  },
  {
    icon: '🤝',
    title: 'Ongoing Goal Alignment',
    subtitle: '지속적인 목표 조율',
    content: `처음 설정한 목표는 계속 변화합니다. 우리는 매일 제품과 회사를 만들어가는 과정에서 새로운 레슨들을 배우기 때문입니다.

목표가 바뀌는 것은 결코 부끄러운 일이 아닙니다. 오히려 이를 빠르게 인정하고 소통하며 공유해야 합니다. 잦은 목표 수정은 우리가 그만큼 치열하게 배우고 시장의 목소리를 경청하고 있다는 명확한 증거(방증)입니다.

뛰어난 팀은 목표가 정렬(Align)되기만 하면, 기어코 방법을 찾아냅니다.`,
  },
];

// Lessons & Records
const lessons = [
  {
    id: 'respect-founders',
    title: '대한민국의 모든 창업자를 진심으로 존경하다',
    date: '2026.02.08',
    content: '', // 내용은 추후 추가
    comments: [],
  },
];

export default function PrinciplesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'values' | 'lessons'>('values');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({ name: '', comment: '' });

  const selectedLessonData = lessons.find(l => l.id === selectedLesson);

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 via-white to-sky-50">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={() => router.push('/?chapters=true')}
            className="text-gray-400 hover:text-gray-600 transition-colors flex items-center gap-2"
          >
            <span>←</span>
            <span className="text-sm">Back</span>
          </button>
          <h1 className="text-lg font-light text-gray-800">원칙 & 배움 & 기록</h1>
          <div className="w-16" />
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="pt-24 pb-6">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex gap-2 p-1 bg-gray-100/80 rounded-xl shadow-sm">
            <button
              onClick={() => setActiveTab('values')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'values'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Career Core Values
            </button>
            <button
              onClick={() => setActiveTab('lessons')}
              className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                activeTab === 'lessons'
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Lesson Learned & Record
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 pb-20">
        <AnimatePresence mode="wait">
          {activeTab === 'values' ? (
            <motion.div
              key="values"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Header */}
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-extralight text-gray-800 mb-4">
                  Career Core Values
                </h2>
                <p className="text-gray-500 font-light">
                  일을 대하는 저의 원칙입니다
                </p>
              </div>

              {/* Values */}
              <div className="space-y-8">
                {coreValues.map((value, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl p-8 md:p-10 border border-gray-100 shadow-sm"
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.15 }}
                  >
                    <div className="flex items-start gap-4 mb-6">
                      <span className="text-4xl">{value.icon}</span>
                      <div>
                        <h3 className="text-xl md:text-2xl font-medium text-gray-800">
                          {value.title}
                        </h3>
                        <p className="text-amber-600 font-light">{value.subtitle}</p>
                      </div>
                    </div>
                    <div className="text-gray-600 font-light leading-relaxed whitespace-pre-line pl-0 md:pl-14">
                      {value.content}
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="lessons"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Section Header */}
              <div className="text-center mb-12 pt-8">
                <h2 className="text-3xl md:text-4xl font-extralight text-gray-800 mb-4">
                  Lesson Learned & Record
                </h2>
                <p className="text-gray-500 font-light">
                  배움과 기록을 남깁니다
                </p>
              </div>

              {/* Comment Notice */}
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8 text-center">
                <p className="text-amber-800 text-sm">
                  💬 댓글은 <span className="font-medium">실명</span>으로 달아주셔야 답변드립니다
                </p>
              </div>

              {/* Lessons List */}
              <div className="space-y-4">
                {lessons.map((lesson, idx) => (
                  <motion.div
                    key={lesson.id}
                    className="bg-white/70 backdrop-blur-sm rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    onClick={() => setSelectedLesson(lesson.id)}
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-xs text-amber-600 font-medium tracking-wider">
                            {lesson.date}
                          </span>
                          <h3 className="text-lg md:text-xl font-medium text-gray-800 mt-2">
                            {lesson.title}
                          </h3>
                        </div>
                        <span className="text-gray-300 text-2xl">→</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* Empty State for future */}
              {lessons.length === 0 && (
                <div className="text-center py-20 text-gray-400">
                  <p>아직 작성된 글이 없습니다</p>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Lesson Detail Modal */}
      <AnimatePresence>
        {selectedLesson && selectedLessonData && (
          <motion.div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end md:items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLesson(null)}
          >
            <motion.div
              className="bg-white w-full md:w-[90%] md:max-w-3xl max-h-[90vh] md:max-h-[85vh] rounded-t-3xl md:rounded-2xl overflow-hidden"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                <button
                  onClick={() => setSelectedLesson(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ← Back
                </button>
                <span className="text-xs text-amber-600">{selectedLessonData.date}</span>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-120px)] md:max-h-[calc(85vh-120px)]">
                <div className="p-6 md:p-10">
                  <h2 className="text-2xl md:text-3xl font-medium text-gray-800 mb-8 leading-tight">
                    {selectedLessonData.title}
                  </h2>

                  {selectedLessonData.content ? (
                    <div className="prose prose-gray max-w-none mb-12">
                      <p className="text-gray-600 font-light leading-relaxed whitespace-pre-line">
                        {selectedLessonData.content}
                      </p>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400 mb-12">
                      <p>✍️ 글이 작성중입니다...</p>
                    </div>
                  )}

                  {/* Comments Section */}
                  <div className="border-t border-gray-100 pt-8">
                    <h3 className="text-lg font-medium text-gray-800 mb-6">
                      댓글 <span className="text-gray-400 font-normal text-sm">({selectedLessonData.comments.length})</span>
                    </h3>

                    {/* Comment Form */}
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                      <input
                        type="text"
                        placeholder="실명을 입력해주세요"
                        value={commentForm.name}
                        onChange={(e) => setCommentForm({ ...commentForm, name: e.target.value })}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm mb-3 focus:outline-none focus:border-amber-400"
                      />
                      <textarea
                        placeholder="댓글을 남겨주세요..."
                        value={commentForm.comment}
                        onChange={(e) => setCommentForm({ ...commentForm, comment: e.target.value })}
                        rows={3}
                        className="w-full bg-white border border-gray-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-amber-400"
                      />
                      <div className="flex justify-between items-center mt-3">
                        <p className="text-xs text-gray-400">
                          💡 실명으로 달아주셔야 답변드립니다
                        </p>
                        <button className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors">
                          등록
                        </button>
                      </div>
                    </div>

                    {/* Comments List */}
                    {selectedLessonData.comments.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">
                        첫 번째 댓글을 남겨주세요
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {/* Comments would be rendered here */}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
