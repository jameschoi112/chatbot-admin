// src/api/llmService.js
import axios from 'axios';
import { LLM_ENDPOINTS, getHeaders } from './config';

/**
 * LLM 오리진 관련 API 서비스
 */
const originService = {
  /**
   * 모든 LLM 오리진 목록 조회
   * @returns {Promise<Array>} 오리진 목록
   */
  getAllOrigins: async () => {
    try {
      const response = await axios.get(LLM_ENDPOINTS.ORIGINS, {
        headers: getHeaders()
      });

      // 응답 확인 및 안전 처리
      console.log('Origin API Response:', response.data);

      // 배열이 아닌 경우 빈 배열 반환
      if (!Array.isArray(response.data)) {
        console.warn('Unexpected API response format for origins:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('오리진 목록을 가져오는데 실패했습니다:', error);
      // 에러 로깅 향상
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      } else if (error.request) {
        console.error('No response received:', error.request);
      } else {
        console.error('Error Message:', error.message);
      }

      // 오류 발생 시 빈 배열 반환
      return [];
    }
  },

  /**
   * 특정 LLM 오리진 조회
   * @param {number} id - 오리진 ID
   * @returns {Promise<Object>} 오리진 정보
   */
  getOriginById: async (id) => {
    try {
      const response = await axios.get(LLM_ENDPOINTS.ORIGIN_DETAIL(id), {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('오리진 정보를 가져오는데 실패했습니다:', error);
      throw new Error('오리진 정보를 가져오는데 실패했습니다: ' + error.message);
    }
  },

  /**
   * 새 LLM 오리진 생성
   * @param {Object} data - 오리진 데이터
   * @returns {Promise<Object>} 생성된 오리진 정보
   */
  createOrigin: async (data) => {
    try {
      const response = await axios.post(LLM_ENDPOINTS.ORIGINS, data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('오리진 생성에 실패했습니다:', error);
      throw new Error('오리진 생성에 실패했습니다: ' + error.message);
    }
  },

  /**
   * LLM 오리진 업데이트
   * @param {number} id - 오리진 ID
   * @param {Object} data - 업데이트할 데이터
   * @returns {Promise<Object>} 업데이트된 오리진 정보
   */
  updateOrigin: async (id, data) => {
    try {
      const response = await axios.patch(LLM_ENDPOINTS.ORIGIN_DETAIL(id), data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('오리진 업데이트에 실패했습니다:', error);
      throw new Error('오리진 업데이트에 실패했습니다: ' + error.message);
    }
  },

  /**
   * LLM 오리진 삭제
   * @param {number} id - 오리진 ID
   * @returns {Promise<void>}
   */
  deleteOrigin: async (id) => {
    try {
      await axios.delete(LLM_ENDPOINTS.ORIGIN_DETAIL(id), {
        headers: getHeaders()
      });
    } catch (error) {
      console.error('오리진 삭제에 실패했습니다:', error);
      throw new Error('오리진 삭제에 실패했습니다: ' + error.message);
    }
  }
};

/**
 * LLM 모델 관련 API 서비스
 */
const modelService = {
  /**
   * 모든 LLM 모델 목록 조회
   * @returns {Promise<Array>} 모델 목록
   */
  getAllModels: async () => {
    try {
      const response = await axios.get(LLM_ENDPOINTS.MODELS, {
        headers: getHeaders()
      });

      // 응답 확인 및 안전 처리
      console.log('Models API Response:', response.data);

      // 배열이 아닌 경우 빈 배열 반환
      if (!Array.isArray(response.data)) {
        console.warn('Unexpected API response format for models:', response.data);
        return [];
      }

      return response.data;
    } catch (error) {
      console.error('모델 목록을 가져오는데 실패했습니다:', error);
      // 에러 로깅 향상
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      }

      // 오류 발생 시 빈 배열 반환
      return [];
    }
  },

  /**
   * 특정 오리진에 속하는 모델 목록 조회
   * @param {number} originId - 오리진 ID
   * @returns {Promise<Array>} 모델 목록
   */
  getModelsByOrigin: async (originId) => {
    try {
      const response = await axios.get(LLM_ENDPOINTS.MODELS, {
        headers: getHeaders()
      });

      // 응답 확인 및 안전 처리
      console.log(`Models by Origin (${originId}) API Response:`, response.data);

      // 배열이 아닌 경우 빈 배열 반환
      if (!Array.isArray(response.data)) {
        console.warn('Unexpected API response format for models by origin:', response.data);
        return [];
      }

      // 서버에서 필터링 API가 없는 경우 클라이언트에서 필터링
      const filteredModels = response.data.filter(model =>
        model.origin === parseInt(originId) || model.origin_id === parseInt(originId)
      );

      return filteredModels;
    } catch (error) {
      console.error('모델 목록을 가져오는데 실패했습니다:', error);
      // 에러 로깅 향상
      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        console.error('Error Response Status:', error.response.status);
      }

      // 오류 발생 시 빈 배열 반환
      return [];
    }
  },

  /**
   * 특정 LLM 모델 조회
   * @param {number} id - 모델 ID
   * @returns {Promise<Object>} 모델 정보
   */
  getModelById: async (id) => {
    try {
      const response = await axios.get(LLM_ENDPOINTS.MODEL_DETAIL(id), {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('모델 정보를 가져오는데 실패했습니다:', error);
      throw new Error('모델 정보를 가져오는데 실패했습니다: ' + error.message);
    }
  },

  /**
   * 새 LLM 모델 생성
   * @param {Object} data - 모델 데이터
   * @returns {Promise<Object>} 생성된 모델 정보
   */
  createModel: async (data) => {
    try {
      const response = await axios.post(LLM_ENDPOINTS.MODELS, data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('모델 생성에 실패했습니다:', error);
      throw new Error('모델 생성에 실패했습니다: ' + error.message);
    }
  },

  /**
   * LLM 모델 업데이트
   * @param {number} id - 모델 ID
   * @param {Object} data - 업데이트할 데이터
   * @returns {Promise<Object>} 업데이트된 모델 정보
   */
  updateModel: async (id, data) => {
    try {
      const response = await axios.patch(LLM_ENDPOINTS.MODEL_DETAIL(id), data, {
        headers: getHeaders()
      });
      return response.data;
    } catch (error) {
      console.error('모델 업데이트에 실패했습니다:', error);
      throw new Error('모델 업데이트에 실패했습니다: ' + error.message);
    }
  },

  /**
   * LLM 모델 삭제
   * @param {number} id - 모델 ID
   * @returns {Promise<void>}
   */
  deleteModel: async (id) => {
    try {
      await axios.delete(LLM_ENDPOINTS.MODEL_DETAIL(id), {
        headers: getHeaders()
      });
    } catch (error) {
      console.error('모델 삭제에 실패했습니다:', error);
      throw new Error('모델 삭제에 실패했습니다: ' + error.message);
    }
  }
};

// 서비스 내보내기
export {
  originService,
  modelService
};