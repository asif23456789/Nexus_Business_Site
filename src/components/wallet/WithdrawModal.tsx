import React, { useState } from 'react';
import { X, Building, DollarSign, AlertCircle } from 'lucide-react';
import { mockPaymentMethods } from '../../data/transactions';
import toast from 'react-hot-toast';

interface WithdrawModalProps {
  isOpen: boolean;
  onClose: () => void;
  onWithdraw: (amount: number, method: string) => void;
  availableBalance: number;
}

const WithdrawModal: React.FC<WithdrawModalProps> = ({ 
  isOpen, 
  onClose, 
  onWithdraw, 
  availableBalance 
}) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(
    mockPaymentMethods.find(m => m.type === 'bank-account')?.id || mockPaymentMethods[0].id
  );
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const withdrawFee = 2.5; // $2.50 fee
  const withdrawAmount = parseFloat(amount) || 0;
  const totalWithFee = withdrawAmount + withdrawFee;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isNaN(withdrawAmount) || withdrawAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (withdrawAmount < 20) {
      toast.error('Minimum withdrawal is $20');
      return;
    }

    if (totalWithFee > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    setIsProcessing(true);
    
    setTimeout(() => {
      onWithdraw(withdrawAmount, selectedMethod);
      toast.success(`Withdrawal of $${withdrawAmount.toLocaleString()} initiated`);
      setIsProcessing(false);
      setAmount('');
      onClose();
    }, 1500);
  };

  const bankAccounts = mockPaymentMethods.filter(m => 
    m.type === 'bank-account' && m.isVerified
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Withdraw Funds</h2>
            <p className="text-gray-600 text-sm mt-1">Transfer to your bank account</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Available Balance */}
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-sm text-blue-900 mb-1">Available Balance</p>
            <p className="text-2xl font-bold text-blue-900">${availableBalance.toLocaleString()}</p>
          </div>

          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdrawal Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg font-semibold"
                placeholder="0.00"
                step="0.01"
                min="20"
                max={availableBalance}
                required
              />
            </div>
            <div className="flex justify-between mt-2">
              <p className="text-xs text-gray-500">Minimum: $20</p>
              <button
                type="button"
                onClick={() => setAmount((availableBalance - withdrawFee).toString())}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                Withdraw All
              </button>
            </div>
          </div>

          {/* Bank Account Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Withdraw To
            </label>
            {bankAccounts.length > 0 ? (
              <div className="space-y-2">
                {bankAccounts.map((account) => (
                  <button
                    key={account.id}
                    type="button"
                    onClick={() => setSelectedMethod(account.id)}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                      selectedMethod === account.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Building className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium text-gray-900">
                            {account.brand} ••••{account.last4}
                          </p>
                          <p className="text-xs text-gray-500">{account.holderName}</p>
                        </div>
                      </div>
                      {selectedMethod === account.id && (
                        <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  No bank account added. Please add a bank account in settings.
                </p>
              </div>
            )}
          </div>

          {/* Fee Breakdown */}
          {withdrawAmount > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Withdrawal Amount</span>
                <span className="font-medium text-gray-900">${withdrawAmount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Processing Fee</span>
                <span className="font-medium text-gray-900">${withdrawFee.toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-900">Deducted from Wallet</span>
                  <span className="font-bold text-gray-900">${totalWithFee.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          {totalWithFee > availableBalance && withdrawAmount > 0 && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                Insufficient balance. You need ${(totalWithFee - availableBalance).toFixed(2)} more.
              </p>
            </div>
          )}

          {/* Processing Time Info */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Withdrawals typically take 2-3 business days to reach your account.
            </p>
          </div>
        </form>

        {/* Footer - Fixed */}
        <div className="p-6 border-t flex-shrink-0">
          <button
            onClick={() => {
              const form = document.querySelector('form');
              if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
            }}
            disabled={isProcessing || !amount || withdrawAmount < 20 || totalWithFee > availableBalance || bankAccounts.length === 0}
            className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </span>
            ) : (
              `Withdraw ${amount ? `$${withdrawAmount.toLocaleString()}` : 'Funds'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default WithdrawModal;