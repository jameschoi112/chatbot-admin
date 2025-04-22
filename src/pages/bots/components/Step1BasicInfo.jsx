// src/pages/bots/components/Step1BasicInfo.jsx
import React from 'react';
import { Bot, AlertTriangle } from 'lucide-react';

/**
 * 봇 생성 1단계: 기본 정보 입력 컴포넌트
 * @param {Object} props
 * @param {Object} props.botData - 봇 데이터 상태
 * @param {Function} props.handleInputChange - 입력값 변경 핸들러
 * @param {string|null} props.error - 오류 메시지 (있는 경우)
 */
const Step1BasicInfo = ({ botData, handleInputChange, error }) => {
  return (
    <div className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold text-gray-800 flex items-center">

        기본 정보
      </h2>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex">
            <AlertTriangle size={20} className="text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            봇 이름 <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={botData.name}
            onChange={handleInputChange}
            required
            placeholder="고객 지원 봇"
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="mt-1 text-sm text-gray-500">
            봇의 고유한 이름을 입력하세요. 다른 봇과 구분할 수 있는 이름이 좋습니다.
          </p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            설명
          </label>
          <textarea
            id="description"
            name="description"
            value={botData.description}
            onChange={handleInputChange}
            placeholder="이 봇은 고객 서비스 질문에 답변하고 제품 정보를 제공합니다."
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
          />
          <p className="mt-1 text-sm text-gray-500">
            봇의 목적과 기능을 간략히 설명하세요. 이 정보는 봇을 관리하는 데 도움이 됩니다.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Step1BasicInfo;