import React, { useState } from 'react';
import { X, Send, DollarSign, AlertCircle, Search } from 'lucide-react';
import { users as demoUsers } from '../../data/users';
import toast from 'react-hot-toast';

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTransfer: (amount: number, recipientId: string, notes: string) => void;
  availableBalance: number;
  currentUserId: string;
}

const TransferModal: React.FC<TransferModalProps> = ({ 
  isOpen, 
  onClose, 
  onTransfer, 
  availableBalance,
  currentUserId 
}) => {
  const [amount, setAmount] = useState('');
  const [recipientId, setRecipientId] = useState('');
  const [notes, setNotes] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const transferAmount = parseFloat(amount) || 0;
  const transferFee = transferAmount * 0.01; // 1% fee
  const totalWithFee = transferAmount + transferFee;

  // Get available recipients (exclude current user)
  const availableRecipients = demoUsers.filter(u => u.id !== currentUserId);
  
  const filteredRecipients = availableRecipients.filter(user =>
    searchQuery === '' ||
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedRecipient = availableRecipients.find(u => u.id === recipientId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNaN(transferAmount) || transferAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (transferAmount < 5) {
      toast.error('Minimum transfer is $5');
      return;
    }

    if (!recipientId) {
      toast.error('Please select a recipient');
      return;
    }

    if (totalWithFee > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      onTransfer(transferAmount, recipientId, notes);
      toast.success(`Transferred $${transferAmount.toLocaleString()} to ${selectedRecipient?.name}`);
      setIsProcessing(false);
      setAmount('');
      setRecipientId('');
      setNotes('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Transfer Funds</h2>
            <p className="text-gray-600 text-sm mt-1">Send money to another user</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Available Balance */}
          <div className="bg-purple-50 rounded-lg p-4">
            <p className="text-sm text-purple-900 mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-purple-900">${availableBalance.toLocaleString()}</p>
          </div>

          {/* Recipient Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Send To
            </label>
            
            {/* Search */}
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="Search by name or email..."
              />
            </div>

            {/* Recipients List */}
            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {filteredRecipients.map((user) => (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => setRecipientId(user.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    recipientId === user.id
                      ? 'border-2 border-purple-500 bg-purple-50'
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">
                          {user.role === 'investor' ? 'Investor' : 'Entrepreneur'}
                        </p>
                      </div>
                    </div>
                    {recipientId === user.id && (
                      <div className="w-5 h-5 bg-purple-500 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Transfer Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-lg font-semibold"
                placeholder="0.00"
                step="0.01"
                min="5"
                max={availableBalance}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum: $5</p>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              rows={3}
              placeholder="Add a note for this transfer..."
              maxLength={200}
            />
            <p className="text-xs text-gray-500 text-right mt-1">{notes.length}/200</p>
          </div>

          {/* Fee Breakdown */}
          {transferAmount > 0 && selectedRecipient && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Transfer Amount</span>
                <span className="font-medium text-gray-900">${transferAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Transfer Fee (1%)</span>
                <span className="font-medium text-gray-900">${transferFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-sm mb-2">
                  <span className="font-semibold text-gray-900">Total Deducted</span>
                  <span className="font-bold text-gray-900">${totalWithFee.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Recipient Receives</span>
                  <span className="font-semibold text-purple-600">${transferAmount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          {totalWithFee > availableBalance && transferAmount > 0 && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                Insufficient balance. You need ${(totalWithFee - availableBalance).toFixed(2)} more.
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || !amount || !recipientId || transferAmount < 5 || totalWithFee > availableBalance}
            className="w-full bg-purple-500 text-white py-3 rounded-lg hover:bg-purple-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium flex items-center justify-center"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              <>
                <Send className="w-5 h-5 mr-2" />
                Transfer {amount ? `$${transferAmount.toLocaleString()}` : 'Funds'}
              </>
            )}
          </button>
        </form>

        {/* Footer - Fixed (empty to maintain structure) */}
        <div className="flex-shrink-0" />
      </div>
    </div>
  );
};

export default TransferModal;