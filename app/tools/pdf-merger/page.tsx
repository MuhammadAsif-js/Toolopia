"use client"

import React, { useState, useCallback } from 'react'
import { PDFDocument } from 'pdf-lib'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import articleData from './article.json'
import { AdSlot } from '../../../components/ad-slot'
import { ToolHeader } from '../../../components/tool-header'
import { FileUploadBox } from '../../../components/file-upload-box'

type Item = {
  id: string
  file: File
  name: string
  pages: { from: number | null; to: number | null }
}

function uid() { return Math.random().toString(36).slice(2,9) }

export default function PdfMergerPage() {
  const [items, setItems] = useState<Item[]>([])
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

  const onFiles = useCallback(async (files: File[]) => {
    const arr = Array.from(files).map((f): Item => ({ id: uid(), file: f, name: f.name, pages: { from: null, to: null } }))
    setItems(prev => [...prev, ...arr])
  }, [])

  function onDragEnd(result: DropResult) {
    if (!result.destination) return
    const src = result.source.index
    const dst = result.destination.index
    const next = Array.from(items)
    const [moved] = next.splice(src,1)
    next.splice(dst,0,moved)
    setItems(next)
  }

  function updateRange(id: string, key: 'from'|'to', value: string) {
    setItems(prev => prev.map(it => it.id === id ? { ...it, pages: { ...it.pages, [key]: value === '' ? null : Number(value) } } : it))
  }

  async function handleMerge() {
    if (items.length === 0) return
    setProcessing(true)
    try {
      const outPdf = await PDFDocument.create()
      for (let i=0;i<items.length;i++) {
        const it = items[i]
        setProgress(Math.round((i / items.length) * 100))
        const arrayBuffer = await it.file.arrayBuffer()
        const srcDoc = await PDFDocument.load(arrayBuffer)
        const total = srcDoc.getPageCount()
        let from = it.pages.from ?? 1
        let to = it.pages.to ?? total
        // Clamp
        from = Math.max(1, Math.min(total, from))
        to = Math.max(1, Math.min(total, to))
        if (from > to) { const tmp = from; from = to; to = tmp }
        const indices: number[] = []
        for (let p = from; p <= to; p++) indices.push(p-1)
        const copied = await outPdf.copyPages(srcDoc, indices)
        copied.forEach(p => outPdf.addPage(p))
      }
      setProgress(100)
  const bytes = await outPdf.save()
  // pdf-lib returns a Uint8Array-like; ensure we pass an ArrayBuffer to Blob to satisfy strict TS types
  const blob = new Blob([new Uint8Array(bytes).buffer], { type: 'application/pdf' })
      const name = 'merged.pdf'
      const url = URL.createObjectURL(blob)
      // trigger download
      const a = document.createElement('a')
      a.href = url
      a.download = name
      document.body.appendChild(a)
      a.click()
      a.remove()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Failed to merge PDFs. See console for details.')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  return (
    <div className="container py-8 sm:py-12">
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <ToolHeader slug="pdf-merger" />
            {articleData.subtitle && <p className="text-muted-foreground mt-2">{articleData.subtitle}</p>}
          </div>
          <div className="w-72 hidden xl:block">
            {/* sidebar ad placeholder, disabled by default */}
            <AdSlot enabled={false} variant="sidebar" className="w-full h-40" />
          </div>
        </div>

        {/* top ad placeholder */}
        <div className="w-full">
          <AdSlot enabled={false} variant="top" className="w-full h-20 mb-4" />
        </div>

        <FileUploadBox accept="application/pdf" onFiles={onFiles} processing={processing} progress={progress} />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Files</h2>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="files">
              {(provided: any)=> (
                <ul ref={provided.innerRef} {...provided.droppableProps} className="space-y-3">
                  {items.map((it, idx) => (
                    <Draggable key={it.id} draggableId={it.id} index={idx}>
                      {(prov: any)=> (
                        <li ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="flex items-center justify-between gap-4 rounded-lg border p-3">
                          <div className="flex-1">
                            <p className="font-medium text-sm">{it.name}</p>
                            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                              <label className="flex items-center gap-2">
                                <span className="text-xs">From</span>
                                <input className="w-16 rounded border px-2 py-1 text-sm" type="number" min={1} onChange={e=>updateRange(it.id,'from',e.target.value)} value={it.pages.from ?? ''} />
                              </label>
                              <label className="flex items-center gap-2">
                                <span className="text-xs">To</span>
                                <input className="w-16 rounded border px-2 py-1 text-sm" type="number" min={1} onChange={e=>updateRange(it.id,'to',e.target.value)} value={it.pages.to ?? ''} />
                              </label>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <button onClick={()=> setItems(prev => prev.filter(x => x.id !== it.id))} className="text-sm text-red-600">Remove</button>
                          </div>
                        </li>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </ul>
              )}
            </Droppable>
          </DragDropContext>

          <div className="flex items-center gap-3">
            <button disabled={processing || items.length===0} onClick={handleMerge} className="inline-flex items-center rounded bg-primary px-4 py-2 text-white disabled:opacity-50">
              {processing ? 'Merging...' : 'Merge PDFs'}
            </button>
            <AdSlot enabled={false} variant="inline" className="hidden md:block w-96 h-20" />
          </div>
        </div>
      </div>
    </div>
  )
}
