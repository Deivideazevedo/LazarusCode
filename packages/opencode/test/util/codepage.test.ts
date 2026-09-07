import { describe, expect, test } from "bun:test"
import { Codepage } from "../../src/util/codepage"
import * as fs from "fs"

describe("Codepage PowerBuilder Windows-1252", () => {
  test("identifies PowerBuilder file extensions correctly", () => {
    expect(Codepage.isPowerBuilderFile("w_main.srw")).toBe(true)
    expect(Codepage.isPowerBuilderFile("d_order.srd")).toBe(true)
    expect(Codepage.isPowerBuilderFile("u_tree.sru")).toBe(true)
    expect(Codepage.isPowerBuilderFile("f_calc.srf")).toBe(true)
    expect(Codepage.isPowerBuilderFile("s_data.srs")).toBe(true)
    expect(Codepage.isPowerBuilderFile("m_menu.srm")).toBe(true)
    expect(Codepage.isPowerBuilderFile("app.sra")).toBe(true)
    expect(Codepage.isPowerBuilderFile("q_query.srq")).toBe(true)

    expect(Codepage.isPowerBuilderFile("index.ts")).toBe(false)
    expect(Codepage.isPowerBuilderFile("config.json")).toBe(false)
    expect(Codepage.isPowerBuilderFile("README.md")).toBe(false)
  })

  test("decodes CP1252 bytes to UTF-8 string", () => {
    // 0xe7 = ç, 0xe3 = ã, 0x6f = o
    const bytes = new Uint8Array([0xe7, 0xe3, 0x6f])
    expect(Codepage.decode(bytes, "test.srd")).toBe("ção")
  })

  test("encodes UTF-8 string to CP1252 bytes", () => {
    const text = "Atenção: Observação com acentuação e cedilha"
    const encoded = Codepage.encode(text, "test.srd")
    const decoded = Codepage.decode(encoded, "test.srd")
    expect(decoded).toBe(text)
  })

  test("throws error when invalid CP1252 character (e.g. emoji) is used in PB file", () => {
    expect(() => {
      Codepage.encode("Código com emoji 🚀", "test.srd")
    }).toThrow("não é suportado no encoding Windows-1252")
  })

  test("prepareWrite returns Uint8Array for PB and string for normal file", () => {
    const pbResult = Codepage.prepareWrite("conteúdo", "test.srd")
    expect(pbResult instanceof Uint8Array).toBe(true)
    // In CP1252, 'ú' is 0xFA (single byte), NOT UTF-8 0xC3 0xBA
    if (pbResult instanceof Uint8Array) {
      expect(Array.from(pbResult)).toContain(0xfa)
      expect(Array.from(pbResult)).not.toContain(0xc3)
    }

    const normalResult = Codepage.prepareWrite("conteúdo", "test.ts")
    expect(typeof normalResult).toBe("string")
  })

  test("preserves byte-by-byte round-trip on real PowerBuilder source files if present", () => {
    const samplePath =
      "F:/Linguagens de Programação/PowerBuilder/Lazarusia/codigo_fonte/deivide/d_rel_vinc_frota_soltura.srd"
    if (fs.existsSync(samplePath)) {
      const original = fs.readFileSync(samplePath)
      const text = Codepage.decode(original, samplePath)
      const reencoded = Codepage.encode(text, samplePath)

      expect(Buffer.compare(original, Buffer.from(reencoded))).toBe(0)
    }
  })
})
