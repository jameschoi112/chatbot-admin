import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { EyeIcon, EyeOffIcon, LockIcon, UserIcon, X, Mail, Building, User, AlertCircle} from 'lucide-react';
import backgroundImage from '../assets/background.png'; // 배경 이미지 import
import logoImage from '../assets/logo.png'; // 로고 이미지 import

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
    company_name: '',
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

  // Google 로그인 핸들러
  const handleGoogleLogin = () => {
    // 실제 구현에서는 Google OAuth 연동
    console.log('Google 로그인 시도');
    // 구현 예시: window.location.href = `${API_URL}/auth/google/`;
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
        company_name: signupData.company,
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
    <div
      className="min-h-screen flex items-center justify-center p-4 bg-gray-100 relative"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* 배경 오버레이 */}
      <div className="absolute inset-0 bg-black bg-opacity-40 "></div>

      {/* 새로운 2단 레이아웃 컨테이너 */}
      <div className="container mx-auto z-10 flex flex-col md:flex-row items-center justify-between max-w-6xl">

        {/* 왼쪽 영역: 로고 및 제목 */}
        <div className="w-full md:w-2/5 mb-8 md:mb-0 text-center md:text-left text-white">
          <div className="mb-6 flex items-center">
            <img src={logoImage} alt="로고" className="h-12 mr-4 mt-3" />
            <div>
              <span className="text-white text-5xl font-bold">Project</span>
              <span className="text-sky-300 text-5xl font-bold"> Eco</span>
            </div>
          </div>
          <h2 className="text-3xl font-semibold mb-6">로그인</h2>
          <p className="text-lg text-gray-300 max-w-md">
            손쉽고 간편하게 만드는 나만의 챗봇
          </p>
        </div>

        {/* 오른쪽 영역: 로그인 폼 */}
        <div className="w-full md:w-3/5 lg:w-2/5">
          <div className="bg-white rounded-xl shadow-xl overflow-hidden">
            <div className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">로그인</h2>

              {/* 에러 메시지 */}
              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{error}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 폼 */}
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* 아이디 입력 */}
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    아이디
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="아이디를 입력해주세요"
                    />
                  </div>
                </div>

                {/* 비밀번호 입력 */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="비밀번호를 입력해주세요"
                    />
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      ) : (
                        <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      )}
                    </button>
                  </div>
                </div>

                {/* 자동 로그인 & 회원가입 */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <input
                      id="remember-me"
                      name="remember-me"
                      type="checkbox"
                      className="h-4 w-4 text-sky-600 focus:ring-sky-500 border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                      자동 로그인
                    </label>
                  </div>
                </div>

                {/* 로그인 버튼 */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
                >
                  {isLoading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    '로그인'
                  )}
                </button>
              </form>

              {/* 구분선 */}
              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">또는</span>
                </div>
              </div>

              {/* 소셜 로그인 */}
              <div className="mt-6">
                <button
                  type="button"
                  onClick={handleGoogleLogin}
                  className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-colors duration-200"
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Google 계정으로 로그인
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 회원가입 모달 */}
      {showSignup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="relative bg-white w-full max-w-md mx-auto rounded-xl shadow-2xl overflow-hidden">
            {/* 닫기 버튼 */}
            <button
              type="button"
              onClick={() => setShowSignup(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
            >
              <X size={20} />
            </button>

            <div className="bg-sky-600 py-6 px-8 text-center">
              <h2 className="text-xl font-bold text-white">회원가입</h2>
            </div>

            <div className="p-6">
              {/* 회원가입 오류 */}
              {signupError && (
                <div className="mb-4 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-md">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <AlertCircle size={20} className="text-red-500" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm">{signupError}</p>
                    </div>
                  </div>
                </div>
              )}

              <form onSubmit={handleSignupSubmit} className="space-y-4">
                {/* 사용자명 */}
                <div>
                  <label htmlFor="signup-username" className="block text-sm font-medium text-gray-700 mb-1">
                    사용자명
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <UserIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-username"
                      name="username"
                      type="text"
                      required
                      value={signupData.username}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
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
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-email"
                      name="email"
                      type="email"
                      required
                      value={signupData.email}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="이메일"
                    />
                  </div>
                </div>

                {/* 비밀번호 */}
                <div>
                  <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-password"
                      name="password"
                      type="password"
                      required
                      value={signupData.password}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="비밀번호"
                    />
                  </div>
                  <div className="mt-1 text-xs text-gray-500 space-y-1">
                    <p>비밀번호는 최소 8자 이상이어야 합니다.</p>
                  </div>
                </div>

                {/* 비밀번호 확인 */}
                <div>
                  <label htmlFor="signup-confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                    비밀번호 확인
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <LockIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-confirm-password"
                      name="confirmPassword"
                      type="password"
                      required
                      value={signupData.confirmPassword}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="비밀번호 확인"
                    />
                  </div>
                </div>

                {/* 회사명 */}
                <div>
                  <label htmlFor="signup-company" className="block text-sm font-medium text-gray-700 mb-1">
                    회사명
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Building className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="signup-company"
                      name="company"
                      type="text"
                      required
                      value={signupData.company}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
                      placeholder="회사명을 입력해주세요."
                    />
                  </div>
                </div>

                {/* 역할 */}
                <div>
                  <label htmlFor="signup-role" className="block text-sm font-medium text-gray-700 mb-1">
                    역할
                  </label>
                  <div className="relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <select
                      id="signup-role"
                      name="role"
                      value={signupData.role}
                      onChange={handleSignupChange}
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 sm:text-sm"
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
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-sky-600 hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 mt-6 transition-colors duration-200"
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
        </div>
      )}
    </div>
  );
};

export default LoginPage;