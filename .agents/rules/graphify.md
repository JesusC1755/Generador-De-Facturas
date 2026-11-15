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
