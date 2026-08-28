import React from 'react';
import { useGameStore } from '@/game/store';
import { clients } from '@/game/clients';
import { Send } from 'lucide-react';

const ChatApp: React.FC = () => {
  const chatMessages = useGameStore(s => s.chatMessages);
  const [activeChat, setActiveChat] = React.useState<string | null>(null);
  const [inputText, setInputText] = React.useState('');
  const messagesEndRef = React.useRef<HTMLDivElement>(null);
  
  const chatClients = Object.keys(chatMessages).filter(k => chatMessages[k].length > 0);
  const messages = activeChat ? chatMessages[activeChat] || [] : [];
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);
  
  const handleSend = () => {
    if (!inputText.trim() || !activeChat) return;
    // Player messages are cosmetic in Act I
    const store = useGameStore.getState();
    const newMsg = {
      id: `msg-${Date.now()}`,
      from: 'You',
      avatar: '👤',
      message: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isPlayer: true,
    };
    store.addChatMessage(activeChat, newMsg);
    setInputText('');
  };
  
  if (!activeChat) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b border-border px-4 py-3">
          <h2 className="text-sm font-semibold text-foreground">Messages</h2>
          <p className="text-xs text-muted-foreground">{chatClients.length} conversations</p>
        </div>
        <div className="flex-1 overflow-auto harbor-scrollbar">
          {chatClients.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
              <div className="text-center space-y-2">
                <div className="text-3xl opacity-40">💬</div>
                <p>No messages yet</p>
                <p className="text-xs text-muted-foreground/60">Clients will message you here for quick feedback</p>
              </div>
            </div>
          ) : (
            chatClients.map(clientId => {
              const client = clients[clientId];
              const lastMsg = chatMessages[clientId]?.[chatMessages[clientId].length - 1];
              if (!client) return null;
              
              return (
                <button
                  key={clientId}
                  onClick={() => setActiveChat(clientId)}
                  className="w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex items-center gap-3"
                >
                  <span className="text-2xl">{client.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <span className="text-sm font-medium text-foreground">{client.name}</span>
                    {lastMsg && (
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {lastMsg.isPlayer ? 'You: ' : ''}{lastMsg.message}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-muted-foreground">{lastMsg?.timestamp}</span>
                </button>
              );
            })
          )}
        </div>
      </div>
    );
  }
  
  const client = clients[activeChat];
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-2.5 flex items-center gap-3">
        <button onClick={() => setActiveChat(null)} className="text-muted-foreground hover:text-foreground text-xs">
          ←
        </button>
        <span className="text-lg">{client?.avatar}</span>
        <div>
          <p className="text-sm font-medium text-foreground">{client?.name}</p>
          <p className="text-[10px] text-muted-foreground">{client?.role}</p>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 overflow-auto p-4 space-y-3 harbor-scrollbar">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isPlayer ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
              msg.isPlayer
                ? 'bg-primary text-primary-foreground rounded-br-md'
                : 'bg-muted text-foreground rounded-bl-md'
            }`}>
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input */}
      <div className="border-t border-border p-3 flex items-center gap-2">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend()}
          placeholder="Type a message..."
          className="flex-1 text-sm bg-muted/50 border border-border rounded-full px-4 py-2 outline-none focus:border-primary/50 text-foreground placeholder:text-muted-foreground"
        />
        <button
          onClick={handleSend}
          className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:brightness-110 transition-all"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
};

export default ChatApp;
