// src/pages/bots/components/tabs/DocumentsTab.js
import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  ExternalLink,
  Trash2,
  Info,
  Search,
  Check,
  AlertCircle,
  Loader2,
  Filter
} from 'lucide-react';

const DocumentsTab = ({ bot, setFileUploadOpen, deleteDocument }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [filteredDocuments, setFilteredDocuments] = useState([]);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 필터링 로직
  useEffect(() => {
    const filtered = bot.documents.filter(doc => {
      const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });

    setFilteredDocuments(filtered);
  }, [searchTerm, statusFilter, bot.documents]);

  // 업로드 상태 스타일 정의
  const getStatusStyles = (status) => {
    switch(status) {
      case 'completed':
        return 'text-green-600 font-medium';
      case 'processing':
        return 'text-blue-600 font-medium';
      case 'failed':
        return 'text-red-600 font-medium';
      default:
        return 'text-gray-600 font-medium';
    }
  };

  // 상태 레이블 컴포넌트
  const StatusBadge = ({ status }) => {
    const textStyle = getStatusStyles(status || 'completed');
    const label = {
      'completed': '완료',
      'processing': '처리중',
      'failed': '실패'
    }[status] || '완료';

    return (
      <span className={`text-sm ${textStyle}`}>
        {label}
      </span>
    );
  };

  // 파일 종류에 따른 아이콘 렌더링
  const getFileIcon = (fileName) => {
    const extension = fileName.split('.').pop().toLowerCase();

    switch(extension) {
      case 'pdf':
        return <FileText size={18} className="text-red-400 mr-3" />;
      case 'docx':
      case 'doc':
        return <FileText size={18} className="text-blue-400 mr-3" />;
      case 'txt':
        return <FileText size={18} className="text-gray-400 mr-3" />;
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileText size={18} className="text-green-400 mr-3" />;
      default:
        return <FileText size={18} className="text-gray-400 mr-3" />;
    }
  };

  return (
    <div className="p-6 animate-fadeIn">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800 flex items-center">
          <FileText size={20} className="text-blue-500 mr-2" />
          문서 관리
        </h2>
        <button
          onClick={() => setFileUploadOpen(true)}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm"
        >
          <Upload size={18} className="mr-2" />
          문서 업로드
        </button>
      </div>

      {/* 검색 및 필터 영역 */}
      <div className="bg-white rounded-xl shadow-md border border-gray-100 p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* 검색 필드 */}
          <div className="flex-1 min-w-[240px]">
            <div className={`relative border ${isSearchFocused ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-300'} rounded-lg transition-all duration-200`}>
              <input
                type="text"
                placeholder="문서 이름으로 검색..."
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
          <div className="relative">
            <button
              className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <Filter size={16} />
              <span>
                {statusFilter === 'all' ? '모든 상태' :
                 statusFilter === 'completed' ? '완료된 문서' :
                 statusFilter === 'processing' ? '처리중 문서' : '실패한 문서'}
              </span>
              <span className="ml-1 text-gray-500">▼</span>
            </button>

            {isFilterOpen && (
              <div className="absolute z-10 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg py-1 right-0">
                <div
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${statusFilter === 'all' ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={() => {
                    setStatusFilter('all');
                    setIsFilterOpen(false);
                  }}
                >
                  모든 상태
                </div>
                <div
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${statusFilter === 'completed' ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={() => {
                    setStatusFilter('completed');
                    setIsFilterOpen(false);
                  }}
                >
                  완료된 문서
                </div>
                <div
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${statusFilter === 'processing' ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={() => {
                    setStatusFilter('processing');
                    setIsFilterOpen(false);
                  }}
                >
                  처리중 문서
                </div>
                <div
                  className={`px-4 py-2 cursor-pointer hover:bg-gray-100 ${statusFilter === 'failed' ? 'bg-blue-50 text-blue-700' : ''}`}
                  onClick={() => {
                    setStatusFilter('failed');
                    setIsFilterOpen(false);
                  }}
                >
                  실패한 문서
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {filteredDocuments.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    파일명
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    크기
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    업로드 날짜
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    상태
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    작업
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDocuments.map((doc, index) => (
                  <tr
                    key={doc.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getFileIcon(doc.name)}
                        <span className="text-sm font-medium text-gray-900 mr-2">{doc.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.size}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {doc.uploadDate}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <StatusBadge status={doc.status || 'completed'} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-3">
                        <button
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 hover:bg-blue-50 rounded"
                          title="문서 다운로드"
                        >
                          <ExternalLink size={18} />
                        </button>
                        <button
                          onClick={() => deleteDocument(doc.id)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1 hover:bg-red-50 rounded"
                          title="삭제"
                          disabled={doc.status === 'processing'}
                          style={{ opacity: doc.status === 'processing' ? 0.5 : 1, cursor: doc.status === 'processing' ? 'not-allowed' : 'pointer' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center bg-white rounded-xl shadow-md border border-gray-100">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <FileText size={36} className="text-gray-400" />
          </div>
          <p className="text-gray-600 mb-2 text-lg">
            {searchTerm || statusFilter !== 'all'
              ? '검색 조건에 맞는 문서가 없습니다'
              : '업로드된 문서가 없습니다'}
          </p>
          <p className="text-sm text-gray-500 max-w-md">
            {searchTerm || statusFilter !== 'all'
              ? '다른 검색어나 필터를 시도해보세요'
              : '봇이 참조할 문서를 업로드하여 더 정확한 정보를 제공할 수 있게 합니다.'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setFileUploadOpen(true)}
              className="mt-6 flex items-center px-6 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
            >
              <Upload size={18} className="mr-2" />
              문서 업로드
            </button>
          )}
        </div>
      )}

      <div className="mt-6 bg-blue-50 p-6 rounded-xl border border-blue-100">
        <div className="flex items-start">
          <Info size={24} className="text-blue-600 mr-4 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-blue-800 font-medium mb-2">
              문서 관리에 대한 안내
            </p>
            <ul className="list-disc text-sm text-blue-700 pl-5 space-y-1">
              <li>PDF, DOCX, TXT, CSV 파일 형식을 지원합니다</li>
              <li>최대 파일 크기는 50MB입니다</li>
              <li>업로드된 문서는 자동으로 색인화되어 AI 봇의 응답에 참조됩니다</li>
              <li>민감한 정보가 포함된 문서는 업로드하지 마세요</li>
              <li>처리중인 문서는 색인화가 완료되면 자동으로 상태가 업데이트됩니다</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsTab;