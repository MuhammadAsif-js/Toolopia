"use client"
import { useCallback, useRef, useState } from 'react'
import { cn } from '../lib/utils'

interface FileUploadBoxProps {
  multiple?: boolean
  accept?: string
  onFiles: (files: File[]) => void
  processing?: boolean
  progress?: number
}

export function FileUploadBox({ multiple, accept, onFiles, processing, progress }: FileUploadBoxProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [drag, setDrag] = useState(false)

  const handleFiles = useCallback((list: FileList | null) => {
    if (!list) return
    const files = Array.from(list)
    onFiles(files)
  }, [onFiles])

  return (
    <div
      className={cn('relative rounded-xl border-2 border-dashed p-8 text-center transition-colors', drag ? 'border-primary bg-primary/5' : 'border-muted')}
      onDragOver={(e)=>{e.preventDefault(); setDrag(true)}}
      onDragLeave={(e)=>{e.preventDefault(); setDrag(false)}}
      onDrop={(e)=>{e.preventDefault(); setDrag(false); handleFiles(e.dataTransfer.files)}}
    >
      <input ref={inputRef} type="file" hidden multiple={multiple} accept={accept} onChange={(e)=>handleFiles(e.target.files)} />
      <p className="text-sm text-muted-foreground mb-4">Drag & drop files here or</p>
      <button type="button" onClick={()=>inputRef.current?.click()} className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium shadow hover:shadow-md transition">
        Browse Files
      </button>
      {processing && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/80 backdrop-blur rounded-xl">
          <div className="w-40 h-2 bg-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all" style={{width: `${progress ?? 0}%`}} />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">Processing...</p>
        </div>
      )}
    </div>
  )
}
