import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon, X, Mail, Building, UserCircle } from 'lucide-react';

// 프록시를 통해 상대 경로 사용
const API_URL = 'https://aichat.metadium.club/api';

const LoginPage = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // 회원가입 상태 관리
  const [showSignup, setShowSignup] = useState(false);
  const [signupData, setSignupData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    company:'',
    role: 'USER'
  });
  const [signupError, setSignupError] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // 임시 admin 계정 체크 추가
    if (username === 'admin' && password === 'admin') {
      // 임시 사용자 정보 생성
      const mockUser = {
        id: 1,
        username: 'admin',
        email: 'admin@example.com',
        role: 'ADMIN'
      };

      // 임시 토큰 생성 (실제로는 의미 없는 문자열)
      const mockToken = 'mock-jwt-token-for-temporary-access';
      const mockRefreshToken = 'mock-refresh-token-for-temporary-access';

      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', mockToken);
      localStorage.setItem('refresh_token', mockRefreshToken);
      localStorage.setItem('user', JSON.stringify(mockUser));
      localStorage.setItem('user_id', mockUser.id.toString());

      // axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockToken}`;

      // 인증 상태 업데이트
      setIsAuthenticated(true);

      // 로딩 상태 종료
      setIsLoading(false);

      // 대시보드로 이동
      navigate('/');
      return;
    }

    try {
      // Django JWT 토큰 엔드포인트로 변경
      const response = await axios.post(`${API_URL}/auth/token/`, {
        username,
        password
      });

      // Django 응답 형식에 맞게 변수명 수정
      const { access, refresh, user } = response.data;

      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_id', user.id.toString());

      // axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // 인증 상태 업데이트
      setIsAuthenticated(true);

      navigate('/');
    } catch (error) {
      console.error('로그인 오류:', error);
      setError(
        error.response?.data?.detail ||
        '로그인에 실패했습니다. 아이디와 비밀번호를 확인해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  // 회원가입 입력 핸들러
  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // 회원가입 제출 핸들러
  const handleSignupSubmit = async (e) => {
  e.preventDefault();

  // 비밀번호 일치 검증
  if (signupData.password !== signupData.confirmPassword) {
    setSignupError('비밀번호가 일치하지 않습니다.');
    return;
  }

  setIsSigningUp(true);
  setSignupError('');

  try {
    // 회원가입 요청 데이터 준비 및 로깅
    const requestData = {
      username: signupData.username,
      email: signupData.email,
      password: signupData.password,
      company: signupData.company,
      role: signupData.role
    };
    console.log('회원가입 요청 데이터:', JSON.stringify(requestData));

    // 회원가입 요청
    const signupResponse = await axios.post(`${API_URL}/auth/register/`, requestData);
    console.log('회원가입 응답:', signupResponse.data);

    // 회원가입 성공 후 자동 로그인 처리
    if (signupResponse.data.access && signupResponse.data.refresh) {
      // 이미 토큰이 반환되면 그것을 사용
      const { access, refresh, user } = signupResponse.data;

      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_id', user.id.toString());

      // axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // 인증 상태 업데이트
      setIsAuthenticated(true);

      // 대시보드로 이동
      navigate('/');
      return;
    }

    // 토큰이 없는 경우, 로그인 시도
    try {
      const loginResponse = await axios.post(`${API_URL}/auth/token/`, {
        username: signupData.username,
        password: signupData.password
      });

      console.log('자동 로그인 응답:', loginResponse.data);

      const { access, refresh, user } = loginResponse.data;

      // 토큰과 사용자 정보 저장
      localStorage.setItem('token', access);
      localStorage.setItem('refresh_token', refresh);
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('user_id', user.id.toString());

      // axios 기본 헤더에 토큰 설정
      axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;

      // 인증 상태 업데이트
      setIsAuthenticated(true);

      // 대시보드로 이동
      navigate('/');
    } catch (loginError) {
      console.error('회원가입 후 자동 로그인 오류:', loginError);

      // 회원가입은 성공했지만 자동 로그인은 실패한 경우
      setShowSignup(false);
      setUsername(signupData.username);
      setPassword('');
      setError('회원가입은 완료되었지만, 로그인에 실패했습니다. 다시 로그인해 주세요.');
    }
  } catch (error) {
    console.error('회원가입 오류:', error);
    const errorMsg =
      error.response?.data?.username ||
      error.response?.data?.email ||
      error.response?.data?.password ||
      error.response?.data?.company ||
      error.response?.data?.non_field_errors ||
      Object.values(error.response?.data || {}).flat().join(' ') ||
      '회원가입 처리 중 오류가 발생했습니다.';

    setSignupError(Array.isArray(errorMsg) ? errorMsg[0] : errorMsg);
  } finally {
    setIsSigningUp(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-sky-300 via-gray-400 to-blue-500">
      {/* 로그인 카드 */}
      <div className="relative z-10 max-w-md w-full space-y-8 bg-white/70 backdrop-blur-sm rounded-2xl shadow-2xl p-8">
        {/* 헤더 */}
        <div className="text-center">
          <h4 className="mt-6 text-3xl font-extrabold text-blue-900">
            CPLABS 챗봇 어드민
          </h4>
        </div>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* 임시 로그인 안내 메시지 */}
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-800 px-4 py-3 rounded relative">
          <span className="block sm:inline font-medium">로그인 계정 : admin / admin</span>
        </div>

        {/* 폼 */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* 아이디 입력 */}
            <div className="relative">
              <label
                htmlFor="username"
                className="block text-sm font-medium text-blue-900 mb-1"
              >
                아이디
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon className="h-5 w-5 text-blue-900" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-blue-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="아이디를 입력해주세요."
                />
              </div>
            </div>

            {/* 비밀번호 입력 */}
            <div className="relative">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-blue-900 mb-1"
              >
                비밀번호
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockIcon className="h-5 w-5 text-blue-900" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-10 py-2 border border-blue-200 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all duration-300 bg-white/50 backdrop-blur-sm"
                  placeholder="비밀번호를 입력해주세요."
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOffIcon className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-blue-500 hover:text-blue-600" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* 자동 로그인 & 회원가입 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-blue-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-blue-900">
                자동 로그인
              </label>
            </div>

            <div className="text-sm">
              <button
                type="button"
                onClick={() => setShowSignup(true)}
                className="text-blue-600 hover:text-blue-800 font-medium underline"
              >
                회원가입
              </button>
            </div>
          </div>

          {/* 로그인 버튼 */}
          <button
            type="submit"
            disabled={isLoading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent
                     text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700
                     focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
                     transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              '로그인'
            )}
          </button>
        </form>

        {/* 푸터 */}
        <div className="mt-6 text-center">

        </div>
      </div>

      {/* 회원가입 모달 */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative bg-white w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden p-6">
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
            >
              <X size={20} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">회원가입</h2>

            {/* 회원가입 오류 */}
            {signupError && (
              <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                <span className="block sm:inline">{signupError}</span>
              </div>
            )}

            <form onSubmit={handleSignupSubmit} className="space-y-4">
              {/* 사용자명 */}
              <div>
                <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-1">
                  사용자명
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-username"
                    name="username"
                    type="text"
                    required
                    value={signupData.username}
                    onChange={handleSignupChange}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="사용자명"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  150자 이하 문자, 숫자 그리고 @/./+/-/_만 가능합니다.
                </p>
              </div>

              {/* 이메일 */}
              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                  이메일
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-email"
                    name="email"
                    type="email"
                    required
                    value={signupData.email}
                    onChange={handleSignupChange}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="이메일"
                  />
                </div>
              </div>

              {/* 비밀번호 */}
              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-password"
                    name="password"
                    type="password"
                    required
                    value={signupData.password}
                    onChange={handleSignupChange}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="비밀번호"
                  />
                </div>
                <div className="mt-1 text-xs text-gray-500 space-y-1">
                  <p>다른 개인 정보와 유사한 비밀번호는 사용할 수 없습니다.</p>
                  <p>* 비밀번호는 최소 8자 이상이어야 합니다.</p>
                  <p>* 통상적으로 자주 사용되는 비밀번호는 사용할 수 없습니다.</p>
                  <p>* 숫자로만 이루어진 비밀번호는 사용할 수 없습니다.</p>
                </div>
              </div>

              {/* 비밀번호 확인 */}
              <div>
                <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                  비밀번호 확인
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <LockIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-confirm-password"
                    name="confirmPassword"
                    type="password"
                    required
                    value={signupData.confirmPassword}
                    onChange={handleSignupChange}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="비밀번호 확인"
                  />
                </div>
              </div>

              {/* 회사명 */}
              <div>
                <label htmlFor="signup-company" className="block text-sm font-medium text-gray-700 mb-1">
                  회사명
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <Building className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="signup-company"
                    name="company"
                    type="text"
                    required
                    value={signupData.company}
                    onChange={handleSignupChange}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="회사명을 입력해주세요."
                  />
                </div>
              </div>

              {/* 역할 */}
              <div>
                <label htmlFor="signup-role" className="block text-sm font-medium text-gray-700 mb-1">
                  역할
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <select
                    id="signup-role"
                    name="role"
                    value={signupData.role}
                    onChange={handleSignupChange}
                    className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="USER">일반 사용자</option>
                    <option value="ADMIN">관리자</option>
                    <option value="OWNER">소유자</option>
                  </select>
                </div>
              </div>

              {/* 회원가입 버튼 */}
              <button
                type="submit"
                disabled={isSigningUp}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mt-6"
              >
                {isSigningUp ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  '회원가입'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginPage;