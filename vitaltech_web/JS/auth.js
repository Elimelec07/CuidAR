document.addEventListener("DOMContentLoaded", () => {
  const termsModal = document.getElementById("terms-modal");
  const acceptTermsBtn = document.getElementById("accept-terms-btn");
  const loginContainer = document.getElementById("login-container");

  // Mostrar modal de términos al inicio
  if (termsModal && loginContainer) {
    loginContainer.classList.add("blurred");
  }

  // Aceptar términos
  if (acceptTermsBtn && termsModal && loginContainer) {
    acceptTermsBtn.addEventListener("click", () => {
      termsModal.classList.add("hidden");
      loginContainer.classList.remove("blurred");
    });
  }

  // Carrusel de imágenes
  const carouselImages = document.querySelectorAll('.carousel-img');
  if (carouselImages.length > 0) {
    let currentIndex = 0;
    
    setInterval(() => {
      carouselImages[currentIndex].classList.remove('active');
      currentIndex = (currentIndex + 1) % carouselImages.length;
      carouselImages[currentIndex].classList.add('active');
    }, 3000); // Cambia cada 3 segundos
  }

  // Manejo del formulario de registro
  const registerForm = document.querySelector('.register-container form');
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      // Obtener valores del formulario
      const nombres = document.getElementById('nombres').value;
      const apellidos = document.getElementById('apellidos').value;
      const fechaNacimiento = document.getElementById('fecha-nacimiento').value;
      const sexo = document.getElementById('sexo').value;
      const tipoDocumento = document.getElementById('tipo-documento').value;
      const numeroDocumento = document.getElementById('numero-documento').value;
      const email = document.getElementById('email').value;
      const telefono = document.getElementById('telefono').value;
      const password = document.getElementById('password').value;
      const confirmPassword = document.getElementById('confirm-password').value;
      const eps = document.getElementById('eps').value;
      const regimen = document.getElementById('regimen').value;

      // Validar que las contraseñas coincidan
      if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, verifica e intenta nuevamente.');
        return;
      }

      // Validar longitud de contraseña
      if (password.length < 6) {
        alert('La contraseña debe tener al menos 6 caracteres.');
        return;
      }

      // Crear objeto de usuario
      const userData = {
        nombres,
        apellidos,
        fechaNacimiento,
        sexo,
        tipoDocumento,
        numeroDocumento,
        email,
        telefono,
        password,
        eps,
        regimen,
        fechaRegistro: new Date().toISOString()
      };

      // Guardar en localStorage
      localStorage.setItem(`user_${numeroDocumento}`, JSON.stringify(userData));
      localStorage.setItem('currentUser', JSON.stringify(userData));

      alert('✅ Registro exitoso. Bienvenido a CuidAR!');
      window.location.href = 'main.html';
    });
  }

  // Manejo del formulario de login
  const loginForm = document.querySelector('.login-container form');
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const tipoDoc = document.getElementById('doc-type').value;
      const numeroDoc = document.getElementById('doc-number').value;
      const password = document.getElementById('password').value;

      // Buscar usuario en localStorage
      const userDataStr = localStorage.getItem(`user_${numeroDoc}`);
      
      if (!userDataStr) {
        alert('Usuario no encontrado. Por favor, regístrate primero.');
        return;
      }

      const userData = JSON.parse(userDataStr);

      // Verificar contraseña
      if (userData.password !== password) {
        alert('Contraseña incorrecta. Por favor, intenta nuevamente.');
        return;
      }

      // Verificar tipo de documento
      if (userData.tipoDocumento !== tipoDoc) {
        alert('El tipo de documento no coincide con el registrado.');
        return;
      }

      // Login exitoso
      localStorage.setItem('currentUser', JSON.stringify(userData));
      window.location.href = 'HTML/main.html';
    });
  }
});

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
}
