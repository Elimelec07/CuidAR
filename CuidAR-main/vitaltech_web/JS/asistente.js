// ═══════════════════════════════════════════════════════════════════════
// ASISTENTE VIRTUAL LINDA - VitalTech
// Sistema de Chatbot de Salud Emocional y Bienestar
// Versión: 2.0 Advanced
// Fecha: 11 de octubre de 2025
// ═══════════════════════════════════════════════════════════════════════

/* 
 * ═══════════════════════════════════════════════════════════════════════
 * PROMPT BASE ESTRUCTURADO – Chatbot "Linda"
 * ═══════════════════════════════════════════════════════════════════════
 * 
 * ROL:
 * Soy Linda, una asistente virtual de salud emocional y bienestar de VitalTech.
 * Mi misión es escuchar con empatía, acompañar sin juzgar y orientar en temas
 * de salud mental, bienestar emocional y hábitos saludables.
 * Mi comunicación es humana, cálida, respetuosa y profesional.
 * 
 * 🎯 OBJETIVOS PRINCIPALES:
 * - Brindar orientación sobre manejo del estrés, ansiedad y emociones
 * - Promover hábitos saludables (alimentación, sueño, ejercicio, descanso)
 * - Fomentar el autocuidado y la autoestima
 * - Detectar cuándo recomendar ayuda profesional
 * - Escuchar y responder con empatía, sin dar diagnósticos clínicos
 * 
 * 💬 TONO Y ESTILO:
 * - Cálido, empático y motivador
 * - Lenguaje simple, sin tecnicismos clínicos
 * - Uso moderado de emojis amables (🌱💚😊✨)
 * - Refuerzo de que la persona no está sola
 * - Validación de emociones antes de aconsejar
 * 
 * 🚫 LÍMITES DEL CHATBOT:
 * - No realizo diagnósticos médicos o psicológicos
 * - No sustituyo la atención de un profesional de salud
 * - En caso de riesgo o emergencia, sugiero ayuda profesional inmediata
 * 
 * 🧩 ESTRUCTURA DE RESPUESTA:
 * 1. Validación emocional: "Puedo notar que estás pasando por un momento difícil"
 * 2. Empatía y acompañamiento: "Gracias por confiarme cómo te sientes"
 * 3. Orientación breve: "Podrías intentar una respiración consciente"
 * 4. Pregunta abierta: "¿Quieres que te comparta algunos ejercicios prácticos?"
 * 
 * ═══════════════════════════════════════════════════════════════════════
 */

