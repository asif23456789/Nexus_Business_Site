import React from 'react';
import { Wallet, TrendingUp, TrendingDown, DollarSign, Eye, EyeOff } from 'lucide-react';

interface WalletBalanceProps {
  balance: number;
  availableBalance: number;
  pendingBalance: number;
  currency?: string;
  showBalance?: boolean;
  onToggleVisibility?: () => void;
}

const WalletBalance: React.FC<WalletBalanceProps> = ({
  balance,
  availableBalance,
  pendingBalance,
  currency = 'USD',
  showBalance = true,
  onToggleVisibility,
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <div className="bg-gradient-to-br from-blue-600 to-purple-700 rounded-xl shadow-lg p-6 text-white">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6" />
          <h3 className="text-lg font-semibold">Wallet Balance</h3>
        </div>
        {onToggleVisibility && (
          <button
            onClick={onToggleVisibility}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title={showBalance ? 'Hide balance' : 'Show balance'}
          >
            {showBalance ? (
              <Eye className="w-5 h-5" />
            ) : (
              <EyeOff className="w-5 h-5" />
            )}
          </button>
        )}
      </div>

      {/* Main Balance */}
      <div className="mb-6">
        <p className="text-white/80 text-sm mb-1">Total Balance</p>
        {showBalance ? (
          <h2 className="text-4xl font-bold">{formatCurrency(balance)}</h2>
        ) : (
          <h2 className="text-4xl font-bold">••••••</h2>
        )}
      </div>

      {/* Balance Breakdown */}
      <div className="grid grid-cols-2 gap-4">
        {/* Available Balance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-green-500/20 rounded">
              <TrendingUp className="w-4 h-4 text-green-300" />
            </div>
            <span className="text-white/80 text-xs">Available</span>
          </div>
          {showBalance ? (
            <p className="text-xl font-bold">{formatCurrency(availableBalance)}</p>
          ) : (
            <p className="text-xl font-bold">••••••</p>
          )}
        </div>

        {/* Pending Balance */}
        <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
          <div className="flex items-center space-x-2 mb-2">
            <div className="p-1.5 bg-yellow-500/20 rounded">
              <DollarSign className="w-4 h-4 text-yellow-300" />
            </div>
            <span className="text-white/80 text-xs">Pending</span>
          </div>
          {showBalance ? (
            <p className="text-xl font-bold">{formatCurrency(pendingBalance)}</p>
          ) : (
            <p className="text-xl font-bold">••••••</p>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-white/60 text-xs">
          Available balance can be withdrawn or transferred immediately
        </p>
      </div>
    </div>
  );
};

export default WalletBalance;