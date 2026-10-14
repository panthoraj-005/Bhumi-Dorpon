/**
 * Injects SVG patterns into a Leaflet map container SVG element.
 * Each map of the swipe pair receives distinct pattern IDs prefixed by mapIdPrefix.
 */
export function injectMapSvgDefs(containerEl: HTMLElement, idPrefix: string): void {
  function appendDefs(svgEl: SVGElement) {
    if (svgEl.querySelector(`#defs-${idPrefix}`)) return;

    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    defs.id = `defs-${idPrefix}`;
    defs.innerHTML = `
      <!-- Loss Strip: Coral Diagonal Hatch (45 deg) -->
      <pattern id="pattern-loss-${idPrefix}" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#E4604A" stroke-width="2.5" />
      </pattern>

      <!-- Unowned / State Khas: Grey Diagonal Hatch -->
      <pattern id="pattern-khas-${idPrefix}" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#9AA091" stroke-width="2" />
      </pattern>

      <!-- Forecast Imminent Loss: Purple Dashed Diagonal Hatch -->
      <pattern id="pattern-forecast-${idPrefix}" width="8" height="8" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="8" stroke="#6A5BD6" stroke-width="2.2" stroke-dasharray="3,1.5" />
      </pattern>

      <!-- Tidal Flats: Faint Stipple / Dot Pattern -->
      <pattern id="pattern-tidal-dots-${idPrefix}" width="10" height="10" patternUnits="userSpaceOnUse">
        <circle cx="2" cy="2" r="1.2" fill="#B5AE9E" opacity="0.65" />
        <circle cx="7" cy="7" r="1.2" fill="#B5AE9E" opacity="0.65" />
      </pattern>

      <!-- Submerged Plots: Blue Wave Ripple Pattern -->
      <pattern id="pattern-flood-waves-${idPrefix}" width="12" height="6" patternUnits="userSpaceOnUse">
        <path d="M 0 3 Q 3 0, 6 3 T 12 3" fill="none" stroke="#3B82F6" stroke-width="1.2" opacity="0.75" />
      </pattern>
    `;
    svgEl.prepend(defs);
  }

  const svg = containerEl.querySelector("svg");
  if (svg) {
    appendDefs(svg);
  } else {
    // Retry once Leaflet appends the SVG renderer
    setTimeout(() => {
      const delayedSvg = containerEl.querySelector("svg");
      if (delayedSvg) appendDefs(delayedSvg);
    }, 80);
  }
}
