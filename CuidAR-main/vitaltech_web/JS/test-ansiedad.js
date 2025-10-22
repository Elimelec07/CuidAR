// Script para el Test de Ansiedad (BAI adaptado)
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('testFormAnsiedad');
    const lightRed = document.getElementById('lightRed');
    const lightYellow = document.getElementById('lightYellow');
    const lightGreen = document.getElementById('lightGreen');
    
    if (form) {
        // Actualizar semáforo mientras se seleccionan respuestas
        const selects = form.querySelectorAll('select');
        selects.forEach(select => {
            select.addEventListener('change', actualizarSemaforo);
        });
        
        // Manejar envío del formulario
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const resultado = calcularAnsiedad();
            
            // Guardar resultado completo
            const formData = new FormData(form);
            const datosTest = {
                puntos: resultado.puntos,
                riesgo: resultado.riesgo,
                pregunta1: formData.get('pregunta1'),
                pregunta2: formData.get('pregunta2'),
                pregunta3: formData.get('pregunta3'),
                pregunta4: formData.get('pregunta4'),
                pregunta5: formData.get('pregunta5'),
                fecha: new Date().toLocaleDateString()
            };
            
            const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
            const userDoc = currentUser.numeroDocumento || 'guest';
            
            localStorage.setItem(`testAnsiedadResultado_${userDoc}`, JSON.stringify(datosTest));
            
            // Obtener resultado de estrés previo
            const resultadoEstres = JSON.parse(localStorage.getItem(`testPsicologicoResultado_${userDoc}`) || '{}');
            
            // Mostrar alerta combinada
            let mensaje = '📊 EVALUACIÓN PSICOLÓGICA COMPLETA\n\n';
            
            // Resultado Estrés
            if (resultadoEstres.puntos !== undefined) {
                mensaje += `😰 ESTRÉS: ${resultadoEstres.puntos} pts - `;
                if (resultadoEstres.riesgo === 'bajo') mensaje += 'Riesgo BAJO\n';
                else mensaje += 'Riesgo ALTO\n';
            }
            
            // Resultado Ansiedad
            mensaje += `😟 ANSIEDAD: ${resultado.puntos} pts - `;
            
            if (resultado.riesgo === 'bajo') {
                mensaje += 'Riesgo BAJO\n\n✅ RIESGO BAJO (0-4 puntos)\n\nNo hay indicios de ansiedad significativa.\n\nMantén hábitos de autocuidado:\n• Descanso adecuado\n• Conexión social\n• Actividad física\n• Alimentación balanceada\n• Tiempo de ocio';
            } else {
                mensaje += 'Riesgo ALTO\n\n🚨 RIESGO ALTO (5-10 puntos)\n\nIndica posible presencia de ansiedad moderada o alta.\n\nRecomendaciones urgentes:\n• Acudir a profesional de salud mental\n• Evaluación psicológica profunda\n• Técnicas de respiración\n• Relajación muscular progresiva\n• Desconexión digital antes de dormir\n• Evitar cafeína y estimulantes\n\n⚠️ No ignores estos síntomas. La ayuda profesional es fundamental.';
            }
            
            alert(mensaje);
            
            // Redirigir a la página principal
            setTimeout(() => {
                window.location.href = 'main.html';
            }, 500);
        });
    }
    
    function actualizarSemaforo() {
        const resultado = calcularAnsiedad();
        
        // Resetear luces
        if (lightRed && lightYellow && lightGreen) {
            lightRed.classList.remove('active');
            lightYellow.classList.remove('active');
            lightGreen.classList.remove('active');
            
            if (resultado.riesgo === 'bajo') {
                lightGreen.classList.add('active');
            } else {
                lightRed.classList.add('active');
            }
        }
    }
    
    function calcularAnsiedad() {
        if (!form) return { puntos: 0, riesgo: 'bajo' };
        
        const formData = new FormData(form);
        let puntos = 0;
        
        // Sumar puntos de las 5 preguntas
        for (let i = 1; i <= 5; i++) {
            const valor = parseInt(formData.get(`pregunta${i}`) || '0');
            puntos += valor;
        }
        
        // Determinar riesgo según puntuación
        let riesgo = 'bajo';
        
        if (puntos >= 0 && puntos <= 4) {
            riesgo = 'bajo';
        } else if (puntos >= 5 && puntos <= 10) {
            riesgo = 'alto';
        }
        
        return { puntos, riesgo };
    }
});
