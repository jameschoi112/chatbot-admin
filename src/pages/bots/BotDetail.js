// src/pages/bots/BotDetail.js - 임포트 부분 수정
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, AlertTriangle } from 'lucide-react';
import Layout from '../../components/layout/Layout';
import BotHeader from './components/BotHeader';
// 올바른 파일 경로로 수정
import OverviewTab from './components/tabs/OverviewTab';
import ApiTab from './components/tabs/ApiTab';
import MessengersTab from './components/tabs/MessengersTab';
import DocumentsTab from './components/tabs/DocumentsTab';
import SettingsTab from './components/tabs/SettingsTab';
import BotChatModal from './BotChatModal';
import DeleteConfirmModal from './components/modals/DeleteConfirmModal';
import RegenerateKeyModal from './components/modals/RegenerateKeyModal';
import FileUploadModal from './components/modals/FileUploadModal';
import TabNavigation from './components/TabNavigation';
import Chat from '../../components/Chat';
import { botData } from './data/botData';

const BotDetail = () => {
  const { botId } = useParams();
  const navigate = useNavigate();
  const [bot, setBot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApiKey, setShowApiKey] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [regeneratingKey, setRegeneratingKey] = useState(false);
  const [showRegenerateKeyConfirm, setShowRegenerateKeyConfirm] = useState(false);
  const [fileUploadOpen, setFileUploadOpen] = useState(false);
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

    // 실제 구현에서는 API 호출로 새 키를 생성할 것입니다
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
    // 실제 구현에서는 API 호출로 봇을 삭제할 것입니다
    console.log(`봇 삭제: ${bot.name} (ID: ${bot.id})`);
    setShowDeleteConfirm(false);

    // 삭제 후 목록 페이지로 이동
    navigate('/bots');
  };

  const toggleBotStatus = () => {
    // 실제 구현에서는 API 호출로 상태를 변경할 것입니다
    setBot(prev => ({
      ...prev,
      status: prev.status === 'active' ? 'inactive' : 'active'
    }));
  };

  const toggleMessengerStatus = (messenger) => {
    // 실제 구현에서는 API 호출로 메신저 연동 상태를 변경할 것입니다
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

    // 실제 구현에서는 파일 업로드 API 호출을 할 것입니다
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
    // 실제 구현에서는 문서 삭제 API 호출을 할 것입니다
    setBot(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.id !== docId)
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
            </div>
            <p className="mt-4 text-gray-600 animate-pulse">봇 정보를 불러오고 있습니다.</p>
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

  // 탭 콘텐츠 매핑
  const tabComponents = {
    overview: (
      <OverviewTab
        bot={bot}
      />
    ),
    api: (
      <ApiTab
        bot={bot}
        showApiKey={showApiKey}
        toggleShowApiKey={toggleShowApiKey}
        copied={copied}
        copyApiKey={copyApiKey}
        handleRegenerateKey={handleRegenerateKey}
      />
    ),
    messengers: (
      <MessengersTab
        bot={bot}
        toggleMessengerStatus={toggleMessengerStatus}
      />
    ),
    documents: (
      <DocumentsTab
        bot={bot}
        setFileUploadOpen={setFileUploadOpen}
        deleteDocument={deleteDocument}
      />
    ),
    settings: (
      <SettingsTab
        bot={bot}
      />
    )
  };

  return (
    <>
      <Layout activeMenu="bots">
        <div className="container mx-auto px-4 py-6 space-y-6 relative">
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
                <li className="text-blue-600 font-medium">{bot.name}</li>
              </ul>
            </nav>
          </div>

          {/* 헤더 영역 */}
          <BotHeader
            bot={bot}
            isLoading={isLoading}
            openChatModal={openChatModal}
            toggleBotStatus={toggleBotStatus}
            handleDeleteBot={handleDeleteBot}
          />

          {/* 탭 네비게이션 */}
          <div className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-500 ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
            <TabNavigation activeTab={activeTab} handleTabChange={handleTabChange} />

            {/* 현재 활성화된 탭 컴포넌트 렌더링 */}
            {tabComponents[activeTab]}
          </div>
        </div>
      </Layout>

      {/* 모달 컴포넌트들 */}
      <BotChatModal
        isOpen={showChatModal}
        onClose={() => setShowChatModal(false)}
        bot={bot}
      />

      <FileUploadModal
        isOpen={fileUploadOpen}
        onClose={() => setFileUploadOpen(false)}
        onUpload={handleFileUpload}
      />

      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={confirmDelete}
        botName={bot.name}
      />

      <RegenerateKeyModal
        isOpen={showRegenerateKeyConfirm}
        onClose={() => setShowRegenerateKeyConfirm(false)}
        onConfirm={confirmRegenerateKey}
      />

      <Chat />
    </>
  );
};

export default BotDetail;