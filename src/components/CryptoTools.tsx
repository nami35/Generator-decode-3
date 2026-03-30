import React, { useState, useEffect } from 'react';
import { sha256, sha512, encodeBase64, decodeBase64, encodeHex, decodeHex, aesEncrypt, aesDecrypt } from '../lib/crypto';

export default function CryptoTools() {
  const [input, setInput] = useState('');
  const [hash256, setHash256] = useState('');
  const [hash512, setHash512] = useState('');
  const [b64Encoded, setB64Encoded] = useState('');
  const [b64Decoded, setB64Decoded] = useState('');
  const [hexEncoded, setHexEncoded] = useState('');
  const [hexDecoded, setHexDecoded] = useState('');

  const [aesKey, setAesKey] = useState('');
  const [aesEncrypted, setAesEncrypted] = useState('');
  const [aesDecrypted, setAesDecrypted] = useState('');

  useEffect(() => {
    if (input) {
      sha256(input).then(setHash256);
      sha512(input).then(setHash512);
      setB64Encoded(encodeBase64(input));
      setB64Decoded(decodeBase64(input));
      setHexEncoded(encodeHex(input));
      setHexDecoded(decodeHex(input));
    } else {
      setHash256('');
      setHash512('');
      setB64Encoded('');
      setB64Decoded('');
      setHexEncoded('');
      setHexDecoded('');
    }
  }, [input]);

  useEffect(() => {
    if (input && aesKey) {
      aesEncrypt(input, aesKey).then(setAesEncrypted);
      aesDecrypt(input, aesKey).then(setAesDecrypted);
    } else {
      setAesEncrypted('');
      setAesDecrypted('');
    }
  }, [input, aesKey]);

  return (
    <div className="p-6 bg-white rounded-xl shadow-sm border border-gray-100">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">Cryptography Tools</h2>
      
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Input Text / Data</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all min-h-[100px]"
            placeholder="Type here to encode/decode..."
          />
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultBox label="SHA-256 Hash" value={hash256} />
            <ResultBox label="SHA-512 Hash" value={hash512} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultBox label="Base64 Encoded" value={b64Encoded} />
            <ResultBox label="Base64 Decoded (if valid)" value={b64Decoded} />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ResultBox label="Hex Encoded" value={hexEncoded} />
            <ResultBox label="Hex Decoded (if valid)" value={hexDecoded} />
          </div>

          <div className="pt-6 mt-6 border-t border-gray-100">
            <h3 className="text-lg font-medium text-gray-800 mb-4">AES-GCM Encryption</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Secret Key (Password)</label>
              <input
                type="password"
                value={aesKey}
                onChange={(e) => setAesKey(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter a secret key to encrypt/decrypt..."
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <ResultBox label="AES Encrypted (Hex)" value={aesEncrypted} />
              <ResultBox label="AES Decrypted (if valid hex input)" value={aesDecrypted} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResultBox({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <div className="w-full p-3 bg-gray-50 border border-gray-200 rounded-lg min-h-[46px] break-all font-mono text-sm text-gray-800">
        {value || '...'}
      </div>
    </div>
  );
}
