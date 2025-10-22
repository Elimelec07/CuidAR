# 🔐 Configuración de Permisos de Administración

## Problema Actual

El panel de administración no puede ver todos los usuarios porque las políticas RLS (Row Level Security) solo permiten que cada usuario vea sus propios datos.

## ✅ Solución: Permitir Lectura Anónima Temporal

Para que el panel de administración funcione, ejecuta este código en el **SQL Editor** de Supabase:

```sql
-- ============================================
-- PERMITIR LECTURA DE USUARIOS PARA ADMIN
-- ============================================

-- Opción 1: Permitir lectura anónima (MÁS FÁCIL - TEMPORAL)
-- Esto permite que cualquiera pueda LEER usuarios, pero solo los autenticados pueden modificar

DROP POLICY IF EXISTS "Permitir lectura de usuarios" ON usuarios;

CREATE POLICY "Permitir lectura de usuarios"
ON usuarios FOR SELECT
TO public
USING (true);

-- También para perfiles
DROP POLICY IF EXISTS "Permitir lectura de perfiles" ON perfiles_usuario;

CREATE POLICY "Permitir lectura de perfiles"
ON perfiles_usuario FOR SELECT
TO public
USING (true);

-- Para tests (para que admin pueda ver estadísticas)
DROP POLICY IF EXISTS "Permitir lectura de tests de diabetes" ON test_diabetes;
CREATE POLICY "Permitir lectura de tests de diabetes"
ON test_diabetes FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Permitir lectura de tests de HTA" ON test_hta;
CREATE POLICY "Permitir lectura de tests de HTA"
ON test_hta FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Permitir lectura de tests psicológicos" ON test_psicologico;
CREATE POLICY "Permitir lectura de tests psicológicos"
ON test_psicologico FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Permitir lectura de tests de ansiedad" ON test_ansiedad;
CREATE POLICY "Permitir lectura de tests de ansiedad"
ON test_ansiedad FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Permitir lectura de historia clínica" ON historia_clinica;
CREATE POLICY "Permitir lectura de historia clínica"
ON historia_clinica FOR SELECT
TO public
USING (true);
```

## ⚠️ Nota de Seguridad

Esta configuración permite que cualquiera pueda **LEER** los datos, pero:
- ✅ Solo los usuarios autenticados pueden **MODIFICAR** sus propios datos
- ✅ Solo los usuarios autenticados pueden **INSERTAR** nuevos datos
- ✅ Solo los usuarios autenticados pueden **ELIMINAR** sus datos
- ❌ Los datos son visibles para cualquiera que tenga acceso al frontend

## 🔒 Opción 2: Implementar Rol de Admin (MÁS SEGURO)

Si quieres una solución más segura con roles de admin, ejecuta esto en su lugar:

