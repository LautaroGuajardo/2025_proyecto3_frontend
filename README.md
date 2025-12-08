# React + TypeScript + Vite

# Gestion de Reclamos — Frontend (React + TypeScript + Vite)

  Este repositorio contiene el frontend de un sistema de gestión de reclamos (Claims Management). La aplicación permite a usuarios y administradores crear, ver y administrar reclamos asociados a proyectos y subáreas, además de ver historiales de acciones. Está implementada con React + TypeScript y empaquetada con Vite.

  Requisitos
  - Node.js 16 o superior
  - npm o yarn
  - Backend accesible (configurable mediante `VITE_API_BASE_URL`) o usar la API mock activando `VITE_USE_MOCK_API=true`.

  Instalación
  1. Clona el repositorio:
     ```bash
     git clone https://github.com/LautaroGuajardo/2025_proyecto3_frontend
     cd 2025_proyecto3_frontend
     ```
  2. Instala dependencias:
     ```bash
     npm install
     # o con yarn
     # yarn install
     ```
  3. Ejecuta en modo desarrollo:
     ```bash
     npm run dev
     ```

  .env (configuración)
  Coloca un archivo `.env` en la raíz del proyecto con las variables de entorno necesarias. Ejemplo mínimo:
  ```
  # URL base de la API (sin barra final)
  VITE_API_BASE_URL=http://localhost:8080

  # Si quieres usar la API mock incluida en el frontend
  VITE_USE_MOCK_API=true
  ```
  - `VITE_API_BASE_URL`: URL del backend al que hace peticiones la app. Cambia el host/puerto según tu entorno.
  - `VITE_USE_MOCK_API`: si `true`, la app usará implementaciones mock de los servicios (útil para desarrollo cuando no hay backend disponible).

  ---

