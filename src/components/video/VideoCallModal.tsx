import React, { useState, useMemo, useCallback } from 'react';
import { Phone, X, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

interface VideoCallModalProps {
  isOpen: boolean;
  onClose: () => void;
  availableUsers: Array<{
    id: string;
    name: string;
    role: 'entrepreneur' | 'investor';
    avatarUrl?: string;
  }>;
}

const VideoCallModal: React.FC<VideoCallModalProps> = ({
  isOpen,
  onClose,
  availableUsers,
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize filtered users to prevent re-filtering on every render
  const filteredUsers = useMemo(() => 
    availableUsers.filter(u =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  [availableUsers, searchQuery]);

  // Memoize callbacks
  const toggleUserSelection = useCallback((userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const handleStartCall = useCallback(() => {
    if (selectedUsers.length === 0) {
      toast.error('Please select at least one participant');
      return;
    }

    if (selectedUsers.length > 10) {
      toast.error('Maximum 10 participants allowed per call');
      return;
    }

    // Generate a unique call ID
    const callId = `call-${user?.id}-${Date.now()}`;
    const participantsParam = selectedUsers.join(',');

    // Navigate to video call page with selected participants
    navigate(`/video/${callId}?participants=${participantsParam}`);
    onClose();
    setSelectedUsers([]);
    setSearchQuery('');
  }, [selectedUsers, user, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Phone className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Start Video Call</h2>
              <p className="text-sm text-gray-600">
                Select participants (minimum 1, maximum 10)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search */}
        <div className="px-6 pt-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search contacts..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Participants list */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {filteredUsers.length > 0 ? (
            <div className="space-y-2">
              {filteredUsers.map(person => (
                <button
                  key={person.id}
                  onClick={() => toggleUserSelection(person.id)}
                  className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                    selectedUsers.includes(person.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex-shrink-0">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(person.id)}
                      onChange={() => {}}
                      className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </div>
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">
                        {person.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{person.name}</p>
                    <p className="text-sm text-gray-500 capitalize">
                      {person.role}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600">
                {searchQuery ? 'No contacts found' : 'No contacts available'}
              </p>
            </div>
          )}
        </div>

        {/* Selected count and info */}
        {selectedUsers.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-t border-blue-100">
            <p className="text-sm text-blue-900">
              ✓ <span className="font-semibold">{selectedUsers.length}</span> participant
              {selectedUsers.length !== 1 ? 's' : ''} selected (max 10)
            </p>
          </div>
        )}

        {/* Footer */}
        <div className="px-6 py-4 border-t space-y-3 sm:flex sm:space-y-0 sm:space-x-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleStartCall}
            disabled={selectedUsers.length === 0}
            className="flex-1 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center space-x-2"
          >
            <Phone className="w-4 h-4" />
            <span>Start Call ({selectedUsers.length}/10)</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoCallModal;
