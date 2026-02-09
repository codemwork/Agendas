# 🎨 Agenda de Entregas - Sistema de Artesanías

Una aplicación web móvil para gestionar entregas de artesanías con sistema de priorización inteligente, seguimiento de artículos y notificaciones automáticas.

## 🌟 Características Principales

### ✅ Sistema de Entregas Inteligente
- **Lunes-Jueves**: Metro Rosario  
- **Viernes**: Metro Lindavista
- **Horarios**: 9:00 AM - 7:00 PM

### ✅ Seguimiento de Artículos
- **Campo obligatorio**: Especifica qué artículo vas a apartar
- **Visualización**: Muestra el artículo en el calendario y confirmaciones
- **Trazabilidad completa**: Desde reserva hasta entrega

### ✅ Sistema de Priorización
- El primer cliente del día establece la **hora prioritaria**
- Los siguientes pueden agendar **±2 horas** de esa hora
- Máximo **3 citas por día**

### ✅ Validación de Producción
- **2 días mínimo**: No se puede agendar para entrega inmediata
- **Tiempo de elaboración**: Garantiza calidad en las piezas
- **Validación automática**: Bloquea días inválidos visualmente

### ✅ Confirmación de Pago
- **50% adelanto requerido**: Validación antes de confirmar cita
- **Modal informativo**: Explica condiciones claras

### ✅ Códigos de Cancelación
- **Códigos únicos de 6 dígitos**: Generados automáticamente
- **Cancelación self-service**: Cliente puede cancelar sin contacto
- **Sistema seguro**: Valida código antes de cancelar

### ✅ Notificaciones Discord
- **Webhook automático**: Envío instantáneo al confirmar citas
- **Información completa**: Cliente, artículo, fecha, hora, ubicación, código
- **Formato elegante**: Embeds con colores y emojis para fácil lectura

## 📁 Estructura de Datos JSON

### appointments.json
```json
{
  "2026-02-10": [
    {
      "time": "11:00",
      "name": "Juan Pérez", 
      "phone": "5555-1234",
      "item": "Collar personalizado con nombre",
      "location": "Metro Rosario",
      "timestamp": "2026-02-08T15:30:00.000Z",
      "cancelCode": "AB3K7M"
    }
  ]
}
```

### config.json
```json
{
  "locations": {
    "monday-thursday": {
      "name": "Metro Rosario",
      "maxAppointments": 3
    },
    "friday": {
      "name": "Metro Lindavista",
      "maxAppointments": 3  
    }
  },
  "timeSlots": ["09:00", "10:00", "11:00", ...],
  "prioritySettings": {
    "toleranceHours": 2,
    "enabled": true
  },
  "productionTime": {
    "minimumDays": 2,
    "enabled": true
  },
  "discord": {
    "webhookEnabled": true,
    "webhookUrl": "https://discordapp.com/api/webhooks/..."
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

## 🌐 GitHub Pages

### 🚀 Aplicación en Vivo
**URL**: `https://codemwork.github.io/Agendas/`

### ⚙️ Configuración GitHub Pages
1. Ve a **Settings** en tu repositorio GitHub
2. Scroll down hasta **Pages** en el menú lateral  
3. En **Source** selecciona **Deploy from a branch**
4. Selecciona branch **main** y folder **/ (root)**
5. Haz clic en **Save**
6. La aplicación estará disponible en unos minutos

### 📱 Uso en Móvil
- Abre la URL en cualquier navegador móvil
- Para instalar como app: **Agregar a pantalla de inicio**
- Funciona completamente offline después de la primera carga

---
**Desarrollado para optimizar entregas de artesanías con sistema de priorización inteligente** 🎨✨