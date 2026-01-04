export type DocumentStatus = 'draft' | 'in-review' | 'signed' | 'rejected';

export interface DocumentSignature {
  id: string;
  signedBy: string;
  signedByRole: 'entrepreneur' | 'investor';
  signatureData: string; // base64 image data
  signedAt: Date;
}

export interface Document {
  id: string;
  title: string;
  description?: string;
  fileType: 'pdf' | 'docx' | 'doc' | 'txt';
  fileSize: string;
  fileUrl?: string; // For preview
  status: DocumentStatus;
  uploadedBy: string;
  uploadedByRole: 'entrepreneur' | 'investor';
  uploadedAt: Date;
  lastModified: Date;
  signatures: DocumentSignature[];
  sharedWith: string[]; // user IDs
  requiresSignature: boolean;
  updatedAt: string;
  category?: 'contract' | 'nda' | 'term-sheet' | 'pitch-deck' | 'other';
}

export interface DocumentUploadData {
  file: File;
  title: string;
  description?: string;
  category?: string;
  requiresSignature: boolean;
  sharedWith: string[];
}

export interface SignatureData {
  documentId: string;
  signatureImage: string; // base64
  signedBy: string;
  timestamp: Date;
}