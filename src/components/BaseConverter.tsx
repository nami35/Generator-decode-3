import React, { useState, useEffect } from 'react';
import { convertBase } from '../lib/converter';

export default function BaseConverter() {
  const [input, setInput] = useState('');
  const [fromBase, setFromBase] = useState(10);
  const [toBase, setToBase] = useState(2);
  const [result, setResult] = useState('');

  useEffect(() => {
    if (input) {
      setResult(convertBase(input, fromBase, toBase));
    } else {
      setResult('');
    }
  }, [input, fromBase, toBase]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Base Converter</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Value</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter number..."
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">From Base</label>
            <select
              value={fromBase}
              onChange={(e) => setFromBase(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={2}>Base 2 (Binary)</option>
              <option value={3}>Base 3 (Ternary)</option>
              <option value={10}>Base 10 (Decimal)</option>
              <option value={16}>Base 16 (Hexadecimal)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">To Base</label>
            <select
              value={toBase}
              onChange={(e) => setToBase(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value={2}>Base 2 (Binary)</option>
              <option value={3}>Base 3 (Ternary)</option>
              <option value={10}>Base 10 (Decimal)</option>
              <option value={16}>Base 16 (Hexadecimal)</option>
            </select>
          </div>
        </div>

        <div className="pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Result</label>
          <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[56px] break-all font-mono text-gray-800">
            {result || '...'}
          </div>
        </div>
      </div>
    </div>
  );
}
