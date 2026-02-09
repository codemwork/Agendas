// Agenda de Entregas - Sistema con Códigos de Cancelación
class DeliveryScheduler {
    constructor() {
        this.currentWeek = this.getWeekStart(new Date());
        this.appointments = {};
        this.selectedDate = null;
        this.selectedTime = null;
        this.pendingAppointment = null;
        
        // Horarios disponibles (9 AM a 6 PM)
        this.timeSlots = [
            '09:00', '10:00', '11:00', '12:00', 
            '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
        ];
        
        this.init();
    }

    async init() {
        this.loadAppointments();
        this.setupEventListeners();
        this.updateWeekDisplay();
        this.renderCalendar();
        this.updateLocationPriorityDisplay();
    }

    loadAppointments() {
        // Cargar solo desde localStorage (sin fetch)
        const localData = localStorage.getItem('deliveryAppointments');
        this.appointments = localData ? JSON.parse(localData) : {};
        
        console.log('Datos cargados desde localStorage:', this.appointments);
        
        // Mostrar información de debug
        this.showDataStatus();
    }

    saveAppointments() {
        // Guardar solo en localStorage
        localStorage.setItem('deliveryAppointments', JSON.stringify(this.appointments));
        console.log('Datos guardados en localStorage:', this.appointments);
        
        // Actualizar status después de guardar
        this.showDataStatus();
    }

    showDataStatus() {
        const totalAppointments = Object.values(this.appointments)
            .reduce((total, dayAppts) => total + dayAppts.length, 0);
            
        const statusElement = document.getElementById('dataStatus');
        if (statusElement) {
            statusElement.innerHTML = `
                <div class="data-status">
                    📊 <strong>${totalAppointments} citas</strong> en este dispositivo
                    ${totalAppointments === 0 ? '<br>⚠️ Si esperabas ver citas, usa "Sincronizar Datos"' : ''}
                </div>
            `;
        }
    }



    setupEventListeners() {
        // Navegación de semanas
        document.getElementById('prevWeek').addEventListener('click', () => {
            this.currentWeek.setDate(this.currentWeek.getDate() - 7);
            this.updateWeekDisplay();
            this.renderCalendar();
        });

        document.getElementById('nextWeek').addEventListener('click', () => {
            this.currentWeek.setDate(this.currentWeek.getDate() + 7);
            this.updateWeekDisplay();
            this.renderCalendar();
        });

        // Modales de horarios
        document.getElementById('closeModal').addEventListener('click', () => {
            this.hideModal('timeModal');
        });

        // Modal de adelanto
        document.getElementById('closePaymentModal').addEventListener('click', () => {
            this.hideModal('paymentModal');
        });

        document.getElementById('agreePayment').addEventListener('click', () => {
            this.hideModal('paymentModal');
            this.showConfirmationModal();
        });

        document.getElementById('disagreePayment').addEventListener('click', () => {
            this.hideModal('paymentModal');
        });

        // Modal de confirmación
        document.getElementById('closeConfirmModal').addEventListener('click', () => {
            this.hideModal('confirmModal');
        });

        document.getElementById('confirmAppointment').addEventListener('click', () => {
            this.confirmAppointment();
        });

        document.getElementById('cancelAppointment').addEventListener('click', () => {
            this.hideModal('confirmModal');
        });

        // Modal de éxito
        document.getElementById('closeSuccessModal').addEventListener('click', () => {
            this.hideModal('successModal');
        });

        document.getElementById('closeSuccess').addEventListener('click', () => {
            this.hideModal('successModal');
        });

        // Botón de cancelar cita
        document.getElementById('cancelAppointmentBtn').addEventListener('click', () => {
            this.showModal('cancelModal');
        });

        // Modal de cancelación
        document.getElementById('closeCancelModal').addEventListener('click', () => {
            this.hideModal('cancelModal');
        });
        // Botón de sincronización rápida
        document.getElementById('quickSync').addEventListener('click', () => {
            this.showSyncModal();
        });
        document.getElementById('closeCancelAction').addEventListener('click', () => {
            this.hideModal('cancelModal');
        });

        document.getElementById('processCancelation').addEventListener('click', () => {
            this.processCancelation();
        });
    }

    getWeekStart(date) {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Lunes como inicio
        return new Date(d.setDate(diff));
    }

