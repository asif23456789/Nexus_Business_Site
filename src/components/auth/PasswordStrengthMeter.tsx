import React from 'react';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({ password }) => {
  const getPasswordStrength = (pwd: string) => {
    if (!pwd) return { score: 0, label: 'Empty', color: 'bg-gray-200' };
    
    let score = 0;
    const checks = {
      length: pwd.length >= 8,
      uppercase: /[A-Z]/.test(pwd),
      lowercase: /[a-z]/.test(pwd),
      number: /[0-9]/.test(pwd),
      special: /[^A-Za-z0-9]/.test(pwd),
    };

    Object.values(checks).forEach(check => {
      if (check) score++;
    });

    if (score <= 2) return { score, label: 'Weak', color: 'bg-red-500' };
    if (score <= 4) return { score, label: 'Good', color: 'bg-yellow-500' };
    return { score, label: 'Strong', color: 'bg-green-500' };
  };

  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[^A-Za-z0-9]/.test(password),
  };

  const strength = getPasswordStrength(password);

  return (
    <div className="mt-2">
      {/* Strength Bar */}
      <div className="flex items-center justify-between mb-2">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-300 ${strength.color}`}
            style={{ width: `${(strength.score / 5) * 100}%` }}
          />
        </div>
        <span className={`ml-2 text-sm font-medium ${
          strength.label === 'Weak' ? 'text-red-600' :
          strength.label === 'Good' ? 'text-yellow-600' : 'text-green-600'
        }`}>
          {strength.label}
        </span>
      </div>

      {/* Requirements List */}
      <div className="space-y-1">
        <div className={`flex items-center text-sm ${checks.length ? 'text-green-600' : 'text-gray-500'}`}>
          {checks.length ? <CheckCircle size={14} /> : <XCircle size={14} />}
          <span className="ml-2">At least 8 characters</span>
        </div>
        <div className={`flex items-center text-sm ${checks.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
          {checks.uppercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
          <span className="ml-2">One uppercase letter</span>
        </div>
        <div className={`flex items-center text-sm ${checks.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
          {checks.lowercase ? <CheckCircle size={14} /> : <XCircle size={14} />}
          <span className="ml-2">One lowercase letter</span>
        </div>
        <div className={`flex items-center text-sm ${checks.number ? 'text-green-600' : 'text-gray-500'}`}>
          {checks.number ? <CheckCircle size={14} /> : <XCircle size={14} />}
          <span className="ml-2">One number</span>
        </div>
        <div className={`flex items-center text-sm ${checks.special ? 'text-green-600' : 'text-gray-500'}`}>
          {checks.special ? <CheckCircle size={14} /> : <XCircle size={14} />}
          <span className="ml-2">One special character</span>
        </div>
      </div>

      {/* Security Tips */}
      {password.length > 0 && strength.score <= 2 && (
        <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <div className="flex items-center text-yellow-800">
            <AlertCircle size={14} />
            <span className="ml-2 text-sm font-medium">Security Tip</span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            Add more character types to make your password stronger and more secure.
          </p>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthMeter;