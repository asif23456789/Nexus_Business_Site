import React, { useState, useMemo, useCallback } from 'react';
import { Search, Filter, Grid, List } from 'lucide-react';
import { Document, DocumentStatus } from '../../types/document';
import DocumentCard from './DocumentCard';

interface DocumentListProps {
  documents: Document[];
  onViewDocument: (doc: Document) => void;
  onSignDocument?: (doc: Document) => void;
  onDeleteDocument?: (docId: string) => void;
}

const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onViewDocument,
  onSignDocument,
  onDeleteDocument,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<DocumentStatus | 'all'>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Memoize filtered documents to prevent re-filtering on every render
  const filteredDocuments = useMemo(() => {
    return documents.filter((doc) => {
      const matchesSearch =
        searchQuery === '' ||
        doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.description?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [documents, searchQuery, statusFilter]);

  // Memoize status counts calculation
  const statusCounts = useMemo(() => ({
    all: documents.length,
    draft: documents.filter((d) => d.status === 'draft').length,
    'in-review': documents.filter((d) => d.status === 'in-review').length,
    signed: documents.filter((d) => d.status === 'signed').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
  }), [documents]);

  // Memoize callbacks to prevent child re-renders
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleStatusFilterChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as DocumentStatus | 'all');
  }, []);

  const handleViewModeChange = useCallback((mode: 'grid' | 'list') => {
    setViewMode(mode);
  }, []);

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder="Search documents..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <select
            value={statusFilter}
            onChange={handleStatusFilterChange}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All ({statusCounts.all})</option>
            <option value="draft">Draft ({statusCounts.draft})</option>
            <option value="in-review">In Review ({statusCounts['in-review']})</option>
            <option value="signed">Signed ({statusCounts.signed})</option>
            <option value="rejected">Rejected ({statusCounts.rejected})</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleViewModeChange('grid')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'grid'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="Grid View"
          >
            <Grid className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleViewModeChange('list')}
            className={`p-2 rounded transition-colors ${
              viewMode === 'list'
                ? 'bg-white text-blue-600 shadow'
                : 'text-gray-600 hover:text-gray-900'
            }`}
            title="List View"
          >
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredDocuments.length} of {documents.length} documents
        </p>
      </div>

      {/* Document Grid/List */}
      {filteredDocuments.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'
              : 'space-y-4'
          }
        >
          {filteredDocuments.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={onViewDocument}
              onSign={onSignDocument}
              onDelete={onDeleteDocument}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-600">No documents found</p>
          <p className="text-sm text-gray-500 mt-1">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  );
};

export default DocumentList;