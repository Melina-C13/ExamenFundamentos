// Sistema de Reservas UNA-TEATRO

class TheaterSeating {
    constructor() {
        this.rows = 8;
        this.seatsPerRow = 12;
        this.selectedSeats = [];
        this.occupiedSeats = this.generateRandomOccupiedSeats();
        this.maxSeatsPerReservation = 8;
        
        this.init();
    }

    init() {
        this.generateSeatingChart();
        this.bindEvents();
        this.updateSelectedSeatsDisplay();
    }

    generateRandomOccupiedSeats() {
        const occupied = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const seatsPerRow = [12, 14, 16, 18, 20, 18, 16, 14];
        const numberOfOccupied = Math.floor(Math.random() * 30) + 20; // 20-50 asientos ocupados
        
        for (let i = 0; i < numberOfOccupied; i++) {
            const rowIndex = Math.floor(Math.random() * rows.length);
            const seatNumber = Math.floor(Math.random() * seatsPerRow[rowIndex]) + 1;
            const seatId = `${rows[rowIndex]}${seatNumber}`;
            
            if (!occupied.includes(seatId)) {
                occupied.push(seatId);
            }
        }
        
        return occupied;
    }

    generateSeatingChart() {
        const container = document.getElementById('seatingChart');
        container.innerHTML = '';

        // Configuración de filas (similar a la imagen)
        const rows = [
            { label: 'A', seats: 12, curve: 0 },    // Fila frontal (recta)
            { label: 'B', seats: 14, curve: 5 },    // Ligera curva
            { label: 'C', seats: 16, curve: 10 },   // Curva moderada
            { label: 'D', seats: 18, curve: 15 },   // Curva más pronunciada
            { label: 'E', seats: 20, curve: 20 },   // Curva fuerte
            { label: 'F', seats: 18, curve: 18 },   // Curva disminuyendo
            { label: 'G', seats: 16, curve: 12 },   // Curva suave
            { label: 'H', seats: 14, curve: 8 }     // Curva muy suave
        ];
        
        let seatCounter = 1;
        
        rows.forEach((row, rowIndex) => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';
            
            // Etiqueta de fila
            const labelDiv = document.createElement('div');
            labelDiv.className = 'row-label';
            labelDiv.textContent = row.label;
            rowDiv.appendChild(labelDiv);
            
            // Contenedor para asientos de esta fila
            const seatsContainer = document.createElement('div');
            seatsContainer.style.display = 'flex';
            seatsContainer.style.justifyContent = 'center';
            seatsContainer.style.alignItems = 'center';
            seatsContainer.style.position = 'relative';
            
            for (let i = 0; i < row.seats; i++) {
                const seatId = `${row.label}${i + 1}`;
                const seatDiv = document.createElement('div');
                seatDiv.className = 'seat';
                seatDiv.dataset.seatId = seatId;
                seatDiv.textContent = i + 1; // Mostrar número del asiento
                seatDiv.title = `Asiento ${seatId}`;
                
                // Aplicar curva sutil
                if (row.curve > 0) {
                    const curveOffset = Math.sin((i / (row.seats - 1)) * Math.PI - Math.PI / 2) * row.curve;
                    seatDiv.style.transform = `translateY(${curveOffset}px)`;
                }
                
                if (this.occupiedSeats.includes(seatId)) {
                    seatDiv.classList.add('occupied');
                } else {
                    seatDiv.classList.add('available');
                }
                
                seatsContainer.appendChild(seatDiv);
                seatCounter++;
            }
            
            rowDiv.appendChild(seatsContainer);
            container.appendChild(rowDiv);
        });
    }

    bindEvents() {
        // Eventos de clic en los asientos
        document.addEventListener('click', (e) => {
            if ((e.target.classList.contains('seat') || e.target.classList.contains('seat-circle')) && !e.target.classList.contains('occupied')) {
                this.toggleSeatSelection(e.target);
            }
        });

        // Evento del formulario
        const form = document.getElementById('reservationForm');
        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.processReservation();
            });
        }

        // Evento del contador de asientos
        const seatCountInput = document.getElementById('seatCount');
        if (seatCountInput) {
            seatCountInput.addEventListener('change', () => {
                this.validateSeatCount();
            });
        }
    }

    toggleSeatSelection(seatElement) {
        const seatId = seatElement.dataset.seatId;
        
        if (seatElement.classList.contains('selected')) {
            seatElement.classList.remove('selected');
            seatElement.classList.add('available');
            this.selectedSeats = this.selectedSeats.filter(id => id !== seatId);
        } else {
            if (this.selectedSeats.length >= this.maxSeatsPerReservation) {
                this.showNotification('Ha alcanzado el máximo de asientos permitidos por reserva', 'warning');
                return;
            }
            
            seatElement.classList.remove('available');
            seatElement.classList.add('selected');
            this.selectedSeats.push(seatId);
        }
        
        this.updateSelectedSeatsDisplay();
        this.updateSeatCountInput();
    }

    updateSelectedSeatsDisplay() {
        const selectedSeatsText = document.getElementById('selectedSeatsText');
        const selectedSeatsDiv = document.getElementById('selectedSeats');
        
        if (this.selectedSeats.length === 0) {
            selectedSeatsText.textContent = 'Ningún asiento seleccionado';
            selectedSeatsDiv.className = 'alert alert-info';
        } else {
            selectedSeatsText.textContent = this.selectedSeats.sort().join(', ');
            selectedSeatsDiv.className = 'alert alert-success';
        }
    }

    updateSeatCountInput() {
        const seatCountInput = document.getElementById('seatCount');
        if (seatCountInput && this.selectedSeats.length > 0) {
            seatCountInput.value = this.selectedSeats.length;
        }
    }

    validateSeatCount() {
        const seatCountInput = document.getElementById('seatCount');
        const desiredCount = parseInt(seatCountInput.value);
        
        if (this.selectedSeats.length > 0 && this.selectedSeats.length !== desiredCount) {
            this.showNotification(`Ha seleccionado ${this.selectedSeats.length} asientos, pero indicó que desea ${desiredCount}. Por favor, ajuste su selección.`, 'warning');
        }
    }

    processReservation() {
        const customerName = document.getElementById('customerName').value.trim();
        const customerEmail = document.getElementById('customerEmail').value.trim();
        const customerPhone = document.getElementById('customerPhone').value.trim();
        const seatCount = parseInt(document.getElementById('seatCount').value);

        // Validaciones
        if (!customerName || !customerEmail || !customerPhone) {
            this.showNotification('Por favor, complete todos los campos del formulario', 'danger');
            return;
        }

        if (this.selectedSeats.length === 0) {
            this.showNotification('Por favor, seleccione al menos un asiento', 'danger');
            return;
        }

        if (this.selectedSeats.length !== seatCount) {
            this.showNotification(`La cantidad de asientos seleccionados (${this.selectedSeats.length}) no coincide con la cantidad solicitada (${seatCount})`, 'danger');
            return;
        }

        // Validar formato de correo
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerEmail)) {
            this.showNotification('Por favor, ingrese un correo electrónico válido', 'danger');
            return;
        }

        // Procesar la reserva
        this.confirmReservation(customerName, customerEmail, customerPhone);
    }

    confirmReservation(name, email, phone) {
        // Marcar asientos como ocupados
        this.selectedSeats.forEach(seatId => {
            const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
            if (seatElement) {
                seatElement.classList.remove('selected', 'available');
                seatElement.classList.add('occupied');
            }
            this.occupiedSeats.push(seatId);
        });

        // Generar número de reserva
        const reservationNumber = 'RES-' + Date.now().toString().slice(-8);

        // Mostrar confirmación
        this.showReservationConfirmation(reservationNumber, name, email, phone);

        // Limpiar selección
        this.selectedSeats = [];
        this.updateSelectedSeatsDisplay();

        // Resetear formulario
        document.getElementById('reservationForm').reset();
        document.getElementById('seatCount').value = 1;
    }

    showReservationConfirmation(reservationNumber, name, email, phone) {
        const reservationInfo = document.getElementById('reservationInfo');
        const reservationDetails = document.getElementById('reservationDetails');
        
        const seatsText = this.selectedSeats.sort().join(', ');
        const date = new Date().toLocaleDateString('es-CR');
        const time = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });
        
        reservationDetails.innerHTML = `
            <strong>Número de Reserva:</strong> ${reservationNumber}<br>
            <strong>Cliente:</strong> ${name}<br>
            <strong>Correo:</strong> ${email}<br>
            <strong>Teléfono:</strong> ${phone}<br>
            <strong>Asientos Reservados:</strong> ${seatsText}<br>
            <strong>Fecha:</strong> ${date}<br>
            <strong>Hora:</strong> ${time}<br>
            <strong>Total:</strong> ₡${this.selectedSeats.length * 5000}
        `;
        
        reservationInfo.style.display = 'block';
        reservationInfo.scrollIntoView({ behavior: 'smooth' });
        
        this.showNotification('¡Reserva confirmada exitosamente!', 'success');
    }

    showNotification(message, type = 'info') {
        // Crear notificación
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 1050; max-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-eliminar después de 5 segundos
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    // Método para resetear el sistema
    resetSystem() {
        this.selectedSeats = [];
        this.occupiedSeats = this.generateRandomOccupiedSeats();
        this.generateSeatingChart();
        this.updateSelectedSeatsDisplay();
        document.getElementById('reservationInfo').style.display = 'none';
        document.getElementById('reservationForm').reset();
        document.getElementById('seatCount').value = 1;
    }
}

// Inicializar el sistema cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    window.theaterSeating = new TheaterSeating();
    
    // Agadir atajos de teclado
    document.addEventListener('keydown', (e) => {
        // Ctrl+R para resetear el sistema
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (confirm('¿Desea resetear el sistema de reservas?')) {
                window.theaterSeating.resetSystem();
            }
        }
    });
});

// Función para exportar datos (opcional)
function exportReservationData() {
    const data = {
        occupiedSeats: window.theaterSeating.occupiedSeats,
        timestamp: new Date().toISOString()
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `una-teatro-reservas-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
}