    updateWeekDisplay() {
        const endWeek = new Date(this.currentWeek);
        endWeek.setDate(endWeek.getDate() + 6);
        
        const startStr = this.currentWeek.toLocaleDateString('es', { 
            day: 'numeric', 
            month: 'short' 
        });
        const endStr = endWeek.toLocaleDateString('es', { 
            day: 'numeric', 
            month: 'short',
            year: 'numeric'
        });
        
        document.getElementById('weekRange').textContent = `${startStr} - ${endStr}`;
    }

    renderCalendar() {
        const calendar = document.getElementById('calendar');
        calendar.innerHTML = '';

        const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie'];
        const locations = ['Metro Rosario', 'Metro Rosario', 'Metro Rosario', 'Metro Rosario', 'Metro Buenavista'];

        days.forEach((dayName, index) => {
            const currentDate = new Date(this.currentWeek);
            currentDate.setDate(currentDate.getDate() + index);
            
            // Solo mostrar días pasados y futuros (no pasado)
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (currentDate >= today) {
                const dayElement = this.createDayElement(dayName, currentDate, locations[index], index);
                calendar.appendChild(dayElement);
            }
        });
    }

    createDayElement(dayName, date, location, dayIndex) {
        const dayKey = this.getDayKey(date);
        const appointments = this.appointments[dayKey] || [];
        const priorityTime = this.getPriorityTime(dayKey);
        const isValidDate = this.isValidBookingDate(date);
        const maxAppointments = 3;
        
        const dayDiv = document.createElement('div');
        dayDiv.className = `day-card ${!isValidDate ? 'disabled-day' : ''}`;
        
        let disabledReason = '';
        let buttonText = 'Agendar cita';
        let isDisabled = false;
        
        if (!isValidDate) {
            disabledReason = 'Se requieren 2 días para elaboración';
            buttonText = 'No disponible';
            isDisabled = true;
        } else if (appointments.length >= maxAppointments) {
            buttonText = 'Día lleno';
            isDisabled = true;
        }
        
        dayDiv.innerHTML = `
            <div class="day-header">
                <h3>${dayName} ${date.getDate()}</h3>
                <p class="location">${location}</p>
                ${priorityTime ? `<p class="priority-badge">🕐 Prioritario: ${priorityTime}</p>` : ''}
                ${!isValidDate ? `<p class="warning-badge">⚠️ ${disabledReason}</p>` : ''}
            </div>
            <div class="appointments">
                ${appointments.length > 0 ? 
                    appointments.map(apt => `
                        <div class="appointment">
                            <span class="time">${apt.time}</span>
                            <span class="name">${apt.name}</span>
                            ${apt.item ? `<span class="item">🎨 ${apt.item}</span>` : ''}
                        </div>
                    `).join('') : 
                    '<p class="no-appointments">Sin citas</p>'
                }
            </div>
            <button class="book-btn" ${isDisabled ? 'disabled' : ''}>
                ${buttonText}
            </button>
        `;

        if (!isDisabled) {
            dayDiv.querySelector('.book-btn').addEventListener('click', () => {
                this.openTimeModal(date, location, dayIndex);
            });
        }

        return dayDiv;
    }

    isValidBookingDate(selectedDate) {
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        
        // Calcular la diferencia en días
        const diffTime = selectedDate.getTime() - today.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        
        // Se requieren mínimo 2 días de anticipación
        return diffDays >= 2;
    }

    openTimeModal(date, location, dayIndex) {
        // Verificar nuevamente si la fecha es válida (por si acaso)
        if (!this.isValidBookingDate(date)) {
            alert('⚠️ No se puede agendar esta fecha.\nSe requieren mínimo 2 días para la elaboración de la pieza.');
            return;
        }
        
        this.selectedDate = date;
        const dayKey = this.getDayKey(date);
        const appointments = this.appointments[dayKey] || [];
        const priorityTime = this.getPriorityTime(dayKey);
        
        document.getElementById('modalTitle').textContent = 
            `${date.toLocaleDateString('es', { weekday: 'long', day: 'numeric', month: 'long' })} - ${location}`;

        // Mostrar información de prioridad
        const priorityInfo = document.getElementById('priorityInfo');
        if (priorityTime) {
            priorityInfo.className = 'priority-info';
            priorityInfo.innerHTML = `
                <strong>⚠️ Hora Prioritaria: ${priorityTime}</strong><br>
                <small>Solo puedes agendar cerca de esta hora para optimizar entregas</small>
            `;
        } else {
            priorityInfo.className = 'priority-info hidden';
        }

        // Generar horarios disponibles
        const availableSlots = this.getAvailableSlots(dayKey, priorityTime);
        const timeSlotsContainer = document.getElementById('timeSlots');
        timeSlotsContainer.innerHTML = '';

        if (availableSlots.length === 0) {
            timeSlotsContainer.innerHTML = '<p style="text-align: center; color: #7f8c8d; font-style: italic;">No hay horarios disponibles este día</p>';
        } else {
            availableSlots.forEach(time => {
                const button = document.createElement('button');
                button.className = 'time-slot';
                button.textContent = time;
                button.addEventListener('click', () => {
                    this.selectTime(time);
                });
                timeSlotsContainer.appendChild(button);
            });
        }

        this.showModal('timeModal');
    }

