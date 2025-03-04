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
  X
} from 'lucide-react';
import Layout from '../../components/layout/Layout'; // 이전: '../components/layout/Layout'
import Chat from '../../components/Chat'; // 이전: '../components/Chat'

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
    model: 'gpt-4'
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
    model: 'gpt-4'
  },
  // 다른 봇 데이터...
];

const BotDetail = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('info'); // 'info', 'api', 'messengers', 'documents'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState(false);
  const [showRegenerateKeyConfirm, setShowRegenerateKeyConfirm] = useState(false);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);

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
        setLoading(false);
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

  if (loading) {
    return (
      <Layout activeMenu="bots">
        <div className="flex items-center justify-center h-full">
          <div className="w-12 h-12 border-4 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </Layout>
    );
  }

  if (error || !bot) {
    return (
      <Layout activeMenu="bots">
        <div className="flex flex-col items-center justify-center h-full">
          <AlertTriangle size={64} className="text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">{error || '봇을 찾을 수 없습니다'}</h2>
          <p className="text-gray-600 mb-6">요청한 봇 정보를 가져올 수 없습니다.</p>
          <button
            onClick={handleNavigateBack}
            className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors"
          >
            <ArrowLeft size={18} className="mr-2" />
            봇 목록으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout activeMenu="bots">
        <div className="container mx-auto px-4 py-6">
          {/* 상단 네비게이션 */}
          <div className="mb-6">
            <button
              onClick={handleNavigateBack}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft size={20} className="mr-2" />
              <span>봇 목록으로 돌아가기</span>
            </button>
          </div>

          {/* 헤더 영역 */}
          <div className="mb-8">
            <div className="flex items-center mb-2">
              <h1 className="text-2xl font-bold text-gray-800 mr-3">{bot.name}</h1>
              <span className={`px-2 py-1 rounded-full text-xs border ${
                bot.status === 'active'
                  ? 'border-green-500 text-green-700'
                  : 'border-gray-400 text-gray-600'
              }`}>
                {bot.status === 'active' ? '활성' : '비활성'}
              </span>
            </div>

            <p className="text-gray-600 mb-4">{bot.description}</p>

            <div className="flex space-x-3">
              <button
                onClick={toggleBotStatus}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  bot.status === 'active'
                    ? 'bg-red-50 text-red-600 hover:bg-red-100'
                    : 'bg-green-50 text-green-600 hover:bg-green-100'
                }`}
              >
                {bot.status === 'active' ? '비활성화' : '활성화'}
              </button>
              <button
                onClick={handleDeleteBot}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                봇 삭제
              </button>
            </div>
          </div>

          {/* 탭 네비게이션 */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="flex space-x-8">
              <button
                onClick={() => handleTabChange('info')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'info'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                봇 정보
              </button>
              <button
                onClick={() => handleTabChange('api')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'api'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                API 연동
              </button>
              <button
                onClick={() => handleTabChange('messengers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'messengers'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                메신저 연동
              </button>
              <button
                onClick={() => handleTabChange('documents')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'documents'
                    ? 'border-sky-500 text-sky-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                문서 관리
              </button>
            </nav>
          </div>

          {/* 봇 정보 탭 */}
          {activeTab === 'info' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">기본 정보</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Bot size={18} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">봇 이름</span>
                    </div>
                    <p className="text-gray-900 ml-7">{bot.name}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar size={18} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">생성일</span>
                    </div>
                    <p className="text-gray-900 ml-7">{bot.created}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <User size={18} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">생성자</span>
                    </div>
                    <p className="text-gray-900 ml-7">{bot.creator}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <div className="flex items-center mb-2">
                      <Activity size={18} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">누적 사용량</span>
                    </div>
                    <p className="text-gray-900 ml-7">{bot.usageCount.toLocaleString()}회</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Calendar size={18} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">마지막 사용일</span>
                    </div>
                    <p className="text-gray-900 ml-7">{bot.lastUsed}</p>
                  </div>

                  <div>
                    <div className="flex items-center mb-2">
                      <Bot size={18} className="text-gray-500 mr-2" />
                      <span className="text-sm font-medium text-gray-700">사용 중인 모델</span>
                    </div>
                    <p className="text-gray-900 ml-7">{bot.model}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex items-start mb-2">
                  <FileText size={18} className="text-gray-500 mr-2 mt-1" />
                  <span className="text-sm font-medium text-gray-700">설명</span>
                </div>
                <p className="text-gray-900 ml-7">{bot.description}</p>
              </div>
            </div>
          )}

          {/* API 연동 탭 */}
          {activeTab === 'api' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">API 연동 정보</h2>

              <div className="mb-8">
                <label className="block text-sm font-medium text-gray-700 mb-2">API 키</label>
                <div className="flex items-center">
                  <div className="relative flex-grow">
                    <input
                      type={showApiKey ? "text" : "password"}
                      readOnly
                      value={bot.apiKey}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                    />
                    <button
                      onClick={toggleShowApiKey}
                      className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                    >
                      {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                  <button
                    onClick={copyApiKey}
                    className={`ml-3 px-4 py-2 flex items-center rounded-lg transition-colors ${
                      copied
                        ? 'bg-green-100 text-green-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {copied ? <Check size={18} className="mr-1" /> : <Copy size={18} className="mr-1" />}
                    {copied ? '복사됨' : '복사'}
                  </button>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  이 API 키는 봇을 프로그래밍 방식으로 사용하기 위한 인증 정보입니다. 안전하게 보관하세요.
                </p>
              </div>

              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-md font-medium text-gray-800">키 관리</h3>
                  <button
                    onClick={handleRegenerateKey}
                    className="flex items-center px-4 py-2 bg-yellow-50 text-yellow-700 rounded-lg hover:bg-yellow-100 transition-colors"
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
                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                  <div className="flex">
                    <AlertTriangle size={20} className="text-yellow-600 mr-2 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-yellow-700">
                        API 키를 재생성하면 기존 키는 더 이상 사용할 수 없게 됩니다.
                        이 작업은 되돌릴 수 없으며, 모든 연동 서비스에서 새 키로 업데이트해야 합니다.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-md font-medium text-gray-800 mb-4">API 사용 예시</h3>
                <div className="bg-gray-900 rounded-lg p-4 text-green-400 font-mono text-sm overflow-x-auto">
                  <pre>
{`curl -X POST https://api.cplabs.ai/v1/bots/${bot.id}/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${bot.apiKey}" \\
  -d '{"messages": [{"role": "user", "content": "안녕하세요"}]}'`}
                  </pre>
                </div>
                <p className="mt-2 text-sm text-gray-500">
                  API 문서에서 더 자세한 사용 방법을 확인할 수 있습니다.
                  <a href="www.cplabs.io" className="text-sky-600 hover:text-sky-800 ml-1 inline-flex items-center">
                    API 문서 보기 <ExternalLink size={14} className="ml-1" />
                  </a>
                </p>
              </div>
            </div>
          )}

          {/* 메신저 연동 탭 */}
          {activeTab === 'messengers' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-6">메신저 연동 상태</h2>

              <div className="space-y-8">
                {/* 텔레그램 */}
                <div className="border-b pb-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <MessageCircle size={20} className="text-blue-500 mr-2" />
                      <span className="font-medium">텔레그램</span>
                    </div>
                    <button
                      onClick={() => toggleMessengerStatus('telegram')}
                      className="focus:outline-none"
                    >
                      {bot.messengers.telegram.enabled ? (
                        <ToggleRight size={28} className="text-sky-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  {bot.messengers.telegram.enabled ? (
                    <div className="mt-2 ml-7">
                      <p className="text-sm text-gray-600">
                        텔레그램 봇 사용자명: <span className="font-mono">{bot.messengers.telegram.username}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        이 봇은 현재 텔레그램에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
                      </p>
                      <button className="mt-3 text-sky-500 hover:text-sky-700 text-sm flex items-center">
                        텔레그램 설정 변경 <ExternalLink size={14} className="ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 ml-7">
                      <p className="text-sm text-gray-600">
                        이 봇은 현재 텔레그램과 연동되어 있지 않습니다.
                      </p>
                      <button className="mt-3 text-sky-500 hover:text-sky-700 text-sm flex items-center">
                        텔레그램 연동 설정 <ExternalLink size={14} className="ml-1" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 카카오톡 */}
                <div className="border-b pb-6">
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <MessageSquare size={20} className="text-yellow-500 mr-2" />
                      <span className="font-medium">카카오톡</span>
                    </div>
                    <button
                      onClick={() => toggleMessengerStatus('kakao')}
                      className="focus:outline-none"
                    >
                      {bot.messengers.kakao.enabled ? (
                        <ToggleRight size={28} className="text-sky-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  {bot.messengers.kakao.enabled ? (
                    <div className="mt-2 ml-7">
                      <p className="text-sm text-gray-600">
                        카카오톡 API 키: <span className="font-mono">{bot.messengers.kakao.key}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        이 봇은 현재 카카오톡에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
                      </p>
                      <button className="mt-3 text-sky-500 hover:text-sky-700 text-sm flex items-center">
                        카카오톡 설정 변경 <ExternalLink size={14} className="ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 ml-7">
                      <p className="text-sm text-gray-600">
                        이 봇은 현재 카카오톡과 연동되어 있지 않습니다.
                      </p>
                      <button className="mt-3 text-sky-500 hover:text-sky-700 text-sm flex items-center">
                        카카오톡 연동 설정 <ExternalLink size={14} className="ml-1" />
                      </button>
                    </div>
                  )}
                </div>

                {/* 슬랙 */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <div className="flex items-center">
                      <Slack size={20} className="text-purple-600 mr-2" />
                      <span className="font-medium">슬랙</span>
                    </div>
                    <button
                      onClick={() => toggleMessengerStatus('slack')}
                      className="focus:outline-none"
                    >
                      {bot.messengers.slack.enabled ? (
                        <ToggleRight size={28} className="text-sky-500" />
                      ) : (
                        <ToggleLeft size={28} className="text-gray-400" />
                      )}
                    </button>
                  </div>

                  {bot.messengers.slack.enabled ? (
                    <div className="mt-2 ml-7">
                      <p className="text-sm text-gray-600">
                        슬랙 워크스페이스: <span className="font-mono">{bot.messengers.slack.workspace}</span>
                      </p>
                      <p className="text-sm text-gray-600 mt-2">
                        이 봇은 현재 슬랙에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
                      </p>
                      <button className="mt-3 text-sky-500 hover:text-sky-700 text-sm flex items-center">
                        슬랙 설정 변경 <ExternalLink size={14} className="ml-1" />
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 ml-7">
                      <p className="text-sm text-gray-600">
                        이 봇은 현재 슬랙과 연동되어 있지 않습니다.
                      </p>
                      <button className="mt-3 text-sky-500 hover:text-sky-700 text-sm flex items-center">
                        슬랙 연동 설정 <ExternalLink size={14} className="ml-1" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* 문서 관리 탭 */}
          {activeTab === 'documents' && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold text-gray-800">문서 관리</h2>
                <button
                  onClick={() => setFileUploadOpen(true)}
                  className="flex items-center px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                  <Upload size={18} className="mr-2" />
                  문서 업로드
                </button>
              </div>

              {bot.documents.length > 0 ? (
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
                      {bot.documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <FileText size={18} className="text-gray-500 mr-2" />
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
                                className="text-sky-600 hover:text-sky-900 transition-colors"
                                title="문서 다운로드"
                              >
                                <ExternalLink size={18} />
                              </button>
                              <button
                                onClick={() => deleteDocument(doc.id)}
                                className="text-red-600 hover:text-red-800 transition-colors"
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
              ) : (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <FileText size={48} className="text-gray-300 mb-4" />
                  <p className="text-gray-500 mb-2">업로드된 문서가 없습니다.</p>
                  <p className="text-sm text-gray-500">
                    봇이 참조할 문서를 업로드하여 정확한 정보를 제공할 수 있게 합니다.
                  </p>
                </div>
              )}

              <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex items-start">
                  <AlertTriangle size={20} className="text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-700">
                      <strong>문서 관리에 대한 안내:</strong>
                    </p>
                    <ul className="list-disc text-sm text-gray-600 mt-2 pl-5 space-y-1">
                      <li>PDF, DOCX, TXT, CSV 파일 형식을 지원합니다.</li>
                      <li>최대 파일 크기는 50MB입니다.</li>
                      <li>업로드된 문서는 자동으로 색인화되어 AI 봇의 응답에 참조됩니다.</li>
                      <li>민감한 정보가 포함된 문서는 업로드하지 마세요.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </Layout>

      {/* 파일 업로드 모달 */}
      {fileUploadOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md mx-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">문서 업로드</h3>
              <button
                onClick={() => setFileUploadOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleFileUpload} className="space-y-4">
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  파일 선택
                </label>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    <Upload size={32} className="mx-auto text-gray-400" />
                    <div className="flex text-sm text-gray-600">
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

              <div className="mt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setFileUploadOpen(false)}
                  className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
                >
                  취소
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors"
                >
                  업로드
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <div className="text-center mb-6">
              <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">봇 삭제 확인</h3>
              <p className="text-gray-600 mt-2">
                '{bot.name}' 봇을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      {/* API 키 재생성 확인 모달 */}
      {showRegenerateKeyConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <div className="text-center mb-6">
              <AlertTriangle size={48} className="text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">API 키 재생성 확인</h3>
              <p className="text-gray-600 mt-2">
                API 키를 재생성하면 기존 키는 무효화됩니다. 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowRegenerateKeyConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmRegenerateKey}
                className="px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
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