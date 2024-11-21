import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface StatusMessageProps {
  message: string;
  status: 'success' | 'error' | 'idle' | 'loading';
}

export function StatusMessage({ message, status }: StatusMessageProps) {
  if (!message) return null;

  return (
    <div
      className={`flex items-center space-x-2 justify-center p-3 rounded-lg
        ${status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}
    >
      {status === 'success' ? (
        <CheckCircle className="w-5 h-5 text-green-500" />
      ) : (
        <AlertCircle className="w-5 h-5 text-red-500" />
      )}
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
}