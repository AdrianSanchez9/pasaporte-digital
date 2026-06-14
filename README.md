# Pasaporte Médico Digital 

Sistema centralizado para gestionar perfiles de pacientes de la organizacion. Permite al personal de salud acceder rapidamento a todo el pasaporte de internación del paciente (alergias, medicación, historial, comunicación) mediante el escaneo de un código QR único por paciente.

## Tecnologías utilizadas
- **Backend:** Node.js + Express
- **Base de Datos:** MySQL + Prisma (ORM)
- **Validaciones:** Zod
- **Almacenamiento:** Cloudinary (Imágenes y documentos)

## Correr el proyecto localmente

1. Clonar el repositorio y entrar a la carpeta.

2. Instalar las dependencias:
```bash
   npm instal
```

3. Sincronizar la base de datos:
```bash
   npx prisma db push
```

3. Levantar los estilos de Tailwind CSS (en una otra terminal):
```bash
   npm run tailwind
```
4. Levantar el servidor:
```bash
   npm run dev
```

