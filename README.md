# 📅 Sistema de Agenda Web Móvil para Entregas

Sistema web optimizado para dispositivos móviles que permite a los usuarios agendar entregas de piezas con un sistema inteligente de priorización de horarios.

## 🌟 Características Principales

### 📍 Sistema de Ubicaciones
- **Metro Buenavista**: Disponible únicamente los **Lunes**
- **Metro Rosario**: Disponible de **Martes a Viernes**

### 🧠 Lógica de Priorización Inteligente

El sistema implementa un algoritmo de priorización que optimiza el tiempo de entrega:

1. **Primera Reserva de la Semana**: El primer usuario que agenda en una semana establece la "hora prioritaria" para esa ubicación
2. **Ventana de Disponibilidad**: Los usuarios subsecuentes solo pueden agendar dentro de una ventana de ±2 horas de la hora prioritaria
3. **Prevención de Dispersión**: Evita que las citas estén muy dispersas en el tiempo
4. **Optimización**: Agrupa las entregas para minimizar tiempos de espera

**Ejemplo:**
- Usuario A agenda para Rosario el martes a las 11:00 AM → Esta se convierte en la hora prioritaria
- Usuario B solo podrá elegir horarios entre 09:00 AM y 13:00 PM
- Usuario C no podrá agendar a las 18:00 PM ese mismo día

### 📱 Interfaz Móvil

- ✅ Diseño completamente responsive
- ✅ Optimizado para smartphones
- ✅ Calendario interactivo táctil
- ✅ Indicadores visuales claros
- ✅ Navegación intuitiva

## 🚀 Uso

### Instalación

No requiere instalación. Simplemente abre el archivo `index.html` en cualquier navegador web moderno.

```bash
# Clonar el repositorio
git clone https://github.com/codemwork/Agendas.git

# Abrir en navegador
cd Agendas
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Cómo Agendar una Cita

1. **Selecciona Ubicación**: Elige entre Metro Buenavista (Lunes) o Metro Rosario (Mar-Vie)
2. **Selecciona Fecha**: Usa el calendario para elegir un día disponible
3. **Selecciona Hora**: Elige un horario disponible (respetando la hora prioritaria si existe)
4. **Confirma**: Presiona "Confirmar Cita" para guardar tu reserva

### Gestión de Citas

- **Ver Citas**: La sección inferior muestra todas tus citas agendadas
- **Cancelar**: Presiona el botón "×" en cualquier cita para cancelarla

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica
- **CSS3**: 
  - Flexbox y Grid para layouts responsivos
  - Gradientes y sombras para diseño moderno
  - Media queries para diferentes tamaños de pantalla
- **JavaScript Vanilla**: 
  - Sin dependencias externas
  - API de localStorage para persistencia
  - Programación orientada a eventos

## 💾 Almacenamiento de Datos

Los datos se almacenan localmente en el navegador usando `localStorage`:

```javascript
{
  "appointments": [
    {
      "id": 1707389234567,
      "location": "rosario",
      "locationName": "Metro Rosario",
      "date": "2026-02-10",
      "time": "11:00",
      "created": "2026-02-08T06:21:59.622Z"
    }
  ],
  "priorityHours": {
    "rosario-2026-W7": {
      "hour": 3,
      "date": "2026-02-10"
    }
  }
}
```

## 📋 Estructura del Proyecto

```
Agendas/
├── index.html      # Página principal
├── style.css       # Estilos responsivos
├── script.js       # Lógica de la aplicación
└── README.md       # Documentación
```

## 🎨 Diseño y UX

### Paleta de Colores
- **Primary**: Gradiente púrpura (`#667eea` → `#764ba2`)
- **Success**: Verde (`#28a745`)
- **Warning**: Amarillo (`#ffc107`)
- **Danger**: Rojo (`#dc3545`)

### Componentes Principales

1. **Header**: Título y descripción de la aplicación
2. **Selector de Ubicación**: Botones para elegir Metro Buenavista o Rosario
3. **Calendario**: Vista mensual con navegación
4. **Slots de Tiempo**: Grid de horarios disponibles
5. **Lista de Citas**: Resumen de todas las citas agendadas

## 🔧 Funciones Principales

### `selectLocation(location)`
Maneja la selección de ubicación y muestra el calendario correspondiente.

### `renderCalendar()`
Renderiza el calendario mostrando solo los días permitidos para la ubicación seleccionada.

### `showTimeSlots()`
Muestra los horarios disponibles respetando la lógica de priorización.

### `confirmAppointment()`
Guarda la cita y establece/respeta la hora prioritaria de la semana.

### `getWeekKey(date, location)`
Genera una clave única para cada semana y ubicación para gestionar horas prioritarias.

## 📱 Compatibilidad

- ✅ Chrome/Edge (últimas versiones)
- ✅ Firefox (últimas versiones)
- ✅ Safari (iOS 12+)
- ✅ Chrome Mobile (Android 8+)

## 🔐 Privacidad

Todos los datos se almacenan localmente en tu dispositivo. No se envía información a servidores externos.

## 🐛 Resolución de Problemas

### Las citas no se guardan
- Verifica que tu navegador permita localStorage
- Comprueba que no estés en modo incógnito

### No veo fechas disponibles
- Asegúrate de haber seleccionado una ubicación primero
- Verifica que estés navegando en fechas futuras
- Confirma que el día de la semana sea correcto para la ubicación

### No puedo seleccionar ciertos horarios
- Es normal si ya existe una hora prioritaria establecida
- Solo puedes agendar dentro de ±2 horas de la hora prioritaria

## 📝 Licencia

Este proyecto es de código abierto y está disponible bajo la licencia MIT.

## 👥 Contribuciones

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📞 Soporte

Si encuentras algún problema o tienes sugerencias, por favor abre un issue en GitHub.

---

Desarrollado con ❤️ para optimizar entregas y ahorrar tiempo.
