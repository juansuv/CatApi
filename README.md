# Cat API - Full Stack Technical Test

Una aplicación full-stack completa desarrollada con **Node.js**, **Express**, **MongoDB**, **Angular** y **TypeScript**, siguiendo los principios de **Clean Architecture** y **SOLID**.

## 🚀 Características

### Backend (Node.js + Express + MongoDB)
- **Clean Architecture** con separación clara de responsabilidades
- **Controladores RESTful** para gatos, imágenes y usuarios
- **Servicios** con interfaces para mejor testing y mantenibilidad
- **Autenticación JWT** con middleware de seguridad
- **Validación de datos** con express-validator
- **Pruebas unitarias** con Jest
- **Integración con The Cat API** externa
- **Base de datos MongoDB** con Mongoose

### Frontend (Angular + TypeScript)
- **Arquitectura modular** con componentes standalone
- **5 vistas completamente funcionales**
- **Guards de autenticación** para rutas protegidas
- **Servicios reactivos** con RxJS
- **Formularios reactivos** con validación
- **Diseño responsive** con Bootstrap 5
- **Interceptores HTTP** para manejo de tokens
- **Pruebas unitarias** con Jasmine/Karma

### DevOps
- **Dockerfiles** para backend y frontend
- **Docker Compose** para orquestación completa
- **Health checks** para monitoreo
- **Nginx** como proxy reverso en producción

## 📋 Requisitos Técnicos Cumplidos

### ✅ Tecnologías Obligatorias
- [x] Node.js
- [x] Express
- [x] MongoDB
- [x] Angular
- [x] TypeScript en todo el proyecto

### ✅ Buenas Prácticas
- [x] Principios SOLID aplicados
- [x] Clean Architecture implementada
- [x] Pruebas unitarias (backend y frontend)
- [x] Separación de responsabilidades
- [x] Manejo de errores consistente

### ✅ Backend - Controladores
- [x] **Controlador Gatos**: Conectado a The Cat API
  - `GET /api/cats/breeds` - Lista de razas
  - `GET /api/cats/breeds/:breed_id` - Raza específica
  - `GET /api/cats/breeds/search` - Búsqueda con parámetros
- [x] **Controlador Imágenes**: 
  - `GET /api/images/imagesbybreedid` - Imágenes por raza
- [x] **Controlador Usuarios**:
  - `POST /api/users/login` - Verificación de credenciales
  - `POST /api/users/register` - Registro de usuarios
  - `GET /api/users/profile` - Información del usuario autenticado

### ✅ Frontend - Vistas
- [x] **Vista 1**: Lista desplegable de razas + carrusel de imágenes + tabla completa
- [x] **Vista 2**: Campo de búsqueda + filtros + tabla interactiva
- [x] **Vista 3**: Formulario de login con validación
- [x] **Vista 4**: Formulario de registro completo
- [x] **Vista 5**: Vista protegida con información del usuario

### ✅ Características Adicionales
- [x] Dockerfiles para contenarización
- [x] Sistema de autenticación completo
- [x] Interfaz responsive y moderna
- [x] Manejo de estados de carga y errores
- [x] Validación de formularios en tiempo real
- [x] Guards de autenticación
- [x] Interceptores HTTP

## 🛠 Instalación y Ejecución

### Opción 1: Con Docker (Recomendado)

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd xpert_full_stack
   ```

2. **Ejecutar con Docker Compose**
   ```bash
   docker-compose up -d
   ```

3. **Acceder a las aplicaciones**
   - Frontend: http://localhost:4200
   - Backend: http://localhost:3000
   - MongoDB: localhost:27017

### Opción 2: Desarrollo Local

#### Backend
```bash
cd backend
npm install
npm run dev
```

#### Frontend
```bash
cd frontend
npm install
npm start
```

#### MongoDB
Instalar MongoDB localmente o usar MongoDB Atlas

## 🧪 Ejecutar Pruebas

### Backend
```bash
cd backend
npm test
npm run test:coverage
```

### Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

## 🔧 Variables de Entorno

### Backend (.env)
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/catapi
JWT_SECRET=super-secret-jwt-key
CAT_API_KEY=live_JBT0Ah0Nt12iyl2IpjQVLDWjcLk0GQwf4zI9wBMfmfejKmcC31mOJp4yJz5TsOUP
CAT_API_BASE_URL=https://api.thecatapi.com/v1
FRONTEND_URL=http://localhost:4200
```

## 📱 Uso de la Aplicación

### 1. Registro/Login
- Crear una cuenta nueva en `/register`
- Iniciar sesión en `/login`
- Credenciales de demo: `demo / demo123`

### 2. Explorar Razas de Gatos
- Ver todas las razas en `/breeds`
- Seleccionar una raza para ver detalles e imágenes
- Usar la tabla para comparar características

### 3. Buscar Razas
- Usar la búsqueda en tiempo real en `/search`
- Aplicar filtros por origen, nivel de energía, etc.
- Ordenar resultados por diferentes criterios

### 4. Perfil de Usuario
- Acceder al perfil personal en `/profile` (requiere autenticación)
- Ver información de la cuenta
- Exportar datos personales

## 🏗 Arquitectura

### Backend - Clean Architecture
```
src/
├── controllers/     # Controladores REST
├── services/       # Lógica de negocio
├── models/         # Modelos de datos
├── middlewares/    # Middlewares personalizados
├── routes/         # Definición de rutas
├── config/         # Configuraciones
├── types/          # Tipos TypeScript
└── __tests__/      # Pruebas unitarias
```

### Frontend - Arquitectura Modular
```
src/app/
├── components/     # Componentes reutilizables
├── views/         # Páginas principales
├── services/      # Servicios de API
├── guards/        # Guards de navegación
├── models/        # Interfaces y tipos
└── interceptors/  # Interceptores HTTP
```

## 🔒 Seguridad

- **JWT Authentication** para protección de rutas
- **Bcrypt** para hash de contraseñas
- **CORS** configurado correctamente
- **Validación** de datos en cliente y servidor
- **Headers de seguridad** en Nginx
- **Principio de menor privilegio** en Docker

## 📊 Monitoreo

- **Health checks** en Docker
- **Logging** estructurado
- **Error handling** consistente
- **Timeouts** configurados
- **Reintentos automáticos**

## 🎯 Principios Aplicados

### SOLID
- **S**ingle Responsibility: Cada clase tiene una responsabilidad única
- **O**pen/Closed: Extensible sin modificar código existente
- **L**iskov Substitution: Interfaces intercambiables
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependencias por abstracción

### Clean Architecture
- **Separación de capas** clara
- **Independencia de frameworks**
- **Testabilidad** alta
- **Independencia de UI**
- **Independencia de base de datos**

## 📈 Futuras Mejoras

- [ ] Implementar paginación en el frontend
- [ ] Agregar sistema de favoritos
- [ ] Implementar notificaciones push
- [ ] Agregar más filtros de búsqueda
- [ ] Implementar caché Redis
- [ ] Agregar métricas y monitoring
- [ ] Implementar CI/CD pipeline

## 👥 Desarrollado por

**Juan Diego Suarez Vargas** 

---

## 📄 Licencia

Este proyecto fue desarrollado como prueba técnica y está disponible bajo licencia MIT.