import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  ArrowDown,
  ArrowUp,
  Edit,
  Trash2,
  UserPlus,
  Mail,
  Building,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import Layout from '../../components/layout/Layout';
import Chat from '../../components/Chat';
import UserAddModal from './UserAddModal';

// 임시 사용자 데이터
const userData = [
  {
    id: 1,
    name: '김관리자',
    email: 'admin@cplabs.com',
    company: 'CPLABS',
    role: 'admin',
    status: 'active',
    lastLogin: '2025-03-01 14:30',
    createdAt: '2025-01-15'
  },
  {
    id: 2,
    name: '이마케팅',
    email: 'marketing@cplabs.com',
    company: 'CPLABS',
    role: 'user',
    status: 'active',
    lastLogin: '2025-03-02 09:15',
    createdAt: '2025-01-20'
  },
  {
    id: 3,
    name: '박개발',
    email: 'dev@cplabs.com',
    company: 'CPLABS',
    role: 'user',
    status: 'active',
    lastLogin: '2025-03-01 18:45',
    createdAt: '2025-01-25'
  },
  {
    id: 4,
    name: '최인사',
    email: 'hr@cplabs.com',
    company: 'CPLABS',
    role: 'user',
    status: 'inactive',
    lastLogin: '2025-02-25 10:30',
    createdAt: '2025-02-01'
  },
  {
    id: 5,
    name: '정연구',
    email: 'research@cplabs.com',
    company: 'CPLABS',
    role: 'user',
    status: 'active',
    lastLogin: '2025-03-03 11:20',
    createdAt: '2025-02-05'
  },
  {
    id: 6,
    name: '강영업',
    email: 'sales@cplabs.com',
    company: 'CPLABS',
    role: 'user',
    status: 'active',
    lastLogin: '2025-03-02 13:10',
    createdAt: '2025-02-10'
  },
  {
    id: 7,
    name: '한고객',
    email: 'support@plunet.co.kr',
    company: '플루넷',
    role: 'user',
    status: 'active',
    lastLogin: '2025-03-01 16:05',
    createdAt: '2025-02-15'
  },
  {
    id: 8,
    name: '김파트너',
    email: 'partner@dataon.co.kr',
    company: '데이터온',
    role: 'user',
    status: 'inactive',
    lastLogin: '2025-02-20 15:40',
    createdAt: '2025-02-20'
  }
];

