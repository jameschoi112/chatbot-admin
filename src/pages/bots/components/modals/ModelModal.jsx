// src/pages/bots/components/modals/ModelModal.jsx
import React from 'react';
import { Cpu, Save, RefreshCw } from 'lucide-react';

/**
 * LLM 모델 추가/편집 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Object} props.formData - 폼 데이터
 * @param {Function} props.onChange - 입력값 변경 핸들러
 * @param {Function} props.onSubmit - 폼 제출 핸들러
 * @param {boolean} props.isEditing - 편집 모드 여부
 * @param {boolean} props.isSaving - 저장 중 여부
 * @param {Array} props.origins - 오리진 목록
 */
const ModelModal = ({
  isOpen,
  onClose,
  formData,
  onChange,
  onSubmit,
  isEditing,
  isSaving,
  origins
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg animate-scale-up">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 p-4 rounded-t-xl">
          <h3 className="text-white text-lg font-semibold flex items-center">
            <Cpu size={20} className="mr-2" />
            {isEditing ? '모델 편집' : '새 모델 생성'}
          </h3>
        </div>

        <form onSubmit={onSubmit} className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="model-origin" className="block text-sm font-medium text-gray-700 mb-1">
                소속 오리진 <span className="text-red-500">*</span>
              </label>
              <select
                id="model-origin"
                name="origin_id"
                value={formData.origin_id}
                onChange={onChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">오리진 선택...</option>
                {origins.map(origin => (
                  <option key={origin.id} value={origin.id}>
                    {origin.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="model-name" className="block text-sm font-medium text-gray-700 mb-1">
                모델 이름 <span className="text-red-500">*</span>
              </label>
              <input
                id="model-name"
                name="model_name"
                type="text"
                value={formData.model_name}
                onChange={onChange}
                required
                placeholder="gpt-4"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="model-context-length" className="block text-sm font-medium text-gray-700 mb-1">
                  컨텍스트 길이
                </label>
                <input
                  id="model-context-length"
                  name="context_length"
                  type="number"
                  value={formData.context_length}
                  onChange={onChange}
                  min="1000"
                  step="1000"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="model-max-output" className="block text-sm font-medium text-gray-700 mb-1">
                  최대 출력 토큰
                </label>
                <input
                  id="model-max-output"
                  name="max_output_tokens"
                  type="number"
                  value={formData.max_output_tokens}
                  onChange={onChange}
                  min="100"
                  step="100"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <div className="flex items-center">
                <input
                  id="model-streaming"
                  name="streaming"
                  type="checkbox"
                  checked={formData.streaming}
                  onChange={onChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="model-streaming" className="ml-2 block text-sm text-gray-700">
                  스트리밍 지원
                </label>
              </div>

              <div className="flex items-center">
                <input
                  id="model-function-calling"
                  name="function_calling"
                  type="checkbox"
                  checked={formData.function_calling}
                  onChange={onChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="model-function-calling" className="ml-2 block text-sm text-gray-700">
                  함수 호출 지원
                </label>
              </div>
            </div>

            <div className="flex items-center mt-2">
              <input
                id="model-is-active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={onChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="model-is-active" className="ml-2 block text-sm text-gray-700">
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

export default ModelModal;