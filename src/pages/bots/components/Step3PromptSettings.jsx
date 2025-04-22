// src/pages/bots/components/Step3PromptSettings.jsx
import React, { useState, useEffect } from 'react';
import { Settings, AlertTriangle, Plus, RefreshCw, Check, Search, FileText } from 'lucide-react';
import promptService from '../../../api/promptService';

/**
 * 봇 생성 3단계: 프롬프트 및 설정 컴포넌트
 * @param {Object} props
 * @param {Object} props.botData - 봇 데이터 상태
 * @param {Function} props.handleInputChange - 입력값 변경 핸들러
 * @param {string|null} props.error - 오류 메시지 (있는 경우)
 */
const Step3PromptSettings = ({ botData, handleInputChange, error }) => {
  const [prompts, setPrompts] = useState([]);
  const [loadingPrompts, setLoadingPrompts] = useState(false);
  const [promptError, setPromptError] = useState(null);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 프롬프트 목록 가져오기
  const fetchPrompts = async () => {
    setLoadingPrompts(true);
    try {
      const data = await promptService.getAllPrompts();
      setPrompts(data);
      setPromptError(null);
    } catch (err) {
      console.error('프롬프트 목록 로딩 오류:', err);
      setPromptError('프롬프트 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoadingPrompts(false);
    }
  };

  // 컴포넌트 마운트 시 프롬프트 로드
  useEffect(() => {
    fetchPrompts();
  }, []);

  // 프롬프트 선택 시 시스템 프롬프트 업데이트
  const handleSelectPrompt = (prompt) => {
    setSelectedPrompt(prompt);
    handleInputChange({
      target: {
        name: 'system_prompt',
        value: prompt.content,
        type: 'text'
      }
    });
  };

  // 프롬프트 검색
  const filteredPrompts = prompts.filter(prompt =>
    prompt.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 선택된 프롬프트 찾기
  useEffect(() => {
    const found = prompts.find(p => p.content === botData.system_prompt);
    if (found) {
      setSelectedPrompt(found);
    } else {
      setSelectedPrompt(null);
    }
  }, [prompts, botData.system_prompt]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
          <Settings size={22} className="text-blue-500 mr-2" />
          프롬프트 및 설정
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
            <div className="flex">
              <AlertTriangle size={20} className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* 저장된 프롬프트 선택 */}
        <div className="mb-6">
          <h3 className="text-md font-medium text-gray-700 mb-3 flex items-center">
            <FileText size={18} className="text-gray-500 mr-2" />
            저장된 프롬프트
          </h3>

          {promptError && (
            <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mb-4 text-sm">
              <div className="flex">
                <AlertTriangle size={16} className="text-red-500 mr-2 flex-shrink-0" />
                <p className="text-red-700">{promptError}</p>
              </div>
            </div>
          )}

          {/* 프롬프트 검색 영역 */}
          <div className="relative mb-4">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="프롬프트 검색..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <button
              onClick={fetchPrompts}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              title="새로고침"
            >
              <RefreshCw size={16} className={loadingPrompts ? 'animate-spin' : ''} />
            </button>
          </div>

          {/* 프롬프트 목록 */}
          <div className="border border-gray-200 rounded-lg overflow-hidden mb-4">
            <div className="max-h-64 overflow-y-auto">
              {loadingPrompts ? (
                <div className="flex justify-center items-center py-8">
                  <RefreshCw size={24} className="text-blue-500 animate-spin" />
                </div>
              ) : filteredPrompts.length === 0 ? (
                <div className="text-center py-8">
                  <FileText size={32} className="mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500">
                    {searchTerm ? '검색 결과가 없습니다.' : '저장된 프롬프트가 없습니다.'}
                  </p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPrompts.map(prompt => (
                    <div
                      key={prompt.id}
                      onClick={() => handleSelectPrompt(prompt)}
                      className={`p-3 cursor-pointer transition-colors ${
                        selectedPrompt?.id === prompt.id
                          ? 'bg-blue-50'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-medium text-gray-800">{prompt.name}</h4>
                          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                            {prompt.content}
                          </p>
                        </div>
                        {selectedPrompt?.id === prompt.id && (
                          <Check size={18} className="text-blue-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="bg-gray-50 border-t border-gray-200 p-2">
              <a
                href="/prompts"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-600 hover:text-blue-800 transition-colors flex items-center justify-center"
              >
                <Plus size={14} className="mr-1" />
                새 프롬프트 생성 (새 창)
              </a>
            </div>
          </div>
        </div>

        {/* 시스템 프롬프트 */}
        <div className="mb-6">
          <label htmlFor="system_prompt" className="block text-sm font-medium text-gray-700 mb-1">
            시스템 프롬프트 <span className="text-red-500">*</span>
          </label>
          <textarea
            id="system_prompt"
            name="system_prompt"
            value={botData.system_prompt}
            onChange={handleInputChange}
            required
            placeholder="당신은 도움이 되는 AI 어시스턴트입니다. 사용자의 질문에 친절하고 정확하게 답변해 주세요."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-40"
          />
          <p className="mt-1 text-sm text-gray-500">
            봇의 동작 방식과 성격을 정의하는 시스템 프롬프트입니다. 자세한 지시를 제공할수록 더 일관된 응답을 얻을 수 있습니다.
          </p>
        </div>

        {/* LLM 설정 슬라이더 */}
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-gray-700 mb-4">고급 설정</h3>

          {/* Temperature 슬라이더 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="temperature" className="text-sm font-medium text-gray-700">
                Temperature
              </label>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {botData.temperature.toFixed(1)}
              </span>
            </div>
            <input
              id="temperature"
              name="temperature"
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={botData.temperature}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>일관성 (0.0)</span>
              <span>다양성 (1.0)</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              낮은 값은 더 일관되고 예측 가능한 응답을, 높은 값은 더 창의적이고 다양한 응답을 생성합니다.
            </p>
          </div>

          {/* Max Tokens 슬라이더 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="max_tokens" className="text-sm font-medium text-gray-700">
                최대 토큰 수
              </label>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {botData.max_tokens}
              </span>
            </div>
            <input
              id="max_tokens"
              name="max_tokens"
              type="range"
              min="100"
              max="4000"
              step="100"
              value={botData.max_tokens}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>짧음 (100)</span>
              <span>김 (4000)</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              봇이 생성할 수 있는 응답의 최대 길이(토큰 수)를 제한합니다.
            </p>
          </div>

          {/* Top-P 슬라이더 */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label htmlFor="top_p" className="text-sm font-medium text-gray-700">
                Top-P
              </label>
              <span className="text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                {botData.top_p.toFixed(2)}
              </span>
            </div>
            <input
              id="top_p"
              name="top_p"
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={botData.top_p}
              onChange={handleInputChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>결정적 (0.1)</span>
              <span>다양성 (1.0)</span>
            </div>
            <p className="mt-2 text-sm text-gray-500">
              모델이 고려하는 토큰의 확률 집합을 제어합니다. 낮은 값은 더 결정적인 응답을, 높은 값은 더 다양한 응답을 생성합니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step3PromptSettings;