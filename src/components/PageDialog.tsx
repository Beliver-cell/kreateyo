import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RichTextEditor } from './RichTextEditor';
import { AutoSaveIndicator } from './AutoSaveIndicator';

interface PageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  page?: any;
}

export function PageDialog({ open, onOpenChange, page }: PageDialogProps) {
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'error'>('saved');
  const [content, setContent] = useState(page?.content || '');
  const [title, setTitle] = useState(page?.title || '');
  const [slug, setSlug] = useState(page?.slug || '');

  const handleSave = () => {
    setSaveStatus('saving');
    setTimeout(() => {
      setSaveStatus('saved');
      onOpenChange(false);
    }, 1000);
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!page) {
      const generatedSlug = '/' + value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      setSlug(generatedSlug);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{page ? 'Edit Page' : 'New Page'}</DialogTitle>
          <AutoSaveIndicator status={saveStatus} />
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Page Title</Label>
              <Input 
                placeholder="Enter page title" 
                value={title}
                onChange={(e) => handleTitleChange(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label>URL Slug</Label>
              <Input 
                placeholder="/page-url" 
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Page Content</Label>
            <RichTextEditor
              value={content}
              onChange={setContent}
              placeholder="Write your page content..."
              minHeight="400px"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select defaultValue={page?.status || 'draft'}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>SEO Title</Label>
              <Input placeholder="Optional SEO title" />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Meta Description</Label>
            <Input placeholder="Brief description for search engines" />
          </div>

          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} className="flex-1">
              {page ? 'Update Page' : 'Create Page'}
            </Button>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
