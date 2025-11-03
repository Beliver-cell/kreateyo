import { useState } from 'react';
import { 
  Bold, Italic, Underline, List, ListOrdered, 
  Image as ImageIcon, Link as LinkIcon, Code,
  Heading1, Heading2, AlignLeft, AlignCenter, AlignRight,
  Undo, Redo
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}

export function RichTextEditor({ value, onChange, placeholder, minHeight = '300px' }: RichTextEditorProps) {
  const [isFocused, setIsFocused] = useState(false);

  const toolbarButtons = [
    { icon: Undo, label: 'Undo', action: () => {} },
    { icon: Redo, label: 'Redo', action: () => {} },
    { icon: Heading1, label: 'Heading 1', action: () => {} },
    { icon: Heading2, label: 'Heading 2', action: () => {} },
    { icon: Bold, label: 'Bold', action: () => {} },
    { icon: Italic, label: 'Italic', action: () => {} },
    { icon: Underline, label: 'Underline', action: () => {} },
    { icon: List, label: 'Bullet List', action: () => {} },
    { icon: ListOrdered, label: 'Numbered List', action: () => {} },
    { icon: AlignLeft, label: 'Align Left', action: () => {} },
    { icon: AlignCenter, label: 'Align Center', action: () => {} },
    { icon: AlignRight, label: 'Align Right', action: () => {} },
    { icon: LinkIcon, label: 'Insert Link', action: () => {} },
    { icon: ImageIcon, label: 'Insert Image', action: () => {} },
    { icon: Code, label: 'Code Block', action: () => {} },
  ];

  return (
    <div className={cn(
      "border rounded-lg transition-all duration-200",
      isFocused ? "border-primary ring-2 ring-primary/20" : "border-input"
    )}>
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 border-b bg-muted/30">
        {toolbarButtons.map((btn, index) => (
          <Button
            key={index}
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0 hover:bg-primary/10"
            onClick={btn.action}
            title={btn.label}
          >
            <btn.icon className="w-4 h-4" />
          </Button>
        ))}
      </div>

      {/* Editor Area */}
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder || "Start writing..."}
        className="border-0 focus-visible:ring-0 resize-none"
        style={{ minHeight }}
      />
    </div>
  );
}
