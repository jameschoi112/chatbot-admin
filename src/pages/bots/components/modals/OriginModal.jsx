// src/pages/bots/components/modals/OriginModal.jsx
import React from 'react';
import { Server, Key, Link, Save, RefreshCw } from 'lucide-react';

/**
 * LLM 오리진 추가/편집 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Object} props.formData - 폼 데이터
 * @param {Function} props.onChange - 입력값 변경 핸들러
 * @param {Function} props.onSubmit - 폼 제출 핸들러
 * @param {boolean} props.isEditing - 편집 모드 여부
 * @param {boolean} props.isSaving - 저장 중 여부
 */
const OriginModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  isEditing,
  isSaving
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-scale-up">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-xl">
          <h3 className="text-white text-lg font-semibold flex items-center">
            <Server size={20} className="mr-2" />
            {isEditing ? '오리진 편집' : '새 오리진 생성'}
          </h3>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="origin-name" className="block text-sm font-medium text-gray-700 mb-1">
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="origin-name"
                name="name"
                type="text"
                value={formData.name}
                onChange={onChange}
                required
                placeholder="OpenAI"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="origin-api-key" className="block text-sm font-medium text-gray-700 mb-1">
                API 키 <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Key size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="origin-api-key"
                  name="api_key"
                  type="password"
                  value={formData.api_key}
                  onChange={onChange}
                  required
                  placeholder="sk-..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label htmlFor="origin-base-url" className="block text-sm font-medium text-gray-700 mb-1">
                기본 URL <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Link size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  id="origin-base-url"
                  name="base_url"
                  type="text"
                  value={formData.base_url}
                  onChange={onChange}
                  required
                  placeholder="https://api.openai.com/v1"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                id="origin-is-active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="origin-is-active" className="ml-2 block text-sm text-gray-700">
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
                  {isEditing ? '업데이트' : '생성'}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OriginModal;