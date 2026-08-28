import React from 'react';
import { useGameStore } from '@/game/store';
import { ForumPost } from '@/game/types';
import { ArrowLeft, MessageCircle, Briefcase, Sparkles, Bug } from 'lucide-react';

const typeIcons: Record<string, React.ReactNode> = {
  gig: <Briefcase size={14} className="text-harbor-ocean" />,
  discussion: <MessageCircle size={14} className="text-muted-foreground" />,
  weird: <Sparkles size={14} className="text-harbor-gold" />,
  'easter-egg': <Bug size={14} className="text-harbor-seafoam" />,
};

const typeLabels: Record<string, string> = {
  gig: 'Gig',
  discussion: 'Discussion',
  weird: 'Weird Request',
  'easter-egg': 'Community',
};

const ForumApp: React.FC = () => {
  const forumPosts = useGameStore(s => s.forumPosts);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<string>('all');
  
  const selected = forumPosts.find(p => p.id === selectedId);
  const filteredPosts = filter === 'all' ? forumPosts : forumPosts.filter(p => p.type === filter);
  
  if (selected) {
    return (
      <div className="h-full flex flex-col">
        <div className="border-b border-border px-4 py-3 flex items-center gap-3">
          <button onClick={() => setSelectedId(null)} className="text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft size={16} />
          </button>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-foreground">{selected.title}</h3>
            <p className="text-xs text-muted-foreground">by {selected.author}</p>
          </div>
        </div>
        
        <div className="flex-1 p-6 overflow-auto harbor-scrollbar">
          <div className="flex items-center gap-2 mb-4">
            {typeIcons[selected.type]}
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{typeLabels[selected.type]}</span>
          </div>
          
          <div className="whitespace-pre-wrap text-sm text-foreground leading-relaxed max-w-lg">
            {selected.body}
          </div>
          
          {selected.reward && (
            <div className="mt-6 p-3 rounded-lg bg-harbor-sand-light border border-harbor-sand">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">Reward</p>
              <p className="text-sm font-medium text-foreground">{selected.reward}</p>
            </div>
          )}
          
          {/* Easter egg detection - show hidden codes in HTML comments */}
          {selected.body.includes('<!--') && (
            <div className="mt-4 p-3 rounded-lg bg-editor-bg border border-[hsl(220,15%,20%)]">
              <p className="text-[10px] uppercase tracking-wider text-editor-gutter mb-1">Source</p>
              <pre className="text-xs text-editor-fg font-mono">
                {selected.body.match(/<!--[\s\S]*?-->/)?.[0] || ''}
              </pre>
            </div>
          )}
        </div>
        
        <div className="border-t border-border p-4">
          {selected.type === 'gig' && !selected.accepted && (
            <button className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all opacity-50 cursor-not-allowed">
              Accept Gig (Coming in Act II)
            </button>
          )}
          {selected.type !== 'gig' && (
            <p className="text-xs text-muted-foreground italic">Community post — no action needed</p>
          )}
        </div>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col">
      <div className="border-b border-border px-4 py-3">
        <h2 className="text-sm font-semibold text-foreground">⚓ Seabrook Board</h2>
        <p className="text-xs text-muted-foreground">Community forum & job board</p>
      </div>
      
      {/* Filter tabs */}
      <div className="border-b border-border px-4 py-2 flex items-center gap-2">
        {[
          { key: 'all', label: 'All' },
          { key: 'gig', label: '💼 Gigs' },
          { key: 'weird', label: '✨ Weird' },
          { key: 'easter-egg', label: '🔍 Community' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`text-[11px] px-2.5 py-1 rounded-full transition-colors ${
              filter === tab.key
                ? 'bg-primary/10 text-primary font-medium'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      
      <div className="flex-1 overflow-auto harbor-scrollbar">
        {filteredPosts.map(post => (
          <button
            key={post.id}
            onClick={() => setSelectedId(post.id)}
            className="w-full text-left px-4 py-3 border-b border-border/50 hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-2 mb-1">
              {typeIcons[post.type]}
              <span className="text-[10px] text-muted-foreground">{post.author}</span>
              {post.reward && <span className="text-[10px] text-harbor-gold ml-auto">reward</span>}
            </div>
            <p className="text-sm font-medium text-foreground">{post.title}</p>
            <p className="text-xs text-muted-foreground truncate mt-0.5">{post.body.slice(0, 80)}...</p>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ForumApp;