const UserList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [users, setUsers] = useState(userData);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const itemsPerPage = 5;

  // 필터링 함수
  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // 정렬 함수
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let comparison = 0;

    if (sortField === 'name') {
      comparison = a.name.localeCompare(b.name);
    } else if (sortField === 'email') {
      comparison = a.email.localeCompare(b.email);
    } else if (sortField === 'company') {
      comparison = a.company.localeCompare(b.company);
    } else if (sortField === 'createdAt') {
      comparison = new Date(a.createdAt) - new Date(b.createdAt);
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
  const paginatedUsers = sortedUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 정렬 상태 변경 함수
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // 사용자 추가 모달 열기
  const handleAddUser = () => {
    setIsAddModalOpen(true);
  };

  // 사용자 추가 성공 처리
  const handleAddSuccess = () => {
    refreshUserList();
  };

  // 사용자 목록 새로고침
  const refreshUserList = () => {
    setIsRefreshing(true);

    // API 호출 시뮬레이션
    setTimeout(() => {
      // 실제 구현에서는 API에서 새로운 사용자 목록을 가져옵니다
      // 여기서는 임의로 새 사용자를 추가합니다
      const newUser = {
        id: Math.floor(Math.random() * 1000) + 10,
        name: '신규사용자',
        email: `new${Math.floor(Math.random() * 100)}@cplabs.com`,
        company: 'CPLABS',
        role: 'user',
        status: 'active',
        lastLogin: '-',
        createdAt: new Date().toISOString().split('T')[0]
      };

      setUsers(prev => [newUser, ...prev]);
      setIsRefreshing(false);
    }, 800);
  };

  // 사용자 편집
  const handleEditUser = (userId) => {
    console.log(`사용자 편집: ID ${userId}`);
    // 실제 구현에서는 편집 모달 표시
  };

  // 삭제 확인 모달 표시
  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setShowDeleteConfirm(true);
  };

  // 실제 삭제 처리
  const confirmDelete = () => {
    // 실제 구현에서는 API 호출 등을 통해 사용자를 삭제
    console.log(`사용자 삭제: ${userToDelete.name} (ID: ${userToDelete.id})`);

    // 목록에서 삭제된 사용자 제거
    setUsers(prev => prev.filter(user => user.id !== userToDelete.id));

    setShowDeleteConfirm(false);
    setUserToDelete(null);
  };

  // 페이지 변경 함수
  const changePage = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <>
      <Layout activeMenu="users">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">사용자 관리</h1>
            <button
              onClick={handleAddUser}
              className="bg-sky-500 hover:bg-sky-600 text-white font-semibold px-4 py-2 rounded-md transition-colors shadow-md flex items-center space-x-2"
            >
              <UserPlus size={18} />
              <span>사용자 추가</span>
            </button>
          </div>

          {/* 검색 및 필터 영역 */}
          <div className="bg-white p-4 rounded-lg shadow-md mb-6">
            <div className="flex flex-wrap gap-4 items-center">
              {/* 검색 필드 */}
              <div className="flex-1 min-w-[240px]">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="이름, 이메일 또는 회사 검색..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                  />
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                </div>
              </div>

              {/* 상태 필터 */}
              <div className="w-auto">
                <div className="flex items-center bg-white border border-gray-300 rounded-lg px-3 py-2">
                  <Filter size={18} className="text-gray-400 mr-2" />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-transparent focus:outline-none text-gray-700"
                  >
                    <option value="all">모든 상태</option>
                    <option value="active">활성 사용자</option>
                    <option value="inactive">비활성 사용자</option>
                  </select>
                </div>
              </div>

              {/* 새로고침 버튼 */}
              <button
                onClick={refreshUserList}
                className="p-2 text-sky-600 hover:text-sky-800 hover:bg-sky-50 rounded-lg transition-colors"
                disabled={isRefreshing}
                title="새로고침"
              >
                <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
              </button>
            </div>
          </div>

          {/* 사용자 목록 테이블 */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {/* 이름 헤더 */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center">
                        이름
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>

                    {/* 이메일 헤더 */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}
                    >
                      <div className="flex items-center">
                        이메일
                        {sortField === 'email' && (
                          sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>

                    {/* 회사 헤더 */}
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('company')}
                    >
                      <div className="flex items-center">
                        회사
                        {sortField === 'company' && (
                          sortDirection === 'asc' ? <ArrowUp size={14} className="ml-1" /> : <ArrowDown size={14} className="ml-1" />
                        )}
                      </div>
                    </th>

                    {/* 상태 헤더 */}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      상태
                    </th>

                    {/* 작업 헤더 */}
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      작업
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedUsers.length > 0 ? (
                    paginatedUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div>
                              <div className="text-sm font-medium text-gray-900">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.role === 'admin' ? '관리자' : '일반 사용자'}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            <span>{user.email}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Building size={14} className="mr-2 text-gray-400" />
                            <span>{user.company}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 rounded-full text-xs border ${
                            user.status === 'active'
                              ? 'border-green-500 text-green-700'
                              : 'border-gray-400 text-gray-600'
                          }`}>
                            {user.status === 'active' ? '활성' : '비활성'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-3">
                            <button
                              onClick={() => handleEditUser(user.id)}
                              className="text-sky-600 hover:text-sky-900 transition-colors"
                              title="편집"
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(user)}
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
                          <p>검색 조건에 맞는 사용자가 없습니다.</p>
                          <p className="text-sm mt-2">다른 검색어나 필터를 시도해보세요.</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* 페이지네이션 */}
            {sortedUsers.length > 0 && (
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                <div className="text-sm text-gray-500">
                  {filteredUsers.length}명의 사용자 중 {(currentPage - 1) * itemsPerPage + 1} - {Math.min(currentPage * itemsPerPage, filteredUsers.length)}명 표시
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 1}
                    className={`p-1 rounded-md ${
                      currentPage === 1
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronLeft size={20} />
                  </button>
                  {[...Array(totalPages)].map((_, index) => (
                    <button
                      key={index}
                      onClick={() => changePage(index + 1)}
                      className={`px-3 py-1 rounded-md ${
                        currentPage === index + 1
                          ? 'bg-sky-500 text-white'
                          : 'text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className={`p-1 rounded-md ${
                      currentPage === totalPages
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Layout>

      {/* 사용자 추가 모달 */}
      <UserAddModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={handleAddSuccess}
      />

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && userToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-sm mx-auto animate-scale-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle size={30} className="text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">사용자 삭제 확인</h3>
              <p className="text-gray-600 mt-2">
                '{userToDelete.name}' 사용자를 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
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

export default UserList;