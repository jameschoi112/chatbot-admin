// src/pages/prompts/PromptList.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  PlusCircle,
  Edit,
  Trash2,
  Info,
  Clock,
  FileText,
  AlertTriangle,
  Check
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Chat from '../../components/Chat';
import promptService from '../../api/promptService';
import DeleteConfirmModal from '../bots/components/modals/DeleteConfirmModal';
import PromptModal from './components/PromptModal';

const PromptList = () => {
  const navigate = useNavigate();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState(null);
  const [showPromptModal, setShowPromptModal] = useState(false);
  const [currentPrompt, setCurrentPrompt] = useState(null);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionSuccess, setActionSuccess] = useState(null);

  // 프롬프트 목록 가져오기
  const fetchPrompts = async () => {
    setLoading(true);
    try {
      const data = await promptService.getAllPrompts();
      setPrompts(data);
      setError(null);
    } catch (err) {
      console.error('프롬프트 목록 로딩 오류:', err);
      setError('프롬프트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  // 초기 데이터 로딩
  useEffect(() => {
    fetchPrompts();
  }, []);

  // 검색 필터링
  const filteredPrompts = prompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 프롬프트 추가/편집 모달
  const openPromptModal = (prompt = null) => {
    setCurrentPrompt(prompt);
    setShowPromptModal(true);
  };

  // 프롬프트 저장
  const handleSavePrompt = async (data) => {
    setIsSaving(true);
    try {
      if (currentPrompt) {
        // 기존 프롬프트 업데이트
        await promptService.updatePrompt(currentPrompt.id, data);
        setActionSuccess('프롬프트가 성공적으로 업데이트되었습니다.');
      } else {
        // 새 프롬프트 생성
        await promptService.createPrompt(data);
        setActionSuccess('새 프롬프트가 성공적으로 생성되었습니다.');
      }
      setShowPromptModal(false);
      setCurrentPrompt(null);
      fetchPrompts(); // 목록 새로고침
    } catch (err) {
      console.error('프롬프트 저장 오류:', err);
      setError('프롬프트 저장에 실패했습니다.');
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

  // 삭제 확인 모달 표시
  const handleDeleteClick = (prompt) => {
    setPromptToDelete(prompt);
    setShowDeleteConfirm(true);
  };

  // 프롬프트 삭제
  const confirmDelete = async () => {
    try {
      await promptService.deletePrompt(promptToDelete.id);
      setActionSuccess('프롬프트가 성공적으로 삭제되었습니다.');
      fetchPrompts(); // 목록 새로고침
    } catch (err) {
      console.error('프롬프트 삭제 오류:', err);
      setError('프롬프트 삭제에 실패했습니다.');
    } finally {
      setShowDeleteConfirm(false);
      setPromptToDelete(null);

      // 성공 메시지 일정 시간 후 제거
      if (actionSuccess) {
        setTimeout(() => {
          setActionSuccess(null);
        }, 3000);
      }
    }
  };

  // 프롬프트 상세 페이지로 이동
  const handleViewDetails = (id) => {
    navigate(`/prompts/${id}`);
  };

  return (
    <>
      <Layout activeMenu="prompts">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">프롬프트 관리</h1>
            <button
              onClick={() => openPromptModal()}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-md transition-colors shadow-md flex items-center"
            >
              <PlusCircle size={18} className="mr-2" />
              새 프롬프트 추가
            </button>
          </div>

          {/* 성공 메시지 */}
          {actionSuccess && (
            <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md animate-fadeIn">
              <div className="flex">
                <Check size={20} className="text-green-500 mr-2 flex-shrink-0" />
                <p className="text-green-700">{actionSuccess}</p>
              </div>
            </div>
          )}

          {/* 오류 메시지 */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
              <div className="flex">
                <AlertTriangle size={20} className="text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          {/* 검색 영역 */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex items-center">
              <div className={`relative border ${isSearchFocused ? 'border-sky-500 ring-2 ring-sky-100' : 'border-gray-300'} rounded-lg transition-all duration-200 flex-1`}>
                <input
                  type="text"
                  placeholder="프롬프트 이름 또는 내용 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
              </div>
            </div>
          </div>

          {/* 프롬프트 목록 */}
          {loading ? (
            <div className="flex justify-center items-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-sky-500"></div>
            </div>
          ) : filteredPrompts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredPrompts.map((prompt) => (
                <div
                  key={prompt.id}
                  className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100"
                >
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className="text-lg font-semibold text-gray-800 truncate">{prompt.name}</h2>
                      <div className={`px-2 py-1 rounded-full text-xs ${
                        prompt.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {prompt.is_active ? '활성' : '비활성'}
                      </div>
                    </div>

                    <div className="h-24 overflow-hidden mb-4">
                      <p className="text-gray-600 text-sm line-clamp-4">
                        {prompt.content}
                      </p>
                    </div>

                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Clock size={14} className="mr-1" />
                      <span>
                        마지막 업데이트: {new Date(prompt.updated_at).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <button
                        onClick={() => handleViewDetails(prompt.id)}
                        className="text-sky-600 hover:text-sky-800 text-sm font-medium flex items-center"
                      >
                        <Info size={16} className="mr-1" />
                        상세 보기
                      </button>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => openPromptModal(prompt)}
                          className="p-1.5 hover:bg-sky-50 rounded-full transition-colors text-sky-600 hover:text-sky-800"
                          title="편집"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(prompt)}
                          className="p-1.5 hover:bg-red-50 rounded-full transition-colors text-red-600 hover:text-red-800"
                          title="삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-10 text-center">
              <FileText size={48} className="mx-auto text-gray-300 mb-4" />
              <h3 className="text-lg font-medium text-gray-800 mb-2">프롬프트 없음</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? '검색 조건에 맞는 프롬프트가 없습니다. 다른 검색어를 시도해보세요.'
                  : '프롬프트가 없습니다. 새 프롬프트를 추가하세요.'}
              </p>
              {!searchTerm && (
                <button
                  onClick={() => openPromptModal()}
                  className="bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md transition-colors inline-flex items-center"
                >
                  <PlusCircle size={16} className="mr-2" />
                  새 프롬프트 추가
                </button>
              )}
            </div>
          )}
        </div>
      </Layout>

      {/* 프롬프트 추가/편집 모달 */}
      {showPromptModal && (
        <PromptModal
          isOpen={showPromptModal}
          onClose={() => {
            setShowPromptModal(false);
            setCurrentPrompt(null);
          }}
          prompt={currentPrompt}
          onSave={handleSavePrompt}
          isSaving={isSaving}
        />
      )}

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && promptToDelete && (
        <DeleteConfirmModal
          isOpen={showDeleteConfirm}
          onClose={() => setShowDeleteConfirm(false)}
          onConfirm={confirmDelete}
          botName={promptToDelete.name} // "봇 이름" 속성을 재사용
        />
      )}

      <Chat />
    </>
  );
};

export default PromptList;