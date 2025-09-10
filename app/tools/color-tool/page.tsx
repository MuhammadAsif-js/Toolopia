"use client";
import React, { useCallback, useEffect, useRef, useState } from "react";

function clamp(v: number, a = 0, b = 255) { return Math.max(a, Math.min(b, v)); }
function rgbToHex(r: number, g: number, b: number) {
  return "#" + [r, g, b].map((n) => n.toString(16).padStart(2, "0")).join("").toUpperCase();
}
function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  const bigint = parseInt(h, 16);
  return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 };
}

function rgbToHsl(r:number,g:number,b:number){ r/=255;g/=255;b/=255;const max=Math.max(r,g,b),min=Math.min(r,g,b);let h=0,s=0,l=(max+min)/2; if(max!==min){const d=max-min; s=l>0.5?d/(2-max-min):d/(max+min); switch(max){case r:h=(g-b)/d+(g<b?6:0);break;case g:h=(b-r)/d+2;break;case b:h=(r-g)/d+4;break;} h/=6;} return {h:h*360,s:l===0?0:s,l}; }
function hslToRgb(h:number,s:number,l:number){h/=360;let r,g,b;if(s===0){r=g=b=l;}else{const q=l<0.5?l*(1+s):l+s-l*s;const p=2*l-q; const hue2rgb=(p:number,q:number,t:number)=>{ if(t<0)t+=1; if(t>1)t-=1; if(t<1/6)return p+(q-p)*6*t; if(t<1/2)return q; if(t<2/3)return p+(q-p)*(2/3-t)*6; return p; }; r=hue2rgb(p,q,h+1/3); g=hue2rgb(p,q,h); b=hue2rgb(p,q,h-1/3); } return {r:Math.round(r*255),g:Math.round(g*255),b:Math.round(b*255)}; }

// Simple k-means color quantization on sampled pixels
function quantizeKMeans(pixels: number[][], k = 6, maxIter = 8) {
  if (pixels.length === 0) return [];
  // init centers by random samples
  const centers: number[][] = [];
  const used = new Set<number>();
  while (centers.length < k && centers.length < pixels.length) {
    const idx = Math.floor(Math.random() * pixels.length);
    if (!used.has(idx)) { centers.push(pixels[idx].slice()); used.add(idx); }
  }
  const assignments = new Array(pixels.length).fill(0);

  for (let iter = 0; iter < maxIter; iter++) {
    // assign
    for (let i = 0; i < pixels.length; i++) {
      let best = 0; let bestD = Number.POSITIVE_INFINITY;
      for (let c = 0; c < centers.length; c++) {
        const dx = pixels[i][0] - centers[c][0];
        const dy = pixels[i][1] - centers[c][1];
        const dz = pixels[i][2] - centers[c][2];
        const d = dx*dx + dy*dy + dz*dz;
        if (d < bestD) { bestD = d; best = c; }
      }
      assignments[i] = best;
    }
    // recompute centers
    const sums = new Array(centers.length).fill(0).map(()=>[0,0,0,0]); // r,g,b,count
    for (let i = 0; i < pixels.length; i++) {
      const c = assignments[i];
      sums[c][0] += pixels[i][0];
      sums[c][1] += pixels[i][1];
      sums[c][2] += pixels[i][2];
      sums[c][3] += 1;
    }
    let changed = false;
    for (let c = 0; c < centers.length; c++) {
      if (sums[c][3] === 0) continue; // keep old
      const nr = Math.round(sums[c][0] / sums[c][3]);
      const ng = Math.round(sums[c][1] / sums[c][3]);
      const nb = Math.round(sums[c][2] / sums[c][3]);
      if (nr !== centers[c][0] || ng !== centers[c][1] || nb !== centers[c][2]) changed = true;
      centers[c][0] = nr; centers[c][1] = ng; centers[c][2] = nb;
    }
    if (!changed) break;
  }
  // compute counts
  const counts = new Array(centers.length).fill(0);
  for (let i = 0; i < assignments.length; i++) counts[assignments[i]]++;
  const out = centers.map((c, i) => ({ rgb: c, count: counts[i] }));
  out.sort((a,b)=>b.count - a.count);
  return out;
}

