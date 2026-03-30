export const sha256 = async (message: string): Promise<string> => {
  if (!message) return '';
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

export const sha512 = async (message: string): Promise<string> => {
  if (!message) return '';
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-512', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Helper to derive an AES-GCM key from a password
const getAesKey = async (password: string): Promise<CryptoKey> => {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );
  return crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: encoder.encode('static-salt-for-aes-tool'),
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    true,
    ['encrypt', 'decrypt']
  );
};

export const aesEncrypt = async (text: string, password: string): Promise<string> => {
  if (!text || !password) return '';
  try {
    const key = await getAesKey(password);
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encrypted = await crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(text)
    );
    
    // Combine IV and encrypted data
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encrypted), iv.length);
    
    return Array.from(combined).map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    return 'Encryption error';
  }
};

export const aesDecrypt = async (hexCiphertext: string, password: string): Promise<string> => {
  if (!hexCiphertext || !password) return '';
  try {
    if (hexCiphertext.length % 2 !== 0) throw new Error('Invalid hex');
    const combined = new Uint8Array(hexCiphertext.length / 2);
    for (let i = 0; i < hexCiphertext.length; i += 2) {
      combined[i / 2] = parseInt(hexCiphertext.substring(i, i + 2), 16);
    }
    
    if (combined.length < 12) throw new Error('Data too short');
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const key = await getAesKey(password);
    
    const decrypted = await crypto.subtle.decrypt(
      { name: 'AES-GCM', iv },
      key,
      data
    );
    
    return new TextDecoder().decode(decrypted);
  } catch (e) {
    return 'Decryption error (Invalid key or corrupted data)';
  }
};

export const encodeBase64 = (text: string): string => {
  try {
    return btoa(unescape(encodeURIComponent(text)));
  } catch (e) {
    return 'Error encoding';
  }
};

export const decodeBase64 = (base64: string): string => {
  try {
    return decodeURIComponent(escape(atob(base64)));
  } catch (e) {
    return 'Invalid Base64';
  }
};

export const encodeHex = (text: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
};

export const decodeHex = (hex: string): string => {
  try {
    if (hex.length % 2 !== 0) return 'Invalid Hex (odd length)';
    const bytes = new Uint8Array(hex.length / 2);
    for (let i = 0; i < hex.length; i += 2) {
      bytes[i / 2] = parseInt(hex.substring(i, i + 2), 16);
    }
    const decoder = new TextDecoder();
    return decoder.decode(bytes);
  } catch (e) {
    return 'Invalid Hex';
  }
};
