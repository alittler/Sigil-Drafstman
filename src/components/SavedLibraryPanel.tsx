import React, { useState } from 'react';
import { BookmarkPlus, Copy, Trash2 } from 'lucide-react';
import type { SavedSigilRecord } from '../types/sigil';
import {
  applyManualOverrides,
  DEFAULT_LAYER_VISIBILITY,
  deriveSigilFromText,
  ELEMENT_LABELS,
} from '../engine/sigilEngine';
import { SigilSvg } from './SigilSvg';

interface SavedLibraryPanelProps {
  records: SavedSigilRecord[];
  currentText: string;
  onSaveCurrent: (title: string, notes: string) => void;
  onLoadRecord: (record: SavedSigilRecord) => void;
  onDuplicateRecord: (record: SavedSigilRecord) => void;
  onDeleteRecord: (id: string) => void;
  layout?: 'sidebar' | 'full';
}

export const SavedLibraryPanel: React.FC<SavedLibraryPanelProps> = ({
  records,
  currentText,
  onSaveCurrent,
  onLoadRecord,
  onDuplicateRecord,
  onDeleteRecord,
  layout = 'sidebar',
}) => {
  const [title, setTitle] = useState('');
  const [notes, setNotes] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const resolvedTitle = title.trim() || currentText.trim() || 'Untitled Sigil';
    onSaveCurrent(resolvedTitle, notes.trim());
    setTitle('');
    setNotes('');
    setSavedNotice(true);
    window.setTimeout(() => setSavedNotice(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Save Current Draft Form */}
      <form onSubmit={handleSave} className="space-y-3 pb-5 border-b border-[#E2DFD7]">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#111315]">Save Current Draft</h2>
          {savedNotice && (
            <span className="text-xs font-medium text-[#1D4ED8]">Saved to browser library</span>
          )}
        </div>
        <div className="space-y-2">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={currentText.trim() ? `Title (defaults to "${currentText.trim()}")` : 'Sigil title'}
            className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#E2DFD7] rounded text-[#111315] placeholder-[#767A82] focus:outline-none focus:border-[#1D4ED8]"
          />
          <input
            type="text"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Optional drafting notes or intention..."
            className="w-full px-3 py-2 text-xs bg-[#FFFFFF] border border-[#E2DFD7] rounded text-[#111315] placeholder-[#767A82] focus:outline-none focus:border-[#1D4ED8]"
          />
        </div>
        <button
          type="submit"
          className="w-full inline-flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-[#FFFFFF] bg-[#111315] hover:bg-[#1D4ED8] rounded transition-colors cursor-pointer whitespace-nowrap"
        >
          <BookmarkPlus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>Save Sigil to Library</span>
        </button>
      </form>

      {/* Saved Collection */}
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-[#4B4F56]">
            Stored Sigils
          </h3>
          <span className="font-mono tabular-nums text-xs text-[#767A82]">
            {records.length} {records.length === 1 ? 'record' : 'records'}
          </span>
        </div>

        {records.length === 0 ? (
          <div className="py-8 text-center border border-dashed border-[#E2DFD7] rounded">
            <p className="text-xs text-[#4B4F56]">No saved sigils yet.</p>
            <p className="text-xs text-[#767A82] mt-1">
              Use the form above to archive your current drafting sheet.
            </p>
          </div>
        ) : (
          <div
            className={
              layout === 'full'
                ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5'
                : 'divide-y divide-[#E2DFD7]'
            }
          >
            {records.map((rec) => {
              const spec = applyManualOverrides(deriveSigilFromText(rec.text), rec.overrides);
              const dateStr = new Date(rec.updatedAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              return (
                <div
                  key={rec.id}
                  className={
                    layout === 'full'
                      ? 'bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-4 flex flex-col justify-between gap-4'
                      : 'py-3.5 flex items-start gap-3'
                  }
                >
                  <div className={layout === 'full' ? 'flex items-start gap-4' : 'flex items-start gap-3 flex-1 min-w-0'}>
                    <button
                      type="button"
                      onClick={() => onLoadRecord(rec)}
                      title={`Load ${rec.title}`}
                      className="w-16 h-16 shrink-0 bg-[#FFFFFF] border border-[#E2DFD7] rounded p-1 hover:border-[#1D4ED8] transition-colors cursor-pointer"
                    >
                      <SigilSvg
                        spec={spec}
                        visibility={rec.visibility ?? DEFAULT_LAYER_VISIBILITY}
                        options={{
                          strokeWeight: rec.strokeWeight ?? 1.7,
                          showGridGuides: false,
                          showDegreeLabels: false,
                          showSeedOfLife: spec.polygons.flowerOfLife,
                          showDashedLines: false,
                        }}
                        hoveredLayer={null}
                        isThumbnail
                        className="w-full h-full"
                      />
                    </button>

                    <div className="min-w-0 flex-1">
                      <button
                        type="button"
                        onClick={() => onLoadRecord(rec)}
                        className="text-sm font-semibold text-[#111315] hover:text-[#1D4ED8] text-left truncate block w-full cursor-pointer"
                      >
                        {rec.title}
                      </button>
                      <div className="mt-0.5 text-xs font-mono tabular-nums text-[#4B4F56] truncate">
                        "{rec.text}" · {ELEMENT_LABELS[spec.elements.primary]} · {dateStr}
                      </div>
                      {rec.notes && (
                        <p className="mt-1 text-xs text-[#767A82] line-clamp-2">{rec.notes}</p>
                      )}
                      {layout === 'sidebar' && (
                        <div className="mt-2 flex items-center gap-3 text-xs">
                          <button
                            type="button"
                            onClick={() => onLoadRecord(rec)}
                            className="font-medium text-[#1D4ED8] hover:underline cursor-pointer"
                          >
                            Load
                          </button>
                          <button
                            type="button"
                            onClick={() => onDuplicateRecord(rec)}
                            className="text-[#4B4F56] hover:text-[#111315] cursor-pointer"
                          >
                            Duplicate
                          </button>
                          <button
                            type="button"
                            onClick={() => onDeleteRecord(rec.id)}
                            className="text-[#767A82] hover:text-[#B91C1C] cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {layout === 'full' && (
                    <div className="flex items-center justify-between pt-3 border-t border-[#E2DFD7]">
                      <button
                        type="button"
                        onClick={() => onLoadRecord(rec)}
                        className="px-3 py-1.5 text-xs font-medium text-[#FFFFFF] bg-[#111315] hover:bg-[#1D4ED8] rounded transition-colors cursor-pointer"
                      >
                        Open in Workbench
                      </button>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onDuplicateRecord(rec)}
                          aria-label={`Duplicate ${rec.title}`}
                          className="p-1.5 text-[#4B4F56] hover:text-[#111315] rounded cursor-pointer"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onDeleteRecord(rec.id)}
                          aria-label={`Delete ${rec.title}`}
                          className="p-1.5 text-[#767A82] hover:text-[#B91C1C] rounded cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
