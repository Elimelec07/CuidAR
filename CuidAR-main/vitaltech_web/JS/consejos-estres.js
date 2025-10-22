// Funcionalidad para mostrar más consejos
document.addEventListener('DOMContentLoaded', function() {
    const btnMasConsejos = document.getElementById('btnMasConsejos');
    const consejosLista = document.getElementById('consejosLista');
    
    if (btnMasConsejos && consejosLista) {
        btnMasConsejos.addEventListener('click', function() {
            if (consejosLista.style.display === 'none') {
                consejosLista.style.display = 'block';
                btnMasConsejos.innerHTML = '<span>Ver menos</span><i class="fas fa-chevron-up"></i>';
            } else {
                consejosLista.style.display = 'none';
                btnMasConsejos.innerHTML = '<span>Ver más consejos</span><i class="fas fa-chevron-right"></i>';
            }
        });
    }
});
