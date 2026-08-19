import { FortnightDiet } from '../types';

export const INITIAL_FORTNIGHT_DIET: FortnightDiet = {
  id: 'diet-grandline-01',
  name: 'Dieta Grand Line: Piratas del Sombrero de Paja',
  createdAt: '2026-08-19',
  cycleWeeks: 2,
  weekDays: [
    // LUNES
    {
      dayOfWeek: 1,
      dayName: 'Lunes',
      notes: 'Inicio de travesía en el Mar del Este. Enfoque en recarga de glucógeno y Selenio para tiroides.',
      meals: [
        {
          id: 'mon-m1',
          type: 'breakfast',
          title: 'Desayuno Pirata: Tortilla de Huevos de Granja y Nueces de Brasil',
          timeSlot: '08:30',
          completed: false,
          recipe: {
            id: 'rec-01',
            name: 'Tortilla Francesa con Yema de Oro, Pan Integral y Nueces de Brasil',
            prepTimeMinutes: 5,
            cookTimeMinutes: 8,
            batchCookable: false,
            chefQuote: '¡Una dama o un pirata necesitan energía limpia desde el primer amanecer!',
            thyroidSafeCookingTip: '2 nueces de Brasil aportan el 100% de la dosis diaria de Selenio para activar T4 a T3.',
            ingredients: [
              { id: 'i1', name: 'Huevos enteros de gallina campera', amount: 2, unit: 'ud', category: 'lacteos_huevos', calories: 140, protein: 12.6, carbs: 0.8, fats: 9.8, thyroidFriendly: true, thyroidNote: 'Tirosina y Yodo en la yema' },
              { id: 'i2', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 },
              { id: 'i3', name: 'Pan 100% integral de masa madre', amount: 60, unit: 'g', category: 'legumbres_cereales', calories: 150, protein: 5.5, carbs: 28.0, fats: 1.2 },
              { id: 'i4', name: 'Nueces de Brasil (Castillo de Drum)', amount: 2, unit: 'ud', category: 'frutas', calories: 65, protein: 1.4, carbs: 1.2, fats: 6.5, thyroidFriendly: true, thyroidNote: 'Pico máximo de Selenio natural' }
            ],
            instructions: [
              'Batir los 2 huevos con una pizca de sal marina.',
              'Calentar la sartén con el aceite de oliva a fuego medio y verter los huevos batidos.',
              'Doblar la tortilla con cuidado en forma de media luna cuando cuaje.',
              'Tostar la rebanada de pan integral y acompañar con las 2 nueces de Brasil crudas.'
            ]
          }
        },
        {
          id: 'mon-m2',
          type: 'lunch',
          title: 'Banquete de Sanji: Pechuga de Pollo con Arroz Jazmín y Brócoli al Vapor',
          timeSlot: '14:00',
          completed: false,
          recipe: {
            id: 'rec-02',
            name: 'Pechuga Marinada al Limón, Arroz Jazmín y Brócoli Vaporizado',
            prepTimeMinutes: 10,
            cookTimeMinutes: 15,
            batchCookable: true,
            batchCookingTip: 'Cocina 4 pechugas y 300g de arroz en crudo el domingo. Consérvalos en tuppers de vidrio herméticos.',
            thyroidSafeCookingTip: '⚠️ Cocinar el brócoli al vapor >10 min neutraliza sus glucosinolatos haciéndolo 100% seguro para hipotiroidismo.',
            chefQuote: '¡La carne de primera para alimentar el apetito de Luffy!',
            ingredients: [
              { id: 'i5', name: 'Pechuga de pollo de corral', amount: 180, unit: 'g', category: 'carnes_pescados', calories: 220, protein: 42, carbs: 0, fats: 4.5, thyroidFriendly: true, thyroidNote: 'Zinc y Tirosina' },
              { id: 'i6', name: 'Arroz jazmín o basmati cocido', amount: 150, unit: 'g', category: 'legumbres_cereales', calories: 195, protein: 4.2, carbs: 43.5, fats: 0.5 },
              { id: 'i7', name: 'Brócoli fresco cortado', amount: 150, unit: 'g', category: 'verduras', calories: 50, protein: 4.2, carbs: 7.0, fats: 0.6, thyroidFriendly: false, thyroidNote: 'Crucífera: Cocer siempre al vapor >10 min' },
              { id: 'i8', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'Colocar los ramilletes de brócoli en la vaporera durante 12 minutos hasta que estén tiernos pero crujientes.',
              'Marinar la pechuga de pollo con limón, orégano y pimienta.',
              'Cocinar a la plancha con la mitad del aceite durante 4-5 minutos por lado.',
              'Servir junto al arroz jazmín y regar el brócoli con el resto del aceite de oliva en crudo.'
            ]
          }
        },
        {
          id: 'mon-m3',
          type: 'snack',
          title: 'Snack del Vigía (Usopp): Yogur Griego Natural con Semillas de Calabaza y Arándanos',
          timeSlot: '18:00',
          completed: false,
          recipe: {
            id: 'rec-03',
            name: 'Bol de Yogur Griego, Arándanos Frescos y Semillas de Calabaza',
            prepTimeMinutes: 3,
            cookTimeMinutes: 0,
            batchCookable: false,
            chefQuote: 'Snack ligero para mantener la concentración en el nido de cuervos.',
            thyroidSafeCookingTip: 'Las semillas de calabaza aportan Zinc clave para la conversión de TSH.',
            ingredients: [
              { id: 'i9', name: 'Yogur griego natural sin azúcar', amount: 150, unit: 'g', category: 'lacteos_huevos', calories: 145, protein: 14, carbs: 5.5, fats: 7.5 },
              { id: 'i10', name: 'Arándanos silvestres frescos', amount: 80, unit: 'g', category: 'frutas', calories: 45, protein: 0.6, carbs: 10.5, fats: 0.2 },
              { id: 'i11', name: 'Semillas de calabaza crudas', amount: 15, unit: 'g', category: 'frutas', calories: 85, protein: 4.5, carbs: 2.0, fats: 7.0, thyroidFriendly: true, thyroidNote: 'Rico en Zinc y Magnesio' }
            ],
            instructions: [
              'Verter el yogur griego en un cuenco.',
              'Lavar los arándanos y añadirlos por encima.',
              'Espolvorear las semillas de calabaza ligeramente tostadas.'
            ]
          }
        },
        {
          id: 'mon-m4',
          type: 'dinner',
          title: 'Festín Marino de All Blue: Salmón Salvaje con Espárragos y Boniato Asado',
          timeSlot: '21:30',
          completed: false,
          recipe: {
            id: 'rec-04',
            name: 'Lomo de Salmón al Horno con Espárragos Trigueros y Boniato',
            prepTimeMinutes: 10,
            cookTimeMinutes: 20,
            batchCookable: true,
            batchCookingTip: 'Asa 3 boniatos enteros en el horno el fin de semana para tenerlos listos en 1 minuto.',
            chefQuote: 'Pescado fresco del Gran Line para restaurar las fuerzas de la tripulación.',
            thyroidSafeCookingTip: 'El salmón es rey del Omega-3 y Yodo marino natural antiinflamatorio.',
            ingredients: [
              { id: 'i12', name: 'Lomo de salmón fresco', amount: 160, unit: 'g', category: 'carnes_pescados', calories: 330, protein: 32, carbs: 0, fats: 21, thyroidFriendly: true, thyroidNote: 'Omega-3 + Yodo + Selenio' },
              { id: 'i13', name: 'Espárragos trigueros verdes', amount: 120, unit: 'g', category: 'verduras', calories: 25, protein: 2.6, carbs: 3.8, fats: 0.2 },
              { id: 'i14', name: 'Boniato / Batata dulce asada', amount: 120, unit: 'g', category: 'legumbres_cereales', calories: 105, protein: 2.0, carbs: 24.0, fats: 0.1 },
              { id: 'i15', name: 'Aceite de oliva virgen extra', amount: 5, unit: 'ml', category: 'grasas_aceites', calories: 45, protein: 0, carbs: 0, fats: 5 }
            ],
            instructions: [
              'Precalentar el horno a 190°C.',
              'Colocar el lomo de salmón y los espárragos en una bandeja forrada con papel de hornear.',
              'Añadir un hilo de aceite, eneldo, sal y rodajas finas de limón.',
              'Hornear durante 15-18 minutos hasta que el salmón esté jugoso y los espárragos al dente.',
              'Servir junto al boniato asado tibio.'
            ]
          }
        }
      ]
    },

    // MARTES
    {
      dayOfWeek: 2,
      dayName: 'Martes',
      notes: 'Navegando hacia Alabasta. Enfoque en hierro hemo y digestión ligera.',
      meals: [
        {
          id: 'tue-m1',
          type: 'breakfast',
          title: 'Desayuno de Nami: Gachas de Avena Integral con Manzana y Canela',
          timeSlot: '08:30',
          completed: false,
          recipe: {
            id: 'rec-05',
            name: 'Porridge de Avena con Manzana y Nueces de Brasil',
            prepTimeMinutes: 5,
            cookTimeMinutes: 5,
            batchCookable: true,
            batchCookingTip: 'Prepara "Overnight Oats" la noche anterior en tarros individuales.',
            chefQuote: 'La avena calma los nervios antes de la tormenta de Grand Line.',
            ingredients: [
              { id: 'i16', name: 'Copos de avena suave 100% integral', amount: 50, unit: 'g', category: 'legumbres_cereales', calories: 185, protein: 6.5, carbs: 32.0, fats: 3.5 },
              { id: 'i17', name: 'Bebida de almendras sin azúcar (o leche)', amount: 200, unit: 'ml', category: 'lacteos_huevos', calories: 35, protein: 1.0, carbs: 1.5, fats: 2.5 },
              { id: 'i18', name: 'Manzana picada con piel', amount: 100, unit: 'g', category: 'frutas', calories: 52, protein: 0.3, carbs: 14.0, fats: 0.2 },
              { id: 'i19', name: 'Nueces de Brasil', amount: 2, unit: 'ud', category: 'frutas', calories: 65, protein: 1.4, carbs: 1.2, fats: 6.5, thyroidFriendly: true, thyroidNote: 'Selenio diario' }
            ],
            instructions: [
              'Cocer la avena con la bebida vegetal a fuego lento durante 4 minutos removiendo.',
              'Añadir canela en polvo al gusto.',
              'Servir en un bol con los dados de manzana fresca y las 2 nueces picadas.'
            ]
          }
        },
        {
          id: 'tue-m2',
          type: 'lunch',
          title: 'Banquete de Zoro: Ternera Magra Salteada con Calabacín, Zanahoria y Quinoa',
          timeSlot: '14:00',
          completed: false,
          recipe: {
            id: 'rec-06',
            name: 'Wok de Ternera Gallega, Calabacín, Zanahoria y Quinoa Real',
            prepTimeMinutes: 10,
            cookTimeMinutes: 12,
            batchCookable: true,
            batchCookingTip: 'Quinoa cocida por adelantado (aguanta 5 días en nevera perfectamente).',
            thyroidSafeCookingTip: 'La ternera aporta Hierro Hemo, cofactor de la enzima peroxidasa tiroidea.',
            chefQuote: 'Tres espadas requieren músculos de acero alimentados con proteína magra.',
            ingredients: [
              { id: 'i20', name: 'Ternera magra en tiras', amount: 160, unit: 'g', category: 'carnes_pescados', calories: 230, protein: 36, carbs: 0, fats: 8.5, thyroidFriendly: true, thyroidNote: 'Hierro Hemo y Zinc' },
              { id: 'i21', name: 'Quinoa real cocida', amount: 140, unit: 'g', category: 'legumbres_cereales', calories: 170, protein: 6.0, carbs: 30.0, fats: 2.5 },
              { id: 'i22', name: 'Calabacín en rodajas', amount: 100, unit: 'g', category: 'verduras', calories: 17, protein: 1.2, carbs: 3.1, fats: 0.3 },
              { id: 'i23', name: 'Zanahoria en juliana', amount: 70, unit: 'g', category: 'verduras', calories: 28, protein: 0.6, carbs: 6.5, fats: 0.1 },
              { id: 'i24', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'En un wok o sartén bien caliente con aceite de oliva, saltear las tiras de ternera 3 minutos y reservar.',
              'Saltear el calabacín y la zanahoria con ajo picado durante 5-6 minutos.',
              'Reincorporar la carne y la quinoa cocida, salpimentar y mezclar a fuego vivo 2 minutos.'
            ]
          }
        },
        {
          id: 'tue-m3',
          type: 'snack',
          title: 'Snack de Robin: Requesón Suave con Fresas y Almendras',
          timeSlot: '18:00',
          completed: false,
          recipe: {
            id: 'rec-07',
            name: 'Requesón 0% o Ricotta con Fresas de Temporada',
            prepTimeMinutes: 2,
            cookTimeMinutes: 0,
            batchCookable: false,
            chefQuote: 'Una merienda digna de una arqueóloga elegante.',
            ingredients: [
              { id: 'i25', name: 'Requesón magro o queso fresco batido', amount: 140, unit: 'g', category: 'lacteos_huevos', calories: 130, protein: 16, carbs: 4.5, fats: 5.0 },
              { id: 'i26', name: 'Fresas frescas lavadas y troceadas', amount: 100, unit: 'g', category: 'frutas', calories: 33, protein: 0.7, carbs: 7.7, fats: 0.3 },
              { id: 'i27', name: 'Almendras naturales crudas', amount: 15, unit: 'g', category: 'frutas', calories: 88, protein: 3.2, carbs: 3.0, fats: 7.5 }
            ],
            instructions: [
              'Colocar el requesón en una copa o cuenco.',
              'Añadir las fresas cortadas en cuartos y las almendras enteras o picadas.'
            ]
          }
        },
        {
          id: 'tue-m4',
          type: 'dinner',
          title: 'Cena de la Marina: Merluza al Vapor con Patata Cocida y Judías Verdes',
          timeSlot: '21:30',
          completed: false,
          recipe: {
            id: 'rec-08',
            name: 'Lomos de Merluza de Pincho con Judías Verdes y Patata al Vapor',
            prepTimeMinutes: 8,
            cookTimeMinutes: 15,
            batchCookable: true,
            batchCookingTip: 'Las judías verdes y patatas cocidas se conservan estupendamente 4 días.',
            thyroidSafeCookingTip: 'Pescado blanco magro rico en Yodo sin recargar calorías grasas antes de dormir.',
            chefQuote: 'Cena ligera y pura para un descanso reparador en cubierta.',
            ingredients: [
              { id: 'i28', name: 'Lomo de merluza fresca o congelada', amount: 180, unit: 'g', category: 'carnes_pescados', calories: 150, protein: 31, carbs: 0, fats: 2.2, thyroidFriendly: true, thyroidNote: 'Yodo natural de fácil digestión' },
              { id: 'i29', name: 'Patata nueva cocida', amount: 120, unit: 'g', category: 'legumbres_cereales', calories: 95, protein: 2.4, carbs: 21.0, fats: 0.1 },
              { id: 'i30', name: 'Judías verdes planas', amount: 140, unit: 'g', category: 'verduras', calories: 43, protein: 2.6, carbs: 9.8, fats: 0.3 },
              { id: 'i31', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'Cocer la patata pelada en dados y las judías verdes limpias en agua con sal durante 12-14 minutos.',
              'Cocinar los lomos de merluza al vapor o a la plancha 3 minutos por lado con un toque de ajo y perejil.',
              'Emplatar y aderezar las verduras y el pescado con el aceite de oliva virgen extra.'
            ]
          }
        }
      ]
    },

    // MIERCOLES
    {
      dayOfWeek: 3,
      dayName: 'Miércoles',
      notes: 'Llegada a Water 7. Receta potente de Batch Cooking para mitad de semana.',
      meals: [
        {
          id: 'wed-m1',
          type: 'breakfast',
          title: 'Desayuno de Franky (SUPER!): Tostadas con Aguacate, Huevo Escalfado y Nueces de Brasil',
          timeSlot: '08:30',
          completed: false,
          recipe: {
            id: 'rec-09',
            name: 'Tostada de Pan Centeno con Huevo Escalfado y Aguacate',
            prepTimeMinutes: 5,
            cookTimeMinutes: 5,
            batchCookable: false,
            chefQuote: '¡SUPER energía para construir el Thousand Sunny!',
            ingredients: [
              { id: 'i32', name: 'Huevo campero escalfado', amount: 2, unit: 'ud', category: 'lacteos_huevos', calories: 140, protein: 12.6, carbs: 0.8, fats: 9.8, thyroidFriendly: true },
              { id: 'i33', name: 'Pan de centeno 100%', amount: 60, unit: 'g', category: 'legumbres_cereales', calories: 145, protein: 4.8, carbs: 27.0, fats: 1.0 },
              { id: 'i34', name: 'Aguacate maduro laminado', amount: 40, unit: 'g', category: 'grasas_aceites', calories: 65, protein: 0.8, carbs: 3.4, fats: 6.0 },
              { id: 'i35', name: 'Nueces de Brasil', amount: 2, unit: 'ud', category: 'frutas', calories: 65, protein: 1.4, carbs: 1.2, fats: 6.5, thyroidFriendly: true }
            ],
            instructions: [
              'Tostar el pan de centeno.',
              'Untar el aguacate triturado con sal marina y unas gotas de limón.',
              'Colocar los huevos escalfados encima.',
              'Acompañar con las 2 nueces de Brasil.'
            ]
          }
        },
        {
          id: 'wed-m2',
          type: 'lunch',
          title: 'Plato Fuerte de Sanji: Guiso Marinero de Garbanzos con Langostinos y Espinacas',
          timeSlot: '14:00',
          completed: false,
          recipe: {
            id: 'rec-10',
            name: 'Cazuela Marinera de Garbanzos Pedrosillanos con Langostinos y Espinacas Cocidas',
            prepTimeMinutes: 10,
            cookTimeMinutes: 15,
            batchCookable: true,
            batchCookingTip: 'Prepara una olla grande de este guiso. Aguanta 4 días en nevera y mejora de sabor al día siguiente.',
            thyroidSafeCookingTip: 'Las espinacas se hierven en el caldo para desactivar oxalatos y facilitar digestión tiroidea.',
            chefQuote: 'Los mariscos frescos son el tesoro más codiciado de los mares.',
            ingredients: [
              { id: 'i36', name: 'Garbanzos cocidos en conserva o caseros', amount: 180, unit: 'g', category: 'legumbres_cereales', calories: 230, protein: 12.5, carbs: 36.0, fats: 3.8 },
              { id: 'i37', name: 'Langostinos o gambones pelados', amount: 130, unit: 'g', category: 'carnes_pescados', calories: 120, protein: 26.0, carbs: 0.5, fats: 1.4, thyroidFriendly: true, thyroidNote: 'Yodo y Selenio marino' },
              { id: 'i38', name: 'Espinacas frescas (cocinadas en el guiso)', amount: 100, unit: 'g', category: 'verduras', calories: 23, protein: 2.8, carbs: 3.6, fats: 0.4 },
              { id: 'i39', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'En una cazuela con aceite de oliva sofríe ajo, cebolla y pimentón dulce.',
              'Añadir los langostinos y saltear 2 minutos.',
              'Agregar los garbanzos escurridos, las espinacas y un vaso de caldo de pescado casero o agua.',
              'Cocinar a fuego medio 10 minutos y rectificar de sal marina.'
            ]
          }
        },
        {
          id: 'wed-m3',
          type: 'snack',
          title: 'Snack de Jinbe: Kéfir Natural con Semillas de Chía y Plátano',
          timeSlot: '18:00',
          completed: false,
          recipe: {
            id: 'rec-11',
            name: 'Kéfir Probiótico con Semillas de Chía y Medio Plátano',
            prepTimeMinutes: 2,
            cookTimeMinutes: 0,
            batchCookable: false,
            chefQuote: 'Paciencia y equilibrio para la microbiota del guerrero.',
            ingredients: [
              { id: 'i40', name: 'Kéfir de leche entero natural', amount: 180, unit: 'ml', category: 'lacteos_huevos', calories: 115, protein: 6.5, carbs: 8.0, fats: 6.0 },
              { id: 'i41', name: 'Semillas de chía', amount: 10, unit: 'g', category: 'frutas', calories: 48, protein: 1.7, carbs: 4.2, fats: 3.1 },
              { id: 'i42', name: 'Plátano maduro en rodajas', amount: 70, unit: 'g', category: 'frutas', calories: 62, protein: 0.8, carbs: 16.0, fats: 0.2 }
            ],
            instructions: [
              'Mezclar las semillas de chía en el kéfir y dejar reposar 5 minutos.',
              'Coronar con las rodajas de plátano.'
            ]
          }
        },
        {
          id: 'wed-m4',
          type: 'dinner',
          title: 'Cena de Brook (Yo-Ho-Ho): Revuelto de Pavo Magro con Champiñones y Ensalada',
          timeSlot: '21:30',
          completed: false,
          recipe: {
            id: 'rec-12',
            name: 'Salteado de Solomillo de Pavo con Champiñones Portobello al Ajillo',
            prepTimeMinutes: 8,
            cookTimeMinutes: 10,
            batchCookable: true,
            chefQuote: '¡Aunque no tenga estómago, este aroma me alegra el alma! ¡Yo-ho-ho-ho!',
            ingredients: [
              { id: 'i43', name: 'Solomillo de pavo troceado', amount: 170, unit: 'g', category: 'carnes_pescados', calories: 185, protein: 38, carbs: 0, fats: 3.5, thyroidFriendly: true, thyroidNote: 'Tirosina y Zinc' },
              { id: 'i44', name: 'Champiñones laminados', amount: 150, unit: 'g', category: 'verduras', calories: 33, protein: 4.5, carbs: 4.8, fats: 0.5 },
              { id: 'i45', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 },
              { id: 'i46', name: 'Pan integral tostado', amount: 30, unit: 'g', category: 'legumbres_cereales', calories: 75, protein: 2.8, carbs: 14.0, fats: 0.6 }
            ],
            instructions: [
              'Dorar láminas de ajo en sartén con aceite de oliva.',
              'Añadir los champiñones y saltear a fuego fuerte 5 minutos.',
              'Incorporar el pavo troceado, sal y perejil fresco picado.',
              'Cocinar 4 minutos hasta que el pavo esté dorado y jugoso. Acompañar de la tosta integral.'
            ]
          }
        }
      ]
    },

    // JUEVES
    {
      dayOfWeek: 4,
      dayName: 'Jueves',
      notes: 'Rumbo al Archipiélago Sabaody. Dieta rica en ácidos grasos esenciales y minerales marinos.',
      meals: [
        {
          id: 'thu-m1',
          type: 'breakfast',
          title: 'Desayuno de Chopper: Tortilla de 2 Huevos con Tomate Rallado y Nueces de Brasil',
          timeSlot: '08:30',
          completed: false,
          recipe: {
            id: 'rec-13',
            name: 'Tortilla Francesa con Tomate Natural Rallado en Pan Integral',
            prepTimeMinutes: 5,
            cookTimeMinutes: 6,
            batchCookable: false,
            chefQuote: '¡Un doctor sabe que la medicina empieza en el plato!',
            ingredients: [
              { id: 'i47', name: 'Huevos enteros de gallina', amount: 2, unit: 'ud', category: 'lacteos_huevos', calories: 140, protein: 12.6, carbs: 0.8, fats: 9.8, thyroidFriendly: true },
              { id: 'i48', name: 'Tomate maduro rallado', amount: 70, unit: 'g', category: 'verduras', calories: 13, protein: 0.6, carbs: 2.7, fats: 0.1 },
              { id: 'i49', name: 'Pan 100% integral', amount: 50, unit: 'g', category: 'legumbres_cereales', calories: 125, protein: 4.5, carbs: 23.5, fats: 1.0 },
              { id: 'i50', name: 'Nueces de Brasil', amount: 2, unit: 'ud', category: 'frutas', calories: 65, protein: 1.4, carbs: 1.2, fats: 6.5, thyroidFriendly: true }
            ],
            instructions: [
              'Tostar el pan y untar con el tomate rallado fresco y una pizca de sal.',
              'Hacer la tortilla francesa en sartén antiadherente.',
              'Servir la tortilla sobre el pan y tomar las 2 nueces.'
            ]
          }
        },
        {
          id: 'thu-m2',
          type: 'lunch',
          title: 'Banquete de Sanji: Atún Fresco a la Plancha con Patata Asada y Calabacín',
          timeSlot: '14:00',
          completed: false,
          recipe: {
            id: 'rec-14',
            name: 'Medallón de Atún Rojo/Claro a la Plancha con Calabacín Salteado',
            prepTimeMinutes: 8,
            cookTimeMinutes: 10,
            batchCookable: true,
            batchCookingTip: 'Patatas asadas en lote; el atún se hace en 2 minutos justo antes de comer.',
            thyroidSafeCookingTip: 'El atún concentra Selenio, Yodo y proteína de altísimo valor biológico.',
            chefQuote: 'El pescado nunca debe sobrecocerse; debe conservar su corazón jugoso.',
            ingredients: [
              { id: 'i51', name: 'Medallón o lomo de atún', amount: 160, unit: 'g', category: 'carnes_pescados', calories: 210, protein: 38, carbs: 0, fats: 6.0, thyroidFriendly: true, thyroidNote: 'Selenio y Yodo' },
              { id: 'i52', name: 'Patata cocida o asada', amount: 130, unit: 'g', category: 'legumbres_cereales', calories: 102, protein: 2.6, carbs: 22.8, fats: 0.1 },
              { id: 'i53', name: 'Calabacín a la plancha', amount: 140, unit: 'g', category: 'verduras', calories: 24, protein: 1.7, carbs: 4.3, fats: 0.4 },
              { id: 'i54', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'Marcar el atún en plancha muy caliente con unas gotas de aceite 1.5 min por lado.',
              'Saltear el calabacín con sal y orégano.',
              'Servir con la patata asada y regar con el resto de aceite de oliva virgen extra.'
            ]
          }
        },
        {
          id: 'thu-m3',
          type: 'snack',
          title: 'Snack de Usopp: Yogur Natural con Nueces y Canela de Ceilán',
          timeSlot: '18:00',
          completed: false,
          recipe: {
            id: 'rec-15',
            name: 'Yogur de Oveja o Vaca Natural con Nueces Tradicionales',
            prepTimeMinutes: 2,
            cookTimeMinutes: 0,
            batchCookable: false,
            chefQuote: 'Sencillo y nutritivo para recargar el pulso de francotirador.',
            ingredients: [
              { id: 'i55', name: 'Yogur natural entero', amount: 140, unit: 'g', category: 'lacteos_huevos', calories: 95, protein: 4.8, carbs: 6.5, fats: 5.5 },
              { id: 'i56', name: 'Nueces peladas normales', amount: 15, unit: 'g', category: 'frutas', calories: 98, protein: 2.3, carbs: 2.1, fats: 9.8 }
            ],
            instructions: [
              'Mezclar el yogur en un vaso, añadir las nueces partidas y espolvorear canela.'
            ]
          }
        },
        {
          id: 'thu-m4',
          type: 'dinner',
          title: 'Cena de Luffy: Hamburguesa Casera de Ternera Magra con Ensalada y Zanahoria Vapor',
          timeSlot: '21:30',
          completed: false,
          recipe: {
            id: 'rec-16',
            name: 'Hamburguesa 100% Ternera Magra al Plato con Zanahorias al Vapor',
            prepTimeMinutes: 5,
            cookTimeMinutes: 8,
            batchCookable: true,
            chefQuote: '¡¡¡CARNEEEEEEEE!!! - gritó el Capitán mientras devoraba.',
            ingredients: [
              { id: 'i57', name: 'Carne picada de ternera magra 100%', amount: 170, unit: 'g', category: 'carnes_pescados', calories: 240, protein: 35, carbs: 0, fats: 11, thyroidFriendly: true },
              { id: 'i58', name: 'Zanahoria baby cocida al vapor', amount: 150, unit: 'g', category: 'verduras', calories: 60, protein: 1.3, carbs: 14.0, fats: 0.3 },
              { id: 'i59', name: 'Canónigos y rúcula fresca', amount: 50, unit: 'g', category: 'verduras', calories: 12, protein: 1.2, carbs: 1.5, fats: 0.2 },
              { id: 'i60', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'Formar la hamburguesa solo con sal marina y pimienta.',
              'Cocinar en sartén o parrilla caliente 3 minutos por lado.',
              'Servir sobre una base de canónigos y las zanahorias al vapor aderezadas con aceite.'
            ]
          }
        }
      ]
    },

    // VIERNES
    {
      dayOfWeek: 5,
      dayName: 'Viernes',
      notes: 'Llegada al Nuevo Mundo. Preparación del Batch Cooking del fin de semana.',
      meals: [
        {
          id: 'fri-m1',
          type: 'breakfast',
          title: 'Desayuno Pirata: Huevos Revueltos con Pan de Centeno y Nueces de Brasil',
          timeSlot: '08:30',
          completed: false,
          recipe: {
            id: 'rec-17',
            name: 'Revuelto Cremoso de Huevos Camperos en Tosta de Centeno',
            prepTimeMinutes: 5,
            cookTimeMinutes: 5,
            batchCookable: false,
            chefQuote: 'El secreto del revuelto es fuego bajo y cariño.',
            ingredients: [
              { id: 'i61', name: 'Huevos camperos', amount: 2, unit: 'ud', category: 'lacteos_huevos', calories: 140, protein: 12.6, carbs: 0.8, fats: 9.8, thyroidFriendly: true },
              { id: 'i62', name: 'Pan de centeno', amount: 60, unit: 'g', category: 'legumbres_cereales', calories: 145, protein: 4.8, carbs: 27.0, fats: 1.0 },
              { id: 'i63', name: 'Nueces de Brasil', amount: 2, unit: 'ud', category: 'frutas', calories: 65, protein: 1.4, carbs: 1.2, fats: 6.5, thyroidFriendly: true }
            ],
            instructions: [
              'Batir ligeramente los huevos.',
              'Cocinar a fuego muy lento en sartén antiadherente hasta textura cremosa.',
              'Servir sobre el pan tostado con las 2 nueces.'
            ]
          }
        },
        {
          id: 'fri-m2',
          type: 'lunch',
          title: 'Banquete de Sanji: Dorada al Horno con Pimientos Asados y Arroz Integral',
          timeSlot: '14:00',
          completed: false,
          recipe: {
            id: 'rec-18',
            name: 'Filete de Dorada Salvaje con Tiras de Pimiento Rojo Asado y Arroz',
            prepTimeMinutes: 10,
            cookTimeMinutes: 18,
            batchCookable: true,
            batchCookingTip: 'Pimientos asados y arroz cocidos en lote el domingo.',
            thyroidSafeCookingTip: 'La dorada aporta proteína limpia y minerales yodados del mar.',
            chefQuote: 'La piel crujiente y la carne tierna como el viento en las velas.',
            ingredients: [
              { id: 'i64', name: 'Filetes de dorada limpia', amount: 180, unit: 'g', category: 'carnes_pescados', calories: 200, protein: 35, carbs: 0, fats: 6.5, thyroidFriendly: true },
              { id: 'i65', name: 'Pimiento rojo asado en tiras', amount: 120, unit: 'g', category: 'verduras', calories: 38, protein: 1.2, carbs: 8.0, fats: 0.4 },
              { id: 'i66', name: 'Arroz integral cocido', amount: 130, unit: 'g', category: 'legumbres_cereales', calories: 155, protein: 3.5, carbs: 32.0, fats: 1.2 },
              { id: 'i67', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'Hornear la dorada con sal marina y ajo a 190°C durante 14 minutos.',
              'Acompañar con el arroz integral tibio y las tiras de pimiento rojo asado.'
            ]
          }
        },
        {
          id: 'fri-m3',
          type: 'snack',
          title: 'Snack de Nami: Requesón con Frutos Rojos y Semillas de Calabaza',
          timeSlot: '18:00',
          completed: false,
          recipe: {
            id: 'rec-19',
            name: 'Requesón Fresco con Frambuesas y Semillas de Calabaza',
            prepTimeMinutes: 2,
            cookTimeMinutes: 0,
            batchCookable: false,
            chefQuote: '¡Un aperitivo que vale 100 millones de Berries!',
            ingredients: [
              { id: 'i68', name: 'Requesón magro', amount: 130, unit: 'g', category: 'lacteos_huevos', calories: 120, protein: 15, carbs: 4.0, fats: 4.8 },
              { id: 'i69', name: 'Frambuesas o moras frescas', amount: 80, unit: 'g', category: 'frutas', calories: 42, protein: 1.0, carbs: 9.5, fats: 0.5 },
              { id: 'i70', name: 'Semillas de calabaza', amount: 15, unit: 'g', category: 'frutas', calories: 85, protein: 4.5, carbs: 2.0, fats: 7.0, thyroidFriendly: true }
            ],
            instructions: [
              'Servir el requesón en un tazón con las frambuesas y las semillas de calabaza.'
            ]
          }
        },
        {
          id: 'fri-m4',
          type: 'dinner',
          title: 'Cena de Sanji: Pechuga de Pavo a las Finas Hierbas con Crema de Calabaza',
          timeSlot: '21:30',
          completed: false,
          recipe: {
            id: 'rec-20',
            name: 'Solomillo de Pavo Plancha con Puré Suave de Calabaza y Puerro',
            prepTimeMinutes: 10,
            cookTimeMinutes: 15,
            batchCookable: true,
            batchCookingTip: 'Prepara 1 litro de crema de calabaza para tener cenas listas al instante.',
            chefQuote: 'Cena reconfortante para calentar el espíritu antes del fin de semana.',
            ingredients: [
              { id: 'i71', name: 'Pechuga o solomillo de pavo', amount: 170, unit: 'g', category: 'carnes_pescados', calories: 185, protein: 38, carbs: 0, fats: 3.5, thyroidFriendly: true },
              { id: 'i72', name: 'Calabaza cocida triturada con puerro', amount: 200, unit: 'g', category: 'verduras', calories: 65, protein: 2.0, carbs: 14.5, fats: 0.5 },
              { id: 'i73', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'Hacer el pavo a la plancha con romero, tomillo y sal.',
              'Calentar el puré suave de calabaza y servir como cama para el pavo.'
            ]
          }
        }
      ]
    },

    // SABADO
    {
      dayOfWeek: 6,
      dayName: 'Sábado',
      notes: 'Día de fiesta en el barco y entrenamiento de combate.',
      meals: [
        {
          id: 'sat-m1',
          type: 'breakfast',
          title: 'Desayuno de la Reina Pirata: Tortitas Proteicas de Avena y Huevo con Fruta',
          timeSlot: '09:00',
          completed: false,
          recipe: {
            id: 'rec-21',
            name: 'Pancakes Esponjosos de Avena y Claras con Arándanos y Nueces de Brasil',
            prepTimeMinutes: 5,
            cookTimeMinutes: 6,
            batchCookable: false,
            chefQuote: '¡Tortitas doradas hechas con devoción culinaria!',
            ingredients: [
              { id: 'i74', name: 'Huevos enteros', amount: 1, unit: 'ud', category: 'lacteos_huevos', calories: 70, protein: 6.3, carbs: 0.4, fats: 4.9, thyroidFriendly: true },
              { id: 'i75', name: 'Claras de huevo', amount: 2, unit: 'ud', category: 'lacteos_huevos', calories: 34, protein: 7.2, carbs: 0.4, fats: 0.1 },
              { id: 'i76', name: 'Harina de avena integral', amount: 45, unit: 'g', category: 'legumbres_cereales', calories: 165, protein: 5.8, carbs: 29.0, fats: 3.1 },
              { id: 'i77', name: 'Arándanos frescos', amount: 60, unit: 'g', category: 'frutas', calories: 34, protein: 0.4, carbs: 8.0, fats: 0.2 },
              { id: 'i78', name: 'Nueces de Brasil', amount: 2, unit: 'ud', category: 'frutas', calories: 65, protein: 1.4, carbs: 1.2, fats: 6.5, thyroidFriendly: true }
            ],
            instructions: [
              'Triturar el huevo, las claras y la avena con una pizca de canela.',
              'Verter en sartén caliente antiadherente formando 3 tortitas.',
              'Dar la vuelta a los 2 minutos.',
              'Servir con los arándanos y las nueces de Brasil.'
            ]
          }
        },
        {
          id: 'sat-m2',
          type: 'lunch',
          title: 'Gran Banquete Pirata: Paella Marinera de Calamares y Langostinos con Arroz Bomba',
          timeSlot: '14:30',
          completed: false,
          recipe: {
            id: 'rec-22',
            name: 'Arroz Marinero con Calamar, Langostinos y Sofrito de Tomate y Pimiento',
            prepTimeMinutes: 15,
            cookTimeMinutes: 20,
            batchCookable: true,
            batchCookingTip: 'Excelente para compartir y congelar porciones individuales.',
            thyroidSafeCookingTip: 'Calamares y mariscos ofrecen una bomba natural de Zinc, Cobre y Yodo.',
            chefQuote: '¡Un banquete en cubierta para celebrar nuestra alianza pirata!',
            ingredients: [
              { id: 'i79', name: 'Calamar o sepia limpia troceada', amount: 140, unit: 'g', category: 'carnes_pescados', calories: 125, protein: 24, carbs: 1.5, fats: 2.0, thyroidFriendly: true },
              { id: 'i80', name: 'Langostinos frescos', amount: 100, unit: 'g', category: 'carnes_pescados', calories: 95, protein: 20, carbs: 0.4, fats: 1.0, thyroidFriendly: true },
              { id: 'i81', name: 'Arroz bomba o grano medio', amount: 70, unit: 'g', category: 'legumbres_cereales', calories: 245, protein: 5.2, carbs: 55.0, fats: 0.6 },
              { id: 'i82', name: 'Pimiento verde y tomate natural', amount: 100, unit: 'g', category: 'verduras', calories: 25, protein: 1.0, carbs: 5.0, fats: 0.2 },
              { id: 'i83', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'Hacer el sofrito con el aceite, ajo, pimiento y tomate.',
              'Dorar el calamar troceado y los langostinos.',
              'Añadir el arroz, sofreír 1 minuto, y verter el caldo de pescado caliente.',
              'Cocer 16 minutos y dejar reposar 5 minutos tapado.'
            ]
          }
        },
        {
          id: 'sat-m3',
          type: 'snack',
          title: 'Snack de Chopper: Manzana Asada con Canela y Nueces',
          timeSlot: '18:00',
          completed: false,
          recipe: {
            id: 'rec-23',
            name: 'Manzana Asada al Horno con Canela y Nueces',
            prepTimeMinutes: 3,
            cookTimeMinutes: 15,
            batchCookable: true,
            chefQuote: 'Dulzor natural reconfortante y fibra soluble prebiótica.',
            ingredients: [
              { id: 'i84', name: 'Manzana reineta o golden', amount: 150, unit: 'g', category: 'frutas', calories: 78, protein: 0.4, carbs: 21.0, fats: 0.3 },
              { id: 'i85', name: 'Nueces partidas', amount: 15, unit: 'g', category: 'frutas', calories: 98, protein: 2.3, carbs: 2.1, fats: 9.8 }
            ],
            instructions: [
              'Descorazonar la manzana y espolvorear canela dentro.',
              'Cocinar al microondas 4 min o al horno 15 min.',
              'Añadir las nueces antes de degustar tibia.'
            ]
          }
        },
        {
          id: 'sat-m4',
          type: 'dinner',
          title: 'Cena Ligera de Sanji: Lubina a la Espalda con Ensalada Templada de Judías',
          timeSlot: '21:30',
          completed: false,
          recipe: {
            id: 'rec-24',
            name: 'Lubina Abierta a la Espalda con Ajo Dorado y Judías Verdes',
            prepTimeMinutes: 8,
            cookTimeMinutes: 12,
            batchCookable: false,
            chefQuote: 'Elegancia y sencillez en cada lomo de pescado blanco.',
            ingredients: [
              { id: 'i86', name: 'Lubina abierta en mariposa', amount: 180, unit: 'g', category: 'carnes_pescados', calories: 175, protein: 33, carbs: 0, fats: 4.8, thyroidFriendly: true },
              { id: 'i87', name: 'Judías verdes cocidas', amount: 140, unit: 'g', category: 'verduras', calories: 43, protein: 2.6, carbs: 9.8, fats: 0.3 },
              { id: 'i88', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'Cocinar la lubina en plancha por el lado de la piel 4 min y dar vuelta 2 min.',
              'Dorar unos ajos laminados en el aceite y verter por encima.',
              'Servir junto a las judías verdes al vapor.'
            ]
          }
        }
      ]
    },

    // DOMINGO
    {
      dayOfWeek: 7,
      dayName: 'Domingo',
      notes: 'Día de Batch Cooking de Sanji: Planificación y preparación de tuppers para la quincena.',
      meals: [
        {
          id: 'sun-m1',
          type: 'breakfast',
          title: 'Desayuno Pirata: Huevos Pasados por Agua, Pan Integral y Nueces de Brasil',
          timeSlot: '09:00',
          completed: false,
          recipe: {
            id: 'rec-25',
            name: 'Huevos de Granja a la Copa con Bastones de Pan Integral',
            prepTimeMinutes: 2,
            cookTimeMinutes: 5,
            batchCookable: false,
            chefQuote: 'Desayuno clásico de marinero para iniciar la sesión de cocina.',
            ingredients: [
              { id: 'i89', name: 'Huevos de gallina campera', amount: 2, unit: 'ud', category: 'lacteos_huevos', calories: 140, protein: 12.6, carbs: 0.8, fats: 9.8, thyroidFriendly: true },
              { id: 'i90', name: 'Pan integral tostado', amount: 50, unit: 'g', category: 'legumbres_cereales', calories: 125, protein: 4.5, carbs: 23.5, fats: 1.0 },
              { id: 'i91', name: 'Nueces de Brasil', amount: 2, unit: 'ud', category: 'frutas', calories: 65, protein: 1.4, carbs: 1.2, fats: 6.5, thyroidFriendly: true }
            ],
            instructions: [
              'Hervir agua y sumergir los 2 huevos durante exactamente 5 minutos.',
              'Cortar el pan integral en bastones para mojar en la yema líquida.',
              'Tomar con las 2 nueces de Brasil.'
            ]
          }
        },
        {
          id: 'sun-m2',
          type: 'lunch',
          title: 'Banquete de Sanji: Pollo Asado al Romero con Patatas Panadera y Zanahorias',
          timeSlot: '14:00',
          completed: false,
          recipe: {
            id: 'rec-26',
            name: 'Muslos de Pollo Asados al Horno con Romero, Patata y Zanahoria',
            prepTimeMinutes: 10,
            cookTimeMinutes: 40,
            batchCookable: true,
            batchCookingTip: 'Aprovecha el horno caliente para asar verduras y boniatos de la semana.',
            thyroidSafeCookingTip: 'Cocción lenta al horno que potencia el sabor y conserva minerales.',
            chefQuote: '¡El aroma del asado une a toda la tripulación alrededor de la mesa!',
            ingredients: [
              { id: 'i92', name: 'Muslo/contramuslo de pollo sin piel', amount: 200, unit: 'g', category: 'carnes_pescados', calories: 260, protein: 40, carbs: 0, fats: 10.5, thyroidFriendly: true },
              { id: 'i93', name: 'Patatas panadera', amount: 140, unit: 'g', category: 'legumbres_cereales', calories: 110, protein: 2.8, carbs: 24.5, fats: 0.1 },
              { id: 'i94', name: 'Zanahoria en rodajas gruesas', amount: 100, unit: 'g', category: 'verduras', calories: 40, protein: 0.9, carbs: 9.3, fats: 0.2 },
              { id: 'i95', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 }
            ],
            instructions: [
              'En bandeja de horno disponer las patatas y zanahorias en rodajas con el aceite y romero.',
              'Colocar los muslos de pollo salpimentados encima.',
              'Hornear a 200°C durante 40-45 minutos hasta que la carne esté bien dorada y tierna.'
            ]
          }
        },
        {
          id: 'sun-m3',
          type: 'snack',
          title: 'Snack de Robin: Yogur Griego con Semillas de Calabaza y Arándanos',
          timeSlot: '18:00',
          completed: false,
          recipe: {
            id: 'rec-27',
            name: 'Yogur Griego Rico en Proteína con Semillas de Calabaza',
            prepTimeMinutes: 2,
            cookTimeMinutes: 0,
            batchCookable: false,
            chefQuote: 'Silencio, un buen libro y un snack nutritivo.',
            ingredients: [
              { id: 'i96', name: 'Yogur griego natural', amount: 140, unit: 'g', category: 'lacteos_huevos', calories: 135, protein: 13, carbs: 5.0, fats: 7.0 },
              { id: 'i97', name: 'Semillas de calabaza', amount: 15, unit: 'g', category: 'frutas', calories: 85, protein: 4.5, carbs: 2.0, fats: 7.0, thyroidFriendly: true },
              { id: 'i98', name: 'Arándanos', amount: 60, unit: 'g', category: 'frutas', calories: 34, protein: 0.4, carbs: 8.0, fats: 0.2 }
            ],
            instructions: [
              'Combinar el yogur griego con arándanos y semillas de calabaza.'
            ]
          }
        },
        {
          id: 'sun-m4',
          type: 'dinner',
          title: 'Cena de Sanji (Batch Prep): Crema de Calabacín con Huevo Escalfado y Semillas',
          timeSlot: '21:30',
          completed: false,
          recipe: {
            id: 'rec-28',
            name: 'Velouté Suave de Calabacín y Puerro con Huevo Escalfado',
            prepTimeMinutes: 8,
            cookTimeMinutes: 12,
            batchCookable: true,
            batchCookingTip: 'Guarda en 3 frascos herméticos en la nevera para toda la quincena.',
            chefQuote: 'Cena ligera y depurativa para finalizar el ciclo semanal en perfecta armonía.',
            ingredients: [
              { id: 'i99', name: 'Calabacín cocido triturado con puerro', amount: 250, unit: 'g', category: 'verduras', calories: 45, protein: 3.0, carbs: 8.0, fats: 0.5 },
              { id: 'i100', name: 'Huevo de gallina escalfado', amount: 1, unit: 'ud', category: 'lacteos_huevos', calories: 70, protein: 6.3, carbs: 0.4, fats: 4.9, thyroidFriendly: true },
              { id: 'i101', name: 'Aceite de oliva virgen extra', amount: 10, unit: 'ml', category: 'grasas_aceites', calories: 90, protein: 0, carbs: 0, fats: 10 },
              { id: 'i102', name: 'Pan integral', amount: 30, unit: 'g', category: 'legumbres_cereales', calories: 75, protein: 2.8, carbs: 14.0, fats: 0.6 }
            ],
            instructions: [
              'Calentar el puré suave de calabacín en un cazo.',
              'Servir en un bol hondo con el huevo escalfado en el centro.',
              'Rociar con el aceite de oliva virgen extra crudo y acompañar con la rebanada tostada.'
            ]
          }
        }
      ]
    }
  ]
};
