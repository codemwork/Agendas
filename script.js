// Sistema de Agenda Web Móvil para Entregas
// Gestión de estado global
const state = {
    selectedLocation: null,
    selectedDate: null,
    selectedTime: null,
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    appointments: [],
    priorityHours: {} // { 'location-weekNumber': { hour: 11, date: '2026-02-10' } }
};

// Configuración de ubicaciones y días
const LOCATIONS = {
    buenavista: {
        name: 'Metro Buenavista',
        days: [1], // Solo Lunes
        emoji: '🚇'
    },
    rosario: {
        name: 'Metro Rosario',
        days: [2, 3, 4, 5], // Martes a Viernes
        emoji: '🚇'
    }
};

// Horarios disponibles (8 AM a 8 PM)
const AVAILABLE_HOURS = [
    '08:00', '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', 
    '18:00', '19:00', '20:00'
];

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
    loadFromStorage();
    initLocationButtons();
    initCalendarNavigation();
    displayAppointments();
});

// Cargar datos desde localStorage
function loadFromStorage() {
    const stored = localStorage.getItem('deliveryAppointments');
    if (stored) {
        const data = JSON.parse(stored);
        state.appointments = data.appointments || [];
        state.priorityHours = data.priorityHours || {};
    }
}

// Guardar datos en localStorage
function saveToStorage() {
    const data = {
        appointments: state.appointments,
        priorityHours: state.priorityHours
    };
    localStorage.setItem('deliveryAppointments', JSON.stringify(data));
}

// Inicializar botones de ubicación
function initLocationButtons() {
    const buttons = document.querySelectorAll('.location-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', () => {
            const location = btn.dataset.location;
            selectLocation(location);
        });
    });
}

// Seleccionar ubicación
function selectLocation(location) {
    state.selectedLocation = location;
    state.selectedDate = null;
    state.selectedTime = null;
    
    // Actualizar UI de botones
    document.querySelectorAll('.location-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.location === location);
    });
    
    // Mostrar calendario
    document.getElementById('calendarSection').style.display = 'block';
    document.getElementById('timeSection').style.display = 'none';
    
    renderCalendar();
}

// Inicializar navegación del calendario
function initCalendarNavigation() {
    document.getElementById('prevMonth').addEventListener('click', () => {
        state.currentMonth--;
        if (state.currentMonth < 0) {
            state.currentMonth = 11;
            state.currentYear--;
        }
        renderCalendar();
    });
    
    document.getElementById('nextMonth').addEventListener('click', () => {
        state.currentMonth++;
        if (state.currentMonth > 11) {
            state.currentMonth = 0;
            state.currentYear++;
        }
        renderCalendar();
    });
}

// Renderizar calendario
function renderCalendar() {
    if (!state.selectedLocation) return;
    
    const monthYear = document.getElementById('monthYear');
    const calendarGrid = document.getElementById('calendarGrid');
    
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    monthYear.textContent = `${months[state.currentMonth]} ${state.currentYear}`;
    
    // Limpiar grid
    calendarGrid.innerHTML = '';
    
    // Agregar encabezados de días
    const dayHeaders = ['D', 'L', 'M', 'M', 'J', 'V', 'S'];
    dayHeaders.forEach(day => {
        const header = document.createElement('div');
        header.className = 'calendar-day-header';
        header.textContent = day;
        calendarGrid.appendChild(header);
    });
    
    // Obtener primer día del mes y total de días
    const firstDay = new Date(state.currentYear, state.currentMonth, 1).getDay();
    const daysInMonth = new Date(state.currentYear, state.currentMonth + 1, 0).getDate();
    const today = new Date();
    const todayMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    
    // Días vacíos antes del primer día del mes
    for (let i = 0; i < firstDay; i++) {
        const emptyDay = document.createElement('div');
        emptyDay.className = 'calendar-day empty';
        calendarGrid.appendChild(emptyDay);
    }
    
    // Renderizar días del mes
    const allowedDays = LOCATIONS[state.selectedLocation].days;
    
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(state.currentYear, state.currentMonth, day);
        const dayOfWeek = date.getDay();
        const dateStr = formatDate(date);
        
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';
        dayEl.textContent = day;
        
        // Verificar si es hoy
        if (date.toDateString() === today.toDateString()) {
            dayEl.classList.add('today');
        }
        
        // Verificar si el día está permitido para esta ubicación
        const isPast = date.getTime() < todayMidnight;
        const isAllowed = allowedDays.includes(dayOfWeek);
        
        if (isPast || !isAllowed) {
            dayEl.classList.add('disabled');
        } else {
            dayEl.classList.add('available');
            dayEl.addEventListener('click', () => selectDate(date));
        }
        
        // Marcar si está seleccionado
        if (state.selectedDate && formatDate(state.selectedDate) === dateStr) {
            dayEl.classList.add('selected');
        }
        
        calendarGrid.appendChild(dayEl);
    }
}