export default function ColorPaletteExtractor() {
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [colors, setColors] = useState<{hex:string, rgb:number[],count:number}[]>([]);
  const [k, setK] = useState(6);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement | null>(null);

  // drop handlers
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    if (f) handleFile(f);
  }, []);
  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  // handle file input
  async function handleFile(file: File) {
    setError(null);
    if (!file.type.startsWith("image/")) { setError("Please upload an image file."); return; }
    const url = URL.createObjectURL(file);
    setImageSrc(url);
    await extractColorsFromImageUrl(url, k);
  }

  async function extractColorsFromImageUrl(src: string, kLocal = k) {
    setLoading(true);
    try {
      const img = await loadImage(src);
      // downscale to max dimension to speed up
      const maxDim = 300; // tweak for quality/perf
      const { width, height } = scaleToMax(img.width, img.height, maxDim);
      const canvas = document.createElement("canvas");
      canvas.width = width; canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas not supported");
      ctx.drawImage(img, 0, 0, width, height);
      const imgData = ctx.getImageData(0,0,width,height).data;
      const pixels: number[][] = [];
      // sample pixels: stride to reduce data
      const stride = Math.max(1, Math.floor((width*height)/(maxDim*maxDim)));
      for (let i = 0; i < imgData.length; i += 4*stride) {
        const r = imgData[i], g = imgData[i+1], b = imgData[i+2], a = imgData[i+3];
        if (a < 125) continue; // skip transparent
        // optional filter: skip near-white and near-black? keep for now
        pixels.push([r,g,b]);
      }

      if (pixels.length === 0) throw new Error("No visible pixels found");

      const q = quantizeKMeans(pixels, Math.max(1, Math.min(12, kLocal)), 10);
  const mapped = q.map((c) => ({ hex: rgbToHex(c.rgb[0], c.rgb[1], c.rgb[2]), rgb: c.rgb.slice(), count: c.count }));
      setColors(mapped);
    } catch (err:any) {
      console.error(err);
      setError(err.message || "Failed to extract colors");
      setColors([]);
    } finally {
      setLoading(false);
    }
  }

  function scaleToMax(w:number,h:number,max:number){ if (w<=max && h<=max) return {width:w,height:h}; const ratio = Math.max(w/max,h/max); return {width:Math.round(w/ratio),height:Math.round(h/ratio)}; }

  function loadImage(src:string){ return new Promise<HTMLImageElement>((res,rej)=>{ const img=new Image(); img.crossOrigin='anonymous'; img.onload=()=>res(img); img.onerror=rej; img.src=src; }); }

  // copy hex
  async function copyHex(hex:string){ try { await navigator.clipboard.writeText(hex); } catch {} }

  // download palette as PNG
  function downloadPalettePNG() {
    if (colors.length === 0) return;
    const sw = 600, sh = 120;
    const canvas = document.createElement('canvas'); canvas.width = sw; canvas.height = sh; const ctx = canvas.getContext('2d')!;
    const w = sw / colors.length;
    colors.forEach((c,i)=>{ ctx.fillStyle = c.hex; ctx.fillRect(i*w,0,w,sh); });
    ctx.fillStyle = 'rgba(255,255,255,0.9)'; ctx.font='14px system-ui'; ctx.textAlign='center';
    colors.forEach((c,i)=>{ ctx.fillStyle = 'rgba(0,0,0,0.6)'; ctx.fillText(c.hex, (i+0.5)*w, sh-10); });
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'palette.png'; a.click();
  }

  // export CSS variables
  function exportCssVariables() {
    if (colors.length === 0) return '';
    const lines = colors.map((c,i)=>`--palette-${i+1}: ${c.hex};`);
    return `:root {\n  ${lines.join('\n  ')}\n}`;
  }

  // compute complementary/triadic suggestions
  function computeSuggestions() {
    if (!colors[0]) return [];
    const base = hexToRgb(colors[0].hex);
    const hsl = rgbToHsl(base.r, base.g, base.b);
    const compH = (hsl.h + 180) % 360;
    const tri1 = (hsl.h + 120) % 360; const tri2 = (hsl.h + 240) % 360;
    const compRgb = hslToRgb(compH, hsl.s, hsl.l);
    const tri1Rgb = hslToRgb(tri1, hsl.s, hsl.l);
    const tri2Rgb = hslToRgb(tri2, hsl.s, hsl.l);
    return [rgbToHex(compRgb.r,compRgb.g,compRgb.b), rgbToHex(tri1Rgb.r,tri1Rgb.g,tri1Rgb.b), rgbToHex(tri2Rgb.r,tri2Rgb.g,tri2Rgb.b)];
  }

  // accessibility: generate ARIA label for palette
  function paletteAria() { return colors.map((c,i)=>`Color ${i+1} ${c.hex}`).join(', '); }

  // clear
  function clearAll(){ setImageSrc(null); setColors([]); setError(null); if (fileRef.current) fileRef.current.value = ''; }

  useEffect(()=>{ // cleanup object url on unmount
    return ()=>{ if (imageSrc) URL.revokeObjectURL(imageSrc); }
  },[imageSrc]);

  return (
  <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-950 text-slate-900 dark:text-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">🎨 Color Palette Extractor</h1>
          <div className="text-sm opacity-80">Upload an image and get a palette — client-side, fast, private.</div>
        </header>

        <div className="h-16 rounded-xl border border-dashed border-black/10 dark:border-white/10 mb-6 grid place-items-center">Ad Space</div>

        <main className="grid lg:grid-cols-[1fr,340px] gap-6">
          <section className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <div className="flex-1">
                <div className="rounded-xl border p-4 text-center bg-white/80 dark:bg-slate-900/80" onDrop={onDrop} onDragOver={onDragOver} role="button" tabIndex={0}>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{ const f = e.target.files?.[0]; if (f) handleFile(f); }} />
                  <div className="mb-3">
                    <p className="text-sm opacity-80">Drag & drop an image here or</p>
                    <div className="mt-2">
                      <button className="px-4 py-2 rounded-lg bg-emerald-600 text-white" onClick={()=>fileRef.current?.click()}>Choose Image</button>
                      <button className="ml-2 px-3 py-2 rounded-lg border" onClick={()=>clearAll()}>Clear</button>
                    </div>
                  </div>

                  <div className="text-xs opacity-70 dark:text-slate-300">Supported: JPG, PNG, WebP. No upload — everything runs in your browser.</div>
                </div>

                {imageSrc && (
                  <div className="mt-4">
                    <img src={imageSrc} alt="Uploaded" className="max-h-64 object-contain rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900" />
                  </div>
                )}

                {error && <div className="mt-3 text-sm text-rose-600 dark:text-rose-400">{error}</div>}

                <div className="mt-4 flex items-center gap-3">
                  <label className="text-sm">Colors</label>
                  <input type="range" min={2} max={12} value={k} onChange={(e)=>setK(Number(e.target.value))} />
                  <div className="text-sm font-medium">{k}</div>
                  <button className="ml-auto px-3 py-2 rounded-lg bg-sky-600 text-white dark:bg-sky-700" onClick={()=>imageSrc ? extractColorsFromImageUrl(imageSrc,k) : setError('No image selected')}>{loading ? 'Extracting...' : 'Extract'}</button>
                </div>

                <div className="mt-6">
                  <h3 className="font-semibold mb-2">Export</h3>
                  <div className="flex flex-wrap gap-2">
                    <button className="px-3 py-2 rounded-lg border dark:border-slate-700" onClick={()=>{ const txt = exportCssVariables(); navigator.clipboard?.writeText(txt); }}>Copy CSS vars</button>
                    <button className="px-3 py-2 rounded-lg border dark:border-slate-700" onClick={()=>{ const txt = colors.map((c,i)=>`${c.hex} (${c.count})`).join('\n'); navigator.clipboard?.writeText(txt); }}>Copy Hex List</button>
                    <button className="px-3 py-2 rounded-lg border dark:border-slate-700" onClick={downloadPalettePNG}>Download PNG</button>
                  </div>
                </div>

              </div>

              <aside className="w-full sm:w-80">
                <div className="rounded-xl border p-3 mb-4">
                  <div className="text-sm opacity-80">Quick actions</div>
                  <div className="mt-2 flex flex-col gap-2">
                    <button className="px-3 py-2 rounded-lg border text-sm" onClick={()=>{ if (colors.length) navigator.clipboard?.writeText(colors[0].hex); }}>Copy Primary</button>
                    <button className="px-3 py-2 rounded-lg border text-sm" onClick={()=>{ const sug = computeSuggestions(); navigator.clipboard?.writeText(sug.join(', ')); }}>Copy Suggestions</button>
                    <button className="px-3 py-2 rounded-lg border text-sm" onClick={()=>{ const css = exportCssVariables(); navigator.clipboard?.writeText(css); }}>Copy CSS</button>
                  </div>
                </div>

                <div className="rounded-xl border p-3">
                  <div className="text-sm opacity-80">Accessibility</div>
                  <div className="mt-2 text-xs opacity-80">Each color shows contrast suggestions and ARIA-friendly labels. Use the primary color's contrast for text/background combos.</div>
                </div>

              </aside>

            </div>

            {/* Palette display */}
            <div className="mt-6">
              <h3 className="font-semibold mb-3">Extracted Palette</h3>
              <div role="list" aria-label={paletteAria()} className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                {colors.length===0 && <div className="col-span-full text-sm opacity-70">No colors yet. Upload an image and press Extract.</div>}
                {colors.map((c, i)=> (
                  <div key={i} role="listitem" className="rounded-lg overflow-hidden border bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800">
                    <div style={{background:c.hex, height:80}} className="flex items-end justify-between p-2">
                      <div className="text-xs font-mono px-2 rounded" style={{background: 'rgba(0,0,0,0.3)', color: getReadableTextColor(c.hex)}}>{c.hex}</div>
                    </div>
                    <div className="p-2 flex items-center justify-between text-xs">
                      <div className="opacity-80">{Math.round((c.count/(colors.reduce((a,b)=>a+b.count,0)||1))*100)}%</div>
                      <div className="flex gap-2">
                        <button className="px-2 py-1 rounded bg-white/80 dark:bg-slate-800 border dark:border-slate-700" style={{color: getReadableTextColor(c.hex)}} onClick={()=>copyHex(c.hex)}>Copy</button>
                        <button className="px-2 py-1 rounded border dark:border-slate-700" style={{color: getReadableTextColor(c.hex)}} onClick={()=>{ navigator.clipboard?.writeText(c.hex); alert('Copied'); }}>Copy</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </section>

          <aside className="space-y-4">
            <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold mb-2">Suggestions</h3>
              <div className="text-sm opacity-80 dark:text-slate-300">Complementary & Triadic suggestions based on the primary color</div>
              <div className="mt-3 flex gap-2 items-center">
                {computeSuggestions().map((hex,idx)=> (
                  <div key={idx} className="rounded-md px-3 py-2 text-sm" style={{background:hex, color: getReadableTextColor(hex)}}>{hex}</div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold mb-2">Contrast Checker</h3>
              <div className="text-sm opacity-80 dark:text-slate-300">Select a color and check contrast ratio vs white/black</div>
              <div className="mt-2">
                {colors.map((c, i)=> (
                  <div key={i} className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <div style={{background:c.hex}} className="w-8 h-8 rounded border border-slate-200 dark:border-slate-700" />
                      <div className="text-sm dark:text-slate-200">{c.hex}</div>
                    </div>
                    <div className="text-xs opacity-80 dark:text-slate-300">White: {contrastRatio(c.hex,'#FFFFFF')} • Black: {contrastRatio(c.hex,'#000000')}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white/80 dark:bg-slate-900/80 rounded-3xl p-4 border border-slate-200 dark:border-slate-800">
              <h3 className="font-semibold mb-2">Export CSS</h3>
              <textarea className="w-full h-36 rounded p-2 text-xs font-mono bg-white dark:bg-slate-900 text-black dark:text-white border border-slate-200 dark:border-slate-700" readOnly value={exportCssVariables()} />
            </div>
          </aside>
        </main>

        <footer className="mt-6 text-xs opacity-70">Everything runs locally in your browser — images are not uploaded. Reserved ad space above.</footer>
      </div>
    </div>
  );
}

/* --------------------------- Utility functions --------------------------- */

function luminance(hex:string){ const {r,g,b}=hexToRgb(hex); const srgb=[r/255,g/255,b/255].map((c)=>{ return c<=0.03928?c/12.92:Math.pow((c+0.055)/1.055,2.4); }); return 0.2126*srgb[0]+0.7152*srgb[1]+0.0722*srgb[2]; }
function contrastRatio(hex1:string, hex2:string){ const l1=luminance(hex1), l2=luminance(hex2); const lighter=Math.max(l1,l2), darker=Math.min(l1,l2); return (Math.round(((lighter+0.05)/(darker+0.05))*100)/100).toFixed(2); }
function getReadableTextColor(hex:string){ return Number(contrastRatio(hex,'#FFFFFF')) >= 4.5 ? '#FFFFFF' : '#000000'; }

