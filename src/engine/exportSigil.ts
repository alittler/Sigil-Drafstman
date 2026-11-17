import type { SigilSpec } from '../types/sigil';
import { renderExportLegendGroup } from './exportLegend';

export type ExportBackground = 'paper' | 'white' | 'transparent';

export interface SigilExportOptions {
  background: ExportBackground;
  includeGuides: boolean;
  includeSeedOfLife: boolean;
  includeBounding?: boolean;
  includeDashedLines?: boolean;
  includeTranslatedText?: boolean;
  spec?: SigilSpec;
  size?: number;
}

function slugifyFilename(input: string): string {
  const clean = input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return clean || 'arcane-sigil';
}

function buildExportSvgDocument(
  svgElement: SVGSVGElement,
  options: SigilExportOptions
): { svgString: string; width: number; height: number } {
  const clone = svgElement.cloneNode(true) as SVGSVGElement;
  const exportWidth = options.size ?? 2048;

  const shouldAppendLegend = Boolean(options.includeTranslatedText && options.spec);
  const renderedLegend =
    shouldAppendLegend && options.spec ? renderExportLegendGroup(options.spec) : null;
  const totalViewBoxHeight = renderedLegend ? renderedLegend.totalHeight : 840;
  const exportHeight = Math.round((totalViewBoxHeight / 840) * exportWidth);

  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  clone.setAttribute('width', String(exportWidth));
  clone.setAttribute('height', String(exportHeight));
  clone.setAttribute('viewBox', `0 0 840 ${totalViewBoxHeight}`);
  clone.removeAttribute('class');

  // Remove interactive hover overlays or excluded guide layers
  const interactiveOverlays = clone.querySelectorAll('[data-export-ignore="true"]');
  interactiveOverlays.forEach((el) => el.remove());

  if (!options.includeGuides) {
    const guideNodes = clone.querySelectorAll('[data-drafting-guide="true"]');
    guideNodes.forEach((el) => el.remove());
  }

  const seedNodes = clone.querySelectorAll('[data-seed-of-life="true"]');
  seedNodes.forEach((el) => {
    if (options.includeSeedOfLife) {
      el.removeAttribute('display');
    } else {
      el.remove();
    }
  });

  if (options.includeBounding !== undefined) {
    const boundingNodes = clone.querySelectorAll('[data-bounding-layer="true"]');
    boundingNodes.forEach((el) => {
      if (options.includeBounding) {
        el.removeAttribute('display');
      } else {
        el.remove();
      }
    });
  }

  if (options.includeDashedLines !== undefined) {
    const dashedNodes = clone.querySelectorAll('[data-dashed-line="true"]');
    dashedNodes.forEach((el) => {
      if (options.includeDashedLines) {
        el.removeAttribute('display');
      } else {
        el.remove();
      }
    });
  }

  // Normalize any active highlight blue strokes back to crisp architectural black for export
  const highlightedNodes = clone.querySelectorAll('[data-ink-role]');
  highlightedNodes.forEach((node) => {
    const role = node.getAttribute('data-ink-role');
    if (role === 'primary') {
      node.setAttribute('stroke', '#111315');
      if (node.hasAttribute('opacity')) node.setAttribute('opacity', '1');
    } else if (role === 'fill-primary') {
      node.setAttribute('fill', '#111315');
    }
  });

  // Insert background rect covering both the sigil plate and translated text footer
  if (options.background !== 'transparent') {
    const bgRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    bgRect.setAttribute('x', '0');
    bgRect.setAttribute('y', '0');
    bgRect.setAttribute('width', '840');
    bgRect.setAttribute('height', String(totalViewBoxHeight));
    bgRect.setAttribute('fill', options.background === 'paper' ? '#F8F7F4' : '#FFFFFF');
    clone.insertBefore(bgRect, clone.firstChild);
  }

  // Append vector translated text & symbol legend below the sigil plate
  if (renderedLegend) {
    const parser = new DOMParser();
    const parsed = parser.parseFromString(renderedLegend.groupMarkup, 'image/svg+xml');
    const legendNode = parsed.documentElement;
    if (legendNode && legendNode.nodeName !== 'parsererror') {
      clone.appendChild(document.importNode(legendNode, true));
    }
  }

  const serializer = new XMLSerializer();
  const xmlStr = serializer.serializeToString(clone);
  return {
    svgString: `<?xml version="1.0" encoding="UTF-8"?>\n${xmlStr}`,
    width: exportWidth,
    height: exportHeight,
  };
}

/**
 * Serialize the live sigil SVG element into a clean standalone SVG document string.
 */
export function serializeSigilSvg(
  svgElement: SVGSVGElement,
  options: SigilExportOptions
): string {
  return buildExportSvgDocument(svgElement, options).svgString;
}

export function downloadSvgFile(
  svgElement: SVGSVGElement,
  phrase: string,
  options: Omit<SigilExportOptions, 'size'>
): void {
  const { svgString } = buildExportSvgDocument(svgElement, { ...options, size: 1024 });
  const blob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${slugifyFilename(phrase)}-sigil.svg`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export async function downloadPngFile(
  svgElement: SVGSVGElement,
  phrase: string,
  options: Omit<SigilExportOptions, 'size'> & { resolution?: number }
): Promise<void> {
  const resolution = options.resolution ?? 2048;
  const { svgString, width, height } = buildExportSvgDocument(svgElement, {
    ...options,
    size: resolution,
  });
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const svgUrl = URL.createObjectURL(svgBlob);

  return new Promise<void>((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          URL.revokeObjectURL(svgUrl);
          reject(new Error('Could not initialize 2D canvas context.'));
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        URL.revokeObjectURL(svgUrl);

        canvas.toBlob(
          (pngBlob) => {
            if (!pngBlob) {
              reject(new Error('Failed to encode PNG image.'));
              return;
            }
            const pngUrl = URL.createObjectURL(pngBlob);
            const link = document.createElement('a');
            link.href = pngUrl;
            link.download = `${slugifyFilename(phrase)}-sigil-${width}px.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(pngUrl);
            resolve();
          },
          'image/png',
          1.0
        );
      } catch (err) {
        URL.revokeObjectURL(svgUrl);
        reject(err);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(svgUrl);
      reject(new Error('Failed to rasterize SVG into PNG.'));
    };
    img.src = svgUrl;
  });
}
