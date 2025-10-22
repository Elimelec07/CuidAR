# 🚀 Guía de Configuración de Supabase para CuidAR

## ✅ Paso 1: Obtener Credenciales de Supabase

1. **Abre tu proyecto en Supabase**: https://supabase.com/dashboard
2. **Ve a Project Settings** (icono ⚙️ en el menú lateral)
3. **Selecciona "API"** en el menú
4. **Copia las siguientes credenciales**:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: Una clave larga que empieza con `eyJ...`

---

## 📝 Paso 2: Configurar las Credenciales

1. **Abre el archivo**: `vitaltech_web/JS/config.js`
2. **Reemplaza** las líneas:

```javascript
const SUPABASE_CONFIG = {
    url: 'TU_SUPABASE_URL_AQUI',  // ← Pega aquí tu Project URL
    anonKey: 'TU_SUPABASE_ANON_KEY_AQUI'  // ← Pega aquí tu anon key
};
```

**Ejemplo de cómo debería quedar**:
```javascript
const SUPABASE_CONFIG = {
    url: 'https://abcdefghijk.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg3NjU0MzIsImV4cCI6MjAxNDM0MTQzMn0.abc123...'
};
```

---

## 🗂️ Paso 3: Crear Buckets de Storage en Supabase

Para que funcionen las fotos de perfil y documentos médicos, necesitas crear los buckets de almacenamiento:

1. **Ve a Storage** en el menú lateral de Supabase
2. **Crea los siguientes buckets**:

### Bucket 1: `fotos-perfil`
- Click en **"New bucket"**
- Name: `fotos-perfil`
- **Public bucket**: ✅ (activar)
- Click **"Create bucket"**

### Bucket 2: `historia-clinica`
- Click en **"New bucket"**
- Name: `historia-clinica`
- **Public bucket**: ✅ (activar)
- Click **"Create bucket"**

---

## 🔐 Paso 4: Configurar Políticas de Seguridad para Storage

### Para `fotos-perfil`:

1. Click en el bucket `fotos-perfil`
2. Ve a **"Policies"**
3. Click **"New Policy"** → **"For full customization"**
4. Crea estas 3 políticas:

**Política 1: Permitir subir fotos**
```sql
CREATE POLICY "Usuarios pueden subir su foto de perfil"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Política 2: Permitir ver fotos**
```sql
CREATE POLICY "Todos pueden ver fotos de perfil"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'fotos-perfil');
```

**Política 3: Permitir actualizar fotos**
```sql
CREATE POLICY "Usuarios pueden actualizar su foto"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'fotos-perfil' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### Para `historia-clinica`:

**Política 1: Permitir subir documentos**
```sql
CREATE POLICY "Usuarios pueden subir sus documentos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'historia-clinica' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Política 2: Permitir ver sus propios documentos**
```sql
CREATE POLICY "Usuarios pueden ver solo sus documentos"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'historia-clinica' AND auth.uid()::text = (storage.foldername(name))[1]);
```

---

## 🔄 Paso 5: Modificar Políticas RLS de Usuarios

Las políticas actuales usan `auth.uid()` pero necesitamos ajustarlas. Ve al **SQL Editor** y ejecuta:

```sql
-- Eliminar políticas antiguas
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON usuarios;

-- Crear nuevas políticas mejoradas
CREATE POLICY "Usuarios pueden insertar su registro"
ON usuarios FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

CREATE POLICY "Usuarios pueden ver su propio perfil"
ON usuarios FOR SELECT
TO authenticated
USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
ON usuarios FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- Política para perfiles
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil extendido" ON perfiles_usuario;

CREATE POLICY "Usuarios pueden gestionar su perfil extendido"
ON perfiles_usuario FOR ALL
TO authenticated
USING (auth.uid() = usuario_id);

-- Políticas para tests
DROP POLICY IF EXISTS "Usuarios pueden ver sus propios tests de diabetes" ON test_diabetes;
CREATE POLICY "Usuarios pueden gestionar sus tests de diabetes"
ON test_diabetes FOR ALL
TO authenticated
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuarios pueden ver sus propios tests de HTA" ON test_hta;
CREATE POLICY "Usuarios pueden gestionar sus tests de HTA"
ON test_hta FOR ALL
TO authenticated
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuarios pueden ver sus propios tests psicológicos" ON test_psicologico;
CREATE POLICY "Usuarios pueden gestionar sus tests psicológicos"
ON test_psicologico FOR ALL
TO authenticated
USING (auth.uid() = usuario_id);

