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
    registerForm.addEventListener('submit', async (e) => {
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

      // Deshabilitar botón y mostrar loading
      const submitBtn = registerForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Registrando...';

      try {
        // Registrar usuario en Supabase
        const resultado = await db.registrarUsuario({
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
          regimen
        });

        if (resultado.success) {
          alert('✅ Registro exitoso. ¡Bienvenido a CuidAR!');
          window.location.href = 'main.html';
        } else {
          alert('❌ Error al registrar: ' + resultado.error);
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch (error) {
        console.error('Error en registro:', error);
        alert('❌ Error al registrar. Por favor, intenta nuevamente.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }

  // Manejo del formulario de login
  const loginForm = document.querySelector('.login-container form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const tipoDoc = document.getElementById('doc-type').value;
      const numeroDoc = document.getElementById('doc-number').value;
      const password = document.getElementById('password').value;

      // Deshabilitar botón y mostrar loading
      const submitBtn = loginForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.textContent;
      submitBtn.disabled = true;
      submitBtn.textContent = 'Iniciando sesión...';

      try {
        // Primero necesitamos obtener el email del usuario por su número de documento
        // Como Supabase Auth usa email, necesitamos una búsqueda
        const { data: usuarios, error: searchError } = await db.client
          .from('usuarios')
          .select('email, tipo_documento')
          .eq('numero_documento', numeroDoc)
          .single();

        if (searchError || !usuarios) {
          alert('❌ Usuario no encontrado. Por favor, regístrate primero.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }

        // Verificar tipo de documento
        if (usuarios.tipo_documento !== tipoDoc) {
          alert('❌ El tipo de documento no coincide con el registrado.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
          return;
        }

        // Iniciar sesión con email y contraseña
        const resultado = await db.login(usuarios.email, password);

        if (resultado.success) {
          alert('✅ Inicio de sesión exitoso. ¡Bienvenido!');
          window.location.href = 'HTML/main.html';
        } else {
          alert('❌ Contraseña incorrecta. Por favor, intenta nuevamente.');
          submitBtn.disabled = false;
          submitBtn.textContent = originalText;
        }
      } catch (error) {
        console.error('Error en login:', error);
        alert('❌ Error al iniciar sesión. Por favor, intenta nuevamente.');
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    });
  }
});

async function logout() {
  await db.logout();
  localStorage.removeItem("currentUser");
  window.location.href = "../index.html";
}
