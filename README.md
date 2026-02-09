# 📦 Agenda de Entregas - Sistema JSON

Una aplicación web móvil para gestionar entregas con sistema de priorización inteligente y almacenamiento en JSON.

## 🏗️ Estructura de Archivos

```
Agendas/
├── index.html              # Página principal
├── script.js              # Lógica de la aplicación
├── styles.css             # Estilos CSS
├── data/                  # Datos JSON
│   ├── appointments.json  # Citas agendadas
│   ├── config.json       # Configuración
│   └── stats.json        # Estadísticas
└── api/
    └── save-appointments.php # Endpoint (opcional)
```

## 📋 Funcionalidades

### ✅ Sistema de Ubicaciones
- **Lunes**: Metro Buenavista
- **Martes-Viernes**: Metro Rosario

### ✅ Sistema de Priorización
- El primer cliente que agenda establece la **hora prioritaria**
- Los siguientes solo pueden agendar **±2 horas** de esa hora
- Máximo **3 citas por día**

### ✅ Gestión JSON
- **Exportar**: Descarga todos los datos en JSON
- **Importar**: Carga datos desde archivo JSON 
- **Estadísticas**: Visualiza métricas de uso
- **Backup automático**: Guarda en localStorage

## 📁 Estructura de Datos JSON

### appointments.json
```json
{
  "2026-02-10": [
    {
      "time": "11:00",
      "name": "Juan Pérez", 
      "phone": "5555-1234",
      "timestamp": "2026-02-08T15:30:00.000Z",
      "location": "Metro Buenavista"
    }
  ]
}
```

### config.json
```json
{
  "locations": {
    "monday": {
      "name": "Metro Buenavista",
      "maxAppointments": 3
    },
    "tuesday-friday": {
      "name": "Metro Rosario",
      "maxAppointments": 3  
    }
  },
  "timeSlots": ["09:00", "10:00", "11:00", ...],
  "prioritySettings": {
    "toleranceHours": 2,
    "enabled": true
  }
}
```

### stats.json
```json
{
  "totalAppointments": 5,
  "appointmentsByLocation": {
    "Metro Buenavista": 2,
    "Metro Rosario": 3
  },
  "popularTimeSlots": {
    "11:00": 2,
    "14:00": 1
  },
  "lastUpdated": "2026-02-08T16:15:00.000Z"
}
```

## 🚀 Instrucciones de Uso

### Usar Solo con Navegador
1. Abrir `index.html` en cualquier navegador moderno
2. Los datos se guardan automáticamente en localStorage
3. Usar el panel admin para exportar/importar JSON

### Usar con Servidor Web
1. **Python**: `python -m http.server 8080`
2. **Node.js**: `npx http-server -p 8080`
3. **PHP**: Incluir el endpoint `api/save-appointments.php`

### Panel de Administración
1. Clic en **⚙️ Admin** para abrir panel
2. **📄 Descargar JSON**: Exporta todos los datos
3. **📂 Importar JSON**: Carga datos desde archivo  
4. **📊 Ver Estadísticas**: Muestra métricas de uso
5. **🗑️ Limpiar Datos**: Elimina toda la información

## 🔧 Personalización

### Modificar Horarios
Editar `timeSlots` en `data/config.json`:
```json
{
  "timeSlots": ["08:00", "09:00", "10:00", ...]
}
```

### Cambiar Tolerancia de Priorización
Modificar `toleranceHours` en `data/config.json`:
```json
{
  "prioritySettings": {
    "toleranceHours": 3,  // ±3 horas de la hora prioritaria
    "enabled": true
  }
}
```

### Añadir Ubicaciones
Extender `locations` en `data/config.json`:
```json
{
  "locations": {
    "monday": {...},
    "tuesday-friday": {...},
    "weekend": {
      "name": "Metro Centro", 
      "maxAppointments": 2
    }
  }
}
```

## 📱 Características Móviles

- **Responsive**: Optimizado para móviles
- **PWA Ready**: Se puede instalar como app
- **Touch Friendly**: Botones grandes y navegación táctil
- **Offline**: Funciona sin conexión usando localStorage

## 🔒 Seguridad y Privacidad

- Datos almacenados localmente en el navegador
- No se envían datos a servidores externos (salvo configuración)
- Backup automático en localStorage como respaldo
- Opción de exportar datos para respaldo manual

## 🛠️ Desarrollo y Debug

### Variables Globales
- `window.scheduler`: Instancia principal de la aplicación
- `window.scheduler.appointments`: Datos de citas
- `window.scheduler.stats`: Estadísticas

### Consola del Navegador
```javascript
// Ver todas las citas
console.log(window.scheduler.appointments);

// Ver estadísticas  
console.log(window.scheduler.stats);

// Forzar actualización
window.scheduler.renderCalendar();
```

---
**Desarrollado para optimizar entregas con sistema de priorización inteligente** 🚀