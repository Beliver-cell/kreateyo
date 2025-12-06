import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  GripVertical, 
  Settings, 
  Eye, 
  Save, 
  Undo, 
  Redo, 
  Palette,
  Type,
  Image,
  Layout,
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  Check,
  X
} from 'lucide-react';
import { toast } from 'sonner';

interface Block {
  id: string;
  templateId: string;
  blockType: string;
  name: string;
  defaultContent: Record<string, any>;
  schema: Record<string, any>;
  orderIndex: number;
  isRequired: boolean;
}

interface TemplateInstance {
  id: string;
  businessId: string;
  templateId: string;
  customizations: Record<string, any>;
  blockOverrides: Record<string, any>;
  isPublished: boolean;
}

interface TemplateEditorProps {
  businessId: string;
  templateId: string;
  templateName: string;
  onSave?: () => void;
  onPublish?: () => void;
}

const blockTypeIcons: Record<string, any> = {
  hero: Layout,
  features: Settings,
  testimonials: Type,
  pricing: Settings,
  gallery: Image,
  cta: Layout,
  header: Layout,
  footer: Layout,
  products: Image,
  services: Settings,
  about: Type,
  contact: Settings,
};

export function TemplateEditor({ 
  businessId, 
  templateId, 
  templateName,
  onSave,
  onPublish 
}: TemplateEditorProps) {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [instance, setInstance] = useState<TemplateInstance | null>(null);
  const [selectedBlockId, setSelectedBlockId] = useState<string | null>(null);
  const [blockOverrides, setBlockOverrides] = useState<Record<string, any>>({});
  const [globalCustomizations, setGlobalCustomizations] = useState<Record<string, any>>({
    colors: {
      primary: '#6366f1',
      secondary: '#8b5cf6',
      background: '#ffffff',
      text: '#1f2937',
      accent: '#ec4899',
    },
    fonts: {
      heading: 'Inter',
      body: 'Inter',
    },
    spacing: 'normal',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeTab, setActiveTab] = useState('blocks');
  const [draggedBlockId, setDraggedBlockId] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, [templateId, businessId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [blocksRes, instanceRes] = await Promise.all([
        fetch(`/api/templates/${templateId}/blocks`),
        fetch(`/api/templates/business/${businessId}`),
      ]);

      if (blocksRes.ok) {
        const blocksData = await blocksRes.json();
        setBlocks(blocksData);
        if (blocksData.length > 0) {
          setSelectedBlockId(blocksData[0].id);
        }
      }

      if (instanceRes.ok) {
        const instanceData = await instanceRes.json();
        const currentInstance = instanceData.find((i: any) => i.template.id === templateId);
        if (currentInstance) {
          setInstance(currentInstance.instance);
          setBlockOverrides(currentInstance.instance.blockOverrides || {});
          setGlobalCustomizations({
            ...globalCustomizations,
            ...(currentInstance.instance.customizations || {}),
          });
        }
      }
    } catch (error) {
      console.error('Error fetching template data:', error);
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const handleBlockSelect = (blockId: string) => {
    setSelectedBlockId(blockId);
    setActiveTab('properties');
  };

  const getBlockContent = (block: Block) => {
    return blockOverrides[block.id] || block.defaultContent;
  };

  const updateBlockContent = (blockId: string, content: Record<string, any>) => {
    setBlockOverrides(prev => ({
      ...prev,
      [blockId]: {
        ...(prev[blockId] || {}),
        ...content,
      },
    }));
    setHasChanges(true);
  };

  const handleMoveBlock = (blockId: string, direction: 'up' | 'down') => {
    const index = blocks.findIndex(b => b.id === blockId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === blocks.length - 1)
    ) {
      return;
    }

    const newBlocks = [...blocks];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBlocks[index], newBlocks[targetIndex]] = [newBlocks[targetIndex], newBlocks[index]];
    
    newBlocks.forEach((block, i) => {
      block.orderIndex = i;
    });
    
    setBlocks(newBlocks);
    setHasChanges(true);
  };

  const handleDragStart = (blockId: string) => {
    setDraggedBlockId(blockId);
  };

  const handleDragOver = (e: React.DragEvent, targetBlockId: string) => {
    e.preventDefault();
    if (!draggedBlockId || draggedBlockId === targetBlockId) return;

    const draggedIndex = blocks.findIndex(b => b.id === draggedBlockId);
    const targetIndex = blocks.findIndex(b => b.id === targetBlockId);

    const newBlocks = [...blocks];
    const [draggedBlock] = newBlocks.splice(draggedIndex, 1);
    newBlocks.splice(targetIndex, 0, draggedBlock);
    
    newBlocks.forEach((block, i) => {
      block.orderIndex = i;
    });

    setBlocks(newBlocks);
  };

  const handleDragEnd = () => {
    setDraggedBlockId(null);
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const blockOrder = blocks.map(b => b.id);
      const reorderResponse = await fetch(`/api/templates/business/${businessId}/blocks/reorder`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockOrder }),
      });

      if (!reorderResponse.ok) {
        console.warn('Block order save failed, continuing with other saves');
      }

      const response = await fetch(`/api/templates/business/${businessId}/customize`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customizations: globalCustomizations,
          blockOverrides,
        }),
      });

      if (response.ok) {
        toast.success('Template saved successfully');
        setHasChanges(false);
        onSave?.();
      } else {
        throw new Error('Failed to save');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Failed to save template');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    try {
      await handleSave();
      
      const response = await fetch(`/api/templates/business/${businessId}/publish`, {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Template published successfully');
        onPublish?.();
      } else {
        throw new Error('Failed to publish');
      }
    } catch (error) {
      console.error('Error publishing template:', error);
      toast.error('Failed to publish template');
    }
  };

  const selectedBlock = blocks.find(b => b.id === selectedBlockId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-muted-foreground">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between p-4 border-b bg-background">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-semibold">{templateName}</h2>
          {hasChanges && (
            <Badge variant="outline" className="text-orange-500 border-orange-500">
              Unsaved changes
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPreviewMode(!previewMode)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {previewMode ? 'Edit' : 'Preview'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleSave}
            disabled={!hasChanges || saving}
          >
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button size="sm" onClick={handlePublish}>
            <Check className="h-4 w-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r flex flex-col bg-muted/30">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="w-full rounded-none border-b">
              <TabsTrigger value="blocks" className="flex-1">Blocks</TabsTrigger>
              <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
              <TabsTrigger value="style" className="flex-1">Style</TabsTrigger>
            </TabsList>

            <TabsContent value="blocks" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-2">
                  {blocks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No blocks available for this template
                    </p>
                  ) : (
                    blocks.map((block, index) => {
                      const Icon = blockTypeIcons[block.blockType] || Layout;
                      return (
                        <div
                          key={block.id}
                          draggable
                          onDragStart={() => handleDragStart(block.id)}
                          onDragOver={(e) => handleDragOver(e, block.id)}
                          onDragEnd={handleDragEnd}
                          onClick={() => handleBlockSelect(block.id)}
                          className={`
                            flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all
                            ${selectedBlockId === block.id 
                              ? 'bg-primary/10 border-primary' 
                              : 'bg-background hover:bg-muted border-border'
                            }
                            ${draggedBlockId === block.id ? 'opacity-50' : ''}
                          `}
                        >
                          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                          <Icon className="h-4 w-4 text-muted-foreground" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{block.name}</p>
                            <p className="text-xs text-muted-foreground">{block.blockType}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveBlock(block.id, 'up');
                              }}
                              disabled={index === 0}
                            >
                              <ChevronUp className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMoveBlock(block.id, 'down');
                              }}
                              disabled={index === blocks.length - 1}
                            >
                              <ChevronDown className="h-3 w-3" />
                            </Button>
                          </div>
                          {block.isRequired && (
                            <Badge variant="secondary" className="text-xs">Required</Badge>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="properties" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4">
                  {selectedBlock ? (
                    <BlockPropertyEditor
                      block={selectedBlock}
                      content={getBlockContent(selectedBlock)}
                      onChange={(content) => updateBlockContent(selectedBlock.id, content)}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Select a block to edit its properties
                    </p>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="style" className="flex-1 m-0 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-6">
                  <GlobalStyleEditor
                    customizations={globalCustomizations}
                    onChange={(updates) => {
                      setGlobalCustomizations(prev => ({ ...prev, ...updates }));
                      setHasChanges(true);
                    }}
                  />
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-1 overflow-auto bg-muted/20">
          <div className="p-6">
            <TemplatePreview
              blocks={blocks}
              blockOverrides={blockOverrides}
              customizations={globalCustomizations}
              selectedBlockId={selectedBlockId}
              onBlockSelect={handleBlockSelect}
              previewMode={previewMode}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

interface BlockPropertyEditorProps {
  block: Block;
  content: Record<string, any>;
  onChange: (content: Record<string, any>) => void;
}

function BlockPropertyEditor({ block, content, onChange }: BlockPropertyEditorProps) {
  const schema = block.schema as Record<string, any>;
  const properties = schema.properties || {};

  const handleChange = (key: string, value: any) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-medium">{block.name}</h3>
        <p className="text-sm text-muted-foreground">{block.blockType} block</p>
      </div>
      <Separator />
      
      {Object.entries(properties).length === 0 ? (
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={content.title || ''}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Enter title"
            />
          </div>
          <div>
            <Label htmlFor="subtitle">Subtitle</Label>
            <Input
              id="subtitle"
              value={content.subtitle || ''}
              onChange={(e) => handleChange('subtitle', e.target.value)}
              placeholder="Enter subtitle"
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={content.description || ''}
              onChange={(e) => handleChange('description', e.target.value)}
              placeholder="Enter description"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="buttonText">Button Text</Label>
            <Input
              id="buttonText"
              value={content.buttonText || ''}
              onChange={(e) => handleChange('buttonText', e.target.value)}
              placeholder="Enter button text"
            />
          </div>
          <div>
            <Label htmlFor="buttonLink">Button Link</Label>
            <Input
              id="buttonLink"
              value={content.buttonLink || ''}
              onChange={(e) => handleChange('buttonLink', e.target.value)}
              placeholder="Enter button URL"
            />
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              value={content.imageUrl || ''}
              onChange={(e) => handleChange('imageUrl', e.target.value)}
              placeholder="Enter image URL"
            />
          </div>
        </div>
      ) : (
        Object.entries(properties).map(([key, prop]: [string, any]) => (
          <div key={key}>
            <Label htmlFor={key}>{prop.title || key}</Label>
            {prop.type === 'string' && prop.format === 'textarea' ? (
              <Textarea
                id={key}
                value={content[key] || ''}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={prop.description || `Enter ${key}`}
                rows={3}
              />
            ) : prop.type === 'boolean' ? (
              <div className="flex items-center gap-2 mt-1">
                <input
                  type="checkbox"
                  id={key}
                  checked={content[key] || false}
                  onChange={(e) => handleChange(key, e.target.checked)}
                  className="h-4 w-4"
                />
                <span className="text-sm text-muted-foreground">{prop.description}</span>
              </div>
            ) : (
              <Input
                id={key}
                type={prop.type === 'number' ? 'number' : 'text'}
                value={content[key] || ''}
                onChange={(e) => handleChange(key, prop.type === 'number' ? Number(e.target.value) : e.target.value)}
                placeholder={prop.description || `Enter ${key}`}
              />
            )}
          </div>
        ))
      )}
    </div>
  );
}

interface GlobalStyleEditorProps {
  customizations: Record<string, any>;
  onChange: (updates: Record<string, any>) => void;
}

function GlobalStyleEditor({ customizations, onChange }: GlobalStyleEditorProps) {
  const colors = customizations.colors || {};
  const fonts = customizations.fonts || {};

  const handleColorChange = (key: string, value: string) => {
    onChange({
      colors: { ...colors, [key]: value },
    });
  };

  const handleFontChange = (key: string, value: string) => {
    onChange({
      fonts: { ...fonts, [key]: value },
    });
  };

  const fontOptions = [
    'Inter',
    'Roboto',
    'Open Sans',
    'Lato',
    'Montserrat',
    'Poppins',
    'Playfair Display',
    'Merriweather',
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Colors
        </h3>
        <div className="space-y-3">
          {[
            { key: 'primary', label: 'Primary Color' },
            { key: 'secondary', label: 'Secondary Color' },
            { key: 'background', label: 'Background' },
            { key: 'text', label: 'Text Color' },
            { key: 'accent', label: 'Accent Color' },
          ].map(({ key, label }) => (
            <div key={key} className="flex items-center gap-3">
              <input
                type="color"
                value={colors[key] || '#000000'}
                onChange={(e) => handleColorChange(key, e.target.value)}
                className="w-10 h-10 rounded border cursor-pointer"
              />
              <div className="flex-1">
                <Label className="text-sm">{label}</Label>
                <Input
                  value={colors[key] || ''}
                  onChange={(e) => handleColorChange(key, e.target.value)}
                  placeholder="#000000"
                  className="h-8 mt-1"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <Type className="h-4 w-4" />
          Typography
        </h3>
        <div className="space-y-3">
          <div>
            <Label>Heading Font</Label>
            <select
              value={fonts.heading || 'Inter'}
              onChange={(e) => handleFontChange('heading', e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
          <div>
            <Label>Body Font</Label>
            <select
              value={fonts.body || 'Inter'}
              onChange={(e) => handleFontChange('body', e.target.value)}
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
            >
              {fontOptions.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}

interface TemplatePreviewProps {
  blocks: Block[];
  blockOverrides: Record<string, any>;
  customizations: Record<string, any>;
  selectedBlockId: string | null;
  onBlockSelect: (blockId: string) => void;
  previewMode: boolean;
}

function TemplatePreview({
  blocks,
  blockOverrides,
  customizations,
  selectedBlockId,
  onBlockSelect,
  previewMode,
}: TemplatePreviewProps) {
  const colors = customizations.colors || {};
  const fonts = customizations.fonts || {};

  if (blocks.length === 0) {
    return (
      <div className="flex items-center justify-center h-96 border-2 border-dashed rounded-lg">
        <p className="text-muted-foreground">No blocks to display</p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg border shadow-sm overflow-hidden"
      style={{
        fontFamily: fonts.body || 'Inter',
        backgroundColor: colors.background || '#ffffff',
        color: colors.text || '#1f2937',
      }}
    >
      {blocks.map((block) => {
        const content = blockOverrides[block.id] || block.defaultContent;
        const isSelected = selectedBlockId === block.id && !previewMode;

        return (
          <div
            key={block.id}
            onClick={() => !previewMode && onBlockSelect(block.id)}
            className={`
              relative transition-all
              ${!previewMode ? 'cursor-pointer hover:ring-2 hover:ring-primary/50' : ''}
              ${isSelected ? 'ring-2 ring-primary' : ''}
            `}
          >
            {!previewMode && isSelected && (
              <div className="absolute top-2 left-2 z-10">
                <Badge variant="default" className="text-xs">
                  {block.name}
                </Badge>
              </div>
            )}
            
            <BlockRenderer
              blockType={block.blockType}
              content={content}
              colors={colors}
              fonts={fonts}
            />
          </div>
        );
      })}
    </div>
  );
}

interface BlockRendererProps {
  blockType: string;
  content: Record<string, any>;
  colors: Record<string, any>;
  fonts: Record<string, any>;
}

function BlockRenderer({ blockType, content, colors, fonts }: BlockRendererProps) {
  switch (blockType) {
    case 'hero':
      return (
        <div 
          className="py-20 px-8 text-center"
          style={{ backgroundColor: colors.primary || '#6366f1' }}
        >
          <h1 
            className="text-4xl font-bold mb-4"
            style={{ fontFamily: fonts.heading, color: '#ffffff' }}
          >
            {content.title || 'Welcome to Your Business'}
          </h1>
          <p className="text-xl mb-8 opacity-90" style={{ color: '#ffffff' }}>
            {content.subtitle || 'Your tagline goes here'}
          </p>
          {content.buttonText && (
            <button 
              className="px-8 py-3 rounded-lg font-medium text-lg"
              style={{ backgroundColor: colors.accent || '#ec4899', color: '#ffffff' }}
            >
              {content.buttonText}
            </button>
          )}
        </div>
      );

    case 'features':
      const features = content.features || [
        { title: 'Feature 1', description: 'Description for feature 1' },
        { title: 'Feature 2', description: 'Description for feature 2' },
        { title: 'Feature 3', description: 'Description for feature 3' },
      ];
      return (
        <div className="py-16 px-8">
          <h2 
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: fonts.heading }}
          >
            {content.title || 'Our Features'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {features.map((feature: any, index: number) => (
              <div key={index} className="text-center p-6">
                <div 
                  className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center"
                  style={{ backgroundColor: `${colors.primary}20` }}
                >
                  <Settings className="w-8 h-8" style={{ color: colors.primary }} />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'testimonials':
      const testimonials = content.testimonials || [
        { name: 'John Doe', text: 'Great service!', role: 'Customer' },
      ];
      return (
        <div className="py-16 px-8" style={{ backgroundColor: `${colors.primary}10` }}>
          <h2 
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: fonts.heading }}
          >
            {content.title || 'What Our Customers Say'}
          </h2>
          <div className="max-w-4xl mx-auto">
            {testimonials.map((testimonial: any, index: number) => (
              <div key={index} className="bg-background p-6 rounded-lg shadow-sm mb-4">
                <p className="text-lg italic mb-4">"{testimonial.text}"</p>
                <p className="font-medium">{testimonial.name}</p>
                <p className="text-sm text-muted-foreground">{testimonial.role}</p>
              </div>
            ))}
          </div>
        </div>
      );

    case 'cta':
      return (
        <div 
          className="py-16 px-8 text-center"
          style={{ backgroundColor: colors.secondary || '#8b5cf6' }}
        >
          <h2 
            className="text-3xl font-bold mb-4"
            style={{ fontFamily: fonts.heading, color: '#ffffff' }}
          >
            {content.title || 'Ready to Get Started?'}
          </h2>
          <p className="text-xl mb-8" style={{ color: '#ffffffcc' }}>
            {content.description || 'Join thousands of satisfied customers today.'}
          </p>
          {content.buttonText && (
            <button 
              className="px-8 py-3 rounded-lg font-medium text-lg bg-white"
              style={{ color: colors.secondary }}
            >
              {content.buttonText}
            </button>
          )}
        </div>
      );

    case 'about':
      return (
        <div className="py-16 px-8">
          <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 
                className="text-3xl font-bold mb-4"
                style={{ fontFamily: fonts.heading }}
              >
                {content.title || 'About Us'}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {content.description || 'Tell your story here. Share what makes your business unique and why customers should choose you.'}
              </p>
            </div>
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
              {content.imageUrl ? (
                <img src={content.imageUrl} alt="About" className="w-full h-full object-cover rounded-lg" />
              ) : (
                <Image className="w-16 h-16 text-muted-foreground" />
              )}
            </div>
          </div>
        </div>
      );

    case 'contact':
      return (
        <div className="py-16 px-8">
          <h2 
            className="text-3xl font-bold text-center mb-12"
            style={{ fontFamily: fonts.heading }}
          >
            {content.title || 'Contact Us'}
          </h2>
          <div className="max-w-lg mx-auto space-y-4">
            <Input placeholder="Your Name" />
            <Input placeholder="Your Email" type="email" />
            <Textarea placeholder="Your Message" rows={4} />
            <Button 
              className="w-full"
              style={{ backgroundColor: colors.primary }}
            >
              {content.buttonText || 'Send Message'}
            </Button>
          </div>
        </div>
      );

    case 'header':
      return (
        <div className="py-4 px-8 flex items-center justify-between border-b">
          <div className="font-bold text-xl">{content.logo || 'Logo'}</div>
          <nav className="flex gap-6">
            {(content.links || ['Home', 'About', 'Services', 'Contact']).map((link: string, i: number) => (
              <a key={i} href="#" className="text-sm hover:underline">{link}</a>
            ))}
          </nav>
        </div>
      );

    case 'footer':
      return (
        <div className="py-8 px-8 border-t">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-muted-foreground">
              {content.copyright || `© ${new Date().getFullYear()} Your Business. All rights reserved.`}
            </p>
            <div className="flex gap-4">
              {(content.socialLinks || ['Facebook', 'Twitter', 'Instagram']).map((link: string, i: number) => (
                <a key={i} href="#" className="text-sm text-muted-foreground hover:underline">{link}</a>
              ))}
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className="py-12 px-8 text-center border-y">
          <p className="text-muted-foreground">
            {blockType.charAt(0).toUpperCase() + blockType.slice(1)} Block
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {content.title || 'Configure this block in the properties panel'}
          </p>
        </div>
      );
  }
}

export default TemplateEditor;
