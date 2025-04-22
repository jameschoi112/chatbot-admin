// src/pages/prompts/components/PromptModal.jsx
import React, { useState, useEffect } from 'react';
import { X, FileText, Save, RefreshCw } from 'lucide-react';

/**
 * 프롬프트 추가/편집 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Object|null} props.prompt - 편집할 프롬프트 (없으면 새로 추가)
 * @param {Function} props.onSave - 저장 핸들러
 * @param {boolean} props.isSaving - 저장 중 여부
 */
const PromptModal = ({ isOpen, onClose, prompt, onSave, isSaving }) => {
  const [formData, setFormData] = useState({
    name: '',
    content: '',
    is_active: true
  });

  // 편집 모드일 경우 초기 데이터 설정
  useEffect(() => {
    if (prompt) {
      setFormData({
        name: prompt.name || '',
        content: prompt.content || '',
        is_active: prompt.is_active !== undefined ? prompt.is_active : true
      });
    } else {
      // 새 프롬프트 생성 시 기본값으로 초기화
      setFormData({
        name: '',
        content: '',
        is_active: true
      });
    }
  }, [prompt]);

  // 입력값 변경 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 폼 제출 핸들러
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  // 모달이 닫혔을 때는 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl animate-scale-up">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-white text-lg font-semibold flex items-center">
            <FileText size={20} className="mr-2" />
            {prompt ? '프롬프트 편집' : '새 프롬프트 생성'}
          </h3>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors p-1 rounded-full hover:bg-white/10"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            <div>
              <label htmlFor="prompt-name" className="block text-sm font-medium text-gray-700 mb-1">
                프롬프트 이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="prompt-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="고객 응대 프롬프트"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                프롬프트를 쉽게 식별할 수 있는 이름을 입력하세요.
              </p>
            </div>

            <div>
              <label htmlFor="prompt-content" className="block text-sm font-medium text-gray-700 mb-1">
                프롬프트 내용 <span className="text-red-500">*</span>
              </label>
              <textarea
                id="prompt-content"
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="당신은 친절한 고객 서비스 대표입니다. 항상 예의 바르고 도움이 되는 답변을 제공해주세요."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-64 font-mono"
              />
              <p className="mt-1 text-xs text-gray-500">
                LLM에게 제공할 시스템 프롬프트를 입력하세요. 상세할수록 더 좋은 결과를 얻을 수 있습니다.
              </p>
            </div>

            <div className="flex items-center">
              <input
                id="prompt-is-active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="prompt-is-active" className="ml-2 block text-sm text-gray-700">
                활성화
              </label>
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm flex items-center"
            >
              {isSaving ? (
                <>
                  <RefreshCw size={16} className="mr-2 animate-spin" />
                  저장 중...
                </>
              ) : (
                <>
                  <Save size={16} className="mr-2" />
                  {prompt ? '업데이트' : '생성'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PromptModal;