# SISTEMA DE TEMA OSCURO - CuidAR App

## 📋 Descripción General

Se ha implementado un sistema completo de temas (claro/oscuro) que afecta a **TODAS** las páginas de la aplicación de forma automática y persistente.

---

## 🎨 Características Implementadas

### 1. **Tema Oscuro Global**
- ✅ Afecta a todas las páginas HTML de la aplicación
- ✅ Se aplica automáticamente al cargar cualquier página
- ✅ Persistencia mediante localStorage
- ✅ Sincronización entre pestañas

### 2. **Elementos Afectados**
- **Fondos**: Todos los contenedores, cards, modales
- **Textos**: Títulos, párrafos, labels, placeholders
- **Formularios**: Inputs, selects, textareas
- **Navegación**: Headers, menús, bottom-nav, sidebar
- **Botones**: Primarios, secundarios, outline
- **Tests**: Tarjetas de preguntas, opciones, resultados
- **Admin**: Panel de administración, tablas, tarjetas de usuario
- **Notificaciones**: Items, badges
- **Chat**: Mensajes, input de chat
- **Consejos**: Cards de consejos de salud
- **Historia Clínica**: Cards de archivos PDF
- **Scrollbar**: Personalizada para tema oscuro

### 3. **Tamaños de Fuente**
- **Pequeño**: 14px base
- **Mediano**: 16px base (predeterminado)
- **Grande**: 18px base
- Se ajustan títulos, botones y textos proporcionalmente

---

## 🗂️ Archivos Modificados/Creados

### Nuevo Archivo JavaScript
- **`/JS/theme.js`** (NUEVO)
  - Script global para aplicar temas
  - Carga antes de renderizar la página
  - Escucha cambios de localStorage entre pestañas
  - Aplica tema y tamaño de fuente guardados

### CSS Actualizado
- **`/CSS/style.css`**
  - Agregadas variables CSS para tema oscuro
  - 200+ líneas de estilos para `.dark-theme`
  - Clases para tamaños de fuente
  - Estilos para scrollbar personalizada

- **`/CSS/settings.css`**
  - Ya contenía estilos para el menú de configuración
  - Compatible con el nuevo sistema de temas

### Todas las Páginas HTML (18 archivos)
Se agregó `<script src="/JS/theme.js"></script>` al `<head>` de:

✅ index.html
✅ main.html
✅ perfil.html
✅ register.html
✅ admin.html
✅ asistente.html
✅ historia-clinica.html
✅ test-diabetes.html
✅ test-hta.html
✅ test-estres.html
✅ test-ansiedad.html
✅ test-psicologico.html
✅ consejos-diabetes.html
✅ consejos-hta.html
✅ consejos-estres.html
✅ consejos-prevencion.html
✅ politicas.html
✅ terminos.html

---

## 🎯 Funcionalidad del Menú de Configuración

### Ubicación
- Accesible desde **perfil.html** (ícono de hamburguesa ☰)

### Opciones Disponibles

#### 1. **Apariencia**
- Toggle para cambiar entre tema claro y oscuro
- Cambio instantáneo con animación suave

#### 2. **Tamaño de Fuente**
- Selector: Pequeño / Mediano / Grande
- Afecta toda la aplicación

#### 3. **Notificaciones**
- Activar/desactivar notificaciones
- Activar/desactivar consejos diarios

#### 4. **Idioma**
- Selector: Español / English / Português
- (Preparado para futuras traducciones)

#### 5. **Privacidad**
- Enlaces a Política de Privacidad
- Enlaces a Términos y Condiciones

#### 6. **Gestión de Cuenta**
- Cambiar contraseña (próximamente)
- Limpiar caché
- Eliminar cuenta (con confirmación doble)

---

## 💾 Almacenamiento

### LocalStorage Keys
```javascript
'appTheme'           // 'dark' o 'light'
'fontSize'           // 'small', 'medium', 'large'
'appLanguage'        // 'es', 'en', 'pt'
'notificationSettings' // JSON con configuración
```

---

## 🎨 Paleta de Colores

### Tema Claro (Original)
```css
--color-primary: #3E5F44    /* Verde oscuro */
--color-secondary: #5E936C  /* Verde medio */
--color-tertiary: #93DA97   /* Verde claro */
--color-light: #E8FFD7      /* Verde muy claro */
```

### Tema Oscuro (Nuevo)
```css
--dark-bg: #1a1a1a          /* Fondo principal */
--dark-container: #2d2d2d   /* Contenedores */
--dark-card: #3a3a3a        /* Cards y elementos */
--dark-text: #e0e0e0        /* Texto principal */
--dark-text-secondary: #b0b0b0 /* Texto secundario */
--dark-border: #4a4a4a      /* Bordes */
--dark-input: #333333       /* Inputs y campos */
```

---

## 🚀 Cómo Usar

### Para el Usuario
1. Ir a la sección de **Perfil**
2. Presionar el ícono de hamburguesa ☰ (arriba izquierda)
3. En "Apariencia", activar el toggle de **Modo Oscuro**
4. El tema se aplica instantáneamente en toda la app
5. La preferencia se guarda automáticamente

### Para el Desarrollador
El tema se aplica automáticamente mediante:
```javascript
// En theme.js
const savedTheme = localStorage.getItem('appTheme');
if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
}
```

---

## 🔄 Sincronización entre Pestañas

El sistema detecta cambios en localStorage desde otras pestañas:
```javascript
window.addEventListener('storage', function(e) {
    if (e.key === 'appTheme') {
        // Aplicar nuevo tema
    }
});
```

---

## ✨ Ventajas del Sistema

1. **Automático**: Se aplica antes de renderizar la página (sin parpadeo)
2. **Universal**: Funciona en todas las páginas sin configuración adicional
3. **Persistente**: Las preferencias se mantienen entre sesiones
4. **Sincronizado**: Cambios se reflejan en todas las pestañas abiertas
5. **Escalable**: Fácil agregar nuevos temas o variaciones
6. **Accesible**: Mejora la experiencia para usuarios con sensibilidad a la luz

---

## 🐛 Debugging

Para verificar el tema actual en consola:
```javascript
console.log('Tema:', localStorage.getItem('appTheme'));
console.log('Fuente:', localStorage.getItem('fontSize'));
console.log('Dark mode activo:', document.body.classList.contains('dark-theme'));
```

---

## 📱 Compatibilidad

- ✅ Chrome / Edge / Opera
- ✅ Firefox
- ✅ Safari
- ✅ Dispositivos móviles (iOS/Android)
- ✅ Tablets

---

## 🎉 Resultado

El modo oscuro ahora afecta **TODA** la aplicación de forma automática, incluyendo:
- 🏠 Página principal (main)
- 👤 Perfil de usuario
- 📝 Tests de salud (4 tipos)
- 💡 Consejos de salud
- 🏥 Historia clínica
- 💬 Asistente virtual
- 🔐 Login y registro
- ⚙️ Administrador
- 📄 Políticas y términos

**Fecha de implementación**: 11 de octubre de 2025
**Versión de la app**: 2.0.1
**Desarrollador**: CuidAR Team

---

## 🔮 Mejoras Futuras

- [ ] Modo alto contraste
- [ ] Tema personalizado (elegir colores)
- [ ] Tema automático según hora del día
- [ ] Animaciones de transición entre temas
- [ ] Más opciones de accesibilidad
