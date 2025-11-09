# Sistema de Gestión de Autores y Libros

Una aplicación web moderna para gestionar autores y sus libros. Permite crear, editar, buscar y eliminar información de autores y libros de manera sencilla.

## Características

- **Gestión de Autores**: Crea, edita y elimina autores con información completa (nombre, email, biografía, nacionalidad, año de nacimiento)
- **Gestión de Libros**: Administra libros con detalles como título, descripción, ISBN, género, año de publicación y número de páginas
- **Búsqueda Avanzada**: Busca libros por título, género, autor, y ordena los resultados
- **Estadísticas**: Visualiza estadísticas generales sobre autores y libros
- **Interfaz Moderna**: Diseño limpio y fácil de usar con Tailwind CSS

## Cómo Empezar

### Requisitos Previos

- Node.js instalado en tu computadora
- Una base de datos PostgreSQL (puedes usar una local o en la nube)

### Instalación

1. **Clona el repositorio** (o descarga el proyecto)

```bash
git clone https://github.com/AlesGamerADP/Lab12.git
cd next-api-routes
```

2. **Instala las dependencias**

```bash
npm install
```

3. **Configura la base de datos**

Crea un archivo `.env` en la raíz del proyecto con la siguiente información:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos"
```

4. **Crea las tablas en la base de datos**

```bash
npx prisma migrate dev
```

5. **Inicia el servidor de desarrollo**

```bash
npm run dev
```

6. **Abre tu navegador**

Ve a [http://localhost:3000](http://localhost:3000) para ver la aplicación.

## Cómo Usar

### Dashboard Principal

En la página principal encontrarás:
- Un resumen con estadísticas (total de autores, libros, etc.)
- Una lista de todos los autores registrados
- Botones para crear, editar o eliminar autores
- Opción para ver los libros de cada autor

### Página de Libros

En la página de libros puedes:
- Ver todos los libros registrados
- Buscar libros por título
- Filtrar por género o autor
- Ordenar los resultados
- Crear, editar o eliminar libros

### Crear un Autor

1. Haz clic en el botón "Crear Nuevo Autor"
2. Completa el formulario (nombre y email son obligatorios)
3. Haz clic en "Crear"

### Crear un Libro

1. Ve a la página de Libros
2. Haz clic en "Crear Nuevo Libro"
3. Completa el formulario (título y autor son obligatorios)
4. Haz clic en "Crear"

## Tecnologías Utilizadas

- **Next.js**: Framework de React para crear la aplicación
- **React**: Biblioteca para construir la interfaz
- **TypeScript**: Para escribir código más seguro
- **Prisma**: Para trabajar con la base de datos
- **PostgreSQL**: Base de datos
- **Tailwind CSS**: Para el diseño y estilos

## Notas

- Asegúrate de tener PostgreSQL instalado y corriendo antes de iniciar la aplicación
- El archivo `.env` no debe subirse a GitHub (ya está en `.gitignore`)
- Si cambias el esquema de la base de datos, ejecuta `npx prisma migrate dev` nuevamente

## Licencia

Este proyecto es de uso educativo.

