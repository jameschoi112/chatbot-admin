import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  Calendar,
  User,
  Activity,
  Copy,
  Eye,
  EyeOff,
  Check,
  ToggleLeft,
  ToggleRight,
  MessageCircle,
  MessageSquare,
  Slack,
  Upload,
  FileText,
  Trash2,
  AlertTriangle,
  ExternalLink,
  RefreshCw,
  X,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Database,
  Settings,
  Code,
  BarChart2,
  Cloud,
  BookOpen,
  Info,
  Star,
  Clock,
  Target,
  Album,
  Key
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Chat from '../../components/Chat';
import BotChatModal from './BotChatModal';

// 임시 봇 데이터
const botData = [
  {
    id: 1,
    name: '고객 지원 봇',
    status: 'active',
    description: '고객 문의에 자동으로 응답하고 FAQ를 처리하는 봇입니다. 온라인 쇼핑몰에서 발생하는 주문, 결제, 배송, 교환/환불 관련 질문을 처리하고, 필요 시 담당자에게 연결해주는 기능을 제공합니다.',
    created: '2025-02-25',
    creator: '김관리자',
    usageCount: 1723,
    lastUsed: '2025-03-01',
    apiKey: 'sk-abcd1234efgh5678ijkl9012mnop3456qrst7890',
    messengers: {
      telegram: { enabled: true, username: '@customer_support_bot' },
      kakao: { enabled: false, key: '' },
      slack: { enabled: true, workspace: 'cplabs' }
    },
    documents: [
      { id: 1, name: '고객 응대 가이드라인.pdf', size: '2.4MB', uploadDate: '2025-02-26' },
      { id: 2, name: 'FAQ 데이터.xlsx', size: '1.8MB', uploadDate: '2025-02-26' },
      { id: 3, name: '주문 처리 절차.docx', size: '1.2MB', uploadDate: '2025-02-27' }
    ],
    model: 'gpt-4',
    stats: {
      dailyUsage: [12, 18, 22, 19, 24, 31, 28],
      responseTime: 2.4,
      accuracy: 92,
      satisfaction: 4.7
    },
    settings: {
      temperature: 0.7,
      maxTokens: 800,
      topP: 0.9
    }
  },
  {
    id: 2,
    name: '제품 안내 봇',
    status: 'active',
    description: '회사 제품에 대한 정보를 제공하고 기능을 안내하는 봇입니다.',
    created: '2025-02-24',
    creator: '이마케팅',
    usageCount: 945,
    lastUsed: '2025-03-02',
    apiKey: 'sk-uvwx5678yzab9012cdef3456ghij7890klmn1234',
    messengers: {
      telegram: { enabled: false, username: '' },
      kakao: { enabled: true, key: 'kakao_12345' },
      slack: { enabled: false, workspace: '' }
    },
    documents: [
      { id: 4, name: '제품 카탈로그.pdf', size: '4.2MB', uploadDate: '2025-02-24' },
      { id: 5, name: '기능 설명서.docx', size: '2.1MB', uploadDate: '2025-02-25' }
    ],
    model: 'gpt-4',
    stats: {
      dailyUsage: [8, 13, 15, 18, 16, 19, 22],
      responseTime: 1.8,
      accuracy: 88,
      satisfaction: 4.3
    },
    settings: {
      temperature: 0.5,
      maxTokens: 1000,
      topP: 0.95
    }
  }
  // 다른 봇 데이터...
];

// 차트 데이터 포맷팅 함수
const formatChartData = (dailyUsage) => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return days.map((day, index) => ({
    day,
    usage: dailyUsage[index]
  }));
};

