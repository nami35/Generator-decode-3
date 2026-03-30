export const generateOpReturn = (message: string): string => {
  if (!message) return '';
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // OP_RETURN limit is typically 80 bytes for standard relay
  if (data.length > 80) {
    return `Error: Message too long (${data.length} bytes). Max 80 bytes allowed.`;
  }
  
  const hexData = Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
  
  // OP_RETURN opcode is 0x6a
  // Push data opcode is the length of the data in hex (for length <= 75)
  // For length > 75, we need OP_PUSHDATA1 (0x4c) followed by length
  let pushDataOpcode = '';
  if (data.length <= 75) {
    pushDataOpcode = data.length.toString(16).padStart(2, '0');
  } else {
    pushDataOpcode = '4c' + data.length.toString(16).padStart(2, '0');
  }
  
  return `6a${pushDataOpcode}${hexData}`;
};
