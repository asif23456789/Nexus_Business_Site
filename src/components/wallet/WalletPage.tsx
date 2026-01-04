import React, { useState } from 'react';
import WalletBalance from '../../components/wallet/WalletBalance';
import QuickActions from '../../components/wallet/QuickActions';
import TransactionHistory from '../../components/wallet/TransactionHistory';
import DepositModal from '../../components/wallet/DepositModal';
import WithdrawModal from '../../components/wallet/WithdrawModal';
import TransferModal from '../../components/wallet/TransferModal';
import FundDealModal from '../../components/wallet/FundDealModal';
import { mockWallet, mockTransactions } from '../../data/transactions';
import { useAuth } from '../../context/AuthContext';
import { Wallet, ArrowUpRight, ArrowDownRight, TrendingUp, Sparkles } from 'lucide-react';

const WalletPage: React.FC = () => {
  const { user } = useAuth();
  const [wallet, setWallet] = useState(mockWallet);
  const [transactions] = useState(mockTransactions);
  const [showBalance, setShowBalance] = useState(true);
  
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [showFundDealModal, setShowFundDealModal] = useState(false);

  const handleDeposit = (amount: number, _method: string) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance + amount,
      availableBalance: prev.availableBalance + amount,
      totalDeposits: prev.totalDeposits + amount,
    }));
  };

  const handleWithdraw = (amount: number, _method: string) => {
    const fee = 2.5;
    const total = amount + fee;
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - total,
      availableBalance: prev.availableBalance - total,
      totalWithdrawals: prev.totalWithdrawals + amount,
    }));
  };

  const handleTransfer = (amount: number, _recipientId: string, _notes: string) => {
    const fee = amount * 0.01;
    const total = amount + fee;
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - total,
      availableBalance: prev.availableBalance - total,
      totalTransfers: prev.totalTransfers + amount,
    }));
  };

  const handleFundDeal = (_entrepreneurId: string, amount: number, _dealTerms: string) => {
    setWallet(prev => ({
      ...prev,
      balance: prev.balance - amount,
      availableBalance: prev.availableBalance - amount,
      totalTransfers: prev.totalTransfers + amount,
    }));
  };

  if (!user) return null;

  const statsCards = [
    {
      title: 'Total Deposits',
      value: wallet.totalDeposits,
      icon: ArrowDownRight,
      gradient: 'from-green-500 to-emerald-600',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600',
      trend: '+12.5%'
    },
    {
      title: 'Total Withdrawals',
      value: wallet.totalWithdrawals,
      icon: ArrowUpRight,
      gradient: 'from-blue-500 to-cyan-600',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600',
      trend: '+8.2%'
    },
    {
      title: 'Total Transfers',
      value: wallet.totalTransfers,
      icon: TrendingUp,
      gradient: 'from-purple-500 to-pink-600',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600',
      trend: '+15.3%'
    }
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-pink-600 via-purple-600 to-pink-600 rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Wallet className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center">
                    Wallet
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base mt-0.5">
                    Manage your funds and transactions
                  </p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span className="text-white text-sm font-medium">Premium Account</span>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Pricing Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Yellow Box */}
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
              <span className="text-white/90 font-semibold text-sm uppercase tracking-wider">Premium Plan</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-2">
              $100,000,000,000
            </h3>
            <p className="text-white/80 text-lg font-medium mb-6">
              Ultimate Investment Package
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Unlimited Transactions</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Priority Support 24/7</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Exclusive Investment Deals</span>
              </div>
            </div>
            <button className="w-full bg-white text-orange-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Get Started
            </button>
          </div>
        </div>

        {/* Pink Box */}
        <div className="relative overflow-hidden bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-600 rounded-3xl shadow-2xl p-8 transform transition-all duration-300 hover:scale-105 hover:shadow-3xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-center space-x-2 mb-4">
              <Sparkles className="w-6 h-6 text-white animate-pulse" />
              <span className="text-white/90 font-semibold text-sm uppercase tracking-wider">Elite Plan</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-black text-white mb-2">
              $100,000,000,000
            </h3>
            <p className="text-white/80 text-lg font-medium mb-6">
              Exclusive Business Network
            </p>
            <div className="space-y-2 mb-6">
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Global Investment Access</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">Personal Account Manager</span>
              </div>
              <div className="flex items-center space-x-2 text-white/90">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span className="text-sm">VIP Event Invitations</span>
              </div>
            </div>
            <button className="w-full bg-white text-purple-600 font-bold py-3 px-6 rounded-xl hover:bg-gray-100 transition-colors duration-200 shadow-lg">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Wallet Balance Card */}
      <div className="transform transition-all duration-300 hover:scale-[1.01]">
        <WalletBalance
          balance={wallet.balance}
          availableBalance={wallet.availableBalance}
          pendingBalance={wallet.pendingBalance}
          currency={wallet.currency}
          showBalance={showBalance}
          onToggleVisibility={() => setShowBalance(!showBalance)}
        />
      </div>

      {/* Quick Actions Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Quick Actions</h2>
          <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full max-w-[100px]"></div>
        </div>
        <QuickActions
          onDeposit={() => setShowDepositModal(true)}
          onWithdraw={() => setShowWithdrawModal(true)}
          onTransfer={() => setShowTransferModal(true)}
          onFundDeal={() => setShowFundDealModal(true)}
          userRole={user.role}
        />
      </div>

      {/* Statistics Cards */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Financial Overview</h2>
          <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-green-500 to-blue-500 rounded-full max-w-[100px]"></div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br opacity-5 rounded-full blur-2xl -mr-16 -mt-16 transition-opacity duration-300 group-hover:opacity-10"
                   style={{ background: `linear-gradient(to bottom right, var(--tw-gradient-stops))` }}
              ></div>
              
              <div className="relative p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      ${stat.value.toLocaleString()}
                    </p>
                  </div>
                  <div className={`p-3 ${stat.bgColor} rounded-xl group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon className={`w-6 h-6 ${stat.iconColor}`} />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <div className={`px-2 py-1 bg-gradient-to-r ${stat.gradient} rounded-lg`}>
                    <span className="text-xs font-semibold text-white">{stat.trend}</span>
                  </div>
                  <span className="text-xs text-gray-500">vs last month</span>
                </div>
              </div>
              
              <div className={`h-1 bg-gradient-to-r ${stat.gradient}`}></div>
            </div>
          ))}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
            <div className="h-1 flex-1 ml-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full max-w-[100px]"></div>
          </div>
        </div>
        <TransactionHistory transactions={transactions} />
      </div>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onDeposit={handleDeposit}
      />
      <WithdrawModal
        isOpen={showWithdrawModal}
        onClose={() => setShowWithdrawModal(false)}
        onWithdraw={handleWithdraw}
        availableBalance={wallet.availableBalance}
      />
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onTransfer={handleTransfer}
        availableBalance={wallet.availableBalance}
        currentUserId={user.id}
      />
      <FundDealModal
        isOpen={showFundDealModal}
        onClose={() => setShowFundDealModal(false)}
        onFund={handleFundDeal}
        availableBalance={wallet.availableBalance}
      />
    </div>
  );
};

export default WalletPage;