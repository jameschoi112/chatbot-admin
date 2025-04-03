// src/pages/bots/components/tabs/MessengersTab.js
import React from 'react';
import {
  MessageCircle,
  MessageSquare,
  Slack,
  ToggleLeft,
  ToggleRight,
  ExternalLink
} from 'lucide-react';

const MessengersTab = ({ bot, toggleMessengerStatus }) => {
  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <MessageCircle size={20} className="text-blue-500 mr-2" />
        메신저 연동 설정
      </h2>

      <div className="space-y-6">
        {/* 텔레그램 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4 shadow-sm">
                <MessageCircle size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">텔레그램</h3>
                <p className="text-sm text-gray-500">직접 메시지 및 그룹 채팅 지원</p>
              </div>
            </div>
            <button
              onClick={() => toggleMessengerStatus('telegram')}
              className="focus:outline-none"
            >
              {bot.messengers.telegram.enabled ? (
                <ToggleRight size={36} className="text-blue-500" />
              ) : (
                <ToggleLeft size={36} className="text-gray-300" />
              )}
            </button>
          </div>

          {bot.messengers.telegram.enabled ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-500 mr-3">사용자명:</span>
                <span className="font-mono font-medium">{bot.messengers.telegram.username}</span>
              </div>
              <p className="text-sm text-gray-600">
                이 봇은 현재 텔레그램에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
              </p>
              <button className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors">
                텔레그램 설정 변경 <ExternalLink size={14} className="ml-1" />
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="flex items-center bg-gray-50 p-4 rounded-lg justify-center border border-gray-200">
                <p className="text-gray-500">이 봇은 현재 텔레그램과 연동되어 있지 않습니다</p>
              </div>
              <button className="w-full py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors">
                <MessageCircle size={18} className="mr-2" />
                텔레그램 연동 설정
              </button>
            </div>
          )}
        </div>

        {/* 카카오톡 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mr-4 shadow-sm">
                <MessageSquare size={24} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">카카오톡</h3>
                <p className="text-sm text-gray-500">스마트 채팅 및 비즈니스 채널</p>
              </div>
            </div>
            <button
              onClick={() => toggleMessengerStatus('kakao')}
              className="focus:outline-none"
            >
              {bot.messengers.kakao.enabled ? (
                <ToggleRight size={36} className="text-blue-500" />
              ) : (
                <ToggleLeft size={36} className="text-gray-300" />
              )}
            </button>
          </div>

          {bot.messengers.kakao.enabled ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-500 mr-3">API 키:</span>
                <span className="font-mono font-medium">{bot.messengers.kakao.key}</span>
              </div>
              <p className="text-sm text-gray-600">
                이 봇은 현재 카카오톡에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
              </p>
              <button className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors">
                카카오톡 설정 변경 <ExternalLink size={14} className="ml-1" />
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="flex items-center bg-gray-50 p-4 rounded-lg justify-center border border-gray-200">
                <p className="text-gray-500">이 봇은 현재 카카오톡과 연동되어 있지 않습니다</p>
              </div>
              <button className="w-full py-2 px-4 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors">
                <MessageSquare size={18} className="mr-2" />
                카카오톡 연동 설정
              </button>
            </div>
          )}
        </div>

        {/* 슬랙 */}
        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4 shadow-sm">
                <Slack size={24} className="text-purple-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">슬랙</h3>
                <p className="text-sm text-gray-500">팀 커뮤니케이션 및 워크스페이스 통합</p>
              </div>
            </div>
            <button
              onClick={() => toggleMessengerStatus('slack')}
              className="focus:outline-none"
            >
              {bot.messengers.slack.enabled ? (
                <ToggleRight size={36} className="text-blue-500" />
              ) : (
                <ToggleLeft size={36} className="text-gray-300" />
              )}
            </button>
          </div>

          {bot.messengers.slack.enabled ? (
            <div className="mt-4 space-y-4">
              <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                <span className="text-gray-500 mr-3">워크스페이스:</span>
                <span className="font-mono font-medium">{bot.messengers.slack.workspace}</span>
              </div>
              <p className="text-sm text-gray-600">
                이 봇은 현재 슬랙에서 활성화되어 있으며 사용자와 대화할 수 있습니다.
              </p>
              <button className="mt-2 text-blue-500 hover:text-blue-600 text-sm font-medium flex items-center transition-colors">
                슬랙 설정 변경 <ExternalLink size={14} className="ml-1" />
              </button>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              <div className="flex items-center bg-gray-50 p-4 rounded-lg justify-center border border-gray-200">
                <p className="text-gray-500">이 봇은 현재 슬랙과 연동되어 있지 않습니다</p>
              </div>
              <button className="w-full py-2 px-4 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium flex items-center justify-center transition-colors">
                <Slack size={18} className="mr-2" />
                슬랙 연동 설정
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessengersTab;