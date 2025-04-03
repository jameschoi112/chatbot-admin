// src/pages/bots/components/tabs/ApiTab.js
import React from 'react';
import {
  Code,
  Key,
  Info,
  Eye,
  EyeOff,
  Copy,
  Check,
  RefreshCw,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';

const ApiTab = ({ bot, showApiKey, toggleShowApiKey, copied, copyApiKey, handleRegenerateKey }) => {
  return (
    <div className="p-6 animate-fadeIn">
      <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
        <Code size={20} className="text-blue-500 mr-2" />
        API 연동 정보
      </h2>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <label className="block text-md font-medium text-gray-800 mb-3 flex items-center">
          <Key size={18} className="text-blue-500 mr-2" />
          API 키
        </label>
        <div className="flex items-center">
          <div className="relative flex-grow">
            <input
              type={showApiKey ? "text" : "password"}
              readOnly
              value={bot.apiKey}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 focus:outline-none shadow-sm font-mono text-gray-700"
            />
            <button
              onClick={toggleShowApiKey}
              className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            >
              {showApiKey ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button
            onClick={copyApiKey}
            className={`ml-3 px-4 py-3 flex items-center rounded-lg transition-all ${
              copied
                ? 'bg-green-500 text-white'
                : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {copied ? <Check size={18} className="mr-1" /> : <Copy size={18} className="mr-1" />}
            {copied ? '복사됨' : '복사'}
          </button>
        </div>
        <p className="mt-3 text-sm text-gray-600 flex items-start">
          <Info size={16} className="text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
          이 API 키는 봇을 프로그래밍 방식으로 사용하기 위한 인증 정보입니다. 안전하게 보관하세요.
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 mb-8">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium text-gray-800 flex items-center">
            <RefreshCw size={18} className="text-blue-500 mr-2" />
            키 관리
          </h3>
          <button
            onClick={handleRegenerateKey}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all shadow-sm"
          >
            <RefreshCw size={18} className="mr-2" />
            API 키 재생성
          </button>
        </div>
        <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
          <div className="flex">
            <AlertTriangle size={20} className="text-amber-500 mr-3 flex-shrink-0" />
            <div>
              <p className="text-sm text-amber-700">
                API 키를 재생성하면 기존 키는 더 이상 사용할 수 없게 됩니다.
                이 작업은 되돌릴 수 없으며, 모든 연동 서비스에서 새 키로 업데이트해야 합니다.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
        <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
          <Code size={18} className="text-blue-500 mr-2" />
          API 사용 예시
        </h3>
        <div className="bg-gray-800 rounded-lg p-6 text-green-400 font-mono text-sm overflow-x-auto shadow-md">
          <pre className="animate-fadeIn">
{`curl -X POST https://api.cplabs.ai/v1/bots/${bot.id}/chat \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer ${bot.apiKey}" \\
  -d '{"messages": [{"role": "user", "content": "안녕하세요"}]}'`}
          </pre>
        </div>
        <div className="mt-4 flex justify-between">
          <p className="text-sm text-gray-600 flex items-center">
            <Info size={16} className="text-blue-500 mr-2" />
            API 문서에서 더 자세한 사용 방법을 확인할 수 있습니다.
          </p>
          <a href="#" className="text-blue-600 hover:text-blue-800 text-sm font-medium inline-flex items-center transition-colors">
            API 문서 보기 <ExternalLink size={14} className="ml-1" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default ApiTab;