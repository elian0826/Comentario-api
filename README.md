# Sistema de Comentarios para Videos - API REST

Este proyecto es una API REST desarrollada con NestJS que permite a los usuarios realizar comentarios en videos. La API proporciona endpoints para gestionar usuarios, videos y comentarios.

## Requisitos Previos

- Node.js (v18.0.0 o superior)
- MySQL (v8.0 o superior)
- npm (v9.0.0 o superior)

## Tecnologías Utilizadas

- NestJS v10.0.0
- TypeORM v0.3.17
- MySQL2

## Instalación

1. Clonar el repositorio:
```bash
git clone <https://github.com/elian0826/Comentario-api.git>
cd comments-api
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
   - Crear archivo `.env` en la raíz del proyecto
   - Copiar el contenido de `.env.example`
   - Actualizar las variables con tus valores

```env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=tu_usuario
DB_PASSWORD=tu_contraseña
DB_DATABASE=nombre_base_datos
```

4. Crear la base de datos:
```sql
CREATE DATABASE xyz_app;
```

5. Ejecutar las migraciones:
```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE videos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    url VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    video_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (video_id) REFERENCES videos(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

6. Iniciar el servidor:
```bash
npm run start:dev
```

El servidor estará disponible en `http://localhost:3000`

## Documentación de la API

La documentación completa de la API está disponible en Apidog:
[Documentación en Apidog](https://apidog.com/xyz-app)

### Endpoints Principales

#### Usuarios
- POST `/users` - Crear un nuevo usuario
```json
 {
       "username": "ElianAltamiranda",
       "email": "ElianAltamiranda2017@gamial.com",
       "password": "*Elian1234*"
   }
```

#### Videos
- POST `/videos` - Crear un nuevo video
```json
{
    "title": "Video Elian Altamrianda",
    "url": "https://video.practuca.com/Video_Elian_Altamrianda.mp4",
    "user_id": 13 
}
```

#### Comentarios
- POST `/comments` - Crear un nuevo comentario
```json
{
    "content": "¡Excelente tutorial, muy bien explicado!",
    "video_id": 34,
    "user_id": 13
}
```
- GET `/comments/video/{videoId}` - Obtener comentarios de un video

## Autor

Elian Altamiranda
- GitHub: https://github.com/elian0826

