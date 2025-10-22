// ============================================
// ADMIN.JS - Sistema de administración con Supabase
// ============================================

let allUsers = [];

document.addEventListener('DOMContentLoaded', async function() {
    // Verificar autenticación
    await verificarAutenticacion();
    
    // Cargar estadísticas
    await loadStats();
    
    // Eventos de botones
    document.getElementById('downloadExcelBtn').addEventListener('click', downloadExcel);
    document.getElementById('viewUsersBtn').addEventListener('click', toggleUsersTable);
    document.getElementById('clearDataBtn').addEventListener('click', clearAllData);
    
    // Evento de búsqueda en la tabla
    const searchInput = document.getElementById('searchUsers');
    if (searchInput) {
        searchInput.addEventListener('input', filterUsers);
    }
});

// Verificar que el usuario esté autenticado
async function verificarAutenticacion() {
    const estaAuth = await db.estaAutenticado();
    if (!estaAuth) {
        alert('⚠️ Debes iniciar sesión para acceder al panel de administración.');
        window.location.href = '../index.html';
        return;
    }
    
    // Verificar si es admin (opcional - puedes implementar esto después)
    const usuario = await db.obtenerUsuarioActual();
    if (usuario && usuario.rol !== 'admin') {
        // Por ahora permitimos acceso a todos, pero puedes descomentar esto:
        // alert('⚠️ No tienes permisos de administrador.');
        // window.location.href = 'main.html';
        // return;
    }
}

// Obtener todos los usuarios desde Supabase
async function getAllUsers() {
    try {
        const resultado = await db.obtenerTodosUsuarios();
        
        if (!resultado.success) {
            console.error('Error al obtener usuarios:', resultado.error);
            return [];
        }
        
        allUsers = resultado.usuarios || [];
        return allUsers;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return [];
    }
}

// Cargar estadísticas
async function loadStats() {
    const users = await getAllUsers();
    document.getElementById('totalUsers').textContent = users.length;
}

