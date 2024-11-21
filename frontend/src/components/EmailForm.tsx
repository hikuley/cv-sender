import React from 'react';
import { Mail, Type } from 'lucide-react';

interface EmailFormProps {
  email: string;
  subject: string;
  receiverName: string;
  coverLetter: string;
  onChange: (value: string) => void;
  onReceiverNameChange: (value: string) => void;
  onCoverLetterChange: (value: string) => void;
}

export function EmailForm({ email, subject, receiverName, coverLetter, onChange, onReceiverNameChange, onCoverLetterChange }: EmailFormProps) {
  return (
      <div className="space-y-4">
        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            Recipient Email
          </label>
          <div className="relative">
            <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => onChange(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pl-10"
                placeholder="Enter recipient's email"
                required
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Mail className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
            Subject
          </label>
          <div className="relative">
            <input
                id="subject"
                type="text"
                value={subject}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 pl-10"
                readOnly
            />
            <div className="absolute inset-y-0 left-0 flex items-center pl-3">
              <Type className="w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="space-y-1">
          <label htmlFor="receiverName" className="block text-sm font-medium text-gray-700">
            Receiver Name
          </label>
          <input
              id="receiverName"
              type="text"
              value={receiverName}
              onChange={(e) => onReceiverNameChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter receiver's name"
          />
        </div>

        <div className="space-y-1">
          <label htmlFor="coverLetter" className="block text-sm font-medium text-gray-700">
            Cover Letter
          </label>
          <textarea
              id="coverLetter"
              value={coverLetter}
              onChange={(e) => onCoverLetterChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              placeholder="Enter your cover letter"
              rows={6}
          />
        </div>
      </div>
  );
}