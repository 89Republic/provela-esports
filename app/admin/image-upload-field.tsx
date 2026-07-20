'use client';

import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePreview } from './admin-ui';

interface ImageUploadFieldProps {
  value: string;
  onChange: (url: string) => void;
  alt: string;
  folder?: string;
  placeholder?: string;
  contain?: boolean;
}

export function ImageUploadField({
  value,
  onChange,
  alt,
  folder = 'divisions',
  placeholder = '/uploads/divisions/photo.jpg',
  contain,
}: ImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  async function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;

    setIsUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', folder);

      const response = await fetch('/api/admin/uploads', {
        method: 'POST',
        body: formData,
      });

      const data = (await response.json()) as { url?: string; error?: string };

      if (!response.ok || !data.url) {
        setError(data.error ?? 'Upload failed.');
        return;
      }

      onChange(data.url);
    } catch {
      setError('Upload failed.');
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start">
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="flex-1"
        />
        <Button
          type="button"
          variant="outline"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="shrink-0"
        >
          <Upload className="size-4 mr-2" />
          {isUploading ? 'Uploading…' : 'Upload Image'}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <ImagePreview src={value} alt={alt} contain={contain} />
    </div>
  );
}
