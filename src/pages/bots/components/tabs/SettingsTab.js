// src/pages/bots/components/tabs/SettingsTab.js
import React from 'react';
import {
  Settings,
  Database,
  Bot,
  ToggleRight
} from 'lucide-react';

const SettingsTab = ({ bot }) => {
  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Settings size={20} className="text-blue-500 mr-2" />
        봇 설정
      </h2>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-6">
        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
          <Database size={18} className="text-blue-500 mr-2" />
          모델 설정
        </h3>

        <div className="space-y-6">
          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Temperature</label>
              <span className="text-sm font-medium text-gray-700">{bot.settings.temperature}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={bot.settings.temperature}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
              />
              <div className="absolute left-0 right-0 -bottom-6 flex justify-between px-2">
                <span className="text-xs text-gray-500">일관성</span>
                <span className="text-xs text-gray-500">창의성</span>
              </div>
            </div>
            <p className="mt-8 text-xs text-gray-500">낮을수록 일관된 응답, 높을수록 다양한 응답을 생성합니다.</p>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Maximum Tokens</label>
              <span className="text-sm font-medium text-gray-700">{bot.settings.maxTokens}</span>
            </div>
            <input
              type="range"
              min="100"
              max="4000"
              step="100"
              value={bot.settings.maxTokens}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">응답의 최대 길이를 제한합니다.</p>
          </div>

          <div className="flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium text-gray-700">Top P</label>
              <span className="text-sm font-medium text-gray-700">{bot.settings.topP}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bot.settings.topP}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="mt-1 text-xs text-gray-500">낮을수록 더 결정적인 응답, 높을수록 더 다양한 응답을 생성합니다.</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-gray-800 flex items-center">
            <Bot size={18} className="text-blue-500 mr-2" />
            봇 행동 설정
          </h3>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-800">시스템 프롬프트</h4>
              <p className="text-sm text-gray-500 mt-1">봇의 동작과 성격을 정의하는 지시문</p>
            </div>
            <button className="text-blue-500 hover:text-blue-600 transition-colors">
              편집
            </button>
          </div>

          <div className="flex items-center justify-between py-3 border-b border-gray-100">
            <div>
              <h4 className="font-medium text-gray-800">색인 업데이트 빈도</h4>
              <p className="text-sm text-gray-500 mt-1">봇이 문서를 재색인화하는 주기</p>
            </div>
            <select className="border border-gray-300 rounded-md px-3 py-1.5 bg-white text-sm">
              <option>매일</option>
              <option>매주</option>
              <option>매월</option>
              <option>수동</option>
            </select>
          </div>

          <div className="flex items-center justify-between py-3">
            <div>
              <h4 className="font-medium text-gray-800">자동 학습</h4>
              <p className="text-sm text-gray-500 mt-1">대화 데이터를 활용한 자동 개선 여부</p>
            </div>
            <button className="focus:outline-none">
              <ToggleRight size={36} className="text-blue-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsTab;