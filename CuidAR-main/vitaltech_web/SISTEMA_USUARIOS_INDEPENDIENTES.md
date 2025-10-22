# 👥 SISTEMA DE USUARIOS INDEPENDIENTES - CuidAR

## 📋 Resumen de Cambios Implementados

Se ha modificado el sistema para que **cada usuario tenga sus propios datos independientes**, evitando mezclas entre usuarios.

---

## 🔐 Sistema de Almacenamiento por Usuario

### **Clave Única: Número de Documento**
Cada usuario se identifica por su **número de documento**, que se usa como clave única en localStorage.

### **Estructura de Almacenamiento:**

```javascript
// Usuario registrado
localStorage: {
  "user_12345678": {...},           // Datos del usuario
  "currentUser": {...},             // Usuario actualmente logueado
  
  // Datos específicos del usuario 12345678
  "profilePhoto_12345678": "data:image...",
  "notifications_12345678": [...],
  "lastDailyNotification_12345678": "...",
  "historiaClinicaPDFs_12345678": [...],
  "testDiabetesResultado_12345678": {...},
  "testHTAResultado_12345678": {...},
  "testPsicologicoResultado_12345678": {...},
  "testAnsiedadResultado_12345678": {...}
}
```

---

## 📸 Sistema de Fotos de Perfil

### **Archivos Modificados:**
- `JS/script.js`

### **Cambios Realizados:**

#### **Antes:**
```javascript
localStorage.setItem('profilePhoto', imageData);
const savedPhoto = localStorage.getItem('profilePhoto');
```

#### **Ahora:**
```javascript
// Se guarda con clave única por usuario
const photoKey = `profilePhoto_${numeroDocumento}`;
localStorage.setItem(photoKey, imageData);
const savedPhoto = localStorage.getItem(photoKey);
```

### **Funciones Agregadas:**
```javascript
// Obtener usuario actual
function getCurrentUser() {
    const currentUserData = localStorage.getItem('currentUser');
    return currentUserData ? JSON.parse(currentUserData) : null;
}

// Generar clave única de foto
function getUserPhotoKey() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.numeroDocumento) {
        return `profilePhoto_${currentUser.numeroDocumento}`;
    }
    return 'profilePhoto_guest';
}
```

### **Comportamiento:**
- ✅ Cada usuario tiene su propia foto de perfil
- ✅ Al cambiar de usuario, la foto cambia automáticamente
- ✅ La foto persiste entre sesiones
- ✅ Si no hay usuario logueado, usa clave genérica 'guest'

---

## � Sistema de Historias Clínicas

### **Archivos Modificados:**
- `JS/script.js`

### **Cambios Realizados:**

#### **Antes:**
```javascript
localStorage.setItem('historiaClinicaPDFs', JSON.stringify(documentos));
const documentos = localStorage.getItem('historiaClinicaPDFs');
```

#### **Ahora:**
```javascript
// Se guarda con clave única por usuario
const storageKey = `historiaClinicaPDFs_${numeroDocumento}`;
localStorage.setItem(storageKey, JSON.stringify(documentos));
const documentos = localStorage.getItem(storageKey);
```

### **Función Agregada:**
```javascript
// Generar clave única de historias clínicas
function getHistoriaClinicaKey() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.numeroDocumento) {
        return `historiaClinicaPDFs_${currentUser.numeroDocumento}`;
    }
    return 'historiaClinicaPDFs_guest';
}
```

### **Comportamiento:**
- ✅ Cada usuario tiene su propia lista de historias clínicas
- ✅ Los PDFs subidos solo son visibles para el usuario que los subió
- ✅ Al cambiar de usuario, se muestran las historias del nuevo usuario
- ✅ Las historias persisten entre sesiones
- ✅ Incluidas en el Excel de exportación del administrador

---

## �🔔 Sistema de Notificaciones

### **Archivos Modificados:**
- `JS/notifications.js` (sistema global)
- `HTML/main.html` (implementación)

### **Cambios Realizados:**

#### **Clase NotificationSystem Actualizada:**

```javascript
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
}
```

### **Beneficios:**
- ✅ Cada usuario tiene su propio historial de notificaciones
- ✅ Los consejos diarios se generan independientemente para cada usuario
- ✅ Las alertas basadas en tests son personalizadas
- ✅ El badge muestra solo notificaciones no leídas del usuario actual

---

## 📊 Sistema de Resultados de Tests

### **Archivos Modificados:**
- `JS/test-diabetes.js`
- `JS/test-hta.js`
- `JS/test-psicologico.js`
- `JS/test-ansiedad.js`
- `JS/script.js` (historias clínicas)

### **Cambios Realizados en Cada Test:**

#### **Ejemplo - test-diabetes.js:**

**Antes:**
```javascript
localStorage.setItem('testDiabetesResultado', JSON.stringify(datosTest));
```

**Ahora:**
```javascript
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
const userDoc = currentUser.numeroDocumento || 'guest';
localStorage.setItem(`testDiabetesResultado_${userDoc}`, JSON.stringify(datosTest));
```

### **Resultados Almacenados por Usuario:**
- ✅ Test de Diabetes (FINDRISC)
- ✅ Test de HTA (Hipertensión)
- ✅ Test Psicológico (Estrés - PSS-10)
- ✅ Test de Ansiedad (BAI)
- ✅ Historias Clínicas (PDFs subidos)

