"use client"

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Search, Grid2X2, List, Filter } from 'lucide-react';
import { ToolMeta, TOOLS } from '@/lib/tools';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Get unique categories from tools
const categories = ['All', ...Array.from(new Set(TOOLS.map(tool => tool.category)))];

// Types for view mode
type ViewMode = 'grid' | 'list';

// Tool card component
function ToolCard({ title, description, href, category, featured }: ToolMeta) {
  return (
    <div className="h-full flex flex-col border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
            {category}
          </span>
          {featured && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              Featured
            </span>
          )}
        </div>
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm mb-4 flex-1">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        <Link
          href={href}
          className="inline-flex items-center text-sm font-medium text-primary hover:underline mt-auto"
        >
          Try it now
          <svg
            className="ml-1 w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M14 5l7 7m0 0l-7 7m7-7H3"
            />
          </svg>
        </Link>
      </div>
    </div>
  );
}

export default function ToolsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter tools based on search query and selected category
  const filteredTools = useMemo(() => {
    return TOOLS.filter((tool) => {
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
  }, [searchQuery, selectedCategory]);

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
    <div className="py-8 sm:py-12">
      <div className="container px-4 sm:px-6">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight mb-3 sm:mb-4">Tools & Resources</h1>
          <p className="text-base sm:text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover our collection of free online tools to make your work easier and more efficient.
          </p>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-3 sm:gap-4 mb-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-muted-foreground" />
              </div>
              <input
                type="text"
                placeholder="Search tools..."
                className="block w-full pl-10 pr-3 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={cn(
                  'p-2 rounded-md border',
                  viewMode === 'grid' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                )}
                aria-label="Grid view"
              >
                <Grid2X2 className="h-5 w-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={cn(
                  'p-2 rounded-md border',
                  viewMode === 'list' ? 'bg-primary/10 text-primary' : 'hover:bg-accent'
                )}
                aria-label="List view"
              >
                <List className="h-5 w-5" />
              </button>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="md:hidden p-2 rounded-md border hover:bg-accent"
                aria-label="Filter"
              >
                <Filter className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Category Filters */}
          <div className={cn(
            'flex flex-wrap gap-2 mb-8 sm:mb-10 overflow-x-auto py-2',
            isFilterOpen ? 'block' : 'hidden md:flex'
          )}>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={cn(
                  'px-3 py-1 text-sm rounded-full border whitespace-nowrap',
                  selectedCategory === category
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'hover:bg-accent/50 border-input'
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

  {/* Results Count */}
  <div className="mb-8">
          <p className="text-sm text-muted-foreground">
            {filteredTools.length} {filteredTools.length === 1 ? 'tool' : 'tools'} found
            {selectedCategory !== 'All' ? ` in ${selectedCategory}` : ''}
            {searchQuery ? ` for "${searchQuery}"` : ''}
          </p>
        </div>

        {/* Tools Grid/List View */}
        {viewMode === 'grid' ? (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTools.map((tool, index) => (
              <motion.div
                key={tool.slug}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
              >
                <ToolCard {...tool} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="space-y-8">
            {Object.entries(toolsByCategory).map(([category, tools]) => (
              <div key={category}>
                <h2 className="text-xl font-semibold mb-4">{category}</h2>
                <div className="space-y-4">
                  {tools.map((tool) => (
                    <motion.div
                      key={tool.slug}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                      className="p-4 border rounded-lg hover:bg-accent/30 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div>
                          <h3 className="font-medium">{tool.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {tool.description}
                          </p>
                        </div>
                        <Link
                          href={tool.href}
                          className="text-sm font-medium text-primary hover:underline whitespace-nowrap"
                        >
                          Open tool →
                        </Link>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {filteredTools.length === 0 && (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-1">No tools found</h3>
            <p className="text-muted-foreground text-sm">
              Try adjusting your search or filter to find what you're looking for.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
