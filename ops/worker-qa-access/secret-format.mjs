// Pure classification only. Never return the value, length, fragments or a hash.
export function classifyQaAccessSecret(value) {
  if (typeof value !== 'string' || value === '') return 'missing_or_empty';
  return /^[\x21-\x7e]{43,128}(?![\s\S])/.test(value) ? 'valid' : 'invalid_format';
}
