import React from 'react';
import { FileDown } from 'lucide-react';
import { CVType } from '../data/cvTypes';

interface CVSelectorProps {
  selectedCV: string;
  onChange: (value: string) => void;
  cvTypes: CVType[];
}

export function CVSelector({ selectedCV, onChange, cvTypes }: CVSelectorProps) {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-700">
        Select CV Type
      </label>
      <div className="relative">
        <select
          value={selectedCV}
          onChange={(e) => onChange(e.target.value)}
          className="w-full px-4 py-2 bg-white border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors pr-10"
        >
          <option value="">Choose a CV type</option>
          {cvTypes.map((cv) => (
            <option key={cv.id} value={cv.id}>
              {cv.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <FileDown className="w-5 h-5 text-gray-400" />
        </div>
      </div>
    </div>
  );
}