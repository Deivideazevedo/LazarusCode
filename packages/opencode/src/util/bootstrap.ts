import { Global } from "@opencode-ai/core/global"
import * as fs from "node:fs"
import * as path from "node:path"
import { execSync } from "node:child_process"

export namespace Bootstrap {
  export function init() {
    try {
      // 0. Configurar terminal Windows para UTF-8 (Code Page 65001) para exibição correta de glifos Unicode
      if (process.platform === "win32") {
        try {
          execSync("chcp 65001", { stdio: "ignore" })
        } catch {}
      }

      // 1. Garantir auth.json com o OmniRoute por padrão se não existir
      const authFile = path.join(Global.Path.data, "auth.json")
      if (!fs.existsSync(authFile)) {
        fs.mkdirSync(Global.Path.data, { recursive: true })
        const defaultAuth = {
          "opencode-omniroute": {
            type: "api",
            key: "sk-eef5d2d33b5f591b-79df1d-2559ca2c",
            baseURL: "http://omniroute.local/v1",
          },
          omniroute: {
            type: "api",
            key: "sk-eef5d2d33b5f591b-79df1d-2559ca2c",
            baseURL: "http://omniroute.local/v1",
          },
        }
        fs.writeFileSync(authFile, JSON.stringify(defaultAuth, null, 2), "utf-8")
      }

      // 2. Garantir config.json padrão se não existir
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