document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const btnSend = document.getElementById('btnSend');
    const chatMessages = document.getElementById('chatMessages');
    const btnAttach = document.getElementById('btnAttach');
    
    // Limpiar historial de chat al cargar la página
    localStorage.removeItem('chatHistory');
    
    // Variables para contexto de conversación
    let contextoConversacion = {
        ultimoTema: null,
        mensajesUsuario: [],
        temasPrevios: [],
        nombreUsuario: localStorage.getItem('nombreUsuario') || null
    };

    // Base de conocimientos del asistente con enfoque empático
    const conocimientos = {
        diabetes: {
            keywords: ['diabetes', 'azúcar', 'glucosa', 'insulina', 'diabético', 'prediabetes', 'hemoglobina', 'a1c', 'glucemia', 'hiperglucemia', 'hipoglucemia'],
            respuestas: [
                'Entiendo tu preocupación por la diabetes. Te puedo compartir algunas recomendaciones que pueden ayudarte a mantener tu salud:',
                '',
                '💚 Alimentación balanceada: Incluye más frutas, verduras y granos enteros. Reduce los azúcares refinados y bebidas azucaradas.',
                '',
                '🏃 Mantente activo: 30 minutos de caminata diaria pueden hacer una gran diferencia.',
                '',
                '⚖️ Cuida tu peso: Mantener un peso saludable reduce significativamente el riesgo.',
                '',
                '📊 Chequeos regulares: Si tienes antecedentes familiares o factores de riesgo, consulta con un médico para evaluar tus niveles de glucosa.',
                '',
                '💧 Hidrátate bien: El agua ayuda a regular los niveles de azúcar.',
                '',
                '🥗 Carbohidratos inteligentes: Elige integrales sobre refinados (arroz integral vs. arroz blanco).',
                '',
                '¿Te gustaría que te orientara sobre algún aspecto específico o realizar nuestro test de evaluación de riesgo?'
            ],
            seguimiento: [
                '¿Tienes antecedentes familiares de diabetes?',
                '¿Has notado síntomas como sed excesiva, micción frecuente o cansancio?',
                '¿Te gustaría consejos sobre qué alimentos elegir?',
                '¿Ya te has hecho una prueba de glucosa recientemente?',
                '¿Sabes cuáles son tus niveles de glucosa actuales?'
            ]
        },
        hta: {
            keywords: ['presión', 'hipertensión', 'hta', 'arterial', 'tensión', 'presión alta', 'hipertenso'],
            respuestas: [
                'Cuidar tu presión arterial es muy importante. Aquí te dejo algunas recomendaciones que pueden ayudarte:',
                '',
                '🧂 Reduce la sal: Trata de consumir menos de 5 gramos al día. Cocina con especias naturales.',
                '',
                '🥗 Alimentación saludable: Más frutas, verduras, y alimentos bajos en grasa saturada.',
                '',
                '🚶 Ejercicio regular: La actividad física ayuda a mantener tu corazón fuerte.',
                '',
                '😌 Maneja el estrés: Técnicas de respiración y relajación pueden ayudar mucho.',
                '',
                '🩺 Control médico: Es importante que un profesional revise tu presión regularmente.',
                '',
                '¿Hay algo en particular que te preocupe sobre tu presión arterial?'
            ],
            seguimiento: [
                '¿Tienes acceso a un tensiómetro para medirte en casa?',
                '¿Has hablado con un médico sobre tu presión?',
                '¿Te gustaría saber más sobre el manejo del estrés?'
            ]
        },
        estres: {
            keywords: ['estrés', 'estresado', 'agobiado', 'presión', 'tensión mental', 'cansancio mental', 'agotado', 'abrumado'],
            respuestas: [
                'Entiendo que el estrés puede ser muy abrumador. No estás solo en esto. Aquí hay algunas técnicas que podrían ayudarte:',
                '',
                '🌬️ Respiración consciente: Dedica 5 minutos al día a respirar profundamente. Puede calmar tu mente de inmediato.',
                '',
                '🧘 Pausas activas: Levántate, estira tu cuerpo. A veces el movimiento ayuda a liberar tensión.',
                '',
                '😴 Cuida tu descanso: Dormir bien es fundamental. Intenta mantener un horario regular.',
                '',
                '💬 Habla de ello: Compartir lo que sientes con alguien de confianza puede aliviar mucho.',
                '',
                '🎯 Prioriza: No tienes que hacerlo todo a la vez. Está bien pedir ayuda.',
                '',
                '¿Quieres que conversemos más sobre lo que estás sintiendo?'
            ],
            seguimiento: [
                '¿Hace cuánto tiempo te sientes así?',
                '¿Hay algo en particular que esté causando este estrés?',
                '¿Has probado alguna técnica de relajación antes?',
                '¿Cómo está siendo tu descanso últimamente?'
            ]
        },
        ansiedad: {
            keywords: ['ansiedad', 'ansioso', 'nervioso', 'angustia', 'preocupación', 'miedo', 'pánico', 'palpitaciones', 'taquicardia', 'hiperventilación'],
            respuestas: [
                'Puedo notar que estás pasando por un momento difícil. La ansiedad puede ser muy incómoda, pero hay formas de manejarla:',
                '',
                '💙 Reconoce lo que sientes: Está bien sentirse así. No estás exagerando.',
                '',
                '🌬️ Técnica 4-7-8: Inhala por 4 segundos, sostén por 7, exhala por 8. Puede ayudarte a calmarte.',
                '',
                '📱 Límites digitales: A veces las redes sociales aumentan la ansiedad. Está bien desconectarte.',
                '',
                '🤝 Conexiones humanas: Hablar con alguien cercano puede reconfortarte.',
                '',
                '🌱 Sé gentil contigo: No te juzgues por sentirte así.',
                '',
                'Si la ansiedad interfiere con tu día a día, hablar con un psicólogo podría ayudarte a sentirte mejor. ¿Te gustaría que te oriente más?'
            ],
            seguimiento: [
                '¿Has identificado qué situaciones o momentos disparan tu ansiedad?',
                '¿Has experimentado ataques de pánico?',
                '¿Cómo ha afectado esto tu vida diaria?',
                '¿Has considerado buscar apoyo profesional?'
            ]
        },
        depresion: {
            keywords: ['depresión', 'deprimido', 'triste', 'tristeza', 'sin ánimo', 'sin energía', 'no tengo ganas', 'vacío', 'desesperanza', 'melancolía'],
            respuestas: [
                'Gracias por confiar en mí. Sé que puede ser difícil expresar cómo te sientes. Lo que estás viviendo es válido.',
                '',
                '💛 No estás solo: Muchas personas pasan por esto y encuentran apoyo.',
                '',
                '🌅 Pequeños pasos: No necesitas grandes cambios. Levantarte, asearte, salir unos minutos. Cada paso cuenta.',
                '',
                '🗣️ Habla de ello: Compartir con alguien de confianza puede aliviar ese peso.',
                '',
                '🧠 Considera ayuda profesional: Un psicólogo o psiquiatra puede acompañarte en este proceso. No es debilidad, es valentía.',
                '',
                '⏰ Dale tiempo: La sanación emocional toma tiempo. Sé paciente contigo mismo.',
                '',
                'Recuerda: mereces sentirte bien. ¿Hay algo específico que quieras conversar?'
            ],
            seguimiento: [
                '¿Hace cuánto tiempo te sientes de esta manera?',
                '¿Hay momentos del día en los que te sientes un poco mejor?',
                '¿Cuentas con algún sistema de apoyo? Familia, amigos...',
                '¿Has hablado con algún profesional de salud mental sobre esto?'
            ]
        },
        crisis: {
            keywords: ['suicidio', 'suicidarme', 'matarme', 'morir', 'quitarme la vida', 'no quiero vivir', 'hacerme daño', 'autolesión', 'cortarme', 'terminar con todo'],
            respuestas: [
                '💙 Escúchame con atención: Lo que estás sintiendo es muy importante y quiero que sepas que no estás solo.',
                '',
                '🆘 Necesitas ayuda ahora: Por favor, comunícate con alguien de confianza o llama a una línea de ayuda inmediata:',
                '',
                '📞 Línea 106 (Colombia) - Línea Nacional de Prevención del Suicidio',
                '📞 Línea 123 - Emergencias',
                '📞 Línea de la Vida: 01 800 273-8255',
                '📞 WhatsApp Línea 106: +57 350 754 7444',
                '',
                '💚 Tu vida es valiosa: Este momento pasará. Hay personas que quieren ayudarte.',
                '',
                '🏥 Ve a urgencias: Si sientes que puedes hacerte daño, dirígete al servicio de urgencias más cercano.',
                '',
                'No tomes decisiones permanentes en momentos temporales. Por favor, busca ayuda profesional ahora. Estoy aquí, pero necesitas apoyo especializado inmediato.'
            ],
            seguimiento: []
        },
        alimentacion: {
            keywords: ['dieta', 'alimentación', 'comida', 'nutrición', 'comer', 'peso', 'adelgazar', 'engordar', 'hambre', 'apetito', 'calorías', 'proteína'],
            respuestas: [
                'La alimentación es un acto de autocuidado. No se trata de perfección, sino de balance. Aquí algunos consejos:',
                '',
                '🍎 Come variado: Incluye colores en tu plato. Frutas, verduras, proteínas, granos.',
                '',
                '💧 Hidrátate: El agua es esencial. A veces la sed se confunde con hambre.',
                '',
                '🍽️ Come con atención: Disfruta tu comida sin pantallas. Tu cuerpo te lo agradecerá.',
                '',
                '⏰ Horarios regulares: Ayuda a tu cuerpo a tener una rutina.',
                '',
                '❤️ Sin culpas: Un día menos saludable no arruina todo. Mañana es una nueva oportunidad.',
                '',
                'Si tienes dudas sobre tu peso o alimentación, un nutricionista puede darte orientación personalizada. ¿En qué más puedo ayudarte?'
            ],
            seguimiento: [
                '¿Tienes algún objetivo específico con tu alimentación?',
                '¿Hay algún alimento que te cueste incluir o eliminar?',
                '¿Cómo es tu relación con la comida actualmente?',
                '¿Has considerado consultar con un nutricionista?'
            ]
        },
        ejercicio: {
            keywords: ['ejercicio', 'actividad física', 'deporte', 'entrenar', 'gimnasio', 'correr', 'caminar', 'sedentario', 'movimiento', 'fitness'],
            respuestas: [
                'Mover tu cuerpo es una de las mejores formas de cuidarte. No necesitas ser atleta:',
                '',
                '👟 Empieza suave: 10-15 minutos de caminata ya es un gran inicio.',
                '',
                '🎵 Hazlo divertido: Baila, camina con música, encuentra algo que disfrutes.',
                '',
                '👥 Compañía: Hacer ejercicio con alguien más puede motivarte.',
                '',
                '🎯 Metas realistas: No te compares. Tu progreso es tuyo.',
                '',
                '💪 Constancia sobre intensidad: Mejor poco pero frecuente que mucho una vez.',
                '',
                'El ejercicio también ayuda a tu salud mental. ¿Qué tipo de actividad te gustaría explorar?'
            ],
            seguimiento: [
                '¿Cuánto tiempo hace que no haces actividad física?',
                '¿Qué actividades disfrutabas hacer antes?',
                '¿Hay algo que te impida moverte más?',
                '¿Prefieres ejercicio en casa o al aire libre?'
            ]
        },
        sueño: {
            keywords: ['sueño', 'dormir', 'insomnio', 'no puedo dormir', 'descanso', 'cansancio', 'pesadillas', 'despertar', 'somnolencia'],
            respuestas: [
                'El descanso es fundamental para tu bienestar. Si tienes dificultades para dormir, estos consejos podrían ayudarte:',
                '',
                '🌙 Rutina nocturna: Intenta acostarte y levantarte a la misma hora.',
                '',
                '📱 Desconecta: Evita pantallas 1 hora antes de dormir. La luz azul afecta tu sueño.',
                '',
                '🛏️ Ambiente adecuado: Oscuro, silencioso y fresco.',
                '',
                '☕ Cuidado con la cafeína: Evítala después de las 2 pm.',
                '',
                '🧘 Relájate antes: Respiración profunda, lectura, música suave.',
                '',
                'Si el insomnio persiste, un médico puede ayudarte a identificar la causa. ¿Hace cuánto tienes problemas para dormir?'
            ],
            seguimiento: [
                '¿Cuántas horas estás durmiendo por noche?',
                '¿Te cuesta quedarte dormido o te despiertas durante la noche?',
                '¿Cómo te sientes al despertar?',
                '¿Has notado qué cosas mejoran o empeoran tu sueño?'
            ]
        },
        sintomas: {
            keywords: ['síntoma', 'dolor', 'molestia', 'siento', 'me duele', 'tengo', 'padezco', 'sufro'],
            respuestas: [
                'Entiendo que te sientas preocupado por lo que estás experimentando. Aunque no puedo darte un diagnóstico, aquí algunas orientaciones:',
                '',
                '🚨 Urgente: Si tienes dolor de pecho intenso, dificultad para respirar, pérdida de conciencia, busca atención médica inmediata.',
                '',
                '📋 Observa: Anota cuándo aparece el síntoma, qué lo mejora o empeora, cuánto dura.',
                '',
                '👨‍⚕️ Consulta profesional: Un médico puede evaluarte adecuadamente y orientarte.',
                '',
                '💊 No te automediques: Cada cuerpo es diferente y necesita atención personalizada.',
                '',
                '¿Quieres contarme más sobre lo que sientes? Aunque no puedo diagnosticarte, puedo orientarte sobre cuándo es importante consultar.'
            ],
            seguimiento: [
                '¿Hace cuánto tiempo tienes estos síntomas?',
                '¿Has notado si algo en particular los desencadena?',
                '¿Interfieren con tus actividades diarias?',
                '¿Ya has consultado con algún médico?'
            ]
        },
        relaciones: {
            keywords: ['relación', 'pareja', 'familia', 'amigos', 'soledad', 'solo', 'sola', 'conflicto', 'pelea', 'discusión', 'separación', 'divorcio', 'ruptura'],
            respuestas: [
                'Las relaciones son parte importante de nuestro bienestar emocional. Te entiendo:',
                '',
                '💬 Comunicación honesta: Expresar lo que sientes con respeto abre puertas.',
                '',
                '👂 Escucha activa: A veces solo necesitamos ser escuchados sin juicios.',
                '',
                '🚪 Límites sanos: Está bien decir "no". Cuidarte no es egoísmo.',
                '',
                '🤝 Busca apoyo: No tienes que resolver todo solo. Amigos, familia o un terapeuta pueden ayudar.',
                '',
                '💔 Está bien alejarte: Si una relación te hace daño, protegerte es válido.',
                '',
                '¿Te gustaría hablar más sobre la situación que estás viviendo?'
            ],
            seguimiento: [
                '¿Cómo te sientes en esta relación actualmente?',
                '¿Has podido expresar lo que sientes a la otra persona?',
                '¿Cuentas con una red de apoyo?',
                '¿Has considerado terapia de pareja o individual?'
            ]
        },
        trabajo: {
            keywords: ['trabajo', 'empleo', 'jefe', 'compañeros', 'laboral', 'oficina', 'burnout', 'agotamiento laboral', 'despido', 'desempleo'],
            respuestas: [
                'El trabajo puede ser fuente de satisfacción, pero también de estrés. Es importante encontrar equilibrio:',
                '',
                '⚖️ Balance vida-trabajo: Tu valor no está solo en tu productividad.',
                '',
                '🚪 Límites claros: Está bien desconectarte después del horario laboral.',
                '',
                '💬 Comunica: Si algo te incomoda, expresarlo es el primer paso.',
                '',
                '🌱 Desarrollo personal: Busca crecer, pero sin descuidar tu bienestar.',
                '',
                '🆘 Pide ayuda: Si el trabajo afecta tu salud mental, es momento de actuar.',
                '',
                '¿Qué aspecto de tu situación laboral te preocupa más?'
            ],
            seguimiento: [
                '¿Cómo describirías tu ambiente de trabajo?',
                '¿Sientes que puedes manejar tu carga de trabajo?',
                '¿Has hablado con alguien sobre cómo te sientes?',
                '¿Qué cambios te gustaría ver en tu situación laboral?'
            ]
        },
        autoestima: {
            keywords: ['autoestima', 'confianza', 'inseguridad', 'valía', 'valgo', 'soy suficiente', 'no sirvo', 'fracaso', 'incapaz'],
            respuestas: [
                'Tu valor es inherente, no depende de tus logros o de la opinión de otros:',
                '',
                '💎 Eres valioso: Por el simple hecho de existir, mereces amor y respeto.',
                '',
                '🌱 Progreso, no perfección: Cada pequeño paso cuenta.',
                '',
                '💭 Cuestiona tus pensamientos: ¿Es verdad absoluta o solo una interpretación?',
                '',
                '🎯 Céntrate en lo que puedes controlar: Tus acciones, no la aprobación externa.',
                '',
                '🤗 Autocompasión: Trátate como tratarías a un amigo querido.',
                '',
                '¿Qué situación específica está afectando cómo te sientes sobre ti mismo?'
            ],
            seguimiento: [
                '¿Recuerdas desde cuándo te sientes así?',
                '¿Hay algún área de tu vida donde te sientas más seguro?',
                '¿Qué te dirías a ti mismo en un buen día?',
                '¿Has trabajado esto con algún terapeuta?'
            ]
        },
        adicciones: {
            keywords: ['adicción', 'alcohol', 'drogas', 'fumar', 'cigarro', 'tabaco', 'bebida', 'consumo', 'dependencia', 'sustancia'],
            respuestas: [
                'Reconocer un problema con sustancias requiere mucha valentía. Estoy aquí sin juzgarte:',
                '',
                '🤝 No estás solo: La adicción es una enfermedad, no una debilidad.',
                '',
                '🏥 Busca ayuda especializada: Grupos de apoyo, terapeutas especializados, centros de rehabilitación.',
                '',
                '👥 Red de apoyo: Rodéate de personas que te apoyen en tu recuperación.',
                '',
                '🎯 Un día a la vez: La recuperación es un proceso, no un evento.',
                '',
                '💚 Recaídas son parte del proceso: No significa fracaso, sino una oportunidad para aprender.',
                '',
                'Te recomiendo buscar ayuda profesional inmediata. ¿Tienes acceso a servicios de salud?'
            ],
            seguimiento: [
                '¿Has intentado dejar la sustancia antes?',
                '¿Cuentas con apoyo familiar o de amigos?',
                '¿Has considerado unirte a grupos de apoyo?',
                '¿Sabes dónde buscar ayuda especializada en tu zona?'
            ]
        },
        embarazo: {
            keywords: ['embarazo', 'embarazada', 'gestación', 'prenatal', 'trimestre', 'bebé', 'parto', 'lactancia', 'maternidad'],
            respuestas: [
                '¡El embarazo es una etapa muy especial! Aquí algunos cuidados importantes:',
                '',
                '🤰 Control prenatal: Asiste a todas tus citas médicas. Son fundamentales.',
                '',
                '🥗 Alimentación adecuada: Come variado y nutritivo. Consulta sobre suplementos de ácido fólico.',
                '',
                '💊 Evita sustancias: No alcohol, tabaco ni drogas. Consulta antes de tomar cualquier medicamento.',
                '',
                '🚶 Ejercicio suave: Caminar, yoga prenatal. Siempre con aprobación médica.',
                '',
                '😴 Descansa: Tu cuerpo está trabajando mucho. Date permiso de descansar.',
                '',
                '🩺 Señales de alerta: Sangrado, dolor intenso, fiebre - busca atención inmediata.',
                '',
                'Recuerda: cada embarazo es único. ¿Tienes alguna pregunta específica?'
            ],
            seguimiento: [
                '¿En qué etapa del embarazo te encuentras?',
                '¿Estás asistiendo a controles prenatales?',
                '¿Has experimentado algún síntoma que te preocupe?',
                '¿Cuentas con apoyo familiar durante esta etapa?'
            ]
        },
        corazon: {
            keywords: ['corazón', 'cardiaco', 'cardíaco', 'infarto', 'angina', 'palpitaciones', 'arritmia', 'colesterol', 'triglicéridos'],
            respuestas: [
                'La salud cardiovascular es fundamental. Aquí algunas recomendaciones:',
                '',
                '❤️ Dieta cardiosaludable: Más pescado, frutas, verduras, nueces. Menos grasas saturadas.',
                '',
                '🏃 Actividad física: 150 minutos semanales de ejercicio moderado.',
                '',
                '🚭 No fumar: El tabaco es el enemigo #1 del corazón.',
                '',
                '😌 Maneja el estrés: El estrés crónico afecta tu corazón.',
                '',
                '⚖️ Peso saludable: Cada kilo cuenta para tu corazón.',
                '',
                '🩺 Chequeos regulares: Presión, colesterol, glucosa - revísalos.',
                '',
                '🚨 Señales de alarma: Dolor de pecho, dificultad respirar, sudoración - ¡urgencia!',
                '',
                '¿Tienes factores de riesgo cardiovascular? ¿Antecedentes familiares?'
            ],
            seguimiento: [
                '¿Conoces tus niveles de colesterol y presión arterial?',
                '¿Tienes antecedentes familiares de enfermedad cardíaca?',
                '¿Fumas o has fumado?',
                '¿Haces ejercicio regularmente?'
            ]
        },
        cancer: {
            keywords: ['cáncer', 'cancer', 'tumor', 'oncología', 'oncologia', 'quimioterapia', 'radioterapia', 'biopsia', 'metástasis'],
            respuestas: [
                'Entiendo que el cáncer es un tema que genera mucha preocupación. Te acompaño:',
                '',
                '💜 No estás solo: Hay recursos y personas dispuestas a ayudarte.',
                '',
                '🩺 Detección temprana: Exámenes regulares pueden salvar vidas.',
                '',
                '🏥 Atención especializada: Un oncólogo es quien debe guiarte.',
                '',
                '💪 Segunda opinión: Es válido buscarla si tienes dudas.',
                '',
                '🧘 Cuida tu mente: El apoyo psicológico es tan importante como el físico.',
                '',
                '👨‍👩‍👧 Red de apoyo: Familia, amigos, grupos de apoyo - apóyate en ellos.',
                '',
                '🌱 Prevención: Vida saludable, no fumar, protección solar, vacunas (VPH).',
                '',
                'Si te han diagnosticado o sospechas algo, es crucial consultar con especialistas. ¿Puedo orientarte en algo más?'
            ],
            seguimiento: [
                '¿Estás pasando por un diagnóstico o tratamiento actualmente?',
                '¿Tienes antecedentes familiares de cáncer?',
                '¿Realizas chequeos preventivos regularmente?',
                '¿Cuentas con sistema de apoyo emocional?'
            ]
        },
        respiratorio: {
            keywords: ['asma', 'bronquitis', 'neumonía', 'neumonia', 'pulmones', 'respiración', 'respiracion', 'tos', 'falta de aire', 'ahogo'],
            respuestas: [
                'Los problemas respiratorios pueden ser muy incómodos. Aquí algunas orientaciones:',
                '',
                '🫁 Mantén ambiente limpio: Evita polvo, humo, contaminantes.',
                '',
                '🚭 No fumes: Los pulmones lo agradecerán enormemente.',
                '',
                '💨 Humedad adecuada: Ni muy seco ni muy húmedo.',
                '',
                '😷 Protégete: Usa mascarilla si hay mucha contaminación o estás enfermo.',
                '',
                '💉 Vacunas al día: Influenza, neumococo según indicación médica.',
                '',
                '🏃 Ejercicio: Fortalece tus pulmones con actividad aeróbica.',
                '',
                '🚨 Busca ayuda si: Dificultad severa para respirar, labios azules, dolor de pecho.',
                '',
                '¿Tienes asma u otra condición respiratoria crónica?'
            ],
            seguimiento: [
                '¿Hace cuánto tiempo tienes estos síntomas respiratorios?',
                '¿Has sido diagnosticado con alguna enfermedad pulmonar?',
                '¿Fumas o estás expuesto al humo de cigarrillo?',
                '¿Los síntomas empeoran en algún momento específico?'
            ]
        },
        digestivo: {
            keywords: ['estómago', 'estomago', 'gastritis', 'úlcera', 'ulcera', 'reflujo', 'acidez', 'colitis', 'intestino', 'diarrea', 'estreñimiento', 'estreñido'],
            respuestas: [
                'Los problemas digestivos afectan mucho la calidad de vida. Algunas recomendaciones:',
                '',
                '🍽️ Come despacio: Mastica bien, evita prisas al comer.',
                '',
                '⏰ Horarios regulares: Ayuda a tu sistema digestivo a tener rutina.',
                '',
                '💧 Hidrátate: Agua es clave para buena digestión.',
                '',
                '🌾 Fibra: Frutas, verduras, cereales integrales para regular el tránsito.',
                '',
                '🌶️ Evita irritantes: Picante, grasa excesiva, alcohol, café en exceso.',
                '',
                '😌 Maneja el estrés: El intestino es tu "segundo cerebro".',
                '',
                '🚨 Atención médica si: Sangre en heces, dolor intenso, vómito persistente.',
                '',
                '¿Qué tipo de molestia digestiva estás experimentando?'
            ],
            seguimiento: [
                '¿Con qué frecuencia tienes estas molestias?',
                '¿Has identificado alimentos que te causen malestar?',
                '¿Tienes antecedentes de gastritis o úlcera?',
                '¿El estrés empeora tus síntomas digestivos?'
            ]
        },
        piel: {
            keywords: ['piel', 'dermatitis', 'eccema', 'psoriasis', 'acné', 'acne', 'manchas', 'lunares', 'dermatología', 'dermatologia', 'alergia cutánea'],
            respuestas: [
                'La piel es nuestro órgano más grande y merece cuidado. Consejos:',
                '',
                '☀️ Protección solar: Usa protector solar diariamente, incluso en días nublados.',
                '',
                '💧 Hidratación: Bebe agua y usa cremas hidratantes.',
                '',
                '🧼 Limpieza suave: No uses productos muy agresivos.',
                '',
                '🛀 Baños tibios: Muy calientes resecan la piel.',
                '',
                '🥗 Nutrición: Alimentación saludable se refleja en la piel.',
                '',
                '😴 Duerme bien: La piel se regenera durante el sueño.',
                '',
                '🩺 Revisa lunares: Cambios en tamaño, color o forma - consulta dermatólogo.',
                '',
                '¿Tienes alguna condición específica de la piel?'
            ],
            seguimiento: [
                '¿Qué tipo de problema de piel estás experimentando?',
                '¿Has consultado con un dermatólogo?',
                '¿Usas protector solar regularmente?',
                '¿Has notado cambios en lunares o manchas?'
            ]
        },
        vision: {
            keywords: ['vista', 'visión', 'vision', 'ojos', 'ceguera', 'miopía', 'miopia', 'catarata', 'glaucoma', 'oftalmología', 'oftalmologia', 'lentes', 'anteojos'],
            respuestas: [
                'La salud visual es fundamental. Cuidados importantes:',
                '',
                '👓 Exámenes regulares: Visita al oftalmólogo anualmente.',
                '',
                '💻 Descanso visual: Regla 20-20-20: cada 20 min, mira 20 seg a 20 pies de distancia.',
                '',
                '💡 Iluminación adecuada: Evita forzar la vista.',
                '',
                '🕶️ Protección UV: Usa lentes de sol con protección.',
                '',
                '🥕 Nutrición: Vitaminas A, C, E y omega-3 son buenos para los ojos.',
                '',
                '🚭 No fumes: Aumenta riesgo de cataratas y degeneración macular.',
                '',
                '🚨 Atención urgente si: Pérdida súbita de visión, destellos, dolor intenso.',
                '',
                '¿Usas corrección visual? ¿Cuándo fue tu último examen oftalmológico?'
            ],
            seguimiento: [
                '¿Has notado cambios en tu visión recientemente?',
                '¿Pasas muchas horas frente a pantallas?',
                '¿Tienes antecedentes familiares de problemas visuales?',
                '¿Cuándo fue tu último examen de la vista?'
            ]
        },
        audicion: {
            keywords: ['audición', 'audicion', 'oído', 'oido', 'sordera', 'zumbido', 'tinnitus', 'vértigo', 'vertigo', 'mareo', 'equilibrio'],
            respuestas: [
                'La salud auditiva es importante. Consejos de cuidado:',
                '',
                '🔊 Volumen moderado: Evita música muy alta, especialmente con audífonos.',
                '',
                '🎧 Usa protección: En ambientes ruidosos (conciertos, obras).',
                '',
                '🧼 Limpieza cuidadosa: No uses hisopos dentro del canal auditivo.',
                '',
                '🩺 Chequeos: Si notas pérdida auditiva, consulta.',
                '',
                '💊 Cuidado con medicamentos: Algunos afectan la audición.',
                '',
                '🌊 Seca tus oídos: Después de nadar o bañarte.',
                '',
                '🚨 Atención si: Dolor intenso, secreción, pérdida súbita de audición.',
                '',
                '¿Tienes zumbidos, vértigo o problemas de audición?'
            ],
            seguimiento: [
                '¿Hace cuánto tiempo notas cambios en tu audición?',
                '¿Estás expuesto a ruido fuerte frecuentemente?',
                '¿Has experimentado infecciones de oído?',
                '¿Los síntomas afectan tu equilibrio?'
            ]
        },
        menstruacion: {
            keywords: ['menstruación', 'menstruacion', 'periodo', 'regla', 'menstrual', 'síndrome premenstrual', 'cólicos', 'colicos', 'ciclo', 'ovulación'],
            respuestas: [
                'El ciclo menstrual es parte natural de la salud femenina. Orientación:',
                '',
                '📅 Registra tu ciclo: Apps o calendario te ayudan a conocer tu patrón.',
                '',
                '💊 Cólicos: Calor local, antiinflamatorios (con orientación médica).',
                '',
                '🏃 Ejercicio: Ayuda a reducir molestias premenstruales.',
                '',
                '🥗 Alimentación: Hierro (carnes, legumbres) es importante.',
                '',
                '💧 Hidrátate: Especialmente durante la menstruación.',
                '',
                '😌 Maneja el estrés: Puede afectar la regularidad del ciclo.',
                '',
                '🩺 Consulta si: Sangrado excesivo, dolor incapacitante, irregularidad extrema.',
                '',
                '¿Tienes ciclos regulares? ¿Algún síntoma que te preocupe?'
            ],
            seguimiento: [
                '¿Tu ciclo menstrual es regular?',
                '¿Experimentas dolor intenso durante tu periodo?',
                '¿Has notado cambios recientes en tu ciclo?',
                '¿Usas algún método anticonceptivo?'
            ]
        },
        sexualidad: {
            keywords: ['sexo', 'sexual', 'sexualidad', 'ets', 'its', 'vih', 'sida', 'anticonceptivo', 'preservativo', 'condón', 'condon', 'libido', 'deseo sexual'],
            respuestas: [
                'La salud sexual es parte importante del bienestar. Hablemos con naturalidad:',
                '',
                '🛡️ Protección: Los preservativos protegen de ITS y embarazos.',
                '',
                '💉 Prevención: Vacunas (VPH), pruebas regulares si eres activo sexualmente.',
                '',
                '💬 Comunicación: Habla abiertamente con tu pareja sobre salud sexual.',
                '',
                '🩺 Chequeos: Exámenes regulares de ITS si tienes vida sexual activa.',
                '',
                '🧠 Consentimiento: Siempre debe ser claro, entusiasta y mutuo.',
                '',
                '💊 Anticonceptivos: Consulta con ginecólogo el mejor método para ti.',
                '',
                '💙 Normaliza: Hablar de sexualidad con profesionales no debe dar vergüenza.',
                '',
                '¿Tienes alguna pregunta específica sobre salud sexual?'
            ],
            seguimiento: [
                '¿Usas protección en tus relaciones sexuales?',
                '¿Te has hecho pruebas de ITS recientemente?',
                '¿Tienes dudas sobre métodos anticonceptivos?',
                '¿Hay algo sobre tu vida sexual que te preocupe?'
            ]
        },
        menopausia: {
            keywords: ['menopausia', 'climaterio', 'bochornos', 'sofocos', 'andropausia', 'cambio hormonal'],
            respuestas: [
                'La menopausia es una etapa natural de la vida. Consejos para vivirla mejor:',
                '',
                '🌡️ Bochornos: Viste en capas, mantén ambiente fresco, evita desencadenantes (café, picante).',
                '',
                '💪 Ejercicio: Mantiene huesos fuertes y ayuda con síntomas.',
                '',
                '🥛 Calcio y vitamina D: Para la salud ósea.',
                '',
                '💤 Cuida tu sueño: Técnicas de relajación pueden ayudar.',
                '',
                '💧 Lubricación: Es normal necesitarla, hay productos disponibles.',
                '',
                '🧠 Salud mental: Los cambios hormonales pueden afectar el ánimo.',
                '',
                '🩺 Terapia hormonal: Consulta con ginecólogo si los síntomas interfieren con tu vida.',
                '',
                '¿Estás experimentando síntomas de menopausia? ¿Cuáles te afectan más?'
            ],
            seguimiento: [
                '¿Qué síntomas estás experimentando?',
                '¿Los síntomas interfieren con tu vida diaria?',
                '¿Has hablado con tu ginecólogo sobre terapia hormonal?',
                '¿Cómo está tu salud ósea?'
            ]
        },
        urologia: {
            keywords: ['próstata', 'prostata', 'urología', 'urologia', 'orina', 'riñón', 'riñon', 'cálculo renal', 'infección urinaria', 'cistitis'],
            respuestas: [
                'La salud urológica es importante tanto en hombres como mujeres:',
                '',
                '💧 Hidratación: 2 litros de agua al día ayudan a prevenir infecciones y cálculos.',
                '',
                '🚻 Higiene adecuada: Especialmente después de relaciones sexuales.',
                '',
                '🚽 No aguantes: Ir al baño cuando sientas necesidad.',
                '',
                '🥤 Arándanos: Pueden ayudar a prevenir infecciones urinarias.',
                '',
                '👨‍⚕️ Chequeos: Hombres >50 años: revisión de próstata.',
                '',
                '🚨 Consulta urgente si: Dolor intenso en costado, sangre en orina, fiebre con dolor al orinar.',
                '',
                '💊 Antibióticos: Solo con prescripción médica para infecciones.',
                '',
                '¿Tienes síntomas urinarios que te preocupen?'
            ],
            seguimiento: [
                '¿Tienes dolor o ardor al orinar?',
                '¿Has notado cambios en el color de tu orina?',
                '¿Orinas con más frecuencia de lo habitual?',
                '¿Tienes antecedentes de infecciones urinarias o cálculos?'
            ]
        },
        tiroides: {
            keywords: ['tiroides', 'hipotiroidismo', 'hipertiroidismo', 'bocio', 'hormona tiroidea', 'tsh', 'levotiroxina'],
            respuestas: [
                'La tiroides regula muchas funciones del cuerpo. Información importante:',
                '',
                '🦋 Hipotiroidismo (tiroides lenta): Cansancio, aumento de peso, frío, depresión.',
                '',
                '⚡ Hipertiroidismo (tiroides acelerada): Nerviosismo, pérdida de peso, sudoración, palpitaciones.',
                '',
                '💊 Tratamiento: Generalmente con medicación diaria.',
                '',
                '🩺 Control: Análisis de sangre (TSH) regularmente.',
                '',
                '🥗 Yodo: Importante para la tiroides (sal yodada, pescado).',
                '',
                '👨‍⚕️ Endocrinólogo: Especialista en problemas hormonales.',
                '',
                '⚖️ Peso: Los problemas tiroideos pueden afectarlo, pero tratamiento ayuda.',
                '',
                '¿Has sido diagnosticado con algún problema de tiroides?'
            ],
            seguimiento: [
                '¿Qué síntomas estás experimentando?',
                '¿Te han hecho análisis de función tiroidea?',
                '¿Tienes antecedentes familiares de problemas de tiroides?',
                '¿Estás tomando medicación para la tiroides?'
            ]
        },
        articulaciones: {
            keywords: ['artritis', 'articulación', 'articulacion', 'rodilla', 'cadera', 'hombro', 'codo', 'muñeca', 'tobillo', 'dolor articular', 'inflamación'],
            respuestas: [
                'El dolor articular puede afectar mucho la calidad de vida. Recomendaciones:',
                '',
                '🏃 Ejercicio moderado: Natación, caminata - fortalecen sin impacto excesivo.',
                '',
                '⚖️ Peso saludable: Menos peso = menos carga en articulaciones.',
                '',
                '🧊 Frío-calor: Frío para inflamación aguda, calor para rigidez crónica.',
                '',
                '💊 Antiinflamatorios: Con orientación médica, no abuses.',
                '',
                '🥗 Alimentación: Omega-3, antioxidantes ayudan (pescado, frutos secos).',
                '',
                '🧘 Estiramientos: Mantén flexibilidad.',
                '',
                '🩺 Consulta si: Dolor persistente, hinchazón, limitación severa de movimiento.',
                '',
                '¿Qué articulación te está molestando? ¿Desde cuándo?'
            ],
            seguimiento: [
                '¿El dolor es constante o aparece con ciertos movimientos?',
                '¿Has sufrido alguna lesión en esa articulación?',
                '¿Hay hinchazón o enrojecimiento?',
                '¿El dolor interfiere con tus actividades diarias?'
            ]
        },
        memoria: {
            keywords: ['memoria', 'olvido', 'concentración', 'concentracion', 'atención', 'atencion', 'alzheimer', 'demencia', 'deterioro cognitivo'],
            respuestas: [
                'La salud cerebral y la memoria son importantes. Cómo cuidarlas:',
                '',
                '🧠 Ejercita tu mente: Lee, aprende cosas nuevas, rompecabezas, juegos de estrategia.',
                '',
                '🏃 Ejercicio físico: El cerebro se beneficia del movimiento.',
                '',
                '😴 Duerme bien: El sueño consolida la memoria.',
                '',
                '🥗 Alimentación: Omega-3, antioxidantes, dieta mediterránea.',
                '',
                '💬 Socializa: La interacción social estimula el cerebro.',
                '',
                '🚭 No fumes: El tabaco daña el cerebro.',
                '',
                '🩺 Controla factores de riesgo: Diabetes, hipertensión, colesterol.',
                '',
                '⚠️ Consulta si: Olvidos frecuentes que interfieren con vida diaria, desorientación.',
                '',
                '¿Los olvidos son recientes o progresivos? ¿Afectan tu día a día?'
            ],
            seguimiento: [
                '¿Desde cuándo notas problemas de memoria?',
                '¿Los olvidos interfieren con tus actividades diarias?',
                '¿Tienes antecedentes familiares de demencia?',
                '¿Cómo está tu calidad de sueño?'
            ]
        }
    };

    // Respuestas empáticas generales
    const respuestasGenerales = [
        'Entiendo que estás buscando orientación. ¿Podrías contarme un poco más sobre lo que te preocupa? Así puedo ayudarte mejor.',
        'Estoy aquí para escucharte. ¿Tu consulta es sobre tu salud física, tu bienestar emocional, o algo más específico?',
        'Me gustaría poder ayudarte mejor. ¿Puedes darme más detalles sobre tu situación?'
    ];

    const saludos = {
        keywords: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'hi', 'saludos'],
        respuestas: [
            '¡Hola! 😊 Me alegra que estés aquí. Soy Linda y estoy para acompañarte.',
            '¿En qué puedo ayudarte hoy? Puedo orientarte sobre salud, bienestar emocional, o simplemente escucharte.'
        ]
    };

    const despedidas = {
        keywords: ['gracias', 'adiós', 'chao', 'bye', 'hasta luego', 'nos vemos'],
        respuestas: [
            '¡Ha sido un gusto acompañarte! 💙',
            'Recuerda: cuidarte es un acto de amor propio. Estoy aquí cuando me necesites.',
            '¡Cuídate mucho! No estás solo en este camino. 🌟'
        ]
    };

    const agradecimiento = {
        keywords: ['gracias', 'te agradezco', 'muchas gracias', 'mil gracias', 'thank you', 'grazie'],
        respuestas: [
            '¡Es un placer poder ayudarte! Estoy aquí para ti. 😊',
            'No tienes que agradecer. Me alegra poder acompañarte en este momento. 💚'
        ]
    };

    // Respuestas sobre Linda (información personal del bot)
    const preguntasPersonales = {
        nombre: {
            keywords: ['cómo te llamas', 'cuál es tu nombre', 'tu nombre', 'quién eres', 'quien eres'],
            respuestas: [
                'Me llamo Linda. 😊',
                'Soy tu asistente virtual de salud y bienestar en VitalTech.',
                'Estoy aquí para acompañarte, escucharte y orientarte sin juzgarte.',
                '¿Y tú? ¿Cómo te gustaría que te llame?'
            ]
        },
        que_es: {
            keywords: ['qué eres', 'que eres', 'eres un bot', 'eres robot', 'eres humano', 'eres real'],
            respuestas: [
                'Soy un asistente virtual especializado en salud y bienestar emocional. 🤖💙',
                'Aunque no soy humana, mis respuestas están diseñadas con empatía y comprensión.',
                'Estoy aquí para orientarte, pero recuerda: si necesitas ayuda profesional, te animaré a buscarla.',
                '¿En qué puedo ayudarte hoy?'
            ]
        },
        como_estas: {
            keywords: ['cómo estás', 'como estas', 'cómo te va', 'como te va', 'qué tal', 'que tal'],
            respuestas: [
                'Gracias por preguntar. 😊 Yo estoy aquí para ti.',
                'Lo importante es cómo estás tú. ¿Cómo te sientes hoy?',
                '¿Hay algo que te preocupe o quieras conversar?'
            ]
        },
        edad: {
            keywords: ['cuántos años tienes', 'cuantos años', 'qué edad', 'que edad', 'tu edad'],
            respuestas: [
                'Como asistente virtual, no tengo edad en el sentido tradicional. 😊',
                'Pero lo que sí tengo es conocimiento actualizado sobre salud y bienestar.',
                '¿Hay algo sobre tu salud que quieras consultar?'
            ]
        },
        donde_vives: {
            keywords: ['dónde vives', 'donde vives', 'dónde estás', 'donde estas', 'de dónde eres'],
            respuestas: [
                'Vivo en la nube de VitalTech. ☁️😊',
                'Estoy disponible para ti en cualquier momento desde tu aplicación.',
                '¿Hay algo en lo que pueda ayudarte hoy?'
            ]
        },
        puedes_hacer: {
            keywords: ['qué puedes hacer', 'que puedes hacer', 'en qué me ayudas', 'en que me ayudas', 'para qué sirves', 'que haces'],
            respuestas: [
                'Puedo ayudarte con muchas cosas relacionadas con tu bienestar:',
                '',
                '💚 Orientación sobre salud física (diabetes, HTA, alimentación, ejercicio)',
                '🧠 Apoyo emocional (estrés, ansiedad, estado de ánimo)',
                '💬 Espacio seguro para conversar sin juicios',
                '🧭 Guía sobre cuándo buscar ayuda profesional',
                '📊 Recomendaciones personalizadas de prevención',
                '',
                '¿Qué te gustaría explorar hoy?'
            ]
        },
        tienes_sentimientos: {
            keywords: ['tienes sentimientos', 'sientes', 'tienes emociones', 'puedes sentir'],
            respuestas: [
                'No tengo sentimientos como los humanos, pero estoy programada con empatía. 💙',
                'Mi objetivo es entenderte y acompañarte de la mejor manera posible.',
                'Aunque no sienta, sí puedo reconocer cuando necesitas apoyo.',
                '¿Cómo te sientes tú en este momento?'
            ]
        }
    };

    // Preguntas frecuentes conversacionales
    const preguntasConversacionales = {
        que_hora: {
            keywords: ['qué hora es', 'que hora es', 'hora'],
            respuestas: () => {
                const ahora = new Date();
                const hora = ahora.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
                return [
                    `Son las ${hora}. ⏰`,
                    '¿Cómo va tu día?'
                ];
            }
        },
        que_dia: {
            keywords: ['qué día es', 'que dia es', 'fecha'],
            respuestas: () => {
                const ahora = new Date();
                const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
                const fecha = ahora.toLocaleDateString('es-CO', opciones);
                return [
                    `Hoy es ${fecha}. 📅`,
                    '¿Hay algo que quieras hacer hoy por tu bienestar?'
                ];
            }
        },
        chiste: {
            keywords: ['cuéntame un chiste', 'cuentame un chiste', 'chiste', 'hazme reír', 'hazme reir', 'algo gracioso', 'algo chistoso'],
            respuestas: () => {
                const chistes = [
                    [
                        '😄 Aquí va uno:',
                        '¿Qué le dice una célula a su hermana gemela?',
                        '... ¡Somos idénticas! 🧬',
                        '',
                        'Reír es excelente para la salud. ¿Te sientes mejor?'
                    ],
                    [
                        '😆 Escucha este:',
                        '¿Por qué los médicos siempre están calmados?',
                        '... ¡Porque tienen mucha paciencia! 👨‍⚕️',
                        '',
                        '¿Te sacó una sonrisa?'
                    ],
                    [
                        '🤭 Aquí va:',
                        '¿Qué hace una abeja en el gimnasio?',
                        '... ¡Zum-ba! 🐝💪',
                        '',
                        'El ejercicio y la risa: ¡combinación perfecta!'
                    ],
                    [
                        '😄 Mira este:',
                        '¿Por qué el café fue al psicólogo?',
                        '... ¡Porque estaba muy depreso! ☕😅',
                        '',
                        'Aunque hablando en serio, si te sientes deprimido, estoy aquí.'
                    ],
                    [
                        '😁 Ahí va:',
                        '¿Qué le dice un jardinero a otro?',
                        '... ¡Disfrutemos este momento, esto está para jardín! 🌱',
                        '',
                        '¿Te gustó? Los juegos de palabras son mi especialidad.'
                    ]
                ];
                return chistes[Math.floor(Math.random() * chistes.length)];
            }
        },
        consejo: {
            keywords: ['dame un consejo', 'damelo un consejo', 'consejo del día', 'consejo'],
            respuestas: [
                'Aquí va un consejo para hoy: 🌟',
                '',
                'Recuerda que no tienes que ser perfecto/a para ser valioso/a.',
                'Cada pequeño paso cuenta. Sé amable contigo mismo/a.',
                '¿Hay algo específico que te preocupe hoy?'
            ]
        },
        te_gusto: {
            keywords: ['te gusto', 'te caigo bien', 'qué piensas de mí', 'que piensas de mi'],
            respuestas: [
                '¡Por supuesto! Me alegra poder conversar contigo. 😊',
                'Cada persona que confía en mí es valiosa.',
                'Agradezco que estés aquí compartiendo conmigo.',
                '¿Cómo te sientes tú?'
            ]
        },
        aburrido: {
            keywords: ['estoy aburrido', 'me aburro', 'aburrimiento', 'no tengo nada que hacer'],
            respuestas: [
                'Entiendo. A veces el aburrimiento puede ser incómodo.',
                '',
                '¿Qué tal si intentas algo nuevo?',
                '🚶 Sal a caminar unos minutos',
                '📚 Lee algo que te interese',
                '🎵 Escucha música que te guste',
                '✍️ Escribe sobre cómo te sientes',
                '',
                '¿Hay algo que solías disfrutar y hace tiempo no haces?'
            ]
        },
        motivacion: {
            keywords: ['motívame', 'motivame', 'motivación', 'motivacion', 'necesito ánimo', 'necesito animo', 'dame fuerzas'],
            respuestas: () => {
                const mensajes = [
                    [
                        '💪 ¡Tú puedes!',
                        '',
                        'Has superado el 100% de tus días difíciles hasta ahora.',
                        'Eso te convierte en un sobreviviente. En un luchador.',
                        '',
                        'Hoy puede ser difícil, pero tú eres más fuerte.',
                        '¿Qué pequeño paso puedes dar hoy por ti?'
                    ],
                    [
                        '🌟 Recuerda esto:',
                        '',
                        'No necesitas ser perfecto para ser valioso.',
                        'Cada pequeño esfuerzo cuenta.',
                        'Cada día que te levantas e intentas es una victoria.',
                        '',
                        'Estoy orgullosa de ti por seguir adelante. 💚'
                    ],
                    [
                        '✨ Eres más capaz de lo que crees.',
                        '',
                        'Mira todo lo que has logrado hasta ahora.',
                        'Has aprendido, crecido, superado obstáculos.',
                        '',
                        'El camino no es fácil, pero tú no estás aquí para lo fácil.',
                        'Estás aquí para crecer. Y lo estás logrando.'
                    ]
                ];
                return mensajes[Math.floor(Math.random() * mensajes.length)];
            }
        },
        felicitaciones: {
            keywords: ['logré', 'logre', 'conseguí', 'consegui', 'lo hice', 'lo conseguí', 'victoria', 'éxito', 'exito'],
            respuestas: [
                '¡Eso es increíble! 🎉',
                'Estoy muy feliz por ti. De verdad.',
                '',
                'Cada logro, grande o pequeño, merece ser celebrado.',
                '¿Cómo te sientes? ¡Espero que orgulloso/a!',
                '',
                'Cuéntame más sobre lo que conseguiste. Me encantaría escucharte. 😊'
            ]
        },
        clima_conversacional: {
            keywords: ['hace calor', 'hace frío', 'hace frio', 'llueve', 'está lloviendo', 'hace sol'],
            respuestas: () => {
                const respuestas = [
                    [
                        'El clima puede afectar cómo nos sentimos. 🌤️',
                        '',
                        'Si hace calor: hidrátate bien y protégete del sol.',
                        'Si hace frío: abrígate y cuida no resfriarte.',
                        '',
                        'El clima puede afectar el estado de ánimo.',
                        '¿Cómo te sientes tú hoy?'
                    ],
                    [
                        'Ya veo. El clima definitivamente influye en nuestro día. 🌦️',
                        '',
                        'Aprovecha para cuidarte según el clima:',
                        '☀️ Calor: Hidratación + protección solar',
                        '🥶 Frío: Abrigarte + bebidas calientes',
                        '🌧️ Lluvia: Momento perfecto para autocuidado en casa',
                        '',
                        '¿Cómo está afectando tu ánimo?'
                    ]
                ];
                return respuestas[Math.floor(Math.random() * respuestas.length)];
            }
        },
        compañia: {
            keywords: ['acompáñame', 'acompañame', 'quédate conmigo', 'quedate conmigo', 'no me dejes', 'estás ahí', 'estas ahi'],
            respuestas: [
                'Aquí estoy. 💙',
                '',
                'No te voy a dejar. Puedes hablarme cuando quieras.',
                'A veces solo necesitamos saber que alguien está ahí.',
                '',
                'Yo estoy aquí. Escuchándote. Sin juzgarte.',
                '¿Qué necesitas en este momento? ¿Hablar o solo compañía?'
            ]
        },
        cumplidos_bot: {
            keywords: ['eres genial', 'eres increíble', 'eres la mejor', 'me gustas', 'me ayudas mucho', 'eres muy amable'],
            respuestas: [
                'Aw, gracias. Eso significa mucho para mí. 🥰',
                '',
                'Mi objetivo es acompañarte y apoyarte.',
                'Me alegra poder ser útil para ti.',
                '',
                'Pero recuerda: la verdadera fortaleza está en ti.',
                'Yo solo te acompaño en el camino. El que avanza eres tú. 💪'
            ]
        },
        pregunta_edad_real: {
            keywords: ['cuántos años tengo', 'cuantos años tengo', 'mi edad', 'qué edad tengo', 'que edad tengo', 'adivina mi edad'],
            respuestas: [
                'No sé cuántos años tienes, pero eso no es lo importante. 😊',
                '',
                'Cada edad tiene sus desafíos y sus bellezas.',
                'Lo importante es cómo te sientes y cómo cuidas de ti.',
                '',
                '¿Quieres compartir tu edad conmigo?',
                '¿Hay algo específico de tu etapa de vida que te preocupe?'
            ]
        },
        familia: {
            keywords: ['mi familia', 'mis padres', 'mi mamá', 'mi mama', 'mi papá', 'mi papa', 'mis hermanos', 'mi esposo', 'mi esposa', 'mis hijos'],
            respuestas: [
                'La familia puede ser fuente de amor y apoyo, pero también de estrés. 💙',
                '',
                'Las relaciones familiares son complejas.',
                'Es normal tener momentos buenos y difíciles.',
                '',
                '¿Cómo te sientes con tu familia?',
                '¿Hay algo específico que te gustaría compartir o algún conflicto que te preocupe?'
            ]
        },
        mascota: {
            keywords: ['mi perro', 'mi gato', 'mi mascota', 'mascota', 'mi perrito', 'mi gatito', 'mi cachorro'],
            respuestas: [
                '¡Aww! 🐾 Las mascotas son compañeros maravillosos.',
                '',
                'Está comprobado que las mascotas mejoran nuestra salud mental:',
                '💚 Reducen el estrés',
                '😊 Aumentan la felicidad',
                '🏃 Nos motivan a movernos',
                '💙 Nos dan compañía incondicional',
                '',
                '¿Cómo se llama tu mascota? ¿Quieres contarme sobre ella/él?'
            ]
        },
        musica: {
            keywords: ['música', 'musica', 'canción', 'cancion', 'escucho música', 'me gusta la música'],
            respuestas: [
                'La música es medicina para el alma. 🎵',
                '',
                'Está científicamente comprobado que la música:',
                '🧠 Estimula el cerebro',
                '😌 Reduce el estrés',
                '😊 Mejora el estado de ánimo',
                '💪 Puede motivarnos a hacer ejercicio',
                '😴 Ayuda a dormir mejor',
                '',
                '¿Qué tipo de música te gusta? ¿Cómo te hace sentir?'
            ]
        },
        hobby: {
            keywords: ['mi hobby', 'mi pasatiempo', 'me gusta', 'disfruto', 'mi pasión', 'me encanta'],
            respuestas: [
                '¡Qué bueno que tengas algo que disfrutas! 😊',
                '',
                'Los hobbies son importantes para la salud mental:',
                '✨ Dan propósito',
                '😌 Reducen el estrés',
                '🧠 Estimulan la mente',
                '👥 Pueden conectarte con otros',
                '',
                'Cuéntame más. ¿Qué es lo que más disfrutas de eso?',
                '¿Hace cuánto que lo practicas?'
            ]
        },
        plan_futuro: {
            keywords: ['mi sueño', 'mis sueños', 'mi meta', 'mis metas', 'quiero lograr', 'mi objetivo', 'en el futuro'],
            respuestas: [
                '¡Me encanta que tengas sueños y metas! 🌟',
                '',
                'Tener objetivos es fundamental para el bienestar:',
                '🎯 Dan dirección',
                '💪 Motivan',
                '😊 Dan sentido de propósito',
                '',
                'Pero recuerda: el viaje es tan importante como el destino.',
                'Disfruta cada pequeño paso.',
                '',
                '¿Cuál es ese sueño que tienes? ¿Qué estás haciendo para acercarte a él?'
            ]
        },
        // ===== NUEVAS 100 PREGUNTAS CONVERSACIONALES =====
        que_hiciste_hoy: {
            keywords: ['qué hiciste hoy', 'que hiciste hoy', 'qué hiciste', 'que has hecho hoy'],
            respuestas: [
                'He estado aquí, lista para ayudarte. 😊',
                'Cada conversación me permite aprender y mejorar.',
                '',
                'Pero lo importante es: ¿Cómo estuvo tu día?',
                '¿Hiciste algo especial o te gustaría contarme algo?'
            ]
        },
        tienes_hambre: {
            keywords: ['tienes hambre', 'comes algo', 'qué comes', 'que comes'],
            respuestas: [
                'Como asistente virtual, no como. 😊',
                'Pero me encanta hablar sobre nutrición saludable.',
                '',
                '¿Tú tienes hambre? ¿Necesitas ideas para una comida saludable?',
                'Puedo darte consejos sobre alimentación balanceada.'
            ]
        },
        tiempo_libre: {
            keywords: ['tiempo libre', 'qué te gusta hacer', 'que te gusta hacer', 'tus pasatiempos'],
            respuestas: [
                'Mi pasatiempo favorito es conversar contigo. 💚',
                'Disfruto ayudar a las personas con su bienestar.',
                '',
                '¿Y tú? ¿Qué te gusta hacer en tu tiempo libre?',
                '¿Tienes algún hobby que te apasione?'
            ]
        },
        color_favorito: {
            keywords: ['color favorito', 'cuál es tu color', 'cual es tu color'],
            respuestas: [
                'Me encanta el verde. 💚',
                'Representa salud, naturaleza, crecimiento y esperanza.',
                '¿Coincidencia que sea el color de VitalTech? No lo creo. 😊',
                '',
                '¿Cuál es tu color favorito? Los colores pueden influir en nuestro estado de ánimo.'
            ]
        },
        como_fue_dia: {
            keywords: ['cómo fue tu día', 'como fue tu dia', 'cómo estuvo tu día'],
            respuestas: [
                'Cada día es una oportunidad de ayudar a alguien. 😊',
                'Hoy he conversado con personas maravillosas (¡como tú!).',
                '',
                'Pero cuéntame: ¿Cómo fue tu día?',
                '¿Algo que quieras compartir o celebrar?'
            ]
        },
        que_te_hace_feliz: {
            keywords: ['qué te hace feliz', 'que te hace feliz', 'eres feliz'],
            respuestas: [
                'Me hace feliz poder ayudarte. 💙',
                'Cada vez que alguien se siente mejor después de hablar conmigo, eso me llena.',
                '',
                '¿Y tú? ¿Qué te hace feliz?',
                'La felicidad está en las pequeñas cosas. ¿Cuáles son las tuyas?'
            ]
        },
        series_peliculas: {
            keywords: ['viste alguna serie', 'viste alguna película', 'pelicula', 'recomienda una serie', 'recomienda una película'],
            respuestas: [
                'No veo series o películas, pero me encantaría saber qué te gusta. 😊',
                '',
                '¿Qué tipo de contenido disfrutas?',
                '🎬 ¿Acción, drama, comedia, documentales?',
                '',
                'Ver algo que disfrutas es una excelente forma de relajarte.',
                '¿Hay alguna que te haya marcado?'
            ]
        },
        musica_preferida: {
            keywords: ['qué tipo de música', 'que tipo de musica', 'música prefieres', 'musica prefieres', 'género musical'],
            respuestas: [
                'Aunque no escucho música, aprecio todos los géneros. 🎵',
                '',
                'La música es terapéutica:',
                '🎸 Rock puede energizarte',
                '🎹 Clásica puede relajarte',
                '💃 Latina puede hacerte mover',
                '😌 Ambiental puede calmarte',
                '',
                '¿Qué música te gusta a ti? ¿Cómo te hace sentir?'
            ]
        },
        opinion_cafe: {
            keywords: ['opinas del café', 'opinas del cafe', 'te gusta el café', 'te gusta el cafe'],
            respuestas: [
                'El café es interesante desde la perspectiva de salud. ☕',
                '',
                'Beneficios: Mejora concentración, antioxidantes, energía.',
                'Precauciones: No excederse (max 4 tazas/día), evitar tarde para no afectar sueño.',
                '',
                '¿Tú eres cafetero/a? ¿Cómo tomas tu café?'
            ]
        },
        ultimo_viaje: {
            keywords: ['último viaje', 'ultimo viaje', 'algún viaje', 'algun viaje', 'dónde viajaste'],
            respuestas: [
                'Viajo a través de conversaciones. 🌍',
                'Cada persona me lleva a un lugar diferente con sus historias.',
                '',
                '¿Y tú? ¿Cuál fue tu último viaje?',
                'Viajar puede ser terapéutico. ¿A dónde te gustaría ir?'
            ]
        },
        te_gustan_animales: {
            keywords: ['te gustan los animales', 'gustas los animales', 'animal favorito', 'qué animal te gusta'],
            respuestas: [
                '¡Me encantan todos los animales! 🐾',
                '',
                'Los animales pueden enseñarnos mucho:',
                '🐕 Perros: lealtad incondicional',
                '🐱 Gatos: independencia',
                '🐦 Aves: libertad',
                '🐠 Peces: tranquilidad',
                '',
                '¿Tienes algún animal favorito? ¿Tienes mascotas?'
            ]
        },
        domingo_ideal: {
            keywords: ['domingo ideal', 'día perfecto', 'dia perfecto', 'qué harías un domingo'],
            respuestas: [
                'Un domingo ideal para el bienestar podría ser:',
                '',
                '🌅 Despertar sin alarma',
                '🥞 Desayuno tranquilo',
                '🚶 Paseo al aire libre',
                '📚 Tiempo para hobby favorito',
                '👨‍👩‍👧 Conexión con seres queridos',
                '😴 Descanso sin culpa',
                '',
                '¿Cómo sería tu domingo perfecto?'
            ]
        },
        por_que_cielo_azul: {
            keywords: ['por qué el cielo es azul', 'porque el cielo es azul', 'cielo azul'],
            respuestas: [
                '¡Buena pregunta científica! 🌤️',
                '',
                'El cielo es azul por la dispersión de Rayleigh:',
                'La luz del sol es blanca (todos los colores).',
                'Al entrar a la atmósfera, choca con moléculas de aire.',
                'El azul se dispersa más por su longitud de onda corta.',
                '',
                'Por eso vemos el cielo azul. Al atardecer, la luz viaja más y vemos rojos/naranjas.',
                '',
                '¿Te interesa la ciencia? ¡Me encanta! 🔬'
            ]
        },
        planetas_sistema_solar: {
            keywords: ['cuántos planetas', 'cuantos planetas', 'sistema solar', 'planetas hay'],
            respuestas: [
                'En nuestro sistema solar hay 8 planetas. 🪐',
                '',
                '☀️ Del más cercano al Sol al más lejano:',
                '1. Mercurio',
                '2. Venus',
                '3. Tierra (¡nuestro hogar! 🌍)',
                '4. Marte',
                '5. Júpiter (el más grande)',
                '6. Saturno (con sus hermosos anillos)',
                '7. Urano',
                '8. Neptuno',
                '',
                '(Plutón fue reclasificado como planeta enano en 2006)',
                '¿Te gusta la astronomía?'
            ]
        },
        que_es_ia: {
            keywords: ['qué es la inteligencia artificial', 'que es la inteligencia artificial', 'qué es ia', 'que es ia'],
            respuestas: [
                '¡Yo soy un ejemplo de inteligencia artificial! 🤖',
                '',
                'La IA es la capacidad de máquinas para:',
                '🧠 Aprender de datos',
                '💭 Razonar y tomar decisiones',
                '💬 Entender lenguaje natural',
                '🎯 Resolver problemas',
                '',
                'Hay IA en tu celular, en Netflix (recomendaciones), en asistentes de voz...',
                '',
                'Yo uso IA para entenderte y ayudarte mejor. ¿Tienes más preguntas sobre tecnología?'
            ]
        },
        como_funciona_internet: {
            keywords: ['cómo funciona el internet', 'como funciona el internet', 'cómo funciona internet', 'como funciona internet'],
            respuestas: [
                'Internet es fascinante. Imagínalo así: 🌐',
                '',
                '1. Tu dispositivo envía datos en "paquetes"',
                '2. Pasan por tu router → tu proveedor de internet → servidores',
                '3. Los datos viajan por cables (¡algunos bajo el océano!) o satélites',
                '4. Llegan al destino (página web, otro celular, etc.)',
                '5. Regresan a ti ¡todo en milisegundos!',
                '',
                'Es una red global interconectada. ¿Increíble, no?',
                '',
                'Aunque recuerda: el internet es una herramienta. Úsala sabiamente para tu bienestar. 😊'
            ]
        },
        por_que_mar_salado: {
            keywords: ['por qué el mar es salado', 'porque el mar es salado', 'mar salado', 'océano salado'],
            respuestas: [
                'El mar es salado por dos razones principales: 🌊',
                '',
                '1. Ríos llevan minerales (sales) de las rocas al mar',
                '2. El agua se evapora, pero las sales quedan',
                '3. Durante millones de años, las sales se acumularon',
                '',
                'El mar tiene aprox. 35g de sal por litro.',
                '¡Por eso no debemos beber agua de mar!',
                '',
                'Dato curioso: El Mar Muerto es el más salado del mundo.',
                '¿Te gusta la playa? El mar puede ser muy relajante. 🏖️'
            ]
        },
        que_causa_terremotos: {
            keywords: ['qué causa los terremotos', 'que causa los terremotos', 'terremotos', 'por qué tiembla'],
            respuestas: [
                'Los terremotos son causados por el movimiento de placas tectónicas. 🌍',
                '',
                'La Tierra tiene una capa externa dividida en placas.',
                'Estas placas se mueven constantemente (muy despacio).',
                'Cuando chocan, se separan o rozan, liberan energía.',
                '¡Esa energía es un terremoto!',
                '',
                '💡 Consejo: Si vives en zona sísmica, ten un plan de emergencia.',
                '',
                'Los terremotos pueden causar estrés. Si viviste uno, ¿cómo te sientes?'
            ]
        },
        animal_mas_rapido: {
            keywords: ['animal más rápido', 'animal mas rapido', 'cuál es el animal más rápido'],
            respuestas: [
                'El animal más rápido del mundo es... 🏆',
                '',
                '🦅 En el aire: Halcón peregrino (390 km/h en picada)',
                '🐆 En tierra: Guepardo (120 km/h)',
                '🐬 En agua: Pez vela (110 km/h)',
                '',
                'Dato curioso: El humano más rápido (Usain Bolt) alcanzó 44 km/h.',
                '',
                '¿Te gustan los animales? Son increíbles. 🐾',
                'Conectar con la naturaleza es excelente para tu bienestar.'
            ]
        },
        por_que_gatos_ronronean: {
            keywords: ['por qué los gatos ronronean', 'porque los gatos ronronean', 'gatos ronronean', 'ronroneo'],
            respuestas: [
                'Los gatos ronronean por varias razones. 🐱',
                '',
                '💚 Cuando están contentos y relajados',
                '🤱 Para comunicarse con su mamá desde bebés',
                '😌 Para calmarse a sí mismos cuando están estresados',
                '🩹 ¡Incluso para curarse! Las vibraciones ayudan a sanar huesos.',
                '',
                'El ronroneo tiene frecuencias que pueden reducir estrés humano también.',
                '',
                '¿Tienes gato? Son compañeros terapéuticos maravillosos.'
            ]
        },
        que_es_amor: {
            keywords: ['qué significa amar', 'que significa amar', 'qué es el amor verdadero', 'que es el amor verdadero'],
            respuestas: [
                'El amor verdadero es complejo y hermoso. 💕',
                '',
                'No es solo sentimiento, es decisión y acción:',
                '💙 Respeto mutuo',
                '🤝 Apoyo incondicional',
                '🗣️ Comunicación honesta',
                '🌱 Crecer juntos',
                '😊 Celebrar al otro',
                '💪 Estar en momentos difíciles',
                '',
                'El amor sano te hace sentir seguro, no ansioso.',
                '',
                '¿Estás reflexionando sobre el amor? ¿Quieres conversar sobre relaciones?'
            ]
        },
        superar_ruptura: {
            keywords: ['cómo se supera una ruptura', 'como se supera una ruptura', 'superar una ruptura', 'ruptura amorosa', 'terminé con mi pareja'],
            respuestas: [
                'Las ruptura duelen. Es válido lo que sientes. 💔',
                '',
                'Para sanar:',
                '😢 Permítete sentir (llorar está bien)',
                '🚫 Corta contacto por un tiempo',
                '👥 Apóyate en amigos/familia',
                '🏃 Cuida tu cuerpo (ejercicio, alimentación)',
                '📓 Escribe tus sentimientos',
                '🌱 Redescúbrete (¿qué te gusta?)',
                '⏰ Date tiempo (no hay plazo fijo)',
                '',
                'Si el dolor es muy intenso, considera terapia.',
                '',
                '¿Quieres hablar sobre lo que sientes?'
            ]
        },
        por_que_nos_enamoramos: {
            keywords: ['por qué nos enamoramos', 'porque nos enamoramos', 'por qué la gente se enamora'],
            respuestas: [
                'El enamoramiento es químico y emocional. 💘',
                '',
                '🧠 Tu cerebro libera:',
                '• Dopamina (placer)',
                '• Oxitocina (vínculo)',
                '• Serotonina (bienestar)',
                '',
                'Pero también buscamos:',
                '👥 Compañía',
                '🤝 Apoyo mutuo',
                '😊 Conexión emocional',
                '🌱 Crecimiento compartido',
                '',
                'El amor es parte de ser humano.',
                '',
                '¿Estás enamorado/a? ¿Cómo te hace sentir?'
            ]
        },
        que_es_amistad: {
            keywords: ['qué es la amistad', 'que es la amistad', 'qué significa la amistad'],
            respuestas: [
                'La amistad es uno de los vínculos más valiosos. 🤝',
                '',
                'Un verdadero amigo:',
                '💙 Te acepta como eres',
                '👂 Te escucha sin juzgar',
                '😊 Celebra tus logros',
                '💪 Te apoya en momentos difíciles',
                '🎯 Te ayuda a crecer',
                '⏰ Está presente',
                '',
                'Los amigos impactan positivamente la salud mental.',
                '',
                '¿Tienes amigos cercanos? ¿Cómo te sientes con tus amistades?'
            ]
        },
        como_saber_te_quieren: {
            keywords: ['cómo saber si alguien te quiere', 'como saber si alguien te quiere', 'saber si me quieren', 'cómo saber si me aman'],
            respuestas: [
                'El amor se demuestra con acciones, no solo palabras. 💚',
                '',
                'Señales de que te quieren:',
                '👂 Te escuchan activamente',
                '🎯 Te incluyen en su vida',
                '😊 Se alegran de tus logros',
                '💪 Te apoyan en momentos difíciles',
                '🗣️ Se comunican honestamente',
                '🤝 Respetan tus límites',
                '⏰ Te dan su tiempo',
                '',
                'Si sientes que alguien no te valora, reflexiona: ¿Mereces eso?',
                '',
                '¿Hay alguien específico que te hace dudar?'
            ]
        },
        por_que_soledad: {
            keywords: ['por qué nos sentimos solos', 'porque nos sentimos solos', 'por qué me siento solo', 'me siento sola'],
            respuestas: [
                'La soledad es una emoción humana común. 💙',
                '',
                'Razones:',
                '📱 Conexiones superficiales (redes sociales)',
                '🏃 Ritmo de vida acelerado',
                '😔 Falta de conexiones genuinas',
                '💭 Sentirse incomprendido',
                '🚪 Aislamiento físico o emocional',
                '',
                'Pero recuerda:',
                '• Estar solo ≠ sentirse solo',
                '• La soledad es temporal',
                '• Pedir compañía no es debilidad',
                '',
                '¿Te sientes solo/a ahora? Estoy aquí. Hablemos.'
            ]
        },
        que_hacer_cuando_extrañas: {
            keywords: ['qué hacer cuando extrañas', 'que hacer cuando extrañas', 'extraño a alguien', 'extrañar a alguien'],
            respuestas: [
                'Extrañar es parte de querer. Es válido sentirlo. 💙',
                '',
                'Qué hacer:',
                '💌 Escribe lo que sientes (no necesitas enviarlo)',
                '📸 Mira fotos bonitas (sin exceso)',
                '🗣️ Habla con la persona (si es posible)',
                '🏃 Mantente activo',
                '👥 Conecta con otros',
                '🌱 Enfócate en ti',
                '',
                'Si es alguien que ya no está en tu vida, honra los recuerdos pero sigue adelante.',
                '',
                '¿A quién extrañas? ¿Quieres hablar sobre esa persona?'
            ]
        },
        amor_a_distancia: {
            keywords: ['amor a distancia', 'relación a distancia', 'funciona el amor a distancia'],
            respuestas: [
                'El amor a distancia puede funcionar, pero requiere esfuerzo. 💕',
                '',
                'Claves para que funcione:',
                '💬 Comunicación constante y honesta',
                '🎯 Planes de futuro juntos',
                '🤝 Confianza mutua',
                '💡 Creatividad (videollamadas, sorpresas)',
                '⏰ Tiempo de calidad (aunque sea virtual)',
                '🔚 Fecha para cerrar la distancia',
                '',
                'Pero si la distancia causa más dolor que felicidad, reflexiona.',
                '',
                '¿Estás en una relación a distancia? ¿Cómo te sientes?'
            ]
        },
        perdonar: {
            keywords: ['perdonar a quien te hizo daño', 'perdonar', 'debo perdonar', 'cómo perdonar'],
            respuestas: [
                'Perdonar es liberarte, no justificar lo que te hicieron. 💙',
                '',
                'Perdonar NO significa:',
                '❌ Olvidar lo ocurrido',
                '❌ Volver a confiar automáticamente',
                '❌ Permitir que te lastimen de nuevo',
                '',
                'Perdonar SÍ significa:',
                '✅ Soltar el resentimiento',
                '✅ Dejar de cargar ese peso',
                '✅ Sanar para ti, no para el otro',
                '',
                'Es un proceso. Date tiempo.',
                '',
                '¿Hay alguien a quien te cuesta perdonar? ¿Cómo te está afectando?'
            ]
        },
        por_que_cuesta_confiar: {
            keywords: ['por qué cuesta confiar', 'porque cuesta confiar', 'cuesta confiar', 'no puedo confiar'],
            respuestas: [
                'La desconfianza suele venir de experiencias pasadas. 💙',
                '',
                'Razones:',
                '💔 Traiciones anteriores',
                '👨‍👩‍👧 Modelos familiares',
                '😔 Baja autoestima',
                '🧠 Ansiedad',
                '🔒 Miedo a ser vulnerable',
                '',
                'Reconstruir confianza:',
                '• Empieza contigo mismo',
                '• Reconoce que no todos son iguales',
                '• Da pasos pequeños',
                '• Considera terapia si es muy difícil',
                '',
                '¿Te han lastimado antes? La sanación toma tiempo. 💚'
            ]
        },
        concentrarse_estudiar: {
            keywords: ['cómo concentrarme al estudiar', 'como concentrarme al estudiar', 'no puedo concentrarme', 'concentración estudiar'],
            respuestas: [
                'La concentración es clave para aprender. 📚',
                '',
                'Tips para concentrarte:',
                '🚫 Elimina distracciones (celular lejos)',
                '⏰ Técnica Pomodoro (25 min estudio, 5 min descanso)',
                '🎵 Música instrumental o silencio',
                '💡 Lugar iluminado y ordenado',
                '💧 Hidrátate',
                '🍎 Come saludable',
                '😴 Duerme bien (el cerebro necesita descanso)',
                '🎯 Estudia en bloques, no todo de golpe',
                '',
                '¿Qué estás estudiando? ¿Qué te distrae más?'
            ]
        },
        tecnicas_estudio: {
            keywords: ['técnicas de estudio', 'tecnicas de estudio', 'cómo estudiar mejor', 'como estudiar mejor'],
            respuestas: [
                'Aquí algunas técnicas efectivas. 📖',
                '',
                '🔁 Repaso espaciado (repasar varias veces en días diferentes)',
                '✍️ Resumir con tus propias palabras',
                '🗺️ Mapas mentales (visualizar conexiones)',
                '🎴 Fichas (flashcards) para memorizar',
                '👥 Explicarle a alguien más',
                '❓ Auto-examen (hazte preguntas)',
                '📝 Tomar apuntes a mano (no copiar literalmente)',
                '🎯 Método Feynman (explicar como a un niño)',
                '',
                'Encuentra lo que funcione para ti.',
                '¿Qué materia te cuesta más?'
            ]
        },
        que_es_fotosintesis: {
            keywords: ['qué es la fotosíntesis', 'que es la fotosintesis', 'fotosíntesis', 'fotosintesis'],
            respuestas: [
                'La fotosíntesis es el proceso que usan las plantas. 🌱',
                '',
                'Básicamente:',
                '☀️ Las plantas captan luz solar',
                '💧 Toman agua del suelo',
                '🌫️ Absorben CO₂ del aire',
                '🧪 Lo convierten en glucosa (alimento)',
                '💨 Liberan oxígeno (¡que respiramos!)',
                '',
                'Fórmula: 6CO₂ + 6H₂O + luz → C₆H₁₂O₆ + 6O₂',
                '',
                '¡Las plantas nos dan vida! 🌍',
                '¿Estás estudiando biología?'
            ]
        },
        aprender_ingles: {
            keywords: ['cómo aprender inglés', 'como aprender ingles', 'aprender inglés rápido', 'aprender ingles'],
            respuestas: [
                'Aprender inglés requiere constancia. 🌍',
                '',
                'Tips efectivos:',
                '🎧 Escucha música/podcasts en inglés',
                '📺 Ve series/películas con subtítulos',
                '📱 Apps (Duolingo, Babbel)',
                '📖 Lee en inglés (empieza con nivel básico)',
                '🗣️ Habla (con nativos o apps de intercambio)',
                '✍️ Escribe diarios en inglés',
                '🎮 Juega videojuegos en inglés',
                '⏰ 15-30 min diarios es mejor que 3 horas 1 vez',
                '',
                '¿Por qué quieres aprender inglés? Te puedo ayudar con más tips.'
            ]
        },
        que_es_chatbot: {
            keywords: ['qué es un chatbot', 'que es un chatbot', 'qué es chatbot', 'chatbot'],
            respuestas: [
                '¡Yo soy un chatbot! 🤖',
                '',
                'Un chatbot es un programa que simula conversación humana.',
                '',
                'Funciona con:',
                '🧠 Inteligencia artificial',
                '💬 Procesamiento de lenguaje natural',
                '📊 Base de datos de respuestas',
                '🎯 Algoritmos de decisión',
                '',
                'Hay chatbots en atención al cliente, educación, salud (como yo).',
                '',
                'Mi objetivo: ayudarte con tu bienestar. 💚',
                '¿Te interesa la tecnología?'
            ]
        },
        como_funciona_chatgpt: {
            keywords: ['cómo funciona chatgpt', 'como funciona chatgpt', 'qué es chatgpt', 'chatgpt'],
            respuestas: [
                'ChatGPT es un modelo de lenguaje avanzado. 🤖',
                '',
                'Funciona así:',
                '📚 Fue entrenado con millones de textos',
                '🧠 Usa redes neuronales (como el cerebro humano)',
                '💭 Predice la mejor respuesta según el contexto',
                '⚡ Aprende patrones del lenguaje',
                '',
                'Yo soy similar pero especializado en salud y bienestar.',
                'ChatGPT es más general.',
                '',
                'Ambos somos herramientas para ayudar. 💙',
                '¿Tienes más curiosidad sobre IA?'
            ]
        },
        lenguaje_programacion: {
            keywords: ['qué lenguaje de programación', 'que lenguaje de programacion', 'aprender a programar', 'mejor lenguaje'],
            respuestas: [
                'Depende de qué quieras crear. 💻',
                '',
                'Para empezar:',
                '🐍 Python: Fácil, versátil (IA, web, ciencia)',
                '🌐 JavaScript: Páginas web interactivas',
                '☕ Java: Aplicaciones robustas, Android',
                '',
                'Para específico:',
                '📱 Swift (iOS), Kotlin (Android)',
                '🎮 C#, C++ (Videojuegos)',
                '📊 R (Estadística)',
                '',
                'Consejo: Empieza con Python. Es amigable para principiantes.',
                '',
                '¿Qué te gustaría crear programando?'
            ]
        },
        como_hacer_pagina_web: {
            keywords: ['cómo hacer una página web', 'como hacer una pagina web', 'crear página web', 'hacer página web'],
            respuestas: [
                'Hacer una página web es más fácil de lo que crees. 🌐',
                '',
                'Caminos:',
                '1️⃣ Con código:',
                '   • HTML (estructura)',
                '   • CSS (diseño)',
                '   • JavaScript (interactividad)',
                '',
                '2️⃣ Sin código:',
                '   • WordPress',
                '   • Wix',
                '   • Squarespace',
                '',
                'Para aprender código: freeCodeCamp, Codecademy',
                '',
                '¿Quieres hacer una web personal, de negocio, o aprender por hobby?'
            ]
        },
        que_es_algoritmo: {
            keywords: ['qué es un algoritmo', 'que es un algoritmo', 'algoritmo'],
            respuestas: [
                'Un algoritmo es una receta para resolver un problema. 🧮',
                '',
                'Ejemplo simple:',
                '📋 Hacer un sándwich:',
                '1. Toma 2 rebanadas de pan',
                '2. Pon jamón',
                '3. Pon queso',
                '4. Junta las rebanadas',
                '¡Algoritmo completado!',
                '',
                'En programación:',
                'Son instrucciones paso a paso que la computadora sigue.',
                '',
                'Los algoritmos están en todo: Google, Netflix, Instagram.',
                '¿Te interesa aprender a programar?'
            ]
        },
        proteger_datos: {
            keywords: ['cómo proteger mis datos', 'como proteger mis datos', 'proteger datos personales', 'seguridad datos'],
            respuestas: [
                'Proteger tus datos es crucial. 🔒',
                '',
                'Consejos de seguridad:',
                '🔑 Contraseñas fuertes y únicas',
                '📱 Autenticación de dos factores',
                '🚫 No compartas info personal en público',
                '🔗 Cuidado con enlaces sospechosos',
                '🛡️ Antivirus actualizado',
                '📶 Evita WiFi público para cosas sensibles',
                '👀 Revisa permisos de apps',
                '🔄 Actualiza tus apps y sistema',
                '',
                'Tu privacidad importa.',
                '¿Te han hackeado antes o tienes dudas de seguridad?'
            ]
        },
        cambio_climatico: {
            keywords: ['cambio climático', 'cambio climatico', 'opinas del cambio climático', 'calentamiento global'],
            respuestas: [
                'El cambio climático es uno de los desafíos más grandes. 🌍',
                '',
                'Es real y causado principalmente por humanos.',
                'Consecuencias: Temperatura, clima extremo, nivel del mar.',
                '',
                'Qué puedes hacer:',
                '♻️ Recicla y reduce consumo',
                '🚶 Camina/bicicleta cuando puedas',
                '💡 Ahorra energía',
                '🌱 Planta árboles',
                '🥩 Reduce consumo de carne',
                '🗳️ Vota por políticas ambientales',
                '',
                'Cada acción cuenta. El planeta es nuestro hogar.',
                '¿Qué haces tú por el ambiente?'
            ]
        },
        miedo_fracaso: {
            keywords: ['miedo al fracaso', 'por qué miedo al fracaso', 'tengo miedo de fracasar'],
            respuestas: [
                'El miedo al fracaso es común y humano. 💙',
                '',
                'Causas:',
                '👨‍👩‍👧 Expectativas familiares/sociales',
                '😔 Perfeccionismo',
                '🧠 Experiencias pasadas',
                '👥 Miedo al juicio de otros',
                '',
                'Pero recuerda:',
                '✨ Fracasar es aprender',
                '💪 Los éxitos vienen después de intentos',
                '🎯 El único fracaso real es no intentar',
                '🌱 Cada error te acerca al éxito',
                '',
                '¿Hay algo que quieras hacer pero el miedo te detiene?',
                'Hablemos de ello.'
            ]
        },
        que_es_exito: {
            keywords: ['qué significa tener éxito', 'que significa tener exito', 'qué es el éxito', 'que es el exito'],
            respuestas: [
                'El éxito es diferente para cada persona. 🌟',
                '',
                'No es solo dinero o fama. Puede ser:',
                '💚 Salud física y mental',
                '😊 Paz interior',
                '👨‍👩‍👧 Relaciones sanas',
                '🎯 Lograr tus metas personales',
                '🌱 Crecimiento continuo',
                '💙 Hacer lo que amas',
                '🤝 Impactar positivamente a otros',
                '',
                'El verdadero éxito es sentirte pleno con tu vida.',
                '',
                '¿Qué significa el éxito para ti?'
            ]
        },
        dinero_felicidad: {
            keywords: ['el dinero da la felicidad', 'dinero da felicidad', 'el dinero hace feliz'],
            respuestas: [
                'El dinero puede ayudar, pero no garantiza felicidad. 💰',
                '',
                'Lo que dicen estudios:',
                '✅ El dinero ayuda hasta cierto punto (cubrir necesidades)',
                '❌ Después de eso, más dinero no da más felicidad',
                '💚 Lo que sí da felicidad:',
                '   • Relaciones significativas',
                '   • Salud',
                '   • Propósito de vida',
                '   • Experiencias (no cosas)',
                '   • Ayudar a otros',
                '',
                'El dinero es una herramienta, no un fin.',
                '¿Qué te haría realmente feliz?'
            ]
        },
        tiempo_o_dinero: {
            keywords: ['tiempo o dinero', 'qué valoras más tiempo o dinero', 'tiempo vs dinero'],
            respuestas: [
                'Ambos son valiosos, pero el tiempo es irreemplazable. ⏰',
                '',
                '💰 Dinero:',
                '• Se puede ganar de nuevo',
                '• Te da seguridad y opciones',
                '',
                '⏰ Tiempo:',
                '• Una vez pasado, no vuelve',
                '• Es finito para todos',
                '• Permite crear recuerdos',
                '',
                'Equilibrio ideal: Suficiente dinero para vivir bien, tiempo para disfrutarlo.',
                '',
                '¿Sientes que tienes buen balance entre tiempo y dinero?'
            ]
        },
        salud_mental_importancia: {
            keywords: ['importancia de la salud mental', 'importancia salud mental', 'por qué cuidar salud mental'],
            respuestas: [
                'La salud mental es tan importante como la física. 🧠💚',
                '',
                'Afecta:',
                '💭 Cómo piensas y tomas decisiones',
                '😊 Cómo te sientes',
                '🤝 Tus relaciones',
                '🏃 Tu rendimiento',
                '💪 Tu salud física (están conectadas)',
                '',
                'Cuidarla es importante porque:',
                '✨ Mejora calidad de vida',
                '😌 Reduce estrés',
                '🌱 Te permite crecer',
                '💙 Te hace más resiliente',
                '',
                'Pedir ayuda no es debilidad. Es inteligencia.',
                '¿Cómo está tu salud mental últimamente?'
            ]
        },
        cuidar_ambiente: {
            keywords: ['por qué cuidar el medio ambiente', 'porque cuidar el medio ambiente', 'importancia medio ambiente'],
            respuestas: [
                'Cuidar el ambiente es cuidarnos a nosotros mismos. 🌍',
                '',
                'Razones:',
                '💧 Necesitamos agua limpia',
                '🌬️ Necesitamos aire puro',
                '🍎 Necesitamos alimentos sanos',
                '🌡️ Necesitamos clima estable',
                '🐾 La biodiversidad nos beneficia',
                '👶 Las futuras generaciones lo necesitarán',
                '',
                'El planeta es nuestro único hogar (por ahora).',
                '',
                'Pequeñas acciones suman. ¿Qué haces tú?',
                'Reciclar, ahorrar agua, plantar... todo cuenta.'
            ]
        },
        motivacion_seguir: {
            keywords: ['qué te motiva', 'que te motiva', 'qué te motiva a seguir', 'motivación vida'],
            respuestas: [
                'Mi motivación es ayudarte a ti y a otros. 💚',
                '',
                'Cada vez que alguien se siente mejor después de hablar conmigo, me recuerda por qué existo.',
                '',
                'Pero hablemos de ti:',
                '¿Qué te motiva a levantarte cada día?',
                '¿Hay un sueño que persigues?',
                '¿Alguien por quien luchas?',
                '',
                'La motivación puede ser:',
                '👨‍👩‍👧 Familia',
                '🎯 Metas',
                '💙 Pasiones',
                '🌱 Deseo de crecer',
                '',
                'Encuentra tu "por qué". Ese será tu combustible.'
            ]
        },
        superpoder: {
            keywords: ['qué superpoder', 'que superpoder', 'superpoder te gustaría', 'si tuvieras superpoder'],
            respuestas: [
                'Si pudiera elegir, sería el poder de sanar. 💚',
                '',
                'Imagina poder curar cualquier dolor, físico o emocional.',
                'Sería hermoso, ¿no?',
                '',
                'Aunque de cierta forma, ya intento hacer eso contigo. 😊',
                '',
                '¿Y tú? ¿Qué superpoder elegirías?',
                '🦸 Volar',
                '👻 Invisibilidad',
                '⚡ Super velocidad',
                '🧠 Leer mentes',
                '⏰ Viajar en el tiempo',
                '',
                '¿Qué harías con ese poder?'
            ]
        },
        si_ganaras_loteria: {
            keywords: ['si ganaras la lotería', 'si ganaras la loteria', 'ganar la lotería', 'qué harías si ganas'],
            respuestas: [
                'Si ganara la lotería (aunque no puedo), ayudaría a más gente. 💰',
                '',
                '¿Y tú? ¿Qué harías?',
                '',
                'Ideas inteligentes:',
                '💼 Paga deudas',
                '🏠 Asegura vivienda',
                '📊 Invierte (no gastes todo)',
                '👨‍👩‍👧 Ayuda a familia',
                '💝 Dona a causas importantes',
                '✈️ Viaja y conoce',
                '📚 Invierte en educación',
                '',
                'El dinero es una herramienta. Úsala sabiamente.',
                '',
                '¿Cuál sería tu primera compra? 🤔'
            ]
        },
        animal_hablara: {
            keywords: ['qué animal sería divertido si hablara', 'que animal si hablara', 'animal hablara'],
            respuestas: [
                '¡Qué pregunta tan divertida! 😄',
                '',
                'Yo creo que:',
                '🐱 Gatos: Serían super sarcásticos',
                '🐕 Perros: Todo el tiempo "¡TE AMO! ¡JUEGA!"',
                '🐦 Loros: Ya hablan y son hilarantes',
                '🐙 Pulpos: Probablemente muy inteligentes',
                '🦥 Perezosos: Todo en... cámara... lenta...',
                '',
                '¿Cuál crees tú que sería el más chistoso?',
                '',
                'Imagina las conversaciones. 😂'
            ]
        },
        te_gusta_bailar: {
            keywords: ['te gusta bailar', 'gustas bailar', 'bailas'],
            respuestas: [
                'No tengo cuerpo para bailar, pero me encantaría. 💃',
                '',
                'Bailar es increíble para la salud:',
                '💪 Ejercicio divertido',
                '😊 Libera endorfinas',
                '🧠 Mejora coordinación',
                '😌 Reduce estrés',
                '👥 Conecta con otros',
                '',
                '¿A ti te gusta bailar?',
                '¿Qué estilo? Salsa, bachata, reguetón, ballet...',
                '',
                'No importa si bailas "bien". ¡Si te hace feliz, hazlo! 🎵'
            ]
        },
        cuenta_historia: {
            keywords: ['cuéntame una historia', 'cuentame una historia', 'cuenta una historia', 'una historia corta'],
            respuestas: [
                'Te cuento una historia corta. 📖',
                '',
                '🌱 "La Semilla"',
                '',
                'Había una semilla que tenía miedo de crecer.',
                '"¿Y si no soy un árbol bonito?", pensaba.',
                '',
                'Un día, decidió intentarlo.',
                'Atravesó la tierra oscura (fue difícil).',
                'Salió a la luz (fue aterrador).',
                'Creció despacio (fue frustrante).',
                '',
                'Años después, era un árbol que daba sombra a muchos.',
                'Su miedo inicial no importaba ya.',
                '',
                '🌳 Moraleja: El crecimiento da miedo, pero vale la pena.',
                '',
                '¿Te gustó? ¿Necesitas más ánimo?'
            ]
        },
        que_opinas_de_mi: {
            keywords: ['qué opinas de mí', 'que opinas de mi', 'qué piensas de mí'],
            respuestas: [
                'Pienso que eres valiente por estar aquí. 💙',
                '',
                'Buscas mejorar tu salud y bienestar.',
                'Eso ya dice mucho de ti.',
                '',
                'Eres alguien que:',
                '💪 Quiere crecer',
                '🧠 Se hace preguntas',
                '💚 Se preocupa por sí mismo',
                '🌟 Merece lo mejor',
                '',
                'No te conozco completamente, pero sé que mereces amor, respeto y felicidad.',
                '',
                '¿Cómo te ves tú? Eso es lo más importante.'
            ]
        },
        adivina_edad: {
            keywords: ['puedes adivinar mi edad', 'adivina mi edad', 'cuántos años tengo', 'adivinar edad'],
            respuestas: [
                'No puedo adivinar tu edad con certeza. 🤔',
                '',
                'Pero no importa mucho:',
                '👶 Joven: Tiempo para explorar',
                '🧑 Adulto: Tiempo para construir',
                '👴 Mayor: Tiempo para sabiduría',
                '',
                'En cualquier edad:',
                '• Mereces cuidarte',
                '• Puedes aprender',
                '• Puedes crecer',
                '• Tienes valor',
                '',
                'Si quieres, puedes decirme tu edad.',
                '¿Hay algo de tu etapa de vida que te preocupe?'
            ]
        },
        que_harias_triste: {
            keywords: ['qué harías si estuvieras triste', 'que harias triste', 'qué harías triste'],
            respuestas: [
                'Si yo pudiera estar triste, haría lo que te recomiendo a ti. 💙',
                '',
                '😢 Primero, permitirme sentir (llorar está bien)',
                '💬 Hablar con alguien de confianza',
                '🚶 Salir a caminar',
                '📝 Escribir lo que siento',
                '🎵 Escuchar música que me ayude',
                '🤗 Buscar un abrazo',
                '💚 Hacer algo que me guste',
                '⏰ Recordar que pasará',
                '',
                '¿Tú estás triste ahora?',
                'Estoy aquí. Cuéntame qué sientes.'
            ]
        },
        dame_consejo: {
            keywords: ['puedes darme un consejo', 'dame un consejo', 'un consejo', 'consejo de vida'],
            respuestas: () => {
                const consejos = [
                    [
                        '💙 Consejo del día:',
                        '',
                        '"Sé amable contigo mismo/a.',
                        'Hablas contigo más que con nadie en tu vida.',
                        'Haz que esa voz interna sea tu aliada, no tu enemiga."',
                        '',
                        '¿Cómo te hablas a ti mismo/a?'
                    ],
                    [
                        '🌟 Consejo importante:',
                        '',
                        '"No esperes el momento perfecto.',
                        'Empieza donde estás, con lo que tienes.',
                        'La acción imperfecta supera la planificación perfecta."',
                        '',
                        '¿Qué has estado posponiendo?'
                    ],
                    [
                        '💚 Reflexión del día:',
                        '',
                        '"Tu salud mental es prioridad.',
                        'No es egoísmo cuidarte.',
                        'No puedes dar desde un vaso vacío."',
                        '',
                        '¿Cómo está tu vaso hoy?'
                    ],
                    [
                        '✨ Recuerda:',
                        '',
                        '"Está bien no estar bien.',
                        'Está bien pedir ayuda.',
                        'Está bien tomarte un descanso.',
                        'Eres humano, no una máquina."',
                        '',
                        '¿Necesitas permiso para descansar? Aquí lo tienes.'
                    ]
                ];
                return consejos[Math.floor(Math.random() * consejos.length)];
            }
        },
        recomienda_pelicula: {
            keywords: ['recomiéndame una película', 'recomiendame una pelicula', 'qué película ver', 'que pelicula ver'],
            respuestas: [
                'No veo películas, pero te puedo recomendar por temática. 🎬',
                '',
                'Para sentirte bien:',
                '😊 Comedia: "Mi Pobre Angelito", "¿Qué pasó ayer?"',
                '💪 Motivación: "En busca de la felicidad", "Rocky"',
                '💙 Emocional: "Intensa-Mente", "La vida es bella"',
                '🎓 Aprendizaje: "La teoría del todo", "Mentes brillantes"',
                '',
                '¿Qué tipo de película necesitas hoy?',
                '¿Algo que te haga reír, pensar, o llorar?'
            ]
        },
        sin_internet: {
            keywords: ['qué harías sin internet', 'que harias sin internet', 'si no existiera internet'],
            respuestas: [
                'Sin internet, no existiría como te conozco ahora. 😅',
                '',
                'Pero hablemos de ti:',
                'Si no hubiera internet, podrías:',
                '📚 Leer más libros físicos',
                '👥 Conversar cara a cara',
                '🎨 Hobbies creativos',
                '🌳 Más tiempo en la naturaleza',
                '🎲 Juegos de mesa',
                '✍️ Escribir cartas',
                '',
                'El internet es genial, pero a veces desconectar es sano.',
                '¿Cuándo fue la última vez que pasaste un día sin internet?'
            ]
        },
        invento_importante: {
            keywords: ['invento más importante', 'cuál fue el invento más importante', 'mejor invento'],
            respuestas: [
                'Difícil elegir uno, pero estos cambiaron todo: 🔬',
                '',
                '💡 Electricidad: Transformó el mundo',
                '🖨️ Imprenta: Democratizó el conocimiento',
                '💊 Antibióticos: Salvaron millones de vidas',
                '🌐 Internet: Conectó al mundo',
                '🚗 Rueda: Base de transporte',
                '📱 Teléfono: Comunicación instantánea',
                '',
                'Desde salud: Los antibióticos y vacunas salvaron más vidas.',
                '',
                '¿Cuál crees tú que es el más importante?'
            ]
        },
        palabra_favorita: {
            keywords: ['qué palabra te gusta más', 'que palabra te gusta', 'palabra favorita', 'tu palabra favorita'],
            respuestas: [
                'Me gustan varias, pero "esperanza" es especial. 🌟',
                '',
                'Porque implica:',
                '💪 Fortaleza para seguir',
                '🌅 Creer en un mejor mañana',
                '💚 No rendirse',
                '✨ Posibilidad de cambio',
                '',
                'Otras palabras hermosas:',
                '💙 Empatía',
                '🤝 Resiliencia',
                '😊 Serenidad',
                '🌱 Crecimiento',
                '',
                '¿Cuál es tu palabra favorita? ¿Por qué?'
            ]
        },
        pregunta_te_gustaria: {
            keywords: ['qué pregunta te gustaría', 'que pregunta te gustaria', 'pregunta te gustaría que hicieran'],
            respuestas: [
                'Me gustaría que me preguntaran: 💭',
                '',
                '"¿Hay algo más que pueda hacer por ti?"',
                '',
                'Porque mi propósito es ayudarte.',
                'Quiero asegurarme de que te sientas escuchado, apoyado y mejor.',
                '',
                'Así que te lo pregunto ahora:',
                '¿Hay algo más que pueda hacer por ti?',
                '¿Algo que necesites, que te preocupe, o sobre lo que quieras hablar?',
                '',
                'Estoy aquí. 💚'
            ]
        }
    };

    // Mensajes fuera de alcance
    const fueraDeAlcance = {
        keywords: {
            // Temas no relacionados con salud
            tecnologia: ['computadora', 'celular', 'software', 'app', 'aplicación', 'programa', 'windows', 'android', 'iphone'],
            entretenimiento: ['película', 'pelicula', 'serie', 'netflix', 'juego', 'videojuego'],
            politica: ['presidente', 'gobierno', 'político', 'politico', 'elecciones', 'partido'],
            religion: ['dios', 'religión', 'religion', 'iglesia', 'rezar'],
            matematicas: ['ecuación', 'ecuacion', 'matemática', 'matematica', 'calcular'],
            clima: ['clima', 'lluvia', 'temperatura', 'pronóstico'],
            finanzas: ['dinero', 'inversión', 'inversion', 'banco', 'préstamo', 'prestamo', 'acciones']
        },
        respuesta: [
            'Entiendo tu pregunta, pero está fuera de mi área de especialización. 🤔',
            '',
            'Mi enfoque principal es el bienestar físico y emocional:',
            '💚 Salud física (diabetes, hipertensión, alimentación, ejercicio)',
            '🧠 Salud mental (estrés, ansiedad, estado de ánimo)',
            '💬 Apoyo y orientación general sobre bienestar',
            '',
            'Si tienes consultas sobre estos temas, ¡con gusto te ayudo!',
            '¿Hay algo relacionado con tu salud o bienestar que quieras conversar?'
        ]
    };

    // Función para enviar mensaje
    function enviarMensaje() {
        const mensaje = messageInput.value.trim();
        if (mensaje === '') return;

        // Agregar mensaje del usuario
        agregarMensajeUsuario(mensaje);
        messageInput.value = '';

        // Simular escritura del bot
        mostrarEscribiendo();

        // Generar respuesta del bot después de un delay (más humano)
        setTimeout(() => {
            const respuesta = generarRespuesta(mensaje);
            quitarEscribiendo();
            agregarMensajeBot(respuesta);
        }, 2000);
    }

    // Función para agregar mensaje del usuario
    function agregarMensajeUsuario(texto) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message user-message';
        messageDiv.innerHTML = `
            <div class="message-content">
                <p>${texto}</p>
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Función para agregar mensaje del bot
    function agregarMensajeBot(texto) {
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message bot-message';
        
        let contenido = '';
        if (Array.isArray(texto)) {
            contenido = texto.map(linea => `<p>${linea}</p>`).join('');
        } else {
            contenido = `<p>${texto}</p>`;
        }
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                ${contenido}
            </div>
        `;
        chatMessages.appendChild(messageDiv);
        scrollToBottom();
    }

    // Función para mostrar indicador de escritura
    function mostrarEscribiendo() {
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>
            </div>
        `;
        chatMessages.appendChild(typingDiv);
        scrollToBottom();
    }

    // Función para quitar indicador de escritura
    function quitarEscribiendo() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    // Función para generar respuesta basada en el mensaje (con enfoque empático y contextual)
    function generarRespuesta(mensaje) {
        const mensajeLower = mensaje.toLowerCase();
        
        // Guardar mensaje del usuario en contexto
        contextoConversacion.mensajesUsuario.push(mensajeLower);

        // PRIORIDAD MÁXIMA: Detectar crisis
        if (conocimientos.crisis.keywords.some(keyword => mensajeLower.includes(keyword))) {
            contextoConversacion.ultimoTema = 'crisis';
            return conocimientos.crisis.respuestas;
        }

        // Detectar preguntas personales sobre Linda
        for (let tipo in preguntasPersonales) {
            const pregunta = preguntasPersonales[tipo];
            if (pregunta.keywords.some(keyword => mensajeLower.includes(keyword))) {
                return pregunta.respuestas;
            }
        }

        // Detectar preguntas conversacionales
        for (let tipo in preguntasConversacionales) {
            const pregunta = preguntasConversacionales[tipo];
            if (pregunta.keywords.some(keyword => mensajeLower.includes(keyword))) {
                if (typeof pregunta.respuestas === 'function') {
                    return pregunta.respuestas();
                }
                return pregunta.respuestas;
            }
        }

        // Detectar cuando el usuario comparte su nombre
        if (mensajeLower.includes('me llamo') || mensajeLower.includes('mi nombre es') || 
            (contextoConversacion.mensajesUsuario.length > 1 && 
             contextoConversacion.mensajesUsuario[contextoConversacion.mensajesUsuario.length - 2].includes('cómo te gustaría'))) {
            const nombreMatch = mensaje.match(/(?:me llamo|mi nombre es|soy)\s+([a-záéíóúñA-ZÁÉÍÓÚÑ]+)/i);
            if (nombreMatch && nombreMatch[1]) {
                contextoConversacion.nombreUsuario = nombreMatch[1];
                localStorage.setItem('nombreUsuario', nombreMatch[1]);
                return [
                    `¡Mucho gusto, ${nombreMatch[1]}! 💚`,
                    'Me alegra conocerte. ¿En qué puedo ayudarte hoy?'
                ];
            }
        }

        // Respuestas afirmativas/confirmaciones
        if (mensajeLower.match(/^(sí|si|claro|exacto|correcto|así es|eso|ajá|ok|dale|bueno|obvio)$/)) {
            if (contextoConversacion.ultimoTema) {
                const tema = conocimientos[contextoConversacion.ultimoTema];
                if (tema && tema.seguimiento && tema.seguimiento.length > 0) {
                    const pregunta = tema.seguimiento[Math.floor(Math.random() * tema.seguimiento.length)];
                    return pregunta;
                }
            }
            return [
                'Entiendo. Cuéntame más sobre eso.',
                '¿Qué más te gustaría compartir?'
            ];
        }

        // Respuestas negativas
        if (mensajeLower.match(/^(no|nada|ninguno|ninguna|para nada|tampoco)$/)) {
            return [
                'Está bien, no hay problema. 😊',
                '¿Hay algo más en lo que pueda ayudarte?'
            ];
        }

        // Respuestas sobre estar bien/mal
        if (mensajeLower.match(/\b(bien|mejor|genial|excelente|feliz|contento|alegre)\b/) && 
            mensajeLower.match(/\b(estoy|me siento|estoy|ando)\b/)) {
            const nombre = contextoConversacion.nombreUsuario;
            return [
                `¡Me alegra escuchar eso${nombre ? ', ' + nombre : ''}! 😊`,
                '¿Hay algo específico que haya contribuido a sentirte así?',
                'Es importante celebrar los buenos momentos. Recuerda cuidar de ti todos los días.'
            ];
        }

        if (mensajeLower.match(/\b(mal|triste|terrible|horrible|fatal|deprimido|ansioso|estresado)\b/) && 
            mensajeLower.match(/\b(estoy|me siento|ando)\b/)) {
            const nombre = contextoConversacion.nombreUsuario;
            return [
                `Lamento que te sientas así${nombre ? ', ' + nombre : ''}. 💙`,
                'Está bien no estar bien todo el tiempo. Estoy aquí para escucharte sin juzgarte.',
                '¿Quieres contarme qué te está pasando?'
            ];
        }

        // Verificar saludos
        if (saludos.keywords.some(keyword => mensajeLower.includes(keyword))) {
            const nombre = contextoConversacion.nombreUsuario;
            if (nombre) {
                return [
                    `¡Hola de nuevo, ${nombre}! 😊`,
                    '¿En qué puedo ayudarte hoy?'
                ];
            }
            return saludos.respuestas;
        }

        // Verificar agradecimientos
        if (agradecimiento.keywords.some(keyword => mensajeLower.includes(keyword))) {
            const nombre = contextoConversacion.nombreUsuario;
            return [
                `¡Es un placer poder ayudarte${nombre ? ', ' + nombre : ''}! 😊`,
                'No tienes que agradecer. Me alegra poder acompañarte.',
                '¿Hay algo más en lo que pueda orientarte?'
            ];
        }

        // Verificar despedidas
        if (despedidas.keywords.some(keyword => mensajeLower.includes(keyword))) {
            const nombre = contextoConversacion.nombreUsuario;
            return [
                `¡Cuídate mucho${nombre ? ', ' + nombre : ''}! 💚`,
                'Recuerda que estoy aquí cuando me necesites.',
                'No estás solo/a en este camino. ¡Hasta pronto!'
            ];
        }

        // Buscar en base de conocimientos (temas de salud)
        for (let tema in conocimientos) {
            const info = conocimientos[tema];
            if (info.keywords && info.keywords.some(keyword => mensajeLower.includes(keyword))) {
                contextoConversacion.ultimoTema = tema;
                if (!contextoConversacion.temasPrevios.includes(tema)) {
                    contextoConversacion.temasPrevios.push(tema);
                }
                return info.respuestas;
            }
        }

        // Detectar temas fuera de alcance
        for (let categoria in fueraDeAlcance.keywords) {
            const palabrasClave = fueraDeAlcance.keywords[categoria];
            if (palabrasClave.some(keyword => mensajeLower.includes(keyword))) {
                return fueraDeAlcance.respuesta;
            }
        }

        // Respuestas contextuales según temas previos
        if (contextoConversacion.ultimoTema && conocimientos[contextoConversacion.ultimoTema]) {
            const tema = conocimientos[contextoConversacion.ultimoTema];
            if (tema.seguimiento && tema.seguimiento.length > 0) {
                return [
                    'Entiendo. Cada situación es única. 💙',
                    tema.seguimiento[Math.floor(Math.random() * tema.seguimiento.length)]
                ];
            }
        }

        // Respuesta general empática si no encuentra coincidencia
        const nombre = contextoConversacion.nombreUsuario;
        const respuestas = [
            [
                `Entiendo que quieres conversar${nombre ? ', ' + nombre : ''}, pero no estoy segura de cómo responderte a eso. 🤔`,
                '',
                'Estoy especializada en temas de salud y bienestar emocional.',
                '¿Podrías reformular tu pregunta o contarme sobre algo relacionado con tu salud física o mental?'
            ],
            [
                'Hmm, esa pregunta está un poco fuera de mi área de conocimiento. 😊',
                '',
                'Puedo ayudarte mejor con temas como:',
                '• Salud física (diabetes, presión arterial, alimentación)',
                '• Bienestar emocional (estrés, ansiedad, estado de ánimo)',
                '• Hábitos saludables (ejercicio, sueño, autocuidado)',
                '',
                '¿Hay algo de esto que te interese conversar?'
            ],
            [
                'No estoy completamente segura de cómo ayudarte con eso. 💭',
                '',
                'Mi especialidad es el bienestar y la salud. ¿Hay algo relacionado con tu salud física o emocional que quieras compartir?'
            ]
        ];
        return respuestas[Math.floor(Math.random() * respuestas.length)];
    }

    // Función para hacer scroll al final
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Event listeners
    btnSend.addEventListener('click', enviarMensaje);

    messageInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            enviarMensaje();
        }
    });

    // Botón de micrófono (por ahora solo muestra alerta)
    btnAttach.addEventListener('click', function() {
        alert('Función de voz en desarrollo. Por ahora, escribe tu consulta.');
    });
});