DROP POLICY IF EXISTS "Usuarios pueden ver sus propios tests de ansiedad" ON test_ansiedad;
CREATE POLICY "Usuarios pueden gestionar sus tests de ansiedad"
ON test_ansiedad FOR ALL
TO authenticated
USING (auth.uid() = usuario_id);
```

---

## 📧 Paso 6: Configurar Email Authentication

1. **Ve a Authentication** → **Providers**
2. **Asegúrate de que "Email" esté habilitado**
3. **Desactiva** "Confirm email" si quieres que los usuarios puedan registrarse sin confirmar email (opcional)

---

## 🧪 Paso 7: Probar la Conexión

Después de configurar todo, abre tu aplicación y:

1. **Abre la consola del navegador** (F12)
2. **Verifica** que no aparezca el mensaje: `⚠️ ADVERTENCIA: Configura tus credenciales de Supabase en config.js`
3. **Intenta registrarte** con un nuevo usuario
4. **Verifica** en Supabase → **Authentication** → **Users** que el usuario se creó
5. **Verifica** en **Table Editor** → **usuarios** que los datos se guardaron

---

## 🎯 Funcionalidades Disponibles

Una vez configurado, tendrás acceso a:

✅ **Registro de usuarios** con todos los datos
✅ **Login/Logout** con autenticación segura
✅ **Tests de salud** (Diabetes, HTA, Psicológico, Ansiedad)
✅ **Historia clínica** (subir PDFs y documentos)
✅ **Métricas de salud** (peso, presión, glucosa)
✅ **Fotos de perfil**
✅ **Seguridad RLS** (cada usuario solo ve sus datos)

---

## 📚 Cómo Usar el Servicio de Base de Datos

El objeto `db` está disponible globalmente. Ejemplos:

### Registrar Usuario
```javascript
const resultado = await db.registrarUsuario({
    nombres: 'Juan',
    apellidos: 'Pérez',
    email: 'juan@ejemplo.com',
    password: 'password123',
    fechaNacimiento: '1990-01-01',
    sexo: 'masculino',
    tipoDocumento: 'cc',
    numeroDocumento: '123456789',
    telefono: '3001234567',
    eps: 'Nueva EPS',
    regimen: 'contributivo'
});
```

### Login
```javascript
const resultado = await db.login('juan@ejemplo.com', 'password123');
if (resultado.success) {
    console.log('Usuario:', resultado.user);
}
```

### Guardar Test de Diabetes
```javascript
const usuario = await db.obtenerUsuarioActual();
await db.guardarTestDiabetes(usuario.id, {
    edad: 35,
    imc: 28.5,
    puntuacionTotal: 12,
    nivelRiesgo: 'moderado',
    // ... otros datos
});
```

### Obtener Historia Clínica
```javascript
const usuario = await db.obtenerUsuarioActual();
const resultado = await db.obtenerHistoriaClinica(usuario.id);
console.log('Documentos:', resultado.documentos);
```

---

## ❓ Solución de Problemas

### Error: "Invalid API key"
- Verifica que copiaste correctamente la `anon key` en `config.js`

### Error: "new row violates row-level security policy"
- Asegúrate de haber ejecutado el script de políticas RLS del Paso 5

### Los archivos no se suben
- Verifica que creaste los buckets `fotos-perfil` y `historia-clinica`
- Verifica que los buckets sean públicos
- Verifica que configuraste las políticas de storage

### "User already registered"
- El email ya existe en el sistema
- Usa otro email o elimina el usuario desde Supabase → Authentication → Users

---

## 📞 Soporte

Si tienes problemas, verifica:
1. La consola del navegador (F12) para ver errores
2. Los logs en Supabase → Logs
3. Que todas las políticas RLS estén configuradas correctamente

---

**¡Listo! 🎉 Tu base de datos está configurada y lista para usar.**