### **Comportamiento:**
- ✅ Cada usuario mantiene su propio historial de tests
- ✅ Los resultados no se mezclan entre usuarios
- ✅ Las notificaciones se generan basadas en los resultados del usuario actual
- ✅ Los recordatorios de tests son individuales (cada 30 días)

---

## 🔄 Flujo de Cambio de Usuario

### **Proceso Completo:**

1. **Usuario A cierra sesión:**
   - Se elimina `currentUser` de localStorage
   - Los datos de Usuario A permanecen guardados

2. **Usuario B inicia sesión:**
   - Se establece nuevo `currentUser` con datos de Usuario B
   - Sistema de notificaciones recarga: `notifSystem.loadCurrentUser()`
   - Se cargan las notificaciones de Usuario B
   - Se carga la foto de perfil de Usuario B
   - Badge actualiza con notificaciones no leídas de Usuario B

3. **Datos Preservados:**
   ```
   Usuario A:
   - profilePhoto_A
   - notifications_A
   - historiaClinicaPDFs_A
   - testDiabetesResultado_A
   - etc.
   
   Usuario B:
   - profilePhoto_B
   - notifications_B
   - historiaClinicaPDFs_B
   - testDiabetesResultado_B
   - etc.
   ```

---

## 🛡️ Seguridad y Privacidad

### **Protecciones Implementadas:**
- ✅ Cada usuario solo ve sus propios datos
- ✅ Los resultados de tests están aislados por usuario
- ✅ Las notificaciones son privadas para cada usuario
- ✅ Las fotos de perfil no se comparten entre usuarios
- ✅ Las historias clínicas son privadas y únicas por usuario
- ✅ No hay acceso cruzado a datos de otros usuarios

### **Consideraciones:**
- ⚠️ Los datos se almacenan en localStorage (navegador local)
- ⚠️ No hay encriptación (para producción se recomienda backend + DB)
- ⚠️ Si se borra el navegador, se pierden los datos

---

## 📝 Funciones Principales Agregadas/Modificadas

### **1. En script.js:**
```javascript
getCurrentUser()              // Obtiene usuario actual
getUserPhotoKey()            // Genera clave única para foto
getHistoriaClinicaKey()      // Genera clave única para historias clínicas
```

### **2. En notifications.js:**
```javascript
loadCurrentUser()        // Carga usuario actual en sistema
getStorageKey()         // Genera clave única para notificaciones
getLastDailyKey()       // Genera clave única para último consejo diario
```

### **3. En todos los tests:**
```javascript
// Al guardar resultados:
const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
const userDoc = currentUser.numeroDocumento || 'guest';
localStorage.setItem(`testResultado_${userDoc}`, data);
```

---

## ✅ Testing y Verificación

### **Para Verificar el Sistema:**

1. **Crear Usuario 1:**
   - Registrarse con documento: 12345678
   - Subir foto de perfil
   - Realizar tests
   - Verificar notificaciones

2. **Cerrar sesión**

3. **Crear Usuario 2:**
   - Registrarse con documento: 87654321
   - Verificar que NO aparece la foto de Usuario 1
   - Verificar que NO aparecen notificaciones de Usuario 1
   - Verificar que NO aparecen historias clínicas de Usuario 1
   - Subir foto diferente
   - Subir historias clínicas
   - Realizar tests

4. **Alternar entre usuarios:**
   - Cerrar sesión de Usuario 2
   - Login con Usuario 1
   - Verificar que aparece foto original de Usuario 1
   - Verificar que aparecen notificaciones de Usuario 1
   - Verificar que aparecen historias clínicas de Usuario 1

---

## 🚀 Próximas Mejoras Sugeridas

### **Corto Plazo:**
- [✅] Historias clínicas independientes por usuario
- [ ] Opción de "Recordar sesión"
- [ ] Validación de tamaño máximo de foto (optimización)
- [ ] Comprimir fotos automáticamente
- [ ] Límite de tamaño para PDFs de historias clínicas

### **Mediano Plazo:**
- [ ] Backend con base de datos real
- [ ] Autenticación con JWT tokens
- [ ] Encriptación de datos sensibles
- [ ] Sincronización multi-dispositivo

### **Largo Plazo:**
- [ ] OAuth (login con Google/Facebook)
- [ ] Backup automático en la nube
- [ ] Compartir resultados con médicos
- [ ] Exportar historial médico en PDF

---

## 📞 Soporte y Documentación

**Sistema implementado:** 11 de octubre de 2025  
**Versión:** 2.0  
**Estado:** ✅ Funcional y probado

### **Archivos del Sistema:**
- `/JS/notifications.js` - Sistema global de notificaciones
- `/JS/script.js` - Gestión de fotos, perfil e historias clínicas
- `/JS/test-*.js` - 4 archivos de tests modificados
- `/JS/admin.js` - Panel de administración con exportación a Excel
- `/HTML/main.html` - Interfaz de notificaciones
- `/HTML/historia-clinica.html` - Interfaz de historias clínicas
- `/CSS/style.css` - Estilos del sistema

---

**✨ Ahora cada usuario tiene su experiencia completamente personalizada e independiente en CuidAR! ✨**
