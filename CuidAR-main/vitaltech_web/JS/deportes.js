// ===================================
// DEPORTES.JS - Monitor Deportivo
// ===================================

// Variables globales
let isConnected = false;
let sessionActive = false;
let sessionPaused = false;
let sessionStartTime = null;
let sessionDuration = 0;
let heartRateData = [];
let temperatureData = [];
let timeLabels = [];
let maxDataPoints = 60;

// Estadísticas de sesión
let sessionStats = {
  heartRates: [],
  avgHeartRate: 0,
  maxHeartRate: 0,
  minHeartRate: 999,
  steps: 0,
  calories: 0,
  distance: 0
};

// Web Serial API para Arduino
let port;
let reader;
let keepReading = true;

// Gráficas
let heartRateChart;
let temperatureChart;

// ===================================
// INICIALIZACIÓN
// ===================================
document.addEventListener('DOMContentLoaded', function() {
  initializeCharts();
  initializeEventListeners();
  loadWorkoutHistory();
  simulateData(); // Para pruebas sin Arduino
});

// ===================================
// GRÁFICAS CON CHART.JS
// ===================================
function initializeCharts() {
  // Gráfica de Frecuencia Cardíaca
  const heartRateCtx = document.getElementById('heartRateChart').getContext('2d');
  heartRateChart = new Chart(heartRateCtx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: 'BPM',
        data: heartRateData,
        borderColor: 'rgb(245, 87, 108)',
        backgroundColor: 'rgba(245, 87, 108, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgb(245, 87, 108)',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 50,
          max: 200,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      interaction: {
        mode: 'nearest',
        axis: 'x',
        intersect: false
      }
    }
  });

  // Gráfica de Temperatura
  const temperatureCtx = document.getElementById('temperatureChart').getContext('2d');
  temperatureChart = new Chart(temperatureCtx, {
    type: 'line',
    data: {
      labels: timeLabels,
      datasets: [{
        label: '°C',
        data: temperatureData,
        borderColor: 'rgb(250, 112, 154)',
        backgroundColor: 'rgba(250, 112, 154, 0.1)',
        borderWidth: 3,
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        pointHoverRadius: 5
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          titleColor: '#fff',
          bodyColor: '#fff',
          borderColor: 'rgb(250, 112, 154)',
          borderWidth: 1
        }
      },
      scales: {
        y: {
          beginAtZero: false,
          min: 35,
          max: 40,
          grid: {
            color: 'rgba(0, 0, 0, 0.05)'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      }
    }
  });
}

// ===================================
// EVENT LISTENERS
// ===================================
function initializeEventListeners() {
  // Menú lateral (sidebar)
  const menuIcon = document.querySelector('.menu-icon');
  const sidebarMenu = document.getElementById('sidebarMenu');
  const sidebarOverlay = document.getElementById('sidebarOverlay');
  const closeSidebar = document.getElementById('closeSidebar');

  if (menuIcon) {
    menuIcon.addEventListener('click', function() {
      sidebarMenu.classList.add('active');
      sidebarOverlay.classList.add('active');
    });
  }

  if (closeSidebar) {
    closeSidebar.addEventListener('click', function() {
      sidebarMenu.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });
  }

  if (sidebarOverlay) {
    sidebarOverlay.addEventListener('click', function() {
      sidebarMenu.classList.remove('active');
      sidebarOverlay.classList.remove('active');
    });
  }

  // Botón de logout
  const logoutBtn = document.getElementById('logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
      if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../index.html';
      }
    });
  }

  // Botón de conexión
  document.getElementById('connectBtn').addEventListener('click', connectDevice);

  // Controles de sesión
  document.getElementById('startSession').addEventListener('click', startSession);
  document.getElementById('pauseSession').addEventListener('click', pauseSession);
  document.getElementById('stopSession').addEventListener('click', stopSession);

  // Exportar datos
  document.getElementById('exportData').addEventListener('click', exportData);

  // Controles de rango de gráfica
  document.querySelectorAll('.btn-chart-control').forEach(btn => {
    btn.addEventListener('click', function() {
      document.querySelectorAll('.btn-chart-control').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      
      const range = this.getAttribute('data-range');
      updateChartRange(range);
    });
  });
}

