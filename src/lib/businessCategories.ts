export interface DemoProductPreset {
  name: string;
  priceUSD: number;
  image: string;
}

export interface BusinessCategoryInfo {
  key: string;
  name: string;
  shortName: string;
  emoji: string;
  color: string;
  keywords: string[];
  defaultProds: DemoProductPreset[];
}

export const BUSINESS_CATEGORIES: BusinessCategoryInfo[] = [
  {
    key: "bodegon",
    name: "🛒 Bodegón / Supermercado / Víveres",
    shortName: "Bodegón & Víveres",
    emoji: "🛒",
    color: "#F59E0B",
    keywords: ["bodegon", "supermercado", "viveres", "comestibles", "harina", "queso", "arroz", "aceite", "cafe", "alimentos", "despensa", "charcuteria", "enlatados", "pasta", "azucar"],
    defaultProds: [
      { name: "Harina de Maíz Pan 1kg", priceUSD: 1.25, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=60" },
      { name: "Queso Amarillo Paisa 500g", priceUSD: 4.80, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=600&auto=format&fit=crop&q=60" },
      { name: "Café Molido Gourmet 250g", priceUSD: 2.50, image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=60" },
      { name: "Aceite Vegetal 1L", priceUSD: 3.20, image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "comida",
    name: "🍔 Comida Rápida / Restaurante / Hamburguesería",
    shortName: "Comida & Restaurante",
    emoji: "🍔",
    color: "#EF4444",
    keywords: ["comida", "restaurante", "hamburguesa", "pizza", "comida rapida", "fast food", "almuerzo", "cena", "papas", "sushi", "tacos", "perros calientes", "alitas", "combo"],
    defaultProds: [
      { name: "Hamburguesa Doble Carne con Queso Cheddar", priceUSD: 6.50, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=60" },
      { name: "Pizza Familiar 4 Sabores con Borde de Queso", priceUSD: 12.00, image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=60" },
      { name: "Papas Fritas Grandes con Tocineta", priceUSD: 3.50, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&auto=format&fit=crop&q=60" },
      { name: "Refresco 2L Sabor Original", priceUSD: 2.00, image: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "farmacia",
    name: "💊 Farmacia / Salud / Cuidado Personal",
    shortName: "Farmacia & Salud",
    emoji: "💊",
    color: "#10B981",
    keywords: ["farmacia", "salud", "medicamentos", "pastillas", "jarabe", "vitaminas", "alcohol", "primeros auxilios", "drogueria", "medicina", "analgesico", "antibiotico", "cuidado personal", "bienestar"],
    defaultProds: [
      { name: "Acetaminofén 500mg (Caja 10 Tabletas)", priceUSD: 1.50, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60" },
      { name: "Alcohol Antiséptico 70% 500ml", priceUSD: 2.00, image: "https://images.unsplash.com/photo-1583947215259-38e31be8751f?w=600&auto=format&fit=crop&q=60" },
      { name: "Vitamina C Efervescente 1000mg", priceUSD: 3.50, image: "https://images.unsplash.com/photo-1550572017-edd951aa8f72?w=600&auto=format&fit=crop&q=60" },
      { name: "Suero Oral Electrolitos 500ml", priceUSD: 1.80, image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "ropa",
    name: "👕 Ropa / Moda / Boutique",
    shortName: "Moda & Boutique",
    emoji: "👕",
    color: "#8B5CF6",
    keywords: ["ropa", "moda", "boutique", "textil", "camisas", "pantalones", "franelas", "vestidos", "jeans", "tienda de ropa", "outfit", "confeccion", "chaquetas", "camisetas"],
    defaultProds: [
      { name: "Franela Oversize Premium 100% Algodón", priceUSD: 15.00, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=60" },
      { name: "Jeans Clásico Denim Azul Oscuro", priceUSD: 25.00, image: "https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=60" },
      { name: "Gorra Urbana con Bordado 3D", priceUSD: 10.00, image: "https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600&auto=format&fit=crop&q=60" },
      { name: "Suéter Casual Cuello Redondo", priceUSD: 22.00, image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "ferreteria",
    name: "🔧 Ferretería / Construcción / Iluminación",
    shortName: "Ferretería & Hogar",
    emoji: "🔧",
    color: "#3B82F6",
    keywords: ["ferreteria", "construccion", "herramientas", "bombillos", "cables", "tubos", "pintura", "tornillos", "hogar", "electricidad", "plomeria", "taladro", "candado"],
    defaultProds: [
      { name: "Bombillo LED 12W Luz Blanca 6500K", priceUSD: 1.80, image: "https://images.unsplash.com/photo-1550985616-10810253b84d?w=600&auto=format&fit=crop&q=60" },
      { name: "Cinta Teflón Profesional 3/4", priceUSD: 0.80, image: "https://images.unsplash.com/photo-1581783342308-f792dbdd27c5?w=600&auto=format&fit=crop&q=60" },
      { name: "Destornillador Doble Punta Imantado", priceUSD: 3.00, image: "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?w=600&auto=format&fit=crop&q=60" },
      { name: "Candado de Seguridad Reforzado 50mm", priceUSD: 6.50, image: "https://images.unsplash.com/photo-1582139329536-e7284fece509?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "automotriz",
    name: "🚗 Repuestos / Taller Mecánico / Automotriz",
    shortName: "Repuestos Automotriz",
    emoji: "🚗",
    color: "#F97316",
    keywords: ["repuestos", "automotriz", "taller", "mecanica", "carros", "motos", "aceite motor", "frenos", "baterias", "cauchos", "repuestos de autos", "bujias", "amortiguadores", "filtro", "vehiculos"],
    defaultProds: [
      { name: "Aceite Motor Semi-Sintético 20W50 1 Galón", priceUSD: 22.00, image: "https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=600&auto=format&fit=crop&q=60" },
      { name: "Juego de Pastillas de Freno Delanteras", priceUSD: 18.50, image: "https://images.unsplash.com/photo-1600790142055-619df03207e6?w=600&auto=format&fit=crop&q=60" },
      { name: "Filtro de Aceite Universal Blindado", priceUSD: 5.00, image: "https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=60" },
      { name: "Juego de 4 Bujías de Iridium Alto Rendimiento", priceUSD: 14.00, image: "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "tecnologia",
    name: "💻 Tecnología / Teléfonos / Computación",
    shortName: "Tecnología & Celulares",
    emoji: "💻",
    color: "#06B6D4",
    keywords: ["tecnologia", "celulares", "telefonos", "computacion", "laptops", "audifonos", "cargadores", "electronica", "smartphones", "gadgets", "cables", "auriculares", "tablets", "reparacion"],
    defaultProds: [
      { name: "Cargador Rápido GaN 30W Tipo-C", priceUSD: 12.00, image: "https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&auto=format&fit=crop&q=60" },
      { name: "Auriculares Inalámbricos Bluetooth 5.3", priceUSD: 18.00, image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&auto=format&fit=crop&q=60" },
      { name: "Cable Blindado USB-C a USB-C de Carga Rápida", priceUSD: 6.00, image: "https://images.unsplash.com/photo-1588508065123-287b28e013da?w=600&auto=format&fit=crop&q=60" },
      { name: "Smartwatch Deportivo Resistente al Agua", priceUSD: 28.00, image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "panaderia",
    name: "🥖 Panadería / Pastelería / Café",
    shortName: "Panadería & Pastelería",
    emoji: "🥖",
    color: "#D97706",
    keywords: ["panaderia", "pasteleria", "panes", "tortas", "dulces", "croissant", "desayuno", "reposteria", "pan dulce", "cafe", "galletas", "pan campesino", "golfeados"],
    defaultProds: [
      { name: "Pan Campesino Artesanal Crujiente", priceUSD: 1.50, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=60" },
      { name: "Torta de Chocolate Húmeda Selva Negra", priceUSD: 16.00, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=60" },
      { name: "Croissant Francés de Mantequilla", priceUSD: 2.20, image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=600&auto=format&fit=crop&q=60" },
      { name: "Café Espresso Doble Molido al Momento", priceUSD: 1.80, image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "belleza",
    name: "💄 Belleza / Cosméticos / Peluquería & Barbería",
    shortName: "Belleza & Cosméticos",
    emoji: "💄",
    color: "#EC4899",
    keywords: ["belleza", "cosmeticos", "maquillaje", "peluqueria", "barberia", "spa", "cuidado facial", "shampoo", "perfumes", "unas", "labiales", "skincare", "tintes", "estetica"],
    defaultProds: [
      { name: "Serum Facial Antiedad con Ácido Hialurónico", priceUSD: 12.50, image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=60" },
      { name: "Shampoo Reparador sin Sal con Argán 500ml", priceUSD: 8.00, image: "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?w=600&auto=format&fit=crop&q=60" },
      { name: "Labial Matte Larga Duración Color Rubí", priceUSD: 6.50, image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=60" },
      { name: "Cera Fijadora Mate para Cabello Masculino", priceUSD: 7.00, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "mascotas",
    name: "🐶 Mascotas / Pet Shop / Veterinaria",
    shortName: "Mascotas & Veterinaria",
    emoji: "🐶",
    color: "#14B8A6",
    keywords: ["mascotas", "veterinaria", "pet shop", "perros", "gatos", "alimento animal", "correas", "vacunas", "snacks para mascotas", "croquetas", "champu de perro", "gatarina", "perrarina"],
    defaultProds: [
      { name: "Alimento Premium para Perro Adulto 4kg", priceUSD: 14.00, image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600&auto=format&fit=crop&q=60" },
      { name: "Arena Sanitaria Aglutinante para Gatos 5kg", priceUSD: 6.50, image: "https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=60" },
      { name: "Snack de Carne Deshidratada para Premios", priceUSD: 3.50, image: "https://images.unsplash.com/photo-1535294435445-d7249524ef2e?w=600&auto=format&fit=crop&q=60" },
      { name: "Shampoo Antipulgas y Garrapatas con Aloe", priceUSD: 5.80, image: "https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "licoreria",
    name: "🍾 Licorería / Vinos / Bodega de Licores",
    shortName: "Licorería & Vinos",
    emoji: "🍾",
    color: "#7C3AED",
    keywords: ["licoreria", "licores", "bodega de licores", "cervezas", "vinos", "whisky", "ron", "bebidas alcoholicas", "cocteles", "vodka", "hielo", "refrescos", "snack"],
    defaultProds: [
      { name: "Ron Añejo Reserva Especial 750ml", priceUSD: 14.00, image: "https://images.unsplash.com/photo-1527061011665-3652c757a4d4?w=600&auto=format&fit=crop&q=60" },
      { name: "Six Pack Cerveza Fría en Lata", priceUSD: 7.50, image: "https://images.unsplash.com/photo-1608270586620-248524c67de9?w=600&auto=format&fit=crop&q=60" },
      { name: "Botella Vino Tinto Cabernet Sauvignon 750ml", priceUSD: 9.00, image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=600&auto=format&fit=crop&q=60" },
      { name: "Whisky Escocés 12 Años 750ml", priceUSD: 32.00, image: "https://images.unsplash.com/photo-1527281400683-1aae777175f8?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "calzado",
    name: "👟 Calzado / Zapatería Deportiva & Casual",
    shortName: "Calzado & Zapatería",
    emoji: "👟",
    color: "#EA580C",
    keywords: ["calzado", "zapateria", "zapatos", "zapatillas", "sneakers", "sandalias", "botas", "mocasines", "calzado deportivo", "tacones", "medias", "tenis"],
    defaultProds: [
      { name: "Zapatillas Running Deportivas Ultraligeras", priceUSD: 35.00, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=60" },
      { name: "Zapatos Casuales Mocasín Cuero Café", priceUSD: 28.00, image: "https://images.unsplash.com/photo-1533867617858-e7b97e060509?w=600&auto=format&fit=crop&q=60" },
      { name: "Sandalias Ergonómicas Confort", priceUSD: 16.00, image: "https://images.unsplash.com/photo-1603808033192-082d6919d3e1?w=600&auto=format&fit=crop&q=60" },
      { name: "Pack 3 Pares de Medias Deportivas", priceUSD: 5.00, image: "https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "papeleria",
    name: "📚 Papelería / Librería / Oficina & Escolar",
    shortName: "Papelería & Librería",
    emoji: "📚",
    color: "#6366F1",
    keywords: ["papeleria", "libreria", "utiles escolares", "oficina", "cuadernos", "lapices", "hojas", "impresiones", "regalos", "carpetas", "marcadores", "resma"],
    defaultProds: [
      { name: "Resma Papel Carta 500 Hojas 75g", priceUSD: 4.50, image: "https://images.unsplash.com/photo-1586075010923-2dd4570fb338?w=600&auto=format&fit=crop&q=60" },
      { name: "Cuaderno Espiral Tapa Dura 100 Hojas", priceUSD: 2.50, image: "https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&auto=format&fit=crop&q=60" },
      { name: "Set 4 Resaltadores Colores Neón Pastel", priceUSD: 3.20, image: "https://images.unsplash.com/photo-1585336261026-7f41ba8314e3?w=600&auto=format&fit=crop&q=60" },
      { name: "Caja de 12 Bolígrafos Tinta Gel 0.7mm", priceUSD: 4.00, image: "https://images.unsplash.com/photo-1583485088034-697b5bc54ccd?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "optica",
    name: "👓 Óptica / Salud Visual / Lentes",
    shortName: "Óptica & Salud Visual",
    emoji: "👓",
    color: "#0284C7",
    keywords: ["optica", "lentes", "anteojos", "salud visual", "monturas", "cristales", "lentes de sol", "oftalmologia", "gotas", "lentes de contacto"],
    defaultProds: [
      { name: "Lentes de Sol Polarizados Protección UV400", priceUSD: 18.00, image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=60" },
      { name: "Solución Limpiadora Lentes de Contacto 360ml", priceUSD: 8.50, image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&auto=format&fit=crop&q=60" },
      { name: "Montura Oftálmica de Titanio Ultraligera", priceUSD: 34.00, image: "https://images.unsplash.com/photo-1591076482161-42ce6da69f67?w=600&auto=format&fit=crop&q=60" },
      { name: "Gotas Humectantes y Lubricantes Oculares", priceUSD: 5.50, image: "https://images.unsplash.com/photo-1584017911766-d451b3d0e843?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "fitness",
    name: "🏋️ Gimnasio / Suplementos / Deporte & Fitness",
    shortName: "Fitness & Suplementos",
    emoji: "🏋️",
    color: "#10B981",
    keywords: ["fitness", "gimnasio", "suplementos", "deportes", "proteina", "creatina", "pesas", "crossfit", "shakers", "aminoacidos", "barras de proteina", "entrenamiento"],
    defaultProds: [
      { name: "Proteína 100% Whey Isolate 2 lbs", priceUSD: 32.00, image: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=600&auto=format&fit=crop&q=60" },
      { name: "Creatina Monohidratada Micronizada 300g", priceUSD: 19.00, image: "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=600&auto=format&fit=crop&q=60" },
      { name: "Botella Shaker Mezclador Antifugas 700ml", priceUSD: 7.00, image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=60" },
      { name: "Set de Bandas Elásticas de Resistencia", priceUSD: 10.50, image: "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "limpieza",
    name: "🧼 Artículos de Limpieza / Hogar / Mantenimiento",
    shortName: "Limpieza & Aseo",
    emoji: "🧼",
    color: "#059669",
    keywords: ["limpieza", "articulos de aseo", "cloro", "detergente", "desinfectante", "jabon", "mantenimiento", "lavanderia", "limpiador", "escobas", "bolsas de basura"],
    defaultProds: [
      { name: "Detergente Líquido Concentrado Lavadora 3L", priceUSD: 6.80, image: "https://images.unsplash.com/photo-1585421514738-01798e348b17?w=600&auto=format&fit=crop&q=60" },
      { name: "Cloro Concentrado Desinfectante 1 Galón", priceUSD: 2.50, image: "https://images.unsplash.com/photo-1563453392212-326f5e854473?w=600&auto=format&fit=crop&q=60" },
      { name: "Desinfectante Multiuso Aroma Lavanda 2L", priceUSD: 3.20, image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=600&auto=format&fit=crop&q=60" },
      { name: "Pack 4 Esponjas Doble Uso Abrasivas", priceUSD: 1.80, image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "floristeria",
    name: "💐 Floristería / Regalos / Arreglos & Fiestas",
    shortName: "Floristería & Regalos",
    emoji: "💐",
    color: "#E11D48",
    keywords: ["floristeria", "flores", "rosas", "arreglos florales", "detalles", "globos", "regalos", "chocolates", "cumpleanos", "peluches", "plantas", "decoracion"],
    defaultProds: [
      { name: "Ramo de 12 Rosas Rojas Importadas", priceUSD: 22.00, image: "https://images.unsplash.com/photo-1561181286-d3fee7d55364?w=600&auto=format&fit=crop&q=60" },
      { name: "Arreglo con Globos Metalizados y Bombones", priceUSD: 18.00, image: "https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&auto=format&fit=crop&q=60" },
      { name: "Planta Orquídea Natural en Maceta", priceUSD: 16.50, image: "https://images.unsplash.com/photo-1525310072745-f49212b5ac6d?w=600&auto=format&fit=crop&q=60" },
      { name: "Caja Corazón con Chocolates Artesanales", priceUSD: 12.00, image: "https://images.unsplash.com/photo-1549007994-cb92caebd54b?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "reparacion",
    name: "📱 Servicio Técnico / Reparación de Celulares & Equipos",
    shortName: "Servicio Técnico Celulares",
    emoji: "📱",
    color: "#4F46E5",
    keywords: ["reparacion", "servicio tecnico", "celulares", "pantallas", "baterias", "vidrio templado", "forros", "mantenimiento de computadoras", "reparacion de telefonos", "tecnico"],
    defaultProds: [
      { name: "Cambio de Pantalla Display Celular", priceUSD: 35.00, image: "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600&auto=format&fit=crop&q=60" },
      { name: "Batería Interna Original de Repuesto", priceUSD: 20.00, image: "https://images.unsplash.com/photo-1609592807664-803a0a4c02bf?w=600&auto=format&fit=crop&q=60" },
      { name: "Instalación de Vidrio Templado 9D", priceUSD: 4.00, image: "https://images.unsplash.com/photo-1563770660941-20978e870e26?w=600&auto=format&fit=crop&q=60" },
      { name: "Forro Antigolpes Militar con Soporte", priceUSD: 8.50, image: "https://images.unsplash.com/photo-1601593346740-925612772716?w=600&auto=format&fit=crop&q=60" }
    ]
  },
  {
    key: "servicios",
    name: "⚡ Servicios Profesionales / Consultoría / Varios",
    shortName: "Servicios Profesionales",
    emoji: "⚡",
    color: "#64748B",
    keywords: ["servicios", "servicios profesionales", "consultoria", "mantenimiento tecnico", "reparaciones", "soporte", "agencia", "honorarios", "asesoria", "diseño", "varios"],
    defaultProds: [
      { name: "Hora de Consultoría o Asesoría Especializada", priceUSD: 30.00, image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&auto=format&fit=crop&q=60" },
      { name: "Diagnóstico y Mantenimiento Técnico Preventivo", priceUSD: 25.00, image: "https://images.unsplash.com/photo-1581092921461-eab62e97a780?w=600&auto=format&fit=crop&q=60" },
      { name: "Plan Mensual de Asistencia y Soporte", priceUSD: 60.00, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&auto=format&fit=crop&q=60" },
      { name: "Levantamiento Técnico y Presupuesto", priceUSD: 15.00, image: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&auto=format&fit=crop&q=60" }
    ]
  }
];

export const BUSINESS_CATEGORY_MAP: Record<string, BusinessCategoryInfo> = BUSINESS_CATEGORIES.reduce((acc, cat) => {
  acc[cat.key] = cat;
  return acc;
}, {} as Record<string, BusinessCategoryInfo>);

export function getCategoryPreset(key: string): BusinessCategoryInfo {
  return BUSINESS_CATEGORY_MAP[key] || BUSINESS_CATEGORY_MAP.bodegon;
}

export function searchBusinessCategories(query: string): BusinessCategoryInfo[] {
  if (!query || !query.trim()) return BUSINESS_CATEGORIES;
  
  const cleanQ = query.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  
  return BUSINESS_CATEGORIES.filter(cat => {
    // 1. Match key or name
    const cleanName = cat.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const cleanShort = cat.shortName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    if (cat.key.toLowerCase().includes(cleanQ) || cleanName.includes(cleanQ) || cleanShort.includes(cleanQ)) {
      return true;
    }
    
    // 2. Match keywords
    const matchKeyword = cat.keywords.some(kw => {
      const cleanKw = kw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return cleanKw.includes(cleanQ);
    });
    if (matchKeyword) return true;
    
    // 3. Match product names
    const matchProduct = cat.defaultProds.some(prod => {
      const cleanProd = prod.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      return cleanProd.includes(cleanQ);
    });
    return matchProduct;
  });
}
