import React, { useState } from 'react';
import { Bell, LogOut, ChevronDown, ChevronUp, User, Key } from 'lucide-react';

const Header = ({ userName = 'Admin', companyName = 'CPLABS', plan = '무료' }) => {
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [hasNotification] = useState(true);

  // 프로필 메뉴 토글 함수
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
  };

  // 로그아웃 처리 함수
  const handleLogout = () => {
    // 로컬 스토리지의 인증 정보 삭제
    localStorage.removeItem('token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_id');

    // 로그인 페이지로 이동
    window.location.href = '/login';
  };

  return (
    <header className="bg-navy-800 text-white h-16 flex items-center justify-between px-6 shadow-md">
      <div className="flex items-center">
        <div className="font-bold text-xl">
          <span className="text-white">Chat</span><span className="text-sky-300">Bot</span> Admin <span className="text-xs bg-blue-600 text-white ml-1 px-2 py-0.5 rounded-full">Beta</span>
        </div>
      </div>

      <div className="flex items-center space-x-6">
        <div className="relative">
          <button
            onClick={toggleProfileMenu}
            className="flex items-center text-sm font-bold border-b-2 border-transparent hover:border-sky-300 transition-colors"
          >
            <span className="mr-1">{userName}</span>
            <span className="text-gray-400">({companyName})</span>
            {profileMenuOpen ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>

          {/* 프로필 드롭다운 메뉴 */}
          {profileMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 text-gray-800 animate-slideDown">
              <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                <User size={16} className="mr-2 text-sky-600" />
                <span>마이페이지</span>
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                <Key size={16} className="mr-2 text-sky-600" />
                <span>비밀번호 변경</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600"
              >
                <LogOut size={16} className="mr-2" />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-sm font-bold">
          <span>사용 중인 요금제 : {plan}</span>
        </div>
        <div className="relative cursor-pointer group">
          <Bell size={20} className="hover:text-sky-300 transition-colors" />
          {hasNotification && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-sky-400 rounded-full"></span>
          )}
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10 text-gray-800 text-sm">
            <div className="p-2 border-b">
              <p className="font-semibold">새로운 알림</p>
            </div>
            <div className="p-2">
              <p>새로운 봇 템플릿이 추가되었습니다.</p>
              <p className="text-xs text-gray-500 mt-1">1시간 전</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;