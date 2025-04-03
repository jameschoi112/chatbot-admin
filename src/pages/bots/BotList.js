import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  ChevronDown,
  Trash2,
  MessageCircle,
  AlertTriangle
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Chat from '../../components/Chat';

// 임시 봇 데이터
const botData = [
  {
    id: 1,
    name: '고객 지원 봇',
    status: 'active',
    description: '고객 문의에 자동으로 응답하고 FAQ를 처리하는 봇입니다.',
    created: '2025-02-25',
    creator: '김관리자',
    usageCount: 1723,
    lastUsed: '2025-03-01',
    apiKey: 'sk-abcd1234efgh5678ijkl9012mnop3456qrst7890'
  },
  {
    id: 2,
    name: '제품 안내 봇',
    status: 'active',
    description: '회사 제품에 대한 정보를 제공하고 기능을 안내하는 봇입니다.',
    created: '2025-02-24',
    creator: '이마케팅',
    usageCount: 945,
    lastUsed: '2025-03-02',
    apiKey: 'sk-uvwx5678yzab9012cdef3456ghij7890klmn1234'
  },
  {
    id: 3,
    name: '입사 지원 봇',
    status: 'inactive',
    description: '채용 과정에서 지원자들의 질문에 응답하는 봇입니다.',
    created: '2025-02-22',
    creator: '박인사',
    usageCount: 521,
    lastUsed: '2025-02-28',
    apiKey: 'sk-opqr5678stuv9012wxyz3456abcd7890efgh1234'
  },
  {
    id: 4,
    name: '마케팅 봇',
    status: 'active',
    description: '마케팅 캠페인 정보를 제공하고 고객 데이터를 수집하는 봇입니다.',
    created: '2025-02-20',
    creator: '이마케팅',
    usageCount: 2354,
    lastUsed: '2025-03-03',
    apiKey: 'sk-ijkl5678mnop9012qrst3456uvwx7890yzab1234'
  },
  {
    id: 5,
    name: '영업 문의 봇',
    status: 'active',
    description: '영업 관련 문의를 처리하고 담당자 연결을 돕는 봇입니다.',
    created: '2025-02-18',
    creator: '최영업',
    usageCount: 1482,
    lastUsed: '2025-03-02',
    apiKey: 'sk-cdef5678ghij9012klmn3456opqr7890stuv1234'
  },
  {
    id: 6,
    name: '기술 지원 봇',
    status: 'active',
    description: '제품 사용 중 발생하는 기술적 문제 해결을 돕는 봇입니다.',
    created: '2025-02-15',
    creator: '정개발',
    usageCount: 1245,
    lastUsed: '2025-03-01',
    apiKey: 'sk-wxyz5678abcd9012efgh3456ijkl7890mnop1234'
  },
  {
    id: 7,
    name: '교육 콘텐츠 봇',
    status: 'inactive',
    description: '회사 제품 사용법을 교육하고 가이드를 제공하는 봇입니다.',
    created: '2025-02-10',
    creator: '김교육',
    usageCount: 876,
    lastUsed: '2025-02-25',
    apiKey: 'sk-qrst5678uvwx9012yzab3456cdef7890ghij1234'
  }
];