// Función para descargar Excel
async function downloadExcel() {
    const users = await getAllUsers();
    
    if (users.length === 0) {
        alert('No hay usuarios registrados para exportar.');
        return;
    }
    
    // Mostrar mensaje de carga
    const btn = document.getElementById('downloadExcelBtn');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span>Generando Excel...</span><i class="fas fa-spinner fa-spin"></i>';
    btn.disabled = true;
    
    try {
        // Preparar datos para Excel con resultados de tests
        const excelDataPromises = users.map(async (user) => {
            // Obtener historial de tests del usuario
            const historial = await db.obtenerHistorialTests(user.id);
            
            // Obtener último test de cada tipo
            const ultimoDiabetes = historial?.diabetes?.[0] || null;
            const ultimoHTA = historial?.hta?.[0] || null;
            const ultimoPsicologico = historial?.psicologico?.[0] || null;
            const ultimoAnsiedad = historial?.ansiedad?.[0] || null;
            
            // Obtener historias clínicas del usuario
            const historiasResult = await db.obtenerHistoriaClinica(user.id);
            const historias = historiasResult?.documentos || [];
            const numHistorias = historias.length;
            const historiasNombres = historias.map(h => h.nombre_archivo).join(', ');
            const ultimaHistoria = historias.length > 0 ? 
                new Date(historias[0].fecha_subida).toLocaleDateString('es-ES') : '';
            
            return {
                'Nombres': user.nombres || '',
                'Apellidos': user.apellidos || '',
                'Tipo de Documento': formatTipoDocumentoLargo(user.tipo_documento) || '',
                'N° Documento': user.numero_documento || '',
                'Email': user.email || '',
                'Teléfono': user.telefono || '',
                'Sexo': user.sexo ? user.sexo.charAt(0).toUpperCase() + user.sexo.slice(1) : '',
                'Fecha de Nacimiento': user.fecha_nacimiento || '',
                'Edad': calcularEdad(user.fecha_nacimiento) || '',
                'EPS': user.eps || '',
                'Régimen': user.regimen ? user.regimen.charAt(0).toUpperCase() + user.regimen.slice(1) : '',
                
                // Historias Clínicas
                'N° Historias Clínicas': numHistorias,
                'Nombres de Archivos': historiasNombres || 'Sin historias',
                'Última Historia Subida': ultimaHistoria || '',
                
                // Test de Diabetes (FINDRISC)
                'Test Diabetes - Puntos': ultimoDiabetes?.puntuacion_total ?? '',
                'Test Diabetes - Riesgo': ultimoDiabetes?.nivel_riesgo ? 
                    ultimoDiabetes.nivel_riesgo.charAt(0).toUpperCase() + ultimoDiabetes.nivel_riesgo.slice(1) : 
                    'No realizado',
                'Test Diabetes - IMC': ultimoDiabetes?.imc ?? '',
                'Test Diabetes - Fecha': ultimoDiabetes?.fecha_realizacion ? 
                    new Date(ultimoDiabetes.fecha_realizacion).toLocaleDateString('es-ES') : '',
                
                // Test de Hipertensión
                'Test HTA - Puntos': ultimoHTA?.puntuacion_total ?? '',
                'Test HTA - Riesgo': ultimoHTA?.nivel_riesgo ? 
                    ultimoHTA.nivel_riesgo.charAt(0).toUpperCase() + ultimoHTA.nivel_riesgo.slice(1) : 
                    'No realizado',
                'Test HTA - Presión Sistólica': ultimoHTA?.presion_sistolica ?? '',
                'Test HTA - Presión Diastólica': ultimoHTA?.presion_diastolica ?? '',
                'Test HTA - Fecha': ultimoHTA?.fecha_realizacion ? 
                    new Date(ultimoHTA.fecha_realizacion).toLocaleDateString('es-ES') : '',
                
                // Test Psicológico
                'Test Psicológico - Puntos': ultimoPsicologico?.puntuacion_total ?? '',
                'Test Psicológico - Nivel': ultimoPsicologico?.nivel ? 
                    ultimoPsicologico.nivel.charAt(0).toUpperCase() + ultimoPsicologico.nivel.slice(1) : 
                    'No realizado',
                'Test Psicológico - Tipo': ultimoPsicologico?.tipo_test ?? '',
                'Test Psicológico - Fecha': ultimoPsicologico?.fecha_realizacion ? 
                    new Date(ultimoPsicologico.fecha_realizacion).toLocaleDateString('es-ES') : '',
                
                // Test de Ansiedad (BAI)
                'Test Ansiedad - Puntos': ultimoAnsiedad?.puntuacion_total ?? '',
                'Test Ansiedad - Nivel': ultimoAnsiedad?.nivel_ansiedad ? 
                    ultimoAnsiedad.nivel_ansiedad.charAt(0).toUpperCase() + ultimoAnsiedad.nivel_ansiedad.slice(1) : 
                    'No realizado',
                'Test Ansiedad - Fecha': ultimoAnsiedad?.fecha_realizacion ? 
                    new Date(ultimoAnsiedad.fecha_realizacion).toLocaleDateString('es-ES') : '',
                
                'Fecha de Registro': user.fecha_registro ? 
                    new Date(user.fecha_registro).toLocaleDateString('es-ES') : '',
                'Último Acceso': user.ultimo_acceso ? 
                    new Date(user.ultimo_acceso).toLocaleDateString('es-ES') : '',
                'Estado': user.activo ? 'Activo' : 'Inactivo'
            };
        });
        
        const excelData = await Promise.all(excelDataPromises);
        
        // Crear libro de Excel
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(excelData);
        
        // Ajustar ancho de columnas
        const columnWidths = [
            { wch: 20 }, // Nombres
            { wch: 20 }, // Apellidos
            { wch: 25 }, // Tipo Documento
            { wch: 15 }, // N° Documento
            { wch: 30 }, // Email
            { wch: 15 }, // Teléfono
            { wch: 12 }, // Sexo
            { wch: 18 }, // Fecha Nacimiento
            { wch: 10 }, // Edad
            { wch: 20 }, // EPS
            { wch: 15 }, // Régimen
            { wch: 20 }, // N° Historias Clínicas
            { wch: 50 }, // Nombres de Archivos
            { wch: 18 }, // Última Historia Subida
            { wch: 18 }, // Test Diabetes - Puntos
            { wch: 20 }, // Test Diabetes - Riesgo
            { wch: 12 }, // Test Diabetes - IMC
            { wch: 18 }, // Test Diabetes - Fecha
            { wch: 15 }, // Test HTA - Puntos
            { wch: 20 }, // Test HTA - Riesgo
            { wch: 15 }, // Test HTA - Sistólica
            { wch: 15 }, // Test HTA - Diastólica
            { wch: 18 }, // Test HTA - Fecha
            { wch: 18 }, // Test Psico - Puntos
            { wch: 20 }, // Test Psico - Nivel
            { wch: 15 }, // Test Psico - Tipo
            { wch: 18 }, // Test Psico - Fecha
            { wch: 18 }, // Test Ansiedad - Puntos
            { wch: 20 }, // Test Ansiedad - Nivel
            { wch: 18 }, // Test Ansiedad - Fecha
            { wch: 18 }, // Fecha Registro
            { wch: 18 }, // Último Acceso
            { wch: 12 }  // Estado
        ];
        ws['!cols'] = columnWidths;
        
        // Agregar hoja al libro
        XLSX.utils.book_append_sheet(wb, ws, 'Usuarios Registrados');
        
        // Generar nombre de archivo con fecha
        const fecha = new Date().toISOString().split('T')[0];
        const fileName = `CuidAR_Usuarios_${fecha}.xlsx`;
        
        // Descargar archivo
        XLSX.writeFile(wb, fileName);
        
        alert(`✅ Excel descargado exitosamente: ${fileName}\n\nTotal de usuarios: ${users.length}\n\nIncluye:\n• Datos personales y de contacto\n• Historias Clínicas subidas\n• Resultados de tests:\n  - Diabetes (FINDRISC)\n  - Hipertensión (HTA)\n  - Psicológico\n  - Ansiedad (BAI)`);
        
    } catch (error) {
        console.error('Error al generar Excel:', error);
        alert('❌ Error al generar el archivo Excel. Por favor, intenta nuevamente.');
    } finally {
        // Restaurar botón
        btn.innerHTML = originalHTML;
        btn.disabled = false;
    }
}

