// src/pages/bots/components/BotHeader.js
import React from 'react';
import {
  Bot,
  Calendar,
  User,
  Activity,
  MessageCircle,
  Star,
  CheckCircle,
  Clock
} from 'lucide-react';

const BotHeader = ({ bot, isLoading, openChatModal, toggleBotStatus, handleDeleteBot }) => {
  return (
    <div className={`relative rounded-2xl overflow-hidden shadow-xl transition-all duration-500 ${isLoading ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`}>
      {/* 헤더 배경 - 세련된 그라디언트 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-700 via-blue-400 to-sky-600"></div>

      {/* 미묘한 그리드 패턴 오버레이 */}
      <div className="absolute inset-0 opacity-5">
        <div className="w-full h-full" style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width="20" height="20" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="white" fill-opacity="1" fill-rule="evenodd"%3E%3Ccircle cx="3" cy="3" r="1"/%3E%3Ccircle cx="13" cy="13" r="1"/%3E%3C/g%3E%3C/svg%3E")',
          backgroundSize: '20px 20px'
        }}></div>
      </div>

      {/* 헤더 콘텐츠 */}
      <div className="relative p-8 text-white z-10">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center shadow-lg">
                <Bot size={28} className="text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">{bot.name}</h1>
                <div className="flex items-center mt-1 space-x-3">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    bot.status === 'active'
                      ? 'bg-green-500/20 text-green-100 border border-green-400/30'
                      : 'bg-gray-500/20 text-gray-100 border border-gray-400/30'
                  }`}>
                    {bot.status === 'active' ? '활성' : '비활성'}
                  </span>
                  <span className="text-xs text-white/70 flex items-center">
                    <Calendar size={12} className="mr-1" /> {bot.created} 생성
                  </span>
                  <span className="text-xs text-white/70 flex items-center">
                    <User size={12} className="mr-1" /> {bot.creator}
                  </span>
                </div>
              </div>
            </div>
            <p className="text-white font-semibold max-w-3xl leading-relaxed mt-2">
              {bot.description}
            </p>
          </div>

          {/* 우측 상단 버튼 영역 */}
          <div className="flex flex-col space-y-3">
            <button
              onClick={openChatModal}
              className="flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-white/90 transition-all shadow-md animate-fadeIn"
            >
              <MessageCircle size={18} className="mr-2" />
              <span>봇과 대화하기</span>
            </button>

            <div className="flex space-x-2">
              <button
                onClick={toggleBotStatus}
                className={`px-4 py-2 rounded-lg transition-colors whitespace-nowrap ${
                  bot.status === 'active'
                    ? 'bg-red-500/20 text-white hover:bg-red-500/30 border border-red-400/30'
                    : 'bg-green-500/20 text-white hover:bg-green-500/30 border border-green-400/30'
                }`}
              >
                {bot.status === 'active' ? '비활성화' : '활성화'}
              </button>
              <button
                onClick={handleDeleteBot}
                className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-white rounded-lg transition-colors border border-red-400/30"
              >
                삭제
              </button>
            </div>
          </div>
        </div>

        {/* 간단한 통계 지표 */}
        <div className="grid grid-cols-4 gap-4 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-transform hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">누적 사용량</h3>

            </div>
            <p className="text-2xl font-bold mt-1">{bot.usageCount.toLocaleString()}회</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-transform hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">평균 응답시간</h3>

            </div>
            <p className="text-2xl font-bold mt-1">{bot.stats.responseTime}초</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-transform hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">답변 정확률</h3>

            </div>
            <p className="text-2xl font-bold mt-1">{bot.stats.accuracy}%</p>
          </div>

          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20 transition-transform hover:transform hover:scale-105">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white">봇 만족도</h3>
              <Star size={16} className="text-white/60" />
            </div>
            <p className="text-2xl font-bold mt-1">{bot.stats.satisfaction}/5</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BotHeader;