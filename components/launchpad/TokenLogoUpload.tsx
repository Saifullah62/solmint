'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon, CheckCircle } from 'lucide-react';

interface TokenLogoUploadProps {
  onUpload: (file: File) => void;
}

export const TokenLogoUpload = ({ onUpload }: TokenLogoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    // Check file type
    if (!file.type.match('image.*')) {
      alert('Please upload an image file');
      return;
    }

    // Check file size (max 2MB)
    if (file.size > 2 * 1024 * 1024) {
      alert('File size should be less than 2MB');
      return;
    }

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
      setUploadSuccess(true);
      
      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    };
    reader.readAsDataURL(file);

    // Call the onUpload callback
    onUpload(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const handleRemovePreview = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      {preview ? (
        <div className="relative w-full h-40 border-2 border-dashed border-solmint-blackLight rounded-lg overflow-hidden">
          <img 
            src={preview} 
            alt="Token logo preview" 
            className="w-full h-full object-contain"
          />
          <button 
            onClick={handleRemovePreview}
            className="absolute top-2 right-2 bg-solmint-black rounded-full p-1 text-white hover:bg-solmint-violet transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
          
          {uploadSuccess && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-center">
                <CheckCircle className="h-10 w-10 text-green-500 mx-auto mb-2" />
                <p className="text-white font-medium">Upload Successful!</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`w-full h-40 border-2 border-dashed ${
            isDragging ? 'border-solmint-violet bg-solmint-violet/10' : 'border-solmint-blackLight'
          } rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors`}
          onClick={handleButtonClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="text-center p-4">
            <div className="bg-solmint-violet/20 p-3 rounded-full w-fit mx-auto mb-2">
              <ImageIcon className="h-6 w-6 text-solmint-violet" />
            </div>
            <p className="text-gray-300 mb-2">Drag & drop your token logo here</p>
            <p className="text-gray-400 text-sm mb-3">PNG, JPG, or SVG (max. 2MB)</p>
            <Button type="button" size="sm" className="gap-2">
              <Upload className="h-4 w-4" /> Upload Logo
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
