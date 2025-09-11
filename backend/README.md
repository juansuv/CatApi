# Cat API Backend

Backend API para la prueba técnica de Cat API. Este proyecto proporciona servicios de autenticación y gestión de datos para gatos utilizando Node.js, Express y MongoDB.

## Tecnologías

- **Node.js** con **TypeScript**
- **Express.js** - Framework web
- **MongoDB** con **Mongoose** - Base de datos
- **JWT** - Autenticación
- **bcryptjs** - Hash de contraseñas
- **Jest** - Testing
- **Docker** - Containerización

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno creando un archivo `.env`:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/catapi
JWT_SECRET=your_jwt_secret_key
```

## Scripts Disponibles

- `npm run dev` - Ejecutar en modo desarrollo con hot reload
- `npm run build` - Compilar TypeScript a JavaScript
- `npm start` - Ejecutar aplicación compilada
- `npm test` - Ejecutar tests
- `npm run test:watch` - Ejecutar tests en modo watch
- `npm run test:coverage` - Ejecutar tests con cobertura
- `npm run lint` - Verificar código con ESLint
- `npm run lint:fix` - Corregir automáticamente errores de linting

## Docker

Para ejecutar con Docker:

```bash
# Construir imagen
docker build -t cat-api-backend .

# Ejecutar contenedor
docker run -p 3000:3000 cat-api-backend
```

## Estructura del Proyecto

```
src/
├── controllers/     # Controladores de rutas
├── middleware/      # Middleware personalizado
├── models/         # Modelos de MongoDB
├── routes/         # Definición de rutas
├── services/       # Lógica de negocio
└── app.ts          # Configuración principal
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registro de usuario
- `POST /api/auth/login` - Inicio de sesión

### Gatos
- `GET /api/cats` - Listar gatos (requiere autenticación)
- `POST /api/cats` - Crear gato (requiere autenticación)
- `PUT /api/cats/:id` - Actualizar gato (requiere autenticación)
- `DELETE /api/cats/:id` - Eliminar gato (requiere autenticación)

## Testing

Ejecutar todos los tests:
```bash
npm test
```

Ejecutar tests con cobertura:
```bash
npm run test:coverage
```