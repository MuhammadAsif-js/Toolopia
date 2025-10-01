"use client"

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Grid2X2, List, Filter, ArrowUpRight, Star, Layers3, SortDesc } from 'lucide-react';
import { ToolMeta, TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { SectionShell, SectionHeader } from '@/components/section-shell'

// Get unique categories from tools
const categories = ['All', ...Array.from(new Set(TOOLS.map(tool => tool.category)))];

// Types for view mode
type ViewMode = 'grid' | 'list';

// FilterPanel component
type FilterPanelProps = {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  categories: string[];
};

function FilterPanel({ selectedCategory, setSelectedCategory, categories }: FilterPanelProps) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5">
      <div className="font-medium text-foreground mb-3 text-sm">Categories</div>
      <ul className="space-y-2">
        {categories.map((cat) => (
          <li key={cat}>
            <button
              className={cn(
                "w-full text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors",
                selectedCategory === cat
                  ? "bg-primary text-primary-foreground shadow"
                  : "hover:bg-accent/60 text-muted-foreground"
              )}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// Enhanced Tool Card
function ToolCardEnhanced({ title, description, href, category, featured, icon }: ToolMeta) {
  return (
    <motion.div whileHover={{ y: -4 }} className="group relative h-full flex flex-col rounded-2xl border border-border/60 bg-card/60 backdrop-blur-md overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity bg-[radial-gradient(circle_at_20%_15%,rgba(99,102,241,0.25),transparent_60%)]" />
      <div className="absolute inset-0 pointer-events-none mix-blend-overlay opacity-0 group-hover:opacity-100 transition-opacity bg-[linear-gradient(120deg,rgba(255,255,255,0.12),rgba(255,255,255,0))]" />
      <div className="p-6 flex-1 flex flex-col relative">
        <div className="flex items-start justify-between mb-4">
          <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 text-primary px-2.5 py-0.5 text-[11px] font-medium tracking-wide">
            {icon && <span className="text-sm leading-none">{icon}</span>} {category}
          </span>
          {featured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 text-amber-600 dark:text-amber-400 px-2 py-0.5 text-[11px] font-medium">
              <Star className="h-3.5 w-3.5" />
              New
            </span>
          )}
        </div>
        <h3 className="text-base sm:text-lg font-semibold leading-snug mb-2 pr-4 line-clamp-2">{title}</h3>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1 mb-4">
          {description}
        </p>
        <div className="mt-auto flex justify-end">
          <Link href={href} className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline">
            Open <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent opacity-40" />
    </motion.div>
  )
}

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sort, setSort] = useState<SortState>('title-asc');

  // Filter and sort tools based on search query, selected category, and sort state
  const filteredTools = useMemo(() => {
    const filtered = TOOLS.filter((tool) => {
      const matchesSearch = 
        tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tool.keywords?.some(keyword => 
          keyword.toLowerCase().includes(searchQuery.toLowerCase())
        );
      
      const matchesCategory = 
        selectedCategory === 'All' || tool.category === selectedCategory;
      
      return matchesSearch && matchesCategory;
    });

    return filtered.sort((a, b) => {
      if (sort === 'title-asc') {
        return a.title.localeCompare(b.title);
      } else {
        return b.title.localeCompare(a.title);
      }
    });
  }, [searchQuery, selectedCategory, sort]);

  // Group tools by category for the list view
  const toolsByCategory = useMemo(() => {
    const groups: Record<string, ToolMeta[]> = {};
    
    filteredTools.forEach((tool) => {
      if (!groups[tool.category]) {
        groups[tool.category] = [];
      }
      groups[tool.category].push(tool);
    });
    
    return groups;
  }, [filteredTools]);

  return (
    <div className="relative py-16 sm:py-20 md:py-24">
      <SectionShell className="max-w-7xl">
        <SectionHeader
          eyebrow="Toolkit"
            title="All-in-one utility workspace"
            description="Search, filter and launch focused, privacy-first tools. Lightweight by design."
        />
        <div className="relative mb-10">
          <div className="flex flex-col xl:flex-row gap-8">
            {/* Sidebar Filters (desktop) */}
            <aside className="xl:w-60 xl:shrink-0">
              <div className="hidden xl:block sticky top-28 space-y-8">
                <FilterPanel
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  categories={categories}
                />
                <div className="rounded-2xl border border-border/60 bg-card/60 backdrop-blur p-5 text-xs leading-relaxed text-muted-foreground">
                  <p className="font-medium text-foreground mb-2 text-sm">Tips</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Use keywords like “pdf” or “color”.</li>
                    <li>Filter by category to narrow.</li>
                    <li>Starred = recently enhanced.</li>
                  </ul>
                </div>
              </div>
            </aside>
            <div className="flex-1 min-w-0">
              {/* Search / controls */}
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                <div className="relative flex-1">
                  <Search className="h-5 w-5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search tools (e.g. pdf, color, finance)..."
                    className="w-full rounded-xl border bg-background/80 backdrop-blur pl-10 pr-4 py-2.5 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
                    value={searchQuery}
                    onChange={(e)=>setSearchQuery(e.target.value)}
                  />
                  <AnimatePresence>
                  {searchQuery && (
                    <motion.button
                      initial={{opacity:0, scale:0.85}}
                      animate={{opacity:1, scale:1}}
                      exit={{opacity:0, scale:0.85}}
                      onClick={()=>setSearchQuery('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-[11px] px-2 py-1 rounded-md bg-muted hover:bg-muted/80 text-muted-foreground/90"
                    >Clear</motion.button>
                  )}
                  </AnimatePresence>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn('p-2 rounded-lg border text-xs font-medium flex items-center gap-1', viewMode==='grid' ? 'bg-primary text-primary-foreground border-primary shadow' : 'hover:bg-accent/60')}
                  ><Grid2X2 className="h-4 w-4" /> Grid</button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn('p-2 rounded-lg border text-xs font-medium flex items-center gap-1', viewMode==='list' ? 'bg-primary text-primary-foreground border-primary shadow' : 'hover:bg-accent/60')}
                  ><List className="h-4 w-4" /> List</button>
                  <button
                    onClick={()=>setIsFilterOpen(o=>!o)}
                    className="xl:hidden p-2 rounded-lg border text-xs font-medium flex items-center gap-1 hover:bg-accent/60"
                  ><Filter className="h-4 w-4" /> Filters</button>
                  <button
                    onClick={()=>setSort(s=> s==='title-asc' ? 'title-desc' : 'title-asc')}
                    className="p-2 rounded-lg border text-xs font-medium flex items-center gap-1 hover:bg-accent/60"
                  ><SortDesc className="h-4 w-4" /> Sort</button>
                </div>
              </div>
              {/* Mobile filter panel */}
              {isFilterOpen && (
                <div className="xl:hidden mb-8">
                  <FilterPanel selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} categories={categories} />
                </div>
              )}
              <div className="mb-6 text-xs text-muted-foreground font-medium tracking-wide">
                {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'}
                {selectedCategory !== 'All' && <span> in <span className="text-foreground/90">{selectedCategory}</span></span>}
                {searchQuery && <span> matching <span className="text-foreground/90">{searchQuery}</span></span>}
              </div>
              {/* Results */}
              {viewMode === 'grid' ? (
                <div className="grid gap-5 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredTools.map((tool, i) => (
                    <motion.div
                      key={tool.slug}
                      initial={{opacity:0,y:20}}
                      animate={{opacity:1,y:0}}
                      transition={{delay: i * 0.025}}
                    >
                      <ToolCardEnhanced {...tool} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="space-y-10">
                  {Object.entries(toolsByCategory).map(([category, tools]) => (
                    <div key={category}>
                      <h2 className="text-sm font-semibold tracking-wide mb-4 uppercase text-muted-foreground/80 flex items-center gap-2"><Layers3 className="h-4 w-4" /> {category}</h2>
                      <div className="space-y-3">
                        {tools.map(tool => (
                          <motion.div
                            key={tool.slug}
                            initial={{opacity:0,x:-12}}
                            animate={{opacity:1,x:0}}
                            transition={{duration:.25}}
                            className="group rounded-xl border border-border/60 bg-card/40 backdrop-blur p-4 flex flex-col sm:flex-row sm:items-center gap-4 hover:bg-card/70 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-medium text-sm sm:text-base tracking-tight line-clamp-1">{tool.title}</h3>
                                {tool.featured && <Star className="h-3.5 w-3.5 text-amber-500" />}
                              </div>
                              <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2">{tool.description}</p>
                            </div>
                            <Link href={tool.href} className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline shrink-0">
                              Open <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {filteredTools.length === 0 && (
                <div className="text-center py-16">
                  <div className="mx-auto w-16 h-16 rounded-full bg-accent/30 flex items-center justify-center mb-5">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No tools found</h3>
                  <p className="text-sm text-muted-foreground max-w-sm mx-auto">Try adjusting filters or clearing your search keywords.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </SectionShell>
    </div>
  );
}

type SortState = 'title-asc' | 'title-desc'
