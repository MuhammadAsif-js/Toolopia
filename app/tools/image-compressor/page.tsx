"use client"
import { useState } from 'react'
import { FileUploadBox } from '../../../components/file-upload-box'
import { compressImage } from '../../../lib/utils'
import { Article } from '../../../components/article'
import { AdSlot } from '../../../components/ad-slot'

interface CompressedItem {
  name: string
  originalSize: number
  blob: Blob
}

export default function ImageCompressorPage() {
  const [items, setItems] = useState<CompressedItem[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleFiles(files: File[]) {
    setProcessing(true)
    const result: CompressedItem[] = []
    for (let i=0;i<files.length;i++) {
      const f = files[i]
      setProgress(Math.round(((i)/files.length)*100))
      const blob = await compressImage(f, 0.7)
      result.push({ name: f.name.replace(/\.[^.]+$/, '') + '-compressed.jpg', originalSize: f.size, blob })
    }
    setProgress(100)
    setItems(result)
    setTimeout(()=>{ setProcessing(false); setProgress(0) }, 500)
  }

  return (
    <div className="container px-4 py-12 space-y-8">
      {/* Top ad slot (disabled by default) */}
      <AdSlot enabled={false} variant="top" className="w-full h-20 md:h-24" />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <main className="lg:col-span-3 space-y-6">
          {/* Article is separated and editable as JSON */}
          <Article />

          <FileUploadBox multiple accept="image/*" onFiles={handleFiles} processing={processing} progress={progress} />

          {/* Inline ad slot (disabled by default) */}
          <AdSlot enabled={false} variant="inline" className="w-full h-24" />

          {items.length>0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Results</h2>
              <ul className="space-y-3">
                {items.map((it,i)=>(
                  <li key={i} className="flex items-center justify-between rounded-lg border p-3">
                    <div className="space-y-1">
                      <p className="font-medium text-sm">{it.name}</p>
                      <p className="text-xs text-muted-foreground">Original: {(it.originalSize/1024).toFixed(1)} KB → New: {(it.blob.size/1024).toFixed(1)} KB</p>
                    </div>
                    <a download={it.name} href={URL.createObjectURL(it.blob)} className="text-sm font-medium text-primary hover:underline">Download</a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </main>

        {/* Sidebar for tools / ads */}
        <aside className="hidden lg:block">
          <div className="space-y-4">
            {/* Sidebar ad (disabled by default) */}
            <AdSlot enabled={false} variant="sidebar" className="w-full h-96" />
          </div>
        </aside>
      </div>
    </div>
  )
}
