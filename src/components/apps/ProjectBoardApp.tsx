import React from 'react';
import { useGameStore } from '@/game/store';
import { getLevelById } from '@/game/levels';
import { clients } from '@/game/clients';
import { getTierLabel } from '@/game/evaluation';

const statusColumns = [
  { key: 'new', label: '📥 New Requests', color: 'hsl(var(--harbor-ocean))' },
  { key: 'in_progress', label: '🛠 In Progress', color: 'hsl(var(--harbor-gold))' },
  { key: 'needs_revision', label: '🔍 Needs Revision', color: 'hsl(var(--harbor-sunset))' },
  { key: 'completed', label: '✅ Completed', color: 'hsl(130, 55%, 50%)' },
] as const;

const ProjectBoardApp: React.FC = () => {
  const activeProjects = useGameStore(s => s.activeProjects);
  const startEditing = useGameStore(s => s.startEditing);
  const projectsCompleted = useGameStore(s => s.projectsCompleted);
  
  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="border-b border-border px-4 py-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-foreground">Project Board</h2>
          <p className="text-xs text-muted-foreground">{projectsCompleted} projects completed</p>
        </div>
      </div>
      
      {/* Kanban columns */}
      <div className="flex-1 flex overflow-x-auto p-3 gap-3 harbor-scrollbar">
        {statusColumns.map(col => {
          const projects = activeProjects.filter(p => p.status === col.key);
          
          return (
            <div key={col.key} className="w-56 shrink-0 flex flex-col">
              <div className="flex items-center gap-2 mb-2 px-1">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: col.color }} />
                <span className="text-xs font-semibold text-foreground">{col.label}</span>
                <span className="text-[10px] text-muted-foreground ml-auto">{projects.length}</span>
              </div>
              
              <div className="flex-1 space-y-2 overflow-y-auto harbor-scrollbar">
                {projects.map(project => {
                  const level = getLevelById(project.levelId);
                  const client = level ? clients[level.clientId] : null;
                  if (!level || !client) return null;
                  
                  return (
                    <div
                      key={project.levelId}
                      className="bg-card rounded-lg border border-border p-3 hover:shadow-md transition-shadow cursor-pointer"
                      onClick={() => startEditing(project.levelId)}
                    >
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="text-sm">{client.avatar}</span>
                        <span className="text-xs font-medium text-foreground truncate">{client.name}</span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{level.title}</p>
                      
                      {/* Requirements progress */}
                      <div className="mt-2 flex items-center gap-1">
                        {level.requirements.filter(r => r.type === 'required').map(req => (
                          <div
                            key={req.id}
                            className={`w-1.5 h-1.5 rounded-full ${
                              req.check(project.code) ? 'bg-[hsl(130,55%,50%)]' : 'bg-border'
                            }`}
                          />
                        ))}
                      </div>
                      
                      {/* Score if completed */}
                      {project.score && (
                        <div className="mt-2 text-[10px] text-muted-foreground">
                          {getTierLabel(project.score.tier)}
                        </div>
                      )}
                    </div>
                  );
                })}
                
                {projects.length === 0 && (
                  <div className="text-[11px] text-muted-foreground/50 text-center py-4">
                    No projects
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProjectBoardApp;