// ===================================
// CONEXIÓN CON ARDUINO (Web Serial API)
// ===================================
async function connectDevice() {
  try {
    // Verificar si el navegador soporta Web Serial API
    if (!('serial' in navigator)) {
      showAlert('danger', 'Navegador no compatible', 'Tu navegador no soporta Web Serial API. Usa Chrome o Edge.');
      return;
    }

    // Solicitar puerto serial
    port = await navigator.serial.requestPort();
    await port.open({ baudRate: 9600 });

    isConnected = true;
    updateConnectionStatus(true);
    showAlert('success', 'Conectado', '¡Dispositivo conectado correctamente!');

    // Leer datos del Arduino
    readArduinoData();

  } catch (error) {
    console.error('Error al conectar:', error);
    showAlert('danger', 'Error de conexión', 'No se pudo conectar con el dispositivo.');
  }
}

async function readArduinoData() {
  const textDecoder = new TextDecoderStream();
  const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
  reader = textDecoder.readable.getReader();

  try {
    while (keepReading) {
      const { value, done } = await reader.read();
      if (done) break;

      // Parsear datos del Arduino
      // Formato esperado: "HR:75,TEMP:36.5,SPO2:98,STEPS:1234"
      parseArduinoData(value);
    }
  } catch (error) {
    console.error('Error leyendo datos:', error);
  } finally {
    reader.releaseLock();
  }
}

function parseArduinoData(data) {
  try {
    const dataString = data.trim();
    const pairs = dataString.split(',');
    
    pairs.forEach(pair => {
      const [key, value] = pair.split(':');
      
      switch(key) {
        case 'HR':
          updateHeartRate(parseInt(value));
          break;
        case 'TEMP':
          updateTemperature(parseFloat(value));
          break;
        case 'SPO2':
          updateOxygen(parseInt(value));
          break;
        case 'STEPS':
          updateSteps(parseInt(value));
          break;
      }
    });
  } catch (error) {
    console.error('Error parseando datos:', error);
  }
}

// ===================================
// ACTUALIZACIÓN DE MÉTRICAS
// ===================================
function updateHeartRate(value) {
  document.getElementById('heartRate').textContent = `${value} bpm`;
  
  // Actualizar estado
  let status = 'Normal';
  let statusClass = 'normal';
  
  if (value < 60) {
    status = 'Bajo';
    statusClass = 'low';
  } else if (value > 100) {
    status = 'Elevado';
    statusClass = 'high';
  }
  
  const statusElement = document.getElementById('heartRateStatus');
  statusElement.textContent = status;
  statusElement.className = `metric-status ${statusClass}`;
  
  // Actualizar gráfica
  if (sessionActive && !sessionPaused) {
    addDataToChart(heartRateChart, heartRateData, value);
    sessionStats.heartRates.push(value);
    updateSessionStats();
    updateTrainingZone(value);
    
    // Alertas
    if (value > 180) {
      showAlert('danger', 'Frecuencia cardíaca alta', 'Tu frecuencia cardíaca está muy alta. Considera reducir la intensidad.');
    }
  }
}

function updateTemperature(value) {
  document.getElementById('temperature').textContent = `${value.toFixed(1)} °C`;
  
  let status = 'Normal';
  if (value > 37.5) {
    status = 'Elevada';
    showAlert('warning', 'Temperatura elevada', 'Tu temperatura corporal está un poco alta. Mantente hidratado.');
  } else if (value < 36) {
    status = 'Baja';
  }
  
  document.getElementById('temperatureStatus').textContent = status;
  
  if (sessionActive && !sessionPaused) {
    addDataToChart(temperatureChart, temperatureData, value);
  }
}

