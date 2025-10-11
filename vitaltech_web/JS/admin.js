// admin.js - Sistema de administración y exportación de usuarios

document.addEventListener('DOMContentLoaded', function() {
    // Cargar estadísticas
    loadStats();
    
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

// Obtener todos los usuarios del localStorage
function getAllUsers() {
    const users = [];
    
    // Recorrer todas las claves del localStorage
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        
        // Solo procesar claves que empiecen con "user_"
        if (key.startsWith('user_')) {
            try {
                const userData = JSON.parse(localStorage.getItem(key));
                users.push(userData);
            } catch (e) {
                console.error('Error al parsear usuario:', key, e);
            }
        }
    }
    
    return users;
}

// Cargar estadísticas
function loadStats() {
    const users = getAllUsers();
    document.getElementById('totalUsers').textContent = users.length;
}

// Función para descargar Excel
function downloadExcel() {
    const users = getAllUsers();
    
    if (users.length === 0) {
        alert('No hay usuarios registrados para exportar.');
        return;
    }
    
    // Preparar datos para Excel con resultados de tests
    const excelData = users.map(user => {
        // Obtener resultados de tests del usuario
        const testDiabetes = JSON.parse(localStorage.getItem(`testDiabetesResultado_${user.numeroDocumento}`) || 'null');
        const testHTA = JSON.parse(localStorage.getItem(`testHTAResultado_${user.numeroDocumento}`) || 'null');
        const testEstres = JSON.parse(localStorage.getItem(`testPsicologicoResultado_${user.numeroDocumento}`) || 'null');
        const testAnsiedad = JSON.parse(localStorage.getItem(`testAnsiedadResultado_${user.numeroDocumento}`) || 'null');
        
        // Obtener historias clínicas del usuario
        // NOTA: Actualmente las historias están en storage compartido
        // Se debería migrar a: historiaClinicaPDFs_${user.numeroDocumento}
        const historias = JSON.parse(localStorage.getItem(`historiaClinicaPDFs_${user.numeroDocumento}`) || 
                                     localStorage.getItem('historiaClinicaPDFs') || '[]');
        const numHistorias = historias.length;
        const historiasNombres = historias.map(h => h.nombre).join(', ');
        const ultimaHistoria = historias.length > 0 ? historias[historias.length - 1].fecha : '';
        
        return {
            'Nombres': user.nombres || '',
            'Apellidos': user.apellidos || '',
            'Tipo de Documento': formatTipoDocumentoLargo(user.tipoDocumento) || '',
            'N° Documento': user.numeroDocumento || '',
            'Email': user.email || '',
            'Teléfono': user.telefono || '',
            'Sexo': user.sexo ? user.sexo.charAt(0).toUpperCase() + user.sexo.slice(1) : '',
            'Fecha de Nacimiento': user.fechaNacimiento || '',
            'Edad': calcularEdad(user.fechaNacimiento) || '',
            'EPS': user.eps || '',
            'Régimen': user.regimen ? user.regimen.charAt(0).toUpperCase() + user.regimen.slice(1) : '',
            'Estatura (cm)': user.estatura || '',
            'Peso (kg)': user.peso || '',
            'IMC': testDiabetes?.imc || '',
            'Antecedentes Familiares': user.antecedentes || '',
            
            // Historias Clínicas
            'N° Historias Clínicas': numHistorias,
            'Nombres de Archivos': historiasNombres || 'Sin historias',
            'Última Historia Subida': ultimaHistoria || '',
            
            // Test de Diabetes (FINDRISC)
            'Test Diabetes - Puntos': testDiabetes?.puntos ?? '',
            'Test Diabetes - Riesgo': testDiabetes?.riesgo ? testDiabetes.riesgo.charAt(0).toUpperCase() + testDiabetes.riesgo.slice(1) : 'No realizado',
            'Test Diabetes - Fecha': testDiabetes?.fecha ? new Date(testDiabetes.fecha).toLocaleDateString('es-ES') : '',
            
            // Test de Hipertensión
            'Test HTA - Puntos': testHTA?.puntos ?? '',
            'Test HTA - Riesgo': testHTA?.riesgo ? testHTA.riesgo.charAt(0).toUpperCase() + testHTA.riesgo.slice(1) : 'No realizado',
            'Test HTA - Fecha': testHTA?.fecha ? new Date(testHTA.fecha).toLocaleDateString('es-ES') : '',
            
            // Test de Estrés (PSS-10)
            'Test Estrés - Puntos': testEstres?.puntos ?? '',
            'Test Estrés - Riesgo': testEstres?.riesgo ? testEstres.riesgo.charAt(0).toUpperCase() + testEstres.riesgo.slice(1) : 'No realizado',
            'Test Estrés - Fecha': testEstres?.fecha ? new Date(testEstres.fecha).toLocaleDateString('es-ES') : '',
            
            // Test de Ansiedad (BAI)
            'Test Ansiedad - Puntos': testAnsiedad?.puntos ?? '',
            'Test Ansiedad - Riesgo': testAnsiedad?.riesgo ? testAnsiedad.riesgo.charAt(0).toUpperCase() + testAnsiedad.riesgo.slice(1) : 'No realizado',
            'Test Ansiedad - Fecha': testAnsiedad?.fecha ? new Date(testAnsiedad.fecha).toLocaleDateString('es-ES') : '',
            
            'Fecha de Registro': new Date().toLocaleDateString('es-ES')
        };
    });
    
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
        { wch: 12 }, // Estatura
        { wch: 12 }, // Peso
        { wch: 10 }, // IMC
        { wch: 30 }, // Antecedentes
        { wch: 20 }, // N° Historias Clínicas
        { wch: 50 }, // Nombres de Archivos
        { wch: 18 }, // Última Historia Subida
        { wch: 18 }, // Test Diabetes - Puntos
        { wch: 20 }, // Test Diabetes - Riesgo
        { wch: 18 }, // Test Diabetes - Fecha
        { wch: 15 }, // Test HTA - Puntos
        { wch: 20 }, // Test HTA - Riesgo
        { wch: 18 }, // Test HTA - Fecha
        { wch: 18 }, // Test Estrés - Puntos
        { wch: 20 }, // Test Estrés - Riesgo
        { wch: 18 }, // Test Estrés - Fecha
        { wch: 18 }, // Test Ansiedad - Puntos
        { wch: 20 }, // Test Ansiedad - Riesgo
        { wch: 18 }, // Test Ansiedad - Fecha
        { wch: 18 }  // Fecha Registro
    ];
    ws['!cols'] = columnWidths;
    
    // Agregar hoja al libro
    XLSX.utils.book_append_sheet(wb, ws, 'Usuarios Registrados');
    
    // Generar nombre de archivo con fecha
    const fecha = new Date().toISOString().split('T')[0];
    const fileName = `CuidAR_Usuarios_${fecha}.xlsx`;
    
    // Descargar archivo
    XLSX.writeFile(wb, fileName);
    
    alert(`✅ Excel descargado exitosamente: ${fileName}\n\nTotal de usuarios: ${users.length}\n\nIncluye:\n• Historias Clínicas subidas\n• Resultados de tests:\n  - Diabetes (FINDRISC)\n  - Hipertensión (HTA)\n  - Estrés (PSS-10)\n  - Ansiedad (BAI)`);
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
function toggleUsersTable() {
    const container = document.getElementById('usersTableContainer');
    const btn = document.getElementById('viewUsersBtn');
    
    if (container.style.display === 'none') {
        loadUsersTable();
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
function loadUsersTable() {
    const users = getAllUsers();
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
        row.setAttribute('data-user-doc', user.numeroDocumento);
        row.innerHTML = `
            <td style="font-weight: 600; color: var(--color-primary);">${index + 1}</td>
            <td>${user.nombres || '-'}</td>
            <td>${user.apellidos || '-'}</td>
            <td><span class="badge badge-info">${formatTipoDocumento(user.tipoDocumento) || '-'}</span></td>
            <td style="font-weight: 600;">${user.numeroDocumento || '-'}</td>
            <td><a href="mailto:${user.email}" style="color: var(--color-secondary);">${user.email || '-'}</a></td>
            <td>${user.telefono || '-'}</td>
            <td><span class="badge ${user.sexo === 'masculino' ? 'badge-primary' : 'badge-danger'}">${user.sexo ? user.sexo.charAt(0).toUpperCase() + user.sexo.slice(1) : '-'}</span></td>
            <td style="text-align: center;">${calcularEdad(user.fechaNacimiento) || '-'}</td>
            <td>${user.eps || '-'}</td>
            <td><span class="badge badge-success">${user.regimen ? user.regimen.charAt(0).toUpperCase() + user.regimen.slice(1) : '-'}</span></td>
            <td>
                <button class="btn-table-action btn-view" onclick="viewUserDetails('${user.numeroDocumento}')" title="Ver detalles">
                    <i class="fas fa-eye"></i>
                </button>
                <button class="btn-table-action btn-delete" onclick="deleteUser('${user.numeroDocumento}')" title="Eliminar usuario">
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
function viewUserDetails(numeroDocumento) {
    const userDataStr = localStorage.getItem(`user_${numeroDocumento}`);
    if (!userDataStr) {
        alert('Usuario no encontrado.');
        return;
    }
    
    const user = JSON.parse(userDataStr);
    
    // Obtener resultados de tests del usuario
    const testDiabetes = JSON.parse(localStorage.getItem(`testDiabetesResultado_${numeroDocumento}`) || 'null');
    const testHTA = JSON.parse(localStorage.getItem(`testHTAResultado_${numeroDocumento}`) || 'null');
    const testEstres = JSON.parse(localStorage.getItem(`testPsicologicoResultado_${numeroDocumento}`) || 'null');
    const testAnsiedad = JSON.parse(localStorage.getItem(`testAnsiedadResultado_${numeroDocumento}`) || 'null');
    
    let mensaje = `👤 INFORMACIÓN DETALLADA DEL USUARIO\n\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `📋 DATOS PERSONALES\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `Nombre completo: ${user.nombres} ${user.apellidos}\n`;
    mensaje += `${formatTipoDocumento(user.tipoDocumento)}: ${user.numeroDocumento}\n`;
    mensaje += `Sexo: ${user.sexo ? user.sexo.charAt(0).toUpperCase() + user.sexo.slice(1) : 'No especificado'}\n`;
    mensaje += `Fecha de nacimiento: ${user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-ES') : 'No especificada'}\n`;
    mensaje += `Edad: ${calcularEdad(user.fechaNacimiento) || 'N/A'} años\n\n`;
    
    mensaje += `📞 CONTACTO\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `Email: ${user.email}\n`;
    mensaje += `Teléfono: ${user.telefono}\n\n`;
    
    mensaje += `🏥 INFORMACIÓN MÉDICA\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    mensaje += `EPS: ${user.eps}\n`;
    mensaje += `Régimen: ${user.regimen ? user.regimen.charAt(0).toUpperCase() + user.regimen.slice(1) : 'No especificado'}\n\n`;
    
    // Historias Clínicas
    const historias = JSON.parse(localStorage.getItem(`historiaClinicaPDFs_${numeroDocumento}`) || '[]');
    mensaje += `📄 HISTORIAS CLÍNICAS\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    if (historias.length > 0) {
        mensaje += `Total de documentos: ${historias.length}\n`;
        historias.forEach((h, index) => {
            mensaje += `${index + 1}. ${h.nombre} (${h.fecha})\n`;
        });
        mensaje += `\n`;
    } else {
        mensaje += `No hay historias clínicas subidas\n\n`;
    }
    
    mensaje += `📊 RESULTADOS DE TESTS\n`;
    mensaje += `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`;
    
    if (testDiabetes) {
        mensaje += `🩺 Diabetes (FINDRISC): ${testDiabetes.puntos} pts - Riesgo ${testDiabetes.riesgo.toUpperCase()}\n`;
        mensaje += `   IMC: ${testDiabetes.imc || 'N/A'}\n`;
    } else {
        mensaje += `🩺 Diabetes: No realizado\n`;
    }
    
    if (testHTA) {
        mensaje += `❤️ Hipertensión: ${testHTA.puntos} pts - Riesgo ${testHTA.riesgo.toUpperCase()}\n`;
    } else {
        mensaje += `❤️ Hipertensión: No realizado\n`;
    }
    
    if (testEstres) {
        mensaje += `😰 Estrés (PSS-10): ${testEstres.puntos} pts - Riesgo ${testEstres.riesgo.toUpperCase()}\n`;
    } else {
        mensaje += `😰 Estrés: No realizado\n`;
    }
    
    if (testAnsiedad) {
        mensaje += `😟 Ansiedad (BAI): ${testAnsiedad.puntos} pts - Riesgo ${testAnsiedad.riesgo.toUpperCase()}\n`;
    } else {
        mensaje += `😟 Ansiedad: No realizado\n`;
    }
    
    mensaje += `\n📅 Fecha de registro: ${new Date(user.fechaRegistro).toLocaleDateString('es-ES')}`;
    
    alert(mensaje);
}

// Eliminar usuario específico
function deleteUser(numeroDocumento) {
    const userDataStr = localStorage.getItem(`user_${numeroDocumento}`);
    if (!userDataStr) {
        alert('Usuario no encontrado.');
        return;
    }
    
    const user = JSON.parse(userDataStr);
    
    const confirmacion = confirm(
        `⚠️ ELIMINAR USUARIO\n\n` +
        `¿Estás seguro de que deseas eliminar a:\n\n` +
        `${user.nombres} ${user.apellidos}\n` +
        `${formatTipoDocumento(user.tipoDocumento)}: ${user.numeroDocumento}\n\n` +
        `Esta acción NO se puede deshacer.`
    );
    
    if (confirmacion) {
        // Eliminar todos los datos del usuario
        localStorage.removeItem(`user_${numeroDocumento}`);
        localStorage.removeItem(`profilePhoto_${numeroDocumento}`);
        localStorage.removeItem(`notifications_${numeroDocumento}`);
        localStorage.removeItem(`lastDailyNotification_${numeroDocumento}`);
        localStorage.removeItem(`testDiabetesResultado_${numeroDocumento}`);
        localStorage.removeItem(`testHTAResultado_${numeroDocumento}`);
        localStorage.removeItem(`testPsicologicoResultado_${numeroDocumento}`);
        localStorage.removeItem(`testAnsiedadResultado_${numeroDocumento}`);
        localStorage.removeItem(`historiaClinicaPDFs_${numeroDocumento}`);
        
        alert(`✅ Usuario ${user.nombres} ${user.apellidos} eliminado exitosamente.`);
        
        // Recargar tabla y estadísticas
        loadUsersTable();
        loadStats();
    }
}

// Limpiar todos los datos
function clearAllData() {
    const users = getAllUsers();
    
    if (users.length === 0) {
        alert('No hay datos para limpiar.');
        return;
    }
    
    const confirmacion = confirm(
        `⚠️ ADVERTENCIA ⚠️\n\n` +
        `Estás a punto de eliminar TODOS los datos de ${users.length} usuario(s).\n\n` +
        `Esta acción NO se puede deshacer.\n\n` +
        `¿Estás seguro de que deseas continuar?`
    );
    
    if (confirmacion) {
        const doubleConfirm = confirm(
            `¿REALMENTE estás seguro?\n\n` +
            `Se eliminarán ${users.length} usuarios permanentemente.`
        );
        
        if (doubleConfirm) {
            // Eliminar todos los usuarios
            for (let i = localStorage.length - 1; i >= 0; i--) {
                const key = localStorage.key(i);
                if (key.startsWith('user_') || key === 'currentUser') {
                    localStorage.removeItem(key);
                }
            }
            
            alert('✅ Todos los datos han sido eliminados exitosamente.');
            loadStats();
            
            // Ocultar tabla si estaba visible
            const container = document.getElementById('usersTableContainer');
            if (container.style.display !== 'none') {
                toggleUsersTable();
            }
        }
    }
}