    getAvailableSlots(dayKey, priorityTime) {
        const appointments = this.appointments[dayKey] || [];
        const bookedTimes = appointments.map(apt => apt.time);
        
        if (!priorityTime) {
            // Si no hay hora prioritaria, todos los horarios están disponibles
            return this.timeSlots.filter(time => !bookedTimes.includes(time));
        }
        
        // Si hay hora prioritaria, solo permitir ±2 horas
        const priorityHour = parseInt(priorityTime.split(':')[0]);
        const allowedSlots = this.timeSlots.filter(time => {
            const hour = parseInt(time.split(':')[0]);
            return Math.abs(hour - priorityHour) <= 2;
        });
        
        return allowedSlots.filter(time => !bookedTimes.includes(time));
    }

    selectTime(time) {
        this.selectedTime = time;
        this.hideModal('timeModal');
        
        // Crear objeto de cita pendiente
        this.pendingAppointment = {
            date: this.selectedDate,
            time: this.selectedTime,
            location: this.selectedDate.getDay() === 5 ? 'Metro Buenavista' : 'Metro Rosario'
        };
        
        this.showPaymentModal();
    }

    showPaymentModal() {
        const details = document.getElementById('paymentDetails');
        details.innerHTML = `
            <p><strong>Fecha:</strong> ${this.pendingAppointment.date.toLocaleDateString('es', { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
            })}</p>
            <p><strong>Hora:</strong> ${this.pendingAppointment.time}</p>
            <p><strong>Ubicación:</strong> ${this.pendingAppointment.location}</p>
        `;
        
        this.showModal('paymentModal');
    }

    showConfirmationModal() {
        const details = document.getElementById('appointmentDetails');
        details.innerHTML = `
            <div style="background: #f8f9fa; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
                <p><strong>Fecha:</strong> ${this.pendingAppointment.date.toLocaleDateString('es', { 
                    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                })}</p>
                <p><strong>Hora:</strong> ${this.pendingAppointment.time}</p>
                <p><strong>Ubicación:</strong> ${this.pendingAppointment.location}</p>
            </div>
        `;
        
        document.getElementById('clientName').value = '';
        document.getElementById('clientPhone').value = '';
        document.getElementById('itemDescription').value = '';
        this.showModal('confirmModal');
    }

    confirmAppointment() {
        const name = document.getElementById('clientName').value.trim();
        if (!name) {
            alert('Por favor ingresa tu nombre');
            return;
        }

        const item = document.getElementById('itemDescription').value.trim();
        if (!item) {
            alert('Por favor especifica qué artículo vas a apartar');
            return;
        }

        const phone = document.getElementById('clientPhone').value.trim();
        const dayKey = this.getDayKey(this.pendingAppointment.date);
        const cancelCode = this.generateCancelCode();
        
        if (!this.appointments[dayKey]) {
            this.appointments[dayKey] = [];
        }
        
        const appointment = {
            time: this.pendingAppointment.time,
            name: name,
            phone: phone,
            item: item,
            location: this.pendingAppointment.location,
            timestamp: new Date().toISOString(),
            cancelCode: cancelCode
        };
        
        this.appointments[dayKey].push(appointment);
        this.saveAppointments();
        this.hideModal('confirmModal');
        
        // Enviar a Discord webhook
        this.sendToDiscordWebhook(appointment, this.pendingAppointment.date);
        
        // Mostrar modal de éxito con código
        this.showSuccessModal(appointment);
        
        this.renderCalendar();
        this.updateLocationPriorityDisplay();
    }

    generateCancelCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let code = '';
        for (let i = 0; i < 6; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        // Verificar que el código no exista ya
        if (this.isCodeInUse(code)) {
            return this.generateCancelCode(); // Recursivo si ya existe
        }
        return code;
    }

    isCodeInUse(code) {
        for (const [date, appointments] of Object.entries(this.appointments)) {
            if (appointments.some(apt => apt.cancelCode === code)) {
                return true;
            }
        }
        return false;
    }

