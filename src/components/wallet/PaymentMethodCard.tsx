import React from 'react';
import { CreditCard, Building, Wallet as WalletIcon, Mail, Check, MoreVertical, Shield } from 'lucide-react';
import { PaymentMethodInfo } from '../../types/payment';

interface PaymentMethodCardProps {
  paymentMethod: PaymentMethodInfo;
  onSetDefault?: (id: string) => void;
  onRemove?: (id: string) => void;
}

const PaymentMethodCard: React.FC<PaymentMethodCardProps> = ({
  paymentMethod,
  onSetDefault,
  onRemove,
}) => {
  const getIcon = () => {
    switch (paymentMethod.type) {
      case 'credit-card':
        return <CreditCard className="w-6 h-6" />;
      case 'bank-account':
        return <Building className="w-6 h-6" />;
      case 'paypal':
        return <Mail className="w-6 h-6" />;
      case 'crypto':
        return <WalletIcon className="w-6 h-6" />;
    }
  };

  const getDisplayName = () => {
    switch (paymentMethod.type) {
      case 'credit-card':
        return `${paymentMethod.brand} ••••${paymentMethod.last4}`;
      case 'bank-account':
        return `${paymentMethod.brand} ••••${paymentMethod.last4}`;
      case 'paypal':
        return paymentMethod.email;
      case 'crypto':
        return `${paymentMethod.walletAddress?.slice(0, 6)}...${paymentMethod.walletAddress?.slice(-4)}`;
    }
  };

  const getBackgroundGradient = () => {
    if (paymentMethod.isDefault) {
      return 'from-blue-500 via-purple-500 to-pink-500';
    }
    switch (paymentMethod.type) {
      case 'credit-card':
        return 'from-slate-800 via-gray-800 to-zinc-900';
      case 'bank-account':
        return 'from-emerald-500 via-teal-600 to-cyan-700';
      case 'paypal':
        return 'from-blue-500 via-indigo-600 to-purple-700';
      case 'crypto':
        return 'from-orange-500 via-amber-600 to-yellow-600';
    }
  };

  const getAccentColor = () => {
    switch (paymentMethod.type) {
      case 'credit-card':
        return 'bg-white/10';
      case 'bank-account':
        return 'bg-emerald-400/20';
      case 'paypal':
        return 'bg-blue-400/20';
      case 'crypto':
        return 'bg-yellow-400/20';
      default:
        return 'bg-white/10';
    }
  };

  return (
    <div className="group relative">
      <div className={`relative bg-gradient-to-br ${getBackgroundGradient()} rounded-2xl shadow-2xl p-6 text-white overflow-hidden transform transition-all duration-300 hover:scale-105 hover:shadow-3xl`}>
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-black/10 rounded-full blur-2xl -ml-16 -mb-16"></div>
        
        {/* Chip design */}
        <div className={`absolute top-6 right-6 w-12 h-10 ${getAccentColor()} backdrop-blur-sm rounded-lg`}>
          <div className="absolute inset-2 border border-white/30 rounded"></div>
        </div>

        {/* Header */}
        <div className="relative z-10 flex items-start justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 backdrop-blur-sm rounded-xl">
              {getIcon()}
            </div>
            <div>
              <span className="block text-sm font-semibold capitalize">
                {paymentMethod.type.replace('-', ' ')}
              </span>
              <span className="text-xs text-white/70">Payment Method</span>
            </div>
          </div>
          
          <button className="text-white/80 hover:text-white hover:bg-white/10 p-2 rounded-lg transition-all duration-200">
            <MoreVertical className="w-5 h-5" />
          </button>
        </div>

        {/* Card Number / Account Info */}
        <div className="relative z-10 mb-8">
          <p className="text-2xl md:text-3xl font-bold tracking-wider drop-shadow-lg">
            {getDisplayName()}
          </p>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-end justify-between">
          <div>
            {paymentMethod.holderName && (
              <p className="text-sm font-semibold uppercase tracking-wide">
                {paymentMethod.holderName}
              </p>
            )}
            {paymentMethod.expiryMonth && paymentMethod.expiryYear && (
              <div className="flex items-center space-x-2 mt-1">
                <span className="text-xs text-white/60">Valid Thru</span>
                <span className="text-xs font-medium">
                  {paymentMethod.expiryMonth.toString().padStart(2, '0')}/{paymentMethod.expiryYear}
                </span>
              </div>
            )}
            {paymentMethod.type === 'paypal' && (
              <p className="text-xs text-white/70 mt-1 flex items-center">
                <Mail className="w-3 h-3 mr-1" />
                PayPal Account
              </p>
            )}
            {paymentMethod.type === 'crypto' && (
              <p className="text-xs text-white/70 mt-1 flex items-center">
                <WalletIcon className="w-3 h-3 mr-1" />
                Crypto Wallet
              </p>
            )}
          </div>

          {/* Status Badges */}
          <div className="flex flex-col items-end space-y-2">
            {paymentMethod.isDefault && (
              <span className="flex items-center bg-white text-gray-900 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                <Check className="w-3 h-3 mr-1" />
                Default
              </span>
            )}
            {paymentMethod.isVerified ? (
              <span className="flex items-center bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </span>
            ) : (
              <span className="flex items-center bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg animate-pulse">
                <Shield className="w-3 h-3 mr-1" />
                Pending
              </span>
            )}
          </div>
        </div>

        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
      </div>

      {/* Actions (hover overlay) */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/70 to-black/80 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-2xl flex items-center justify-center space-x-3 z-20">
        {!paymentMethod.isDefault && onSetDefault && (
          <button
            onClick={() => onSetDefault(paymentMethod.id)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-xl transform hover:scale-105"
          >
            Set Default
          </button>
        )}
        {onRemove && (
          <button
            onClick={() => onRemove(paymentMethod.id)}
            className="bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-red-600 hover:to-pink-700 transition-all duration-200 shadow-xl transform hover:scale-105"
          >
            Remove
          </button>
        )}
      </div>
    </div>
  );
};

export default PaymentMethodCard;