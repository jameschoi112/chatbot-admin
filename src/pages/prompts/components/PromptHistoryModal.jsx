// src/pages/prompts/components/PromptHistoryModal.jsx
import React, { useState } from 'react';
import { X, History, RotateCcw, Clock, User, RefreshCw, Check } from 'lucide-react';

/**
 * 프롬프트 히스토리 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Array} props.history - 히스토리 목록
 * @param {Function} props.onRollback - 롤백 핸들러
 * @param {Object} props.currentPrompt - 현재 프롬프트 정보
 * @param {boolean} props.isLoading - 로딩 중 여부
 */
const PromptHistoryModal = ({ isOpen, onClose, history, onRollback, currentPrompt, isLoading }) => {
  const [selectedHistoryId, setSelectedHistoryId] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);
  const [isRollingBack, setIsRollingBack] = useState(false);

  // 히스토리 선택 핸들러
  const handleSelectHistory = (historyItem) => {
    setSelectedHistoryId(historyItem.id);
    setSelectedHistory(historyItem);
  };

  // 롤백 실행 핸들러
  const handleRollback = async () => {
    if (!selectedHistoryId) return;

    setIsRollingBack(true);
    try {
      await onRollback(selectedHistoryId);
      // 롤백 성공 시 모달이 닫힐 것이므로 추가 처리 불필요
    } catch (error) {
      console.error('롤백 오류:', error);
      setIsRollingBack(false);
    }
  };

  // 모달이 닫혔을 때는 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-4xl animate-scale-up h-5/6 flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-white text-lg font-semibold flex items-center">
            <History size={20} className="mr-2" />
            프롬프트 변경 이력
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : (
          <div className="flex-1 flex overflow-hidden">
            {/* 히스토리 목록 */}
            <div className="w-1/3 border-r border-gray-200 overflow-y-auto">
              <div className="p-4">
                <h4 className="text-sm font-medium text-gray-500 mb-4">변경 기록</h4>
                {history.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <History size={24} className="mx-auto text-gray-300 mb-2" />
                    <p>변경 기록이 없습니다.</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {history.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => handleSelectHistory(item)}
                        className={`p-3 rounded-lg cursor-pointer border transition-colors ${
                          selectedHistoryId === item.id
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={12} className="mr-1" />
                            <span>
                              {new Date(item.changed_at).toLocaleDateString()}{' '}
                              {new Date(item.changed_at).toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center mt-2 text-xs text-gray-500">
                          <User size={12} className="mr-1" />
                          <span>수정자: {item.changed_by || '시스템'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* 선택된 히스토리 상세 */}
            <div className="w-2/3 overflow-y-auto p-4">
              {selectedHistory ? (
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-sm font-medium text-gray-700">선택된 버전</h4>
                    <button
                      onClick={handleRollback}
                      disabled={isRollingBack}
                      className={`flex items-center px-3 py-1.5 rounded-lg text-sm transition-colors ${
                        isRollingBack
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      {isRollingBack ? (
                        <>
                          <RefreshCw size={14} className="mr-1 animate-spin" />
                          롤백 중...
                        </>
                      ) : (
                        <>
                          <RotateCcw size={14} className="mr-1" />
                          이 버전으로 롤백
                        </>
                      )}
                    </button>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-xs font-medium text-gray-500 mb-1">내용</h5>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 font-mono text-sm whitespace-pre-wrap">
                      {selectedHistory.content}
                    </div>
                  </div>

                  <div className="mb-6">
                    <h5 className="text-xs font-medium text-gray-500 mb-1">이 버전에서의 변경 사항</h5>
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 text-sm">
                      {/* 이전 버전과의 차이점 표시 (간단한 구현) */}
                      <p className="text-gray-600">
                        {selectedHistory.content === currentPrompt?.content
                          ? '현재 버전과 동일합니다.'
                          : '내용이 변경되었습니다.'}
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <History size={48} className="text-gray-300 mb-4" />
                  <p>왼쪽에서 버전을 선택하세요</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptHistoryModal;