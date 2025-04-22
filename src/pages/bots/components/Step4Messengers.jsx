// src/pages/bots/components/Step4Messengers.jsx
import React from 'react';
import { MessageCircle, MessageSquare, Slack, LayoutGrid, AlertTriangle } from 'lucide-react';

/**
 * 봇 생성 4단계: 메신저 연동 및 요약 컴포넌트
 * @param {Object} props
 * @param {Object} props.botData - 봇 데이터 상태
 * @param {Function} props.handleInputChange - 입력값 변경 핸들러
 * @param {string|null} props.error - 오류 메시지 (있는 경우)
 * @param {Array} props.llmOrigins - LLM 오리진 목록
 * @param {Array} props.llmModels - LLM 모델 목록
 * @param {boolean} props.isSaving - 저장 중 상태
 * @param {boolean} props.savedSuccess - 저장 성공 상태
 */
const Step4Messengers = ({
  botData,
  handleInputChange,
  error,
  llmOrigins,
  llmModels,
  isSaving,
  savedSuccess
}) => {
  // 오리진 및 모델 이름 조회
  const getOriginName = () => {
    const origin = llmOrigins.find(o => o.id.toString() === botData.llm_origin_id);
    return origin ? origin.name : '-';
  };

  const getModelName = () => {
    const model = llmModels.find(m => m.id.toString() === botData.llm_model_id);
    return model ? model.model_name : '-';
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
          <MessageCircle size={22} className="text-blue-500 mr-2" />
          메신저 연동 (선택 사항)
        </h2>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md mb-6">
            <div className="flex">
              <AlertTriangle size={20} className="text-red-500 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {/* 텔레그램 */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                  <MessageCircle size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">텔레그램</h3>
                  <p className="text-sm text-gray-500">Telegram 메신저와 봇 연동</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="telegram_enabled"
                  checked={botData.messengers.telegram.enabled}
                  onChange={(e) => {
                    handleInputChange({
                      target: {
                        name: 'messengers.telegram.enabled',
                        checked: e.target.checked,
                        type: 'checkbox'
                      }
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {botData.messengers.telegram.enabled && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <label htmlFor="telegram_token" className="block text-sm font-medium text-gray-700 mb-1">
                    텔레그램 봇 토큰
                  </label>
                  <input
                    id="telegram_token"
                    name="telegram_token"
                    type="text"
                    value={botData.messengers.telegram.token}
                    onChange={(e) => {
                      handleInputChange({
                        target: {
                          name: 'messengers.telegram.token',
                          value: e.target.value,
                          type: 'text'
                        }
                      });
                    }}
                    placeholder="123456789:ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghi"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    텔레그램의 BotFather에서 생성한 봇 토큰을 입력하세요.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 카카오톡 */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                  <MessageSquare size={20} className="text-yellow-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">카카오톡</h3>
                  <p className="text-sm text-gray-500">카카오톡 채널과 봇 연동</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="kakao_enabled"
                  checked={botData.messengers.kakao.enabled}
                  onChange={(e) => {
                    handleInputChange({
                      target: {
                        name: 'messengers.kakao.enabled',
                        checked: e.target.checked,
                        type: 'checkbox'
                      }
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-yellow-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-yellow-500"></div>
              </label>
            </div>

            {botData.messengers.kakao.enabled && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <label htmlFor="kakao_api_key" className="block text-sm font-medium text-gray-700 mb-1">
                    카카오 API 키
                  </label>
                  <input
                    id="kakao_api_key"
                    name="kakao_api_key"
                    type="text"
                    value={botData.messengers.kakao.api_key}
                    onChange={(e) => {
                      handleInputChange({
                        target: {
                          name: 'messengers.kakao.api_key',
                          value: e.target.value,
                          type: 'text'
                        }
                      });
                    }}
                    placeholder="abcd1234efgh5678ijkl9012"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    카카오 디벨로퍼스에서 발급받은 REST API 키를 입력하세요.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 슬랙 */}
          <div className="pb-6">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                  <Slack size={20} className="text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">슬랙</h3>
                  <p className="text-sm text-gray-500">Slack 워크스페이스와 봇 연동</p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  name="slack_enabled"
                  checked={botData.messengers.slack.enabled}
                  onChange={(e) => {
                    handleInputChange({
                      target: {
                        name: 'messengers.slack.enabled',
                        checked: e.target.checked,
                        type: 'checkbox'
                      }
                    });
                  }}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
            </div>

            {botData.messengers.slack.enabled && (
              <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                <div className="mb-4">
                  <label htmlFor="slack_bot_token" className="block text-sm font-medium text-gray-700 mb-1">
                    슬랙 봇 토큰
                  </label>
                  <input
                    id="slack_bot_token"
                    name="slack_bot_token"
                    type="text"
                    value={botData.messengers.slack.bot_token}
                    onChange={(e) => {
                      handleInputChange({
                        target: {
                          name: 'messengers.slack.bot_token',
                          value: e.target.value,
                          type: 'text'
                        }
                      });
                    }}
                    placeholder="xoxb-1234567890-1234567890123-abcdefghijklmnopqrstuvwx"
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    슬랙 API에서 봇 사용자 OAuth 토큰을 입력하세요. 'xoxb-'로 시작하는 토큰입니다.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* 웹훅 URL */}
          <div className="pt-2">
            <label htmlFor="webhook_url" className="block text-sm font-medium text-gray-700 mb-1">
              웹훅 URL (선택 사항)
            </label>
            <div className="flex items-center">
              <div className="flex-1">
                <input
                  id="webhook_url"
                  name="webhook_url"
                  type="url"
                  value={botData.webhook_url}
                  onChange={handleInputChange}
                  placeholder="https://example.com/webhook"
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">
              이벤트 발생 시 알림을 받을 웹훅 URL을 입력하세요. 챗봇 대화 내용이나 오류가 발생할 때 알림을 받을 수 있습니다.
            </p>
          </div>
        </div>
      </div>

      {/* 요약 및 최종 저장 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center mb-6">
          <LayoutGrid size={22} className="text-blue-500 mr-2" />
          요약 및 저장
        </h2>

        <div className="space-y-4 mb-6">
          <div className="flex border-b border-gray-100 pb-2">
            <div className="w-1/3 text-gray-500 text-sm">봇 이름</div>
            <div className="w-2/3 font-medium">{botData.name || '-'}</div>
          </div>
          <div className="flex border-b border-gray-100 pb-2">
            <div className="w-1/3 text-gray-500 text-sm">LLM 오리진</div>
            <div className="w-2/3 font-medium">{getOriginName()}</div>
          </div>
          <div className="flex border-b border-gray-100 pb-2">
            <div className="w-1/3 text-gray-500 text-sm">LLM 모델</div>
            <div className="w-2/3 font-medium">{getModelName()}</div>
          </div>
          <div className="flex border-b border-gray-100 pb-2">
            <div className="w-1/3 text-gray-500 text-sm">Temperature</div>
            <div className="w-2/3 font-medium">{botData.temperature.toFixed(1)}</div>
          </div>
          <div className="flex border-b border-gray-100 pb-2">
            <div className="w-1/3 text-gray-500 text-sm">최대 토큰</div>
            <div className="w-2/3 font-medium">{botData.max_tokens}</div>
          </div>
          <div className="flex">
            <div className="w-1/3 text-gray-500 text-sm">메신저 연동</div>
            <div className="w-2/3 font-medium">
              <div className="flex flex-wrap gap-2">
                {botData.messengers.telegram.enabled && (
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">텔레그램</span>
                )}
                {botData.messengers.kakao.enabled && (
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">카카오톡</span>
                )}
                {botData.messengers.slack.enabled && (
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded-full">슬랙</span>
                )}
                {!botData.messengers.telegram.enabled &&
                 !botData.messengers.kakao.enabled &&
                 !botData.messengers.slack.enabled && (
                  <span className="text-gray-500 text-sm">없음</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4Messengers;