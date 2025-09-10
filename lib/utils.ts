import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { ToolMeta, TOOLS } from './tools'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function compressImage(file: File, quality = 0.7): Promise<Blob> {
  const bitmap = await createImageBitmap(file)
  const canvas = document.createElement('canvas')
  canvas.width = bitmap.width
  canvas.height = bitmap.height
  const ctx = canvas.getContext('2d')!
  ctx.drawImage(bitmap, 0, 0)
  return await new Promise<Blob>((resolve) =>
    canvas.toBlob((b) => resolve(b || file), 'image/jpeg', quality)
  )
}

export async function getToolComponent(toolName: string) {
  try {
    const module = await import(`@/components/tools/${toolName}`);
    return module.default;
  } catch (error) {
    console.error(`Failed to load tool component: ${toolName}`, error);
    return null;
  }
}

export function findToolBySlug(slug: string): ToolMeta | undefined {
  return TOOLS.find((tool: ToolMeta) => tool.slug === slug);
}

export function getRelatedTools(article: ToolMeta): ToolMeta[] {
  return TOOLS.filter((tool: ToolMeta) => 
    tool.slug !== article.slug && 
    (tool.category === article.category || 
     (tool.relatedTools && tool.relatedTools.includes(article.slug)))
  ).slice(0, 2);
}
