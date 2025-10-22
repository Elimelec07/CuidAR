// ============================================
// SERVICIO DE BASE DE DATOS PARA CUIDAR
// Maneja todas las operaciones con Supabase
// ============================================

class DatabaseService {
    constructor() {
        // Inicializar cliente de Supabase
        if (typeof supabase === 'undefined') {
            console.error('❌ Supabase no está cargado. Asegúrate de incluir el script de Supabase.');
            return;
        }
        
        this.client = supabase.createClient(
            window.SUPABASE_CONFIG.url,
            window.SUPABASE_CONFIG.anonKey
        );
    }

    // ============================================
    // AUTENTICACIÓN
    // ============================================

    /**
     * Registrar nuevo usuario
     */
    async registrarUsuario(userData) {
        try {
            // 1. Crear usuario en Supabase Auth
            const { data: authData, error: authError } = await this.client.auth.signUp({
                email: userData.email,
                password: userData.password,
                options: {
                    data: {
                        nombres: userData.nombres,
                        apellidos: userData.apellidos,
                        numero_documento: userData.numeroDocumento
                    }
                }
            });

            if (authError) throw authError;

            // 2. Insertar datos adicionales en tabla usuarios
            const { data: usuarioData, error: usuarioError } = await this.client
                .from('usuarios')
                .insert([{
                    id: authData.user.id,
                    nombres: userData.nombres,
                    apellidos: userData.apellidos,
                    fecha_nacimiento: userData.fechaNacimiento,
                    sexo: userData.sexo,
                    tipo_documento: userData.tipoDocumento,
                    numero_documento: userData.numeroDocumento,
                    email: userData.email,
                    telefono: userData.telefono,
                    password_hash: 'managed_by_supabase_auth',
                    eps: userData.eps,
                    regimen: userData.regimen
                }])
                .select()
                .single();

            if (usuarioError) throw usuarioError;

            // 3. Crear perfil de usuario vacío
            await this.client
                .from('perfiles_usuario')
                .insert([{
                    usuario_id: authData.user.id
                }]);

            // 4. Crear configuraciones por defecto
            await this.client
                .from('configuraciones_usuario')
                .insert([{
                    usuario_id: authData.user.id
                }]);

            return { success: true, user: usuarioData };
        } catch (error) {
            console.error('Error al registrar usuario:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Iniciar sesión
     */
    async login(email, password) {
        try {
            const { data, error } = await this.client.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (error) throw error;

            // Obtener datos completos del usuario
            const userData = await this.obtenerUsuarioActual();
            
            return { success: true, user: userData };
        } catch (error) {
            console.error('Error al iniciar sesión:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Cerrar sesión
     */
    async logout() {
        try {
            const { error } = await this.client.auth.signOut();
            if (error) throw error;
            return { success: true };
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtener usuario actual
     */
    async obtenerUsuarioActual() {
        try {
            const { data: { user } } = await this.client.auth.getUser();
            
            if (!user) return null;

            const { data, error } = await this.client
                .from('usuarios')
                .select('*, perfiles_usuario(*)')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error al obtener usuario:', error);
            return null;
        }
    }

    /**
     * Verificar si el usuario está autenticado
     */
    async estaAutenticado() {
        const { data: { session } } = await this.client.auth.getSession();
        return session !== null;
    }

    // ============================================
    // TESTS DE SALUD
    // ============================================

    /**
     * Guardar resultado de test de diabetes
     */
    async guardarTestDiabetes(usuarioId, datosTest) {
        try {
            const { data, error } = await this.client
                .from('test_diabetes')
                .insert([{
                    usuario_id: usuarioId,
                    edad: datosTest.edad,
                    imc: datosTest.imc,
                    circunferencia_cintura: datosTest.circunferenciaCintura,
                    actividad_fisica: datosTest.actividadFisica,
                    consumo_vegetales: datosTest.consumoVegetales,
                    medicacion_presion: datosTest.medicacionPresion,
                    glucosa_alta: datosTest.glucosaAlta,
                    antecedentes_familiares: datosTest.antecedentesFamiliares,
                    puntuacion_total: datosTest.puntuacionTotal,
                    nivel_riesgo: datosTest.nivelRiesgo,
                    recomendaciones: datosTest.recomendaciones
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error al guardar test de diabetes:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Guardar resultado de test de hipertensión
     */
    async guardarTestHTA(usuarioId, datosTest) {
        try {
            const { data, error } = await this.client
                .from('test_hta')
                .insert([{
                    usuario_id: usuarioId,
                    edad: datosTest.edad,
                    presion_sistolica: datosTest.presionSistolica,
                    presion_diastolica: datosTest.presionDiastolica,
                    antecedentes_familiares: datosTest.antecedentesFamiliares,
                    sobrepeso: datosTest.sobrepeso,
                    sedentarismo: datosTest.sedentarismo,
                    consumo_sal_alto: datosTest.consumoSalAlto,
                    consumo_alcohol: datosTest.consumoAlcohol,
                    estres: datosTest.estres,
                    puntuacion_total: datosTest.puntuacionTotal,
                    nivel_riesgo: datosTest.nivelRiesgo,
                    clasificacion_presion: datosTest.clasificacionPresion,
                    recomendaciones: datosTest.recomendaciones
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error al guardar test de HTA:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Guardar resultado de test psicológico
     */
    async guardarTestPsicologico(usuarioId, datosTest) {
        try {
            const { data, error } = await this.client
                .from('test_psicologico')
                .insert([{
                    usuario_id: usuarioId,
                    tipo_test: datosTest.tipoTest,
                    respuestas: datosTest.respuestas,
                    puntuacion_total: datosTest.puntuacionTotal,
                    nivel: datosTest.nivel,
                    recomendaciones: datosTest.recomendaciones
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error al guardar test psicológico:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Guardar resultado de test de ansiedad
     */
    async guardarTestAnsiedad(usuarioId, datosTest) {
        try {
            const { data, error } = await this.client
                .from('test_ansiedad')
                .insert([{
                    usuario_id: usuarioId,
                    respuestas: datosTest.respuestas,
                    puntuacion_total: datosTest.puntuacionTotal,
                    nivel_ansiedad: datosTest.nivelAnsiedad,
                    sintomas_principales: datosTest.sintomasPrincipales,
                    recomendaciones: datosTest.recomendaciones
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error al guardar test de ansiedad:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtener historial de tests de un usuario
     */
    async obtenerHistorialTests(usuarioId) {
        try {
            const [diabetes, hta, psicologico, ansiedad] = await Promise.all([
                this.client.from('test_diabetes').select('*').eq('usuario_id', usuarioId).order('fecha_realizacion', { ascending: false }),
                this.client.from('test_hta').select('*').eq('usuario_id', usuarioId).order('fecha_realizacion', { ascending: false }),
                this.client.from('test_psicologico').select('*').eq('usuario_id', usuarioId).order('fecha_realizacion', { ascending: false }),
                this.client.from('test_ansiedad').select('*').eq('usuario_id', usuarioId).order('fecha_realizacion', { ascending: false })
            ]);

            return {
                diabetes: diabetes.data || [],
                hta: hta.data || [],
                psicologico: psicologico.data || [],
                ansiedad: ansiedad.data || []
            };
        } catch (error) {
            console.error('Error al obtener historial de tests:', error);
            return null;
        }
    }

    // ============================================
    // HISTORIA CLÍNICA
    // ============================================

    /**
     * Subir documento a historia clínica
     */
    async subirDocumentoHistoria(usuarioId, archivo, metadatos) {
        try {
            // 1. Subir archivo a Storage
            const nombreArchivo = `${usuarioId}/${Date.now()}_${archivo.name}`;
            const { data: uploadData, error: uploadError } = await this.client.storage
                .from('historia-clinica')
                .upload(nombreArchivo, archivo);

            if (uploadError) throw uploadError;

            // 2. Obtener URL pública
            const { data: { publicUrl } } = this.client.storage
                .from('historia-clinica')
                .getPublicUrl(nombreArchivo);

            // 3. Guardar metadatos en la tabla
            const { data, error } = await this.client
                .from('historia_clinica')
                .insert([{
                    usuario_id: usuarioId,
                    tipo_documento: metadatos.tipo || 'otro',
                    nombre_archivo: archivo.name,
                    archivo_url: publicUrl,
                    descripcion: metadatos.descripcion,
                    fecha_documento: metadatos.fecha,
                    tamano_archivo: archivo.size,
                    tipo_mime: archivo.type
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error al subir documento:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtener documentos de historia clínica
     */
    async obtenerHistoriaClinica(usuarioId) {
        try {
            const { data, error } = await this.client
                .from('historia_clinica')
                .select('*')
                .eq('usuario_id', usuarioId)
                .order('fecha_subida', { ascending: false });

            if (error) throw error;
            return { success: true, documentos: data };
        } catch (error) {
            console.error('Error al obtener historia clínica:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // MÉTRICAS DE SALUD
    // ============================================

    /**
     * Guardar métrica de salud
     */
    async guardarMetrica(usuarioId, tipoMetrica, valor, unidad, notas = '') {
        try {
            const { data, error } = await this.client
                .from('metricas_salud')
                .insert([{
                    usuario_id: usuarioId,
                    tipo_metrica: tipoMetrica,
                    valor: valor,
                    unidad: unidad,
                    notas: notas
                }])
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error al guardar métrica:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Obtener métricas de salud
     */
    async obtenerMetricas(usuarioId, tipoMetrica = null, limite = 50) {
        try {
            let query = this.client
                .from('metricas_salud')
                .select('*')
                .eq('usuario_id', usuarioId)
                .order('fecha_medicion', { ascending: false })
                .limit(limite);

            if (tipoMetrica) {
                query = query.eq('tipo_metrica', tipoMetrica);
            }

            const { data, error } = await query;
            if (error) throw error;
            return { success: true, metricas: data };
        } catch (error) {
            console.error('Error al obtener métricas:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // PERFIL DE USUARIO
    // ============================================

    /**
     * Actualizar perfil de usuario
     */
    async actualizarPerfil(usuarioId, datosPerfil) {
        try {
            const { data, error } = await this.client
                .from('perfiles_usuario')
                .update(datosPerfil)
                .eq('usuario_id', usuarioId)
                .select()
                .single();

            if (error) throw error;
            return { success: true, data };
        } catch (error) {
            console.error('Error al actualizar perfil:', error);
            return { success: false, error: error.message };
        }
    }

    /**
     * Subir foto de perfil
     */
    async subirFotoPerfil(usuarioId, archivo) {
        try {
            // 1. Subir imagen a Storage
            const nombreArchivo = `${usuarioId}/perfil_${Date.now()}.${archivo.name.split('.').pop()}`;
            const { data: uploadData, error: uploadError } = await this.client.storage
                .from('fotos-perfil')
                .upload(nombreArchivo, archivo);

            if (uploadError) throw uploadError;

            // 2. Obtener URL pública
            const { data: { publicUrl } } = this.client.storage
                .from('fotos-perfil')
                .getPublicUrl(nombreArchivo);

            // 3. Actualizar perfil con la URL
            await this.actualizarPerfil(usuarioId, { foto_perfil_url: publicUrl });

            return { success: true, url: publicUrl };
        } catch (error) {
            console.error('Error al subir foto de perfil:', error);
            return { success: false, error: error.message };
        }
    }

    // ============================================
    // ADMIN - Obtener todos los usuarios
    // ============================================

    /**
     * Obtener todos los usuarios (solo para admin)
     */
    async obtenerTodosUsuarios() {
        try {
            const { data, error } = await this.client
                .from('usuarios')
                .select('*, perfiles_usuario(*)')
                .order('fecha_registro', { ascending: false });

            if (error) throw error;
            return { success: true, usuarios: data };
        } catch (error) {
            console.error('Error al obtener usuarios:', error);
            return { success: false, error: error.message };
        }
    }
}

// Crear instancia global del servicio
window.db = new DatabaseService();
