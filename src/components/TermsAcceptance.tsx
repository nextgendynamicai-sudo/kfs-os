import React, { useState } from "react";
import { Check, X, FileText } from "lucide-react";
import { ModalPortal } from "./ModalPortal";
import { motion, AnimatePresence } from "framer-motion";

interface TermsAcceptanceProps {
  accepted: boolean;
  setAccepted: (val: boolean) => void;
  variant?: "light" | "dark";
}

export function TermsAcceptance({ accepted, setAccepted, variant = "dark" }: TermsAcceptanceProps) {
  const [showModal, setShowModal] = useState(false);

  const isDark = variant === "dark";
  const textColor = isDark ? "text-slate-300" : "text-slate-600";
  const linkColor = isDark ? "text-violet-400 hover:text-violet-300" : "text-violet-600 hover:text-violet-700";

  return (
    <div className="w-full my-4">
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={() => setAccepted(!accepted)}
          className={`flex-shrink-0 w-5 h-5 rounded border ${
            accepted 
              ? "bg-violet-600 border-violet-600 text-white" 
              : isDark ? "bg-slate-900 border-slate-700" : "bg-white border-slate-300"
          } flex items-center justify-center transition-colors cursor-pointer mt-0.5`}
        >
          {accepted && <Check size={14} strokeWidth={3} />}
        </button>
        <p className={`text-xs ${textColor} leading-tight text-left`}>
          He leído y acepto expresamente el{" "}
          <button
            type="button"
            onClick={() => setShowModal(true)}
            className={`font-bold underline ${linkColor} cursor-pointer inline-flex items-center gap-1`}
          >
            <FileText size={12} /> Contrato Marco de Términos y Condiciones
          </button>
          {" "}y doy mi consentimiento informado.
        </p>
      </div>

      <AnimatePresence>
        {showModal && (
          <ModalPortal>
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[999999] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="bg-slate-950 border border-violet-800 rounded-2xl w-full max-w-3xl max-h-[85vh] shadow-2xl flex flex-col"
              >
                <div className="p-4 border-b border-violet-900/50 flex justify-between items-center bg-slate-900/50 rounded-t-2xl">
                  <h3 className="font-black text-white text-sm uppercase tracking-wider flex items-center gap-2">
                    <FileText className="text-violet-500" size={18} /> Contrato Jurídico Vinculante
                  </h3>
                  <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors cursor-pointer">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="p-6 overflow-y-auto text-slate-300 text-sm leading-relaxed space-y-4 custom-scrollbar">
                  <h2 className="text-lg font-black text-white text-center mb-6">
                    CONTRATO MARCO DE TÉRMINOS Y CONDICIONES GENERALES DE USO, LICENCIAMIENTO Y OPERACIÓN TECNOLÓGICA DEL ECOSISTEMA AXIS NITRO
                  </h2>
                  
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs mb-6">
                    <p><strong>Titular y Operador de la Plataforma:</strong> KREATEK DEVELOPING SOFTWARE, C.A. / CREATE CLOUD SYSTEMS</p>
                    <p><strong>Domicilio Legal:</strong> Caracas, Distrito Capital, República Bolivariana de Venezuela</p>
                    <p><strong>Portal Web y Dominio Matriz:</strong> https://axisnitro.store</p>
                    <p><strong>Versión del Sistema y Núcleo Operativo:</strong> KFS OS Edición 8.0.0 / KAN CGOS Core</p>
                  </div>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO I: DECLARACIÓN PREVIA, NATURALEZA JURÍDICA Y CONSENTIMIENTO INFORMADO</h3>
                  <p>El presente documento constituye un contrato de adhesión y licenciamiento tecnológico legalmente vinculante, celebrado de conformidad con el Código Civil de Venezuela, el Código de Comercio, la Ley de Comercio Electrónico y la Ley sobre Mensajes de Datos y Firmas Electrónicas.</p>
                  <p>Regula de forma exhaustiva el acceso, registro, descarga, navegación, utilización, licenciamiento y ejecución de los módulos de software, aplicaciones web progresivas (PWA), aplicaciones compiladas (APK), ejecutables de escritorio (EXE), interfaces de programación de aplicaciones (APIs), bases de datos y servicios en la nube provistos por KREATEK DEVELOPING SOFTWARE, C.A. (en lo sucesivo, "LA EMPRESA" o "EL OPERADOR") a través de la marca y plataforma integral Axis Nitro (axisnitro.store), sustentada sobre la arquitectura de Create Cloud Systems y el sistema operativo KFS OS.</p>
                  <p>Toda persona natural o jurídica que ingrese, se registre, configure o ejecute cualquier servicio del ecosistema—ya sea en calidad de Comercio Afiliado / Dueño de Negocio (B2B), Usuario Consumidor Final (B2C), Repartidor de Despacho (Nitro Rider), Promotora o Agente de Red (Sales Network Partner), Cajero / Vendedor de Mostrador o Visitante—ostenta la condición de "USUARIO".</p>
                  <p>El Usuario declara haber leído, comprendido, aceptado y consentido de manera expresa, pura, simple, irrevocable y sin reservas cada una de las cláusulas, exclusiones y obligaciones aquí contenidas.</p>
                  <p>El clic en "Registrarse", "Aceptar", "Instalar", la creación de credenciales o el uso operativo de cualquiera de los subdominios de axisnitro.store surte plenos efectos de firma electrónica y consentimiento expreso.</p>
                  <p>En caso de inconformidad total o parcial con estas condiciones, el Usuario debe abstenerse estrictamente de acceder o hacer uso del ecosistema tecnológico.</p>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO II: ARQUITECTURA TECNOLÓGICA Y ESTRUCTURA DEL ECOSISTEMA (CGOS)</h3>
                  <p className="font-bold">CLÁUSULA PRIMERA (Definiciones Técnicas y Módulos Operativos):</p>
                  <p>Axis Nitro no opera como un software de gestión tradicional ni como un ERP convencional, sino como un Commercial Growth Operating System (CGOS): una infraestructura descentralizada de alto rendimiento distribuida en los siguientes componentes centrales:</p>
                  <ul className="list-disc pl-5 space-y-2 text-slate-400">
                    <li><strong>1. KFS OS (Kreatek Flow Systems Operating System):</strong> Núcleo arquitectónico del servidor, orquestador de lógica de negocios, eventos en caliente (hot-splits), autenticación criptográfica, persistencia de datos en Supabase y sincronización distribuida offline-first.</li>
                    <li><strong>2. Axis OS:</strong> Centro de mando administrativo, telemétrica, core ledger contable multidivisa y motor de cálculo de tasas de conversión oficiales sincronizadas en tiempo real con el Banco Central de Venezuela (BCV).</li>
                    <li><strong>3. Nitro OS / Nitro Market (axisnitro.store y sus subdominios):</strong> Entorno de vitrina comercial digital PWA autogenerado para cada comercio afiliado, permitiendo catálogo interactivo en vivo, recepción de pedidos y canalización de cobros vía mensajería y pasarelas.</li>
                    <li><strong>4. Axis Nitro POS:</strong> Terminal de punto de venta físico táctil, optimizado para operaciones de mostrador en laptops y dispositivos móviles, dotado de escaneo de códigos de barra mediante cámara (GS1 prefijo 759) y funcionamiento ininterrumpido sin conexión a internet (IndexedDB).</li>
                    <li><strong>5. Nitro Squad:</strong> Entorno de logística geolocalizada y despacho de última milla para la asignación satelital en tiempo real (LiveMap) de órdenes entre comercios, clientes finales y repartidores independientes.</li>
                    <li><strong>6. Create Cloud Systems:</strong> Infraestructura de servidores distribuidos, alojamiento en la nube, proxies locales y webhooks administrados por el holding corporativo.</li>
                    <li><strong>7. Sincro-Shield Fiscal Proxy:</strong> Protocolo técnico de comunicación e intermediación informática por agente local (fiscal-proxy.js) para la transmisión de comandos a impresoras fiscales homologadas.</li>
                    <li><strong>8. Sentinel (Automated SMS Conciliator):</strong> Algoritmo de parseo sintáctico mediante expresiones regulares para verificar transferencias bancarias de Pago Móvil a partir de SMS y comprobantes oficiales.</li>
                    <li><strong>9. Ghost Trap:</strong> Mecanismo algorítmico de seguridad en terminales POS que bloquea transacciones e interrumpe la pantalla de cobro ante patrones anómalos o intentos de alteración de inventario sin autorización.</li>
                  </ul>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO III: BLINDAJE REGULATORIO FINANCIERO Y RÉGIMEN DE DINERO NO BANCARIO</h3>
                  <p className="font-bold">CLÁUSULA SEGUNDA (Exclusión Bancaria y Carácter de Software as a Service):</p>
                  <p>LA EMPRESA no es una institución bancaria, entidad financiera, casa de bolsa, casa de cambio, pasarela fiduciaria de compensación ni Entidad Emisora de Dinero Electrónico (EEDE) bajo la tutela de la Superintendencia de las Instituciones del Sector Bancario (SUDEBAN) o el Banco Central de Venezuela (BCV).</p>
                  <p>LA EMPRESA presta exclusivamente servicios de licenciamiento de software, desarrollo informático e infraestructura de automatización de datos.</p>
                  
                  <p className="font-bold mt-4">CLÁUSULA TERCERA (Circuito Cerrado de Consumo y Prohibición Absoluta de Retiros B2C - No Cashout):</p>
                  <ul className="list-none space-y-3">
                    <li><strong>3.1. Naturaleza del Saldo:</strong> Todo saldo depositado, inyectado o acreditado por Usuarios Consumidores (B2C) dentro de la plataforma (ya sea en divisas, bolívares o activos digitales) constituye un pago anticipado e irrevocable de consumo comercial programado, el cual se convierte en saldo protegido o unidades de descuento dentro de la red.</li>
                    <li><strong>3.2. Prohibición de Retiro Fiduciario B2C:</strong> Queda expresamente prohibido que los usuarios finales soliciten retiros de dinero en efectivo, transferencias fiduciarias de vuelta a cuentas bancarias personales o liquidaciones de liquidez fuera de la red comercial. El saldo B2C solo puede extinguirse mediante el consumo directo de bienes y servicios en los comercios afiliados.</li>
                    <li><strong>3.3. Inexistencia de Rendimientos:</strong> Los balances y puntos en la plataforma no generan intereses, rendimientos de capital, dividendos ni están protegidos por el Fondo de Protección Social de los Depósitos Bancarios (FOGADE).</li>
                    <li><strong>3.4. Exclusividad de Retiro Mercantil B2B (Payouts):</strong> La potestad de solicitar desembolsos bancarios fiduciarios (Payouts) corresponde única y exclusivamente a los Comercios Afiliados (B2B) y Promotoras Verificadas, sustentada rigurosamente en la liquidación de ventas comerciales efectivamente completadas o en comisiones mercantiles devengadas y auditadas.</li>
                  </ul>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO IV: TÉRMINOS APLICABLES A COMERCIOS AFILIADOS Y DUEÑOS DE NEGOCIOS (B2B)</h3>
                  <p className="font-bold">CLÁUSULA CUARTA (Licenciamiento Mercantil y Responsabilidad de Operación):</p>
                  <p>LA EMPRESA otorga al Comercio Afiliado una licencia revocable, no exclusiva e intransferible para el uso de Axis Nitro POS, Axis OS y Nitro Market.</p>
                  <p>El Comercio reconoce que:</p>
                  <ul className="list-disc pl-5">
                    <li>LA EMPRESA no es productora, distribuidora, propietaria ni vendedora de los bienes ofrecidos en la vitrina digital de cada tienda.</li>
                    <li>El Comercio es el único responsable civil, penal y administrativo por la calidad, idoneidad, precio, garantía, permisología sanitaria y entrega de los productos que comercializa.</li>
                  </ul>
                  
                  <p className="font-bold mt-4">CLÁUSULA QUINTA (Responsabilidad Tributaria, Facturación y SENIAT):</p>
                  <ul className="list-none space-y-3">
                    <li><strong>5.1. Autonomía Fiscal:</strong> El Comercio asume la obligación de dar cumplimiento a la legislación tributaria venezolana (Código Orgánico Tributario, Ley de Impuesto al Valor Agregado, IGTF y ordenanzas municipales de actividades económicas).</li>
                    <li><strong>5.2. Deslinde del Proxy Fiscal:</strong> El software Sincro-Shield Fiscal opera estrictamente como un puente de comunicación digital entre la interfaz del usuario y la máquina fiscal o impresora conectada. LA EMPRESA no emite facturas a nombre de terceros ni asume responsabilidad por el desvío, alteración de reportes Z, fallas en memorias fiscales, reportes X o sanciones de clausura impuestas por el SENIAT derivadas del mal uso del hardware del comerciante.</li>
                  </ul>

                  <p className="font-bold mt-4">CLÁUSULA SEXTA (Tarifas, Regalías y Splits en Caliente):</p>
                  <p>El Comercio acepta los esquemas de compensación, cobros por configuración (setup), mensualidades de soporte en la nube y los porcentajes de regalías comerciales devengados por cada transacción completada dentro del ecosistema (distribuidos automáticamente a través del motor financiero de splits en caliente de KFS OS).</p>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO V: TÉRMINOS APLICABLES A CONSUMIDORES FINALES (B2C)</h3>
                  <p className="font-bold">CLÁUSULA SÉPTIMA (Cuentas, Identidad y Uso Personal):</p>
                  <p>El usuario consumidor se compromete a ingresar información fidedigna al momento de su verificación KYC y a custodiar sus contraseñas. Toda orden generada, transacción autorizada o punto canjeado desde su cuenta verificada se considerará legalmente emitida por dicho titular.</p>
                  
                  <p className="font-bold mt-4">CLÁUSULA OCTAVA (Relación Directa de Compraventa y Reclamos):</p>
                  <p>Toda relación de compraventa se suscribe de manera bilateral y directa entre el Consumidor y el Comercio respectivo. LA EMPRESA queda exenta de toda reclamación por falta de inventario, demoras en la preparación, mal estado de alimentos o discordancia entre la imagen de la vitrina web y el producto físico entregado.</p>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO VI: RÉGIMEN ESPECIAL PARA REPARTIDORES INDEPENDIENTES (NITRO RIDERS)</h3>
                  <p className="font-bold">CLÁUSULA NOVENA (Ausencia Absoluta de Relación Laboral - Blindaje LOTTT):</p>
                  <ul className="list-none space-y-3">
                    <li><strong>9.1. Naturaleza Civil/Mercantil:</strong> La vinculación jurídica entre LA EMPRESA y los Nitro Riders es de orden estrictamente civil y mercantil, como prestadores de servicios logísticos independientes.</li>
                    <li><strong>9.2. Falta de Subordinación:</strong> El Nitro Rider declara que no está sometido a jornada laboral obligatoria, régimen de exclusividad, salario fijo ni subordinación jurídica patronal en los términos del artículo 35 y siguientes de la Ley Orgánica del Trabajo, los Trabajadores y las Trabajadoras (LOTTT). El Rider determina con entera libertad sus horarios de conexión y la aceptación de los servicios de flete en la plataforma.</li>
                  </ul>

                  <p className="font-bold mt-4">CLÁUSULA DÉCIMA (Herramientas, Permisos Viales, Vehículos y Riesgos):</p>
                  <ul className="list-none space-y-3">
                    <li><strong>10.1. Propiedad y Gastos:</strong> El vehículo (motocicleta, bicicleta o automóvil) y el dispositivo celular constituyen herramientas de propiedad exclusiva del Rider. Los costos de combustible, mantenimiento, seguros obligatorios de Responsabilidad Civil de Vehículos (RCV), reposición de neumáticos y multas de tránsito son de su exclusiva cuenta.</li>
                    <li><strong>10.2. Exclusión por Accidentes y Siniestros:</strong> LA EMPRESA queda liberada de responsabilidad civil, penal o pecuniaria por accidentes viales, lesiones corporales, incapacidades, fallecimiento, robo del vehículo o daños a terceros acaecidos durante el trayecto de reparto.</li>
                    <li><strong>10.3. Responsabilidad por la Carga:</strong> El Rider responde por la custodia, integridad y entrega del paquete recibido del comercio hasta su entrega en el destino asignado.</li>
                  </ul>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO VII: RÉGIMEN PARA PROMOTORAS Y AGENTES DE CAPTACIÓN</h3>
                  <p className="font-bold">CLÁUSULA DÉCIMA PRIMERA (Mandato Mercantil de Intermediación):</p>
                  <p>Las Promotoras y Cazadoras operan como mandatarias mercantiles independientes de prospección comercial. No ostentan la representación legal, patronal ni societaria de LA EMPRESA. Su compensación económica se deriva exclusivamente de comisiones variables por cada comercio afiliado efectivamente verificado y de regalías residuales pactadas contractualmente. LA EMPRESA no garantiza salarios mínimos, viáticos fijos ni prestaciones sociales de carácter laboral.</p>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO VIII: TOKENOMICS, PROGRAMA DE LEALTAD (AXIS POINTS) Y POLÍTICA AOF</h3>
                  <p className="font-bold">CLÁUSULA DÉCIMA SEGUNDA (Naturaleza Jurídica y Paridad de los Axis Points):</p>
                  <p>Los Axis Points (AP) constituyen unidades métricas de descuento y fidelización comercial en circuito cerrado. Se establece formalmente su paridad interna de conversión: Los Axis Points no representan dinero de curso legal, moneda extranjera, divisas en custodia ni instrumentos bursátiles o criptoactivos transables en mercados financieros. Únicamente confieren al portador un derecho a descuento promocional de hasta el cincuenta por ciento (50%) en las compras realizadas en comercios afiliados.</p>
                  
                  <p className="font-bold mt-4">CLÁUSULA DÉCIMA TERCERA (Tasa de Salida por Inactividad - Asset Outflow Fee - AOF):</p>
                  <ul className="list-none space-y-3">
                    <li><strong>13.1. Mecanismo de Degradación:</strong> Para preservar la liquidez y evitar la acumulación estéril de descuentos, las cuentas de usuarios que permanezcan inactivas (sin compras, recargas ni tareas validadas) por más de quince (15) días continuos sufrirán una degradación progresiva del cero coma cinco por ciento (0,5%) sobre el saldo de puntos acumulados cada cinco (5) días.</li>
                    <li><strong>13.2. Rango FlowMaster:</strong> Los usuarios que alcancen el estatus FlowMaster (mediante el cumplimiento de 10 transacciones reales en al menos 4 comercios distintos con un volumen de 50.000 AP) obtienen inmunidad frente a la degradación algorítmica AOF.</li>
                  </ul>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO IX: PROTOCOLOS DE SEGURIDAD OPERATIVA Y ANTIFRAUDE</h3>
                  <p className="font-bold">CLÁUSULA DÉCIMA CUARTA (Sentinel SMS Conciliator y Auditoría de Pagos):</p>
                  <p>El procesamiento de pagos en bolívares mediante el módulo Sentinel se efectúa con base en la lectura automatizada de mensajes SMS bancarios y parámetros criptográficos. Cualquier intento de alteración de referencias bancarias, uso de comprobantes falsos, duplicación de hashes o simulación transaccional causará el bloqueo inmediato del Usuario, la anulación de saldos y la remisión del expediente a las autoridades competentes.</p>
                  
                  <p className="font-bold mt-4">CLÁUSULA DÉCIMA QUINTA (Protocolo Ghost Trap y Bloqueo Forense):</p>
                  <p>El terminal POS cuenta con el centinela Ghost Trap, el cual, ante anulaciones no autorizadas de comandas o supresión de productos facturados, congela la pantalla de cobro y emite un registro forense (ghostLogs). El desbloqueo del terminal requerirá exclusivamente las credenciales maestras autorizadas del establecimiento o del Operador Central.</p>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO X: LÍMITE ABSOLUTO DE RESPONSABILIDAD E INDEMNIDAD TOTAL</h3>
                  <p className="font-bold">CLÁUSULA DÉCIMA SEXTA (Exclusión por Caso Fortuito, Fuerza Mayor e Infraestructura):</p>
                  <p>LA EMPRESA no garantiza la disponibilidad ininterrumpida de sus servicios y se exonera de responsabilidad por:</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Fallas, interrupciones o fluctuaciones en la red eléctrica nacional, servicios de internet, proveedores de telefonía móvil (SMS) o centros de datos en la nube (Vercel, Supabase, Cloudflare).</li>
                    <li>Demoras, caídas operativas o indisponibilidad en las plataformas de banca electrónica venezolana, sistemas de Pago Móvil Interbancario o pasarelas de pago de terceros (Binance, Zinli, Zelle).</li>
                    <li>Ciberataques, hackeos, software malicioso en dispositivos de los usuarios o filtración de credenciales por negligencia imputable al Usuario.</li>
                  </ul>
                  
                  <p className="font-bold mt-4">CLÁUSULA DÉCIMA SÉPTIMA (Pacto Expreso de Indemnidad):</p>
                  <p>El Usuario (sea Comercio, Consumidor, Rider, Promotora o Cajero) se compromete a mantener plenamente indemne a KREATEK DEVELOPING SOFTWARE, C.A., Create Cloud Systems, sus filiales, directores, accionistas, ingenieros y apoderados legales frente a cualquier demanda judicial, denuncia penal, sanción administrativa del SENIAT, procedimiento de la SUNDDE, reclamo laboral de repartidores o acción civil derivada del uso indebido de la plataforma, violación de derechos de terceros o incumplimiento del presente contrato.</p>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO XI: PROPIEDAD INTELECTUAL Y DERECHOS DE AUTOR</h3>
                  <p className="font-bold">CLÁUSULA DÉCIMA OCTAVA (Propiedad Inalienable del Software):</p>
                  <p>Todo el código fuente, código objeto, algoritmos, arquitectura de bases de datos, diseños gráficos, esquemas glassmorphism, marcas comerciales ("Axis Nitro", "KFS OS", "KAN CGOS", "Axis OS", "Nitro Market", "Nitro Squad", "Oracle AI", "Sincro-Shield Fiscal"), logotipos, manuales operativos y documentación técnica son propiedad exclusiva de LA EMPRESA.</p>
                  <p>Queda terminantemente prohibida su descompilación, ingeniería inversa, reproducción no autorizada, copia de código o explotación comercial no licenciada.</p>

                  <h3 className="text-violet-400 font-bold uppercase mt-6">TÍTULO XII: MODIFICACIÓN UNILATERAL, DOMICILIO, LEY Y JURISDICCIÓN</h3>
                  <p className="font-bold">CLÁUSULA DÉCIMA NOVENA (Modificaciones):</p>
                  <p>LA EMPRESA se reserva el derecho de modificar unilateralmente las cláusulas del presente contrato, publicando la versión actualizada en el portal https://axisnitro.store. El uso ininterrumpido de los servicios tras dicha publicación constituye la aceptación íntegra de las nuevas condiciones.</p>

                  <p className="font-bold mt-4">CLÁUSULA VIGÉSIMA (Legislación Aplicable y Jurisdicción Exclusiva):</p>
                  <p>Para la validez, interpretación, cumplimiento y ejecución del presente contrato, las partes se someten a las leyes de la República Bolivariana de Venezuela. Para todos los efectos legales, se elige como domicilio procesal y especial a la ciudad de Caracas, Distrito Capital. Toda divergencia o litigio que no pueda ser resuelto de mutuo acuerdo será sometido al conocimiento y decisión exclusiva de los Tribunales con competencia en materia Mercantil de la Circunscripción Judicial del Área Metropolitana de Caracas, con expresa renuncia a cualquier otro fuero que pudiera corresponder por razón del territorio o domicilio.</p>
                </div>

                <div className="p-4 border-t border-violet-900/50 flex justify-end gap-3 bg-slate-900/50 rounded-b-2xl">
                  <button 
                    type="button"
                    onClick={() => {
                      setAccepted(true);
                      setShowModal(false);
                    }}
                    className="bg-violet-600 hover:bg-violet-500 text-white font-bold py-2 px-6 rounded-lg transition-colors cursor-pointer"
                  >
                    Entiendo y Acepto los Términos
                  </button>
                </div>
              </motion.div>
            </div>
          </ModalPortal>
        )}
      </AnimatePresence>
    </div>
  );
}

export interface LegalTermsAudit {
  accepted: boolean;
  acceptedAt: string;
  contractVersion: string;
  contractHash: string;
  digitalSignature: string;
  userAgent: string;
  acceptanceMode: string;
}

export function generateLegalTermsAudit(): LegalTermsAudit {
  return {
    accepted: true,
    acceptedAt: new Date().toISOString(),
    contractVersion: "8.0.0-AXIS-NITRO-LEGAL",
    contractHash: "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069",
    digitalSignature: `CLW-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "Client-App",
    acceptanceMode: "Clickwrap Consentimiento Informado (Ley de Mensajes de Datos y Firmas Electrónicas)"
  };
}
