import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Palette, Droplet, Code, Image as ImageIcon, Layers, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Dynamically import the tool component with no SSR
const ColorTool = dynamic(() => import('@/components/tools/color-tool'), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-64 bg-muted/20 rounded-lg">
      <div className="animate-pulse text-muted-foreground">Loading color tool...</div>
    </div>
  ),
});

export const metadata: Metadata = {
  title: 'Color Picker & Converter Tool - Generate, Convert & Extract Colors',
  description: 'A powerful color tool that helps you pick, convert, and extract colors. Get HEX, RGB, HSL codes, generate color palettes, and more. Perfect for designers and developers.',
  keywords: ['color picker', 'color converter', 'HEX to RGB', 'color palette generator', 'color tool', 'web design colors', 'color scheme'],
  openGraph: {
    title: 'Color Picker & Converter Tool - Generate, Convert & Extract Colors',
    description: 'A powerful color tool that helps you pick, convert, and extract colors. Get HEX, RGB, HSL codes, and generate beautiful color palettes.',
    type: 'website',
    url: 'https://yourdomain.com/articles/color-tool',
    images: [
      {
        url: 'https://yourdomain.com/images/color-tool-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Color Picker & Converter Tool',
      },
    ],
  },
};

const features = [
  {
    icon: <Palette className="w-5 h-5" />,
    title: 'Color Picker',
    description: 'Easily pick any color from the color wheel or enter specific values.',
  },
  {
    icon: <Droplet className="w-5 h-5" />,
    title: 'Color Extraction',
    description: 'Extract colors from images (coming soon) to build harmonious palettes.',
  },
  {
    icon: <Code className="w-5 h-5" />,
    title: 'Multiple Formats',
    description: 'Convert between HEX, RGB, and HSL color formats with a single click.',
  },
  {
    icon: <Layers className="w-5 h-5" />,
    title: 'Color Palettes',
    description: 'Generate beautiful color palettes with different shades and tints.',
  },
];

const faqs = [
  {
    question: 'How do I use the color picker?',
    answer: 'Simply click on the color swatch to open the color picker, then choose your desired color. The tool will automatically update all color values and previews.',
  },
  {
    question: 'Can I convert between different color formats?',
    answer: 'Yes! The tool allows you to switch between HEX, RGB, and HSL formats. Just click on the format tabs to see the color in different formats.',
  },
  {
    question: 'How can I copy a color code?',
    answer: 'Click the copy button next to any color code to copy it to your clipboard. The button will show a checkmark when copied.',
  },
  {
    question: 'Can I generate color palettes?',
    answer: 'Absolutely! The tool automatically generates a range of shades and tints for your selected color, helping you create harmonious color schemes.',
  },
];

export default function ColorToolArticle() {
  return (
    <article className="max-w-4xl mx-auto px-4 py-8">
      <header className="mb-12">
        <div className="flex items-center gap-2 mb-4">
          <Badge variant="outline" className="text-sm font-medium">Design Tool</Badge>
          <span className="text-sm text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
        </div>
        
        <h1 className="text-4xl font-bold tracking-tight mb-4">Ultimate Color Picker & Converter Tool</h1>
        
        <p className="text-xl text-muted-foreground mb-6">
          A comprehensive color tool that helps designers and developers pick, convert, and extract colors for their projects.
        </p>
        
        <div className="flex flex-wrap gap-2 mb-8">
          {['#3b82f6', '#10b981', '#f59e0b', '#ef4444'].map((color) => (
            <button
              key={color}
              className="w-8 h-8 rounded-full border-2 border-transparent hover:border-foreground/20 transition-colors"
              style={{ backgroundColor: color }}
              title={`Preview ${color}`}
              aria-label={`Preview color ${color}`}
            />
          ))}
        </div>
      </header>

      <div className="prose prose-lg dark:prose-invert max-w-none mb-16">
        <h2>Why This Color Tool?</h2>
        <p>
          Working with colors is a fundamental part of web design and development. Whether you're creating a brand identity,
          designing a user interface, or developing a website, having the right colors is crucial. Our color tool simplifies
          the process of finding, converting, and managing colors for your projects.
        </p>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 my-8">
          {features.map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center p-4 bg-muted/20 rounded-lg">
              <div className="p-2 rounded-full bg-primary/10 text-primary mb-3">
                {feature.icon}
              </div>
              <h3 className="font-medium mb-1">{feature.title}</h3>
              <p className="text-sm text-muted-foreground">{feature.description}</p>
            </div>
          ))}
        </div>

        <h2>How to Use the Color Tool</h2>
        <p>Our color tool is designed to be intuitive and powerful. Here's how to get the most out of it:</p>
        
        <div className="my-8 p-6 bg-muted/20 rounded-xl">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Palette className="w-5 h-5" />
            Interactive Color Picker
          </h3>
          <p className="mb-4">Use the color picker below to select any color. The tool will automatically update all values and previews.</p>
          
          {/* Color Tool Component */}
          <div className="bg-background border rounded-xl p-6 shadow-sm">
            <ColorTool />
          </div>
        </div>

        <h2>Color Theory Basics</h2>
        <p>
          Understanding color theory can help you create more effective designs. Here are some key concepts:
        </p>
        
        <ul className="my-4 space-y-2">
          <li>• <strong>Hue:</strong> The pure color (red, blue, green, etc.)</li>
          <li>• <strong>Saturation:</strong> The intensity or purity of the color</li>
          <li>• <strong>Lightness:</strong> How light or dark the color is</li>
          <li>• <strong>Complementary colors:</strong> Colors opposite each other on the color wheel</li>
          <li>• <strong>Analogous colors:</strong> Colors next to each other on the color wheel</li>
        </ul>

        <h2>Frequently Asked Questions</h2>
        <div className="space-y-4 mt-6">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b pb-4 last:border-0 last:pb-0">
              <h3 className="font-medium mb-1">{faq.question}</h3>
              <p className="text-muted-foreground">{faq.answer}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-6 bg-primary/5 rounded-xl border border-primary/10">
          <h2 className="text-2xl font-bold mb-3">Ready to use our Color Tool?</h2>
          <p className="mb-4">Start creating beautiful color schemes for your next project today!</p>
          <Button className="gap-2">
            Try the Color Tool
            <ArrowRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}
