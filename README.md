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

### ⚠️ Pasos Requeridos para Activar GitHub Pages

**IMPORTANTE:** GitHub Pages debe estar habilitado en la configuración del repositorio antes de que el sitio funcione. Sigue estos pasos:

1. Ve a **Settings** (Configuración) → **Pages** en el repositorio de GitHub
2. En **Build and deployment** → **Source**, selecciona **GitHub Actions**
3. Guarda los cambios
4. El workflow se ejecutará automáticamente con cada push a `main` o `copilot/add-github-pages-support`
5. Una vez completado el despliegue, el sitio estará disponible en: **https://codemwork.github.io/Agendas/**

### 🔍 Estado del Despliegue

Si ves el mensaje "There isn't a GitHub Pages site here", significa que necesitas:
- ✅ Activar GitHub Pages en Settings → Pages → Source: GitHub Actions
- ✅ Esperar a que el workflow complete su ejecución (verifica en la pestaña Actions)
- ✅ Asegurarte de que la rama main contenga el archivo `.github/workflows/deploy.yml`

### 🔄 Cómo Funciona

El archivo `.github/workflows/deploy.yml` automáticamente:
1. Se activa cuando hay un push a `main` o `copilot/add-github-pages-support`
2. Configura GitHub Pages
3. Sube todos los archivos del repositorio como artefacto
4. Despliega el artefacto a GitHub Pages

Puedes ejecutar manualmente el workflow desde la pestaña "Actions" usando el botón "Run workflow".

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
