import type { ReactNode } from 'react'
import { TOOLS } from '../../lib/tools'
import Link from 'next/link'

export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      <aside className="hidden lg:block w-64 border-r bg-background/50 backdrop-blur p-6 space-y-4">
        <h2 className="font-semibold tracking-tight">Tools</h2>
        <p className="text-xs text-muted-foreground">Select a tool from the list or explore all tools.</p>
        <nav className="text-sm space-y-1">
          {TOOLS.filter((t, i, arr) => arr.findIndex(x => x.href === t.href) === i).map(tool => (
            <Link key={tool.href} href={tool.href} className="block rounded px-2 py-1 hover:bg-accent">
              {tool.title}
            </Link>
          ))}
        </nav>
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  )
}
