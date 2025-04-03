import React, { useState } from 'react';
import { Bell, LogOut, ChevronDown, ChevronUp, User, Key, Globe} from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Header = ({ userName = 'Admin', companyName = 'CPLABS', plan = '무료' }) => {
  const { t, i18n } = useTranslation();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [hasNotification] = useState(true);

  // 현재 언어 가져오기
  const currentLanguage = i18n.language;

  // 언어 표시 정보
  const languages = {
    ko: { name: '한국어' },
    en: { name: 'English' },
    ms: { name: 'Bahasa Melayu' }
  };

  // 프로필 메뉴 토글 함수
  const toggleProfileMenu = () => {
    setProfileMenuOpen(!profileMenuOpen);
    if (langMenuOpen) setLangMenuOpen(false);
  };

  // 언어 메뉴 토글 함수
  const toggleLangMenu = () => {
    setLangMenuOpen(!langMenuOpen);
    if (profileMenuOpen) setProfileMenuOpen(false);
  };

  // 언어 변경 함수
  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('i18nextLng', lang);
    setLangMenuOpen(false);
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
          <span className="text-white">Chat</span><span className="text-sky-300">Bot</span> Studio <span className="text-xs bg-blue-600 text-white ml-1 px-2 py-0.5 rounded-full">Beta</span>
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
                <span>{t('header.myPage')}</span>
              </button>
              <button className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors">
                <Key size={16} className="mr-2 text-sky-600" />
                <span>{t('header.changePassword')}</span>
              </button>
              <div className="border-t border-gray-200 my-1"></div>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors text-red-600"
              >
                <LogOut size={16} className="mr-2" />
                <span>{t('header.logout')}</span>
              </button>
            </div>
          )}
        </div>

        <div className="text-sm font-bold">
          <span>{t('header.plan')}: {t(`header.${plan === '무료' ? 'free' : 'paid'}`)}</span>
        </div>

        {/* 언어 선택 드롭다운 - 위치 변경됨 */}
        <div className="relative">
          <button
            onClick={toggleLangMenu}
            className="flex items-center text-sm border-b-2 border-transparent hover:border-sky-300 transition-colors"
          >
            <Globe size={16} className="mr-1 text-sky-300" />
            <span className="text-gray-300">{languages[currentLanguage]?.name || 'Language'}</span>
            {langMenuOpen ? <ChevronUp size={16} className="ml-1" /> : <ChevronDown size={16} className="ml-1" />}
          </button>

          {/* 언어 드롭다운 메뉴 */}
          {langMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20 text-gray-800 animate-slideDown">
              {Object.keys(languages).map((langCode) => (
                <button
                  key={langCode}
                  onClick={() => changeLanguage(langCode)}
                  className={`flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${
                    currentLanguage === langCode ? 'bg-gray-50 text-sky-600' : ''
                  }`}
                >
                  <span>{languages[langCode].name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="relative cursor-pointer group">
          <Bell size={20} className="hover:text-sky-300 transition-colors" />
          {hasNotification && (
            <span className="absolute -top-1 -right-1 w-2 h-2 bg-sky-400 rounded-full"></span>
          )}
          <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-md p-2 hidden group-hover:block z-10 text-gray-800 text-sm">
            <div className="p-2 border-b">
              <p className="font-semibold">{t('header.notifications')}</p>
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