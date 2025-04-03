// src/pages/bots/components/tabs/OverviewTab.js
import React, { useEffect } from 'react';
import {
  BarChart,
  Activity,
  Calendar,
  Book,
  Star,
  MessageCircle,
  MessageSquare,
  Slack,
  Check,
  X,
  Info
} from 'lucide-react';
import { formatChartData, getMaxUsage, getBarHeightPercentage } from '../../data/botData';

// 애니메이션 키프레임 정의
const keyframes = {
  growUp: `
    @keyframes growUp {
      0% {
        height: 0;
        opacity: 0;
      }
      50% {
        opacity: 0.7;
      }
      100% {
        height: var(--target-height);
        opacity: 1;
      }
    }
  `
};

const OverviewTab = ({ bot }) => {
  // 차트 데이터 준비
  const chartData = formatChartData(bot.stats.dailyUsage);
  const maxUsage = getMaxUsage(bot.stats.dailyUsage);

  // Y축 눈금 계산
  const yAxisTicks = [
    Math.ceil(maxUsage),
    Math.ceil(maxUsage * 0.75),
    Math.ceil(maxUsage * 0.5),
    Math.ceil(maxUsage * 0.25),
    0
  ];

  // 컴포넌트 마운트 시 스타일 추가
  useEffect(() => {
    // 기존 스타일 태그가 있는지 확인
    const existingStyle = document.getElementById('chart-animations');
    if (!existingStyle) {
      const styleTag = document.createElement('style');
      styleTag.id = 'chart-animations';
      styleTag.textContent = keyframes.growUp;
      document.head.appendChild(styleTag);
    }

    // 컴포넌트 언마운트 시 스타일 제거
    return () => {
      const styleTag = document.getElementById('chart-animations');
      if (styleTag) {
        document.head.removeChild(styleTag);
      }
    };
  }, []);

  return (
    <div className="p-6">
      <div className="grid grid-cols-3 gap-6">
        {/* 왼쪽 섹션 - 일일 사용량 차트 (개선됨) */}
        <div className="col-span-2 bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center">
              <BarChart size={18} className="text-blue-500 mr-2" />
              일별 사용량
            </h2>
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs">
              <Info size={12} className="mr-1" />
              최근 7일 동안의 사용 통계
            </div>
          </div>

          <div className="flex h-64">
            {/* Y축 레이블 영역 */}
            <div className="w-12 flex flex-col justify-between text-right pr-2">
              {yAxisTicks.map((tick, index) => (
                <div key={index} className="text-xs text-gray-500">{tick}</div>
              ))}
            </div>

            {/* 차트 영역 */}
            <div className="flex-1 relative">
              {/* 그리드 라인 */}
              {yAxisTicks.map((_, index) => (
                <div
                  key={index}
                  className="absolute w-full border-t border-gray-100"
                  style={{ top: `${index * 25}%` }}
                ></div>
              ))}

              {/* 막대 차트 */}
              <div className="absolute inset-0 flex items-end justify-around pb-4">
                {chartData.map((item, index) => (
                  <div key={index} className="flex flex-col items-center h-full" style={{ width: '40px' }}>
                    {/* 막대 컨테이너 */}
                    <div className="w-10 h-full relative group">
                      {/* 툴팁 */}
                      <div className="absolute bottom-full mb-2 px-3 py-1 bg-gray-800 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity text-xs whitespace-nowrap z-10">
                        {item.day}: {item.usage}회
                      </div>

                      {/* 막대 */}
                      <div
                        className="absolute bottom-0 w-full rounded-t-md bg-gradient-to-t from-blue-500 to-sky-400 hover:brightness-110 transition-all duration-300"
                        style={{
                          height: `${getBarHeightPercentage(item.usage, maxUsage)}%`,
                          maxHeight: '100%'
                        }}
                      >
                        {/* 반짝임 효과 */}
                        <div className="absolute inset-0 bg-white/30 opacity-0 group-hover:opacity-100"></div>
                      </div>
                    </div>

                    {/* 요일 레이블 */}
                    <div className="text-xs text-gray-600 font-medium mt-1">
                      {item.day}
                    </div>
                  </div>
                ))}
              </div>

              {/* X축 선 */}
              <div className="absolute bottom-0 left-0 w-full border-t border-gray-300"></div>
            </div>
          </div>

          {/* 차트 하단 통계 요약 */}
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">일평균 사용량</div>
              <div className="text-lg font-semibold text-gray-800">
                {Math.round(chartData.reduce((sum, item) => sum + item.usage, 0) / chartData.length)}회
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">최대 사용일</div>
              <div className="text-lg font-semibold text-gray-800">
                {chartData.reduce((max, item) => max.usage > item.usage ? max : item, { usage: 0 }).day}
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500">주간 총 사용량</div>
              <div className="text-lg font-semibold text-gray-800">
                {chartData.reduce((sum, item) => sum + item.usage, 0)}회
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-3">
              <div className="text-xs text-blue-600">전주 대비 변화</div>
              <div className="text-lg font-semibold text-green-600">
                +12.5%
              </div>
            </div>
          </div>
        </div>

        {/* 오른쪽 섹션 - 모델 정보 및 성능 지표 (향상됨) */}
        <div className="space-y-6">
          {/* 모델 정보 카드 - LLM 모델, 임베딩 모델, 문서 수 표시하도록 개선 */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              모델 정보
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  LLM 모델
                </span>
                <span className="font-medium text-gray-800 px-2 py-1 bg-blue-50 rounded-md text-sm">{bot.llmModel}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  임베딩 모델
                </span>
                <span className="font-medium text-gray-800 px-2 py-1 bg-blue-50 rounded-md text-sm">{bot.embeddingModel}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-gray-100">
                <span className="text-gray-600 flex items-center">
                  <Calendar size={16} className="text-blue-500 mr-2" />
                  마지막 업데이트
                </span>
                <span className="font-medium text-gray-800">{bot.lastUsed}</span>
              </div>
              <div className="flex justify-between items-center py-2">
                <span className="text-gray-600 flex items-center">
                  <Book size={16} className="text-blue-500 mr-2" />
                  참조 문서
                </span>
                <span className="font-medium text-gray-800 flex items-center">
                  <span className="mr-1">{bot.documents.length}개</span>
                  <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-blue-600 bg-blue-100 rounded-full ml-2">
                    {bot.documents.reduce((acc, doc) => {
                      // 크기 문자열에서 숫자 부분 추출 (예: '2.4MB'에서 2.4 추출)
                      const sizeNum = parseFloat(doc.size);
                      return acc + sizeNum;
                    }, 0).toFixed(1)}MB
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* 성능 지표 카드 - 개선됨 */}
          <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <Activity size={18} className="text-blue-500 mr-2" />
              성능 지표
            </h2>

            {/* 정확도 프로그레스 바 - 개선됨 */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">정확도</span>
                <span className="text-sm font-medium text-gray-800">{bot.stats.accuracy}%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-1000 relative"
                  style={{
                    width: `${bot.stats.accuracy}%`,
                    background: 'linear-gradient(to right, #34d399, #10b981)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 응답 시간 프로그레스 바 - 개선됨 */}
            <div className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">응답 시간</span>
                <span className="text-sm font-medium text-gray-800">{bot.stats.responseTime}초</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                <div
                  className="h-2.5 rounded-full transition-all duration-1000 relative"
                  style={{
                    width: `${(bot.stats.responseTime / 5) * 100}%`,
                    background: 'linear-gradient(to right, #3b82f6, #1d4ed8)'
                  }}
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent animate-pulse"></div>
                </div>
              </div>
            </div>

            {/* 사용자 만족도 별점 - 개선됨 */}
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-sm text-gray-600">만족도</span>
                <span className="text-sm font-medium text-gray-800">{bot.stats.satisfaction}/5</span>
              </div>
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={18}
                    className={`${
                      star <= bot.stats.satisfaction
                        ? 'text-yellow-400 fill-yellow-400'
                        : 'text-gray-300'
                    } transition-all duration-300 hover:scale-110`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 메신저 연동 상태 요약 - 개선됨 */}
      <div className="mt-6 bg-white rounded-xl shadow-md border border-gray-100 p-6 hover:shadow-lg transition-shadow">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <MessageCircle size={18} className="text-blue-500 mr-2" />
          메신저 연동 상태
        </h2>
        <div className="grid grid-cols-3 gap-4">
          <div className={`flex items-center p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            bot.messengers.telegram.enabled
              ? 'bg-blue-50 border border-blue-100 shadow-sm'
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              bot.messengers.telegram.enabled
                ? 'bg-blue-100 shadow-inner'
                : 'bg-gray-200'
            }`}>
              <MessageCircle size={18} className={bot.messengers.telegram.enabled ? 'text-blue-600' : 'text-gray-500'} />
            </div>
            <div className="ml-3">
              <div className="font-medium">텔레그램</div>
              <div className="text-sm flex items-center">
                {bot.messengers.telegram.enabled
                  ? <><Check size={12} className="text-green-500 mr-1" /> 연동됨</>
                  : <><X size={12} className="text-gray-500 mr-1" /> 연동 안됨</>
                }
              </div>
            </div>
          </div>

          <div className={`flex items-center p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            bot.messengers.kakao.enabled
              ? 'bg-yellow-50 border border-yellow-100 shadow-sm'
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              bot.messengers.kakao.enabled
                ? 'bg-yellow-100 shadow-inner'
                : 'bg-gray-200'
            }`}>
              <MessageSquare size={18} className={bot.messengers.kakao.enabled ? 'text-yellow-600' : 'text-gray-500'} />
            </div>
            <div className="ml-3">
              <div className="font-medium">카카오톡</div>
              <div className="text-sm flex items-center">
                {bot.messengers.kakao.enabled
                  ? <><Check size={12} className="text-green-500 mr-1" /> 연동됨</>
                  : <><X size={12} className="text-gray-500 mr-1" /> 연동 안됨</>
                }
              </div>
            </div>
          </div>

          <div className={`flex items-center p-4 rounded-lg transition-all duration-300 transform hover:scale-105 ${
            bot.messengers.slack.enabled
              ? 'bg-purple-50 border border-purple-100 shadow-sm'
              : 'bg-gray-50 border border-gray-100'
          }`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
              bot.messengers.slack.enabled
                ? 'bg-purple-100 shadow-inner'
                : 'bg-gray-200'
            }`}>
              <Slack size={18} className={bot.messengers.slack.enabled ? 'text-purple-600' : 'text-gray-500'} />
            </div>
            <div className="ml-3">
              <div className="font-medium">슬랙</div>
              <div className="text-sm flex items-center">
                {bot.messengers.slack.enabled
                  ? <><Check size={12} className="text-green-500 mr-1" /> 연동됨</>
                  : <><X size={12} className="text-gray-500 mr-1" /> 연동 안됨</>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;