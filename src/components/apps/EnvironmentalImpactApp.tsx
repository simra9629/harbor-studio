import React from 'react';
import { useGameStore } from '@/game/store';
import { getLevelById } from '@/game/levels';
import { clients } from '@/game/clients';
import { MapPin, TrendingUp, Star, ArrowRight } from 'lucide-react';

const EnvironmentalImpactApp: React.FC = () => {
  const completedLevels = useGameStore(s => s.completedLevels);
  const activeProjects = useGameStore(s => s.activeProjects);
  const townBuildings = useGameStore(s => s.townBuildings);
  const projectsCompleted = useGameStore(s => s.projectsCompleted);
  const closeWindow = useGameStore(s => s.closeWindow);
  const windows = useGameStore(s => s.windows);

  // Get last completed project
  const lastCompleted = completedLevels[completedLevels.length - 1];
  const lastLevel = lastCompleted ? getLevelById(lastCompleted) : null;
  const lastClient = lastLevel ? clients[lastLevel.clientId] : null;
  const lastProject = activeProjects.find(p => p.levelId === lastCompleted);
  const impactWindow = windows.find(w => w.appId === 'impact' as any);

  const completedBusinesses = Object.values(townBuildings).filter(b => b.completed).length;
  const totalBuildings = Object.keys(townBuildings).length;

  const impacts = [
    { label: 'Websites Built', value: projectsCompleted, icon: '🌐' },
    { label: 'Businesses Digitized', value: completedBusinesses, total: totalBuildings, icon: '🏪' },
    { label: 'Harbor Row Progress', value: Math.round((completedBusinesses / Math.max(totalBuildings, 1)) * 100), suffix: '%', icon: '📈' },
  ];

  const handleContinue = () => {
    const iw = windows.find(w => w.appId === 'impact');
    if (iw) closeWindow(iw.id);
  };

  return (
    <div className="h-full flex flex-col items-center justify-center p-8"
      style={{ background: 'linear-gradient(135deg, hsl(210, 30%, 96%) 0%, hsl(35, 30%, 93%) 100%)' }}>
      <div className="max-w-md w-full space-y-6 text-center">
        {/* Header */}
        <div className="space-y-2">
          <MapPin size={28} className="text-primary mx-auto" />
          <h2 className="text-lg font-semibold text-foreground">Town Impact</h2>
          {lastClient && lastLevel && (
            <p className="text-sm text-muted-foreground">
              {lastClient.avatar} {lastClient.name} · {lastLevel.title.split('—')[1]?.trim() || lastLevel.title}
            </p>
          )}
        </div>

        {/* Score summary */}
        {lastProject?.score && (
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Precision', value: lastProject.score.precision, color: 'hsl(210, 80%, 65%)' },
              { label: 'Creativity', value: lastProject.score.creativity, color: 'hsl(35, 75%, 60%)' },
              { label: 'Professional', value: lastProject.score.professionalism, color: 'hsl(165, 50%, 55%)' },
            ].map(stat => (
              <div key={stat.label} className="bg-card rounded-lg p-3 border border-border">
                <div className="text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
                <div className="text-[10px] text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Environmental impacts */}
        <div className="space-y-3">
          {impacts.map(impact => (
            <div key={impact.label} className="flex items-center gap-3 bg-card rounded-lg p-3 border border-border">
              <span className="text-xl">{impact.icon}</span>
              <div className="flex-1 text-left">
                <p className="text-xs text-muted-foreground">{impact.label}</p>
                <p className="text-sm font-semibold text-foreground">
                  {impact.value}{impact.suffix || ''}{impact.total ? ` / ${impact.total}` : ''}
                </p>
              </div>
              <TrendingUp size={14} className="text-primary" />
            </div>
          ))}
        </div>

        {/* What changed */}
        <div className="bg-card/50 rounded-lg p-4 border border-border text-left">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">What Changed</p>
          <ul className="space-y-1.5 text-sm text-foreground">
            {lastClient && <li className="flex items-center gap-2"><Star size={12} className="text-[hsl(var(--harbor-gold))]" /> {lastClient.name}'s storefront is now glowing on the map</li>}
            <li className="flex items-center gap-2"><Star size={12} className="text-[hsl(var(--harbor-gold))]" /> Harbor Row grows stronger</li>
            {projectsCompleted >= 3 && <li className="flex items-center gap-2"><Star size={12} className="text-[hsl(var(--harbor-gold))]" /> Seabrook Board is now available</li>}
          </ul>
        </div>

        <button onClick={handleContinue}
          className="px-6 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:brightness-110 transition-all flex items-center gap-2 mx-auto">
          Continue <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default EnvironmentalImpactApp;
