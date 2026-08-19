import { ThyroidGuideline } from '../types';

export const THYROID_GUIDELINES: ThyroidGuideline[] = [
  // Recomendados
  {
    foodName: 'Nueces de Brasil / Coquitos',
    type: 'recommended',
    category: 'Frutos Secos',
    benefitOrReason: 'Mayor fuente natural de Selenio, cofactor esencial para la enzima deiodinasa que convierte T4 en T3 activa.',
    keyNutrient: 'Selenio (2 unidades cubren el 100% diario)',
    cookingRule: 'Consumir crudas, 1 a 2 unidades diarias.'
  },
  {
    foodName: 'Pescados Azules (Salmón, Sardina, Caballa)',
    type: 'recommended',
    category: 'Pescados',
    benefitOrReason: 'Ricos en ácidos grasos Omega-3 antiinflamatorios y Yodo equilibrado.',
    keyNutrient: 'Omega-3 + Yodo',
    cookingRule: 'Cocinar al vapor, horno o plancha a baja/media temperatura para preservar grasas buenas.'
  },
  {
    foodName: 'Huevos de Granja (con yema)',
    type: 'recommended',
    category: 'Lácteos y Huevos',
    benefitOrReason: 'Aporte de Tirosina (aminoácido base de las hormonas tiroideas), Yodo y Selenio en la yema.',
    keyNutrient: 'L-Tirosina + Yodo',
    cookingRule: 'Hervidos, pasados por agua o escalfados.'
  },
  {
    foodName: 'Semillas de Calabaza y Sésamo',
    type: 'recommended',
    category: 'Semillas',
    benefitOrReason: 'Fuente primordial de Zinc, necesario para la síntesis de TSH y TRH.',
    keyNutrient: 'Zinc + Magnesio',
    cookingRule: 'Ligeramente tostadas o trituradas para mejorar absorción.'
  },
  {
    foodName: 'Carne Magra de Vacuno y Aves',
    type: 'recommended',
    category: 'Carnes',
    benefitOrReason: 'Aporte de Hierro hemo, Zinc y Tirosina. La deficiencia de hierro frena la peroxidasa tiroidea.',
    keyNutrient: 'Hierro Hemo + Zinc + Tirosina',
    cookingRule: 'Guisos lentos, plancha suave o papillote.'
  },
  {
    foodName: 'Algas Marinas (Wakame, Nori, Kombu)',
    type: 'recommended',
    category: 'Verduras del Mar',
    benefitOrReason: 'Fuente concentrada de Yodo para la síntesis de tiroxina.',
    keyNutrient: 'Yodo natural',
    cookingRule: 'Consumo moderado (no abusar si hay Hashimoto autoinmune activo).'
  },

  // Precaución / Requiere Cocción (Bociógenos)
  {
    foodName: 'Brócoli, Coliflor, Coles de Bruselas y Repollo',
    type: 'caution_cook',
    category: 'Crucíferas',
    benefitOrReason: 'Contienen glucosinolatos y goitrina que compiten con el yodo en la glándula.',
    keyNutrient: 'Glucosinolatos (Bociógenos)',
    cookingRule: '⚠️ OBLIGATORIO: Hervir o cocinar al vapor un mínimo de 10-15 minutos. El calor desactiva la enzima mirosinasa en un 80-90% haciéndolos seguros.'
  },
  {
    foodName: 'Espinacas crudas y Acelgas',
    type: 'caution_cook',
    category: 'Hojas Verdes',
    benefitOrReason: 'Contienen oxalatos y compuestos bociógenos leves.',
    keyNutrient: 'Oxalatos + Bociógenos leves',
    cookingRule: '⚠️ Saltear, cocer o blanquear antes de consumir en lugar de ensaladas crudas masivas.'
  },
  {
    foodName: 'Yuca / Mandioca cruda',
    type: 'caution_cook',
    category: 'Tubérculos',
    benefitOrReason: 'Contiene glucósidos cianogénicos que interfieren con el transporte de yodo.',
    keyNutrient: 'Compuestos cianogénicos',
    cookingRule: '⚠️ Hervir prolongadamente y descartar el agua de cocción.'
  },

  // A Evitar o Separar de la Medicación
  {
    foodName: 'Soja No Fermentada (Leche de soja, tofu crudo, proteína de soja aislada)',
    type: 'avoid',
    category: 'Legumbres',
    benefitOrReason: 'Las isoflavonas (genisteína) inhiben la peroxidasa tiroidea (TPO) y bloquean la absorción de levotiroxina.',
    keyNutrient: 'Isoflavonas de soja',
    cookingRule: 'Preferir solo fermentados (tempeh, miso) y alejar 4h de la medicación.'
  },
  {
    foodName: 'Café matutino junto a la Eutirox/Levotiroxina',
    type: 'avoid',
    category: 'Bebidas',
    benefitOrReason: 'Reduce la absorción intestinal de la hormona hasta en un 35-50%.',
    keyNutrient: 'Ácido clorogénico / Cafeína',
    cookingRule: '⚠️ Esperar un mínimo de 45 a 60 minutos entre tomar la pastilla en ayunas y el primer café o desayuno.'
  },
  {
    foodName: 'Suplementos de Calcio y Hierro juntos con la pastilla',
    type: 'avoid',
    category: 'Suplementación',
    benefitOrReason: 'Quelan la levotiroxina en el tracto digestivo.',
    keyNutrient: 'Carbonato de calcio / Sulfato ferroso',
    cookingRule: 'Espaciar al menos 4 horas de la dosis tiroidea.'
  }
];

export const CHOPPER_MEDICAL_TIPS = [
  {
    title: 'Regla de Oro del Despertar Pirata (Eutirox / Levotiroxina)',
    content: 'Toma tu medicación tiroidea con un vaso entero de agua natural en ayunas. Espera entre 45 y 60 minutos antes de desayunar o tomar café para garantizar la máxima absorción en el estómago.',
    icon: 'AlarmClock'
  },
  {
    title: 'Desactivación de Bociógenos en la Cocina de Sanji',
    content: 'Las verduras crucíferas (brócoli, coliflor, col) son muy saludables, pero NUNCA las consumas crudas en batidos verdes. Al cocinarlas al vapor o hervirlas más de 10 min, el calor neutraliza sus sustancias bociógenas.',
    icon: 'Flame'
  },
  {
    title: 'El Dúo Dinámico: Selenio + Zinc',
    content: 'Para que la hormona inactiva T4 se transforme en T3 (la que activa tu metabolismo basal y quema de grasa), necesitas 2 nueces de Brasil y un puñado de semillas de calabaza al día.',
    icon: 'Sparkles'
  },
  {
    title: 'Control de la Grasa Visceral y BMR',
    content: 'En hipotiroidismo el gasto metabólico basal (BMR) puede reducirse. Monitorear tu masa muscular con la báscula de Chopper ayuda a preservar el tejido activo que consume calorías incluso en reposo.',
    icon: 'Activity'
  }
];
