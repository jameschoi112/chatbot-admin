// src/pages/prompts/PromptDetail.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ChevronRight,
  Edit,
  History,
  RefreshCw,
  Clock,
  User,
  AlertTriangle,
  Check,
  MessageSquare,
  Trash2
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Chat from '../../components/Chat';
import promptService from '../../api/promptService';
import PromptModal from './components/PromptModal';
import DeleteConfirmModal from '../bots/components/modals/DeleteConfirmModal';
import PromptHistoryModal from './components/PromptHistoryModal';
import PromptPlaygroundModal from './components/PromptPlaygroundModal';

const PromptDetail = () => {
  const { promptId } = useParams();
  const navigate = useNavigate();

  const [prompt, setPrompt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [showPlaygroundModal, setShowPlaygroundModal] = useState(false);
  const [promptHistory, setPromptHistory] = useState([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // 프롬프트 상세 정보 가져오기
  const fetchPromptDetail = async () => {
    setLoading(true);
    try {
      const data = await promptService.getPromptById(promptId);
      setPrompt(data);
      setError(null);
    } catch (err) {
      console.error('프롬프트 상세 로딩 오류:', err);
      setError('프롬프트 정보를 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 프롬프트 히스토리 가져오기
  const fetchPromptHistory = async () => {
    setHistoryLoading(true);
    try {
      const history = await promptService.getPromptHistory(promptId);
      setPromptHistory(history);
      return history;
    } catch (err) {
      console.error('프롬프트 히스토리 로딩 오류:', err);
      setError('프롬프트 히스토리를 불러오는데 실패했습니다.');
      return [];
    } finally {
      setHistoryLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchPromptDetail();
  }, [promptId]);

  // 프롬프트 업데이트 핸들러
  const handleUpdatePrompt = async (data) => {
    setIsSaving(true);
    try {
      await promptService.updatePrompt(promptId, data);
      setActionSuccess('프롬프트가 성공적으로 업데이트되었습니다.');
      setShowPromptModal(false);
      fetchPromptDetail(); // 정보 새로고침
    } catch (err) {
      console.error('프롬프트 업데이트 오류:', err);
      setError('프롬프트 업데이트에 실패했습니다.');
    } finally {
      setIsSaving(false);

      // 성공 메시지 일정 시간 후 제거
      if (actionSuccess) {
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    }
  };

  // 프롬프트 삭제 핸들러
  const handleDeletePrompt = async () => {
    try {
      await promptService.deletePrompt(promptId);
      navigate('/prompts', { state: { message: '프롬프트가 성공적으로 삭제되었습니다.' } });
    } catch (err) {
      console.error('프롬프트 삭제 오류:', err);
      setError('프롬프트 삭제에 실패했습니다.');
      setShowDeleteConfirm(false);
    }
  };

  // 프롬프트 롤백 핸들러
  const handleRollback = async (historyId) => {
    try {
      await promptService.rollbackPrompt(promptId, historyId);
      setActionSuccess('프롬프트가 성공적으로 롤백되었습니다.');
      setShowHistoryModal(false);
      fetchPromptDetail(); // 정보 새로고침
    } catch (err) {
      console.error('프롬프트 롤백 오류:', err);
      setError('프롬프트 롤백에 실패했습니다.');
    } finally {
      // 성공 메시지 일정 시간 후 제거
      if (actionSuccess) {
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    }
  };

  // 히스토리 모달 열기
  const openHistoryModal = async () => {
    const history = await fetchPromptHistory();
    if (history.length > 0) {
      setShowHistoryModal(true);
    } else {
      setActionSuccess('변경 이력이 없습니다.');
      setTimeout(() => {
        setActionSuccess(null);
      }, 3000);
    }
  };

  // 플레이그라운드 모달 열기
  const openPlaygroundModal = () => {
    setShowPlaygroundModal(true);
  };

  if (loading) {
    return (
      <Layout activeMenu="prompts">
        <div className="flex items-center justify-center h-screen">
          <div className="flex flex-col items-center">
            <div className="w-16 h-16 relative">
              <div className="absolute top-0 left-0 w-full h-full border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
            </div>
            <p className="mt-4 text-gray-600 animate-pulse">프롬프트 정보를 불러오고 있습니다.</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !prompt) {
    return (
      <Layout activeMenu="prompts">
        <div className="flex flex-col items-center justify-center h-full">
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle size={40} className="text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{error}</h2>
          <p className="text-gray-600 mb-6">요청한 프롬프트 정보를 가져올 수 없습니다.</p>
          <button
            onClick={() => navigate('/prompts')}
            className="flex items-center px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors shadow-md"
          >
            <ArrowLeft size={18} className="mr-2" />
            프롬프트 목록으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout activeMenu="prompts">
        <div className="container mx-auto px-4 py-6 space-y-6">
          {/* 상단 네비게이션 */}
          <div className="flex items-center mb-2">
            <button
              onClick={() => navigate('/prompts')}
              className="flex items-center text-gray-600 hover:text-gray-900 transition-colors mr-4"
            >
              <ArrowLeft size={20} className="mr-1" />
              <span className="text-sm">목록</span>
            </button>
            <nav className="text-sm breadcrumbs">
              <ul className="flex items-center space-x-2">
                <li className="text-gray-500">프롬프트 관리</li>
                <li>
                  <ChevronRight size={14} className="inline" />
                </li>
                <li className="text-blue-600 font-medium">
                  {prompt?.name || '프롬프트 상세'}
                </li>
              </ul>
            </nav>
          </div>

          {/* 성공 메시지 */}
          {actionSuccess && (
            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-fadeIn">
              <div className="flex">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0" />
                <p className="text-green-700">{actionSuccess}</p>
              </div>
            </div>
          )}

          {/* 오류 메시지 */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <AlertTriangle size={20} className="text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* 프롬프트 상세 정보 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-blue-700 to-sky-600 p-6 text-white">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-2xl font-bold mb-2">{prompt?.name}</h1>
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-white/80">
                      <Clock size={14} className="mr-1" />
                      <span>
                        마지막 업데이트: {new Date(prompt?.updated_at).toLocaleDateString()} {new Date(prompt?.updated_at).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center text-white/80">
                      <User size={14} className="mr-1" />
                      <span>
                        ID: {prompt?.updated_by || '시스템'}
                      </span>
                    </div>
                    <div className={`px-2 py-0.5 rounded-full text-xs ${
                      prompt?.is_active
                        ? 'bg-green-500/20 text-white border border-green-400/30'
                        : 'bg-gray-500/20 text-white border border-gray-400/30'
                    }`}>
                      {prompt?.is_active ? '활성' : '비활성'}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={openPlaygroundModal}
                    className="flex items-center px-3 py-1.5 bg-white text-blue-700 rounded-lg hover:bg-white/90 transition-all shadow-sm text-sm"
                  >
                    <MessageSquare size={16} className="mr-1" />
                    테스트
                  </button>
                  <button
                    onClick={openHistoryModal}
                    className="flex items-center px-3 py-1.5 bg-blue-500/20 text-white rounded-lg hover:bg-blue-500/30 transition-all border border-blue-400/30 text-sm"
                  >
                    <History size={16} className="mr-1" />
                    변경 이력
                  </button>
                  <button
                    onClick={() => setShowPromptModal(true)}
                    className="flex items-center px-3 py-1.5 bg-blue-500/20 text-white rounded-lg hover:bg-blue-500/30 transition-all border border-blue-400/30 text-sm"
                  >
                    <Edit size={16} className="mr-1" />
                    편집
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center px-3 py-1.5 bg-red-500/20 text-white rounded-lg hover:bg-red-500/30 transition-all border border-red-400/30 text-sm"
                  >
                    <Trash2 size={16} className="mr-1" />
                    삭제
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">프롬프트 내용</h2>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono whitespace-pre-wrap">
                {prompt?.content || '내용 없음'}
              </div>
            </div>
          </div>
        </div>
      </Layout>

      {/* 프롬프트 편집 모달 */}
      {showPromptModal && (
        <PromptModal
          isOpen={showPromptModal}
          onClose={() => setShowPromptModal(false)}
          prompt={prompt}
          onSave={handleUpdatePrompt}
          isSaving={isSaving}
        />
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={handleDeletePrompt}
          botName={prompt?.name} // "봇 이름" 속성을 재사용
        />
      )}

      {/* 히스토리 모달 */}
      {showHistoryModal && (
        <PromptHistoryModal
          isOpen={showHistoryModal}
          onClose={() => setShowHistoryModal(false)}
          history={promptHistory}
          onRollback={handleRollback}
          currentPrompt={prompt}
          isLoading={historyLoading}
        />
      )}

      {/* 플레이그라운드 모달 */}
      {showPlaygroundModal && (
        <PromptPlaygroundModal
          isOpen={showPlaygroundModal}
          onClose={() => setShowPlaygroundModal(false)}
          prompt={prompt}
        />
      )}

      <Chat />
    </>
  );
};

export default PromptDetail;