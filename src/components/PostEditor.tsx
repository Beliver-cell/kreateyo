import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { RichTextEditor } from './RichTextEditor';
import { MediaLibrary } from './MediaLibrary';
import { AutoSaveIndicator } from './AutoSaveIndicator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, X } from 'lucide-react';
import { format } from 'date-fns';

interface PostEditorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post?: any;
}

export function PostEditor({ open, onOpenChange, post }: PostEditorProps) {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    content: post?.excerpt || '',
    excerpt: '',
    status: post?.status || 'draft',
    visibility: 'public',
    categories: [] as string[],
    tags: [] as string[],
    scheduledDate: undefined as Date | undefined,
  });
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [tagInput, setTagInput] = useState('');
  const [categoryInput, setCategoryInput] = useState('');

  const handleAddTag = () => {
    if (tagInput && !formData.tags.includes(tagInput)) {
      setFormData(prev => ({ ...prev, tags: [...prev.tags, tagInput] }));
      setTagInput('');
    }
  };

  const handleAddCategory = () => {
    if (categoryInput && !formData.categories.includes(categoryInput)) {
      setFormData(prev => ({ ...prev, categories: [...prev.categories, categoryInput] }));
      setCategoryInput('');
    }
  };

  const handleSave = (action: 'draft' | 'publish' | 'schedule') => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      onOpenChange(false);
    }, 1000);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              {post ? 'Edit Post' : 'Write New Post'}
            </DialogTitle>
            <AutoSaveIndicator status={saveStatus} />
          </div>
        </DialogHeader>

        <div className="flex">
          {/* Main Editor Area */}
          <ScrollArea className="flex-1 h-[calc(90vh-140px)]">
            <div className="px-6 py-4 space-y-6">
              <div className="space-y-2">
                <Input
                  placeholder="Post Title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="text-3xl font-bold border-0 px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
                />
              </div>

              <div className="space-y-2">
                <RichTextEditor
                  value={formData.content}
                  onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                  placeholder="Write your post content here..."
                  minHeight="500px"
                />
              </div>
            </div>
          </ScrollArea>

          {/* Sidebar */}
          <div className="w-80 border-l bg-muted/30">
            <ScrollArea className="h-[calc(90vh-140px)]">
              <div className="p-6 space-y-6">
                {/* Status */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Status</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.status === 'draft' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, status: 'draft' }))}
                      className="flex-1"
                    >
                      Draft
                    </Button>
                    <Button
                      type="button"
                      variant={formData.status === 'published' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, status: 'published' }))}
                      className="flex-1"
                    >
                      Published
                    </Button>
                  </div>
                </div>

                {/* Featured Image */}
                <div className="space-y-3">
                  <Label className="text-base font-semibold">Featured Image</Label>
                  <div className="border-2 border-dashed rounded-lg p-4 text-center">
                    <input type="file" id="featured-image" className="hidden" accept="image/*" />
                    <label htmlFor="featured-image" className="cursor-pointer">
                      <div className="w-12 h-12 mx-auto mb-2 rounded-lg bg-primary/10 flex items-center justify-center">
                        <CalendarIcon className="w-6 h-6 text-primary" />
                      </div>
                      <p className="text-sm text-muted-foreground">Upload featured image</p>
                    </label>
                  </div>
                </div>

                {/* Excerpt */}
                <div className="space-y-2">
                  <Label htmlFor="excerpt">Excerpt</Label>
                  <textarea
                    id="excerpt"
                    placeholder="Brief summary..."
                    value={formData.excerpt}
                    onChange={(e) => setFormData(prev => ({ ...prev, excerpt: e.target.value }))}
                    className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <Label>Categories</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add category"
                      value={categoryInput}
                      onChange={(e) => setCategoryInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddCategory()}
                    />
                    <Button type="button" onClick={handleAddCategory} size="sm">Add</Button>
                  </div>
                  {formData.categories.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.categories.map(cat => (
                        <Badge key={cat} variant="secondary" className="gap-1">
                          {cat}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              categories: prev.categories.filter(c => c !== cat)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Tags */}
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add tag"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                    />
                    <Button type="button" onClick={handleAddTag} size="sm">Add</Button>
                  </div>
                  {formData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {formData.tags.map(tag => (
                        <Badge key={tag} variant="outline" className="gap-1">
                          {tag}
                          <X
                            className="w-3 h-3 cursor-pointer"
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              tags: prev.tags.filter(t => t !== tag)
                            }))}
                          />
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                {/* Visibility */}
                <div className="space-y-2">
                  <Label>Visibility</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={formData.visibility === 'public' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, visibility: 'public' }))}
                      className="flex-1"
                      size="sm"
                    >
                      Public
                    </Button>
                    <Button
                      type="button"
                      variant={formData.visibility === 'password' ? 'default' : 'outline'}
                      onClick={() => setFormData(prev => ({ ...prev, visibility: 'password' }))}
                      className="flex-1"
                      size="sm"
                    >
                      Password
                    </Button>
                  </div>
                </div>

                {/* Schedule */}
                <div className="space-y-2">
                  <Label>Schedule</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.scheduledDate ? format(formData.scheduledDate, 'PPP') : 'Pick a date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.scheduledDate}
                        onSelect={(date) => setFormData(prev => ({ ...prev, scheduledDate: date }))}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex items-center justify-between">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => handleSave('draft')}>
              Save Draft
            </Button>
            <Button variant="outline" onClick={() => handleSave('schedule')}>
              Schedule
            </Button>
            <Button onClick={() => handleSave('publish')} className="bg-primary hover:bg-primary/90">
              {post ? 'Update' : 'Publish'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
