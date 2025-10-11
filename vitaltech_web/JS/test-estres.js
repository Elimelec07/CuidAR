// Script para el Test de Estrés (continuación - PSS-10)
document.addEventListener('DOMContentLoaded', () => {
  const testFormEstres = document.getElementById('testFormEstres');
  const lightRedEstres = document.getElementById('lightRedEstres');
  const lightYellowEstres = document.getElementById('lightYellowEstres');
  const lightGreenEstres = document.getElementById('lightGreenEstres');
  
  if (testFormEstres) {
    // Calcular nivel mientras se seleccionan respuestas
    const selects = testFormEstres.querySelectorAll('select');
    selects.forEach(select => {
      select.addEventListener('change', calcularNivelEstres);
    });
    
    testFormEstres.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Este test es redundante, solo redirige al siguiente
      alert('✅ Continuando con la evaluación de ansiedad...');
      
      // Redirigir al test de ansiedad
      setTimeout(() => {
        window.location.href = 'test-ansiedad.html';
      }, 300);
    });
  }
  
  function calcularNivelEstres() {
    if (!testFormEstres) return { puntos: 0, riesgo: 'bajo' };
    
    const formData = new FormData(testFormEstres);
    let puntos = 0;
    
    // Sumar puntos de las 5 preguntas
    for (let i = 1; i <= 5; i++) {
      const valor = parseInt(formData.get(`pregunta${i}`) || '0');
      puntos += valor;
    }
    
    // Determinar riesgo según puntuación
    let riesgo = 'bajo';
    
    // Resetear luces
    if (lightRedEstres && lightYellowEstres && lightGreenEstres) {
      lightRedEstres.classList.remove('active');
      lightYellowEstres.classList.remove('active');
      lightGreenEstres.classList.remove('active');
      
      if (puntos >= 0 && puntos <= 4) {
        riesgo = 'bajo';
        lightGreenEstres.classList.add('active');
      } else if (puntos >= 5 && puntos <= 10) {
        riesgo = 'alto';
        lightRedEstres.classList.add('active');
      }
    }
    
    return { puntos, riesgo };
  }
});
