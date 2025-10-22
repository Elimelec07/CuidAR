-- ============================================
-- CONFIGURACIÓN RÁPIDA PARA PANEL DE ADMIN
-- Ejecuta esto en el SQL Editor de Supabase
-- ============================================

-- 1. Permitir lectura pública de usuarios (para que admin pueda ver todos)
DROP POLICY IF EXISTS "Permitir lectura de usuarios" ON usuarios;
CREATE POLICY "Permitir lectura de usuarios"
ON usuarios FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir lectura de perfiles" ON perfiles_usuario;
CREATE POLICY "Permitir lectura de perfiles"
ON perfiles_usuario FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir lectura de tests diabetes" ON test_diabetes;
CREATE POLICY "Permitir lectura de tests diabetes"
ON test_diabetes FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir lectura de tests HTA" ON test_hta;
CREATE POLICY "Permitir lectura de tests HTA"
ON test_hta FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir lectura de tests psico" ON test_psicologico;
CREATE POLICY "Permitir lectura de tests psico"
ON test_psicologico FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir lectura de tests ansiedad" ON test_ansiedad;
CREATE POLICY "Permitir lectura de tests ansiedad"
ON test_ansiedad FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Permitir lectura de historia clinica" ON historia_clinica;
CREATE POLICY "Permitir lectura de historia clinica"
ON historia_clinica FOR SELECT TO public USING (true);

-- 2. Permitir búsqueda de usuarios por documento (para el login)
DROP POLICY IF EXISTS "Permitir busqueda por documento" ON usuarios;
CREATE POLICY "Permitir busqueda por documento"
ON usuarios FOR SELECT TO anon USING (true);

-- ============================================
-- ✅ LISTO! Ahora puedes:
-- 1. Registrarte en tu aplicación
-- 2. Iniciar sesión
-- 3. Acceder al panel de admin
-- ============================================
