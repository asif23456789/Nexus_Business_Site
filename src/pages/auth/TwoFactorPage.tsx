import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import OTPInput from '../../components/auth/OTPInput';
import toast from 'react-hot-toast';

const TwoFactorPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isVerifying, setIsVerifying] = useState(false);
  
  // Get user data from login page (passed via navigation state)
  const userEmail = location.state?.email || 'user@example.com';
  const userRole = location.state?.role || 'entrepreneur';

  const handleOTPComplete = async (otp: string) => {
    setIsVerifying(true);

    // Simulate API verification
    setTimeout(() => {
      // Demo: Accept any 6-digit code, but suggest 123456
      if (otp === '123456' || otp.length === 6) {
        toast.success('2FA verified successfully!');
        // Redirect to appropriate dashboard
        navigate(userRole === 'entrepreneur' ? '/dashboard/entrepreneur' : '/dashboard/investor');
      } else {
        toast.error('Invalid verification code');
        setIsVerifying(false);
      }
    }, 1000);
  };

  const handleResend = () => {
    toast.success('New verification code sent!');
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full">
        {/* Back Button */}
        <button
          onClick={handleBack}
          className="flex items-center text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          <span className="text-sm">Back to Login</span>
        </button>

        {/* Icon */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <Shield className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Two-Factor Authentication
          </h2>
          <p className="text-gray-600 text-sm">
            We've sent a verification code to
          </p>
          <p className="text-gray-900 font-medium mt-1">{userEmail}</p>
        </div>

        {/* OTP Input */}
        <div className="mb-6">
          <OTPInput 
            onComplete={handleOTPComplete} 
            onResend={handleResend}
            length={6}
          />
        </div>

        {/* Demo Hint */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-xs text-blue-900 text-center">
            <strong>Demo Mode:</strong> Use code <span className="font-mono font-bold">123456</span> or any 6-digit code
          </p>
        </div>

        {/* Verification Status */}
        {isVerifying && (
          <div className="flex items-center justify-center space-x-2 text-blue-600">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            <span className="text-sm font-medium">Verifying...</span>
          </div>
        )}

        {/* Help Text */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500">
            Didn't receive the code? Check your spam folder or request a new one above.
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-start space-x-2">
            <Shield className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-gray-500">
              2FA adds an extra layer of security to your account. Never share your verification code with anyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorPage;