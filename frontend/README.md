# Cat API Frontend

Frontend de la aplicación Cat API desarrollado con Angular 17. Esta aplicación proporciona una interfaz de usuario para la gestión de datos de gatos con autenticación de usuarios.

## Tecnologías

- **Angular 17** - Framework frontend
- **TypeScript** - Lenguaje de programación
- **Bootstrap 5** - Framework CSS
- **RxJS** - Programación reactiva
- **Karma & Jasmine** - Testing
- **Docker** - Containerización

## Instalación

1. Instalar dependencias:
```bash
npm install
```

2. Configurar variables de entorno si es necesario (URL del backend, etc.)

## Scripts Disponibles

- `npm start` - Ejecutar servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run watch` - Compilar en modo desarrollo con watch
- `npm test` - Ejecutar tests unitarios
- `npm run test:coverage` - Ejecutar tests con cobertura
- `npm run lint` - Verificar código con ESLint
- `npm run e2e` - Ejecutar tests end-to-end

## Desarrollo

Para iniciar el servidor de desarrollo:

```bash
npm start
```

La aplicación estará disponible en `http://localhost:4200/`. La aplicación se recargará automáticamente cuando modifiques los archivos fuente.

## Docker

Para ejecutar con Docker:

```bash
# Construir imagen
docker build -t cat-api-frontend .

# Ejecutar contenedor
docker run -p 80:80 cat-api-frontend
```

## Estructura del Proyecto

```
src/
├── app/
│   ├── components/     # Componentes reutilizables
│   ├── pages/          # Páginas de la aplicación
│   ├── services/       # Servicios para API y lógica
│   ├── guards/         # Guards de autenticación
│   ├── interceptors/   # Interceptores HTTP
│   └── models/         # Interfaces y tipos
├── assets/             # Recursos estáticos
└── environments/       # Configuraciones de entorno
```

## Funcionalidades

- **Autenticación**: Login y registro de usuarios
- **Gestión de Gatos**: CRUD completo para datos de gatos
- **Interfaz Responsiva**: Diseño adaptable con Bootstrap
- **Interceptores**: Manejo automático de tokens JWT
- **Guards**: Protección de rutas autenticadas

## Compilación

Para compilar el proyecto:

```bash
npm run build
```

Los archivos compilados se guardarán en el directorio `dist/`. Por defecto, la compilación de producción optimiza la aplicación para mejor rendimiento.

## Testing

Ejecutar tests unitarios:
```bash
npm test
```

Ejecutar tests con cobertura:
```bash
npm run test:coverage
```

## Comandos Angular CLI

Generar un nuevo componente:
```bash
ng generate component component-name
```

Para ver todos los esquemas disponibles:
```bash
ng generate --help
```
