// Copied from hash-wasm (https://github.com/Daninet/hash-wasm/)

// MIT License

// Copyright (c) 2020 Dani Biró

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

const base64Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
const base64Lookup = new Uint8Array(256);
for (let i = 0; i < base64Chars.length; i++) {
  base64Lookup[base64Chars.charCodeAt(i)] = i;
}

export function encodeBase64(data: Uint8Array, pad = true): string {
  const len = data.length;
  const extraBytes = len % 3;
  const parts = [];

  const len2 = len - extraBytes;
  for (let i = 0; i < len2; i += 3) {
    const tmp = ((data[i] << 16) & 0xFF0000)
      + ((data[i + 1] << 8) & 0xFF00)
      + (data[i + 2] & 0xFF);

    const triplet = base64Chars.charAt((tmp >> 18) & 0x3F)
      + base64Chars.charAt((tmp >> 12) & 0x3F)
      + base64Chars.charAt((tmp >> 6) & 0x3F)
      + base64Chars.charAt(tmp & 0x3F);

    parts.push(triplet);
  }

  if (extraBytes === 1) {
    const tmp = data[len - 1];
    const a = base64Chars.charAt(tmp >> 2);
    const b = base64Chars.charAt((tmp << 4) & 0x3F);

    parts.push(`${a}${b}`);
    if (pad) {
      parts.push('==');
    }
  } else if (extraBytes === 2) {
    const tmp = (data[len - 2] << 8) + data[len - 1];
    const a = base64Chars.charAt(tmp >> 10);
    const b = base64Chars.charAt((tmp >> 4) & 0x3F);
    const c = base64Chars.charAt((tmp << 2) & 0x3F);
    parts.push(`${a}${b}${c}`);
    if (pad) {
      parts.push('=');
    }
  }

  return parts.join('');
}

export function getDecodeBase64Length(data: string): number {
  let bufferLength = Math.floor(data.length * 0.75);
  const len = data.length;

  if (data[len - 1] === '=') {
    bufferLength -= 1;
    if (data[len - 2] === '=') {
      bufferLength -= 1;
    }
  }

  return bufferLength;
}

export function decodeBase64(data: string): Uint8Array {
  const bufferLength = getDecodeBase64Length(data);
  const len = data.length;

  const bytes = new Uint8Array(bufferLength);

  let p = 0;
  for (let i = 0; i < len; i += 4) {
    const encoded1 = base64Lookup[data.charCodeAt(i)];
    const encoded2 = base64Lookup[data.charCodeAt(i + 1)];
    const encoded3 = base64Lookup[data.charCodeAt(i + 2)];
    const encoded4 = base64Lookup[data.charCodeAt(i + 3)];

    bytes[p] = (encoded1 << 2) | (encoded2 >> 4);
    p += 1;
    bytes[p] = ((encoded2 & 15) << 4) | (encoded3 >> 2);
    p += 1;
    bytes[p] = ((encoded3 & 3) << 6) | (encoded4 & 63);
    p += 1;
  }

  return bytes;
}