// Seleccionar fecha
function selectDate(date) {
    state.selectedDate = date;
    state.selectedTime = null;
    renderCalendar();
    showTimeSlots();
}

// Mostrar slots de tiempo
function showTimeSlots() {
    const timeSection = document.getElementById('timeSection');
    const timeGrid = document.getElementById('timeGrid');
    const priorityInfo = document.getElementById('priorityInfo');
    const confirmBtn = document.getElementById('confirmBtn');
    
    timeSection.style.display = 'block';
    timeGrid.innerHTML = '';
    confirmBtn.style.display = 'none';
    
    // Obtener hora prioritaria para esta ubicación y semana
    const weekKey = getWeekKey(state.selectedDate, state.selectedLocation);
    const priorityHour = state.priorityHours[weekKey];
    
    // Mostrar información de hora prioritaria
    if (priorityHour) {
        const priorityTime = AVAILABLE_HOURS[priorityHour.hour];
        priorityInfo.innerHTML = `
            <strong>⏰ Hora Prioritaria: ${priorityTime}</strong>
            Solo puedes agendar entre ${getTimeRange(priorityHour.hour)}
        `;
        priorityInfo.style.display = 'block';
    } else {
        priorityInfo.innerHTML = `
            <strong>🎯 Primera reserva de la semana</strong>
            Tu horario establecerá la hora prioritaria para otros usuarios
        `;
        priorityInfo.style.display = 'block';
    }
    
    // Renderizar slots de tiempo
    AVAILABLE_HOURS.forEach((time, index) => {
        const slot = document.createElement('div');
        slot.className = 'time-slot';
        slot.textContent = time;
        
        // Verificar disponibilidad según hora prioritaria
        const isAvailable = isTimeSlotAvailable(index, priorityHour);
        const dateTimeStr = `${formatDate(state.selectedDate)} ${time}`;
        const isBooked = state.appointments.some(apt => 
            apt.location === state.selectedLocation && 
            `${apt.date} ${apt.time}` === dateTimeStr
        );
        
        if (isBooked) {
            slot.classList.add('disabled');
            slot.innerHTML = `${time}<br><small>Ocupado</small>`;
        } else if (!isAvailable) {
            slot.classList.add('disabled');
        } else {
            // Marcar hora prioritaria
            if (priorityHour && index === priorityHour.hour) {
                slot.classList.add('priority');
            }
            
            slot.addEventListener('click', (e) => selectTime(time, index, e.currentTarget));
        }
        
        timeGrid.appendChild(slot);
    });
}

// Verificar si un slot de tiempo está disponible
function isTimeSlotAvailable(hourIndex, priorityHour) {
    if (!priorityHour) {
        return true; // Primera reserva de la semana, todos disponibles
    }
    
    // Permitir solo ±2 horas de la hora prioritaria
    const hourDifference = Math.abs(hourIndex - priorityHour.hour);
    return hourDifference <= 2;
}

// Obtener rango de tiempo permitido
function getTimeRange(priorityHourIndex) {
    const minIndex = Math.max(0, priorityHourIndex - 2);
    const maxIndex = Math.min(AVAILABLE_HOURS.length - 1, priorityHourIndex + 2);
    return `${AVAILABLE_HOURS[minIndex]} - ${AVAILABLE_HOURS[maxIndex]}`;
}

