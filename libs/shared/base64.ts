/**
 * Encode a UTF-8 string to base64
 * @param str - String to encode
 * @returns Base64-encoded string
 */
export const encodeBase64 = (str: string): string => {
  const bytes = new TextEncoder().encode(str)
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }
  return btoa(binary)
}

/**
 * Decode a base64 string to UTF-8
 * @param b64 - Base64 string to decode (newlines are ignored)
 * @returns Decoded UTF-8 string
 */
export const decodeBase64 = (b64: string): string => {
  const binary = atob(b64.replace(/\n/g, ''))
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new TextDecoder().decode(bytes)
}
