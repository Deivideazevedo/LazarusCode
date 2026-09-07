# LazarusCode

> **The autonomous AI coding agent optimized for PowerBuilder and legacy system modernization.**

[![Version](https://img.shields.io/badge/version-1.0.0-blue.svg?style=flat-square)](https://github.com/SEU_USUARIO/lazaruscode)
[![License: MIT](https://img.shields.io/badge/license-MIT-green.svg?style=flat-square)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Windows%20%7C%20Linux%20%7C%20macOS-lightgrey.svg?style=flat-square)](https://github.com/SEU_USUARIO/lazaruscode)
[![Runtime](https://img.shields.io/badge/runtime-Bun-orange.svg?style=flat-square)](https://bun.sh)

---

## Overview

**LazarusCode** is a specialized, high-performance AI coding agent designed to revitalize enterprise software development. While standard AI coding tools often corrupt non-UTF-8 source files and fail to comprehend legacy 4GL paradigms, LazarusCode brings first-class AI code generation, refactoring, and terminal-driven agent workflows directly to **PowerBuilder** applications.

Built as an independent, isolated fork of OpenCode, LazarusCode guarantees that your files, configurations, and AI routing remain intact, conflict-free, and enterprise-ready.

---

## Key Features

### ⚡ Native PowerBuilder Support
- **First-Class File Recognition**: Full context and syntax support for PowerBuilder files (`.sra`, `.srw`, `.srm`, `.srs`, `.sru`, `.srd`, `.srf`, `.srp`, `.pbt`, `.pbw`).
- **Windows-1252 (CP1252) Encoding Preservation**: Automatically reads, processes, and writes files in ANSI / Windows-1252 encoding without breaking accents, international characters, or DataWindow syntax.

### 🔌 Turnkey OmniRoute Integration
- **Zero-Config Gateway**: Pre-configured with turnkey defaults for OmniRoute routing out-of-the-box.
- **Advanced Model Compatibility**: Easily leverage specialized models such as Big Pickle alongside standard LLM providers (Anthropic, OpenAI, Google, Groq, and custom endpoints).

### 🛡️ Complete Environment Isolation
- **Dedicated Profile Paths**: LazarusCode stores all settings and state in its own isolated directories:
  - Configuration: `~/.config/lazaruscode`
  - Data / Logs: `~/.local/share/lazaruscode`
- Safely coexists alongside existing OpenCode installations on the same workstation with zero cross-contamination.

### 💻 Rich Terminal User Interface (TUI)
- **Fluid Keyboard-Driven UX**: Interactive terminal session manager featuring split diffs, syntax highlighting, subagents, and command palette.
- **Single Portable Binary**: Compiles into a single, standalone `lazaruscode.exe` executable embedding the entire web engine and custom branding.

---

## Quick Start

### Running LazarusCode
Launch LazarusCode directly in your project folder:

```bash
lazaruscode
```

Or target a specific workspace directory:

```bash
lazaruscode "C:\Projetos\PowerBuilder\MeuApp"
```

---

## Building from Source

### Prerequisites
- [Bun](https://bun.sh) (v1.2 or higher)
- Git

### Build Instructions

1. **Clone the repository**:
   ```bash
   git clone https://github.com/SEU_USUARIO/lazaruscode.git
   cd lazaruscode
   ```

2. **Install dependencies**:
   ```bash
   bun install
   ```

3. **Compile the standalone executable**:
   ```bash
   bun.cmd run --cwd packages/opencode build --single
   ```

The compiled single binary will be generated at:
```
packages/opencode/dist/opencode-windows-x64/bin/lazaruscode.exe
```

---

## Configuration

LazarusCode reads its configuration from `~/.config/lazaruscode/opencode.json` (or project-level `lazaruscode.json` / `opencode.json`).

Example configuration:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "model": "omniroute/big-pickle",
  "provider": {
    "omniroute": {
      "npm": "@opencode-ai/omniroute-provider"
    }
  }
}
```

---

## License & Credits

LazarusCode is distributed under the **[MIT License](LICENSE)**.

### Acknowledgments
LazarusCode is proudly built upon the foundational codebase of [OpenCode](https://github.com/anomalyco/opencode) created by Anomaly / SST. All original platform architecture, components, and intellectual property remain copyright of the original OpenCode authors and contributors under the MIT License.