// Seleccionar hora
function selectTime(time, hourIndex, clickedElement) {
    state.selectedTime = { time, hourIndex };
    
    // Actualizar UI
    document.querySelectorAll('.time-slot').forEach(slot => {
        slot.classList.remove('selected');
    });
    clickedElement.classList.add('selected');
    
    // Mostrar botón de confirmación
    document.getElementById('confirmBtn').style.display = 'block';
    
    // Configurar evento del botón de confirmación
    document.getElementById('confirmBtn').onclick = confirmAppointment;
}

// Confirmar cita
function confirmAppointment() {
    if (!state.selectedLocation || !state.selectedDate || !state.selectedTime) {
        alert('Por favor completa todos los campos');
        return;
    }
    
    const weekKey = getWeekKey(state.selectedDate, state.selectedLocation);
    
    // Establecer hora prioritaria si es la primera reserva de la semana
    if (!state.priorityHours[weekKey]) {
        state.priorityHours[weekKey] = {
            hour: state.selectedTime.hourIndex,
            date: formatDate(state.selectedDate)
        };
    }
    
    // Crear cita
    const appointment = {
        id: Date.now(),
        location: state.selectedLocation,
        locationName: LOCATIONS[state.selectedLocation].name,
        date: formatDate(state.selectedDate),
        time: state.selectedTime.time,
        created: new Date().toISOString()
    };
    
    state.appointments.push(appointment);
    saveToStorage();
    
    // Mostrar confirmación
    alert(`✅ ¡Cita confirmada!\n\n${appointment.locationName}\n${formatDateDisplay(state.selectedDate)}\n${appointment.time}`);
    
    // Resetear selección
    state.selectedDate = null;
    state.selectedTime = null;
    
    // Actualizar UI
    renderCalendar();
    document.getElementById('timeSection').style.display = 'none';
    displayAppointments();
}

// Mostrar citas agendadas
function displayAppointments() {
    const appointmentsList = document.getElementById('appointmentsList');
    
    if (state.appointments.length === 0) {
        appointmentsList.innerHTML = '<div class="no-appointments">No tienes citas agendadas</div>';
        return;
    }
    
    // Ordenar citas por fecha
    const sortedAppointments = [...state.appointments].sort((a, b) => {
        const dateA = new Date(`${a.date} ${a.time}`);
        const dateB = new Date(`${b.date} ${b.time}`);
        return dateA - dateB;
    });
    
    appointmentsList.innerHTML = '';
    
    sortedAppointments.forEach(apt => {
        const item = document.createElement('div');
        item.className = 'appointment-item';
        
        const date = new Date(apt.date);
        
        item.innerHTML = `
            <div class="appointment-date">
                ${LOCATIONS[apt.location].emoji} ${apt.locationName}
            </div>
            <div class="appointment-details">
                📅 ${formatDateDisplay(date)}<br>
                🕒 ${apt.time}
            </div>
            <button class="delete-btn" onclick="deleteAppointment(${apt.id})">×</button>
        `;
        
        appointmentsList.appendChild(item);
    });
}

// Eliminar cita
function deleteAppointment(id) {
    if (!confirm('¿Seguro que deseas cancelar esta cita?')) {
        return;
    }
    
    state.appointments = state.appointments.filter(apt => apt.id !== id);
    saveToStorage();
    displayAppointments();
    
    // Recargar calendario si está visible
    if (state.selectedLocation) {
        renderCalendar();
        if (state.selectedDate) {
            showTimeSlots();
        }
    }
}

// Obtener clave de semana para priorización
function getWeekKey(date, location) {
    const weekNumber = getWeekNumber(date);
    const year = date.getFullYear();
    return `${location}-${year}-W${weekNumber}`;
}

// Obtener número de semana del año
function getWeekNumber(date) {
    const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    const dayNum = d.getUTCDay() || 7;
    d.setUTCDate(d.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
    return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

// Formatear fecha para almacenamiento (YYYY-MM-DD)
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

// Formatear fecha para mostrar
function formatDateDisplay(date) {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    
    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    
    return `${dayName} ${day} de ${month}, ${year}`;
}