```sql
-- ============================================
-- SISTEMA DE ROLES CON ADMIN
-- ============================================

-- 1. Crear función para verificar si es admin
CREATE OR REPLACE FUNCTION es_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM usuarios
        WHERE id = auth.uid()
        AND rol = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Política para usuarios: ver su propio perfil O ser admin
DROP POLICY IF EXISTS "Usuarios ven su perfil o admin ve todos" ON usuarios;

CREATE POLICY "Usuarios ven su perfil o admin ve todos"
ON usuarios FOR SELECT
TO authenticated
USING (
    auth.uid() = id OR es_admin()
);

-- 3. Lo mismo para perfiles
DROP POLICY IF EXISTS "Usuarios ven su perfil o admin ve todos" ON perfiles_usuario;

CREATE POLICY "Usuarios ven su perfil o admin ve todos"
ON perfiles_usuario FOR SELECT
TO authenticated
USING (
    auth.uid() = usuario_id OR es_admin()
);

-- 4. Para tests
DROP POLICY IF EXISTS "Usuarios ven sus tests o admin ve todos" ON test_diabetes;
CREATE POLICY "Usuarios ven sus tests o admin ve todos"
ON test_diabetes FOR SELECT
TO authenticated
USING (
    auth.uid() = usuario_id OR es_admin()
);

DROP POLICY IF EXISTS "Usuarios ven sus tests o admin ve todos" ON test_hta;
CREATE POLICY "Usuarios ven sus tests o admin ve todos"
ON test_hta FOR SELECT
TO authenticated
USING (
    auth.uid() = usuario_id OR es_admin()
);

DROP POLICY IF EXISTS "Usuarios ven sus tests o admin ve todos" ON test_psicologico;
CREATE POLICY "Usuarios ven sus tests o admin ve todos"
ON test_psicologico FOR SELECT
TO authenticated
USING (
    auth.uid() = usuario_id OR es_admin()
);

DROP POLICY IF EXISTS "Usuarios ven sus tests o admin ve todos" ON test_ansiedad;
CREATE POLICY "Usuarios ven sus tests o admin ve todos"
ON test_ansiedad FOR SELECT
TO authenticated
USING (
    auth.uid() = usuario_id OR es_admin()
);

DROP POLICY IF EXISTS "Usuarios ven su historia o admin ve todo" ON historia_clinica;
CREATE POLICY "Usuarios ven su historia o admin ve todo"
ON historia_clinica FOR SELECT
TO authenticated
USING (
    auth.uid() = usuario_id OR es_admin()
);

-- 5. Crear usuario admin inicial
-- IMPORTANTE: Cambia estos valores por los datos reales de tu admin
INSERT INTO usuarios (
    nombres, 
    apellidos, 
    fecha_nacimiento, 
    sexo, 
    tipo_documento, 
    numero_documento, 
    email, 
    telefono, 
    password_hash, 
    eps, 
    regimen, 
    rol
) VALUES (
    'Admin',
    'CuidAR',
    '1990-01-01',
    'otro',
    'cc',
    '999999999',
    'admin@cuidar.com',
    '3001234567',
    'managed_by_supabase_auth',
    'Sistema',
    'especial',
    'admin'
)
ON CONFLICT (numero_documento) DO UPDATE
SET rol = 'admin';

-- 6. Crear perfil para admin
INSERT INTO perfiles_usuario (usuario_id)
SELECT id FROM usuarios WHERE numero_documento = '999999999'
ON CONFLICT (usuario_id) DO NOTHING;

-- 7. Crear configuración para admin
INSERT INTO configuraciones_usuario (usuario_id)
SELECT id FROM usuarios WHERE numero_documento = '999999999'
ON CONFLICT (usuario_id) DO NOTHING;
```

## 📝 Cómo Usar el Sistema de Admin

### Si usaste la Opción 1 (Lectura Pública):
- ✅ Ya funciona
- Cualquiera puede ver la página de admin
- Solo pega el código en SQL Editor

### Si usaste la Opción 2 (Roles):
1. Ejecuta el código SQL
2. Regístrate con el email `admin@cuidar.com` en tu aplicación
3. Usa la contraseña que configuraste
4. El usuario tendrá automáticamente permisos de admin
5. Solo los usuarios con rol='admin' pueden ver todos los datos

## 🔄 Cambiar Usuario Normal a Admin

Si ya tienes un usuario registrado y quieres hacerlo admin:

```sql
-- Cambiar rol de usuario a admin por email
UPDATE usuarios 
SET rol = 'admin'
WHERE email = 'TU_EMAIL_AQUI';

-- O por número de documento
UPDATE usuarios 
SET rol = 'admin'
WHERE numero_documento = 'TU_DOCUMENTO_AQUI';

-- Ver todos los admins actuales
SELECT nombres, apellidos, email, rol
FROM usuarios
WHERE rol = 'admin';
```

## ✅ Verificar que Funcionó

Después de ejecutar cualquiera de las opciones:

1. Abre tu aplicación
2. Ve a la página de admin
3. Click en "Ver Lista de Usuarios"
4. Deberías ver todos los usuarios registrados

Si no funciona, verifica en la consola del navegador (F12) si hay errores.
