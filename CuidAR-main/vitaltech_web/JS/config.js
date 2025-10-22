// ============================================
// CONFIGURACIÓN DE SUPABASE PARA CUIDAR
// ============================================

// 🔐 IMPORTANTE: Reemplaza estos valores con tus credenciales de Supabase
// Ve a: Project Settings > API en tu dashboard de Supabase

const SUPABASE_CONFIG = {
    // Tu URL del proyecto
    url: 'https://dexqcemgxuqsbrjrkqub.supabase.co',
    
    // Tu clave pública anon
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRleHFjZW1neHVxc2JyanJrcXViIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEwODg0NjAsImV4cCI6MjA3NjY2NDQ2MH0.eA68XVxAu9CU-eXTAMV2MnT7wEcHEyn3A3dZeWhG88k'
};

// Verificar que las credenciales estén configuradas
if (SUPABASE_CONFIG.url === 'TU_SUPABASE_URL_AQUI' || 
    SUPABASE_CONFIG.anonKey === 'TU_SUPABASE_ANON_KEY_AQUI') {
    console.warn('⚠️ ADVERTENCIA: Configura tus credenciales de Supabase en config.js');
}

// Exportar configuración
window.SUPABASE_CONFIG = SUPABASE_CONFIG;
