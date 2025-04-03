// src/pages/bots/components/modals/RegenerateKeyModal.js
import React from 'react';
import { AlertTriangle } from 'lucide-react';

const RegenerateKeyModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md mx-auto animate-scale-up">
        <div className="text-center">
          <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={36} className="text-amber-500" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">API 키 재생성 확인</h3>
          <p className="text-gray-600 mb-6">
            API 키를 재생성하면 기존 키는 무효화됩니다. 이 작업은 되돌릴 수 없습니다.
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
            className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg transition-colors font-medium shadow-sm"
          >
            재생성
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegenerateKeyModal;