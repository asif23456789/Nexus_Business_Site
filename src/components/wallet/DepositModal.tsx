import React, { useState } from 'react';
import { X, CreditCard, Building, DollarSign } from 'lucide-react';
import { mockPaymentMethods } from '../../data/transactions';
import toast from 'react-hot-toast';

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDeposit: (amount: number, method: string) => void;
}

const DepositModal: React.FC<DepositModalProps> = ({ isOpen, onClose, onDeposit }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(mockPaymentMethods[0].id);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const quickAmounts = [100, 500, 1000, 5000, 10000];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const depositAmount = parseFloat(amount);
    if (isNaN(depositAmount) || depositAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    if (depositAmount < 10) {
      toast.error('Minimum deposit is $10');
      return;
    }

    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      onDeposit(depositAmount, selectedMethod);
      toast.success(`Successfully deposited $${depositAmount.toLocaleString()}`);
      setIsProcessing(false);
      setAmount('');
      onClose();
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col">
        {/* Header - Fixed */}
        <div className="flex justify-between items-center p-6 border-b flex-shrink-0">
          <div>
            <h2 className="text-xl font-bold text-gray-800">Deposit Funds</h2>
            <p className="text-gray-600 text-sm mt-1">Add money to your wallet</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - Scrollable */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto flex-1">
          {/* Amount Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deposit Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 text-lg font-semibold"
                placeholder="0.00"
                step="0.01"
                min="10"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum deposit: $10</p>
          </div>

          {/* Quick Amount Buttons */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Quick Select
            </label>
            <div className="grid grid-cols-3 gap-2">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setAmount(quickAmount.toString())}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors text-sm font-medium"
                >
                  ${quickAmount.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Method Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Method
            </label>
            <div className="space-y-2">
              {mockPaymentMethods.filter(m => m.isVerified).map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => setSelectedMethod(method.id)}
                  className={`w-full p-4 border-2 rounded-lg text-left transition-all ${
                    selectedMethod === method.id
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {method.type === 'credit-card' && <CreditCard className="w-5 h-5 text-gray-600" />}
                      {method.type === 'bank-account' && <Building className="w-5 h-5 text-gray-600" />}
                      <div>
                        <p className="font-medium text-gray-900">
                          {method.type === 'credit-card' ? `${method.brand} ••••${method.last4}` : 
                           method.type === 'bank-account' ? `${method.brand} ••••${method.last4}` :
                           method.email || method.walletAddress}
                        </p>
                        {method.isDefault && (
                          <span className="text-xs text-green-600">Default</span>
                        )}
                      </div>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
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

          {/* Fee Info */}
          {amount && parseFloat(amount) > 0 && (
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Deposit Amount</span>
                <span className="font-medium text-gray-900">${parseFloat(amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-600">Processing Fee (3%)</span>
                <span className="font-medium text-gray-900">${(parseFloat(amount) * 0.03).toFixed(2)}</span>
              </div>
              <div className="border-t border-gray-200 pt-2 mt-2">
                <div className="flex justify-between text-sm">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="font-bold text-gray-900">${(parseFloat(amount) * 1.03).toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
        </form>

        {/* Footer - Fixed */}
        <div className="p-6 border-t flex-shrink-0">
          <button
            onClick={() => {
              const form = document.querySelector('form');
              if (form) form.dispatchEvent(new Event('submit', { bubbles: true }));
            }}
            disabled={isProcessing || !amount || parseFloat(amount) < 10}
            className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
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
              `Deposit ${amount ? `$${parseFloat(amount).toLocaleString()}` : 'Funds'}`
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepositModal;