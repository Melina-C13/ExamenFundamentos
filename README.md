# UNA-TEATRO - Sistema de Reservas

## Descripción

Página web interactiva para el teatro "UNA-TEATRO" que permite a los usuarios seleccionar asientos y realizar reservas en línea. El sistema incluye una representación visual del escenario, disposición de asientos interactiva y formulario de reservas completo.

## Características

### ✅ Funcionalidades Implementadas

1. **Representación Visual del Escenario**
   - Diseño atractivo con efectos de iluminación
   - Indicador de telón
   - Animaciones suaves

2. **Sistema de Asientos Interactivo**
   - 8 filas (A-H) con 12 asientos cada una
   - Asientos disponibles (verde)
   - Asientos ocupados (rojo)
   - Asientos seleccionados (azul)
   - Máximo 8 asientos por reserva

3. **Formulario de Reserva**
   - Selección de cantidad de asientos
   - Validación de datos del cliente
   - Confirmación instantánea
   - Generación de número de reserva

4. **Información del Teatro**
   - Nombre completo
   - Dirección: Av. Principal #123, Ciudad Universitaria
   - Teléfono: (506) 2222-3333
   - Correo: info@una-teatro.ac.cr
   - Horario de funcionamiento

## Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: Estilos personalizados con animaciones
- **Bootstrap 5**: Framework de diseño responsivo
- **JavaScript ES6+**: Lógica interactiva del sistema

## Estructura del Proyecto

```
ExamenFundamentos/
├── HTML/
│   └── index.html          # Página principal
├── CSS/
│   └── style.css           # Estilos personalizados
├── JS/
│   └── script.js           # Lógica del sistema
└── README.md               # Documentación
```

## Cómo Usar

1. **Abrir la página**: Abra `index.html` en un navegador web moderno

2. **Seleccionar asientos**: 
   - Haga clic en los asientos verdes para seleccionarlos
   - Los asientos se marcarán en azul
   - Puede seleccionar hasta 8 asientos

3. **Completar formulario**:
   - Indique cuántos asientos desea reservar
   - Complete sus datos personales
   - Haga clic en "Confirmar Reserva"

4. **Confirmación**:
   - Recibirá un número de reserva único
   - Los asientos se marcarán como ocupados
   - Puede presentar el comprobante al llegar al teatro

## Características Técnicas

### Diseño Responsivo
- Adaptado para dispositivos móviles, tablets y desktop
- Layout flexible que se ajusta al tamaño de pantalla

### Validaciones
- Campos obligatorios del formulario
- Formato de correo electrónico
- Coherencia entre asientos seleccionados y cantidad solicitada
- Límite de 8 asientos por reserva

### Interactividad
- Animaciones suaves al seleccionar asientos
- Notificaciones emergentes para feedback del usuario
- Efectos hover y transiciones

### Atajos de Teclado
- `Ctrl+R`: Resetear el sistema de reservas

## Configuración Personalizable

### Parámetros del Teatro
```javascript
this.rows = 8;                    // Número de filas
this.seatsPerRow = 12;            // Asientos por fila
this.maxSeatsPerReservation = 8;  // Máximo de asientos por reserva
```

### Precios
El precio por asiento está configurado en ₡5,000 (modificable en la línea 225 del archivo JS)

## Navegación

La página está organizada en secciones claras:

1. **Header**: Título del teatro
2. **Escenario**: Representación visual del escenario
3. **Selección de Asientos**: Grid interactivo de asientos
4. **Formulario de Reserva**: Datos del cliente y confirmación
5. **Footer**: Información de contacto y horarios

## Compatibilidad

- Chrome/Chromium (recomendado)
- Firefox
- Safari
- Edge
- Navegadores móviles modernos

## Notas Adicionales

- Los asientos ocupados se generan aleatoriamente al cargar la página
- El sistema mantiene el estado de las reservas durante la sesión
- Las reservas confirmadas no se pueden cancelar (funcionalidad futura)
- El diseño utiliza gradientes y animaciones CSS para mejor experiencia visual

## Autor

Desarrollado para el Examen 1 - Fundamentos de Programación Web
UNA-TEATRO - Sistema de Reservas