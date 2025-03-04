import React from 'react';
import {  PlusCircle, MessageSquare, ExternalLink } from 'lucide-react';
import {
 XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { useNavigate } from 'react-router-dom';

// 대시보드 통계 데이터
const dashboardData = {
  botStats: { total: 12, active: 8, inactive: 4 },
  docStats: { total: 56, trained: 42, pending: 14 },
  recentBots: [
    { id: 1, name: '고객 지원 봇', created: '2025-02-25', status: 'active' },
    { id: 2, name: '제품 안내 봇', created: '2025-02-24', status: 'active' },
    { id: 3, name: '입사 지원 봇', created: '2025-02-22', status: 'inactive' }
  ],
  topBots: [
    { id: 5, name: '마케팅 봇', usageCount: 2354, increment: '+12%' },
    { id: 1, name: '고객 지원 봇', usageCount: 1723, increment: '+8%' },
    { id: 7, name: '영업 문의 봇', usageCount: 1482, increment: '+5%' },
    { id: 9, name: '기술 지원 봇', usageCount: 1245, increment: '-3%' }
  ],
  // 평균 챗봇 사용량 데이터 추가
  usageData: [
    { name: '1월', 사용량: 2400 },
    { name: '2월', 사용량: 1398 },
    { name: '3월', 사용량: 3200 },
    { name: '4월', 사용량: 2780 },
    { name: '5월', 사용량: 1890 },
    { name: '6월', 사용량: 2390 },
    { name: '7월', 사용량: 3490 }
  ],
  // 일 평균 사용금액 데이터 추가
  costData: [
    { name: '1월', 금액: 250 },
    { name: '2월', 금액: 300 },
    { name: '3월', 금액: 280 },
    { name: '4월', 금액: 320 },
    { name: '5월', 금액: 360 },
    { name: '6월', 금액: 400 },
    { name: '7월', 금액: 380 }
  ]
};

// 사용자 정의 툴팁 컴포넌트
const CustomTooltip = ({ active, payload, label, valuePrefix, valueSuffix }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-lg rounded-lg">
        <p className="text-sm font-medium text-gray-600">{label}</p>
        <p className="text-lg font-semibold text-gray-900">
          {valuePrefix}{payload[0].value.toLocaleString()}{valueSuffix}
        </p>
      </div>
    );
  }
  return null;
};