    showSuccessModal(appointment) {
        const details = document.getElementById('successDetails');
        details.innerHTML = `
            <h4>Tu cita ha sido confirmada</h4>
            <p><strong>Fecha:</strong> ${this.pendingAppointment.date.toLocaleDateString('es', { 
                weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
            })}</p>
            <p><strong>Hora:</strong> ${appointment.time}</p>
            <p><strong>Ubicación:</strong> ${appointment.location}</p>
            <p><strong>Nombre:</strong> ${appointment.name}</p>
            <p><strong>🎨 Artículo:</strong> ${appointment.item}</p>
        `;
        
        document.getElementById('cancelCodeDisplay').textContent = appointment.cancelCode;
        this.showModal('successModal');
    }

    showSyncModal() {
        // Crear modal de sincronización dinámicamente si no existe
        if (!document.getElementById('syncModal')) {
            const syncModalHTML = `
                <div id="syncModal" class="modal hidden">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h3>🔄 Sincronizar Datos</h3>
                            <button id="closeSyncModal" class="close-btn">✕</button>
                        </div>
                        <div class="modal-body">
                            <div class="sync-options">
                                <div class="sync-option">
                                    <h4>📤 Exportar Mis Datos</h4>
                                    <p>Descarga todas las citas de este dispositivo</p>
                                    <button id="exportData" class="btn btn-primary">Descargar JSON</button>
                                </div>
                                
                                <div class="sync-option">
                                    <h4>📥 Importar Datos</h4>
                                    <p>Carga citas desde otro dispositivo</p>
                                    <input type="file" id="importFile" accept=".json" style="display: none;">
                                    <button id="importData" class="btn btn-secondary">Seleccionar Archivo</button>
                                </div>
                                
                                <div class="sync-option">
                                    <h4>📋 Importar desde Texto</h4>
                                    <p>Pega JSON copiado desde otro dispositivo</p>
                                    <textarea id="jsonInput" placeholder="Pega aquí el JSON..." rows="4"></textarea>
                                    <button id="loadFromText" class="btn btn-secondary">Cargar Datos</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', syncModalHTML);
            
            // Configurar eventos del modal de sync
            this.setupSyncEvents();
        }
        
        this.showModal('syncModal');
    }

    setupSyncEvents() {
        document.getElementById('closeSyncModal').addEventListener('click', () => {
            this.hideModal('syncModal');
        });
        
        document.getElementById('exportData').addEventListener('click', () => {
            this.exportAppointments();
        });
        
        document.getElementById('importData').addEventListener('click', () => {
            document.getElementById('importFile').click();
        });
        
        document.getElementById('importFile').addEventListener('change', (e) => {
            this.importFromFile(e.target.files[0]);
        });
        
        document.getElementById('loadFromText').addEventListener('click', () => {
            this.importFromText();
        });
    }

    exportAppointments() {
        const data = {
            appointments: this.appointments,
            exportDate: new Date().toISOString(),
            deviceInfo: 'Agenda-de-Entregas'
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `citas-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        alert('✅ Datos exportados. Comparte este archivo con otros dispositivos.');
    }

    async importFromFile(file) {
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            this.mergeAppointments(data.appointments || data);
        } catch (error) {
            alert('❌ Error al leer el archivo. Verifica que sea un JSON válido.');
        }
    }

    importFromText() {
        const text = document.getElementById('jsonInput').value.trim();
        if (!text) {
            alert('⚠️ Pega el JSON en el área de texto.');
            return;
        }
        
        try {
            const data = JSON.parse(text);
            this.mergeAppointments(data.appointments || data);
            document.getElementById('jsonInput').value = '';
        } catch (error) {
            alert('❌ JSON inválido. Verifica el formato.');
        }
    }

    mergeAppointments(newData) {
        if (!newData || typeof newData !== 'object') {
            alert('❌ Datos inválidos.');
            return;
        }
        
        let mergedCount = 0;
        let duplicatesSkipped = 0;
        
        for (const [date, appointments] of Object.entries(newData)) {
            if (!this.appointments[date]) {
                this.appointments[date] = [];
            }
            
            for (const apt of appointments) {
                // Verificar duplicados por código de cancelación
                const exists = this.appointments[date].some(existing => 
                    existing.cancelCode === apt.cancelCode
                );
                
                if (!exists) {
                    this.appointments[date].push(apt);
                    mergedCount++;
                } else {
                    duplicatesSkipped++;
                }
            }
        }
        
        this.saveAppointments();
        this.renderCalendar();
        this.hideModal('syncModal');
        
        alert(`✅ Sincronización completa:\n${mergedCount} citas nuevas importadas\n${duplicatesSkipped} duplicados omitidos`);
    }

