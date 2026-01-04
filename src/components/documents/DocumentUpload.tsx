import React, { useState, useRef } from 'react';
import { Upload, X, FileText, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface DocumentUploadProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: {
    file: File;
    title: string;
    description: string;
    category: string;
    requiresSignature: boolean;
  }) => void;
}

const DocumentUpload: React.FC<DocumentUploadProps> = ({
  isOpen,
  onClose,
  onUpload,
}) => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('other');
  const [requiresSignature, setRequiresSignature] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
    
    if (!allowedTypes.includes(file.type)) {
      toast.error('Please upload PDF, DOC, DOCX, or TXT files only');
      return;
    }

    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      toast.error('File size must be less than 10MB');
      return;
    }

    setFile(file);
    if (!title) {
      setTitle(file.name.replace(/\.[^/.]+$/, '')); // Remove extension
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!file) {
      toast.error('Please select a file');
      return;
    }

    if (!title.trim()) {
      toast.error('Please enter a title');
      return;
    }

    onUpload({
      file,
      title: title.trim(),
      description: description.trim(),
      category,
      requiresSignature,
    });

    // Reset form
    setFile(null);
    setTitle('');
    setDescription('');
    setCategory('other');
    setRequiresSignature(false);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Upload Document</h2>
            <p className="text-gray-600 text-sm mt-1">
              Upload contracts, NDAs, or other business documents
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* File Upload Area */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Document File *
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                dragActive
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleChange}
              />
              
              {file ? (
                <div className="space-y-2">
                  <FileText className="w-12 h-12 text-blue-500 mx-auto" />
                  <p className="text-gray-900 font-medium">{file.name}</p>
                  <p className="text-gray-500 text-sm">{formatFileSize(file.size)}</p>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="text-red-500 text-sm hover:text-red-600"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-12 h-12 text-gray-400 mx-auto" />
                  <p className="text-gray-600">
                    Drag and drop your file here, or click to browse
                  </p>
                  <p className="text-gray-500 text-sm">
                    Supported formats: PDF, DOC, DOCX, TXT (Max 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Seed Funding Agreement"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description (Optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              placeholder="Brief description of the document..."
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="contract">Contract</option>
              <option value="nda">Non-Disclosure Agreement</option>
              <option value="term-sheet">Term Sheet</option>
              <option value="pitch-deck">Pitch Deck</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Requires Signature */}
          <div className="flex items-start space-x-3 p-4 bg-blue-50 rounded-lg">
            <input
              type="checkbox"
              id="requiresSignature"
              checked={requiresSignature}
              onChange={(e) => setRequiresSignature(e.target.checked)}
              className="mt-1"
            />
            <div className="flex-1">
              <label
                htmlFor="requiresSignature"
                className="text-sm font-medium text-gray-900 cursor-pointer"
              >
                This document requires signature
              </label>
              <p className="text-xs text-gray-600 mt-1">
                Recipients will be able to electronically sign this document
              </p>
            </div>
          </div>

          {/* Note */}
          <div className="flex items-start space-x-2 p-3 bg-yellow-50 rounded-lg">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-yellow-800">
              Uploaded documents will be visible to shared participants. Make sure you have the right to share this document.
            </p>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
              disabled={!file || !title.trim()}
            >
              Upload Document
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DocumentUpload;