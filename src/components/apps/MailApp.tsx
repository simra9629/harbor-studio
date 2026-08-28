import React from 'react';
import { useGameStore } from '@/game/store';
import { clients } from '@/game/clients';
import { getLevelById } from '@/game/levels';
import { Mail, MailOpen, ArrowLeft } from 'lucide-react';

const MailApp: React.FC = () => {
  const emails = useGameStore(s => s.emails);
  const markEmailRead = useGameStore(s => s.markEmailRead);
  const acceptProject = useGameStore(s => s.acceptProject);
  const activeProjects = useGameStore(s => s.activeProjects);
  const openApp = useGameStore(s => s.openApp);
  const startEditing = useGameStore(s => s.startEditing);
  const [selectedEmail, setSelectedEmail] = React.useState<string | null>(null);
  
  const selected = emails.find(e => e.id === selectedEmail);
  const level = selected ? getLevelById(selected.levelId) : null;
  const isAccepted = selected ? activeProjects.some(p => p.levelId === selected.levelId) : false;
  
  const handleSelect = (emailId: string) => {
    setSelectedEmail(emailId);
    markEmailRead(emailId);
  };
  
  const handleAccept = () => {
    if (!selected) return;
    acceptProject(selected.levelId);
  };
  
  const handleStartWork = () => {
    if (!selected) return;
    startEditing(selected.levelId);
  };
  
  if (selected) {
    return (
      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedEmail(null)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">{selected.subject}</h3>
            <p className="text-xs text-muted-foreground">{selected.from}</p>
          </div>
        </div>
        
        {/* Body */}
        <div className="flex-1 p-6 overflow-auto harbor-scrollbar">
          <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed max-w-lg">
            {selected.body}
          </div>
          
          {level && (
            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Concepts</h4>
              <div className="flex flex-wrap gap-2">
                {level.concepts.map(c => (
                  <span key={c} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">{c}</span>
                ))}
              </div>
            </div>
          )}
        </div>
        
        {/* Actions */}
        <div className="border-t border-border p-4 flex gap-3">
          {!isAccepted ? (
            <button
              onClick={handleAccept}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
            >
              Accept Project
            </button>
          ) : (
            <button
              onClick={handleStartWork}
              className="px-4 py-2 rounded-lg bg-harbor-ocean text-primary-foreground text-sm font-medium hover:brightness-110 transition-all"
            >
              Open in Editor →
            </button>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">Inbox</h2>
        <p className="text-xs text-muted-foreground">{emails.filter(e => !e.read).length} unread</p>
      </div>
      
      <div className="flex-1 overflow-auto harbor-scrollbar">
        {emails.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
            No emails yet
          </div>
        ) : (
          emails.map(email => (
            <button
              key={email.id}
              onClick={() => handleSelect(email.id)}
              className={`w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors flex items-start gap-3 ${
                !email.read ? 'bg-primary/5' : ''
              }`}
            >
              <div className="mt-0.5 text-muted-foreground">
                {email.read ? <MailOpen size={16} /> : <Mail size={16} className="text-primary" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={`text-sm truncate ${!email.read ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>
                    {email.from}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0 ml-2">{email.timestamp}</span>
                </div>
                <p className={`text-xs truncate mt-0.5 ${!email.read ? 'font-medium text-foreground' : 'text-muted-foreground'}`}>
                  {email.subject}
                </p>
              </div>
              {!email.read && (
                <div className="w-2 h-2 rounded-full bg-primary shrink-0 mt-1.5" />
              )}
            </button>
          ))
        )}
      </div>
    </div>
  );
};

export default MailApp;
