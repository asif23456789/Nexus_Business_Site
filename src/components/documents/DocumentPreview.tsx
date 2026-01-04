import React from 'react';
import { X, Download, Edit, FileText, CheckCircle } from 'lucide-react';
import { Document } from '../../types/document';

interface DocumentPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  document: Document | null;
  onSign?: () => void;
}

const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  isOpen,
  onClose,
  document,
  onSign,
}) => {
  if (!isOpen || !document) return null;

  const canSign = document.requiresSignature && document.status !== 'signed' && onSign;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b">
          <div className="flex-1">
            <h2 className="text-xl font-bold text-gray-800">{document.title}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {document.description || 'No description'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 ml-4"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Document Info Bar */}
        <div className="px-6 py-3 bg-gray-50 border-b flex items-center justify-between">
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <span className="flex items-center">
              <FileText className="w-4 h-4 mr-1" />
              {document.fileType.toUpperCase()}
            </span>
            <span>Size: {document.fileSize}</span>
            <span>Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}</span>
          </div>
          
          <div className="flex items-center space-x-2">
            {document.status === 'signed' && (
              <span className="flex items-center text-green-600 text-sm font-medium">
                <CheckCircle className="w-4 h-4 mr-1" />
                Signed
              </span>
            )}
            <button className="flex items-center space-x-1 px-3 py-1.5 text-gray-700 hover:bg-gray-200 rounded transition-colors text-sm">
              <Download className="w-4 h-4" />
              <span>Download</span>
            </button>
            {canSign && (
              <button
                onClick={onSign}
                className="flex items-center space-x-1 px-3 py-1.5 bg-green-500 text-white hover:bg-green-600 rounded transition-colors text-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Sign Document</span>
              </button>
            )}
          </div>
        </div>

        {/* Document Preview Area */}
        <div className="flex-1 p-6 overflow-auto bg-gray-100">
          {/* Mock Document Preview */}
          <div className="bg-white shadow-lg mx-auto max-w-4xl min-h-full p-12 rounded">
            {/* Mock PDF/Document Content */}
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {document.title}
                </h1>
                <p className="text-gray-600">{document.category?.toUpperCase()}</p>
              </div>

              <div className="space-y-4 text-gray-700">
                <p className="leading-relaxed">
                  This is a preview of the document. In a production environment, this would display the actual PDF or document content using a PDF viewer library like PDF.js or react-pdf.
                </p>

                <div className="border-l-4 border-blue-500 pl-4 py-2 bg-blue-50">
                  <p className="font-medium text-blue-900">Document Information:</p>
                  <ul className="mt-2 space-y-1 text-sm text-blue-800">
                    <li>• File Type: {document.fileType}</li>
                    <li>• Category: {document.category || 'N/A'}</li>
                    <li>• Status: {document.status}</li>
                    <li>• Requires Signature: {document.requiresSignature ? 'Yes' : 'No'}</li>
                  </ul>
                </div>

                <p className="leading-relaxed">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                </p>

                <p className="leading-relaxed">
                  Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </p>

                {document.requiresSignature && (
                  <div className="mt-8 border-t-2 border-gray-300 pt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Signatures</h3>
                    {document.signatures.length > 0 ? (
                      <div className="space-y-4">
                        {document.signatures.map((signature) => (
                          <div
                            key={signature.id}
                            className="border border-gray-300 rounded-lg p-4 bg-green-50"
                          >
                            <div className="flex items-start justify-between">
                              <div>
                                <p className="font-medium text-gray-900">
                                  {signature.signedBy}
                                </p>
                                <p className="text-sm text-gray-600">
                                  {signature.signedByRole.charAt(0).toUpperCase() + signature.signedByRole.slice(1)}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                  Signed on: {new Date(signature.signedAt).toLocaleString()}
                                </p>
                              </div>
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            </div>
                            {signature.signatureData && (
                              <div className="mt-3 border-t pt-3">
                                <img
                                  src={signature.signatureData}
                                  alt="Signature"
                                  className="h-16 border border-gray-300 bg-white p-2 rounded"
                                />
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                        <p className="text-gray-500 mb-4">No signatures yet</p>
                        {canSign && (
                          <button
                            onClick={onSign}
                            className="inline-flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                          >
                            <Edit className="w-4 h-4" />
                            <span>Sign Now</span>
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mock document continues... */}
              <div className="mt-8 space-y-4 text-gray-600">
                <p>Section 1: Terms and Conditions</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit...</p>
                
                <p>Section 2: Obligations</p>
                <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...</p>
                
                <p>Section 3: Legal Binding</p>
                <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco...</p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-gray-50 border-t flex items-center justify-between">
          <div className="text-sm text-gray-600">
            Page 1 of 1
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100"
            >
              Close
            </button>
            {canSign && (
              <button
                onClick={onSign}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Sign Document
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentPreview;