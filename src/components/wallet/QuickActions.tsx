import React from 'react';
import { Plus, ArrowDown, Send, Briefcase } from 'lucide-react';

interface QuickActionsProps {
  onDeposit: () => void;
  onWithdraw: () => void;
  onTransfer: () => void;
  onFundDeal: () => void;
  userRole: 'entrepreneur' | 'investor';
}

const QuickActions: React.FC<QuickActionsProps> = ({
  onDeposit,
  onWithdraw,
  onTransfer,
  onFundDeal,
  userRole,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Deposit */}
      <button
        onClick={onDeposit}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-green-500 hover:shadow-md transition-all group"
      >
        <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-green-500 transition-colors">
          <Plus className="w-6 h-6 text-green-600 group-hover:text-white" />
        </div>
        <span className="font-medium text-gray-900">Deposit</span>
        <span className="text-xs text-gray-500 mt-1">Add funds</span>
      </button>

      {/* Withdraw */}
      <button
        onClick={onWithdraw}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:shadow-md transition-all group"
      >
        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-blue-500 transition-colors">
          <ArrowDown className="w-6 h-6 text-blue-600 group-hover:text-white" />
        </div>
        <span className="font-medium text-gray-900">Withdraw</span>
        <span className="text-xs text-gray-500 mt-1">To bank</span>
      </button>

      {/* Transfer */}
      <button
        onClick={onTransfer}
        className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-500 hover:shadow-md transition-all group"
      >
        <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-purple-500 transition-colors">
          <Send className="w-6 h-6 text-purple-600 group-hover:text-white" />
        </div>
        <span className="font-medium text-gray-900">Transfer</span>
        <span className="text-xs text-gray-500 mt-1">Send money</span>
      </button>

      {/* Fund Deal (Investor only) */}
      {userRole === 'investor' && (
        <button
          onClick={onFundDeal}
          className="flex flex-col items-center justify-center p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-orange-500 hover:shadow-md transition-all group"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3 group-hover:bg-orange-500 transition-colors">
            <Briefcase className="w-6 h-6 text-orange-600 group-hover:text-white" />
          </div>
          <span className="font-medium text-gray-900">Fund Deal</span>
          <span className="text-xs text-gray-500 mt-1">Invest now</span>
        </button>
      )}
    </div>
  );
};

export default QuickActions;