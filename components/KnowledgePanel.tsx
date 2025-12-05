import React from 'react';
import { DatabaseIcon, ClearIcon } from './Icon';

interface KnowledgePanelProps {
  content: string;
  onChange: (value: string) => void;
}

export const KnowledgePanel: React.FC<KnowledgePanelProps> = ({ content, onChange }) => {
  return (
    <div className="flex flex-col h-full glass-panel rounded-xl overflow-hidden shadow-2xl">
      <div className="bg-slate-800/80 p-4 border-b border-slate-700 flex justify-between items-center">
        <div className="flex items-center gap-2 text-emerald-400">
          <DatabaseIcon />
          <h2 className="font-bold text-lg tracking-wide">Base de Connaissances</h2>
        </div>
        <button 
            onClick={() => onChange('')}
            className="text-xs flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors"
            title="Effacer tout"
        >
            <ClearIcon /> Effacer
        </button>
      </div>
      
      <div className="flex-1 relative bg-slate-900/50">
        <textarea
          className="w-full h-full p-4 bg-transparent text-slate-300 text-sm font-mono resize-none focus:outline-none focus:bg-slate-800/30 transition-colors custom-scrollbar"
          value={content}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Collez ici les informations que Rafiq-AI doit connaître (FAQ, Services, À propos...)..."
          spellCheck={false}
        />
        <div className="absolute bottom-2 right-2 text-xs text-slate-500 pointer-events-none">
          {content.length} caractères
        </div>
      </div>
      <div className="p-3 bg-slate-800/80 border-t border-slate-700 text-xs text-slate-400 text-center">
        Rafiq-AI analyse ce texte en temps réel pour ses réponses.
      </div>
    </div>
  );
};