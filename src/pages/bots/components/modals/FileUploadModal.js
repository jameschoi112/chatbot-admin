// src/pages/bots/components/modals/FileUploadModal.js
import React from 'react';
import { Upload, X, Info } from 'lucide-react';

const FileUploadModal = ({ isOpen, onClose, onUpload }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-lg mx-auto animate-scale-up w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center">
            <Upload size={20} className="text-blue-500 mr-2" />
            문서 업로드
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={onUpload} className="space-y-6">
          <div className="mt-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              파일 선택
            </label>
            <div className="flex justify-center px-6 pt-8 pb-8 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors">
              <div className="space-y-3 text-center">
                <Upload size={36} className="mx-auto text-gray-400" />
                <div className="flex text-sm text-gray-600 justify-center">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                  >
                    <span>파일 선택</span>
                    <input id="file-upload" name="file-upload" type="file" className="sr-only" />
                  </label>
                  <p className="pl-1">또는 여기로 파일을 끌어오세요</p>
                </div>
                <p className="text-xs text-gray-500">
                  PDF, DOCX, TXT, CSV 파일 (최대 50MB)
                </p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <div className="flex">
              <Info size={18} className="text-blue-600 mr-2 flex-shrink-0" />
              <div className="text-sm text-blue-700">
                <p>
                  업로드된 문서는 봇의 지식베이스에 추가되어 더 정확한 응답을 제공합니다.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg shadow-sm transition-colors flex items-center"
            >
              <Upload size={18} className="mr-2" />
              업로드
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FileUploadModal;