import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Bookmark,
  ChevronDown,
  Layers,
  PanelRightClose,
  PanelRightOpen,
  SlidersHorizontal,
} from 'lucide-react';
import type {
  DraftingOptions,
  LayerId,
  LayerVisibility,
  ManualOverrides,
  SavedSigilRecord,
} from './types/sigil';
import {
  applyManualOverrides,
  DEFAULT_LAYER_VISIBILITY,
  deriveSigilFromText,
} from './engine/sigilEngine';
import { loadSavedSigils, persistSavedSigils } from './engine/storage';
import {
  DEFAULT_SIGIL_PHRASE,
  parsePhraseFromLocation,
  phraseToPath,
} from './engine/sigilUrl';
import { TopBar, type ActiveWorkspaceView } from './components/TopBar';
import { SigilCanvas } from './components/SigilCanvas';
import { LayerBreakdownPanel } from './components/LayerBreakdownPanel';
import { ManualTuningPanel } from './components/ManualTuningPanel';
import { SavedLibraryPanel } from './components/SavedLibraryPanel';
import { SymbolGuideView } from './components/SymbolGuideView';
import { ExportModal } from './components/ExportModal';

type InspectorTab = 'layers' | 'tune' | 'library';

export default function App() {
  const [activeView, setActiveView] = useState<ActiveWorkspaceView>('workbench');
  const [inspectorTab, setInspectorTab] = useState<InspectorTab>('layers');
  const [isInspectorCollapsed, setIsInspectorCollapsed] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const [phraseText, setPhraseText] = useState<string>(
    () => parsePhraseFromLocation() ?? DEFAULT_SIGIL_PHRASE
  );
  const [overrides, setOverrides] = useState<ManualOverrides>({});
  const [visibility, setVisibility] = useState<LayerVisibility>({ ...DEFAULT_LAYER_VISIBILITY });
  const [draftingOptions, setDraftingOptions] = useState<DraftingOptions>({
    strokeWeight: 1.75,
    showGridGuides: false,
    showDegreeLabels: false,
    showSeedOfLife: false,
    showDashedLines: false,
  });
  const [hoveredLayer, setHoveredLayer] = useState<LayerId | null>(null);
  const [savedRecords, setSavedRecords] = useState<SavedSigilRecord[]>(() => loadSavedSigils());

  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    persistSavedSigils(savedRecords);
  }, [savedRecords]);

  useEffect(() => {
    const targetPath = phraseToPath(phraseText);
    if (window.location.pathname !== targetPath) {
      window.history.replaceState(null, '', targetPath);
    }
    const trimmed = phraseText.trim();
    document.title = trimmed
      ? `${trimmed} — Sigil Draftsman`
      : 'Sigil Draftsman — Deterministic Arcane Sigil Translator';
  }, [phraseText]);

  useEffect(() => {
    const handlePopState = () => {
      const fromUrl = parsePhraseFromLocation();
      setPhraseText(fromUrl ?? DEFAULT_SIGIL_PHRASE);
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const derivedSpec = useMemo(() => deriveSigilFromText(phraseText), [phraseText]);
  const effectiveSpec = useMemo(
    () => applyManualOverrides(derivedSpec, overrides),
    [derivedSpec, overrides]
  );

  const handleToggleLayer = (layer: LayerId) => {
    setVisibility((prev) => ({ ...prev, [layer]: !prev[layer] }));
  };

  const handleIsolateLayer = (layer: LayerId) => {
    const inspectorLayers: LayerId[] = [
      'celestial',
      'runes',
      'polygons',
      'elements',
      'alchemy',
      'planets',
    ];
    setVisibility((prev) => {
      const onlyThisVisible =
        prev[layer] &&
        inspectorLayers.every((k) => (k === layer ? prev[k] : !prev[k]));
      if (onlyThisVisible) {
        return {
          ...prev,
          celestial: true,
          runes: true,
          polygons: true,
          elements: true,
          alchemy: true,
          planets: true,
        };
      }
      return {
        bounding: prev.bounding,
        celestial: layer === 'celestial',
        runes: layer === 'runes',
        polygons: layer === 'polygons',
        elements: layer === 'elements',
        alchemy: layer === 'alchemy',
        planets: layer === 'planets',
      };
    });
  };

  const handleShowAllLayers = () => {
    setVisibility((prev) => ({
      ...prev,
      celestial: true,
      runes: true,
      polygons: true,
      elements: true,
      alchemy: true,
      planets: true,
    }));
  };

  const handleUpdateOverride = <K extends keyof ManualOverrides>(
    key: K,
    value: ManualOverrides[K]
  ) => {
    setOverrides((prev) => ({ ...prev, [key]: value }));
  };

  const handleUpdateDraftingOption = <K extends keyof DraftingOptions>(
    key: K,
    value: DraftingOptions[K]
  ) => {
    setDraftingOptions((prev) => ({ ...prev, [key]: value }));
  };

  const handleSaveRecord = (title: string, notes: string) => {
    const now = Date.now();
    const record: SavedSigilRecord = {
      id: `sigil-${now}-${Math.random().toString(36).slice(2, 7)}`,
      title,
      notes,
      text: phraseText,
      overrides: { ...overrides },
      visibility: { ...visibility },
      strokeWeight: draftingOptions.strokeWeight,
      createdAt: now,
      updatedAt: now,
    };
    setSavedRecords((prev) => [record, ...prev]);
  };

  const handleQuickSave = () => {
    const title = phraseText.trim() || 'Untitled Sigil';
    handleSaveRecord(title, '');
  };

  const handleNavigatePhrase = (nextPhrase: string) => {
    const targetPath = phraseToPath(nextPhrase);
    if (window.location.pathname !== targetPath) {
      window.history.pushState(null, '', targetPath);
    }
    setPhraseText(nextPhrase);
  };

  const handleLoadRecord = (record: SavedSigilRecord) => {
    handleNavigatePhrase(record.text);
    setOverrides({ ...record.overrides });
    setVisibility({ ...(record.visibility ?? DEFAULT_LAYER_VISIBILITY) });
    setDraftingOptions((prev) => ({
      ...prev,
      strokeWeight: record.strokeWeight ?? 1.75,
    }));
    setActiveView('workbench');
  };

  const handleDuplicateRecord = (record: SavedSigilRecord) => {
    const now = Date.now();
    const copy: SavedSigilRecord = {
      ...record,
      id: `sigil-${now}-${Math.random().toString(36).slice(2, 7)}`,
      title: `${record.title} (Copy)`,
      createdAt: now,
      updatedAt: now,
    };
    setSavedRecords((prev) => [copy, ...prev]);
  };

  const handleDeleteRecord = (id: string) => {
    setSavedRecords((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8F7F4] text-[#111315]">
      <TopBar
        activeView={activeView}
        onSelectView={setActiveView}
        onOpenExport={() => setIsExportOpen(true)}
      />

      {activeView === 'workbench' && (
        <main className="flex-1 flex flex-col lg:flex-row min-h-0">
          {/* Left / Center Stage */}
          <SigilCanvas
            text={phraseText}
            onTextChange={setPhraseText}
            onSelectSample={handleNavigatePhrase}
            spec={effectiveSpec}
            visibility={visibility}
            draftingOptions={draftingOptions}
            overrides={overrides}
            hoveredLayer={hoveredLayer}
            svgRef={svgRef}
            onToggleDegrees={() =>
              handleUpdateDraftingOption('showDegreeLabels', !draftingOptions.showDegreeLabels)
            }
            onToggleSeedOfLife={() =>
              handleUpdateDraftingOption('showSeedOfLife', !draftingOptions.showSeedOfLife)
            }
            onToggleDashedLines={() =>
              handleUpdateDraftingOption('showDashedLines', !draftingOptions.showDashedLines)
            }
            showBounding={visibility.bounding}
            onToggleBounding={() => handleToggleLayer('bounding')}
            onQuickSave={handleQuickSave}
            onResetOverrides={() => setOverrides({})}
          />

          {/* Right Inspector & Tuning Deck (Collapsible, defaults to collapsed) */}
          <aside
            aria-label="Sigil Inspector and Tuning Deck"
            className={
              isInspectorCollapsed
                ? 'w-full lg:w-12 shrink-0 bg-[#FFFFFF] border-t lg:border-t-0 lg:border-l border-[#E2DFD7] flex lg:flex-col items-center justify-between lg:justify-start'
                : 'w-full lg:w-[420px] xl:w-[440px] shrink-0 bg-[#FFFFFF] border-t lg:border-t-0 lg:border-l border-[#E2DFD7] flex flex-col'
            }
          >
            {isInspectorCollapsed ? (
              <>
                {/* Mobile Collapsed Bar */}
                <button
                  type="button"
                  onClick={() => setIsInspectorCollapsed(false)}
                  aria-expanded={false}
                  className="lg:hidden w-full px-5 py-3 flex items-center justify-between text-xs font-medium text-[#111315] hover:bg-[#F8F7F4] transition-colors cursor-pointer"
                >
                  <span>Layers &amp; Legend · Manual Tune · Library ({savedRecords.length})</span>
                  <span className="inline-flex items-center gap-1 text-[#4B4F56]">
                    <span>Expand</span>
                    <ChevronDown className="w-4 h-4" aria-hidden="true" />
                  </span>
                </button>

                {/* Desktop Collapsed Rail */}
                <div className="hidden lg:flex flex-col items-center w-full py-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsInspectorCollapsed(false)}
                    aria-expanded={false}
                    aria-label="Expand Layers & Legend sidebar"
                    title="Expand Layers & Legend sidebar"
                    className="p-2 rounded text-[#4B4F56] hover:text-[#111315] hover:bg-[#F1EFE9] transition-colors cursor-pointer"
                  >
                    <PanelRightOpen className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <span className="w-5 h-[1px] bg-[#E2DFD7]" aria-hidden="true" />

                  <button
                    type="button"
                    onClick={() => {
                      setInspectorTab('layers');
                      setIsInspectorCollapsed(false);
                    }}
                    title="Open Layers & Legend"
                    aria-label="Open Layers & Legend"
                    className="p-2 rounded text-[#4B4F56] hover:text-[#111315] hover:bg-[#F1EFE9] transition-colors cursor-pointer"
                  >
                    <Layers className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectorTab('tune');
                      setIsInspectorCollapsed(false);
                    }}
                    title="Open Manual Tune"
                    aria-label="Open Manual Tune"
                    className="p-2 rounded text-[#4B4F56] hover:text-[#111315] hover:bg-[#F1EFE9] transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-4 h-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setInspectorTab('library');
                      setIsInspectorCollapsed(false);
                    }}
                    title={`Open Library (${savedRecords.length})`}
                    aria-label={`Open Library (${savedRecords.length})`}
                    className="p-2 rounded text-[#4B4F56] hover:text-[#111315] hover:bg-[#F1EFE9] transition-colors cursor-pointer"
                  >
                    <Bookmark className="w-4 h-4" aria-hidden="true" />
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsInspectorCollapsed(false)}
                    className="mt-2 py-2 text-[11px] font-medium tracking-wider uppercase text-[#767A82] hover:text-[#111315] transition-colors cursor-pointer select-none [writing-mode:vertical-rl] rotate-180"
                  >
                    Layers &amp; Legend
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Segmented Tab Bar + Collapse Toggle */}
                <div className="px-5 pt-4 pb-3 border-b border-[#E2DFD7] flex items-center gap-2">
                  <div className="flex-1 grid grid-cols-3 gap-1 p-1 bg-[#F1EFE9] rounded-md">
                    {(
                      [
                        { id: 'layers', label: 'Layers & Legend' },
                        { id: 'tune', label: 'Manual Tune' },
                        { id: 'library', label: `Library (${savedRecords.length})` },
                      ] as const
                    ).map((tab) => {
                      const active = inspectorTab === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setInspectorTab(tab.id)}
                          className={`py-1.5 px-2 text-xs font-medium rounded transition-colors whitespace-nowrap truncate cursor-pointer ${
                            active
                              ? 'bg-[#FFFFFF] text-[#111315] shadow-xs'
                              : 'text-[#4B4F56] hover:text-[#111315]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    type="button"
                    onClick={() => setIsInspectorCollapsed(true)}
                    aria-expanded={true}
                    aria-label="Collapse Layers & Legend sidebar"
                    title="Collapse sidebar"
                    className="p-2 rounded text-[#4B4F56] hover:text-[#111315] hover:bg-[#F1EFE9] transition-colors cursor-pointer shrink-0"
                  >
                    <PanelRightClose className="w-4 h-4" aria-hidden="true" />
                  </button>
                </div>

                {/* Panel Body */}
                <div className="flex-1 overflow-y-auto px-5 py-5">
                  {inspectorTab === 'layers' && (
                    <LayerBreakdownPanel
                      spec={effectiveSpec}
                      visibility={visibility}
                      hoveredLayer={hoveredLayer}
                      onHoverLayer={setHoveredLayer}
                      onToggleLayer={handleToggleLayer}
                      onIsolateLayer={handleIsolateLayer}
                      onShowAllLayers={handleShowAllLayers}
                    />
                  )}

                  {inspectorTab === 'tune' && (
                    <ManualTuningPanel
                      spec={effectiveSpec}
                      overrides={overrides}
                      draftingOptions={draftingOptions}
                      showBounding={visibility.bounding}
                      onToggleBounding={() => handleToggleLayer('bounding')}
                      onUpdateOverride={handleUpdateOverride}
                      onUpdateDraftingOption={handleUpdateDraftingOption}
                      onResetAll={() => setOverrides({})}
                    />
                  )}

                  {inspectorTab === 'library' && (
                    <SavedLibraryPanel
                      records={savedRecords}
                      currentText={phraseText}
                      onSaveCurrent={handleSaveRecord}
                      onLoadRecord={handleLoadRecord}
                      onDuplicateRecord={handleDuplicateRecord}
                      onDeleteRecord={handleDeleteRecord}
                      layout="sidebar"
                    />
                  )}
                </div>
              </>
            )}
          </aside>
        </main>
      )}

      {activeView === 'library' && (
        <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-8">
          <div className="mb-6 pb-4 border-b border-[#E2DFD7] flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="font-display text-2xl font-semibold text-[#111315]">
                Saved Sigil Archive
              </h1>
              <p className="text-xs text-[#4B4F56] mt-1">
                Sigils and custom geometric overrides stored locally in your browser.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setActiveView('workbench')}
              className="px-3.5 py-2 text-xs font-medium text-[#111315] bg-[#FFFFFF] border border-[#E2DFD7] hover:border-[#111315] rounded transition-colors cursor-pointer"
            >
              Back to Workbench
            </button>
          </div>
          <SavedLibraryPanel
            records={savedRecords}
            currentText={phraseText}
            onSaveCurrent={handleSaveRecord}
            onLoadRecord={handleLoadRecord}
            onDuplicateRecord={handleDuplicateRecord}
            onDeleteRecord={handleDeleteRecord}
            layout="full"
          />
        </main>
      )}

      {activeView === 'guide' && (
        <main className="flex-1">
          <SymbolGuideView onBackToWorkbench={() => setActiveView('workbench')} />
        </main>
      )}

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        svgRef={svgRef}
        phrase={phraseText}
        spec={effectiveSpec}
        showSeedOfLife={draftingOptions.showSeedOfLife}
        showBounding={visibility.bounding}
        showDashedLines={draftingOptions.showDashedLines}
      />
    </div>
  );
}
