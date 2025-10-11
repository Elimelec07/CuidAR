// ==================== SISTEMA DE NOTIFICACIONES GLOBAL ====================

class NotificationSystem {
    constructor() {
        this.currentUser = null;
        this.loadCurrentUser();
    }
    
    // Cargar usuario actual
    loadCurrentUser() {
        const currentUserData = localStorage.getItem('currentUser');
        if (currentUserData) {
            this.currentUser = JSON.parse(currentUserData);
        }
    }
    
    // Obtener clave de storage única por usuario
    getStorageKey() {
        if (!this.currentUser || !this.currentUser.numeroDocumento) {
            return 'notifications_guest';
        }
        return `notifications_${this.currentUser.numeroDocumento}`;
    }
    
    getLastDailyKey() {
        if (!this.currentUser || !this.currentUser.numeroDocumento) {
            return 'lastDailyNotification_guest';
        }
        return `lastDailyNotification_${this.currentUser.numeroDocumento}`;
    }

    // Obtener todas las notificaciones del usuario actual
    getAll() {
        const notifications = localStorage.getItem(this.getStorageKey());
        return notifications ? JSON.parse(notifications) : [];
    }

    // Guardar notificaciones del usuario actual
    save(notifications) {
        localStorage.setItem(this.getStorageKey(), JSON.stringify(notifications));
    }

    // Agregar nueva notificación
    add(notification) {
        const notifications = this.getAll();
        
        // Evitar duplicados recientes (últimas 24 horas)
        const isDuplicate = notifications.some(n => 
            n.title === notification.title && 
            (Date.now() - new Date(n.timestamp).getTime()) < 86400000
        );
        
        if (!isDuplicate) {
            notifications.unshift({
                id: Date.now(),
                title: notification.title,
                message: notification.message,
                type: notification.type || 'info',
                icon: notification.icon || 'fa-info-circle',
                timestamp: new Date().toISOString(),
                read: false
            });
            
            // Mantener solo las últimas 50 notificaciones
            if (notifications.length > 50) {
                notifications.splice(50);
            }
            
            this.save(notifications);
            return true;
        }
        
        return false;
    }

    // Eliminar notificación
    delete(id) {
        let notifications = this.getAll();
        notifications = notifications.filter(n => n.id !== id);
        this.save(notifications);
    }

    // Marcar todas como leídas
    markAllAsRead() {
        const notifications = this.getAll();
        notifications.forEach(n => n.read = true);
        this.save(notifications);
    }

    // Limpiar todas
    clearAll() {
        this.save([]);
    }

    // Contar no leídas
    countUnread() {
        const notifications = this.getAll();
        return notifications.filter(n => !n.read).length;
    }

    // Generar notificaciones basadas en resultados de tests
    generateHealthNotifications() {
        if (!this.currentUser || !this.currentUser.numeroDocumento) return;
        
        const userDoc = this.currentUser.numeroDocumento;
        
        // Notificación basada en resultado de Diabetes
        const diabetesResult = JSON.parse(localStorage.getItem(`testDiabetesResultado_${userDoc}`) || '{}');
        if (diabetesResult.riesgo === 'alto' && diabetesResult.fecha) {
            this.add({
                title: '⚠️ Riesgo de Diabetes Alto',
                message: 'Según tu último test, se recomienda consultar con un médico para evaluación de glucosa y control preventivo.',
                type: 'warning',
                icon: 'fa-exclamation-triangle'
            });
        } else if (diabetesResult.riesgo === 'moderado' && diabetesResult.fecha) {
            this.add({
                title: '📊 Riesgo Moderado de Diabetes',
                message: 'Te recomendamos mejorar hábitos alimenticios y realizar actividad física regular. Controla tu peso periódicamente.',
                type: 'info',
                icon: 'fa-heartbeat'
            });
        }
        
        // Notificación basada en HTA
        const htaResult = JSON.parse(localStorage.getItem(`testHTAResultado_${userDoc}`) || '{}');
        if (htaResult.riesgo === 'alto' && htaResult.fecha) {
            this.add({
                title: '🚨 Riesgo de Hipertensión Alto',
                message: 'Consulta médica prioritaria. Es importante medir tu presión arterial y recibir evaluación cardiovascular.',
                type: 'danger',
                icon: 'fa-heartbeat'
            });
        } else if (htaResult.riesgo === 'moderado' && htaResult.fecha) {
            this.add({
                title: '⚠️ Riesgo Moderado de HTA',
                message: 'Controla tu presión arterial regularmente y reduce el consumo de sal. Mantén hábitos saludables.',
                type: 'warning',
                icon: 'fa-heart'
            });
        }
        
        // Notificación basada en Estrés
        const estresResult = JSON.parse(localStorage.getItem(`testPsicologicoResultado_${userDoc}`) || '{}');
        if (estresResult.riesgo === 'alto' && estresResult.fecha) {
            this.add({
                title: '😰 Nivel de Estrés Elevado',
                message: 'Considera practicar técnicas de relajación, respiración profunda y buscar apoyo psicológico si persisten los síntomas.',
                type: 'warning',
                icon: 'fa-brain'
            });
        }
        
        // Notificación basada en Ansiedad
        const ansiedadResult = JSON.parse(localStorage.getItem(`testAnsiedadResultado_${userDoc}`) || '{}');
        if (ansiedadResult.riesgo === 'alto' && ansiedadResult.fecha) {
            this.add({
                title: '😟 Indicios de Ansiedad',
                message: 'Se recomienda consultar con un profesional de salud mental para una evaluación más profunda y recibir el apoyo adecuado.',
                type: 'warning',
                icon: 'fa-user-md'
            });
        }
    }

