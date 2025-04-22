// src/api/promptService.js
import axios from 'axios';
import { PROMPT_ENDPOINTS, getHeaders } from './config';

/**
 * 프롬프트 관련 API 서비스
 */
const promptService = {
  /**
   * 모든 프롬프트 목록 조회
   * @returns {Promise<Array>} 프롬프트 목록
   */
  getAllPrompts: async () => {
    try {
      const response = await axios.get(PROMPT_ENDPOINTS.PROMPTS, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('프롬프트 목록을 가져오는데 실패했습니다: ' + error.message);
    }
  },

  /**
   * 특정 프롬프트 조회
   * @param {number} id - 프롬프트 ID
   * @returns {Promise<Object>} 프롬프트 정보
   */
  getPromptById: async (id) => {
    try {
      const response = await axios.get(PROMPT_ENDPOINTS.PROMPT_DETAIL(id), {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('프롬프트 정보를 가져오는데 실패했습니다: ' + error.message);
    }
  },

  /**
   * 새 프롬프트 생성
   * @param {Object} data - 프롬프트 데이터
   * @returns {Promise<Object>} 생성된 프롬프트 정보
   */
  createPrompt: async (data) => {
    try {
      const response = await axios.post(PROMPT_ENDPOINTS.PROMPTS, data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('프롬프트 생성에 실패했습니다: ' + error.message);
    }
  },

  /**
   * 프롬프트 업데이트
   * @param {number} id - 프롬프트 ID
   * @param {Object} data - 업데이트할 데이터
   * @returns {Promise<Object>} 업데이트된 프롬프트 정보
   */
  updatePrompt: async (id, data) => {
    try {
      const response = await axios.patch(PROMPT_ENDPOINTS.PROMPT_DETAIL(id), data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('프롬프트 업데이트에 실패했습니다: ' + error.message);
    }
  },

  /**
   * 프롬프트 삭제
   * @param {number} id - 프롬프트 ID
   * @returns {Promise<void>}
   */
  deletePrompt: async (id) => {
    try {
      await axios.delete(PROMPT_ENDPOINTS.PROMPT_DETAIL(id), {
        headers: getHeaders()
      });
    } catch (error) {
      throw new Error('프롬프트 삭제에 실패했습니다: ' + error.message);
    }
  },

  /**
   * 프롬프트 히스토리 조회
   * @param {number} id - 프롬프트 ID
   * @returns {Promise<Array>} 프롬프트 변경 이력
   */
  getPromptHistory: async (id) => {
    try {
      const response = await axios.get(PROMPT_ENDPOINTS.PROMPT_HISTORY(id), {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('프롬프트 히스토리를 가져오는데 실패했습니다: ' + error.message);
    }
  },

  /**
   * 프롬프트 롤백
   * @param {number} id - 프롬프트 ID
   * @param {number} historyId - 롤백할 히스토리 ID
   * @returns {Promise<Object>} 롤백된 프롬프트 정보
   */
  rollbackPrompt: async (id, historyId) => {
    try {
      const response = await axios.post(
        PROMPT_ENDPOINTS.PROMPT_ROLLBACK(id),
        { history_id: historyId },
        { headers: getHeaders() }
      );
      return response.data;
    } catch (error) {
      throw new Error('프롬프트 롤백에 실패했습니다: ' + error.message);
    }
  },

  /**
   * LLM 직접 호출
   * @param {Object} data - 호출 데이터
   * @returns {Promise<Object>} 응답 데이터
   */
  invokeLlm: async (data) => {
    try {
      const response = await axios.post(PROMPT_ENDPOINTS.INVOKE_LLM, data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('LLM 호출에 실패했습니다: ' + error.message);
    }
  },

  /**
   * LLM 세션 호출
   * @param {number} sessionId - 세션 ID
   * @param {Object} data - 호출 데이터
   * @returns {Promise<Object>} 응답 데이터
   */
  invokeSession: async (sessionId, data) => {
    try {
      const response = await axios.post(PROMPT_ENDPOINTS.INVOKE_SESSION(sessionId), data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      throw new Error('세션 호출에 실패했습니다: ' + error.message);
    }
  }
};

export default promptService;