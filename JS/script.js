class TheaterSeating {
    constructor() {
        this.selectedSeats = [];
        this.maxSeats = 8;
        this.occupiedSeats = this.generateOccupied();
        this.rows = [
            { label: 'A', seats: 10, curve: 0 },
            { label: 'B', seats: 12, curve: 4 },
            { label: 'C', seats: 14, curve: 8 },
            { label: 'D', seats: 16, curve: 12 },
            { label: 'E', seats: 18, curve: 16 },
            { label: 'F', seats: 16, curve: 12 },
            { label: 'G', seats: 14, curve: 8 },
            { label: 'H', seats: 12, curve: 4 },
        ];
        this.init();
    }

    generateOccupied() {
        const occupied = [];
        const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
        const counts = [10, 12, 14, 16, 18, 16, 14, 12];
        const total = Math.floor(Math.random() * 30) + 20;
        for (let i = 0; i < total; i++) {
            const ri = Math.floor(Math.random() * rows.length);
            const si = Math.floor(Math.random() * counts[ri]) + 1;
            const id = `${rows[ri]}${si}`;
            if (!occupied.includes(id)) occupied.push(id);
        }
        return occupied;
    }

    init() {
        this.render();
        this.bindEvents();
    }

    render() {
        const container = document.getElementById('seatingChart');
        container.innerHTML = '';
        this.rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.className = 'seat-row';

            const lbl = document.createElement('div');
            lbl.className = 'row-label';
            lbl.textContent = row.label;
            rowDiv.appendChild(lbl);

            for (let i = 0; i < row.seats; i++) {
                const id = `${row.label}${i + 1}`;
                const seat = document.createElement('div');
                seat.className = 'seat';
                seat.dataset.seatId = id;
                seat.textContent = i + 1;
                seat.title = `Asiento ${id}`;

                if (row.curve > 0) {
                    const offset = Math.sin((i / (row.seats - 1)) * Math.PI - Math.PI / 2) * row.curve;
                    seat.style.transform = `translateY(${offset}px)`;
                }

                seat.classList.add(this.occupiedSeats.includes(id) ? 'occupied' : 'available');
                rowDiv.appendChild(seat);
            }
            container.appendChild(rowDiv);
        });
    }

    bindEvents() {
        document.addEventListener('click', e => {
            if (e.target.classList.contains('seat') && !e.target.classList.contains('occupied')) {
                this.toggleSeat(e.target);
            }
        });
        document.getElementById('reservationForm').addEventListener('submit', e => {
            e.preventDefault();
            this.processReservation();
        });
        document.getElementById('seatCount').addEventListener('change', () => this.validateCount());
    }

    toggleSeat(el) {
        const id = el.dataset.seatId;
        if (el.classList.contains('selected')) {
            el.classList.replace('selected', 'available');
            this.selectedSeats = this.selectedSeats.filter(s => s !== id);
        } else {
            if (this.selectedSeats.length >= this.maxSeats) {
                this.notify('Máximo 8 asientos por reserva', 'warning'); return;
            }
            el.classList.replace('available', 'selected');
            this.selectedSeats.push(id);
        }
        this.updateDisplay();
        document.getElementById('seatCount').value = this.selectedSeats.length || 1;
    }

    updateDisplay() {
        const display = document.getElementById('selectedSeatsDisplay');
        const text = document.getElementById('selectedSeatsText');
        display.innerHTML = '';
        if (this.selectedSeats.length === 0) {
            display.classList.remove('has-seats');
            const span = document.createElement('span');
            span.style.cssText = 'color:var(--stone);font-size:0.8rem;';
            span.textContent = 'Haz clic en los asientos del mapa';
            display.appendChild(span);
        } else {
            display.classList.add('has-seats');
            this.selectedSeats.sort().forEach(id => {
                const tag = document.createElement('span');
                tag.className = 'seat-tag';
                tag.textContent = id;
                display.appendChild(tag);
            });
        }
    }

    validateCount() {
        const val = parseInt(document.getElementById('seatCount').value);
        if (this.selectedSeats.length > 0 && this.selectedSeats.length !== val) {
            this.notify(`Tienes ${this.selectedSeats.length} asientos seleccionados pero indicaste ${val}`, 'warning');
        }
    }

    processReservation() {
        const name = document.getElementById('customerName').value.trim();
        const email = document.getElementById('customerEmail').value.trim();
        const phone = document.getElementById('customerPhone').value.trim();
        const count = parseInt(document.getElementById('seatCount').value);

        if (!name || !email || !phone) { this.notify('Completa todos los campos', 'danger'); return; }
        if (this.selectedSeats.length === 0) { this.notify('Selecciona al menos un asiento', 'danger'); return; }
        if (this.selectedSeats.length !== count) {
            this.notify(`Seleccionados: ${this.selectedSeats.length} - Solicitados: ${count}`, 'danger'); return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { this.notify('Correo inválido', 'danger'); return; }

        this.confirmReservation(name, email, phone);
    }

    confirmReservation(name, email, phone) {
        const seatsText = [...this.selectedSeats].sort().join(', ');
        const resNum = 'RES-' + Date.now().toString().slice(-8);
        const total = (this.selectedSeats.length * 5000).toLocaleString('es-CR');
        const date = new Date().toLocaleDateString('es-CR');
        const time = new Date().toLocaleTimeString('es-CR', { hour: '2-digit', minute: '2-digit' });

        this.selectedSeats.forEach(id => {
            const el = document.querySelector(`[data-seat-id="${id}"]`);
            if (el) { el.classList.remove('selected'); el.classList.add('occupied'); }
            this.occupiedSeats.push(id);
        });

        document.getElementById('reservationDetails').innerHTML = `
            <strong>N° Reserva:</strong> ${resNum}<br>
            <strong>Cliente:</strong> ${name}<br>
            <strong>Correo:</strong> ${email}<br>
            <strong>Teléfono:</strong> ${phone}<br>
            <strong>Asientos:</strong> ${seatsText}<br>
            <strong>Fecha:</strong> ${date} - ${time}<br>
            <strong>Total:</strong> ${total}
        `;

        const info = document.getElementById('reservationInfo');
        info.style.display = 'block';
        info.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        this.selectedSeats = [];
        this.updateDisplay();
        document.getElementById('reservationForm').reset();
        document.getElementById('seatCount').value = 1;
        this.notify('¡Reserva confirmada exitosamente!', 'success');
    }

    /* Ejercicio 2 - Función suggest() mejorada */
    suggest(n) {
        // Validar que n sea un número válido
        if (n <= 0 || !Number.isInteger(n)) {
            return new Set(); // cantidad inválida -> set vacío
        }

        // Obtener el tamaño máximo de cualquier fila
        const maxRowSize = Math.max(...this.rows.map(r => r.seats));
        
        // Caso 1: Si la cantidad de asientos solicitados excede el tamaño máximo de la fila
        if (n > maxRowSize) {
            return new Set(); // excede tamaño máximo -> set vacío
        }

        // Center row index (rows sorted A=front ... H=back, center = middle)
        const centerIndex = Math.floor(this.rows.length / 2);

        // Build sorted order by distance from center (filas más cercanas al escenario primero)
        const order = this.rows.map((r, i) => ({ row: r, dist: Math.abs(i - centerIndex) }))
            .sort((a, b) => a.dist - b.dist);

        // Buscar asientos contiguos en cada fila, desde la más cercana al escenario
        for (const { row } of order) {
            // Si n excede el tamaño de esta fila específica, continuar con la siguiente
            if (n > row.seats) continue;

            // Build availability array for this row (true = disponible, false = ocupado)
            const avail = [];
            for (let i = 1; i <= row.seats; i++) {
                const id = `${row.label}${i}`;
                avail.push(!this.occupiedSeats.includes(id));
            }

            // Slide window of size n - buscar n asientos contiguos disponibles
            for (let start = 0; start <= row.seats - n; start++) {
                const window = avail.slice(start, start + n);
                if (window.every(Boolean)) {
                    // Encontramos n asientos contiguos disponibles
                    const result = new Set();
                    for (let k = 0; k < n; k++) result.add(`${row.label}${start + k + 1}`);
                    return result;
                }
            }
        }

        // Caso 2: Si en ninguna fila hay suficientes asientos disponibles juntos
        return new Set(); // no se encontraron asientos contiguos -> set vacío
    }

    notify(msg, type = 'info') {
        const n = document.createElement('div');
        n.className = `notif notif-${type}`;
        n.textContent = msg;
        document.body.appendChild(n);
        setTimeout(() => n.remove(), 4000);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.theater = new TheaterSeating();

    // Ctrl+R -> reset
    document.addEventListener('keydown', e => {
        if (e.ctrlKey && e.key === 'r') {
            e.preventDefault();
            if (confirm('¿Resetear el sistema de reservas?')) {
                window.theater.selectedSeats = [];
                window.theater.occupiedSeats = window.theater.generateOccupied();
                window.theater.render();
                window.theater.updateDisplay();
                document.getElementById('reservationInfo').style.display = 'none';
                document.getElementById('reservationForm').reset();
            }
        }
    });
});
