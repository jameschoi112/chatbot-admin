// src/pages/prompts/components/PromptPlaygroundModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, MessageSquare, Send, Bot, RefreshCw, AlertTriangle, Settings, Info, Cpu, Database, User } from 'lucide-react';
import promptService from '../../../api/promptService';
import { originService, modelService } from '../../../api/llmService';

/**
 * 프롬프트 테스트 플레이그라운드 모달 컴포넌트
 * @param {Object} props
 * @param {boolean} props.isOpen - 모달 표시 여부
 * @param {Function} props.onClose - 모달 닫기 핸들러
 * @param {Object} props.prompt - 테스트할 프롬프트 정보
 */
const PromptPlaygroundModal = ({ isOpen, onClose, prompt }) => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [error, setError] = useState(null);

  // LLM 설정 관련 상태
  const [origins, setOrigins] = useState([]);
  const [models, setModels] = useState([]);
  const [selectedOrigin, setSelectedOrigin] = useState('');
  const [selectedModel, setSelectedModel] = useState('');
  const [loadingOrigins, setLoadingOrigins] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  // 오리진 및 모델 로딩
  const loadOrigins = async () => {
    setLoadingOrigins(true);
    try {
      const response = await originService.getAllOrigins();
      setOrigins(response);
      if (response.length > 0) {
        setSelectedOrigin(response[0].id.toString());
      }
    } catch (err) {
      console.error('오리진 로딩 오류:', err);
      setError('LLM 오리진을 로드하는데 실패했습니다.');
    } finally {
      setLoadingOrigins(false);
    }
  };

  const loadModels = async (originId) => {
    if (!originId) return;

    setLoadingModels(true);
    try {
      const response = await modelService.getModelsByOrigin(originId);
      setModels(response);
      if (response.length > 0) {
        setSelectedModel(response[0].id.toString());
      } else {
        setSelectedModel('');
      }
    } catch (err) {
      console.error('모델 로딩 오류:', err);
      setError('LLM 모델을 로드하는데 실패했습니다.');
    } finally {
      setLoadingModels(false);
    }
  };

  // 메시지 전송 핸들러
  const handleSendMessage = async () => {
    if (!userMessage.trim() || isLoading) return;

    // 오리진과 모델이 선택되어 있는지 확인
    if (!selectedOrigin || !selectedModel) {
      setError('LLM 오리진과 모델을 선택해주세요.');
      setShowSettings(true);
      return;
    }

    const userMsg = {
      id: Date.now(),
      role: 'user',
      content: userMessage
    };

    setMessages(prev => [...prev, userMsg]);
    setUserMessage('');
    setIsLoading(true);
    setError(null);

    try {
      // LLM API 호출
      const response = await promptService.invokeLlm({
        origin_id: parseInt(selectedOrigin),
        llm_model_id: parseInt(selectedModel),
        system_message_id: prompt.id,
        user_message: userMessage
      });

      console.log('LLM 응답:', response); // 디버깅을 위한 로그 추가

      // 응답 처리 로직 개선
      let responseContent = '응답 없음';

      // 응답이 객체인 경우 적절한 필드 확인
      if (response) {
        if (typeof response === 'string') {
          responseContent = response;
        } else if (typeof response === 'object') {
          // API 응답 구조에 맞게 처리
          // 주요 응답 필드 확인 (공유해주신 구조에 맞게 수정)
          if (response.content) {
            // OpenAI/Claude 스타일 응답 구조
            responseContent = response.content;
          } else if (response.choices && response.choices.length > 0) {
            // OpenAI 스타일 응답 (다른 형태)
            responseContent = response.choices[0].message?.content || response.choices[0].text;
          } else if (response.text) {
            // 텍스트 직접 응답
            responseContent = response.text;
          } else if (response.message) {
            // 메시지 형태 응답
            responseContent = response.message;
          } else {
            // 기타 형태: 객체를 문자열화
            responseContent = JSON.stringify(response);
          }
        }
      }

      // 응답 추가
      const botMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: responseContent
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('LLM 호출 오류:', err);
      setError('LLM 호출에 실패했습니다: ' + (err.message || '알 수 없는 오류'));

      // 오류 메시지 추가
      const errorMsg = {
        id: Date.now() + 1,
        role: 'error',
        content: '오류가 발생했습니다: ' + (err.message || '알 수 없는 오류')
      };

      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  // 선택된 오리진이 변경되면 모델 목록 업데이트
  useEffect(() => {
    if (selectedOrigin) {
      loadModels(selectedOrigin);
    } else {
      setModels([]);
      setSelectedModel('');
    }
  }, [selectedOrigin]);

  // 컴포넌트 마운트 시 초기화
  useEffect(() => {
    if (isOpen) {
      setMessages([{
        id: 1,
        role: 'system',
        content: '프롬프트 테스트를 시작합니다. 메시지를 입력하세요.'
      }, {
        id: 2,
        role: 'info',
        content: `현재 테스트 중인 프롬프트: "${prompt.name}"`
      }]);
      loadOrigins();
      setError(null);
    }
  }, [isOpen, prompt?.name]);

  const messagesEndRef = useRef(null);

  // 메시지가 추가될 때마다 스크롤 맨 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 엔터 키로 메시지 전송
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // 모달이 닫혔을 때는 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl animate-scale-up h-5/6 flex flex-col">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 rounded-t-xl flex justify-between items-center">
          <h3 className="text-white text-lg font-semibold flex items-center">
            <MessageSquare size={20} className="mr-2" />
            프롬프트 응답 미리보기
          </h3>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowSettings(!showSettings)}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
              title="LLM 설정"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/10"
              title="닫기"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 flex overflow-hidden">
          {/* 메인 채팅 영역 */}
          <div className={`flex-1 flex flex-col ${showSettings ? 'hidden md:flex' : 'flex'}`}>
            {/* 프롬프트 내용 확인 영역 */}
            <div className="bg-gray-50 p-3 border-b border-gray-200">
              <div className="flex items-start">
                <Info size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="text-sm font-medium text-gray-700">현재 프롬프트</h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{prompt.content}</p>
                </div>
              </div>
            </div>

            {/* 채팅 메시지 영역 */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.role === 'user'
                      ? 'justify-end'
                      : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[80%] rounded-lg px-4 py-3 ${
                      message.role === 'user'
                        ? 'bg-blue-500 text-white'
                        : message.role === 'system'
                          ? 'bg-gray-200 text-gray-700 border border-gray-300'
                          : message.role === 'info'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : message.role === 'error'
                              ? 'bg-red-50 text-red-700 border border-red-200'
                              : 'bg-white text-gray-700 border border-gray-200 shadow-sm'
                    }`}
                  >
                    {message.role !== 'user' && message.role !== 'info' && message.role !== 'error' && (
                      <div className="flex items-center mb-2 text-xs text-gray-500">
                        <Bot size={14} className="mr-1" />
                        <span>AI 응답</span>
                      </div>
                    )}

                    {message.role === 'user' && (
                      <div className="flex items-center mb-2 text-xs text-blue-100 justify-end">
                        <span>사용자</span>
                        <User size={14} className="ml-1" />
                      </div>
                    )}

                    {message.role === 'info' && (
                      <div className="flex items-center mb-2 text-xs text-blue-500">
                        <Info size={14} className="mr-1" />
                        <span>정보</span>
                      </div>
                    )}

                    {message.role === 'error' && (
                      <div className="flex items-center mb-2 text-xs text-red-500">
                        <AlertTriangle size={14} className="mr-1" />
                        <span>오류</span>
                      </div>
                    )}

                    <div className="whitespace-pre-wrap">{message.content}</div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white rounded-lg px-4 py-3 border border-gray-200 shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                      <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                  </div>
                </div>
              )}

              {/* 스크롤을 위한 참조 요소 */}
              <div ref={messagesEndRef}></div>
            </div>

            {/* 입력 영역 */}
            <div className="border-t border-gray-200 p-3 bg-white">
              {error && (
                <div className="mb-3 p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-sm flex items-start">
                  <AlertTriangle size={16} className="mr-2 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="flex space-x-2">
                <textarea
                  value={userMessage}
                  onChange={(e) => setUserMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="메시지를 입력하세요..."
                  className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  rows={2}
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!userMessage.trim() || isLoading}
                  className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
                    !userMessage.trim() || isLoading
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-500 text-white hover:bg-blue-600'
                  }`}
                >
                  {isLoading ? (
                    <RefreshCw size={18} className="animate-spin" />
                  ) : (
                    <Send size={18} />
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* 설정 패널 */}
          {showSettings && (
            <div className="w-full md:w-80 border-l border-gray-200 bg-gray-50 p-4 overflow-y-auto">
              <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                <Settings size={18} className="mr-2 text-gray-500" />
                LLM 설정
              </h3>

              {/* 오리진 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LLM 오리진
                </label>
                {loadingOrigins ? (
                  <div className="flex justify-center py-2">
                    <RefreshCw size={20} className="text-blue-500 animate-spin" />
                  </div>
                ) : origins.length === 0 ? (
                  <div className="text-center py-4 bg-gray-100 rounded-lg text-gray-500 text-sm">
                    <Database size={20} className="mx-auto mb-1 text-gray-400" />
                    오리진이 없습니다
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {origins.map(origin => (
                      <div
                        key={origin.id}
                        onClick={() => setSelectedOrigin(origin.id.toString())}
                        className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                          selectedOrigin === origin.id.toString()
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                            origin.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            <Database size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">{origin.name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {origin.base_url.length > 20
                                ? `${origin.base_url.substring(0, 20)}...`
                                : origin.base_url}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 모델 선택 */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  LLM 모델
                </label>
                {!selectedOrigin ? (
                  <div className="text-center py-4 bg-gray-100 rounded-lg text-gray-500 text-sm">
                    <Cpu size={20} className="mx-auto mb-1 text-gray-400" />
                    오리진을 먼저 선택하세요
                  </div>
                ) : loadingModels ? (
                  <div className="flex justify-center py-2">
                    <RefreshCw size={20} className="text-blue-500 animate-spin" />
                  </div>
                ) : models.length === 0 ? (
                  <div className="text-center py-4 bg-gray-100 rounded-lg text-gray-500 text-sm">
                    <Cpu size={20} className="mx-auto mb-1 text-gray-400" />
                    모델이 없습니다
                  </div>
                ) : (
                  <div className="grid gap-2">
                    {models.map(model => (
                      <div
                        key={model.id}
                        onClick={() => setSelectedModel(model.id.toString())}
                        className={`cursor-pointer p-3 rounded-lg border transition-colors ${
                          selectedModel === model.id.toString()
                            ? 'border-blue-500 bg-blue-50'
                            : 'border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                            model.is_active
                              ? 'bg-green-100 text-green-700'
                              : 'bg-gray-100 text-gray-500'
                          }`}>
                            <Cpu size={16} />
                          </div>
                          <div>
                            <div className="font-medium text-gray-700">{model.model_name}</div>
                            <div className="text-xs text-gray-500 mt-0.5">
                              {model.context_length && `컨텍스트: ${model.context_length.toLocaleString()}`}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* 프롬프트 내용 참조 */}
              <div className="mt-8 border-t border-gray-200 pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <Info size={16} className="mr-2 text-gray-500" />
                  테스트 중인 프롬프트
                </h4>
                <div className="p-3 bg-gray-100 rounded-lg border border-gray-200 text-xs font-mono text-gray-700 max-h-40 overflow-y-auto">
                  {prompt.content}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PromptPlaygroundModal;