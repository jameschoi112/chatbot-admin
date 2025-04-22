import React from 'react';
import { Check } from 'lucide-react';

/**
 * 봇 생성 단계 진행 상태를 보여주는 컴포넌트 - 트렌디한 디자인
 * @param {Object} props
 * @param {number} props.currentStep - 현재 단계 (1부터 시작)
 * @param {number} props.totalSteps - 전체 단계 수
 */
const StepIndicator = ({ currentStep, totalSteps = 4 }) => {
  // 단계별 레이블 정의
  const stepLabels = ['기본 정보', 'LLM 설정', '프롬프트', '메신저 연동'];

  // 단계별 아이콘 또는 번호 렌더링 함수
  const renderStepIcon = (index) => {
    if (index + 1 < currentStep) {
      return (
        <div className="bg-gradient-to-br from-green-400 to-emerald-600 p-1 rounded-full">
          <Check size={18} className="text-white" />
        </div>
      );
    }
    return <span className="text-sm font-bold">{index + 1}</span>;
  };

  return (
    <div className="mb-10">
      {/* 단계 표시기 */}
      <div className="flex justify-between mb-4 relative">
        {/* 애니메이션이 있는 진행 표시줄을 여기로 이동 */}
        <div className="absolute top-6 left-0 right-0 h-3 bg-gray-100 rounded-full overflow-hidden shadow-inner" style={{ zIndex: 1 }}>
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-indigo-600 transition-all duration-500 ease-out rounded-full shadow-lg"
            style={{ width: `${Math.max(5, (currentStep - 1) / (totalSteps - 1) * 100)}%` }}
          >
            {/* 반짝이는 효과 */}
            <div className="absolute inset-0 opacity-30 overflow-hidden">
              <div className="w-20 h-full bg-white transform -skew-x-30 animate-shine"></div>
            </div>
          </div>
        </div>

        {/* 단계 아이콘들 - 선 위에 렌더링되도록 z-index 조정 */}
        {[...Array(totalSteps)].map((_, index) => (
          <div
            key={index}
            className="flex flex-col items-center"
            style={{ zIndex: 3, position: 'relative' }}
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                index + 1 < currentStep
                  ? 'bg-gradient-to-br from-green-400 to-emerald-600 text-white'
                  : index + 1 === currentStep
                    ? 'bg-gradient-to-br from-blue-400 to-indigo-600 text-white ring-4 ring-blue-100'
                    : 'bg-white border-2 border-gray-200 text-gray-400'
              }`}
            >
              {renderStepIcon(index)}
            </div>
            <span
              className={`text-sm mt-2 font-medium transition-all duration-300 ${
                index + 1 <= currentStep
                  ? 'text-gray-800'
                  : 'text-gray-400'
              }`}
            >
              {stepLabels[index]}
            </span>
          </div>
        ))}
      </div>

      {/* 진행률 텍스트 */}
      <div className="text-right mt-1">
        <span className="text-xs font-medium text-gray-500">
          {Math.max(0, Math.round(((currentStep - 1) / (totalSteps - 1)) * 100))}% 완료
        </span>
      </div>
    </div>
  );
};

// 애니메이션을 위한 추가 스타일
const styles = `
@keyframes shine {
  0% {
    transform: translateX(-100%) skewX(-30deg);
  }
  100% {
    transform: translateX(200%) skewX(-30deg);
  }
}

.animate-shine {
  animation: shine 2s infinite;
}
`;

const StepIndicatorWithStyles = (props) => (
  <>
    <style>{styles}</style>
    <StepIndicator {...props} />
  </>
);

export default StepIndicatorWithStyles;