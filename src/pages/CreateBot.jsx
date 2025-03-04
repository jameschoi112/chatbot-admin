import React, { useState } from 'react';
import {Bot, MessageCircle, ToggleLeft, ToggleRight, MessageSquare, Slack, Link } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import Chat from '../components/Chat';

const CreateBot = () => {
  const navigate = useNavigate();

  // 기본 봇 정보 상태
  const [botName, setBotName] = useState('');
  const [description, setDescription] = useState('');
  const [systemPrompt, setSystemPrompt] = useState('');
  const [embeddingModel, setEmbeddingModel] = useState('text-embedding-3-large');
  const [webhookUrl, setWebhookUrl] = useState('');

  // 메신저 플랫폼 토글 상태
  const [telegramEnabled, setTelegramEnabled] = useState(false);
  const [kakaoEnabled, setKakaoEnabled] = useState(false);
  const [slackEnabled, setSlackEnabled] = useState(false);

  // 메신저 플랫폼 설정 상태
  const [telegramToken, setTelegramToken] = useState('');
  const [kakaoApiKey, setKakaoApiKey] = useState('');
  const [slackBotToken, setSlackBotToken] = useState('');

  // 설정 저장 상태
  const [telegramSaved, setTelegramSaved] = useState(false);
  const [kakaoSaved, setKakaoSaved] = useState(false);
  const [slackSaved, setSlackSaved] = useState(false);

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();
    // 여기서 API 요청을 처리하거나 상태를 저장
    console.log({
      botName,
      description,
      systemPrompt,
      embeddingModel,
      telegramEnabled,
      telegramToken,
      kakaoEnabled,
      kakaoApiKey,
      slackEnabled,
      slackBotToken,
      webhookUrl
    });

    // 저장 후 대시보드로 리디렉션
    navigate('/');
  };

  // 취소 처리
  const handleCancel = () => {
    navigate('/');
  };

  // 텔레그램 설정 저장
  const saveTelegramSettings = () => {
    if (telegramToken.trim()) {
      setTelegramSaved(true);
      setTimeout(() => setTelegramSaved(false), 2000);
    }
  };

  // 카카오 설정 저장
  const saveKakaoSettings = () => {
    if (kakaoApiKey.trim()) {
      setKakaoSaved(true);
      setTimeout(() => setKakaoSaved(false), 2000);
    }
  };

  // 슬랙 설정 저장
  const saveSlackSettings = () => {
    if (slackBotToken.trim()) {
      setSlackSaved(true);
      setTimeout(() => setSlackSaved(false), 2000);
    }
  };

  const createBotContent = (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">새 봇 만들기</h1>

      <form onSubmit={handleSubmit}>
        {/* 기본 정보 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Bot size={20} className="text-sky-500 mr-2" />
            기본 정보
          </h2>

          <div className="space-y-6">
            {/* 봇 이름 */}
            <div className="grid grid-cols-3 gap-4 items-start">
              <div>
                <label htmlFor="botName" className="block text-sm font-medium text-gray-700 mb-1">
                  봇 이름*
                </label>
                <div className="text-xs text-gray-500">이 봇의 고유한 이름을 지정합니다.</div>
              </div>
              <div className="col-span-2">
                <input
                  id="botName"
                  type="text"
                  value={botName}
                  onChange={(e) => setBotName(e.target.value)}
                  required
                  placeholder="예: 고객 지원 봇"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* 봇 설명 */}
            <div className="grid grid-cols-3 gap-4 items-start">
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  설명
                </label>
                <div className="text-xs text-gray-500">이 봇의 목적과 기능을 설명합니다.</div>
              </div>
              <div className="col-span-2">
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="이 봇은 무엇을 하는지 설명해주세요."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 h-24"
                />
              </div>
            </div>

            {/* 시스템 프롬프트 */}
            <div className="grid grid-cols-3 gap-4 items-start">
              <div>
                <label htmlFor="systemPrompt" className="block text-sm font-medium text-gray-700 mb-1">
                  시스템 프롬프트*
                </label>
                <div className="text-xs text-gray-500">
                  AI 모델에게 지시할 프롬프트입니다. 봇의 역할과 응답 방식을 정의합니다.
                </div>
              </div>
              <div className="col-span-2">
                <textarea
                  id="systemPrompt"
                  value={systemPrompt}
                  onChange={(e) => setSystemPrompt(e.target.value)}
                  required
                  placeholder="당신은 친절한 고객 서비스 챗봇입니다. 항상 존중하는 태도로 질문에 답변해 주세요."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 h-32"
                />
              </div>
            </div>

            {/* 임베딩 모델 */}
            <div className="grid grid-cols-3 gap-4 items-start">
              <div>
                <label htmlFor="embeddingModel" className="block text-sm font-medium text-gray-700 mb-1">
                  임베딩 모델
                </label>
                <div className="text-xs text-gray-500">문서를 벡터화할 때 사용할 임베딩 모델을 선택합니다.</div>
              </div>
              <div className="col-span-2">
                <select
                  id="embeddingModel"
                  value={embeddingModel}
                  onChange={(e) => setEmbeddingModel(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="text-embedding-3-large">text-embedding-3-large</option>
                  <option value="text-embedding-3-small">text-embedding-3-small</option>
                  <option value="text-embedding-ada-002">text-embedding-ada-002</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 메신저 플랫폼 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <MessageCircle size={20} className="text-sky-500 mr-2" />
            메신저 플랫폼 연결
          </h2>

          <div className="space-y-8">
            {/* 텔레그램 */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <span className="font-medium">텔레그램</span>
                </div>
                <button
                  type="button"
                  onClick={() => setTelegramEnabled(!telegramEnabled)}
                  className="focus:outline-none"
                >
                  {telegramEnabled ? (
                    <ToggleRight size={28} className="text-sky-500" />
                  ) : (
                    <ToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              {telegramEnabled && (
                <div className="mt-4 pl-7">
                  <div className="grid grid-cols-3 gap-4 items-center mb-3">
                    <div>
                      <label htmlFor="telegramToken" className="block text-sm font-medium text-gray-700">
                        텔레그램 봇 토큰
                      </label>
                    </div>
                    <div className="col-span-2 flex">
                      <input
                        id="telegramToken"
                        type="text"
                        value={telegramToken}
                        onChange={(e) => setTelegramToken(e.target.value)}
                        placeholder="1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={saveTelegramSettings}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-r-lg transition-colors"
                      >
                        {telegramSaved ? '저장됨' : '저장'}
                      </button>
                    </div>
                  </div>
                  <div className="pl-7 text-xs text-gray-500">
                    @BotFather에서 생성한 봇 토큰을 입력하세요. 형식: 1234567890:ABCDEFGHIJKLMNOPQRSTUVWXYZ
                  </div>
                </div>
              )}
            </div>

            {/* 카카오톡 */}
            <div className="border-b pb-6">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <MessageSquare size={20} className="text-yellow-500 mr-2" />
                  <span className="font-medium">카카오톡</span>
                </div>
                <button
                  type="button"
                  onClick={() => setKakaoEnabled(!kakaoEnabled)}
                  className="focus:outline-none"
                >
                  {kakaoEnabled ? (
                    <ToggleRight size={28} className="text-sky-500" />
                  ) : (
                    <ToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              {kakaoEnabled && (
                <div className="mt-4 pl-7">
                  <div className="grid grid-cols-3 gap-4 items-center mb-3">
                    <div>
                      <label htmlFor="kakaoApiKey" className="block text-sm font-medium text-gray-700">
                        카카오 API 키
                      </label>
                    </div>
                    <div className="col-span-2 flex">
                      <input
                        id="kakaoApiKey"
                        type="text"
                        value={kakaoApiKey}
                        onChange={(e) => setKakaoApiKey(e.target.value)}
                        placeholder="abcd1234efgh5678ijkl9012"
                        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={saveKakaoSettings}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-r-lg transition-colors"
                      >
                        {kakaoSaved ? '저장됨' : '저장'}
                      </button>
                    </div>
                  </div>
                  <div className="pl-7 text-xs text-gray-500">
                    카카오 디벨로퍼스에서 발급받은 REST API 키를 입력하세요.
                  </div>
                </div>
              )}
            </div>

            {/* 슬랙 */}
            <div className="pb-4">
              <div className="flex justify-between items-center mb-3">
                <div className="flex items-center">
                  <Slack size={20} className="text-purple-600 mr-2" />
                  <span className="font-medium">슬랙</span>
                </div>
                <button
                  type="button"
                  onClick={() => setSlackEnabled(!slackEnabled)}
                  className="focus:outline-none"
                >
                  {slackEnabled ? (
                    <ToggleRight size={28} className="text-sky-500" />
                  ) : (
                    <ToggleLeft size={28} className="text-gray-400" />
                  )}
                </button>
              </div>

              {slackEnabled && (
                <div className="mt-4 pl-7">
                  <div className="grid grid-cols-3 gap-4 items-center mb-3">
                    <div>
                      <label htmlFor="slackBotToken" className="block text-sm font-medium text-gray-700">
                        슬랙 봇 토큰
                      </label>
                    </div>
                    <div className="col-span-2 flex">
                      <input
                        id="slackBotToken"
                        type="text"
                        value={slackBotToken}
                        onChange={(e) => setSlackBotToken(e.target.value)}
                        placeholder="oxb-XXXX-XXXX-XXXX"
                        className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                      />
                      <button
                        type="button"
                        onClick={saveSlackSettings}
                        className="bg-sky-500 hover:bg-sky-600 text-white px-3 py-2 rounded-r-lg transition-colors"
                      >
                        {slackSaved ? '저장됨' : '저장'}
                      </button>
                    </div>
                  </div>
                  <div className="pl-7 text-xs text-gray-500">
                    슬랙 API에서 봇 사용자 OAuth 토큰을 입력하세요. 'xoxb-'로 시작하는 토큰입니다.
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 웹훅 URL 섹션 */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4 flex items-center">
            <Link size={20} className="text-sky-500 mr-2" />
            웹훅 설정 (선택사항)
          </h2>

          <div className="grid grid-cols-3 gap-4 items-start">
            <div>
              <label htmlFor="webhookUrl" className="block text-sm font-medium text-gray-700 mb-1">
                웹훅 URL
              </label>
              <div className="text-xs text-gray-500">
                이벤트 발생 시 알림을 받을 웹훅 URL을 입력하세요. 챗봇 대화 내용이나 오류가 발생할 때 알림을 받을 수 있습니다.
              </div>
            </div>
            <div className="col-span-2">
              <input
                id="webhookUrl"
                type="url"
                value={webhookUrl}
                onChange={(e) => setWebhookUrl(e.target.value)}
                placeholder="https://example.com/webhook"
                className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>
        </div>

        {/* 버튼 그룹 */}
        <div className="flex justify-end space-x-4 mt-6">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg shadow-md transition-colors"
          >
            저장
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <>
      <Layout activeMenu="bots">
        {createBotContent}
      </Layout>
      <Chat />
    </>
  );
};

export default CreateBot;