    processCancelation() {
        const code = document.getElementById('cancelCode').value.trim().toUpperCase();
        const resultDiv = document.getElementById('cancelResult');
        
        if (!code) {
            this.showCancelResult('Error: Ingresa un código de cancelación', false);
            return;
        }
        
        // Buscar la cita con el código
        let foundAppointment = null;
        let appointmentDate = null;
        
        for (const [date, appointments] of Object.entries(this.appointments)) {
            const appointmentIndex = appointments.findIndex(apt => apt.cancelCode === code);
            if (appointmentIndex !== -1) {
                foundAppointment = appointments[appointmentIndex];
                appointmentDate = date;
                
                // Eliminar la cita
                appointments.splice(appointmentIndex, 1);
                
                // Si no quedan citas ese día, eliminar el día
                if (appointments.length === 0) {
                    delete this.appointments[date];
                }
                
                break;
            }
        }
        
        if (foundAppointment) {
            this.saveAppointments();
            this.renderCalendar();
            this.updateLocationPriorityDisplay();
            
            const appointmentDateObj = new Date(appointmentDate);
            
            // Mostrar confirmación visual mejorada
            this.showCancelResult(foundAppointment, appointmentDateObj, true);
            
            // Enviar notificación a Discord
            this.sendCancelToDiscordWebhook(foundAppointment, appointmentDateObj);
            
            // Limpiar el campo
            document.getElementById('cancelCode').value = '';
            
        } else {
            this.showCancelResult(null, null, false);
        }
    }

    async sendToDiscordWebhook(appointment, date) {
        const webhookUrl = 'https://discordapp.com/api/webhooks/1470266389444169728/mpCZHWlS7Ik60fcjUecn8GbifDc47LkN9pNJ2XbJReprDr6nTEu4Zf6S5IDnvw4oYdU8';
        
        const embed = {
            title: '🎨 Nueva Cita Agendada',
            color: 3447003, // Color azul
            fields: [
                {
                    name: '👤 Cliente',
                    value: appointment.name,
                    inline: true
                },
                {
                    name: '📱 Teléfono',
                    value: appointment.phone || 'No proporcionado',
                    inline: true
                },
                {
                    name: '💍 Artículo',
                    value: appointment.item,
                    inline: true
                },
                {
                    name: '🕐 Hora',
                    value: appointment.time,
                    inline: true
                },
                {
                    name: '📅 Fecha',
                    value: date.toLocaleDateString('es', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                    }),
                    inline: false
                },
                {
                    name: '📍 Ubicación',
                    value: appointment.location,
                    inline: true
                },
                {
                    name: '🔑 Código de Cancelación',
                    value: `\`${appointment.cancelCode}\``,
                    inline: true
                }
            ],
            footer: {
                text: '🎨 Sistema de Entregas'
            },
            timestamp: new Date().toISOString()
        };
        
