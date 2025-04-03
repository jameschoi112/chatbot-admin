// src/pages/bots/components/modals/DeleteConfirmModal.js
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, botName }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-auto animate-scale-up">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">봇 삭제 확인</h3>
          <p className="text-gray-600 mb-6">
            '{botName}' 봇을 정말 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.
          </p>
        </div>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-gray-700 font-medium"
          >
            취소
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;