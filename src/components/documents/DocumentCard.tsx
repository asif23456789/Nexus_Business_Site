import React, { memo } from 'react';
import { FileText, Download, Eye, Edit, Trash2, CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';
import { Document } from '../../types/document';

interface DocumentCardProps {
  document: Document;
  onView: (doc: Document) => void;
  onSign?: (doc: Document) => void;
  onDelete?: (docId: string) => void;
}

const DocumentCard: React.FC<DocumentCardProps> = memo(({
  document,
  onView,
  onSign,
  onDelete,
}) => {
  const getStatusConfig = () => {
    switch (document.status) {
      case 'signed':
        return {
          icon: CheckCircle,
          color: 'bg-green-100 text-green-800',
          label: 'Signed',
        };
      case 'in-review':
        return {
          icon: Clock,
          color: 'bg-yellow-100 text-yellow-800',
          label: 'In Review',
        };
      case 'draft':
        return {
          icon: Edit,
          color: 'bg-gray-100 text-gray-800',
          label: 'Draft',
        };
      case 'rejected':
        return {
          icon: XCircle,
          color: 'bg-red-100 text-red-800',
          label: 'Rejected',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'bg-gray-100 text-gray-800',
          label: 'Unknown',
        };
    }
  };

  const getCategoryConfig = () => {
    switch (document.category) {
      case 'contract':
        return { color: 'bg-blue-100 text-blue-800', label: 'Contract' };
      case 'nda':
        return { color: 'bg-purple-100 text-purple-800', label: 'NDA' };
      case 'term-sheet':
        return { color: 'bg-indigo-100 text-indigo-800', label: 'Term Sheet' };
      case 'pitch-deck':
        return { color: 'bg-pink-100 text-pink-800', label: 'Pitch Deck' };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Other' };
    }
  };

  const statusConfig = getStatusConfig();
  const categoryConfig = getCategoryConfig();
  const StatusIcon = statusConfig.icon;

  return (
    <div className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow p-4">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start space-x-3 flex-1">
          <div className="p-2 bg-blue-50 rounded-lg">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-gray-900 truncate">
              {document.title}
            </h3>
            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
              {document.description || 'No description'}
            </p>
          </div>
        </div>
      </div>

      {/* Badges */}
      <div className="flex items-center space-x-2 mb-3">
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${statusConfig.color}`}>
          <StatusIcon className="w-3 h-3 mr-1" />
          {statusConfig.label}
        </span>
        {document.category && (
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${categoryConfig.color}`}>
            {categoryConfig.label}
          </span>
        )}
      </div>

      {/* Metadata */}
      <div className="space-y-1 mb-3 text-xs text-gray-600">
        <div className="flex items-center justify-between">
          <span>File size: {document.fileSize}</span>
          <span className="uppercase">{document.fileType}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Uploaded: {new Date(document.uploadedAt).toLocaleDateString()}</span>
          <span>By: {document.uploadedByRole}</span>
        </div>
      </div>

      {/* Signatures */}
      {document.requiresSignature && (
        <div className="mb-3 p-2 bg-gray-50 rounded">
          <div className="text-xs text-gray-600 mb-1">Signatures:</div>
          <div className="flex items-center space-x-2">
            {document.signatures.length > 0 ? (
              document.signatures.map((sig, index) => (
                <div
                  key={sig.id}
                  className="flex items-center space-x-1 text-xs"
                >
                  <CheckCircle className="w-3 h-3 text-green-500" />
                  <span className="text-gray-700">{sig.signedBy}</span>
                  {index < document.signatures.length - 1 && <span>,</span>}
                </div>
              ))
            ) : (
              <span className="text-xs text-gray-500">No signatures yet</span>
            )}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center space-x-2">
        <button
          onClick={() => onView(document)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm"
        >
          <Eye className="w-4 h-4" />
          <span>View</span>
        </button>
        
        {document.requiresSignature && document.status !== 'signed' && onSign && (
          <button
            onClick={() => onSign(document)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            <Edit className="w-4 h-4" />
            <span>Sign</span>
          </button>
        )}
        
        <button className="p-2 text-gray-600 hover:text-blue-600 transition-colors">
          <Download className="w-4 h-4" />
        </button>
        
        {onDelete && (
          <button
            onClick={() => onDelete(document.id)}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}, (prevProps, nextProps) => {
  // Custom comparison: only re-render if document content changed
  return prevProps.document.id === nextProps.document.id &&
         prevProps.document.status === nextProps.document.status &&
         prevProps.document.updatedAt === nextProps.document.updatedAt;
});

DocumentCard.displayName = 'DocumentCard';

export default DocumentCard;