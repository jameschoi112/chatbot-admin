import React, { useState, useEffect } from 'react';
import {
  X,
  User,
  Mail,
  Building,
  ToggleLeft,
  ToggleRight,
  Key,
  AlertCircle,
  Check,
  UserCircle
} from 'lucide-react';

const UserAddModal = ({ isOpen, onClose, onSuccess }) => {
  // 폼 상태
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: 'CPLABS',
    role: 'user',
    status: 'active',
    password: '',
    passwordConfirm: '',
    sendEmail: true
  });

  // 유효성 검사 오류
  const [errors, setErrors] = useState({});

  // 제출 상태
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);

    // 모달이 열릴 때 body 스크롤 방지
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  // 모달 외부 클릭 시 닫기
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 입력 변경 처리
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // 입력 시 해당 필드의 오류 메시지 제거
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // 토글 상태 변경
  const handleToggle = (field) => {
    setFormData(prev => ({
      ...prev,
      [field]: field === 'status' ?
        (prev[field] === 'active' ? 'inactive' : 'active') :
        !prev[field]
    }));
  };

  // 폼 제출 처리
  const handleSubmit = (e) => {
    e.preventDefault();

    // 유효성 검사
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // 제출 시작
    setIsSubmitting(true);

    // API 호출 시뮬레이션
    setTimeout(() => {
      console.log('사용자 추가:', formData);
      setIsSubmitting(false);
      setSubmitSuccess(true);

      // 성공 후 3초 뒤 모달 닫기
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    }, 1000);
  };

  // 폼 유효성 검사
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) {
      errors.name = '이름을 입력해주세요.';
    }

    if (!formData.email.trim()) {
      errors.email = '이메일을 입력해주세요.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = '유효한 이메일 주소를 입력해주세요.';
    }

    if (!formData.company.trim()) {
      errors.company = '회사명을 입력해주세요.';
    }

    if (!formData.password) {
      errors.password = '비밀번호를 입력해주세요.';
    } else if (formData.password.length < 8) {
      errors.password = '비밀번호는 8자 이상이어야 합니다.';
    }

    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
    }

    return errors;
  };

  // 모달이 닫혀있으면 렌더링하지 않음
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto"
      onClick={handleOverlayClick}
    >
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-scale-up">
        {/* 모달 헤더 */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold flex items-center">
            <UserCircle className="mr-2" size={22} />
            관리자 계정 추가
          </h2>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white transition-colors focus:outline-none"
          >
            <X size={20} />
          </button>
        </div>

        {/* 모달 본문 */}
        <div className="overflow-y-auto max-h-[calc(90vh-60px)]">
          {submitSuccess ? (
            <div className="p-8">
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check size={32} className="text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800 mb-2">사용자가 성공적으로 추가되었습니다!</h2>
                <p className="text-gray-600">잠시 후 목록이 새로고침됩니다...</p>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* 기본 정보 섹션 */}
              <div>
                <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                  <User size={16} className="text-sky-500 mr-2" />
                  기본 정보
                </h3>

                {/* 이름 필드 */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      이름*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <User size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
                        placeholder="홍길동"
                      />
                    </div>
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                    )}
                  </div>

                  {/* 이메일 필드 */}
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                      이메일*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Mail size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
                        placeholder="example@cplabs.com"
                      />
                    </div>
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                    )}
                  </div>

                  {/* 회사 필드 */}
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">
                      회사*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Building size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="company"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.company ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
                        placeholder="CPLABS"
                      />
                    </div>
                    {errors.company && (
                      <p className="mt-1 text-sm text-red-500">{errors.company}</p>
                    )}
                  </div>

                  {/* 권한 필드 */}
                  <div>
                    <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                      권한
                    </label>
                    <select
                      id="role"
                      name="role"
                      value={formData.role}
                      onChange={handleChange}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
                    >
                      <option value="user">일반 사용자</option>
                      <option value="admin">관리자</option>
                    </select>
                  </div>

                  {/* 상태 토글 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      상태
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleToggle('status')}
                        className="focus:outline-none"
                      >
                        {formData.status === 'active' ? (
                          <ToggleRight size={28} className="text-sky-500" />
                        ) : (
                          <ToggleLeft size={28} className="text-gray-400" />
                        )}
                      </button>
                      <span className="ml-2 text-sm text-gray-700">
                        {formData.status === 'active' ? '활성' : '비활성'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 보안 설정 섹션 */}
              <div className="pt-4 border-t border-gray-200">
                <h3 className="text-md font-medium text-gray-800 mb-4 flex items-center">
                  <Key size={16} className="text-sky-500 mr-2" />
                  보안 설정
                </h3>

                <div className="space-y-4">
                  {/* 비밀번호 필드 */}
                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                      비밀번호*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
                        placeholder="비밀번호 입력"
                      />
                    </div>
                    {errors.password && (
                      <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                    )}
                    <p className="mt-1 text-xs text-gray-500">8자 이상의 비밀번호를 입력하세요.</p>
                  </div>

                  {/* 비밀번호 확인 필드 */}
                  <div>
                    <label htmlFor="passwordConfirm" className="block text-sm font-medium text-gray-700 mb-1">
                      비밀번호 확인*
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Key size={16} className="text-gray-400" />
                      </div>
                      <input
                        id="passwordConfirm"
                        name="passwordConfirm"
                        type="password"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        className={`w-full pl-10 pr-4 py-2 border ${errors.passwordConfirm ? 'border-red-500' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500`}
                        placeholder="비밀번호 확인"
                      />
                    </div>
                    {errors.passwordConfirm && (
                      <p className="mt-1 text-sm text-red-500">{errors.passwordConfirm}</p>
                    )}
                  </div>

                  {/* 이메일 알림 설정 */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      이메일 알림
                    </label>
                    <div className="flex items-center">
                      <button
                        type="button"
                        onClick={() => handleToggle('sendEmail')}
                        className="focus:outline-none"
                      >
                        {formData.sendEmail ? (
                          <ToggleRight size={28} className="text-sky-500" />
                        ) : (
                          <ToggleLeft size={28} className="text-gray-400" />
                        )}
                      </button>
                      <span className="ml-2 text-sm text-gray-700">
                        {formData.sendEmail ? '활성화' : '비활성화'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      사용자에게 계정 생성 알림 이메일을 보냅니다.
                    </p>
                  </div>
                </div>
              </div>

              {/* 알림 메시지 */}
              <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded">
                <div className="flex">
                  <AlertCircle size={20} className="text-amber-600 mr-2 flex-shrink-0" />
                  <div className="text-sm text-amber-700">
                    <p>
                      사용자를 추가하면 해당 사용자는 시스템에 로그인하여 권한에 따라 기능을 사용할 수 있습니다.
                      관리자 권한은 신중하게 부여해주세요.
                    </p>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>

        {/* 모달 푸터 (성공 시 숨김) */}
        {!submitSuccess && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              onClick={handleSubmit}
              className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  처리 중...
                </>
              ) : (
                '사용자 추가'
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAddModal;