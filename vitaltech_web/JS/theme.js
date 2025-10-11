// ===== GESTOR DE TEMA GLOBAL =====
// Este script debe cargarse en todas las páginas para aplicar el tema guardado

(function() {
    'use strict';
    
    // Aplicar tema guardado inmediatamente (antes de que se renderice la página)
    const savedTheme = localStorage.getItem('appTheme');
    const savedFontSize = localStorage.getItem('fontSize') || 'medium';
    
    // Aplicar tema
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark-theme');
        if (document.body) {
            document.body.classList.add('dark-theme');
        }
    }
    
    // Aplicar tamaño de fuente
    document.documentElement.classList.remove('font-small', 'font-medium', 'font-large');
    document.documentElement.classList.add(`font-${savedFontSize}`);
    
    // Cuando el DOM esté listo, asegurar que las clases estén aplicadas
    document.addEventListener('DOMContentLoaded', function() {
        // Aplicar tema al body si existe
        if (savedTheme === 'dark') {
            document.body.classList.add('dark-theme');
        }
        
        // Aplicar tamaño de fuente al body
        document.body.classList.remove('font-small', 'font-medium', 'font-large');
        document.body.classList.add(`font-${savedFontSize}`);
        
        console.log('🎨 Tema aplicado:', savedTheme || 'light');
        console.log('📏 Tamaño de fuente:', savedFontSize);
    });
    
    // Escuchar cambios en el tema desde otras pestañas
    window.addEventListener('storage', function(e) {
        if (e.key === 'appTheme') {
            if (e.newValue === 'dark') {
                document.body.classList.add('dark-theme');
            } else {
                document.body.classList.remove('dark-theme');
            }
        }
        
        if (e.key === 'fontSize') {
            document.body.classList.remove('font-small', 'font-medium', 'font-large');
            document.body.classList.add(`font-${e.newValue}`);
        }
    });
})();