    // Generar consejo diario
    generateDailyTip() {
        const lastNotification = localStorage.getItem(this.getLastDailyKey());
        const today = new Date().toDateString();
        
        if (lastNotification !== today) {
            const dailyTips = [
                {
                    title: '💧 Hidratación',
                    message: 'Recuerda beber al menos 8 vasos de agua al día. La hidratación es clave para tu salud.',
                    type: 'success',
                    icon: 'fa-tint'
                },
                {
                    title: '🥗 Alimentación Saludable',
                    message: 'Incluye frutas y verduras en tu dieta diaria. Son fundamentales para mantener tu sistema inmune fuerte.',
                    type: 'success',
                    icon: 'fa-apple-alt'
                },
                {
                    title: '🏃 Actividad Física',
                    message: 'Realiza al menos 30 minutos de ejercicio moderado hoy. Tu corazón te lo agradecerá.',
                    type: 'info',
                    icon: 'fa-running'
                },
                {
                    title: '😴 Descanso',
                    message: 'Duerme entre 7-8 horas diarias. El sueño reparador es esencial para tu bienestar.',
                    type: 'info',
                    icon: 'fa-bed'
                },
                {
                    title: '🧘 Salud Mental',
                    message: 'Dedica unos minutos a la meditación o respiración profunda. Tu mente necesita pausas.',
                    type: 'success',
                    icon: 'fa-spa'
                },
                {
                    title: '🩺 Control Médico',
                    message: '¿Cuándo fue tu último chequeo médico? La prevención es la mejor medicina.',
                    type: 'info',
                    icon: 'fa-stethoscope'
                },
                {
                    title: '🚭 Hábitos Saludables',
                    message: 'Evita el consumo de tabaco y alcohol en exceso. Tu cuerpo te lo agradecerá a largo plazo.',
                    type: 'warning',
                    icon: 'fa-smoking-ban'
                },
                {
                    title: '👥 Conexión Social',
                    message: 'Mantén contacto con familia y amigos. Las relaciones sociales son importantes para tu salud emocional.',
                    type: 'success',
                    icon: 'fa-users'
                },
                {
                    title: '🌞 Vitamina D',
                    message: 'Toma sol durante 15-20 minutos al día. La vitamina D es esencial para tus huesos y sistema inmune.',
                    type: 'success',
                    icon: 'fa-sun'
                },
                {
                    title: '🧠 Salud Cognitiva',
                    message: 'Mantén tu mente activa con lectura, juegos mentales o aprendiendo algo nuevo cada día.',
                    type: 'info',
                    icon: 'fa-brain'
                },
                {
                    title: '🍎 Colaciones Saludables',
                    message: 'Elige snacks nutritivos como frutas, frutos secos o yogurt en lugar de alimentos procesados.',
                    type: 'success',
                    icon: 'fa-apple-alt'
                },
                {
                    title: '🚶 Movimiento Constante',
                    message: 'Levántate y muévete cada hora si trabajas sentado. Pequeños cambios hacen gran diferencia.',
                    type: 'info',
                    icon: 'fa-walking'
                }
            ];
            
            // Seleccionar consejo aleatorio
            const randomTip = dailyTips[Math.floor(Math.random() * dailyTips.length)];
            this.add(randomTip);
            
            localStorage.setItem(this.getLastDailyKey(), today);
        }
    }

    // Notificación de recordatorio de test
    remindTestIfNeeded() {
        if (!this.currentUser || !this.currentUser.numeroDocumento) return;
        
        const userDoc = this.currentUser.numeroDocumento;
        const diabetesResult = JSON.parse(localStorage.getItem(`testDiabetesResultado_${userDoc}`) || '{}');
        const htaResult = JSON.parse(localStorage.getItem(`testHTAResultado_${userDoc}`) || '{}');
        
        // Si pasaron más de 30 días desde el último test
        if (diabetesResult.fecha) {
            const lastTest = new Date(diabetesResult.fecha.split('/').reverse().join('-'));
            const daysSince = Math.floor((Date.now() - lastTest.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysSince >= 30 && daysSince < 31) {
                this.add({
                    title: '📅 Recordatorio de Test',
                    message: 'Han pasado 30 días desde tu último test de diabetes. ¿Quieres realizar uno nuevo para monitorear tu salud?',
                    type: 'info',
                    icon: 'fa-calendar-check'
                });
            }
        }
    }

    // Calcular tiempo transcurrido
    getTimeAgo(date) {
        const seconds = Math.floor((new Date() - date) / 1000);
        
        if (seconds < 60) return 'Hace unos segundos';
        if (seconds < 3600) return `Hace ${Math.floor(seconds / 60)} minutos`;
        if (seconds < 86400) return `Hace ${Math.floor(seconds / 3600)} horas`;
        if (seconds < 604800) return `Hace ${Math.floor(seconds / 86400)} días`;
        
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
    }
}

// Exportar instancia global
window.notificationSystem = new NotificationSystem();