function updateOxygen(value) {
  document.getElementById('oxygen').textContent = `${value} %`;
  
  let status = 'Normal';
  if (value < 95) {
    status = 'Bajo';
    showAlert('warning', 'SpO2 bajo', 'Tu saturación de oxígeno está baja. Descansa si es necesario.');
  }
  
  document.getElementById('oxygenStatus').textContent = status;
}

function updateSteps(value) {
  document.getElementById('steps').textContent = value.toLocaleString();
  sessionStats.steps = value;
  
  // Calcular calorías y distancia estimadas
  const calories = Math.round(value * 0.04);
  const distance = (value * 0.0008).toFixed(2);
  
  document.getElementById('calories').textContent = `${calories} kcal`;
  document.getElementById('distance').textContent = `${distance} km`;
  
  sessionStats.calories = calories;
  sessionStats.distance = distance;
}

// ===================================
// GESTIÓN DE GRÁFICAS
// ===================================
function addDataToChart(chart, dataArray, value) {
  const now = new Date();
  const timeLabel = now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  
  if (dataArray.length >= maxDataPoints) {
    dataArray.shift();
    timeLabels.shift();
  }
  
  dataArray.push(value);
  timeLabels.push(timeLabel);
  
  chart.update('none');
}

function updateChartRange(range) {
  switch(range) {
    case '1m':
      maxDataPoints = 60;
      break;
    case '5m':
      maxDataPoints = 300;
      break;
    case '15m':
      maxDataPoints = 900;
      break;
  }
}

// ===================================
// ZONAS DE ENTRENAMIENTO
// ===================================
function updateTrainingZone(heartRate) {
  let zone = 'rest';
  let zoneText = 'Zona de Descanso';
  let zoneDescription = 'Perfecta para calentamiento y recuperación.';
  let position = 10;
  
  if (heartRate >= 160) {
    zone = 'peak';
    zoneText = 'Zona Máxima';
    zoneDescription = '¡Máximo esfuerzo! Solo para intervalos cortos.';
    position = 90;
  } else if (heartRate >= 140) {
    zone = 'cardio';
    zoneText = 'Zona Cardio';
    zoneDescription = 'Mejora tu resistencia cardiovascular.';
    position = 70;
  } else if (heartRate >= 120) {
    zone = 'fat';
    zoneText = 'Zona Quema Grasa';
    zoneDescription = 'Ideal para quemar grasa y mejorar resistencia.';
    position = 50;
  } else if (heartRate >= 100) {
    zone = 'warmup';
    zoneText = 'Zona de Calentamiento';
    zoneDescription = 'Prepara tu cuerpo para ejercicio intenso.';
    position = 30;
  }
  
  const indicator = document.getElementById('zoneIndicator');
  indicator.style.left = `${position}%`;
  
  const zoneInfo = document.getElementById('zoneInfo');
  zoneInfo.innerHTML = `
    <strong>${zoneText}</strong>
    <p>${zoneDescription}</p>
  `;
}

// ===================================
// CONTROL DE SESIÓN
// ===================================
function startSession() {
  if (!isConnected) {
    showAlert('warning', 'Dispositivo no conectado', 'Por favor, conecta tu dispositivo primero.');
    return;
  }
  
  sessionActive = true;
  sessionPaused = false;
  sessionStartTime = new Date();
  
  document.getElementById('startSession').disabled = true;
  document.getElementById('pauseSession').disabled = false;
  document.getElementById('stopSession').disabled = false;
  
  // Limpiar datos anteriores
  heartRateData = [];
  temperatureData = [];
  timeLabels = [];
  sessionStats.heartRates = [];
  
  // Iniciar cronómetro
  updateSessionTimer();
  
  showAlert('success', 'Sesión iniciada', '¡Buena suerte con tu entrenamiento!');
}

function pauseSession() {
  sessionPaused = !sessionPaused;
  
  const btn = document.getElementById('pauseSession');
  if (sessionPaused) {
    btn.innerHTML = '<i class="fas fa-play"></i> Reanudar';
    showAlert('warning', 'Sesión pausada', 'Sesión pausada. Descansa un momento.');
  } else {
    btn.innerHTML = '<i class="fas fa-pause"></i> Pausar';
    showAlert('success', 'Sesión reanudada', '¡Continúa con tu entrenamiento!');
  }
}

