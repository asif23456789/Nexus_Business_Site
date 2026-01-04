import React, { useState } from 'react';
import { X, Briefcase, DollarSign, TrendingUp, Building, AlertCircle } from 'lucide-react';
import { entrepreneurs } from '../../data/users';
import toast from 'react-hot-toast';

interface FundDealModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFund: (entrepreneurId: string, amount: number, dealTerms: string) => void;
  availableBalance: number;
}

const FundDealModal: React.FC<FundDealModalProps> = ({ 
  isOpen, 
  onClose, 
  onFund, 
  availableBalance 
}) => {
  const [selectedEntrepreneur, setSelectedEntrepreneur] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [equityPercentage, setEquityPercentage] = useState('');
  const [dealTerms, setDealTerms] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen) return null;

  const amount = parseFloat(fundingAmount) || 0;
  const entrepreneur = entrepreneurs.find(e => e.id === selectedEntrepreneur);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedEntrepreneur) {
      toast.error('Please select an entrepreneur');
      return;
    }

    if (amount < 1000) {
      toast.error('Minimum funding amount is $1,000');
      return;
    }

    if (amount > availableBalance) {
      toast.error('Insufficient balance');
      return;
    }

    if (!equityPercentage || parseFloat(equityPercentage) <= 0) {
      toast.error('Please enter equity percentage');
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      onFund(selectedEntrepreneur, amount, dealTerms);
      toast.success(`Successfully funded ${entrepreneur?.startupName} with $${amount.toLocaleString()}`);
      setIsProcessing(false);
      setSelectedEntrepreneur('');
      setFundingAmount('');
      setEquityPercentage('');
      setDealTerms('');
      onClose();
    }, 1500);
  };

  const quickAmounts = [10000, 25000, 50000, 100000, 250000];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center">
              <Briefcase className="w-6 h-6 mr-2" />
              Fund a Deal
            </h2>
            <p className="text-white/90 text-sm mt-1">Invest in promising startups</p>
          </div>
          <button onClick={onClose} className="text-white/90 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Available Balance */}
          <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
            <p className="text-sm text-orange-900 mb-1">Available to Invest</p>
            <p className="text-3xl font-bold text-orange-900">${availableBalance.toLocaleString()}</p>
          </div>

          {/* Select Entrepreneur */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Startup to Fund
            </label>
            <div className="space-y-2 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-2">
              {entrepreneurs.map((ent) => (
                <button
                  key={ent.id}
                  type="button"
                  onClick={() => setSelectedEntrepreneur(ent.id)}
                  className={`w-full p-4 rounded-lg text-left transition-all ${
                    selectedEntrepreneur === ent.id
                      ? 'border-2 border-orange-500 bg-orange-50'
                      : 'border-2 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-3 flex-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Building className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900">{ent.startupName}</p>
                        <p className="text-sm text-gray-600">{ent.name}</p>
                        <p className="text-xs text-gray-500 mt-1">{ent.industry}</p>
                        <p className="text-sm text-gray-700 mt-2 line-clamp-2">{ent.pitchSummary}</p>
                        <div className="mt-2 flex items-center space-x-3">
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {ent.fundingNeeded}
                          </span>
                          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                            {ent.teamSize} team members
                          </span>
                        </div>
                      </div>
                    </div>
                    {selectedEntrepreneur === ent.id && (
                      <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0 ml-3">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Funding Amount */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Investment Amount
            </label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={fundingAmount}
                onChange={(e) => setFundingAmount(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold"
                placeholder="0.00"
                step="1000"
                min="1000"
                max={availableBalance}
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Minimum investment: $1,000</p>

            {/* Quick Amount Buttons */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              {quickAmounts.map((quickAmount) => (
                <button
                  key={quickAmount}
                  type="button"
                  onClick={() => setFundingAmount(quickAmount.toString())}
                  disabled={quickAmount > availableBalance}
                  className="px-4 py-2 border-2 border-gray-300 rounded-lg hover:border-orange-500 hover:bg-orange-50 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  ${(quickAmount / 1000)}K
                </button>
              ))}
            </div>
          </div>

          {/* Equity Percentage */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Equity Stake (%)
            </label>
            <div className="relative">
              <TrendingUp className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="number"
                value={equityPercentage}
                onChange={(e) => setEquityPercentage(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 text-lg font-semibold"
                placeholder="0.0"
                step="0.1"
                min="0.1"
                max="100"
                required
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">Percentage of company equity</p>
          </div>

          {/* Deal Terms */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Deal Terms & Conditions
            </label>
            <textarea
              value={dealTerms}
              onChange={(e) => setDealTerms(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
              rows={4}
              placeholder="Describe investment terms, milestones, conditions, etc..."
              required
            />
            <p className="text-xs text-gray-500 mt-1">These terms will be included in the funding agreement</p>
          </div>

          {/* Deal Summary */}
          {amount > 0 && equityPercentage && entrepreneur && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-5 border-2 border-orange-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Briefcase className="w-5 h-5 mr-2 text-orange-600" />
                Deal Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Startup:</span>
                  <span className="font-semibold text-gray-900">{entrepreneur.startupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Investment Amount:</span>
                  <span className="font-semibold text-gray-900">${amount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Equity Stake:</span>
                  <span className="font-semibold text-orange-600">{equityPercentage}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valuation Implied:</span>
                  <span className="font-semibold text-gray-900">
                    ${((amount / parseFloat(equityPercentage)) * 100).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Warning */}
          {amount > availableBalance && (
            <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-800">
                Insufficient balance. You need ${(amount - availableBalance).toLocaleString()} more.
              </p>
            </div>
          )}

          {/* Legal Notice */}
          <div className="flex items-start space-x-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-800">
              This is a simulated investment for demo purposes. In production, this would create legal binding agreements and transfer actual funds through escrow.
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isProcessing || !selectedEntrepreneur || !fundingAmount || amount < 1000 || amount > availableBalance || !equityPercentage || !dealTerms}
            className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-4 rounded-lg hover:from-orange-600 hover:to-red-600 disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed transition-all font-semibold text-lg flex items-center justify-center shadow-lg"
          >
            {isProcessing ? (
              <span className="flex items-center">
                <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing Investment...
              </span>
            ) : (
              <>
                <Briefcase className="w-5 h-5 mr-2" />
                Fund ${amount ? amount.toLocaleString() : '0'} Investment
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default FundDealModal;