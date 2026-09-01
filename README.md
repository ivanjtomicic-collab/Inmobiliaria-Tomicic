# Welcome to your Lovable project

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Open your project in the [Lovable editor](https://lovable.dev) and keep building.

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: connect the project to GitHub and every change made in Lovable is committed straight to your repository.
- **Full ownership**: this code is yours. Push to your repository and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built with

- TanStack Start
- TypeScript
- React
- Tailwind CSS
- Supabase

## Administración con Supabase

1. Creá un proyecto en Supabase.
2. Abrí **SQL Editor** y ejecutá [`supabase/schema.sql`](supabase/schema.sql).
3. En **Authentication > Users**, creá el usuario propietario.
4. Ejecutá la última consulta comentada del esquema reemplazando el email para autorizarlo.
5. Copiá `.env.example` como `.env.local` y completá la URL y la clave pública `anon` del proyecto.
6. En GitHub, agregá esas mismas variables en **Settings > Secrets and variables > Actions > Variables** con los nombres `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY`.

El panel privado estará disponible en `/admin`. La clave `service_role` no debe utilizarse ni publicarse en este proyecto.
