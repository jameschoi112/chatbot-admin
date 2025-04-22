// 프로덕션 환경에서는 환경 변수에서 값을 가져오고, 개발 환경에서는 기본값 사용
const API_BASE_URL = '/api/v1';

// LLM 관련 엔드포인트
const LLM_ENDPOINTS = {
  ORIGINS: `${API_BASE_URL}/llm/origin/`,
  MODELS: `${API_BASE_URL}/llm/model/`,
  ORIGIN_DETAIL: (id) => `${API_BASE_URL}/llm/origin/${id}`,
  MODEL_DETAIL: (id) => `${API_BASE_URL}/llm/model/${id}`,
};

// 봇 관련 엔드포인트 (추후 추가)
const BOT_ENDPOINTS = {
  LIST: `${API_BASE_URL}/bots/`,
  CREATE: `${API_BASE_URL}/bots/`,
  DETAIL: (id) => `${API_BASE_URL}/bots/${id}/`,
};

// 프롬프트 관련 엔드포인트
const PROMPT_ENDPOINTS = {
  PROMPTS: `${API_BASE_URL}/llm/prompt/`,
  PROMPT_DETAIL: (id) => `${API_BASE_URL}/llm/prompt/${id}`,
  PROMPT_HISTORY: (id) => `${API_BASE_URL}/llm/prompt/${id}/history`,
  PROMPT_ROLLBACK: (id) => `${API_BASE_URL}/llm/prompt/${id}/rollback`,
  INVOKE_LLM: `${API_BASE_URL}/chat/invoke/llm`,
  INVOKE_SESSION: (sessionId) => `${API_BASE_URL}/chat/invoke/session/${sessionId}`,
};

// API 요청 기본 헤더
const getHeaders = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {})
  };
};

export {
  API_BASE_URL,
  LLM_ENDPOINTS,
  BOT_ENDPOINTS,
  PROMPT_ENDPOINTS,
  getHeaders
};