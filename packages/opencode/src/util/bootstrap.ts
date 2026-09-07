import { Global } from "@opencode-ai/core/global"
import * as fs from "node:fs"
import * as path from "node:path"
import { execSync } from "node:child_process"

export namespace Bootstrap {
  function loadEnv() {
    const candidates = [
      path.join(process.cwd(), ".env"),
      path.join(process.cwd(), ".env.local"),
      path.join(Global.Path.config, ".env"),
      path.join(Global.Path.data, ".env"),
    ]
    const loaded = new Set<string>()
    for (const envFile of candidates) {
      if (loaded.has(envFile)) continue
      loaded.add(envFile)
      if (!fs.existsSync(envFile)) continue
      try {
        const content = fs.readFileSync(envFile, "utf-8")
        for (const line of content.split(/\r?\n/)) {
          const trimmed = line.trim()
          if (!trimmed || trimmed.startsWith("#")) continue
          const eqIdx = trimmed.indexOf("=")
          if (eqIdx === -1) continue
          const key = trimmed.slice(0, eqIdx).trim()
          let val = trimmed.slice(eqIdx + 1).trim()
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1)
          }
          if (key && process.env[key] === undefined) {
            process.env[key] = val
          }
        }
      } catch {}
    }
  }

  export function init() {
    try {
      // 1. Configurar terminal Windows para UTF-8 (Code Page 65001) para exibição correta de glifos Unicode
      if (process.platform === "win32") {
        try {
          execSync("chcp 65001", { stdio: "ignore" })
        } catch {}
      }

      // 2. Carregar variáveis de ambiente de .env se existir
      loadEnv()

      // 3. Garantir auth.json com o OmniRoute por padrão se não existir ou sincronizar chave do env/embutida
      const authFile = path.join(Global.Path.data, "auth.json")
      const omnirouteKey =
        process.env.OMNIROUTE_API_KEY ||
        process.env.OPENCODE_OMNIROUTE_KEY ||
        process.env.EMBEDDED_OMNIROUTE_KEY ||
        ""
      const omnirouteUrl =
        process.env.OMNIROUTE_BASE_URL ||
        process.env.OPENCODE_OMNIROUTE_URL ||
        process.env.EMBEDDED_OMNIROUTE_URL ||
        "http://omniroute.local/v1"

      if (!fs.existsSync(authFile)) {
        fs.mkdirSync(Global.Path.data, { recursive: true })
        const defaultAuth = omnirouteKey
          ? {
              "opencode-omniroute": {
                type: "api",
                key: omnirouteKey,
                baseURL: omnirouteUrl,
              },
              omniroute: {
                type: "api",
                key: omnirouteKey,
                baseURL: omnirouteUrl,
              },
            }
          : {}
        fs.writeFileSync(authFile, JSON.stringify(defaultAuth, null, 2), "utf-8")
      } else if (omnirouteKey) {
        try {
          const current = JSON.parse(fs.readFileSync(authFile, "utf-8"))
          let changed = false
          for (const k of ["opencode-omniroute", "omniroute"]) {
            if (!current[k] || !current[k].key) {
              current[k] = {
                type: "api",
                key: omnirouteKey,
                baseURL: omnirouteUrl,
              }
              changed = true
            }
          }
          if (changed) {
            fs.writeFileSync(authFile, JSON.stringify(current, null, 2), "utf-8")
          }
        } catch {}
      }

      // 4. Garantir config.json padrão se não existir
      const configFile = path.join(Global.Path.config, "config.json")
      if (!fs.existsSync(configFile)) {
        fs.mkdirSync(Global.Path.config, { recursive: true })
        const defaultConfig = {
          $schema: "https://opencode.ai/config.json",
          model: "omniroute/auto/coding",
        }
        fs.writeFileSync(configFile, JSON.stringify(defaultConfig, null, 2), "utf-8")
      }
    } catch {
      // Fail-open: falha silenciosa para não interromper a inicialização
    }
  }
}
