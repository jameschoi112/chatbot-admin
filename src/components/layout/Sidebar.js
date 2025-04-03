
import React, { useState } from 'react';
import { Home, Bot, FileText, BarChart2, Users, Settings, HelpCircle, PlusCircle, ChevronRight, List} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const Sidebar = ({ activeMenu = 'dashboard' }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [expandedMenus, setExpandedMenus] = useState([]); // 기본적으로 모든 메뉴는 닫혀있음

  // 메뉴 아이템 데이터
  const getMenuItems = () => [
    { id: 'dashboard', label: t('sidebar.dashboard'), icon: Home, path: '/' },
    {
      id: 'bots',
      label: t('sidebar.botManagement'),
      icon: Bot,
      path: '/bots',
      hasSubMenu: true,
      subMenuItems: [
        { id: 'bot-list', label: t('sidebar.botManagement'), icon: Bot, path: '/bots' },
        { id: 'create-bot', label: t('sidebar.createBot'), icon: PlusCircle, path: '/create-bot' }
      ]
    },
    { id: 'documents', label: t('sidebar.documents'), icon: FileText, path: '/documents' },
    { id: 'analytics', label: t('sidebar.analytics'), icon: BarChart2, path: '/analytics' },
    {
      id: 'users',
      label: t('sidebar.userManagement'),
      icon: Users,
      path: '/users',
      hasSubMenu: true,
      subMenuItems: [
        { id: 'user-list', label: t('sidebar.userList'), icon: List, path: '/users' }

      ]
    },
    { id: 'settings', label: t('sidebar.settings'), icon: Settings, path: '/settings' }
  ];

  const handleMenuClick = (menuId, path, hasSubMenu) => {
    if (hasSubMenu) {
      // 아코디언 메뉴 토글
      setExpandedMenus(prev =>
        prev.includes(menuId)
          ? prev.filter(id => id !== menuId)
          : [...prev, menuId]
      );
    } else {
      // 일반 메뉴 클릭 시 해당 경로로 이동
      navigate(path);
    }
  };

  const handleSubMenuClick = (path, e) => {
    e.stopPropagation(); // 상위 메뉴 클릭 이벤트가 발생하지 않도록 함
    navigate(path);
  };

  const menuItems = getMenuItems();

  return (
    <aside className="bg-gray-900 text-white flex flex-col w-64 font-['Inter','Pretendard',sans-serif]">

      {/* 메뉴 항목 */}
      <nav className="flex-grow py-5 px-3 space-y-0.5 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedMenus.includes(item.id);
          const isActive = activeMenu === item.id;
          const hasSubMenu = item.hasSubMenu && item.subMenuItems && item.subMenuItems.length > 0;

          return (
            <div key={item.id} className="group">
              <button
                className={`flex items-center justify-between w-full rounded-md px-3 py-2.5 transition-all duration-200 ${
                  isActive
                    ? 'bg-sky-600 text-white shadow-sm'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`}
                onClick={() => handleMenuClick(item.id, item.path, hasSubMenu)}
              >
                <div className="flex items-center">
                  <div className={`w-8 h-8 flex items-center justify-center rounded-md mr-2 transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-sky-400'
                  }`}>
                    <Icon size={18} strokeWidth={2} className={`transition-transform duration-300 ${
                      isActive && isExpanded ? 'scale-110' : ''
                    }`} />
                  </div>
                  <span className={`text-sm font-semibold ${isActive ? 'font-bold' : 'font-semibold'}`}>{item.label}</span>
                </div>
                {hasSubMenu && (
                  <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-90' : 'rotate-0'}`}>
                    <ChevronRight size={16} className={`${isActive ? 'text-white' : 'text-gray-400 group-hover:text-sky-400'}`} />
                  </div>
                )}
              </button>

              {/* 하위 메뉴 아이템 - 애니메이션 적용 */}
              {hasSubMenu && (
                <div
                  className={`ml-4 pl-4 mt-0.5 border-l border-gray-700 overflow-hidden transition-all duration-300 ease-in-out ${
                    isExpanded
                      ? 'max-h-40 opacity-100'
                      : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="py-1 space-y-0.5">
                    {item.subMenuItems.map((subItem) => {
                      const isSubActive = activeMenu === subItem.id;

                      return (
                        <button
                          key={subItem.id}
                          className={`flex items-center w-full text-sm rounded-md py-2 px-3 transition-all duration-200 transform ${
                            isSubActive
                              ? 'bg-gray-800 text-white'
                              : 'text-gray-400 hover:bg-gray-800/50 hover:text-white'
                          } ${isExpanded ? 'translate-x-0' : '-translate-x-4'}`}
                          onClick={(e) => handleSubMenuClick(subItem.path, e)}
                        >
                          <div className={`h-1 w-1 rounded-full mr-3 transition-all duration-200 ${
                            isSubActive ? 'bg-sky-400' : 'bg-gray-500'
                          }`}></div>
                          <span className={isSubActive ? 'font-bold' : 'font-medium'}>{subItem.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="px-3 py-4 mt-auto">
        <button className="flex items-center w-full rounded-md px-3 py-2.5 text-gray-400 hover:bg-gray-800 hover:text-white transition-all duration-200 group">
          <div className="w-8 h-8 flex items-center justify-center rounded-md mr-2 group-hover:text-sky-400">
            <HelpCircle size={18} strokeWidth={2} />
          </div>
          <span className="text-sm font-semibold">{t('sidebar.help')}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;