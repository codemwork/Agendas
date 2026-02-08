# 📘 Guía de Configuración de GitHub Pages

## ❗ Problema: "There isn't a GitHub Pages site here"

Si ves este mensaje al intentar acceder a `https://codemwork.github.io/Agendas/`, significa que **GitHub Pages no está activado** en la configuración del repositorio.

## ✅ Solución: Activar GitHub Pages (Pasos Detallados)

### Paso 1: Acceder a la Configuración del Repositorio

1. Ve al repositorio en GitHub: https://github.com/codemwork/Agendas
2. Haz clic en la pestaña **⚙️ Settings** (Configuración) en la parte superior
3. En el menú lateral izquierdo, busca y haz clic en **📄 Pages**

### Paso 2: Configurar la Fuente de Despliegue

En la sección **Build and deployment**:

1. **Source (Fuente)**: Selecciona **GitHub Actions** del menú desplegable
   - ⚠️ NO selecciones "Deploy from a branch"
   - ✅ DEBE ser "GitHub Actions"

2. Haz clic en **Save** (Guardar) si aparece el botón

### Paso 3: Ejecutar el Workflow

Hay dos opciones para iniciar el despliegue:

#### Opción A: Manualmente (Recomendado para primera vez)
1. Ve a la pestaña **Actions** en el repositorio
2. En el panel izquierdo, selecciona **Deploy to GitHub Pages**
3. Haz clic en el botón **Run workflow** (ejecutar workflow)
4. Selecciona la rama `main` (o la rama actual si estás en desarrollo)
5. Haz clic en **Run workflow** verde

#### Opción B: Automáticamente
- El workflow se ejecuta automáticamente al hacer push a la rama `main`
- Durante desarrollo, también puede activarse en otras ramas si están configuradas en el workflow

### Paso 4: Verificar el Despliegue

1. Ve a la pestaña **Actions** en el repositorio
2. Verás el workflow "Deploy to GitHub Pages" ejecutándose
3. Espera a que muestre un ✅ check verde (tarda aproximadamente 1-2 minutos)
4. Una vez completado, visita: **https://codemwork.github.io/Agendas/**

## 🔍 Solución de Problemas

### El workflow dice "action_required"

**Causa**: GitHub Pages no está configurado para usar GitHub Actions

**Solución**: 
- Sigue el Paso 2 anterior
- Asegúrate de seleccionar "GitHub Actions" como fuente, NO "Deploy from a branch"

### El workflow falla con error de permisos

**Causa**: El workflow no tiene permisos para desplegar a Pages

**Solución**:
1. Ve a **Settings** → **Actions** → **General**
2. En **Workflow permissions**, selecciona **Read and write permissions**
3. Marca la casilla **Allow GitHub Actions to create and approve pull requests**
4. Guarda los cambios
5. Vuelve a ejecutar el workflow

### El sitio muestra 404

**Causa**: El despliegue aún no se ha completado o GitHub Pages no está activado

**Solución**:
1. Verifica que el workflow se haya completado exitosamente (✅ en Actions)
2. Espera 2-3 minutos adicionales para la propagación de DNS
3. Limpia la caché del navegador (Ctrl+F5 o Cmd+Shift+R)
4. Intenta acceder nuevamente

### El sitio muestra contenido antiguo

**Causa**: Caché del navegador o CDN de GitHub

**Solución**:
1. Limpia la caché del navegador (Ctrl+F5 o Cmd+Shift+R)
2. Prueba en modo incógnito/privado
3. Espera unos minutos para que la CDN se actualice

## 📊 Verificar Estado Actual

### Verificar que GitHub Pages está activado:
1. Ve a **Settings** → **Pages**
2. Deberías ver: "Your site is live at https://codemwork.github.io/Agendas/"
3. Si no lo ves, repite el Paso 2

### Verificar que el workflow existe:
1. Ve a la pestaña **Actions**
2. Deberías ver "Deploy to GitHub Pages" en la lista de workflows
3. Si no aparece, asegúrate de que el archivo `.github/workflows/deploy.yml` existe en la rama

### Verificar el último despliegue:
1. Ve a **Actions**
2. Mira el workflow más reciente de "Deploy to GitHub Pages"
3. Debe mostrar ✅ (éxito) no ❌ (error)

## 🎯 Checklist de Verificación

Antes de contactar soporte, verifica:

- [ ] GitHub Pages está activado en Settings → Pages
- [ ] Source está configurado como "GitHub Actions"
- [ ] El archivo `.github/workflows/deploy.yml` existe
- [ ] El workflow se ejecutó exitosamente (✅ en Actions)
- [ ] Han pasado al menos 2-3 minutos desde el despliegue
- [ ] Probaste limpiar caché del navegador

## 📞 Ayuda Adicional

Si después de seguir todos estos pasos aún no funciona:
1. Verifica el mensaje de error específico en el log del workflow
2. Revisa la documentación oficial: https://docs.github.com/pages
3. Verifica el estado de GitHub: https://www.githubstatus.com/

## 🎉 ¡Listo!

Una vez completados estos pasos, tu sitio estará accesible en:
**https://codemwork.github.io/Agendas/**

El sitio se actualizará automáticamente cada vez que hagas push a las ramas configuradas.