// 사용자 정의 범례 컴포넌트
const CustomLegend = ({ payload }) => {
  return (
    <div className="flex justify-center mt-4">
      {payload.map((entry, index) => (
        <div key={`legend-${index}`} className="flex items-center mx-3">
          <div
            className="w-3 h-3 rounded-full mr-2"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-xs text-gray-600">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

const DashboardContent = () => {
  const navigate = useNavigate();

  // 그래프 X축 레이블 스타일
  const xAxisTickStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    fill: '#6B7280'
  };

  // 그래프 Y축 레이블 스타일
  const yAxisTickStyle = {
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    fill: '#6B7280'
  };

  return (
    <>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <button
          onClick={() => navigate('/create-bot')}
          className="flex items-center space-x-2 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-md transition-colors shadow-md"
        >
          <PlusCircle size={18} />
          <span>새 봇 만들기</span>
        </button>
      </div>

      {/* 통계 카드 - 4개로 변경 */}
      <div className="grid grid-cols-4 gap-6 mb-8">
        {/* 봇 현황 */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">실시간 봇 현황</h2>

          </div>
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-500">{dashboardData.botStats.total}</p>
              <p className="text-xs text-gray-500">전체</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{dashboardData.botStats.active}</p>
              <p className="text-xs text-gray-500">활성화 봇</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-400">{dashboardData.botStats.inactive}</p>
              <p className="text-xs text-gray-500">비활성 봇</p>
            </div>
          </div>
        </div>

        {/* 문서 현황 */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">문서 현황</h2>

          </div>
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-2xl font-bold text-sky-500">{dashboardData.docStats.total}</p>
              <p className="text-xs text-gray-500">전체</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-500">{dashboardData.docStats.trained}</p>
              <p className="text-xs text-gray-500">문서 임베딩</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-500">{dashboardData.docStats.pending}</p>
              <p className="text-xs text-gray-500">대기 중</p>
            </div>
          </div>
        </div>

        {/* 일간 평균 사용량 */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">챗봇 평균 사용량</h2>

          </div>
          <div className="flex flex-col items-center justify-center h-16">
            <p className="text-3xl font-bold text-sky-500">1,245</p>
            <p className="text-xs text-gray-500">일간 평균 요청 수</p>
          </div>
        </div>

        {/* 일간 평균 비용 */}
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-gray-700">챗봇 평균 사용 비용</h2>

          </div>
          <div className="flex flex-col items-center justify-center h-16">
            <p className="text-3xl font-bold text-sky-500">₩32,500</p>
            <p className="text-xs text-gray-500">일간 평균 사용 금액</p>
          </div>
        </div>
      </div>

      {/* 그래프 영역 추가 */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* 평균 챗봇 사용량 그래프 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-700">월 평균 챗봇 사용량</h2>
            <div className="px-3 py-1 bg-blue-50 text-blue-600 rounded-md text-xs font-medium">월별 통계</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dashboardData.usageData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorUsage" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={xAxisTickStyle}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={yAxisTickStyle}
                  tickFormatter={(value) => value.toLocaleString()}
                  width={40}
                />
                <Tooltip content={<CustomTooltip valueSuffix=" 건" />} />
                <Legend content={<CustomLegend />} />
                <Area
                  type="monotone"
                  dataKey="사용량"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#colorUsage)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#2563EB' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 일 평균 사용금액 그래프 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-700">월 평균 사용금액</h2>
            <div className="px-3 py-1 bg-green-50 text-green-600 rounded-md text-xs font-medium">월별 통계</div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={dashboardData.costData}
                margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#EEE" vertical={false} />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={xAxisTickStyle}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={yAxisTickStyle}
                  tickFormatter={(value) => value.toLocaleString()}
                  width={40}
                />
                <Tooltip content={<CustomTooltip valuePrefix="₩" />} />
                <Legend content={<CustomLegend />} />
                <Area
                  type="monotone"
                  dataKey="금액"
                  stroke="#10B981"
                  strokeWidth={3}
                  fill="url(#colorCost)"
                  activeDot={{ r: 6, strokeWidth: 0, fill: '#059669' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* 최근 생성된 봇 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">최근 생성된 봇</h2>
            <button className="text-sky-500 hover:text-sky-600 transition-colors flex items-center space-x-1">
              <span className="text-sm">더보기</span>
            </button>
          </div>
          <div className="space-y-4">
            {dashboardData.recentBots.map((bot) => (
              <div key={bot.id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{bot.name}</p>
                  <p className="text-xs text-gray-500">{bot.created} 생성</p>
                </div>
                <div className="flex items-center space-x-2">
                  {/* 배경색에서 테두리 스타일로 변경 */}
                  <span className={`px-2 py-1 rounded-full text-xs border ${
                    bot.status === 'active'
                      ? 'border-green-500 text-green-700'
                      : 'border-gray-400 text-gray-600'
                  }`}>
                    {bot.status === 'active' ? '활성' : '비활성'}
                  </span>
                  <button className="text-sky-600 hover:text-sky-700 p-1 rounded-md hover:bg-sky-50 transition-colors">
                    <ExternalLink size={16} />
                  </button>
                  <button className="text-gray-600 hover:text-gray-700 p-1 rounded-md hover:bg-gray-50 transition-colors">
                    <MessageSquare size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 가장 사용이 많은 봇 */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  <div className="flex justify-between items-center mb-4">
    <h2 className="text-lg font-semibold text-gray-700">가장 사용이 많은 봇</h2>
    <button className="text-sky-500 hover:text-sky-600 transition-colors flex items-center space-x-1">
      <span className="text-sm">더보기</span>
    </button>
  </div>
  <div className="space-y-4">
    {dashboardData.topBots.map((bot, index) => (
      <div key={bot.id} className="flex items-center justify-between border-b pb-2">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-6 h-6 rounded-md mr-3 text-xs font-medium ${
            index === 0
              ? 'bg-amber-100 text-amber-700 border border-amber-200'
              : index === 1
              ? 'bg-gray-100 text-gray-700 border border-gray-200'
              : index === 2
              ? 'bg-orange-100 text-orange-700 border border-orange-200'
              : 'bg-sky-100 text-sky-700 border border-sky-200'
          }`}>
            {index + 1}
          </div>
          <p className="font-medium">{bot.name}</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <p className="text-sm font-medium mr-2">{bot.usageCount.toLocaleString()}</p>
            <span className={`text-xs px-1.5 py-0.5 rounded-sm ${
              bot.increment.startsWith('+')
                ? 'bg-green-50 text-green-600'
                : 'bg-red-50 text-red-600'
            }`}>
              {bot.increment}
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-sky-600 hover:text-sky-700 p-1 rounded-md hover:bg-sky-50 transition-colors">
              <ExternalLink size={16} />
            </button>
            <button className="text-gray-600 hover:text-gray-700 p-1 rounded-md hover:bg-gray-50 transition-colors">
              <MessageSquare size={16} />
            </button>
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
      </div>
    </>
  );
};

export default DashboardContent;