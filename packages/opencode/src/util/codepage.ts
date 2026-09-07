import * as path from "path"

export namespace Codepage {
  const PB_EXT_REGEX = /^\.sr[a-z0-9_]+$/i
  const BOM_CODE = 0xfeff
  const BOM = String.fromCharCode(BOM_CODE)

  const CP1252_DECODER = new TextDecoder("windows-1252")
  const UTF8_DECODER = new TextDecoder("utf-8", { ignoreBOM: true })
  const UTF8_ENCODER = new TextEncoder()

  const TO_CP1252 = new Int16Array(65536).fill(-1)
  for (let b = 0; b < 256; b++) {
    const char = CP1252_DECODER.decode(new Uint8Array([b]))
    TO_CP1252[char.charCodeAt(0)] = b
  }

  export function isPowerBuilderFile(filePath: string) {
    const ext = path.extname(filePath)
    return PB_EXT_REGEX.test(ext)
  }

  export function createDecoder(filePath?: string) {
    if (filePath && isPowerBuilderFile(filePath)) {
      return new TextDecoder("windows-1252")
    }
    return new TextDecoder("utf-8")
  }

  export function decode(bytes: Uint8Array, filePath?: string) {
    if (filePath && isPowerBuilderFile(filePath)) {
      return CP1252_DECODER.decode(bytes)
    }
    return UTF8_DECODER.decode(bytes)
  }

  export function encode(text: string, filePath?: string): Uint8Array {
    if (!filePath || !isPowerBuilderFile(filePath)) {
      return UTF8_ENCODER.encode(text)
    }

    const normalized = text.normalize("NFC")
    const bytes = new Uint8Array(normalized.length)

    for (let i = 0; i < normalized.length; i++) {
      const code = normalized.charCodeAt(i)
      const byte = TO_CP1252[code]
      if (byte === -1 || byte === undefined) {
        const codePoint = normalized.codePointAt(i) ?? code
        const charStr = String.fromCodePoint(codePoint)
        throw new Error(
          `Caractere '${charStr}' (U+${codePoint.toString(16).toUpperCase().padStart(4, "0")}) não é suportado no encoding Windows-1252 (PowerBuilder .sr*). Remova este caractere e tente novamente.`,
        )
      }
      bytes[i] = byte
    }

    return bytes
  }

  export function prepareWrite(text: string, filePath: string, bom?: boolean): string | Uint8Array {
    const stripped = text.charCodeAt(0) === BOM_CODE ? text.slice(1) : text
    if (isPowerBuilderFile(filePath)) {
      return encode(stripped, filePath)
    }
    return bom ? BOM + stripped : stripped
  }
}
