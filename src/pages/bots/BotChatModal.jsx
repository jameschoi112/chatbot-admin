import React, { useState, useEffect, useRef } from 'react';
import { X, Send, Bot, Settings, Mic, Paperclip, Maximize2, Minimize2 } from 'lucide-react';

const BotChatModal = ({ isOpen, onClose, bot }) => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'bot', text: `안녕하세요! ${bot?.name || 'ChatBot'} 입니다. 무엇을 도와드릴까요?`, timestamp: new Date() }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // 모달이 열릴 때마다 초기화
  useEffect(() => {
    if (isOpen) {
      setMessages([
        { id: 1, sender: 'bot', text: `안녕하세요! ${bot?.name || 'ChatBot'} 입니다. 무엇을 도와드릴까요?`, timestamp: new Date() }
      ]);
      setInputMessage('');
      setIsTyping(false);

      // 모달 열릴 때 input에 포커스
      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100);
    }
  }, [isOpen, bot]);

  // 새 메시지가 추가될 때마다 스크롤을 아래로 이동
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ESC 키로 모달 닫기
  useEffect(() => {
    if (!isOpen) return;

    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  // 메시지 전송 함수
  const sendMessage = (e) => {
    e?.preventDefault();

    if (!inputMessage.trim()) return;

    // 사용자 메시지 추가
    const userMsg = {
      id: Date.now(),
      sender: 'user',
      text: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    // 봇 응답 시뮬레이션 (실제로는 API 호출할 것)
    setTimeout(() => {
      const botResponses = [
        "네, 어떻게 도와드릴까요?",
        "더 자세한 정보가 필요할 것 같습니다.",
        "확인해 보겠습니다. 잠시만 기다려주세요.",
        "죄송합니다만, 그 부분은 제 지식 범위를 벗어납니다.",
        `${bot?.name || 'ChatBot'}이 도와드리겠습니다!`,
        "아직 답변을 생성 중입니다. 조금만 기다려주세요.",
        "제가 이해한 내용이 맞는지 확인하고 싶습니다.",
        "다음 단계로 진행하려면 어떤 정보가 필요하신가요?",
      ];

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      // 봇 메시지 추가
      const botMsg = {
        id: Date.now(),
        sender: 'bot',
        text: randomResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botMsg]);
      setIsTyping(false);
    }, 1500);
  };

  // 타임스탬프 포맷팅
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // 모달이 닫혔으면 렌더링 안 함
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
      <div
        className={`bg-white rounded-xl shadow-2xl overflow-hidden transition-all duration-300 animate-scale-up max-h-[90vh] relative ${
          expanded ? 'w-5/6 h-[90vh]' : 'w-96 h-[600px]'
        }`}
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-sky-600 to-blue-700 text-white py-3 px-4 flex justify-between items-center">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center mr-3">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-semibold">{bot?.name || '봇 이름'}</h3>
              <p className="text-xs text-white/70">온라인</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title={expanded ? "작게 보기" : "크게 보기"}
            >
              {expanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
            </button>
            <button
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title="설정"
            >
              <Settings size={18} />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 hover:bg-white/10 rounded-full transition-colors"
              title="닫기"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* 대화 영역 */}
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50 h-[calc(100%-64px-60px)]">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                    message.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-tr-none animate-fadeLeftIn'
                      : 'bg-white shadow-sm border border-gray-100 rounded-tl-none animate-fadeRightIn'
                  }`}
                >
                  <div className="text-sm">{message.text}</div>
                  <div className={`text-xs mt-1 text-right ${
                    message.sender === 'user' ? 'text-sky-100' : 'text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            ))}

            {/* 타이핑 표시기 */}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn">
                <div className="bg-white rounded-2xl px-4 py-3 shadow-sm border border-gray-100 rounded-tl-none">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 rounded-full bg-sky-500 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* 자동 스크롤을 위한 참조점 */}
            <div ref={messagesEndRef}></div>
          </div>
        </div>

        {/* 입력 영역 */}
        <form
          onSubmit={sendMessage}
          className="border-t border-gray-200 p-3 bg-white flex items-center"
        >
          <button
            type="button"
            className="p-2 text-gray-500 hover:text-sky-500 rounded-full hover:bg-gray-100 transition-colors"
            title="파일 첨부"
          >
            <Paperclip size={20} />
          </button>

          <input
            type="text"
            ref={inputRef}
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="메시지 입력..."
            className="flex-1 py-2 px-3 outline-none bg-gray-50 rounded-lg mx-2 text-sm"
          />

          <button
            type="button"
            className="p-2 text-gray-500 hover:text-sky-500 rounded-full hover:bg-gray-100 transition-colors mr-1"
            title="음성 입력"
          >
            <Mic size={20} />
          </button>

          <button
            type="submit"
            disabled={!inputMessage.trim()}
            className={`p-3 rounded-full transition-colors ${
              inputMessage.trim()
                ? 'bg-sky-500 text-white hover:bg-sky-600'
                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
            }`}
            title="메시지 보내기"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default BotChatModal;