// Script para el Test de HTA (Hipertensión Arterial)
document.addEventListener('DOMContentLoaded', () => {
  const testFormHTA = document.getElementById('testFormHTA');
  const lightRedHTA = document.getElementById('lightRedHTA');
  const lightYellowHTA = document.getElementById('lightYellowHTA');
  const lightGreenHTA = document.getElementById('lightGreenHTA');
  
  if (testFormHTA) {
    // Calcular riesgo mientras se llenan los campos
    testFormHTA.addEventListener('change', calcularRiesgoHTA);
    
    testFormHTA.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const resultado = calcularRiesgoHTA();
      
      // Guardar resultado completo
      const formData = new FormData(testFormHTA);
      const datosTest = {
        puntos: resultado.puntos,
        riesgo: resultado.riesgo,
        edad: formData.get('edad'),
        antecedentes_hta: formData.get('antecedentes_hta'),
        sobrepeso: formData.get('sobrepeso'),
        sal: formData.get('sal'),
        actividad_fisica: formData.get('actividad_fisica'),
        alcohol_tabaco: formData.get('alcohol_tabaco'),
        estres: formData.get('estres'),
        presion_reciente: formData.get('presion_reciente'),
        fecha: new Date().toLocaleDateString()
      };
      
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userDoc = currentUser.numeroDocumento || 'guest';
      
      localStorage.setItem(`testHTAResultado_${userDoc}`, JSON.stringify(datosTest));
      
      // Obtener resultados anteriores de diabetes
      const resultadoDiabetes = JSON.parse(localStorage.getItem(`testDiabetesResultado_${userDoc}`) || '{}');
      
      // Mostrar alerta combinada
      let mensaje = '📊 RESULTADOS DE EVALUACIÓN DE SALUD\n\n';
      
      // Resultado Diabetes
      if (resultadoDiabetes.riesgo) {
        mensaje += `🩺 DIABETES (FINDRISC): ${resultadoDiabetes.puntos} pts - `;
        if (resultadoDiabetes.riesgo === 'bajo') mensaje += 'Riesgo BAJO\n';
        else if (resultadoDiabetes.riesgo === 'moderado') mensaje += 'Riesgo MODERADO\n';
        else mensaje += 'Riesgo ALTO\n';
      }
      
      // Resultado HTA
      mensaje += `❤️ HIPERTENSIÓN: ${resultado.puntos} pts - `;
      
      if (resultado.riesgo === 'bajo') {
        mensaje += 'Riesgo BAJO\n\n✅ RIESGO BAJO (0-4 puntos)\n\nMantén hábitos saludables:\n• Alimentación baja en sal\n• Actividad física regular\n• Control de peso\n• Evitar tabaco y alcohol excesivo';
      } else if (resultado.riesgo === 'moderado') {
        mensaje += 'Riesgo MODERADO\n\n⚠️ RIESGO MODERADO (5-8 puntos)\n\nRequiere control preventivo:\n• Mide tu presión regularmente\n• Reduce consumo de sal\n• Aumenta actividad física\n• Control de peso\n• Consulta médica en 6 meses';
      } else {
        mensaje += 'Riesgo ALTO\n\n🚨 RIESGO ALTO (9+ puntos)\n\n¡IMPORTANTE!\n• Consulta médica PRIORITARIA\n• Medición de presión arterial\n• Evaluación cardiovascular\n• Cambios inmediatos de estilo de vida\n• Seguimiento médico regular';
      }
      
      alert(mensaje);
      
      // Redirigir de vuelta a main
      setTimeout(() => {
        window.location.href = 'main.html';
      }, 500);
    });
  }
  
  function calcularRiesgoHTA() {
    if (!testFormHTA) return { puntos: 0, riesgo: 'bajo' };
    
    const formData = new FormData(testFormHTA);
    let puntos = 0;
    
    // 1. Edad (0, 1, 2 puntos)
    puntos += parseInt(formData.get('edad') || '0');
    
    // 2. Antecedentes familiares (0, 2 puntos)
    puntos += parseInt(formData.get('antecedentes_hta') || '0');
    
    // 3. Sobrepeso/obesidad (0, 2 puntos)
    puntos += parseInt(formData.get('sobrepeso') || '0');
    
    // 4. Alto consumo de sal (0, 2 puntos)
    puntos += parseInt(formData.get('sal') || '0');
    
    // 5. Actividad física (0, 1 punto)
    puntos += parseInt(formData.get('actividad_fisica') || '0');
    
    // 6. Alcohol/tabaco (0, 2 puntos)
    puntos += parseInt(formData.get('alcohol_tabaco') || '0');
    
    // 7. Estrés (0, 1 punto)
    puntos += parseInt(formData.get('estres') || '0');
    
    // 8. Presión reciente (0, 1 punto)
    puntos += parseInt(formData.get('presion_reciente') || '0');
    
    // Determinar riesgo según puntuación
    let riesgo = 'bajo';
    
    // Resetear luces
    if (lightRedHTA && lightYellowHTA && lightGreenHTA) {
      lightRedHTA.classList.remove('active');
      lightYellowHTA.classList.remove('active');
      lightGreenHTA.classList.remove('active');
      
      if (puntos >= 0 && puntos <= 4) {
        riesgo = 'bajo';
        lightGreenHTA.classList.add('active');
      } else if (puntos >= 5 && puntos <= 8) {
        riesgo = 'moderado';
        lightYellowHTA.classList.add('active');
      } else if (puntos >= 9) {
        riesgo = 'alto';
        lightRedHTA.classList.add('active');
      }
    }
    
    return { puntos, riesgo };
  }
});
