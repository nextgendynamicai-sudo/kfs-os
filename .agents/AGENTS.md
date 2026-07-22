# Reglas Infranqueables del Proyecto KFS OS

## Regla 1: Persistencia Absoluta e Indestructible de Registros entre Actualizaciones
- **Instrucción Infranqueable:** La fusión inicial de estado (`initialMerge` / `hydrateStorage`) en `KFSContext.tsx` DEBE mantener intactos todos los datos reales registrados por los usuarios (comercios/clients, promotoras, clientes/customers, riders, vendedores, inventario/products, vales y transacciones).
- **Prohibición:** NINGÚN cambio de versión de wipe (`CURRENT_WIPE_VERSION`), actualización de código o despliegue en Vercel o Supabase puede borrar, resetear o sobrescribir cuentas o transacciones creadas por usuarios reales. Toda migración o fusión de versión debe ser estrictamente incremental preservando la totalidad del conjunto de datos existente.
- **Validación Automática:** Cualquier cambio en la inicialización o contexto de almacenamiento debe preservar y fusionar primero las colecciones locales e IndexedDB/Supabase antes de aplicar baselines de fábrica.
