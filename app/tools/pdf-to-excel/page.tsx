"use client"
import { useState } from 'react'
import { FileUploadBox } from '../../../components/file-upload-box'
import { ToolHeader } from '../../../components/tool-header'

interface ConvertedItem {
  name: string
  blob: Blob
}

export default function PdfToExcelPage() {
  const [items, setItems] = useState<ConvertedItem[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  async function handleFiles(files: File[]) {
    setProcessing(true)
    const result: ConvertedItem[] = []
    for (let i=0;i<files.length;i++) {
      const f = files[i]
      setProgress(Math.round(((i)/files.length)*100))
      // Placeholder conversion: just wrap file bytes in a blob with Excel mime
      const arrayBuffer = await f.arrayBuffer()
      const blob = new Blob([arrayBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
      result.push({ name: f.name.replace(/\.[^.]+$/, '') + '.xlsx', blob })
    }
    setProgress(100)
    setItems(result)
    setTimeout(()=>{ setProcessing(false); setProgress(0) }, 500)
  }

  return (
    <div className="container py-8 sm:py-12 space-y-8">
      <ToolHeader slug="pdf-to-excel" />
      <FileUploadBox accept="application/pdf" onFiles={handleFiles} processing={processing} progress={progress} />
      {items.length>0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Results</h2>
          <ul className="space-y-3">
            {items.map((it,i)=>(
              <li key={i} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <p className="font-medium text-sm">{it.name}</p>
                  <p className="text-xs text-muted-foreground">Converted file</p>
                </div>
                <a download={it.name} href={URL.createObjectURL(it.blob)} className="text-sm font-medium text-primary hover:underline">Download</a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
