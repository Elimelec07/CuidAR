// Script para Consejos de Prevención
document.addEventListener('DOMContentLoaded', () => {
  const btnsCategorias = document.querySelectorAll('.btn-categoria');
  
  btnsCategorias.forEach(btn => {
    btn.addEventListener('click', () => {
      const categoria = btn.getAttribute('data-categoria');
      
      // Guardar categoría seleccionada
      localStorage.setItem('categoriaConsejosSeleccionada', categoria);
      
      // Redirigir a página de consejos específicos
      window.location.href = `consejos-${categoria}.html`;
    });
  });
});
