"use client";

import { useState, useCallback } from 'react';
import { Copy, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type ColorFormat = 'hex' | 'rgb' | 'hsl';

const ColorTool = () => {
  const [color, setColor] = useState('#3b82f6');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<ColorFormat>('hex');
  const [colorName, setColorName] = useState('Blue 500');

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColor(e.target.value);
    setCopied(false);
    // In a real implementation, you might want to update the color name here
  };

  const copyToClipboard = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const convertColor = (format: ColorFormat): string => {
    // Simple conversion for demonstration
    // In a real implementation, you'd want more robust color conversion
    switch (format) {
      case 'rgb':
        return hexToRgb(color) || 'Invalid color';
      case 'hsl':
        return hexToHsl(color) || 'Invalid color';
      case 'hex':
      default:
        return color.toUpperCase();
    }
  };

  // Helper functions for color conversion (simplified)
  const hexToRgb = (hex: string): string | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? `rgb(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)})`
      : null;
  };

  const hexToHsl = (hex: string): string | null => {
    // Simplified conversion for demonstration
    const rgb = hexToRgb(hex);
    if (!rgb) return null;
    
    // This is a placeholder - a real implementation would convert RGB to HSL
    return `hsl(213, 90%, 60%)`;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
        <div className="w-full">
          <Label htmlFor="color-picker" className="block text-sm font-medium mb-1">
            Color Picker
          </Label>
          <div className="flex gap-2">
            <div 
              className="w-12 h-10 rounded border" 
              style={{ backgroundColor: color }}
            />
            <Input
              id="color-picker"
              type="color"
              value={color}
              onChange={handleColorChange}
              className="w-full h-10 p-1"
            />
          </div>
        </div>
        
        <div className="w-full">
          <Label className="block text-sm font-medium mb-1">
            Color Name
          </Label>
          <div className="flex">
            <Input
              value={colorName}
              readOnly
              className="rounded-r-none"
            />
            <Button
              variant="outline"
              size="icon"
              className="rounded-l-none border-l-0"
              onClick={() => copyToClipboard(colorName)}
            >
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Tabs 
          value={activeTab} 
          onValueChange={(value) => setActiveTab(value as ColorFormat)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="hex">HEX</TabsTrigger>
            <TabsTrigger value="rgb">RGB</TabsTrigger>
            <TabsTrigger value="hsl">HSL</TabsTrigger>
          </TabsList>
          <TabsContent value="hex" className="mt-0">
            <ColorCodeDisplay 
              value={convertColor('hex')} 
              onCopy={copyToClipboard} 
            />
          </TabsContent>
          <TabsContent value="rgb" className="mt-0">
            <ColorCodeDisplay 
              value={convertColor('rgb')} 
              onCopy={copyToClipboard} 
            />
          </TabsContent>
          <TabsContent value="hsl" className="mt-0">
            <ColorCodeDisplay 
              value={convertColor('hsl')} 
              onCopy={copyToClipboard} 
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'].map((shade) => {
          // This is a simplified example - in a real app, you'd have actual color values
          const shadeColor = getShadeColor(color, parseInt(shade));
          return (
            <div key={shade} className="space-y-2">
              <div 
                className="w-full h-12 rounded border"
                style={{ backgroundColor: shadeColor }}
              />
              <div className="text-xs text-center">
                <div className="font-medium">{shade}</div>
                <div className="text-muted-foreground">{shadeColor}</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

// Helper component for displaying color codes
const ColorCodeDisplay = ({ 
  value, 
  onCopy 
}: { 
  value: string; 
  onCopy: (text: string) => void;
}) => (
  <div className="flex items-center gap-2">
    <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
      {value}
    </code>
    <Button
      variant="outline"
      size="sm"
      onClick={() => onCopy(value)}
      className="shrink-0"
    >
      <Copy className="h-4 w-4 mr-1" />
      Copy
    </Button>
  </div>
);

// Simplified function to generate color shades (for demonstration)
function getShadeColor(baseColor: string, shade: number): string {
  // This is a simplified example - in a real app, you'd use a proper color manipulation library
  const base = baseColor.replace('#', '');
  const r = parseInt(base.substring(0, 2), 16);
  const g = parseInt(base.substring(2, 4), 16);
  const b = parseInt(base.substring(4, 6), 16);
  
  // Simple lightening/darkening based on shade
  const factor = (shade - 500) / 1000;
  const adjust = (c: number) => {
    const adjusted = c + (255 * factor);
    return Math.min(255, Math.max(0, Math.round(adjusted)));
  };
  
  const newR = adjust(r);
  const newG = adjust(g);
  const newB = adjust(b);
  
  return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
}

export default ColorTool;
