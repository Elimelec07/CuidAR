document.addEventListener("DOMContentLoaded", () => {
  // Carrusel de imágenes en main
  const carouselImagesMain = document.querySelectorAll('.carousel-img-main');
  if (carouselImagesMain.length > 0) {
    let currentIndex = 0;
    
    setInterval(() => {
      carouselImagesMain[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % carouselImagesMain.length;
      carouselImagesMain[currentIndex].classList.add('active');
    }, 3000); // Cambia cada 3 segundos
  }

  // Obtener usuario actual
  function getCurrentUser() {
    const currentUserData = localStorage.getItem('currentUser');
    return currentUserData ? JSON.parse(currentUserData) : null;
  }
  
  function getUserPhotoKey() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.numeroDocumento) {
      return `profilePhoto_${currentUser.numeroDocumento}`;
    }
    return 'profilePhoto_guest';
  }

  // Funcionalidad de foto de perfil
  const profilePhoto = document.getElementById('profilePhoto');
  const photoInput = document.getElementById('photoInput');
  const profileImage = document.getElementById('profileImage');
  const defaultIcon = document.getElementById('defaultIcon');

  if (profilePhoto && photoInput) {
    // Click en la foto abre el selector de archivos
    profilePhoto.addEventListener('click', () => {
      photoInput.click();
    });

    // Cuando se selecciona una imagen
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        
        reader.onload = (event) => {
          // Mostrar la imagen y ocultar el icono
          profileImage.src = event.target.result;
          profileImage.style.display = 'block';
          if (defaultIcon) {
            defaultIcon.style.display = 'none';
          }
          
          // Guardar en localStorage con clave única por usuario
          localStorage.setItem(getUserPhotoKey(), event.target.result);
        };
        
        reader.readAsDataURL(file);
      }
    });

    // Cargar foto guardada si existe
    const savedPhoto = localStorage.getItem(getUserPhotoKey());
    if (savedPhoto && profileImage) {
      profileImage.src = savedPhoto;
      profileImage.style.display = 'block';
      if (defaultIcon) {
        defaultIcon.style.display = 'none';
      }
    }
  }

  // Actualizar foto en la barra de navegación
  function updateNavProfilePhoto() {
    const savedPhoto = localStorage.getItem(getUserPhotoKey());
    const navUserPhoto = document.getElementById('navUserPhoto');
    const navUserIcon = document.getElementById('navUserIcon');
    
    if (savedPhoto && navUserPhoto && navUserIcon) {
      navUserPhoto.src = savedPhoto;
      navUserPhoto.style.display = 'block';
      navUserIcon.style.display = 'none';
    }
  }

  // Llamar la función al cargar la página
  updateNavProfilePhoto();

  // Funcionalidad de edición de perfil
  const editNameBtn = document.getElementById('editNameBtn');
  const profileName = document.getElementById('profileName');
  
  if (editNameBtn && profileName) {
    editNameBtn.addEventListener('click', () => {
      const currentName = profileName.textContent;
      const newName = prompt('Ingresa tu nombre:', currentName);
      if (newName && newName.trim() !== '') {
        profileName.textContent = newName.trim();
        localStorage.setItem('profileName', newName.trim());
      }
    });
    
    // Cargar nombre guardado
    const savedName = localStorage.getItem('profileName');
    if (savedName) {
      profileName.textContent = savedName;
    }
  }

  // Edición de campos del perfil
  const editButtons = document.querySelectorAll('.btn-edit-field');
  
  editButtons.forEach(button => {
    button.addEventListener('click', () => {
      const field = button.getAttribute('data-field');
      const valueElement = document.getElementById(`${field}Value`);
      const inputElement = document.getElementById(`${field}Input`);
      
      if (valueElement.style.display !== 'none') {
        // Modo edición
        valueElement.style.display = 'none';
        inputElement.style.display = 'block';
        inputElement.focus();
        button.innerHTML = '<i class="fas fa-check"></i>';
        button.classList.add('btn-save');
      } else {
        // Guardar
        const newValue = inputElement.value;
        if (newValue && newValue.trim() !== '') {
          valueElement.textContent = newValue;
          localStorage.setItem(`profile_${field}`, newValue);
        }
        valueElement.style.display = 'block';
        inputElement.style.display = 'none';
        button.innerHTML = '<i class="fas fa-pencil-alt"></i>';
        button.classList.remove('btn-save');
      }
    });
  });

  // Cargar datos guardados del perfil
  const fields = ['sexo', 'edad', 'estatura', 'peso', 'antecedentes'];
  fields.forEach(field => {
    const savedValue = localStorage.getItem(`profile_${field}`);
    const valueElement = document.getElementById(`${field}Value`);
    const inputElement = document.getElementById(`${field}Input`);
    
    if (savedValue && valueElement && inputElement) {
      valueElement.textContent = savedValue;
      inputElement.value = savedValue;
    }
  });

  // Funcionalidad de subir PDFs en Historia Clínica
  const uploadBtn = document.getElementById('uploadBtn');
  const pdfInput = document.getElementById('pdfInput');
  const documentosList = document.getElementById('documentosList');
  const emptyState = document.getElementById('emptyState');

  // Función para obtener la clave de storage de historias clínicas del usuario actual
  function getHistoriaClinicaKey() {
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.numeroDocumento) {
      return `historiaClinicaPDFs_${currentUser.numeroDocumento}`;
    }
    return 'historiaClinicaPDFs_guest';
  }

  if (uploadBtn && pdfInput) {
    uploadBtn.addEventListener('click', () => {
      pdfInput.click();
    });

    pdfInput.addEventListener('change', (e) => {
      const files = e.target.files;
      if (files.length > 0) {
        // Obtener documentos existentes del usuario actual
        const storageKey = getHistoriaClinicaKey();
        let documentos = JSON.parse(localStorage.getItem(storageKey) || '[]');
        
        // Procesar cada archivo
        Array.from(files).forEach(file => {
          if (file.type === 'application/pdf') {
            const reader = new FileReader();
            
            reader.onload = (event) => {
              const documento = {
                id: Date.now() + Math.random(),
                nombre: file.name,
                fecha: new Date().toLocaleDateString('es-ES'),
                size: (file.size / 1024).toFixed(2) + ' KB',
                data: event.target.result
              };
              
              documentos.push(documento);
              localStorage.setItem(storageKey, JSON.stringify(documentos));
              renderDocumentos();
            };
            
            reader.readAsDataURL(file);
          }
        });
      }
      pdfInput.value = ''; // Reset input
    });
  }

  function renderDocumentos() {
    if (!documentosList) return;
    
    const storageKey = getHistoriaClinicaKey();
    const documentos = JSON.parse(localStorage.getItem(storageKey) || '[]');
    
    if (documentos.length === 0) {
      if (emptyState) emptyState.style.display = 'flex';
      documentosList.innerHTML = '';
      return;
    }
    
    if (emptyState) emptyState.style.display = 'none';
    
    documentosList.innerHTML = documentos.map(doc => `
      <div class="documento-item" data-id="${doc.id}">
        <div class="documento-icon">
          <i class="fas fa-file-pdf"></i>
        </div>
        <div class="documento-info">
          <h4 class="documento-nombre">${doc.nombre}</h4>
          <p class="documento-meta">${doc.fecha} • ${doc.size}</p>
        </div>
        <div class="documento-actions">
          <button class="btn-doc-action btn-view" data-id="${doc.id}" title="Ver">
            <i class="fas fa-eye"></i>
          </button>
          <button class="btn-doc-action btn-download" data-id="${doc.id}" title="Descargar">
            <i class="fas fa-download"></i>
          </button>
          <button class="btn-doc-action btn-delete" data-id="${doc.id}" title="Eliminar">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    
    // Agregar event listeners
    document.querySelectorAll('.btn-view').forEach(btn => {
      btn.addEventListener('click', () => viewDocumento(btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-download').forEach(btn => {
      btn.addEventListener('click', () => downloadDocumento(btn.dataset.id));
    });
    
    document.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => deleteDocumento(btn.dataset.id));
    });
  }

  function viewDocumento(id) {
    const storageKey = getHistoriaClinicaKey();
    const documentos = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const doc = documentos.find(d => d.id == id);
    if (doc) {
      window.open(doc.data, '_blank');
    }
  }

  function downloadDocumento(id) {
    const storageKey = getHistoriaClinicaKey();
    const documentos = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const doc = documentos.find(d => d.id == id);
    if (doc) {
      const link = document.createElement('a');
      link.href = doc.data;
      link.download = doc.nombre;
      link.click();
    }
  }

  function deleteDocumento(id) {
    if (confirm('¿Estás seguro de eliminar este documento?')) {
      const storageKey = getHistoriaClinicaKey();
      let documentos = JSON.parse(localStorage.getItem(storageKey) || '[]');
      documentos = documentos.filter(d => d.id != id);
      localStorage.setItem(storageKey, JSON.stringify(documentos));
      renderDocumentos();
    }
  }

  // Cargar documentos al inicio
  if (documentosList) {
    renderDocumentos();
  }

  // Código existente
  const acceptBtn = document.getElementById('acceptBtn');
  const warningBox = document.getElementById('warningBox');

  if (acceptBtn && warningBox) {
    acceptBtn.addEventListener('click', () => {
      // Alterna la clase "open"
      warningBox.classList.toggle('open');

      // Cambia el texto del botón
      if (warningBox.classList.contains('open')) {
        acceptBtn.textContent = 'Aceptar y continuar';
      } else {
        document.getElementById("acceptBtn").addEventListener("click", () => {
          localStorage.setItem("dataAccepted", "true");
          window.location.href = '../index.html';
        });
      }
    });
  }
});
