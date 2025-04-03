// src/pages/bots/data/botData.js
export const botData = [
  {
    id: 1,
    name: '고객 지원 봇',
    status: 'active',
    description: '고객 문의에 자동으로 응답하고 FAQ를 처리하는 봇입니다. 온라인 쇼핑몰에서 발생하는 주문, 결제, 배송, 교환/환불 관련 질문을 처리하고, 필요 시 담당자에게 연결해주는 기능을 제공합니다.',
    created: '2025-02-25',
    creator: 'Admin',
    usageCount: 1723,
    lastUsed: '2025-03-01',
    apiKey: 'sk-abcd1234efgh5678ijkl9012mnop3456qrst7890',
    messengers: {
      telegram: { enabled: true, username: '@customer_support_bot' },
      kakao: { enabled: false, key: '' },
      slack: { enabled: true, workspace: 'cplabs' }
    },
    documents: [
      { id: 1, name: '고객 응대 가이드라인.pdf', size: '2.4MB', uploadDate: '2025-02-26' },
      { id: 2, name: 'FAQ 데이터.xlsx', size: '1.8MB', uploadDate: '2025-02-26' },
      { id: 3, name: '주문 처리 절차.docx', size: '1.2MB', uploadDate: '2025-02-27' }
    ],
    model: 'gpt-4',
    embeddingModel: 'text-embedding-3-large',
    llmModel: 'gpt-4-turbo',
    stats: {
      dailyUsage: [12, 18, 22, 19, 24, 31, 28],
      responseTime: 2.4,
      accuracy: 92,
      satisfaction: 4.7
    },
    settings: {
      temperature: 0.7,
      maxTokens: 800,
      topP: 0.9
    }
  },
  {
    id: 2,
    name: '제품 안내 봇',
    status: 'active',
    description: '회사 제품에 대한 정보를 제공하고 기능을 안내하는 봇입니다.',
    created: '2025-02-24',
    creator: '이마케팅',
    usageCount: 945,
    lastUsed: '2025-03-02',
    apiKey: 'sk-uvwx5678yzab9012cdef3456ghij7890klmn1234',
    messengers: {
      telegram: { enabled: false, username: '' },
      kakao: { enabled: true, key: 'kakao_12345' },
      slack: { enabled: false, workspace: '' }
    },
    documents: [
      { id: 4, name: '제품 카탈로그.pdf', size: '4.2MB', uploadDate: '2025-02-24' },
      { id: 5, name: '기능 설명서.docx', size: '2.1MB', uploadDate: '2025-02-25' }
    ],
    model: 'gpt-4',
    embeddingModel: 'text-embedding-3-small',
    llmModel: 'gpt-4',
    stats: {
      dailyUsage: [8, 13, 15, 18, 16, 19, 22],
      responseTime: 1.8,
      accuracy: 88,
      satisfaction: 4.3
    },
    settings: {
      temperature: 0.5,
      maxTokens: 1000,
      topP: 0.95
    }
  }
];

// 차트 데이터 포맷팅 함수
export const formatChartData = (dailyUsage) => {
  const days = ['월', '화', '수', '목', '금', '토', '일'];
  return days.map((day, index) => ({
    day,
    usage: dailyUsage[index]
  }));
};

// 최대 사용량 값 가져오기
export const getMaxUsage = (usageData) => {
  return Math.max(...usageData);
};

// 막대 높이 퍼센트 계산
export const getBarHeightPercentage = (value, maxValue) => {
  return (value / maxValue) * 100;
};