        const payload = {
            embeds: [embed]
        };
        
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('✅ Notificación enviada a Discord');
            } else {
                console.warn('⚠️ Error enviando a Discord:', response.status);
            }
        } catch (error) {
            console.error('❌ Error conectando con Discord:', error);
        }
    }

    showCancelResult(appointment, date, isSuccess) {
        const resultDiv = document.getElementById('cancelResult');
        
        if (isSuccess && appointment) {
            resultDiv.innerHTML = `
                <div class="cancel-success">
                    <div class="success-icon">✅</div>
                    <h4>¡Cita cancelada exitosamente!</h4>
                    <div class="canceled-appointment-details">
                        <p><strong>👤 Cliente:</strong> ${appointment.name}</p>
                        <p><strong>🎨 Artículo:</strong> ${appointment.item}</p>
                        <p><strong>📅 Fecha:</strong> ${date.toLocaleDateString('es', { 
                            weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' 
                        })}</p>
                        <p><strong>🕐 Hora:</strong> ${appointment.time}</p>
                        <p><strong>📍 Ubicación:</strong> ${appointment.location}</p>
                    </div>
                    <p class="cancel-note">Se ha notificado la cancelación automáticamente.</p>
                </div>
            `;
            resultDiv.className = 'cancel-result success';
        } else {
            resultDiv.innerHTML = `
                <div class="cancel-error">
                    <div class="error-icon">❌</div>
                    <p>Código de cancelación no encontrado</p>
                    <p class="error-note">Verifica que el código sea correcto</p>
                </div>
            `;
            resultDiv.className = 'cancel-result error';
        }
        
        resultDiv.classList.remove('hidden');
        
        // Auto ocultar después de unos segundos en caso de éxito
        if (isSuccess) {
            setTimeout(() => {
                this.hideModal('cancelModal');
                resultDiv.classList.add('hidden');
            }, 4000);
        }
    }

    async sendCancelToDiscordWebhook(appointment, date) {
        const webhookUrl = 'https://discordapp.com/api/webhooks/1470266389444169728/mpCZHWlS7Ik60fcjUecn8GbifDc47LkN9pNJ2XbJReprDr6nTEu4Zf6S5IDnvw4oYdU8';
        
        const embed = {
            title: '❌ Cita Cancelada',
            color: 15158332, // Color rojo
            fields: [
                {
                    name: '👤 Cliente',
                    value: appointment.name,
                    inline: true
                },
                {
                    name: '📱 Teléfono',
                    value: appointment.phone || 'No proporcionado',
                    inline: true
                },
                {
                    name: '💎 Artículo',
                    value: appointment.item,
                    inline: true
                },
                {
                    name: '🕐 Hora Original',
                    value: appointment.time,
                    inline: true
                },
                {
                    name: '📅 Fecha Original',
                    value: date.toLocaleDateString('es', { 
                        weekday: 'long', 
                        day: 'numeric', 
                        month: 'long',
                        year: 'numeric'
                    }),
                    inline: false
                },
                {
                    name: '📍 Ubicación',
                    value: appointment.location,
                    inline: true
                },
                {
                    name: '🔑 Código Usado',
                    value: ` \`${appointment.cancelCode}\` `,
                    inline: true
                },
                {
                    name: '⏰ Cancelado el',
                    value: new Date().toLocaleString('es', {
                        day: 'numeric',
                        month: 'long', 
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    }),
                    inline: false
                }
            ],
            footer: {
                text: '🎨 Sistema de Entregas - Cancelación'
            },
            timestamp: new Date().toISOString()
        };
        
        const payload = {
            embeds: [embed]
        };
        
        try {
            const response = await fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            });
            
            if (response.ok) {
                console.log('🔔 Cancelación notificada a Discord');
            } else {
                console.warn('⚠️ Error enviando cancelación a Discord:', response.status);
            }
        } catch (error) {
            console.error('❌ Error conectando con Discord para cancelación:', error);
        }
    }

    getPriorityTime(dayKey) {
        const appointments = this.appointments[dayKey];
        if (!appointments || appointments.length === 0) return null;
        
        // Return the time of the first appointment (chronologically first booked)
        const sortedAppointments = appointments.sort((a, b) => 
            new Date(a.timestamp) - new Date(b.timestamp)
        );
        
        return sortedAppointments[0].time;
    }

    updateLocationPriorityDisplay() {
        const rosario = document.querySelector('.location-card.rosario .priority-text');
        const buenavista = document.querySelector('.location-card.buenavista .priority-text');
        
        // Check Monday-Thursday (Rosario) priorities
        let rosarioPriorities = [];
        for (let i = 0; i <= 3; i++) { // Lunes a Jueves
            const date = new Date(this.currentWeek);
            date.setDate(date.getDate() + i);
            const key = this.getDayKey(date);
            const priority = this.getPriorityTime(key);
            if (priority) rosarioPriorities.push(priority);
        }
        
        // Check Friday (Buenavista) priority
        const fridayDate = new Date(this.currentWeek);
        fridayDate.setDate(fridayDate.getDate() + 4); // Viernes
        const fridayKey = this.getDayKey(fridayDate);
        const fridayPriority = this.getPriorityTime(fridayKey);
        
        // Update display
        if (rosario) {
            rosario.textContent = rosarioPriorities.length > 0 ? 
                `${rosarioPriorities.length} entrega(s) programada(s)` : 'Sin entregas programadas';
        }
        
        if (buenavista) {
            buenavista.textContent = fridayPriority ? 
                `Entrega prioritaria: ${fridayPriority}` : 'Sin entregas programadas';
        }
    }

    getDayKey(date) {
        return date.toISOString().split('T')[0];
    }

    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        document.body.classList.add('modal-open');
    }

    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
        document.body.classList.remove('modal-open');
    }
}

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.scheduler = new DeliveryScheduler();
});
