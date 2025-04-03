// src/pages/bots/components/TabNavigation.js
import React from 'react';
import { Album, Code, MessageCircle, FileText, Settings } from 'lucide-react';

const TabNavigation = ({ activeTab, handleTabChange }) => {
  const tabs = [
    { id: 'overview', label: '개요', icon: <Album size={16} className="mr-2" /> },
    { id: 'api', label: 'API 연동', icon: <Code size={16} className="mr-2" /> },
    { id: 'messengers', label: '메신저 연동', icon: <MessageCircle size={16} className="mr-2" /> },
    { id: 'documents', label: '문서 관리', icon: <FileText size={16} className="mr-2" /> },
    { id: 'settings', label: '설정', icon: <Settings size={16} className="mr-2" /> },
  ];

  return (
    <div className="flex border-b border-gray-200">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => handleTabChange(tab.id)}
          className={`flex items-center py-4 px-6 text-sm font-medium ${
            activeTab === tab.id
              ? 'text-blue-600 border-b-2 border-blue-500'
              : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
          } transition-colors`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;