// src/pages/bots/CreateBot.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bot, X, ChevronLeft, ChevronRight, Save, Check, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';

// 컴포넌트 및 모달 가져오기
import Layout from '../../components/layout/Layout';
import Chat from '../../components/Chat';
import StepIndicator from './components/StepIndicator';
import Step1BasicInfo from './components/Step1BasicInfo';
import Step2LLMSettings from './components/Step2LLMSettings';
import Step3PromptSettings from './components/Step3PromptSettings';
import Step4Messengers from './components/Step4Messengers';
import OriginModal from './components/modals/OriginModal';
import ModelModal from './components/modals/ModelModal';

// API 서비스 가져오기
import { originService, modelService } from '../../api/llmService';

/**
 * 새 봇 생성 페이지 컴포넌트
 */
const CreateBot = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  // 폼 단계 관리
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // LLM 오리진 및 모델 목록 관리
  const [llmOrigins, setLlmOrigins] = useState([]);
  const [llmModels, setLlmModels] = useState([]);
  const [isLoadingOrigins, setIsLoadingOrigins] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);

  // 단계별 오류 관리
  const [errors, setErrors] = useState({
    step1: null,
    step2: null,
    step3: null,
    step4: null
  });

  // 오리진 관리 모달
  const [showOriginModal, setShowOriginModal] = useState(false);
  const [originFormData, setOriginFormData] = useState({
    name: '',
    api_key: '',
    base_url: 'https://api.openai.com/v1',
    is_active: true
  });
  const [editingOriginId, setEditingOriginId] = useState(null);
  const [isSavingOrigin, setIsSavingOrigin] = useState(false);

  // 모델 관리 모달
  const [showModelModal, setShowModelModal] = useState(false);
  const [modelFormData, setModelFormData] = useState({
    origin_id: '',
    model_name: '',
    context_length: 128000,
    max_output_tokens: 8096,
    streaming: false,
    function_calling: false,
    is_active: true
  });
  const [editingModelId, setEditingModelId] = useState(null);
  const [isSavingModel, setIsSavingModel] = useState(false);

  // 최종 봇 정보 관리
  const [botData, setBotData] = useState({
    // 기본 정보 (1단계)
    name: '',
    description: '',

    // LLM 설정 (2단계)
    llm_origin_id: '',
    llm_model_id: '',

    // 시스템 프롬프트 및 설정 (3단계)
    system_prompt: '',
    temperature: 0.7,
    max_tokens: 800,
    top_p: 0.9,

    // 메신저 연동 (4단계)
    messengers: {
      telegram: { enabled: false, token: '' },
      kakao: { enabled: false, api_key: '' },
      slack: { enabled: false, bot_token: '' }
    },
    webhook_url: ''
  });

  // 폼 저장 상태
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // LLM 오리진 목록 가져오기
  const fetchLlmOrigins = async () => {
    setIsLoadingOrigins(true);
    try {
      const origins = await originService.getAllOrigins();
      setLlmOrigins(origins);
    } catch (error) {
      console.error(error.message);
      setErrors(prev => ({ ...prev, step2: '오리진 목록을 불러오는데 실패했습니다.' }));
    } finally {
      setIsLoadingOrigins(false);
    }
  };

  // LLM 모델 목록 가져오기 (특정 오리진에 속한)
  const fetchLlmModels = async () => {
    if (!botData.llm_origin_id) return;

    setIsLoadingModels(true);
    try {
      const models = await modelService.getModelsByOrigin(botData.llm_origin_id);
      setLlmModels(models);
    } catch (error) {
      console.error(error.message);
      setErrors(prev => ({ ...prev, step2: '모델 목록을 불러오는데 실패했습니다.' }));
    } finally {
      setIsLoadingModels(false);
    }
  };

  // 오리진 저장하기
  const saveOrigin = async (e) => {
    e.preventDefault();
    setIsSavingOrigin(true);

    try {
      let response;

      if (editingOriginId) {
        // 기존 오리진 업데이트
        response = await originService.updateOrigin(editingOriginId, originFormData);

        // 목록에서 업데이트
        setLlmOrigins(prev =>
          prev.map(origin =>
            origin.id === editingOriginId ? response : origin
          )
        );
      } else {
        // 새 오리진 생성
        response = await originService.createOrigin(originFormData);

        // 목록에 추가
        setLlmOrigins(prev => [...prev, response]);
      }

      // 모달 초기화 및 닫기
      resetOriginModal();
      setShowOriginModal(false);
    } catch (error) {
      console.error(error.message);
      alert('오리진 저장에 실패했습니다.');
    } finally {
      setIsSavingOrigin(false);
    }
  };

  // 모델 저장하기
  const saveModel = async (e) => {
    e.preventDefault();
    setIsSavingModel(true);

    try {
      let response;

      if (editingModelId) {
        // 기존 모델 업데이트
        response = await modelService.updateModel(editingModelId, modelFormData);

        // 목록에서 업데이트
        setLlmModels(prev =>
          prev.map(model =>
            model.id === editingModelId ? response : model
          )
        );
      } else {
        // 새 모델 생성
        response = await modelService.createModel(modelFormData);

        // 목록에 추가
        setLlmModels(prev => [...prev, response]);
      }

      // 모달 초기화 및 닫기
      resetModelModal();
      setShowModelModal(false);
    } catch (error) {
      console.error(error.message);
      alert('모델 저장에 실패했습니다.');
    } finally {
      setIsSavingModel(false);
    }
  };

  // 오리진 삭제하기
  const handleDeleteOrigin = async (id) => {
    if (!window.confirm('이 오리진을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      await originService.deleteOrigin(id);

      // 목록에서 제거
      setLlmOrigins(prev => prev.filter(origin => origin.id !== id));

      // 만약 현재 선택된 오리진이 삭제되면 선택 초기화
      if (botData.llm_origin_id === id.toString()) {
        setBotData(prev => ({
          ...prev,
          llm_origin_id: '',
          llm_model_id: ''
        }));
      }
    } catch (error) {
      console.error(error.message);
      alert('오리진 삭제에 실패했습니다.');
    }
  };

  // 모델 삭제하기
  const handleDeleteModel = async (id) => {
    if (!window.confirm('이 모델을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      return;
    }

    try {
      await modelService.deleteModel(id);

      // 목록에서 제거
      setLlmModels(prev => prev.filter(model => model.id !== id));

      // 만약 현재 선택된 모델이 삭제되면 선택 초기화
      if (botData.llm_model_id === id.toString()) {
        setBotData(prev => ({
          ...prev,
          llm_model_id: ''
        }));
      }
    } catch (error) {
      console.error(error.message);
      alert('모델 삭제에 실패했습니다.');
    }
  };

  // 오리진 모달 초기화
  const resetOriginModal = () => {
    setOriginFormData({
      name: '',
      api_key: '',
      base_url: 'https://api.openai.com/v1',
      is_active: true
    });
    setEditingOriginId(null);
  };

  // 모델 모달 초기화
  const resetModelModal = () => {
    setModelFormData({
      origin_id: botData.llm_origin_id || '',
      model_name: '',
      context_length: 128000,
      max_output_tokens: 8096,
      streaming: false,
      function_calling: false,
      is_active: true
    });
    setEditingModelId(null);
  };

  // 오리진 편집 시작
  const handleEditOrigin = (origin) => {
    setEditingOriginId(origin.id);
    setOriginFormData({
      name: origin.name,
      api_key: origin.api_key,
      base_url: origin.base_url,
      is_active: origin.is_active
    });
    setShowOriginModal(true);
  };

  // 모델 편집 시작
  const handleEditModel = (model) => {
    setEditingModelId(model.id);
    setModelFormData({
      origin_id: model.origin.toString(),
      model_name: model.model_name,
      context_length: model.context_length,
      max_output_tokens: model.max_output_tokens,
      streaming: model.streaming,
      function_calling: model.function_calling,
      is_active: model.is_active
    });
    setShowModelModal(true);
  };

  // 폼 입력값 변경 핸들러
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 중첩된 필드 (messengers) 처리
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setBotData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    }
    // 일반 필드 처리
    else {
      setBotData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked :
                type === 'number' ? parseFloat(value) : value
      }));
    }
  };

  // 오리진 모달 폼 변경 핸들러
  const handleOriginInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setOriginFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // 모델 모달 폼 변경 핸들러
  const handleModelInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setModelFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked :
              name === 'context_length' || name === 'max_output_tokens'
                ? parseInt(value) : value
    }));
  };

  // 오리진 선택 시 모델 목록 업데이트
  useEffect(() => {
    if (botData.llm_origin_id) {
      fetchLlmModels();

      // 모델 모달 폼 초기값 업데이트
      setModelFormData(prev => ({
        ...prev,
        origin_id: botData.llm_origin_id
      }));
    }
  }, [botData.llm_origin_id]);

  // 컴포넌트 마운트 시 오리진 목록 가져오기
  useEffect(() => {
    fetchLlmOrigins();
  }, []);

  // 다음 단계로 이동
  const goToNextStep = () => {
    // 각 단계별 유효성 검사
    if (currentStep === 1) {
      if (!botData.name.trim()) {
        setErrors(prev => ({ ...prev, step1: '봇 이름은 필수입니다.' }));
        return;
      }
      setErrors(prev => ({ ...prev, step1: null }));
    }
    else if (currentStep === 2) {
      if (!botData.llm_origin_id) {
        setErrors(prev => ({ ...prev, step2: 'LLM 오리진을 선택해주세요.' }));
        return;
      }
      if (!botData.llm_model_id) {
        setErrors(prev => ({ ...prev, step2: 'LLM 모델을 선택해주세요.' }));
        return;
      }
      setErrors(prev => ({ ...prev, step2: null }));
    }
    else if (currentStep === 3) {
      if (!botData.system_prompt.trim()) {
        setErrors(prev => ({ ...prev, step3: '시스템 프롬프트는 필수입니다.' }));
        return;
      }
      setErrors(prev => ({ ...prev, step3: null }));
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  // 이전 단계로 이동
  const goToPrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // 폼 최종 제출
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 필수 필드 확인
    if (!botData.name.trim()) {
      setCurrentStep(1);
      setErrors(prev => ({ ...prev, step1: '봇 이름은 필수입니다.' }));
      return;
    }

    if (!botData.llm_origin_id || !botData.llm_model_id) {
      setCurrentStep(2);
      setErrors(prev => ({ ...prev, step2: 'LLM 오리진과 모델을 선택해주세요.' }));
      return;
    }

    if (!botData.system_prompt.trim()) {
      setCurrentStep(3);
      setErrors(prev => ({ ...prev, step3: '시스템 프롬프트는 필수입니다.' }));
      return;
    }

    setIsSaving(true);

    try {
      // TODO: 실제 봇 생성 API 호출
      // const response = await botService.createBot(botData);
      // 임시 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSavedSuccess(true);

      // 성공 메시지 표시 후 봇 목록 페이지로 이동
      setTimeout(() => {
        navigate('/bots');
      }, 1500);
    } catch (error) {
      console.error('봇 생성 실패:', error);
      setErrors(prev => ({ ...prev, step4: '봇 생성에 실패했습니다. 다시 시도해주세요.' }));
    } finally {
      setIsSaving(false);
    }
  };

  // 단계별 콘텐츠 렌더링
  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <Step1BasicInfo
            botData={botData}
            handleInputChange={handleInputChange}
            error={errors.step1}
          />
        );
      case 2:
        return (
          <Step2LLMSettings
            botData={botData}
            handleInputChange={handleInputChange}
            error={errors.step2}
            llmOrigins={llmOrigins}
            llmModels={llmModels}
            isLoadingOrigins={isLoadingOrigins}
            isLoadingModels={isLoadingModels}
            handleAddOrigin={() => {
              resetOriginModal();
              setShowOriginModal(true);
            }}
            handleEditOrigin={handleEditOrigin}
            handleDeleteOrigin={handleDeleteOrigin}
            handleAddModel={() => {
              resetModelModal();
              setShowModelModal(true);
            }}
            handleEditModel={handleEditModel}
            handleDeleteModel={handleDeleteModel}
          />
        );
      case 3:
        return (
          <Step3PromptSettings
            botData={botData}
            handleInputChange={handleInputChange}
            error={errors.step3}
          />
        );
      case 4:
        return (
          <Step4Messengers
            botData={botData}
            handleInputChange={handleInputChange}
            error={errors.step4}
            llmOrigins={llmOrigins}
            llmModels={llmModels}
            isSaving={isSaving}
            savedSuccess={savedSuccess}
          />
        );
      default:
        return null;
    }
  };

  // 네비게이션 버튼 렌더링
  const renderNavButtons = () => {
    return (
      <div className="flex justify-between mt-6">
        <button
          type="button"
          onClick={goToPrevStep}
          disabled={currentStep === 1}
          className={`flex items-center px-6 py-2 rounded-lg ${
            currentStep === 1
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors'
          }`}
        >
          <ChevronLeft size={16} className="mr-1" />
          이전
        </button>

        {currentStep < totalSteps ? (
          <button
            type="button"
            onClick={goToNextStep}
            className="flex items-center px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-sm"
          >
            다음
            <ChevronRight size={16} className="ml-1" />
          </button>
        ) : (
          <button
            type="submit"
            onClick={handleSubmit}
            disabled={isSaving || savedSuccess}
            className={`flex items-center px-6 py-2 rounded-lg transition-colors shadow-sm ${
              isSaving
                ? 'bg-gray-400 text-white cursor-wait'
                : savedSuccess
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-500 text-white hover:bg-blue-600'
            }`}
          >
            {isSaving ? (
              <>
                <RefreshCw size={16} className="mr-2 animate-spin" />
                저장 중...
              </>
            ) : savedSuccess ? (
              <>
                <Check size={16} className="mr-2" />
                저장 완료
              </>
            ) : (
              <>
                <Save size={16} className="mr-2" />
                봇 생성하기
              </>
            )}
          </button>
        )}
      </div>
    );
  };

  return (
    <Layout activeMenu="bots">
      <div className="max-w-4xl mx-auto px-4">
        <div className="mb-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center">
            <Bot size={24} className="text-blue-500 mr-2" />
            새로운 봇 만들기
          </h1>
          <button
            type="button"
            onClick={() => navigate('/bots')}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            중단하기
          </button>
        </div>

        {/* 진행 상태 표시 */}
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />

        {/* 단계별 콘텐츠 */}
        {renderStepContent()}

        {/* 네비게이션 버튼 */}
        {renderNavButtons()}

        {/* 모달 컴포넌트들 */}
        <OriginModal
          isOpen={showOriginModal}
          onClose={() => setShowOriginModal(false)}
          formData={originFormData}
          onChange={handleOriginInputChange}
          onSubmit={saveOrigin}
          isEditing={!!editingOriginId}
          isSaving={isSavingOrigin}
        />

        <ModelModal
          isOpen={showModelModal}
          onClose={() => setShowModelModal(false)}
          formData={modelFormData}
          onChange={handleModelInputChange}
          onSubmit={saveModel}
          isEditing={!!editingModelId}
          isSaving={isSavingModel}
          origins={llmOrigins}
        />
      </div>

      <Chat />
    </Layout>
  );
};

export default CreateBot;