// Función para formatear tipo de documento
function formatTipoDocumento(tipo) {
    const tipos = {
        'cc': 'C.C.',
        'ti': 'T.I.',
        'ce': 'C.E.',
        'pasaporte': 'Pasaporte'
    };
    return tipos[tipo] || tipo;
}

// Función para formatear tipo de documento (formato largo para Excel)
function formatTipoDocumentoLargo(tipo) {
    const tipos = {
        'cc': 'Cédula de Ciudadanía',
        'ti': 'Tarjeta de Identidad',
        'ce': 'Cédula de Extranjería',
        'pasaporte': 'Pasaporte'
    };
    return tipos[tipo] || tipo;
}

// Función para calcular edad
function calcularEdad(fechaNacimiento) {
    if (!fechaNacimiento) return '';
    const birthDate = new Date(fechaNacimiento);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
}

// Mostrar/Ocultar tabla de usuarios
async function toggleUsersTable() {
    const container = document.getElementById('usersTableContainer');
    const btn = document.getElementById('viewUsersBtn');
    
    if (container.style.display === 'none') {
        await loadUsersTable();
        container.style.display = 'block';
        btn.innerHTML = '<span>Ocultar Lista de Usuarios</span><i class="fas fa-eye-slash"></i>';
        
        // Scroll suave hacia la tabla
        setTimeout(() => {
            container.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
    } else {
        container.style.display = 'none';
        btn.innerHTML = '<span>Ver Lista de Usuarios</span><i class="fas fa-eye"></i>';
    }
}

// Cargar tabla de usuarios
async function loadUsersTable() {
    const users = await getAllUsers();
    const tbody = document.getElementById('usersTableBody');
    const userCount = document.getElementById('userCount');
    tbody.innerHTML = '';
    
    if (userCount) {
        userCount.textContent = `${users.length} usuario${users.length !== 1 ? 's' : ''}`;
    }
    
    if (users.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="12" style="text-align: center; padding: 2rem; color: #999;">
                    <i class="fas fa-users" style="font-size: 3rem; margin-bottom: 1rem; display: block; opacity: 0.3;"></i>
                    No hay usuarios registrados
                </td>
            </tr>
        `;
        return;
    }
    
    users.forEach((user, index) => {
        const row = document.createElement('tr');
        row.setAttribute('data-user-id', user.id);
        row.innerHTML = `
            <td style="font-weight: 600; color: var(--color-primary);">${index + 1}</td>
            <td>${user.nombres || '-'}</td>
            <td>${user.apellidos || '-'}</td>
            <td><span class="badge badge-info">${formatTipoDocumento(user.tipo_documento) || '-'}</span></td>
            <td style="font-weight: 600;">${user.numero_documento || '-'}</td>
            <td><a href="mailto:${user.email}" style="color: var(--color-secondary);">${user.email || '-'}</a></td>
            <td>${user.telefono || '-'}</td>
            <td><span class="badge ${user.sexo === 'masculino' ? 'badge-primary' : 'badge-danger'}">${user.sexo ? user.sexo.charAt(0).toUpperCase() + user.sexo.slice(1) : '-'}</span></td>
            <td style="text-align: center;">${calcularEdad(user.fecha_nacimiento) || '-'}</td>
            <td>${user.eps || '-'}</td>
            <td><span class="badge badge-success">${user.regimen ? user.regimen.charAt(0).toUpperCase() + user.regimen.slice(1) : '-'}</span></td>
            <td>
                <button class="btn-table-action btn-view" onclick="viewUserDetails('${user.id}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-table-action btn-delete" onclick="deleteUser('${user.id}')" title="Eliminar usuario">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Filtrar usuarios en la tabla
function filterUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const rows = document.querySelectorAll('#usersTableBody tr');
    let visibleCount = 0;
    
    rows.forEach(row => {
        const text = row.textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
        } else {
            row.style.display = 'none';
        }
    });
    
    const userCount = document.getElementById('userCount');
    if (userCount) {
        userCount.textContent = `${visibleCount} usuario${visibleCount !== 1 ? 's' : ''}`;
    }
}

// Ver detalles del usuario
async function viewUserDetails(usuarioId) {
    try {
        // Buscar usuario en el array cargado
        const user = allUsers.find(u => u.id === usuarioId);
        
        if (!user) {
            alert('Usuario no encontrado.');
            return;
        }
        
        // Obtener historial de tests del usuario
        const historial = await db.obtenerHistorialTests(usuarioId);
        
        // Obtener historias clínicas
        const historiasResult = await db.obtenerHistoriaClinica(usuarioId);
        const historias = historiasResult?.documentos || [];
        
        let mensaje = `👤 INFORMACIÓN DETALLADA DEL USUARIO\n\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `📋 DATOS PERSONALES\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `Nombre completo: ${user.nombres} ${user.apellidos}\n`;
        mensaje += `${formatTipoDocumento(user.tipo_documento)}: ${user.numero_documento}\n`;
        mensaje += `Sexo: ${user.sexo ? user.sexo.charAt(0).toUpperCase() + user.sexo.slice(1) : 'No especificado'}\n`;
        mensaje += `Fecha de nacimiento: ${user.fecha_nacimiento ? new Date(user.fecha_nacimiento).toLocaleDateString('es-ES') : 'No especificada'}\n`;
        mensaje += `Edad: ${calcularEdad(user.fecha_nacimiento) || 'N/A'} años\n\n`;
        
        mensaje += `📞 CONTACTO\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `Email: ${user.email}\n`;
        mensaje += `Teléfono: ${user.telefono || 'No especificado'}\n\n`;
        
        mensaje += `🏥 INFORMACIÓN MÉDICA\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        mensaje += `EPS: ${user.eps || 'No especificada'}\n`;
        mensaje += `Régimen: ${user.regimen ? user.regimen.charAt(0).toUpperCase() + user.regimen.slice(1) : 'No especificado'}\n\n`;
        
        // Historias Clínicas
        mensaje += `📄 HISTORIAS CLÍNICAS\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        if (historias.length > 0) {
            mensaje += `Total de documentos: ${historias.length}\n`;
            historias.forEach((h, index) => {
                mensaje += `${index + 1}. ${h.nombre_archivo} (${new Date(h.fecha_subida).toLocaleDateString('es-ES')})\n`;
            });
            mensaje += `\n`;
        } else {
            mensaje += `No hay historias clínicas subidas\n\n`;
        }
        
        mensaje += `📊 RESULTADOS DE TESTS\n`;
        mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
        
        // Test de Diabetes
        if (historial?.diabetes && historial.diabetes.length > 0) {
            const test = historial.diabetes[0];
            mensaje += `🩺 Diabetes (FINDRISC): ${test.puntuacion_total} pts - Riesgo ${test.nivel_riesgo?.toUpperCase() || 'N/A'}\n`;
            mensaje += `   IMC: ${test.imc || 'N/A'}\n`;
            mensaje += `   Fecha: ${new Date(test.fecha_realizacion).toLocaleDateString('es-ES')}\n`;
            mensaje += `   Total de tests: ${historial.diabetes.length}\n`;
        } else {
            mensaje += `🩺 Diabetes: No realizado\n`;
        }
        
        // Test de HTA
        if (historial?.hta && historial.hta.length > 0) {
            const test = historial.hta[0];
            mensaje += `❤️ Hipertensión: ${test.puntuacion_total} pts - Riesgo ${test.nivel_riesgo?.toUpperCase() || 'N/A'}\n`;
            mensaje += `   Presión: ${test.presion_sistolica}/${test.presion_diastolica} mmHg\n`;
            mensaje += `   Fecha: ${new Date(test.fecha_realizacion).toLocaleDateString('es-ES')}\n`;
            mensaje += `   Total de tests: ${historial.hta.length}\n`;
        } else {
            mensaje += `❤️ Hipertensión: No realizado\n`;
        }
        
        // Test Psicológico
        if (historial?.psicologico && historial.psicologico.length > 0) {
            const test = historial.psicologico[0];
            mensaje += `😰 Test Psicológico: ${test.puntuacion_total} pts - Nivel ${test.nivel?.toUpperCase() || 'N/A'}\n`;
            mensaje += `   Tipo: ${test.tipo_test || 'N/A'}\n`;
            mensaje += `   Fecha: ${new Date(test.fecha_realizacion).toLocaleDateString('es-ES')}\n`;
            mensaje += `   Total de tests: ${historial.psicologico.length}\n`;
        } else {
            mensaje += `😰 Test Psicológico: No realizado\n`;
        }
        
        // Test de Ansiedad
        if (historial?.ansiedad && historial.ansiedad.length > 0) {
            const test = historial.ansiedad[0];
            mensaje += `😟 Ansiedad (BAI): ${test.puntuacion_total} pts - Nivel ${test.nivel_ansiedad?.toUpperCase() || 'N/A'}\n`;
            mensaje += `   Fecha: ${new Date(test.fecha_realizacion).toLocaleDateString('es-ES')}\n`;
            mensaje += `   Total de tests: ${historial.ansiedad.length}\n`;
        } else {
            mensaje += `😟 Ansiedad: No realizado\n`;
        }
        
        mensaje += `\n📅 Fecha de registro: ${new Date(user.fecha_registro).toLocaleDateString('es-ES')}`;
        if (user.ultimo_acceso) {
            mensaje += `\n🕐 Último acceso: ${new Date(user.ultimo_acceso).toLocaleDateString('es-ES')}`;
        }
        mensaje += `\n📊 Estado: ${user.activo ? 'Activo' : 'Inactivo'}`;
        
        alert(mensaje);
    } catch (error) {
        console.error('Error al obtener detalles del usuario:', error);
        alert('❌ Error al cargar los detalles del usuario.');
    }
}

// Eliminar usuario específico
async function deleteUser(usuarioId) {
    try {
        // Buscar usuario en el array cargado
        const user = allUsers.find(u => u.id === usuarioId);
        
        if (!user) {
            alert('Usuario no encontrado.');
            return;
        }
        
        const confirmacion = confirm(
            `⚠️ ELIMINAR USUARIO\n\n` +
            `¿Estás seguro de que deseas eliminar a:\n\n` +
            `${user.nombres} ${user.apellidos}\n` +
            `${formatTipoDocumento(user.tipo_documento)}: ${user.numero_documento}\n\n` +
            `Esta acción eliminará:\n` +
            `• Datos personales\n` +
            `• Resultados de tests\n` +
            `• Historias clínicas\n` +
            `• Todos los datos asociados\n\n` +
            `Esta acción NO se puede deshacer.`
        );
        
        if (confirmacion) {
            // Nota: Supabase eliminará automáticamente los datos relacionados
            // gracias a ON DELETE CASCADE en las relaciones
            const { error } = await db.client
                .from('usuarios')
                .delete()
                .eq('id', usuarioId);
            
            if (error) {
                console.error('Error al eliminar usuario:', error);
                alert('❌ Error al eliminar el usuario. Por favor, intenta nuevamente.');
                return;
            }
            
            alert(`✅ Usuario ${user.nombres} ${user.apellidos} eliminado exitosamente.`);
            
            // Recargar tabla y estadísticas
            await loadUsersTable();
            await loadStats();
        }
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        alert('❌ Error al eliminar el usuario.');
    }
}

// Limpiar todos los datos
async function clearAllData() {
    const users = await getAllUsers();
    
    if (users.length === 0) {
        alert('No hay datos para limpiar.');
        return;
    }
    
    const confirmacion = confirm(
        `⚠️ ADVERTENCIA ⚠️\n\n` +
        `Estás a punto de eliminar TODOS los datos de ${users.length} usuario(s).\n\n` +
        `Esta acción eliminará:\n` +
        `• Todos los usuarios registrados\n` +
        `• Todos los tests realizados\n` +
        `• Todas las historias clínicas\n` +
        `• Todos los datos del sistema\n\n` +
        `Esta acción NO se puede deshacer.\n\n` +
        `¿Estás seguro de que deseas continuar?`
    );
    
    if (confirmacion) {
        const doubleConfirm = confirm(
            `¿REALMENTE estás seguro?\n\n` +
            `Se eliminarán ${users.length} usuarios permanentemente.`
        );
        
        if (doubleConfirm) {
            try {
                // Eliminar todos los usuarios
                // Nota: Los datos relacionados se eliminarán automáticamente
                // gracias a ON DELETE CASCADE
                const { error } = await db.client
                    .from('usuarios')
                    .delete()
                    .neq('id', '00000000-0000-0000-0000-000000000000'); // Eliminar todos
                
                if (error) {
                    console.error('Error al limpiar datos:', error);
                    alert('❌ Error al limpiar los datos. Por favor, intenta nuevamente.');
                    return;
                }
                
                alert('✅ Todos los datos han sido eliminados exitosamente.');
                await loadStats();
                
                // Ocultar tabla si estaba visible
                const container = document.getElementById('usersTableContainer');
                if (container.style.display !== 'none') {
                    await toggleUsersTable();
                }
            } catch (error) {
                console.error('Error al limpiar datos:', error);
                alert('❌ Error al limpiar los datos.');
            }
        }
    }
}
