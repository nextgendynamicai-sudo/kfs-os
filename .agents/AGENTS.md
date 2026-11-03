# Reglas Infranqueables del Proyecto KFS OS

## Regla 1: Persistencia Absoluta e Indestructible de Registros entre Actualizaciones
- **Instrucción Infranqueable:** La fusión inicial de estado (`initialMerge` / `hydrateStorage`) en `KFSContext.tsx` DEBE mantener intactos todos los datos reales registrados por los usuarios (comercios/clients, promotoras, clientes/customers, riders, vendedores, inventario/products, vales y transacciones).
- **Prohibición:** NINGÚN cambio de versión de wipe (`CURRENT_WIPE_VERSION`), actualización de código o despliegue en Vercel o Supabase puede borrar, resetear o sobrescribir cuentas o transacciones creadas por usuarios reales. Toda migración o fusión de versión debe ser estrictamente incremental preservando la totalidad del conjunto de datos existente.
- **Validación Automática:** Cualquier cambio en la inicialización o contexto de almacenamiento debe preservar y fusionar primero las colecciones locales e IndexedDB/Supabase antes de aplicar baselines de fábrica.

## Regla 2: Aislamiento Estricto y Absoluto del Contexto (Strict Context Isolation)
- **Instrucción Infranqueable:** Todas las operaciones, lectura de logs, análisis, ejecución de scripts, lectura/escritura de archivos y resolución de problemas deben confinarse de manera **EXCLUSIVA** al entorno de trabajo de KFS OS (`c:\Users\javier\.gemini\antigravity-ide\scratch\kfs-os`).
- **Prohibición:** BAJO NINGÚN CONCEPTO se debe ligar, investigar, hacer referencia, mezclar ni arrastrar procesos, transcripciones o contextos de otros proyectos, carpetas externas u otras tareas en segundo plano. Si existe contaminación cruzada en el historial, debe ser ignorada por completo en favor de operar únicamente sobre el ecosistema de KFS OS.
- **Validación Automática:** Antes de ejecutar comandos, proponer soluciones o modificar código, el agente debe validar mentalmente que su objetivo se enmarca al 100% en la resolución de KFS OS. No se atenderán tareas de otros softwares dentro de esta conversación.
