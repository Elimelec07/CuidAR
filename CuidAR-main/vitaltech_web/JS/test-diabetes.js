// Script para el Test de Diabetes FINDRISC
document.addEventListener('DOMContentLoaded', () => {
  const testForm = document.getElementById('testForm');
  const lightRed = document.getElementById('lightRed');
  const lightYellow = document.getElementById('lightYellow');
  const lightGreen = document.getElementById('lightGreen');
  const pesoInput = document.getElementById('peso');
  const estaturaInput = document.getElementById('estatura');
  const imcDisplay = document.getElementById('imcDisplay');
  const cinturaInput = document.getElementById('cintura');
  const generoSelect = document.getElementById('genero');
  
  // Calcular IMC automáticamente
  function calcularIMC() {
    const peso = parseFloat(pesoInput.value);
    const estatura = parseFloat(estaturaInput.value);
    
    if (peso > 0 && estatura > 0) {
      const imc = peso / (estatura * estatura);
      imcDisplay.textContent = imc.toFixed(1);
      calcularRiesgo();
    } else {
      imcDisplay.textContent = '--';
    }
  }
  
  if (testForm) {
    // Calcular IMC cuando se ingresan peso o estatura
    pesoInput.addEventListener('input', calcularIMC);
    estaturaInput.addEventListener('input', calcularIMC);
    
    // Calcular riesgo mientras se llenan los campos
    testForm.addEventListener('change', calcularRiesgo);
    cinturaInput.addEventListener('input', calcularRiesgo);
    
    testForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const resultado = calcularRiesgo();
      
      // Guardar resultado completo
      const formData = new FormData(testForm);
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const userDoc = currentUser.numeroDocumento || 'guest';
      
      const datosTest = {
        puntos: resultado.puntos,
        riesgo: resultado.riesgo,
        imc: parseFloat(imcDisplay.textContent) || 0,
        edad: formData.get('edad'),
        peso: formData.get('peso'),
        estatura: formData.get('estatura'),
        genero: formData.get('genero'),
        cintura: formData.get('cintura'),
        actividad: formData.get('actividad'),
        dieta: formData.get('dieta'),
        medicamentos: formData.get('medicamentos'),
        antecedentes: formData.get('antecedentes'),
        fecha: new Date().toLocaleDateString()
      };
      
      localStorage.setItem(`testDiabetesResultado_${userDoc}`, JSON.stringify(datosTest));
      
      // Mostrar alerta con resultado
      let mensaje = `📊 RESULTADO TEST DIABETES (FINDRISC)\n\nPuntuación: ${resultado.puntos} puntos\n\n`;
      
      if (resultado.riesgo === 'bajo') {
        mensaje += '✅ RIESGO BAJO (0-6 puntos)\n\nMantén tus hábitos saludables:\n• Alimentación balanceada\n• Actividad física regular\n• Control periódico de peso';
      } else if (resultado.riesgo === 'moderado') {
        mensaje += '⚠️ RIESGO MODERADO (7-11 puntos)\n\nRecomendaciones:\n• Mejora tu alimentación\n• Aumenta actividad física\n• Realiza controles médicos periódicos\n• Vigila tu peso y circunferencia';
      } else {
        mensaje += '🚨 RIESGO ALTO (12+ puntos)\n\n¡IMPORTANTE!\n• Acude a valoración médica prioritaria\n• Solicita control de glucosa\n• Evaluación de factores de riesgo\n• Posible referencia a especialista';
      }
      
      alert(mensaje);
      
      // Redirigir al test de HTA
      setTimeout(() => {
        window.location.href = 'test-hta.html';
      }, 500);
    });
  }
  
  function calcularRiesgo() {
    if (!testForm) return { puntos: 0, riesgo: 'bajo' };
    
    const formData = new FormData(testForm);
    let puntos = 0;
    
    // 1. Edad (0, 2, 3, 4 puntos)
    const edadPuntos = parseInt(formData.get('edad') || '0');
    puntos += edadPuntos;
    
    // 2. IMC (0, 1, 3 puntos)
    const peso = parseFloat(formData.get('peso') || '0');
    const estatura = parseFloat(formData.get('estatura') || '0');
    if (peso > 0 && estatura > 0) {
      const imc = peso / (estatura * estatura);
      if (imc >= 25 && imc < 30) {
        puntos += 1;
      } else if (imc >= 30) {
        puntos += 3;
      }
    }
    
    // 3. Circunferencia de cintura (0, 3, 4 puntos)
    const cintura = parseFloat(formData.get('cintura') || '0');
    const genero = formData.get('genero');
    
    if (cintura > 0 && genero) {
      if (genero === 'hombre') {
        if (cintura >= 94 && cintura <= 102) {
          puntos += 3;
        } else if (cintura > 102) {
          puntos += 4;
        }
      } else if (genero === 'mujer') {
        if (cintura >= 80 && cintura <= 88) {
          puntos += 3;
        } else if (cintura > 88) {
          puntos += 4;
        }
      }
    }
    
    // 4. Actividad física (0, 2 puntos)
    const actividadPuntos = parseInt(formData.get('actividad') || '0');
    puntos += actividadPuntos;
    
    // 5. Dieta (0, 1 punto)
    const dietaPuntos = parseInt(formData.get('dieta') || '0');
    puntos += dietaPuntos;
    
    // 6. Medicamentos (0, 2 puntos)
    const medicamentosPuntos = parseInt(formData.get('medicamentos') || '0');
    puntos += medicamentosPuntos;
    
    // 7. Antecedentes familiares (0, 2, 4 puntos)
    const antecedentesPuntos = parseInt(formData.get('antecedentes') || '0');
    puntos += antecedentesPuntos;
    
    // Determinar riesgo según puntuación FINDRISC
    let riesgo = 'bajo';
    
    // Resetear luces
    if (lightRed && lightYellow && lightGreen) {
      lightRed.classList.remove('active');
      lightYellow.classList.remove('active');
      lightGreen.classList.remove('active');
      
      if (puntos >= 0 && puntos <= 6) {
        riesgo = 'bajo';
        lightGreen.classList.add('active');
      } else if (puntos >= 7 && puntos <= 11) {
        riesgo = 'moderado';
        lightYellow.classList.add('active');
      } else if (puntos >= 12) {
        riesgo = 'alto';
        lightRed.classList.add('active');
      }
    }
    
    return { puntos, riesgo };
  }
});