function stopSession() {
  sessionActive = false;
  sessionPaused = false;
  
  document.getElementById('startSession').disabled = false;
  document.getElementById('pauseSession').disabled = true;
  document.getElementById('stopSession').disabled = true;
  
  // Guardar sesión en historial
  saveWorkoutSession();
  
  showAlert('success', 'Sesión finalizada', '¡Excelente trabajo! Tu sesión ha sido guardada.');
}

function updateSessionTimer() {
  if (!sessionActive) return;
  
  if (!sessionPaused) {
    const now = new Date();
    const diff = now - sessionStartTime;
    
    const hours = Math.floor(diff / 3600000);
    const minutes = Math.floor((diff % 3600000) / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    const timeString = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    document.getElementById('sessionDuration').textContent = timeString;
  }
  
  setTimeout(updateSessionTimer, 1000);
}

function updateSessionStats() {
  if (sessionStats.heartRates.length === 0) return;
  
  // Promedio
  const avg = Math.round(sessionStats.heartRates.reduce((a, b) => a + b, 0) / sessionStats.heartRates.length);
  document.getElementById('avgHeartRate').textContent = `${avg} bpm`;
  sessionStats.avgHeartRate = avg;
  
  // Máxima
  const max = Math.max(...sessionStats.heartRates);
  document.getElementById('maxHeartRate').textContent = `${max} bpm`;
  sessionStats.maxHeartRate = max;
  
  // Mínima
  const min = Math.min(...sessionStats.heartRates);
  document.getElementById('minHeartRate').textContent = `${min} bpm`;
  sessionStats.minHeartRate = min;
}

// ===================================
// HISTORIAL DE ENTRENAMIENTOS
// ===================================
function saveWorkoutSession() {
  const session = {
    date: new Date().toISOString(),
    duration: document.getElementById('sessionDuration').textContent,
    avgHeartRate: sessionStats.avgHeartRate,
    maxHeartRate: sessionStats.maxHeartRate,
    steps: sessionStats.steps,
    calories: sessionStats.calories,
    distance: sessionStats.distance
  };
  
  let history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
  history.unshift(session);
  
  // Mantener solo las últimas 20 sesiones
  if (history.length > 20) {
    history = history.slice(0, 20);
  }
  
  localStorage.setItem('workoutHistory', JSON.stringify(history));
  loadWorkoutHistory();
}

function loadWorkoutHistory() {
  const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
  const historyList = document.getElementById('historyList');
  
  if (history.length === 0) {
    historyList.innerHTML = '<p style="text-align: center; color: #6b7280; padding: 2rem;">No hay entrenamientos registrados aún.</p>';
    return;
  }
  
  historyList.innerHTML = history.map(session => {
    const date = new Date(session.date);
    const dateString = date.toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    
    return `
      <div class="history-item">
        <div class="history-item-date">
          <i class="fas fa-calendar-alt"></i> ${dateString}
        </div>
        <div class="history-item-stats">
          <span><i class="fas fa-clock"></i> ${session.duration}</span>
          <span><i class="fas fa-heartbeat"></i> ${session.avgHeartRate} bpm</span>
          <span><i class="fas fa-walking"></i> ${session.steps}</span>
          <span><i class="fas fa-fire"></i> ${session.calories} kcal</span>
        </div>
      </div>
    `;
  }).join('');
}

function exportData() {
  const history = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
  
  if (history.length === 0) {
    showAlert('warning', 'Sin datos', 'No hay datos para exportar.');
    return;
  }
  
  // Convertir a CSV
  let csv = 'Fecha,Duración,FC Promedio,FC Máxima,Pasos,Calorías,Distancia\n';
  
  history.forEach(session => {
    const date = new Date(session.date).toLocaleString('es-ES');
    csv += `${date},${session.duration},${session.avgHeartRate},${session.maxHeartRate},${session.steps},${session.calories},${session.distance}\n`;
  });
  
  // Descargar archivo
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `cuidar_entrenamientos_${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  
  showAlert('success', 'Datos exportados', 'Tus datos han sido exportados correctamente.');
}

// ===================================
// ALERTAS
// ===================================
function showAlert(type, title, message) {
  const alertsSection = document.getElementById('alertsSection');
  
  const alert = document.createElement('div');
  alert.className = `alert alert-${type}`;
  alert.innerHTML = `
    <div class="alert-icon">
      <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'warning' ? 'exclamation-triangle' : 'exclamation-circle'}"></i>
    </div>
    <div class="alert-content">
      <div class="alert-title">${title}</div>
      <div class="alert-message">${message}</div>
    </div>
  `;
  
  alertsSection.appendChild(alert);
  
  // Auto-remover después de 5 segundos
  setTimeout(() => {
    alert.style.animation = 'fadeOut 0.5s ease';
    setTimeout(() => alert.remove(), 500);
  }, 5000);
}

// ===================================
// ACTUALIZACIÓN DE ESTADO
// ===================================
function updateConnectionStatus(connected) {
  const statusIcon = document.getElementById('statusIcon');
  const statusText = document.getElementById('statusText');
  const connectBtn = document.getElementById('connectBtn');
  
  if (connected) {
    statusIcon.classList.add('connected');
    statusIcon.classList.remove('disconnected');
    statusText.textContent = 'Conectado';
    connectBtn.innerHTML = '<i class="fas fa-unlink"></i> Desconectar';
    connectBtn.onclick = disconnectDevice;
  } else {
    statusIcon.classList.add('disconnected');
    statusIcon.classList.remove('connected');
    statusText.textContent = 'Desconectado';
    connectBtn.innerHTML = '<i class="fas fa-plug"></i> Conectar Dispositivo';
    connectBtn.onclick = connectDevice;
  }
}

async function disconnectDevice() {
  if (port) {
    keepReading = false;
    if (reader) {
      await reader.cancel();
    }
    await port.close();
    port = null;
  }
  
  isConnected = false;
  updateConnectionStatus(false);
  showAlert('warning', 'Desconectado', 'Dispositivo desconectado.');
}

// ===================================
// SIMULACIÓN DE DATOS (Para pruebas)
// ===================================
function simulateData() {
  setInterval(() => {
    if (isConnected && sessionActive && !sessionPaused) {
      // Simular datos aleatorios
      const hr = 60 + Math.floor(Math.random() * 80);
      const temp = 36 + Math.random() * 1.5;
      const spo2 = 95 + Math.floor(Math.random() * 5);
      const steps = sessionStats.steps + Math.floor(Math.random() * 5);
      
      updateHeartRate(hr);
      updateTemperature(temp);
      updateOxygen(spo2);
      updateSteps(steps);
    }
  }, 1000);
}

// ===================================
// NAVEGACIÓN
// ===================================
// Hacer funcional el botón de notificaciones
document.addEventListener('DOMContentLoaded', function() {
  const notificationsBtn = document.getElementById('notificationsBtn');
  if (notificationsBtn) {
    notificationsBtn.addEventListener('click', function(e) {
      e.preventDefault();
      showAlert('info', 'Notificaciones', 'No tienes notificaciones nuevas en este momento.');
    });
  }

  // Actualizar badge de notificaciones
  updateNotificationBadge();
});

function updateNotificationBadge() {
  const badge = document.getElementById('notificationBadge');
  if (badge) {
    // Aquí podrías obtener el número real de notificaciones
    const notificationCount = 0;
    badge.textContent = notificationCount;
    badge.style.display = notificationCount > 0 ? 'flex' : 'none';
  }
}

// ===================================
// ANIMACIÓN DE FADE OUT
// ===================================
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(100%); }
  }
`;
document.head.appendChild(style);
