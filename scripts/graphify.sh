#!/usr/bin/env bash
# Script portable para ejecutar Graphify en InvoiceCraft.
# Utiliza el entorno centralizado en ~/.graphify-env para reutilizar dependencias.
# Todos los resultados se almacenan en 'graphify-out/' (ignorado por Git).

set -euo pipefail

DIRECTORIO_SCRIPT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
RAIZ_PROYECTO="$(cd "$DIRECTORIO_SCRIPT/.." && pwd)"
ENTORNO_CENTRAL="$HOME/.graphify-env"
EJECUTABLE_CENTRAL="$ENTORNO_CENTRAL/bin/graphify"

# 1. Resolver ejecutable: usar comando global si existe, o el entorno central
if command -v graphify &>/dev/null; then
    EJECUTABLE_GRAPHIFY="graphify"
elif [ -x "$EJECUTABLE_CENTRAL" ]; then
    EJECUTABLE_GRAPHIFY="$EJECUTABLE_CENTRAL"
else
    echo "=========================================================="
    echo " Entorno central de Graphify no detectado (~/.graphify-env)."
    echo " Creando entorno central único e instalando dependencias..."
    echo "=========================================================="
    python3 -m venv "$ENTORNO_CENTRAL"
    "$ENTORNO_CENTRAL/bin/pip" install --quiet graphifyy
    mkdir -p "$HOME/.local/bin"
    ln -sf "$EJECUTABLE_CENTRAL" "$HOME/.local/bin/graphify"
    EJECUTABLE_GRAPHIFY="$EJECUTABLE_CENTRAL"
    echo "✅ Entorno central configurado exitosamente en $ENTORNO_CENTRAL"
fi

# 2. Asegurar que .gitignore incluya la carpeta de salida generada
ARCHIVO_GITIGNORE="$RAIZ_PROYECTO/.gitignore"
if [ -f "$ARCHIVO_GITIGNORE" ]; then
    if ! grep -q "graphify-out/" "$ARCHIVO_GITIGNORE" 2>/dev/null; then
        echo -e "\n# Graphify (Knowledge graph outputs)\ngraphify-out/" >> "$ARCHIVO_GITIGNORE"
        echo "ℹ️ Se añadió automáticamente 'graphify-out/' a tu .gitignore"
    fi
fi

# 3. Asegurar reglas automáticas para asistentes de IA
DIRECTORIO_REGLAS="$RAIZ_PROYECTO/.agents/rules"
ARCHIVO_REGLA="$DIRECTORIO_REGLAS/graphify.md"
if [ ! -f "$ARCHIVO_REGLA" ]; then
    mkdir -p "$DIRECTORIO_REGLAS"
    cat << 'EOF' > "$ARCHIVO_REGLA"
---
trigger: always_on
description: Consulta el grafo de conocimiento en graphify-out/ para preguntas sobre código y arquitectura.
---

## graphify (Grafo de Conocimiento)

Este proyecto cuenta con un grafo de conocimiento generado en `graphify-out/`.

Reglas para el asistente:
- Para preguntas sobre arquitectura, dependencias o ubicación de funciones/interfaces, si `graphify-out/graph.json` existe, consulta primero el grafo antes de hacer lecturas masivas de archivos.
- Puedes usar `graphify query "<pregunta o símbolo>"` o inspeccionar el grafo para obtener el subgrafo de dependencias exacto.
- Al modificar código relevante en la sesión, recuerda actualizar el grafo con `./scripts/graphify.sh` (extracción local AST rápida y gratuita).
EOF
    echo "ℹ️ Regla de Antigravity configurada en .agents/rules/graphify.md"
fi

# 4. Extracción de código AST por defecto
if [ "$#" -eq 0 ]; then
    echo "=========================================================="
    echo " Ejecutando Graphify: Análisis de código AST (Local/Gratuito)"
    echo " Directorio destino: $RAIZ_PROYECTO/graphify-out/"
    echo "=========================================================="
    "$EJECUTABLE_GRAPHIFY" extract "$RAIZ_PROYECTO" --code-only --out "$RAIZ_PROYECTO"
    
    echo ""
    echo "=========================================================="
    echo " Generando visor interactivo HTML (graph.html)..."
    echo "=========================================================="
    (cd "$RAIZ_PROYECTO" && "$EJECUTABLE_GRAPHIFY" export html)
    
    echo ""
    echo "✅ Análisis completado. Visor disponible en:"
    echo "   file://$RAIZ_PROYECTO/graphify-out/graph.html"
else
    "$EJECUTABLE_GRAPHIFY" "$@"
fi

