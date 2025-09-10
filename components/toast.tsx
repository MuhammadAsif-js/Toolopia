"use client"
import * as ToastPrimitive from '@radix-ui/react-toast'
import { useState } from 'react'

export function useToast() {
  const [toasts, setToasts] = useState<{ id: number; title: string; description?: string }[]>([])
  function push(title: string, description?: string) {
    setToasts(ts => [...ts, { id: Date.now() + Math.random(), title, description }])
  }
  function remove(id: number) {
    setToasts(ts => ts.filter(t => t.id !== id))
  }
  const node = (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map(t => (
        <ToastPrimitive.Root key={t.id} open onOpenChange={(o)=>!o && remove(t.id)} className="bg-card border shadow rounded-lg p-4 grid gap-1 data-[state=open]:animate-in data-[state=closed]:animate-out">
          <ToastPrimitive.Title className="font-medium">{t.title}</ToastPrimitive.Title>
          {t.description && <ToastPrimitive.Description className="text-sm text-muted-foreground">{t.description}</ToastPrimitive.Description>}
        </ToastPrimitive.Root>
      ))}
      <ToastPrimitive.Viewport className="fixed top-16 right-4 w-80 max-w-[calc(100%-2rem)] outline-none z-[60] flex flex-col gap-2" />
    </ToastPrimitive.Provider>
  )
  return { push, node }
}