// 커스텀 드롭다운 컴포넌트
const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // 드롭다운 외부 클릭 감지
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 선택된 항목의 라벨 찾기
  const selectedOption = options.find(option => option.value === value);

  return (
    <div className="relative w-48" ref={dropdownRef}>
      <button
        type="button"
        className="flex items-center justify-between w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 shadow-sm hover:bg-gray-50 focus:ring-2 focus:ring-sky-500 focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{selectedOption?.label}</span>
        <ChevronDown size={16} className={`transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg py-1 overflow-hidden">
          {options.map((option) => (
            <div
              key={option.value}
              className={`px-4 py-2.5 text-sm cursor-pointer hover:bg-gray-100 ${value === option.value ? 'bg-sky-50 text-sky-700' : 'text-gray-700'}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// 테이블 헤더 컴포넌트
const TableHeader = ({ label, field, sortField, sortDirection, onSort }) => {
  return (
    <th
      scope="col"
      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
      onClick={() => onSort(field)}
    >
      <div className="flex items-center">
        {label}
        <span className="ml-1 text-gray-400">
          {sortField === field && (
            sortDirection === 'asc' ? '↑' : '↓'
          )}
        </span>
      </div>
    </th>
  );
};

const BotList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [botToDelete, setBotToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  // 상태 필터 옵션
  const statusOptions = [
    { value: 'all', label: '모든 상태' },
    { value: 'active', label: '활성 봇' },
    { value: 'inactive', label: '비활성 봇' },
  ];

  // 필터링 함수
  const filteredBots = botData.filter(bot => {
    const matchesSearch = bot.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bot.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || bot.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 정렬 함수
  const sortedBots = [...filteredBots].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'created') {
      comparison = new Date(a.created) - new Date(b.created);
    } else if (sortField === 'usageCount') {
      comparison = a.usageCount - b.usageCount;
    } else if (sortField === 'status') {
      comparison = a.status.localeCompare(b.status);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // 정렬 상태 변경 함수
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 봇 상세 페이지로 이동
  const handleViewDetails = (botId) => {
    navigate(`/bots/${botId}`);
  };

  // 삭제 확인 모달 표시
  const handleDeleteClick = (e, bot) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    setBotToDelete(bot);
    setShowDeleteConfirm(true);
  };

  // 채팅 시뮬레이션
  const handleChatClick = (e, bot) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    console.log(`채팅 시작: ${bot.name} (ID: ${bot.id})`);
    // 실제 구현에서는 채팅 인터페이스 열기
  };

  // 실제 삭제 처리 (여기서는 시뮬레이션만)
  const confirmDelete = () => {
    console.log(`봇 삭제: ${botToDelete.name} (ID: ${botToDelete.id})`);
    setShowDeleteConfirm(false);
    setBotToDelete(null);
    // 삭제 후 상태 업데이트 로직이 필요함
  };

  // 각 상태 뱃지의 스타일 설정
  const getStatusBadgeStyle = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 border-green-500 text-green-700';
      case 'inactive':
        return 'bg-gray-100 border-gray-400 text-gray-600';
      default:
        return 'bg-gray-100 border-gray-400 text-gray-600';
    }
  };

  return (
    <>
      <Layout activeMenu="bots">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">챗봇 관리</h1>
            <button
              onClick={() => navigate('/create-bot')}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-md transition-colors shadow-md"
            >
              새 봇 만들기
            </button>
          </div>

          {/* 검색 및 필터 영역 */}
          <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap gap-6 items-center">
              {/* 검색 필드 */}
              <div className="flex-1 min-w-[240px]">
                <div className={`relative border ${isSearchFocused ? 'border-sky-500 ring-2 ring-sky-100' : 'border-gray-300'} rounded-lg transition-all duration-200`}>
                  <input
                    type="text"
                    placeholder="봇 이름 또는 설명 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                    className="w-full pl-10 pr-4 py-2.5 rounded-lg focus:outline-none"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* 상태 필터 */}
              <div className="w-auto">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-600">상태:</span>
                  <CustomDropdown
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusOptions}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 봇 목록 테이블 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <TableHeader
                      label="봇 이름"
                      field="name"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <TableHeader
                      label="상태"
                      field="status"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <TableHeader
                      label="생성일"
                      field="created"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <TableHeader
                      label="누적 사용량"
                      field="usageCount"
                      sortField={sortField}
                      sortDirection={sortDirection}
                      onSort={handleSort}
                    />
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedBots.length > 0 ? (
                    sortedBots.map((bot) => (
                      <tr
                        key={bot.id}
                        className="hover:bg-gray-50 transition-colors cursor-pointer"
                        onClick={() => handleViewDetails(bot.id)}
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{bot.name}</div>
                              <div className="text-sm text-gray-500 line-clamp-1">{bot.description}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs border ${getStatusBadgeStyle(bot.status)}`}>
                            {bot.status === 'active' ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bot.created}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {bot.usageCount.toLocaleString()}회
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium" onClick={(e) => e.stopPropagation()}>
                          <div className="flex space-x-4">
                            <button
                              onClick={(e) => handleChatClick(e, bot)}
                              className="text-sky-600 hover:text-sky-800 transition-colors"
                              title="채팅 테스트"
                            >
                              <MessageCircle size={18} />
                            </button>
                            <button
                              onClick={(e) => handleDeleteClick(e, bot)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="삭제"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-10 text-center text-gray-500">
                        <div className="flex flex-col items-center">
                          <AlertTriangle size={48} className="text-gray-300 mb-4" />
                          <p>검색 조건에 맞는 봇이 없습니다.</p>
                          <p className="text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Layout>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && botToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-auto">
            <div className="text-center mb-6">
              <AlertTriangle size={48} className="text-red-500 mx-auto mb-4" />
              <h3 className="text-lg font-bold text-gray-900">봇 삭제 확인</h3>
              <p className="text-gray-600 mt-2">
                '{botToDelete.name}' 봇을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
              </p>
            </div>
            <div className="flex justify-center space-x-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              >
                취소
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors"
              >
                삭제
              </button>
            </div>
          </div>
        </div>
      )}

      <Chat />
    </>
  );
};

export default BotList;