import React, { useState, useMemo, useCallback } from 'react';
import { ArrowUpRight, ArrowDownRight, ArrowRightLeft, Briefcase, Filter, Download, Search, TrendingUp } from 'lucide-react';
import { Transaction, TransactionType, TransactionStatus } from '../../types/payment';

interface TransactionHistoryProps {
  transactions: Transaction[];
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ transactions }) => {
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Memoize filtered transactions to avoid re-filtering on every render
  const filteredTransactions = useMemo(() => 
    transactions.filter((txn) => {
      const matchesType = filterType === 'all' || txn.type === filterType;
      const matchesStatus = filterStatus === 'all' || txn.status === filterStatus;
      const matchesSearch = searchQuery === '' ||
        txn.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.senderName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        txn.receiverName?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesType && matchesStatus && matchesSearch;
    }),
  [transactions, filterType, filterStatus, searchQuery]);

  // Memoize callbacks
  const handleFilterTypeChange = useCallback((type: TransactionType | 'all') => {
    setFilterType(type);
  }, []);

  const handleFilterStatusChange = useCallback((status: TransactionStatus | 'all') => {
    setFilterStatus(status);
  }, []);

  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  }, []);

  const getTypeIcon = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownRight className="w-5 h-5 text-emerald-600" />;
      case 'withdraw':
        return <ArrowUpRight className="w-5 h-5 text-blue-600" />;
      case 'transfer':
        return <ArrowRightLeft className="w-5 h-5 text-purple-600" />;
      case 'deal-funding':
        return <Briefcase className="w-5 h-5 text-orange-600" />;
    }
  };

  const getTypeBackground = (type: TransactionType) => {
    switch (type) {
      case 'deposit':
        return 'bg-gradient-to-br from-emerald-50 to-green-100';
      case 'withdraw':
        return 'bg-gradient-to-br from-blue-50 to-cyan-100';
      case 'transfer':
        return 'bg-gradient-to-br from-purple-50 to-pink-100';
      case 'deal-funding':
        return 'bg-gradient-to-br from-orange-50 to-amber-100';
    }
  };

  const getStatusBadge = (status: TransactionStatus) => {
    const styles = {
      completed: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-md shadow-green-500/30',
      pending: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-white shadow-md shadow-yellow-500/30 animate-pulse',
      failed: 'bg-gradient-to-r from-red-500 to-rose-600 text-white shadow-md shadow-red-500/30',
      cancelled: 'bg-gradient-to-r from-gray-400 to-slate-500 text-white shadow-md shadow-gray-500/30',
    };

    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
      {/* Header with Filters */}
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 border-b border-gray-200 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Transaction History</h2>
          </div>
          <button className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg shadow-blue-500/30">
            <Download className="w-4 h-4" />
            <span>Export</span>
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search transactions..."
              className="w-full pl-11 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400"
            />
          </div>

          {/* Type Filter */}
          <select
            value={filterType}
            onChange={(e) => handleFilterTypeChange(e.target.value as TransactionType | 'all')}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white font-medium"
          >
            <option value="all">All Types</option>
            <option value="deposit">💰 Deposit</option>
            <option value="withdraw">💸 Withdraw</option>
            <option value="transfer">🔄 Transfer</option>
            <option value="deal-funding">💼 Deal Funding</option>
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => handleFilterStatusChange(e.target.value as TransactionStatus | 'all')}
            className="px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:border-gray-400 bg-white font-medium"
          >
            <option value="all">All Status</option>
            <option value="completed">✅ Completed</option>
            <option value="pending">⏳ Pending</option>
            <option value="failed">❌ Failed</option>
            <option value="cancelled">🚫 Cancelled</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600 font-medium">
            Showing <span className="text-blue-600 font-bold">{filteredTransactions.length}</span> of {transactions.length} transactions
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-gray-100 to-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Description
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                From/To
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                Status
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-100">
            {filteredTransactions.length > 0 ? (
              filteredTransactions.map((txn) => (
                <tr key={txn.id} className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 cursor-pointer transition-all duration-200 group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 ${getTypeBackground(txn.type)} rounded-lg group-hover:scale-110 transition-transform duration-200`}>
                        {getTypeIcon(txn.type)}
                      </div>
                      <span className="text-sm font-semibold text-gray-900 capitalize">
                        {txn.type.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{txn.description}</div>
                    {txn.dealName && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center">
                        <Briefcase className="w-3 h-3 mr-1" />
                        {txn.dealName}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-base font-bold text-gray-900">
                      ${txn.amount.toLocaleString()}
                    </div>
                    {txn.fee && txn.fee > 0 && (
                      <div className="text-xs text-gray-500 font-medium">Fee: ${txn.fee}</div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-700">
                      {txn.type === 'deposit' && (
                        <span className="font-medium text-green-700">{txn.senderName || 'External'}</span>
                      )}
                      {txn.type === 'withdraw' && (
                        <span className="font-medium text-blue-700">{txn.receiverName || 'Bank Account'}</span>
                      )}
                      {txn.type === 'transfer' && (
                        <div className="space-y-1">
                          <div className="text-xs text-gray-500">From: <span className="font-medium text-purple-700">{txn.senderName || 'You'}</span></div>
                          <div className="text-xs text-gray-500">To: <span className="font-medium text-purple-700">{txn.receiverName || 'Recipient'}</span></div>
                        </div>
                      )}
                      {txn.type === 'deal-funding' && (
                        <div className="space-y-1">
                          <div className="font-medium text-orange-700">{txn.senderName}</div>
                          <div className="text-xs text-gray-500 flex items-center">
                            → <span className="ml-1 font-medium">{txn.receiverName}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="font-medium text-gray-900">{new Date(txn.createdAt).toLocaleDateString()}</div>
                    <div className="text-xs text-gray-500">
                      {new Date(txn.createdAt).toLocaleTimeString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(txn.status)}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
                      <Filter className="w-10 h-10 text-gray-400" />
                    </div>
                    <div>
                      <p className="text-gray-700 font-semibold text-lg">No transactions found</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Try adjusting your filters or search query
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionHistory;