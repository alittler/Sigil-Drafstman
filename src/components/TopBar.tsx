import React from 'react';
import { Download } from 'lucide-react';

export type ActiveWorkspaceView = 'workbench' | 'library' | 'guide';

interface TopBarProps {
  activeView: ActiveWorkspaceView;
  onSelectView: (view: ActiveWorkspaceView) => void;
  onOpenExport: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activeView,
  onSelectView,
  onOpenExport,
}) => {
  const navItems: Array<{ id: ActiveWorkspaceView; label: string }> = [
    { id: 'workbench', label: 'Workbench' },
    { id: 'library', label: 'Saved Library' },
    { id: 'guide', label: 'Symbol Guide' },
  ];

  return (
    <header className="w-full bg-[#FFFFFF] border-b border-[#E2DFD7] px-6 h-16 flex items-center justify-between gap-8">
      {/* Zone 1: Single-element wordmark */}
      <button
        type="button"
        onClick={() => onSelectView('workbench')}
        className="font-display text-xl font-semibold tracking-tight text-[#111315] whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8]"
      >
        Sigil Draftsman
      </button>

      {/* Zone 2: Concise single-line navigation links */}
      <nav aria-label="Primary navigation" className="flex items-center gap-6 overflow-x-auto">
        {navItems.map((item) => {
          const isActive = activeView === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectView(item.id)}
              className={`relative py-1 text-sm font-medium whitespace-nowrap shrink-0 transition-colors duration-150 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1D4ED8] ${
                isActive
                  ? 'text-[#111315]'
                  : 'text-[#4B4F56] hover:text-[#111315]'
              }`}
            >
              {item.label}
              {isActive && (
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 -bottom-[1px] h-[2px] bg-[#1D4ED8]"
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Zone 3: Primary action */}
      <div className="flex items-center shrink-0">
        <button
          type="button"
          onClick={onOpenExport}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#FFFFFF] bg-[#111315] hover:bg-[#1D4ED8] rounded-md transition-colors duration-150 whitespace-nowrap shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1D4ED8]"
        >
          <Download className="w-4 h-4" aria-hidden="true" />
          <span>Export</span>
        </button>
      </div>
    </header>
  );
};
