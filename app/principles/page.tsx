'use client';

import { useState, useEffect } from 'react';
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
    id: 'pre-product-stage',
    title: 'Pre-product 단계의 힘듬?낭만?매력?',
    date: '2026.02.08',
    content: `정말 힘들다. 초기를 좀 떠올려보자면 팀 빌딩부터 MVP(최소 기능 제품)를 만드는 과정, 그리고 그 이후 제품을 고도화하는 과정에서도 회사는 여러 번 휘청였다. 마인이스에게 제품 빌딩은 항상 생각보다 돈과 시간이 더 많이 들었기에 자금은 계속 필요했고, 타깃했던 시장과 고객은 생각보다 제품에 호의적이지 않았다. 채용부터 투자, 회사의 각종 어드민 업무 및 고객 인터뷰, 더 나아가 조직 내 여러 감정적 이슈들까지 대다수 대표에게 쏟아져 몰려오는 때라 눈떠서 출근하고 정신 차려보면 밤 12시였던 것 같다. 6개월, 1년이 정말 눈감으면 지나가버리는 놀라운 시간.

초기 우리 회사는 지하 1층 60평 남짓한 공간에서 물류(입고·검수·피킹·출고)를 모두 해냈고, 1층을 사무실로 사용하면서 지하와 1층을 하루에도 몇십 번씩 왔다 갔다 하던 때였다. 물론 힘들기만 했던 건 아니고, 내 기억상 독특한 재미가 있던 시기기도 했다. 출시 전이기에, 출시 후 우리가 얼마나 빠르게 우리의 방식대로 세상을 점령할 수 있을까 하는 기대와 희망으로 날밤을 새기도 했다. 초기 멤버들과 야근 이후 골뱅이에 소주 마시면서 "우리 좀 더 성장하면 이거 해보자, 저거 해보자" 하며 상상의 나래를 펼치면, 하루 온종일 힘들었던 이벤트가 눈 녹듯 사라지던 독특한 매력이 있던 시기. "제품 출시"라는 강한 공통의 목표 아래 열 명 남짓한 구성원들이 정말 한마음으로 움직였던 마법 같은 시기였다.

여튼, 그 우당탕탕 시기를 지나 제품이 출시되고 난 이후의 난이도와 어려움은 더 가관이다. 일단 출시만 해두면, 일단 출시만 하면 어떻게든 되지 않을까 하며 넘겨왔던 'Pre-product' 시기를 지나 출시를 하고 나니, 그때는 와... 뭐부터 해야 할지 하나도 감이 안 오더라. 출시의 환호성은 지나갔고 앱스토어에 올리면 파팍 성장만 할 줄 알았는데, 현실은 그렇지 않았다.`,
    comments: [],
  },
  {
    id: 'respect-founders',
    title: '대한민국의 모든 창업자를 진심으로 존경한다',
    date: '2026.02.01',
    content: `마인이스의 여정을 해나가는 동안 많은 어려움과 배움, 그리고 시행착오가 있었고 앞으로도 무수히 많을 거다. 창업 이후 중간중간 나의 감정과 배움들을 일기장에 적어두었는데, 차차 모두 여기에 옮겨두려 한다. 앞으로 맞이할 많은 배움과 어려움 또한 여기에 솔직하게 남길 생각이다.

다만 이건 나의 짧은 경험에서 나오는 이야기일 뿐이다. 나도 정답은 모르기에 절대 그 비스무리한 뉘앙스로라도 방법론을 제시할 생각은 없다. 이렇게 하면 된다, 저렇게 하면 된다고 말할 생각은 더더욱 없으며, 내 경험을 일반화시키고 싶지도 않다. 그저 "아, 이런 사람도 있구나" 정도로 참고하길 바란다.

나의 첫 글은 대한민국, 아니 세상의 모든 창업자에게 존경을 표하고(나를 포함하여), 응원하는 나의 마음을 솔직하고 온전히 담아 써 내려가려고 한다.

나는 2022년 2월 마인이스를 창업해서 곧 4년을 맞이하는데, 사업을 하면서 나는 대한민국의 모든 창업자를 진심으로 더더욱 존경하게 되었다. 창업자들은 대부분 세상의 크고 작은 문제들을 찾아 공감하고, 그 문제를 각자의 방식대로 풀어보고자 '창업'이라는 여정을 시작했을 거라 생각한다. 어떤 통계치에서는 생존율을 더 높게 잡기도 하던데, 내 체감상 생존율(유니콘이 될 확률이 아닌, 단순히 살아남을 확률)이 5% 남짓인 이 피비린내 나는 전쟁터에 들어온 용감한 그대들에게 정말 큰 박수를 보낸다. 합리적인 사고방식을 가졌다면 절대 선택할 수 없는 이 길을 선택했다는 건, 아마 좋은 의미로 정말 미쳐 있는 사람이라는 뜻일 터다. 그 광기로 앞으로 펼쳐질 무수히 험난한 싸움과 변수들에 지치지 않기를 두 손 모아 바란다.

그리고 아마 많은 창업자들은 지금도 사람문제, 자금문제, 사업 방향성 문제, 성장문제, 조직문제 등 온갖 문제들에 휩싸여 뭐 먼저 해야할지조차 모르겠는 정신적인 마비상태를 종종 겪어가고 있겠지만서도, 그 과정에서 한줄기의 빛을 찾으려 밤잠 설치고, 하나의 문제만큼은 내일 기어이 풀어내리 다짐도 할것이며, 더 밝은 한달뒤를 떠올리고, 주위에 믿고 응원해주는 가족들, 임직원들, 친구들의 얼굴을 떠올리며 오늘 받았던 상처와 아픔 훌훌 털고 일어나고 있을거다. 같은 창업자로써 내일이 오늘보다 결코 더 나아질거라는 이야기는 차마 못하겠으나, 이 또한 지나갈거라는 말, 애써 이 과정이 엄청난 성장의 초석이 되는 시기라는 말 또한 기어코 해주고싶다. 세상에서 가장 큰 꿈을 품었으나, 가장 외로울수도 있을법한 그대들을 응원하며..!`,
    comments: [],
  },
];

