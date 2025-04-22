// src/pages/bots/components/Step2LLMSettings.jsx
import React from 'react';
import { Database, AlertTriangle, Server, Cpu, PlusCircle, Edit, Trash2 } from 'lucide-react';

/**
 * 봇 생성 2단계: LLM 설정 컴포넌트
 * @param {Object} props
 * @param {Object} props.botData - 봇 데이터 상태
 * @param {Function} props.handleInputChange - 입력값 변경 핸들러
 * @param {string|null} props.error - 오류 메시지 (있는 경우)
 * @param {Array} props.llmOrigins - LLM 오리진 목록
 * @param {Array} props.llmModels - LLM 모델 목록
 * @param {boolean} props.isLoadingOrigins - 오리진 로딩 상태
 * @param {boolean} props.isLoadingModels - 모델 로딩 상태
 * @param {Function} props.handleAddOrigin - 오리진 추가 핸들러
 * @param {Function} props.handleEditOrigin - 오리진 편집 핸들러
 * @param {Function} props.handleDeleteOrigin - 오리진 삭제 핸들러
 * @param {Function} props.handleAddModel - 모델 추가 핸들러
 * @param {Function} props.handleEditModel - 모델 편집 핸들러
 * @param {Function} props.handleDeleteModel - 모델 삭제 핸들러
 */
const Step2LLMSettings = ({
  botData,
  handleInputChange,
  error,
  llmOrigins,
  llmModels,
  isLoadingOrigins,
  isLoadingModels,
  handleAddOrigin,
  handleEditOrigin,
  handleDeleteOrigin,
  handleAddModel,
  handleEditModel,
  handleDeleteModel
}) => {
  // API 응답 데이터에 대한 안전성 처리
  const safeOrigins = Array.isArray(llmOrigins) ? llmOrigins : [];
  const safeModels = Array.isArray(llmModels) ? llmModels : [];

  // 디버깅을 위한 콘솔 로그 추가
  console.log('LLM Origins:', llmOrigins);
  console.log('LLM Models:', llmModels);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
          <Database size={22} className="text-blue-500 mr-2" />
          LLM 설정
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
            <div className="flex">
              <AlertTriangle size={20} className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* LLM 오리진 선택 */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">LLM 오리진 선택</h3>
            <button
              type="button"
              onClick={handleAddOrigin}
              className="flex items-center px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
            >
              <PlusCircle size={16} className="mr-1" />
              새 오리진 추가
            </button>
          </div>

          {isLoadingOrigins ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : safeOrigins.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
              <Server size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-2">등록된 LLM 오리진이 없습니다</p>
              <p className="text-sm text-gray-400 mb-4">
                오리진을 추가하여 LLM API 연결을 설정하세요
              </p>
              <button
                type="button"
                onClick={handleAddOrigin}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <PlusCircle size={16} className="mr-2" />
                오리진 추가
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeOrigins.map(origin => (
                <div
                  key={origin.id}
                  onClick={() => {
                    // input[name="llm_origin_id"]의 값 변경 이벤트 시뮬레이션
                    handleInputChange({
                      target: {
                        name: 'llm_origin_id',
                        value: origin.id.toString(),
                        type: 'text'
                      }
                    });

                    // 모델 선택 초기화
                    handleInputChange({
                      target: {
                        name: 'llm_model_id',
                        value: '',
                        type: 'text'
                      }
                    });
                  }}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    botData.llm_origin_id === origin.id.toString()
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        origin.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Server size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{origin.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          {origin.base_url}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditOrigin(origin);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteOrigin(origin.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        origin.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {origin.is_active ? '활성' : '비활성'}
                      </span>
                    </div>
                    {botData.llm_origin_id === origin.id.toString() && (
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        선택됨
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* LLM 모델 선택 */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-gray-700">LLM 모델 선택</h3>
            <button
              type="button"
              onClick={handleAddModel}
              disabled={!botData.llm_origin_id}
              className={`flex items-center px-3 py-2 rounded-lg text-sm transition-colors ${
                botData.llm_origin_id
                  ? 'bg-blue-500 text-white hover:bg-blue-600'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <PlusCircle size={16} className="mr-1" />
              새 모델 추가
            </button>
          </div>

          {!botData.llm_origin_id ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg border border-gray-200">
              <p className="text-gray-500">
                먼저 LLM 오리진을 선택해주세요
              </p>
            </div>
          ) : isLoadingModels ? (
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : safeModels.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-lg border border-gray-200">
              <Cpu size={40} className="mx-auto text-gray-400 mb-3" />
              <p className="text-gray-500 mb-2">등록된 LLM 모델이 없습니다</p>
              <p className="text-sm text-gray-400 mb-4">
                이 오리진에 대한 모델을 추가하세요
              </p>
              <button
                type="button"
                onClick={handleAddModel}
                className="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
              >
                <PlusCircle size={16} className="mr-2" />
                모델 추가
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {safeModels.map(model => (
                <div
                  key={model.id}
                  onClick={() => {
                    // input 이벤트 시뮬레이션
                    handleInputChange({
                      target: {
                        name: 'llm_model_id',
                        value: model.id.toString(),
                        type: 'text'
                      }
                    });
                  }}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    botData.llm_model_id === model.id.toString()
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/30'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
                        model.is_active
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-500'
                      }`}>
                        <Cpu size={20} />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-800">{model.model_name}</h4>
                        <p className="text-xs text-gray-500 mt-1">
                          Context: {model.context_length ? model.context_length.toLocaleString() : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditModel(model);
                        }}
                        className="p-1 text-gray-400 hover:text-blue-500 hover:bg-blue-50 rounded"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteModel(model.id);
                        }}
                        className="p-1 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                        model.is_active
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {model.is_active ? '활성' : '비활성'}
                      </span>
                      {model.streaming && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          스트리밍
                        </span>
                      )}
                      {model.function_calling && (
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">
                          함수 호출
                        </span>
                      )}
                    </div>
                    {botData.llm_model_id === model.id.toString() && (
                      <div className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                        선택됨
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Step2LLMSettings;