const BotDetail = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'api', 'messengers', 'documents', 'settings'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState(false);
  const [showRegenerateKeyConfirm, setShowRegenerateKeyConfirm] = useState(false);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
  const [expandedSettings, setExpandedSettings] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showChatModal, setShowChatModal] = useState(false);

  useEffect(() => {
    // 실제 구현에서는 API 호출을 통해 봇 정보를 가져오겠지만, 여기서는 임시 데이터 사용
    const fetchBot = () => {
      setLoading(true);

      try {
        const foundBot = botData.find(b => b.id === parseInt(botId));

        if (foundBot) {
          setBot(foundBot);
        } else {
          setError('해당 봇을 찾을 수 없습니다.');
        }
      } catch (err) {
        setError('봇 정보를 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        // 로딩 애니메이션을 위한 지연
        setTimeout(() => {
          setLoading(false);
          setIsLoading(false);
        }, 800);
      }
    };

    fetchBot();
  }, [botId]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const copyApiKey = () => {
    navigator.clipboard.writeText(bot.apiKey)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(err => {
        console.error('API 키 복사 실패:', err);
      });
  };

  const toggleShowApiKey = () => {
    setShowApiKey(!showApiKey);
  };

  const handleNavigateBack = () => {
    navigate('/bots');
  };

  const handleRegenerateKey = () => {
    setShowRegenerateKeyConfirm(true);
  };

  const confirmRegenerateKey = () => {
    setRegeneratingKey(true);
    setShowRegenerateKeyConfirm(false);

    // 실제 구현에서는 API 호출로 새 키를 생성할 것입니다.
    // 여기서는 시뮬레이션만 합니다.
    setTimeout(() => {
      const newApiKey = 'sk-' + Math.random().toString(36).substring(2, 15) +
                       Math.random().toString(36).substring(2, 15);

      setBot(prev => ({
        ...prev,
        apiKey: newApiKey
      }));

      setRegeneratingKey(false);
      setShowApiKey(true); // 새 키를 생성한 후 자동으로 표시
    }, 1500);
  };

  const handleDeleteBot = () => {
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    // 실제 구현에서는 API 호출로 봇을 삭제할 것입니다.
    console.log(`봇 삭제: ${bot.name} (ID: ${bot.id})`);
    setShowDeleteConfirm(false);

    // 삭제 후 목록 페이지로 이동
    navigate('/bots');
  };

  const toggleBotStatus = () => {
    // 실제 구현에서는 API 호출로 상태를 변경할 것입니다.
    setBot(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active'
    }));
  };

  const toggleMessengerStatus = (messenger) => {
    // 실제 구현에서는 API 호출로 메신저 연동 상태를 변경할 것입니다.
    setBot(prev => ({
      ...prev,
      messengers: {
        ...prev.messengers,
        [messenger]: {
          ...prev.messengers[messenger],
          enabled: !prev.messengers[messenger].enabled
        }
      }
    }));
  };

  const handleFileUpload = (e) => {
    e.preventDefault();

    // 실제 구현에서는 파일 업로드 API 호출을 할 것입니다.
    console.log('파일 업로드 요청');

    // 업로드 완료 시뮬레이션
    setTimeout(() => {
      setFileUploadOpen(false);

      // 임시로 새 문서 추가 (실제 구현에서는 응답에서 받은 문서 정보를 추가)
      const newDocument = {
        id: Math.floor(Math.random() * 1000),
        name: '새 문서.pdf',
        size: '1.5MB',
        uploadDate: new Date().toISOString().split('T')[0]
      };

      setBot(prev => ({
        ...prev,
        documents: [newDocument, ...prev.documents]
      }));
    }, 1500);
  };

  const deleteDocument = (docId) => {
    // 실제 구현에서는 문서 삭제 API 호출을 할 것입니다.
    setBot(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== docId)
    }));
  };

  const toggleSetting = (setting) => {
    setExpandedSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

  const openChatModal = () => {
    setShowChatModal(true);
  };

  if (loading) {
    return (
      <Layout activeMenu="bots">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
              <Bot size={32} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sky-500" />
            </div>
            <p className="mt-4 text-gray-600 animate-pulse">봇 정보를 불러오는 중...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !bot) {
    return (
      <Layout activeMenu="bots">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{error || '봇을 찾을 수 없습니다'}</h2>
          <p className="text-gray-600 mb-6">요청한 봇 정보를 가져올 수 없습니다.</p>
          <button
            onClick={handleNavigateBack}
            className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors shadow-md"
          >
            <ArrowLeft size={18} className="mr-2" />
            봇 목록으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  // 챠트 데이터 준비
  const chartData = formatChartData(bot.stats.dailyUsage);

  return (
    <>
      <Layout activeMenu="bots">
        <div className="container mx-auto px-4 py-6 space-y-6 relative">
          {/* 애니메이션 효과를 위한 배경 요소들 */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <div className="absolute top-20 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="absolute top-40 right-10 w-64 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="absolute bottom-20 left-1/3 w-64 h-64 bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
          </div>

          {/* 상단 네비게이션 */}
          <div className="flex items-center mb-2 z-10 relative">
            <button
              onClick={handleNavigateBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span className="text-sm">목록</span>
            </button>
            <nav className="text-sm breadcrumbs">
              <ul className="flex items-center space-x-2">
                <li className="text-gray-500">봇 관리</li>
                <li>
                  <ChevronRight size={14} className="inline" />
                </li>
                <li className="text-sky-600 font-medium">{bot.name}</li>
              </ul>
            </nav>
          </div>

          {/* 헤더 영역 */}
          <div className={`relative rounded-2xl overflow-hidden shadow-lg transition-all duration-500 ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            {/* 헤더 배경 */}
            <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700"></div>

            {/* 헤더 콘텐츠 */}
            <div className="relative p-8 text-white z-10">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <Bot size={28} className="text-white" />
                    </div>
                    <div>
                      <h1 className="text-2xl font-bold">{bot.name}</h1>
                      <div className="flex items-center mt-1 space-x-3">
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          bot.status === 'active'
                            ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                            : 'bg-gray-500/20 text-gray-100 border border-gray-400/30'
                        }`}>
                          {bot.status === 'active' ? '활성' : '비활성'}
                        </span>
                        <span className="text-xs text-white/70 flex items-center">
                          <Calendar size={12} className="mr-1" /> {bot.created} 생성
                        </span>
                        <span className="text-xs text-white/70 flex items-center">
                          <User size={12} className="mr-1" /> {bot.creator}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-white/90 max-w-3xl leading-relaxed mt-2">
                    {bot.description}
                  </p>
                </div>

                {/* 우측 상단 버튼 영역 */}
                <div className="flex flex-col space-y-3">
                  <button
                    onClick={openChatModal}
                    className="flex items-center px-4 py-2 bg-white text-sky-700 rounded-lg hover:bg-white/90 transition-all shadow-md animate-fadeIn"
                  >
                    <MessageCircle size={18} className="mr-2" />
                    <span>봇과 대화하기</span>
                  </button>

                  <div className="flex space-x-2">
                    <button
                      onClick={toggleBotStatus}
                      className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                        bot.status === 'active'
                          ? 'bg-red-500/20 text-white hover:bg-red-500/30 border border-red-400/30'
                          : 'bg-green-500/20 text-white hover:bg-green-500/30 border border-green-400/30'
                      }`}
                    >
                      {bot.status === 'active' ? '비활성화' : '활성화'}
                    </button>
                    <button
                      onClick={handleDeleteBot}
                      className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-colors border border-red-400/30"
                    >
                      삭제
                    </button>
                  </div>
                </div>
              </div>

              {/* 간단한 통계 지표 */}
              <div className="grid grid-cols-4 gap-4 mt-8">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white/80">누적 사용량</h3>

                  </div>
                  <p className="text-2xl font-bold mt-1">{bot.usageCount.toLocaleString()}회</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white/80">평균 응답시간</h3>

                  </div>
                  <p className="text-2xl font-bold mt-1">{bot.stats.responseTime}초</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white/80">정확도</h3>

                  </div>
                  <p className="text-2xl font-bold mt-1">{bot.stats.accuracy}%</p>
                </div>

                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-medium text-white/80">만족도</h3>
                    <Star size={16} className="text-white/60" />
                  </div>
                  <p className="text-2xl font-bold mt-1">{bot.stats.satisfaction}/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-500 ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <div className="flex border-b border-gray-200">
              <button
                onClick={() => handleTabChange('overview')}
                className={`flex items-center py-4 px-6 text-sm font-medium ${
                  activeTab === 'overview'
                    ? 'text-sky-600 border-b-2 border-sky-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <Album size={16} className="mr-2" />
                개요
              </button>

              <button
                onClick={() => handleTabChange('api')}
                className={`flex items-center py-4 px-6 text-sm font-medium ${
                  activeTab === 'api'
                    ? 'text-sky-600 border-b-2 border-sky-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <Code size={16} className="mr-2" />
                API 연동
              </button>

              <button
                onClick={() => handleTabChange('messengers')}
                className={`flex items-center py-4 px-6 text-sm font-medium ${
                  activeTab === 'messengers'
                    ? 'text-sky-600 border-b-2 border-sky-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <MessageCircle size={16} className="mr-2" />
                메신저 연동
              </button>

              <button
                onClick={() => handleTabChange('documents')}
                className={`flex items-center py-4 px-6 text-sm font-medium ${
                  activeTab === 'documents'
                    ? 'text-sky-600 border-b-2 border-sky-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <FileText size={16} className="mr-2" />
                문서 관리
              </button>

              <button
                onClick={() => handleTabChange('settings')}
                className={`flex items-center py-4 px-6 text-sm font-medium ${
                  activeTab === 'settings'
                    ? 'text-sky-600 border-b-2 border-sky-500'
                    : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } transition-colors`}
              >
                <Settings size={16} className="mr-2" />
                설정
              </button>
            </div>

            {/* 개요 탭 */}
            {activeTab === 'overview' && (
              <div className="p-6 animate-fadeIn">
                <div className="grid grid-cols-3 gap-6">
                  {/* 왼쪽 섹션 - 일일 사용량 차트 */}
                  <div className="col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">

                      일별 사용량
                    </h2>
                    <div className="h-64 w-full">
                      {/* 실제 구현에서는 Chart.js나 recharts 등을 사용하여 차트 구현 */}
                      <div className="h-full w-full flex items-end justify-between">
                        {chartData.map((item, index) => (
                          <div key={index} className="flex flex-col items-center">
                            <div
                              className="w-12 bg-gradient-to-t from-sky-500 to-blue-600 rounded-t-lg transition-all duration-500 hover:from-sky-600 hover:to-blue-700"
                              style={{
                                height: `${(item.usage / Math.max(...bot.stats.dailyUsage)) * 160}px`,
                                animation: `growUp 0.8s ease-out ${index * 0.1}s forwards`,
                                opacity: 0,
                                transform: 'translateY(20px)'
                              }}
                            ></div>
                            <div className="text-xs mt-2 text-gray-600">{item.day}</div>
                            <div className="text-xs font-medium text-gray-800">{item.usage}회</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 오른쪽 섹션 - 모델 정보 및 성능 지표 */}
                  <div className="space-y-6">
                    {/* 모델 정보 카드 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Cloud size={18} className="text-sky-500 mr-2" />
                        모델 정보
                      </h2>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">사용 중인 모델</span>
                          <span className="font-medium text-gray-800">{bot.model}</span>
                        </div>
                        <div className="flex justify-between items-center py-2 border-b border-gray-100">
                          <span className="text-gray-600">마지막 업데이트</span>
                          <span className="font-medium text-gray-800">{bot.lastUsed}</span>
                        </div>
                        <div className="flex justify-between items-center py-2">
                          <span className="text-gray-600">문서 수</span>
                          <span className="font-medium text-gray-800">{bot.documents.length}개</span>
                        </div>
                      </div>
                    </div>

                    {/* 성능 지표 카드 */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Activity size={18} className="text-sky-500 mr-2" />
                        성능 지표
                      </h2>

                      {/* 정확도 프로그레스 바 */}
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">정확도</span>
                          <span className="text-sm font-medium text-gray-800">{bot.stats.accuracy}%</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-green-500 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${bot.stats.accuracy}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* 응답 시간 프로그레스 바 */}
                      <div className="mb-4">
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">응답 시간</span>
                          <span className="text-sm font-medium text-gray-800">{bot.stats.responseTime}초</span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2.5">
                          <div
                            className="bg-blue-500 h-2.5 rounded-full transition-all duration-1000"
                            style={{ width: `${(bot.stats.responseTime / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* 사용자 만족도 별점 */}
                      <div>
                        <div className="flex justify-between mb-1">
                          <span className="text-sm text-gray-600">만족도</span>
                          <span className="text-sm font-medium text-gray-800">{bot.stats.satisfaction}/5</span>
                        </div>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              size={18}
                              className={`${star <= bot.stats.satisfaction ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'} transition-all duration-300`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 메신저 연동 상태 요약 */}
                <div className="mt-6 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <MessageCircle size={18} className="text-sky-500 mr-2" />
                    메신저 연동 상태
                  </h2>
                  <div className="grid grid-cols-3 gap-4">
                    <div className={`flex items-center p-4 rounded-lg ${bot.messengers.telegram.enabled ? 'bg-blue-50 border border-blue-100' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bot.messengers.telegram.enabled ? 'bg-blue-100' : 'bg-gray-200'}`}>
                        <MessageCircle size={18} className={bot.messengers.telegram.enabled ? 'text-blue-600' : 'text-gray-500'} />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">텔레그램</div>
                        <div className="text-sm">{bot.messengers.telegram.enabled ? '연동됨' : '연동 안됨'}</div>
                      </div>
                    </div>

                    <div className={`flex items-center p-4 rounded-lg ${bot.messengers.kakao.enabled ? 'bg-yellow-50 border border-yellow-100' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bot.messengers.kakao.enabled ? 'bg-yellow-100' : 'bg-gray-200'}`}>
                        <MessageSquare size={18} className={bot.messengers.kakao.enabled ? 'text-yellow-600' : 'text-gray-500'} />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">카카오톡</div>
                        <div className="text-sm">{bot.messengers.kakao.enabled ? '연동됨' : '연동 안됨'}</div>
                      </div>
                    </div>

                    <div className={`flex items-center p-4 rounded-lg ${bot.messengers.slack.enabled ? 'bg-purple-50 border border-purple-100' : 'bg-gray-50 border border-gray-100'}`}>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${bot.messengers.slack.enabled ? 'bg-purple-100' : 'bg-gray-200'}`}>
                        <Slack size={18} className={bot.messengers.slack.enabled ? 'text-purple-600' : 'text-gray-500'} />
                      </div>
                      <div className="ml-3">
                        <div className="font-medium">슬랙</div>
                        <div className="text-sm">{bot.messengers.slack.enabled ? '연동됨' : '연동 안됨'}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* API 연동 탭 */}
            {activeTab === 'api' && (
              <div className="p-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Code size={20} className="text-sky-500 mr-2" />
                  API 연동 정보
                </h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                  <label className="block text-md font-medium text-gray-800 mb-3 flex items-center">
                    <Key size={18} className="text-sky-500 mr-2" />
                    API 키
                  </label>
                  <div className="flex items-center">
                    <div className="relative flex-grow">
                      <input
                        type={showApiKey ? "text" : "password"}
                        readOnly
                        value={bot.apiKey}
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none shadow-sm font-mono text-gray-700"
                      />
                      <button
                        onClick={toggleShowApiKey}
                        className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
                      >
                        {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <button
                      onClick={copyApiKey}
                      className={`ml-3 px-4 py-3 flex items-center rounded-lg transition-all ${
                        copied
                          ? 'bg-green-500 text-white'
                          : 'bg-sky-500 text-white hover:bg-sky-600'
                      }`}
                    >
                      {copied ? <Check size={18} className="mr-1" /> : <Copy size={18} className="mr-1" />}
                      {copied ? '복사됨' : '복사'}
                    </button>
                  </div>
                  <p className="mt-3 text-sm text-gray-600 flex items-start">
                    <Info size={16} className="text-sky-500 mr-2 mt-0.5 flex-shrink-0" />
                    이 API 키는 봇을 프로그래밍 방식으로 사용하기 위한 인증 정보입니다. 안전하게 보관하세요.
                  </p>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-800 flex items-center">
                      <RefreshCw size={18} className="text-sky-500 mr-2" />
                      키 관리
                    </h3>
                    <button
                      onClick={handleRegenerateKey}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
                      disabled={regeneratingKey}
                    >
                      {regeneratingKey ? (
                        <>
                          <RefreshCw size={18} className="mr-2 animate-spin" />
                          키 재생성 중...
                        </>
                      ) : (
                        <>
                          <RefreshCw size={18} className="mr-2" />
                          API 키 재생성
                        </>
                      )}
                    </button>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                    <div className="flex">
                      <AlertTriangle size={20} className="text-amber-500 mr-3 flex-shrink-0" />
                      <div>
                        <p className="text-sm text-amber-700">
                          API 키를 재생성하면 기존 키는 더 이상 사용할 수 없게 됩니다.
                          이 작업은 되돌릴 수 없으며, 모든 연동 서비스에서 새 키로 업데이트해야 합니다.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                    <Code size={18} className="text-sky-500 mr-2" />
                    API 사용 예시
                  </h3>
                  <div className="bg-gray-800 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto shadow-md">
                    <pre className="animate-fadeIn">
{`curl -X POST https://api.cplabs.ai/v1/bots/${bot.id}/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${bot.apiKey}" \\
  -d '{"messages": [{"role": "user", "content": "안녕하세요"}]}'`}
                    </pre>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <p className="text-sm text-gray-600 flex items-center">
                      <Info size={16} className="text-sky-500 mr-2" />
                      API 문서에서 더 자세한 사용 방법을 확인할 수 있습니다.
                    </p>
                    <a href="#" className="text-sky-600 hover:text-sky-800 text-sm font-medium inline-flex items-center transition-colors">
                      API 문서 보기 <ExternalLink size={14} className="ml-1" />
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* 메신저 연동 탭 */}
            {activeTab === 'messengers' && (
              <div className="p-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <MessageCircle size={20} className="text-sky-500 mr-2" />
                  메신저 연동 설정
                </h2>

                <div className="space-y-6">
                  {/* 텔레그램 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                          <MessageCircle size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">텔레그램</h3>
                          <p className="text-sm text-gray-500">직접 메시지 및 그룹 채팅 지원</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMessengerStatus('telegram')}
                        className="focus:outline-none"
                      >
                        {bot.messengers.telegram.enabled ? (
                          <ToggleRight size={36} className="text-sky-500" />
                        ) : (
                          <ToggleLeft size={36} className="text-gray-300" />
                        )}
                      </button>
                    </div>

                    {bot.messengers.telegram.enabled ? (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-500 mr-3">사용자명:</span>
                          <span className="font-mono font-medium">{bot.messengers.telegram.username}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          이 봇은 현재 텔레그램에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
                        </p>
                        <button className="mt-2 text-sky-500 hover:text-sky-600 text-sm font-medium flex items-center transition-colors">
                          텔레그램 설정 변경 <ExternalLink size={14} className="ml-1" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center bg-gray-50 p-4 rounded-lg justify-center border border-gray-200">
                          <p className="text-gray-500">이 봇은 현재 텔레그램과 연동되어 있지 않습니다</p>
                        </div>
                        <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors">
                          <MessageCircle size={18} className="mr-2" />
                          텔레그램 연동 설정
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 카카오톡 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                          <MessageSquare size={24} className="text-yellow-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">카카오톡</h3>
                          <p className="text-sm text-gray-500">스마트 채팅 및 비즈니스 채널</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMessengerStatus('kakao')}
                        className="focus:outline-none"
                      >
                        {bot.messengers.kakao.enabled ? (
                          <ToggleRight size={36} className="text-sky-500" />
                        ) : (
                          <ToggleLeft size={36} className="text-gray-300" />
                        )}
                      </button>
                    </div>

                    {bot.messengers.kakao.enabled ? (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-500 mr-3">API 키:</span>
                          <span className="font-mono font-medium">{bot.messengers.kakao.key}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          이 봇은 현재 카카오톡에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
                        </p>
                        <button className="mt-2 text-sky-500 hover:text-sky-600 text-sm font-medium flex items-center transition-colors">
                          카카오톡 설정 변경 <ExternalLink size={14} className="ml-1" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center bg-gray-50 p-4 rounded-lg justify-center border border-gray-200">
                          <p className="text-gray-500">이 봇은 현재 카카오톡과 연동되어 있지 않습니다</p>
                        </div>
                        <button className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors">
                          <MessageSquare size={18} className="mr-2" />
                          카카오톡 연동 설정
                        </button>
                      </div>
                    )}
                  </div>

                  {/* 슬랙 */}
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                    <div className="flex justify-between items-center mb-4">
                      <div className="flex items-center">
                        <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                          <Slack size={24} className="text-purple-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-medium text-gray-800">슬랙</h3>
                          <p className="text-sm text-gray-500">팀 커뮤니케이션 및 워크스페이스 통합</p>
                        </div>
                      </div>
                      <button
                        onClick={() => toggleMessengerStatus('slack')}
                        className="focus:outline-none"
                      >
                        {bot.messengers.slack.enabled ? (
                          <ToggleRight size={36} className="text-sky-500" />
                        ) : (
                          <ToggleLeft size={36} className="text-gray-300" />
                        )}
                      </button>
                    </div>

                    {bot.messengers.slack.enabled ? (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center bg-gray-50 p-3 rounded-lg">
                          <span className="text-gray-500 mr-3">워크스페이스:</span>
                          <span className="font-mono font-medium">{bot.messengers.slack.workspace}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          이 봇은 현재 슬랙에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
                        </p>
                        <button className="mt-2 text-sky-500 hover:text-sky-600 text-sm font-medium flex items-center transition-colors">
                          슬랙 설정 변경 <ExternalLink size={14} className="ml-1" />
                        </button>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4">
                        <div className="flex items-center bg-gray-50 p-4 rounded-lg justify-center border border-gray-200">
                          <p className="text-gray-500">이 봇은 현재 슬랙과 연동되어 있지 않습니다</p>
                        </div>
                        <button className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors">
                          <Slack size={18} className="mr-2" />
                          슬랙 연동 설정
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 문서 관리 탭 */}
            {activeTab === 'documents' && (
              <div className="p-6 animate-fadeIn">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FileText size={20} className="text-sky-500 mr-2" />
                    문서 관리
                  </h2>
                  <button
                    onClick={() => setFileUploadOpen(true)}
                    className="flex items-center px-4 py-2 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm"
                  >
                    <Upload size={18} className="mr-2" />
                    문서 업로드
                  </button>
                </div>

                {bot.documents.length > 0 ? (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              파일명
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              크기
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              업로드 날짜
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              작업
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {bot.documents.map((doc, index) => (
                            <tr
                              key={doc.id}
                              className="hover:bg-gray-50 transition-colors"
                              style={{
                                animation: `fadeIn 0.3s ease-out ${index * 0.05}s forwards`,
                                opacity: 0
                              }}
                            >
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <FileText size={18} className="text-gray-400 mr-3" />
                                  <span className="text-sm font-medium text-gray-900">{doc.name}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {doc.size}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {doc.uploadDate}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-3">
                                  <button
                                    className="text-sky-600 hover:text-sky-900 transition-colors p-1 hover:bg-sky-50 rounded"
                                    title="문서 다운로드"
                                  >
                                    <ExternalLink size={18} />
                                  </button>
                                  <button
                                    onClick={() => deleteDocument(doc.id)}
                                    className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded"
                                    title="삭제"
                                  >
                                    <Trash2 size={18} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-sm border border-gray-100">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                      <FileText size={36} className="text-gray-400" />
                    </div>
                    <p className="text-gray-600 mb-2 text-lg">업로드된 문서가 없습니다</p>
                    <p className="text-sm text-gray-500 max-w-md">
                      봇이 참조할 문서를 업로드하여 더 정확한 정보를 제공할 수 있게 합니다.
                    </p>
                    <button
                      onClick={() => setFileUploadOpen(true)}
                      className="mt-6 flex items-center px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                    >
                      <Upload size={18} className="mr-2" />
                      문서 업로드
                    </button>
                  </div>
                )}

                <div className="mt-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
                  <div className="flex items-start">
                    <Info size={24} className="text-blue-600 mr-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-blue-800 font-medium mb-2">
                        문서 관리에 대한 안내
                      </p>
                      <ul className="list-disc text-sm text-blue-700 pl-5 space-y-1">
                        <li>PDF, DOCX, TXT, CSV 파일 형식을 지원합니다</li>
                        <li>최대 파일 크기는 50MB입니다</li>
                        <li>업로드된 문서는 자동으로 색인화되어 AI 봇의 응답에 참조됩니다</li>
                        <li>민감한 정보가 포함된 문서는 업로드하지 마세요</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* 설정 탭 */}
            {activeTab === 'settings' && (
              <div className="p-6 animate-fadeIn">
                <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                  <Settings size={20} className="text-sky-500 mr-2" />
                  봇 설정
                </h2>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                  <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                    <Database size={18} className="text-sky-500 mr-2" />
                    모델 설정
                  </h3>

                  <div className="space-y-4">
                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Temperature</label>
                        <span className="text-sm font-medium text-gray-700">{bot.settings.temperature}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.1"
                        value={bot.settings.temperature}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">낮을수록 일관된 응답, 높을수록 다양한 응답을 생성합니다.</p>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Maximum Tokens</label>
                        <span className="text-sm font-medium text-gray-700">{bot.settings.maxTokens}</span>
                      </div>
                      <input
                        type="range"
                        min="100"
                        max="4000"
                        step="100"
                        value={bot.settings.maxTokens}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">응답의 최대 길이를 제한합니다.</p>
                    </div>

                    <div className="flex flex-col">
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-sm font-medium text-gray-700">Top P</label>
                        <span className="text-sm font-medium text-gray-700">{bot.settings.topP}</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.05"
                        value={bot.settings.topP}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-sky-500"
                      />
                      <p className="mt-1 text-xs text-gray-500">낮을수록 더 결정적인 응답, 높을수록 더 다양한 응답을 생성합니다.</p>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-md font-medium text-gray-800 flex items-center">
                      <Bot size={18} className="text-sky-500 mr-2" />
                      봇 행동 설정
                    </h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <h4 className="font-medium text-gray-800">시스템 프롬프트</h4>
                        <p className="text-sm text-gray-500 mt-1">봇의 동작과 성격을 정의하는 지시문</p>
                      </div>
                      <button className="text-sky-500 hover:text-sky-600 transition-colors">
                        편집
                      </button>
                    </div>

                    <div className="flex items-center justify-between py-3 border-b border-gray-100">
                      <div>
                        <h4 className="font-medium text-gray-800">색인 업데이트 빈도</h4>
                        <p className="text-sm text-gray-500 mt-1">봇이 문서를 재색인화하는 주기</p>
                      </div>
                      <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm">
                        <option>매일</option>
                        <option>매주</option>
                        <option>매월</option>
                        <option>수동</option>
                      </select>
                    </div>

                    <div className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="font-medium text-gray-800">자동 학습</h4>
                        <p className="text-sm text-gray-500 mt-1">대화 데이터를 활용한 자동 개선 여부</p>
                      </div>
                      <button className="focus:outline-none">
                        <ToggleRight size={36} className="text-sky-500" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>

      {/* 봇 채팅 모달 */}
      <BotChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        bot={bot}
      />

      {/* 파일 업로드 모달 */}
      {fileUploadOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-lg mx-auto animate-scale-up w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center">
                <Upload size={20} className="text-sky-500 mr-2" />
                문서 업로드
              </h3>
              <button
                onClick={() => setFileUploadOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-6">
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  파일 선택
                </label>
                <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="space-y-3 text-center">
                    <Upload size={36} className="mx-auto text-gray-400" />
                    <div className="flex text-sm text-gray-600 justify-center">
                      <label
                        htmlFor="file-upload"
                        className="relative cursor-pointer bg-white rounded-md font-medium text-sky-600 hover:text-sky-500 focus-within:outline-none"
                      >
                        <span>파일 선택</span>
                        <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                      </label>
                      <p className="pl-1">또는 여기로 파일을 끌어오세요</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOCX, TXT, CSV 파일 (최대 50MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex">
                  <Info size={18} className="text-blue-600 mr-2 flex-shrink-0" />
                  <div className="text-sm text-blue-700">
                    <p>
                      업로드된 문서는 봇의 지식베이스에 추가되어 더 정확한 응답을 제공합니다.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setFileUploadOpen(false)}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow-sm transition-colors flex items-center"
                >
                  <Upload size={18} className="mr-2" />
                  업로드
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-auto animate-scale-up">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={36} className="text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">봇 삭제 확인</h3>
              <p className="text-gray-600 mb-6">
                '{bot.name}' 봇을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API 키 재생성 확인 모달 */}
      {showRegenerateKeyConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md mx-auto animate-scale-up">
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={36} className="text-amber-500" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">API 키 재생성 확인</h3>
              <p className="text-gray-600 mb-6">
                API 키를 재생성하면 기존 키는 무효화됩니다. 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowRegenerateKeyConfirm(false)}
                className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
              >
                취소
              </button>
              <button
                onClick={confirmRegenerateKey}
                className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-colors font-medium shadow-sm"
              >
                재생성
              </button>
            </div>
          </div>
        </div>
      )}

      <Chat />
    </>
  );
};

export default BotDetail;