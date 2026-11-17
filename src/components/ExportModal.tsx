import React, { useEffect, useState } from 'react';
import { Check, Download, FileCode, Image as ImageIcon, Link2, X } from 'lucide-react';
import type { SigilSpec } from '../types/sigil';
import {
  downloadPngFile,
  downloadSvgFile,
  formatExportFilenameStem,
  type ExportBackground,
} from '../engine/exportSigil';
import { buildShareableSigilUrl, copyTextToClipboard } from '../engine/sigilUrl';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  svgRef: React.RefObject<SVGSVGElement | null>;
  phrase: string;
  dictionary?: string;
  spec: SigilSpec;
  showSeedOfLife: boolean;
  showBounding: boolean;
  showDashedLines: boolean;
}

export const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  svgRef,
  phrase,
  dictionary,
  spec,
  showSeedOfLife,
  showBounding,
  showDashedLines,
}) => {
  const [background, setBackground] = useState<ExportBackground>('paper');
  const [includeTranslatedText, setIncludeTranslatedText] = useState(true);
  const [includeGuides, setIncludeGuides] = useState(false);
  const [includeSeedOfLife, setIncludeSeedOfLife] = useState(showSeedOfLife);
  const [includeBounding, setIncludeBounding] = useState(showBounding);
  const [includeDashedLines, setIncludeDashedLines] = useState(showDashedLines);
  const [isExportingPng, setIsExportingPng] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  const shareUrl = buildShareableSigilUrl(
    phrase,
    spec.profile.modifier,
    dictionary ?? spec.category.dictionaryId
  );

  useEffect(() => {
    if (isOpen) {
      setIncludeSeedOfLife(showSeedOfLife);
      setIncludeBounding(showBounding);
      setIncludeDashedLines(showDashedLines);
      setStatusMessage(null);
      setCopiedLink(false);
    }
  }, [isOpen, showSeedOfLife, showBounding, showDashedLines]);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    const ok = await copyTextToClipboard(shareUrl);
    if (ok) {
      setCopiedLink(true);
      setStatusMessage('Shareable sigil URL copied to clipboard.');
      window.setTimeout(() => setCopiedLink(false), 1800);
    }
  };

  const handleSvgExport = () => {
    if (!svgRef.current) return;
    downloadSvgFile(svgRef.current, phrase, {
      background,
      includeGuides,
      includeSeedOfLife,
      includeBounding,
      includeDashedLines,
      includeTranslatedText,
      spec,
    });
    setStatusMessage('Vector SVG downloaded.');
  };

  const handlePngExport = async () => {
    if (!svgRef.current) return;
    setIsExportingPng(true);
    setStatusMessage(null);
    try {
      await downloadPngFile(svgRef.current, phrase, {
        background,
        includeGuides,
        includeSeedOfLife,
        includeBounding,
        includeDashedLines,
        includeTranslatedText,
        spec,
        resolution: 2048,
      });
      setStatusMessage(
        includeTranslatedText
          ? 'High-resolution 2048px PNG plate with translated text downloaded.'
          : 'High-resolution 2048×2048 PNG downloaded.'
      );
    } catch {
      setStatusMessage('Could not export PNG. Please try SVG export.');
    } finally {
      setIsExportingPng(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="export-dialog-title"
    >
      <div className="w-full max-w-md bg-[#FFFFFF] border border-[#E2DFD7] rounded-md p-6 space-y-5">
        <div className="flex items-start justify-between gap-4 pb-3 border-b border-[#E2DFD7]">
          <div>
            <h2 id="export-dialog-title" className="font-display text-lg font-semibold text-[#111315]">
              Export Drafting Plate
            </h2>
            <p className="text-xs text-[#4B4F56] mt-0.5">
              Render clean vector or 2048×2048 high-DPI raster artwork.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close export dialog"
            className="p-1.5 text-[#4B4F56] hover:text-[#111315] rounded cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Background Options */}
        <div className="space-y-2">
          <span className="block text-xs font-semibold text-[#111315]">Plate Background</span>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: 'paper', label: 'Drafting Paper' },
                { id: 'white', label: 'Pure White' },
                { id: 'transparent', label: 'Transparent' },
              ] as const
            ).map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => setBackground(opt.id)}
                className={`px-3 py-2 text-xs font-medium rounded border transition-colors cursor-pointer ${
                  background === opt.id
                    ? 'border-[#1D4ED8] bg-[#F1EFE9] text-[#111315]'
                    : 'border-[#E2DFD7] bg-[#FFFFFF] text-[#4B4F56] hover:text-[#111315]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Guide & Lattice Inclusion */}
        <div className="space-y-2.5">
          <label className="flex items-center gap-2.5 text-xs text-[#111315] font-medium cursor-pointer">
            <input
              type="checkbox"
              checked={includeTranslatedText}
              onChange={(e) => setIncludeTranslatedText(e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Include translated text, runes &amp; symbol legend</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={includeBounding}
              onChange={(e) => setIncludeBounding(e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Include outer bounding circle & eldritch arcs</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={includeSeedOfLife}
              onChange={(e) => setIncludeSeedOfLife(e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Include Seed of Life sacred lattice</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={includeDashedLines}
              onChange={(e) => setIncludeDashedLines(e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Include light dashed orbital, chord &amp; tether lines</span>
          </label>
          <label className="flex items-center gap-2.5 text-xs text-[#111315] cursor-pointer">
            <input
              type="checkbox"
              checked={includeGuides}
              onChange={(e) => setIncludeGuides(e.target.checked)}
              className="accent-[#1D4ED8] w-4 h-4"
            />
            <span>Include 15° compass guides and degree markings</span>
          </label>
        </div>

        {/* Direct Word-Derived Permalink */}
        <div className="space-y-1.5 pt-1">
          <span className="block text-xs font-semibold text-[#111315]">
            Shareable URL (generated from URL words)
          </span>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              onFocus={(e) => e.currentTarget.select()}
              aria-label="Shareable sigil URL"
              className="flex-1 min-w-0 px-2.5 py-1.5 text-[11px] font-mono bg-[#F8F7F4] border border-[#E2DFD7] rounded text-[#4B4F56] focus:outline-none focus:border-[#1D4ED8]"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#111315] bg-[#FFFFFF] border border-[#E2DFD7] hover:border-[#111315] rounded transition-colors cursor-pointer whitespace-nowrap shrink-0"
            >
              {copiedLink ? (
                <Check className="w-3.5 h-3.5 text-[#1D4ED8]" aria-hidden="true" />
              ) : (
                <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
              )}
              <span>{copiedLink ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {statusMessage && (
          <p className="text-xs font-medium text-[#1D4ED8]">{statusMessage}</p>
        )}

        {/* Export Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            type="button"
            onClick={handleSvgExport}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#111315] bg-[#FFFFFF] border border-[#111315] hover:bg-[#F1EFE9] rounded transition-colors cursor-pointer whitespace-nowrap"
          >
            <FileCode className="w-4 h-4" aria-hidden="true" />
            <span>Download SVG</span>
          </button>
          <button
            type="button"
            onClick={handlePngExport}
            disabled={isExportingPng}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-[#FFFFFF] bg-[#111315] hover:bg-[#1D4ED8] rounded transition-colors cursor-pointer whitespace-nowrap disabled:opacity-60"
          >
            {isExportingPng ? (
              <span>Rendering...</span>
            ) : (
              <>
                <ImageIcon className="w-4 h-4" aria-hidden="true" />
                <span>Download PNG</span>
              </>
            )}
          </button>
        </div>

        <div className="pt-2 border-t border-[#E2DFD7] flex items-center justify-between gap-3 text-[11px] font-mono tabular-nums text-[#767A82]">
          <span
            className="truncate"
            title={`${formatExportFilenameStem(phrase, spec.profile.modifier)}.png`}
          >
            File: {formatExportFilenameStem(phrase, spec.profile.modifier)}.png
          </span>
          <span className="inline-flex items-center gap-1 shrink-0">
            <Download className="w-3 h-3" aria-hidden="true" />{' '}
            {includeTranslatedText ? '2048 px plate' : '2048×2048 px'}
          </span>
        </div>
      </div>
    </div>
  );
};
