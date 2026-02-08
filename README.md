# Agendas - Delivery Scheduling Application

Esta es una aplicación web para programar entregas en diferentes ubicaciones de Metro.

## 🌐 Acceder a la Aplicación

La aplicación está desplegada en GitHub Pages y puede accederse en:

**https://codemwork.github.io/Agendas/**

## 📋 Características

- Programación de entregas para Metro Buenavista (Lunes)
- Programación de entregas para Metro Rosario (Martes - Viernes)
- Horarios prioritarios definidos
- Interfaz móvil responsive

## 🚀 Despliegue Automático

Este repositorio utiliza GitHub Actions para desplegar automáticamente a GitHub Pages cuando se realizan cambios en la rama `main`.

### Cómo Activar GitHub Pages

1. Ve a **Settings** → **Pages** en el repositorio de GitHub
2. En **Source**, selecciona **GitHub Actions**
3. El workflow se ejecutará automáticamente con cada push a `main`

## 💻 Desarrollo Local

Para ejecutar localmente:

1. Clona el repositorio:
   ```bash
   git clone https://github.com/codemwork/Agendas.git
   cd Agendas
   ```

2. Abre `index.html` en tu navegador o usa un servidor local:
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (http-server)
   npx http-server
   ```

3. Navega a `http://localhost:8000` en tu navegador

## 📁 Estructura del Proyecto

- `index.html` - Página principal
- `script.js` - Lógica de programación de entregas
- `style.css` - Estilos del calendario
- `styles.css` - Estilos adicionales
- `.github/workflows/deploy.yml` - Workflow de GitHub Actions para despliegue

## 🔧 Tecnologías

- HTML5
- CSS3
- JavaScript (Vanilla)
- GitHub Pages
- GitHub Actions
