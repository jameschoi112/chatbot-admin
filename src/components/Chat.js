import React, { useRef, useEffect, useState } from 'react';
import { Bot, X, MessageCircle, Send } from 'lucide-react';

// 샘플 메시지 데이터
const initialMessages = [
  { id: 1, text: '안녕하세요! ChatBot Admin 도우미입니다. 무엇을 도와드릴까요?', sender: 'bot', timestamp: new Date(Date.now() - 60000) },
];

const Chat = () => {
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isInputAnimating, setIsInputAnimating] = useState(false);

  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // 채팅창 스크롤을 항상 최신 메시지로 유지
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // 채팅창이 열릴 때 인풋에 포커스
  useEffect(() => {
    if (chatOpen && chatInputRef.current) {
      chatInputRef.current.focus();
    }
  }, [chatOpen]);

  // 채팅창 토글 함수
  const toggleChat = () => {
    setChatOpen(!chatOpen);
  };

  // 메시지 입력 이벤트 처리
  const handleMessageChange = (e) => {
    setNewMessage(e.target.value);
    if (!isInputAnimating && e.target.value) {
      setIsInputAnimating(true);
      // 입력 애니메이션을 잠시 후 종료
      setTimeout(() => setIsInputAnimating(false), 1000);
    }
  };

  // 메시지 전송 함수
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // 새 메시지 추가
    const userMessage = {
      id: messages.length + 1,
      text: newMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setNewMessage('');
    setIsLoading(true);

    // 봇 응답 타이핑 애니메이션 시작 (실제 API 구현 전까지 임시)
    setIsTyping(true);

    // 봇 응답 시뮬레이션 (실제 API 연결 시 이 부분 대체)
    setTimeout(() => {
      setIsTyping(false);
      setIsLoading(false);

      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(newMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
    }, 1500);
  };

  // 임시 봇 응답 생성 함수 (나중에 실제 API로 대체)
  const getBotResponse = (userInput) => {
    const lowercaseInput = userInput.toLowerCase();

    if (lowercaseInput.includes('안녕') || lowercaseInput.includes('hello')) {
      return '안녕하세요! 오늘은 어떤 도움이 필요하신가요?';
    } else if (lowercaseInput.includes('챗봇') || lowercaseInput.includes('봇')) {
      return '챗봇 관리에 관한 질문이신가요? 새 봇 생성은 "새 봇 만들기" 버튼을 클릭하시면 됩니다.';
    } else if (lowercaseInput.includes('문서') || lowercaseInput.includes('데이터')) {
      return '문서 관리는 사이드바의 "문서 관리" 메뉴에서 접근하실 수 있습니다.';
    } else if (lowercaseInput.includes('계정') || lowercaseInput.includes('비밀번호')) {
      return '계정 설정은 우측 상단의 프로필 드롭다운에서 "비밀번호 변경"을 클릭하시면 됩니다.';
    } else if (lowercaseInput.includes('요금') || lowercaseInput.includes('결제') || lowercaseInput.includes('가격')) {
      return '현재 무료 요금제를 사용 중이십니다. 프로 플랜으로 업그레이드하시면 더 많은 기능을 이용하실 수 있습니다.';
    } else {
      return '죄송합니다. 질문을 이해하지 못했습니다. 다른 방식으로 질문해 주시겠어요?';
    }
  };

  // 시간 포맷팅 함수
  const formatMessageTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* 채팅 아이콘 (우측 하단 고정) */}
      <button
        onClick={toggleChat}
        className={`fixed bottom-6 right-6 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 z-40 ${
          chatOpen ? 'bg-red-500 hover:bg-red-600' : 'bg-sky-500 hover:bg-sky-600'
        }`}
      >
        {chatOpen ? <X size={24} className="text-white" /> : <MessageCircle size={24} className="text-white" />}
      </button>

      {/* 채팅창 */}
      <div
        className={`fixed bottom-24 right-6 w-96 bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform ${
          chatOpen ? 'scale-100 opacity-100' : 'scale-90 opacity-0 pointer-events-none'
        }`}
        style={{ zIndex: 50, maxHeight: '600px' }}
      >
        {/* 채팅창 헤더 */}
        <div className="bg-gradient-to-r from-blue-800 to-sky-700 text-white p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Bot size={20} className="mr-2" />
            <h3 className="font-semibold">ChatBot 도우미</h3>
          </div>
          <button onClick={toggleChat} className="text-white hover:text-gray-200 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* 채팅 메시지 영역 */}
        <div className="p-4 h-96 overflow-y-auto bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${message.sender === 'user' ? 'animate-fadeLeftIn' : 'animate-fadeRightIn'}`}
            >
              <div className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[80%] p-3 rounded-lg ${
                    message.sender === 'user'
                      ? 'bg-sky-500 text-white rounded-tr-none shadow-md'
                      : 'bg-white text-gray-800 shadow-md rounded-tl-none'
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.text}</p>
                  <span className={`text-xs mt-2 block text-right ${message.sender === 'user' ? 'text-sky-100' : 'text-gray-500'}`}>
                    {formatMessageTime(message.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}

          {/* 타이핑 애니메이션 */}
          {isTyping && (
            <div className="mb-4 animate-fadeRightIn">
              <div className="flex justify-start">
                <div className="bg-white p-4 rounded-lg shadow-md rounded-tl-none max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-sky-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 입력 중 애니메이션 */}
          {isInputAnimating && (
            <div className="flex justify-end mb-1">
              <div className="text-xs text-gray-500 italic pr-2 animate-pulse">
                입력 중...
              </div>
            </div>
          )}

          {/* 자동 스크롤을 위한 참조 요소 */}
          <div ref={messagesEndRef}></div>
        </div>

        {/* 메시지 입력 영역 */}
        <form onSubmit={sendMessage} className="p-4 bg-white border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              ref={chatInputRef}
              value={newMessage}
              onChange={handleMessageChange}
              placeholder="메시지를 입력하세요..."
              className="flex-1 border border-gray-300 rounded-lg py-3 px-4 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent text-sm"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !newMessage.trim()}
              className={`bg-sky-500 hover:bg-sky-600 text-white p-3 rounded-lg transition-colors ${
                (isLoading || !newMessage.trim()) ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;