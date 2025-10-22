// Script para el Test Psicológico - Estrés (PSS-10 adaptado)
document.addEventListener('DOMContentLoaded', () => {
  const testFormPsico = document.getElementById('testFormPsico');
  const lightRedPsico = document.getElementById('lightRedPsico');
  const lightYellowPsico = document.getElementById('lightYellowPsico');
  const lightGreenPsico = document.getElementById('lightGreenPsico');
  
  if (testFormPsico) {
    // Calcular nivel mientras se seleccionan respuestas
    const selects = testFormPsico.querySelectorAll('select');
    selects.forEach(select => {
      select.addEventListener('change', calcularNivelEstres);
    });
    
    testFormPsico.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const resultado = calcularNivelEstres();
      
      // Guardar resultado completo
      const formData = new FormData(testFormPsico);
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userDoc = currentUser.numeroDocumento || 'guest';
      
      const respuestas = {
        puntos: resultado.puntos,
        riesgo: resultado.riesgo,
        pregunta1: formData.get('pregunta1'),
        pregunta2: formData.get('pregunta2'),
        pregunta3: formData.get('pregunta3'),
        pregunta4: formData.get('pregunta4'),
        pregunta5: formData.get('pregunta5'),
        fecha: new Date().toLocaleDateString()
      };
      
      localStorage.setItem(`testPsicologicoResultado_${userDoc}`, JSON.stringify(respuestas));
      
      // Mostrar resultado
      let mensaje = `📊 RESULTADO TEST DE ESTRÉS (PSS-10)\n\nPuntuación: ${resultado.puntos} puntos\n\n`;
      
      if (resultado.riesgo === 'bajo') {
        mensaje += '✅ RIESGO BAJO (0-4 puntos)\n\nManejas bien tus niveles de estrés.\n\nMantén hábitos saludables:\n• Descanso adecuado\n• Pausas activas\n• Buena alimentación\n• Apoyo social\n• Tiempo para ti';
      } else {
        mensaje += '🚨 RIESGO ALTO (5-10 puntos)\n\nIndica presencia de estrés elevado.\n\nRecomendaciones:\n• Buscar apoyo psicológico\n• Técnicas de respiración o relajación\n• Actividad física regular\n• Organizar prioridades\n• Establecer límites\n\n⚠️ Si los síntomas persisten, acude a un profesional en salud mental.';
      }
      
      alert(mensaje);
      
      // Redirigir al test de ansiedad
      setTimeout(() => {
        window.location.href = 'test-ansiedad.html';
      }, 500);
    });
  }
  
  function calcularNivelEstres() {
    if (!testFormPsico) return { puntos: 0, riesgo: 'bajo' };
    
    const formData = new FormData(testFormPsico);
    let puntos = 0;
    
    // Sumar puntos de las 5 preguntas
    for (let i = 1; i <= 5; i++) {
      const valor = parseInt(formData.get(`pregunta${i}`) || '0');
      puntos += valor;
    }
    
    // Determinar riesgo según puntuación
    let riesgo = 'bajo';
    
    // Resetear luces
    if (lightRedPsico && lightYellowPsico && lightGreenPsico) {
      lightRedPsico.classList.remove('active');
      lightYellowPsico.classList.remove('active');
      lightGreenPsico.classList.remove('active');
      
      if (puntos >= 0 && puntos <= 4) {
        riesgo = 'bajo';
        lightGreenPsico.classList.add('active');
      } else if (puntos >= 5 && puntos <= 10) {
        riesgo = 'alto';
        lightRedPsico.classList.add('active');
      }
    }
    
    return { puntos, riesgo };
  }
});
