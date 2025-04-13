
import { useState, useEffect } from "react";
import { MessageCircle, X, Send, Minimize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const ChatBox = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [message, setMessage] = useState("");

  // Mock messages
  const [messages, setMessages] = useState([
    { id: 1, text: "Chào bạn! Chúng tôi có thể giúp gì cho bạn?", isUser: false },
  ]);

  const toggleChatbox = () => {
    setIsOpen(!isOpen);
    if (isMinimized) setIsMinimized(false);
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setMessages([...messages, { id: Date.now(), text: message, isUser: true }]);
    setMessage("");

    // Mock response after delay
    setTimeout(() => {
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          id: Date.now() + 1,
          text: "Cảm ơn bạn đã liên hệ. Chúng tôi sẽ phản hồi sớm nhất có thể!",
          isUser: false,
        },
      ]);
    }, 1000);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={toggleChatbox}
          className="w-14 h-14 rounded-full bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark shadow-lg flex items-center justify-center animate-pulse-soft"
        >
          <MessageCircle size={24} />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className={`bg-white rounded-2xl shadow-xl overflow-hidden transition-all duration-300 ease-in-out card-3d ${
            isMinimized ? "w-64 h-12" : "w-80 sm:w-96"
          }`}
        >
          {/* Chat Header */}
          <div className="bg-dtktmt-blue-medium text-white p-3 flex justify-between items-center">
            {isMinimized ? (
              <span className="font-medium">Hỗ trợ trực tuyến</span>
            ) : (
              <div className="flex items-center gap-2">
                <div className="bg-white rounded-full p-1">
                  <MessageCircle size={18} className="text-dtktmt-blue-medium" />
                </div>
                <span className="font-medium">Hỗ trợ trực tuyến</span>
              </div>
            )}
            <div className="flex gap-2">
              <button onClick={toggleMinimize} className="hover:text-dtktmt-blue-light">
                {isMinimized ? (
                  <MessageCircle size={16} />
                ) : (
                  <Minimize size={16} />
                )}
              </button>
              <button onClick={toggleChatbox} className="hover:text-dtktmt-blue-light">
                <X size={16} />
              </button>
            </div>
          </div>

          {!isMinimized && (
            <>
              {/* Chat Messages */}
              <div className="p-3 max-h-80 overflow-y-auto bg-dtktmt-blue-light/10">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`mb-3 max-w-[85%] ${
                      msg.isUser ? "ml-auto" : "mr-auto"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-2xl ${
                        msg.isUser
                          ? "bg-dtktmt-blue-medium text-white rounded-br-none"
                          : "bg-gray-100 text-gray-800 rounded-bl-none"
                      }`}
                    >
                      {msg.text}
                    </div>
                    <div
                      className={`text-xs mt-1 text-gray-500 ${
                        msg.isUser ? "text-right" : "text-left"
                      }`}
                    >
                      {new Date().toLocaleTimeString().slice(0, 5)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <form onSubmit={handleSend} className="p-3 border-t flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  className="flex-1 border-dtktmt-blue-light"
                />
                <Button type="submit" className="bg-dtktmt-blue-medium hover:bg-dtktmt-blue-dark">
                  <Send size={18} />
                </Button>
              </form>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatBox;
