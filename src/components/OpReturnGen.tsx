import React, { useState, useEffect } from 'react';
import { generateOpReturn } from '../lib/opReturn';

export default function OpReturnGen() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  useEffect(() => {
    if (input) {
      setResult(generateOpReturn(input));
    } else {
      setResult('');
    }
  }, [input]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">OP_RETURN Generator</h2>
      <p className="text-gray-600 mb-6 text-sm">
        Generate Bitcoin OP_RETURN script hex payloads. Maximum 80 bytes allowed.
      </p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            placeholder="Enter message to embed..."
          />
          <div className="text-xs text-gray-500 mt-1 text-right">
            {new TextEncoder().encode(input).length} / 80 bytes
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">OP_RETURN Hex</label>
          <div className="w-full p-4 bg-gray-50 border border-gray-200 rounded-lg min-h-[56px] break-all font-mono text-gray-800">
            {result || '...'}
          </div>
        </div>
      </div>
    </div>
  );
}