interface StoredComment {
  id: string;
  name: string;
  comment: string;
  timestamp: number;
  approved: boolean;
}

export default function PrinciplesPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'values' | 'lessons'>('values');
  const [selectedLesson, setSelectedLesson] = useState<string | null>(null);
  const [commentForm, setCommentForm] = useState({ name: '', comment: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);
  const [comments, setComments] = useState<StoredComment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const selectedLessonData = lessons.find(l => l.id === selectedLesson);

  // 댓글 불러오기
  const fetchComments = async (lessonId: string) => {
    setLoadingComments(true);
    try {
      const response = await fetch(`/api/comment?lessonId=${lessonId}`);
      const data = await response.json();
      
      if (data.success) {
        setComments(data.comments || []);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  // 레슨 선택 시 댓글 불러오기
  useEffect(() => {
    if (selectedLesson) {
      fetchComments(selectedLesson);
    }
  }, [selectedLesson]);

  const handleCommentSubmit = async () => {
    if (!commentForm.name.trim() || !commentForm.comment.trim()) {
      setSubmitMessage('이름과 댓글을 모두 입력해주세요.');
      return;
    }

    if (!selectedLessonData) return;

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const response = await fetch('/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: commentForm.name,
          comment: commentForm.comment,
          lessonId: selectedLessonData.id,
          lessonTitle: selectedLessonData.title,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(data.message || '댓글이 접수되었습니다!');
        setCommentForm({ name: '', comment: '' });
        // 댓글 목록 새로고침
        if (selectedLessonData) {
          fetchComments(selectedLessonData.id);
        }
      } else {
        setSubmitMessage(data.error || '댓글 전송에 실패했습니다.');
      }
    } catch (error) {
      console.error('Comment submission error:', error);
      setSubmitMessage('댓글 전송에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
                      댓글 <span className="text-gray-400 font-normal text-sm">({comments.length})</span>
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
                        <button 
                          onClick={handleCommentSubmit}
                          disabled={isSubmitting}
                          className="bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isSubmitting ? '전송 중...' : '등록'}
                        </button>
                      </div>
                      
                      {/* Submit Message */}
                      {submitMessage && (
                        <div className={`mt-3 p-3 rounded-lg text-sm ${
                          submitMessage.includes('실패') || submitMessage.includes('입력') 
                            ? 'bg-red-50 text-red-600' 
                            : 'bg-green-50 text-green-600'
                        }`}>
                          {submitMessage}
                        </div>
                      )}
                    </div>

                    {/* Comments List */}
                    {loadingComments ? (
                      <p className="text-center text-gray-400 py-8">
                        댓글을 불러오는 중...
                      </p>
                    ) : comments.length === 0 ? (
                      <p className="text-center text-gray-400 py-8">
                        첫 번째 댓글을 남겨주세요
                      </p>
                    ) : (
                      <div className="space-y-4">
                        {comments.map((comment) => (
                          <div key={comment.id} className="bg-white rounded-lg p-4 border border-gray-100">
                            <div className="flex items-start justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                                  <span className="text-amber-600 text-sm font-medium">
                                    {comment.name.charAt(0)}
                                  </span>
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-gray-800">{comment.name}</p>
                                  <p className="text-xs text-gray-400">
                                    {new Date(comment.timestamp).toLocaleDateString('ko-KR', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </p>
                                </div>
                              </div>
                            </div>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{comment.comment}</p>
                          </div>
                        ))}
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
