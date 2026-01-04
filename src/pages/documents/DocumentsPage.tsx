import React, { useState } from 'react';
import { Plus, FileText, Clock, CheckCircle
  // , XCircle
 } from 'lucide-react';
import DocumentList from '../../components/documents/DocumentList';
import DocumentUpload from '../../components/documents/DocumentUpload';
import DocumentPreview from '../../components/documents/DocumentPreview';
import SignaturePad from '../../components/documents/SignaturePad';
import { mockDocuments } from '../../data/documents';
import { Document } from '../../types/document';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const DocumentsPage: React.FC = () => {
  const { user } = useAuth();
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const handleUploadDocument = (data: {
    file: File;
    title: string;
    description: string;
    category: string;
    requiresSignature: boolean;
  }) => {
    if (!user) return;

    const newDocument: Document = {
      id: `doc-${Date.now()}`,
      title: data.title,
      description: data.description,
      fileType: data.file.name.split('.').pop() as 'pdf' | 'docx' | 'doc' | 'txt',
      fileSize: `${(data.file.size / 1024 / 1024).toFixed(2)} MB`,
      status: 'draft',
      uploadedBy: user.id,
      uploadedByRole: user.role,
      uploadedAt: new Date(),
      lastModified: new Date(),
      signatures: [],
      sharedWith: [user.id],
      requiresSignature: data.requiresSignature,
      category: data.category as any,
    };

    setDocuments([newDocument, ...documents]);
    setShowUploadModal(false);
    toast.success('Document uploaded successfully!');
  };

  const handleViewDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowPreviewModal(true);
  };

  const handleSignDocument = (doc: Document) => {
    setSelectedDocument(doc);
    setShowSignatureModal(true);
  };

  const handleSignatureComplete = (signatureData: string) => {
    if (!selectedDocument || !user) return;

    const updatedDocuments = documents.map((doc) => {
      if (doc.id === selectedDocument.id) {
        return {
          ...doc,
          status: 'signed' as const,
          signatures: [
            ...doc.signatures,
            {
              id: `sig-${Date.now()}`,
              signedBy: user.name,
              signedByRole: user.role,
              signatureData,
              signedAt: new Date(),
            },
          ],
        };
      }
      return doc;
    });

    setDocuments(updatedDocuments);
    setShowSignatureModal(false);
    setShowPreviewModal(false);
    toast.success('Document signed successfully!');
  };

  const handleDeleteDocument = (docId: string) => {
    if (confirm('Are you sure you want to delete this document?')) {
      setDocuments(documents.filter((doc) => doc.id !== docId));
      toast.success('Document deleted successfully!');
    }
  };

  const stats = {
    total: documents.length,
    draft: documents.filter((d) => d.status === 'draft').length,
    inReview: documents.filter((d) => d.status === 'in-review').length,
    signed: documents.filter((d) => d.status === 'signed').length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Document Chamber
          </h1>
          <p className="text-gray-600 mt-1">
            Manage contracts, agreements, and business documents
          </p>
        </div>
        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          <span>Upload Document</span>
        </button>
      </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Documents</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Draft</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.draft}
                </p>
              </div>
              <FileText className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">In Review</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.inReview}
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Signed</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                  {stats.signed}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </div>
        </div>

        {/* Documents List */}
        <div className="bg-white rounded-lg shadow p-6">
          <DocumentList
            documents={documents}
            onViewDocument={handleViewDocument}
            onSignDocument={handleSignDocument}
            onDeleteDocument={handleDeleteDocument}
          />
        </div>

      {/* Modals */}
      <DocumentUpload
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        onUpload={handleUploadDocument}
      />

      <DocumentPreview
        isOpen={showPreviewModal}
        onClose={() => setShowPreviewModal(false)}
        document={selectedDocument}
        onSign={
          selectedDocument?.requiresSignature && selectedDocument?.status !== 'signed'
            ? () => handleSignDocument(selectedDocument)
            : undefined
        }
      />

      <SignaturePad
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        document={selectedDocument}
        onSign={handleSignatureComplete}
      />
    </div>
  );
};

export default DocumentsPage;