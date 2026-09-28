# 🏆 Copa Primavera App v2.0

> **Aplicación integral para la gestión y visualización en tiempo real de torneos de Pádel.**

🔗 **[Ver Despliegue en Vivo](https://copa-primavera-v2.vercel.app/)**

---

## 📖 Descripción del Proyecto

**Copa Primavera v2.0** es una plataforma web "Full-Stack" diseñada para digitalizar por completo la experiencia de un torneo de Pádel. Soluciona tanto la cara pública (espectadores y jugadores) como la administración interna del torneo. 

Su mayor atractivo es el sistema **Real-time (Tiempo Real)**: cualquier actualización de un partido o jugador realizada por un administrador desde la cancha, se refleja instantáneamente en el dispositivo de cualquier espectador alrededor del mundo, sin necesidad de recargar la página.

Todo esto está envuelto en una estética premium estilo *Cyber-Neon / Glassmorphism*, con un enfoque estrictamente **Mobile-First** para asegurar la mejor experiencia desde teléfonos móviles.

---

## ⚡ Tecnologías y Stack

El proyecto fue construido utilizando tecnologías de vanguardia para asegurar rendimiento, escalabilidad y una gran experiencia de desarrollo.

*   **Frontend / Framework:** [Next.js 15](https://nextjs.org/) (App Router) + [React 19](https://react.dev/).
*   **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) (Implementando variables CSS nativas, Backdrop-blur, animaciones CSS).
*   **Backend & Base de Datos:** [Supabase](https://supabase.com/) (PostgreSQL).
*   **Autenticación:** Supabase Auth (Email & Password).
*   **Sincronización en Vivo:** Supabase Realtime (WebSockets / PostgreSQL Triggers).
*   **Despliegue (Hosting):** [Vercel](https://vercel.com/).

---

## 🚀 Funcionalidades Principales

### 👁️ Vista Pública (Para Jugadores y Espectadores)
*   **Cuadros y Llaves en Vivo:** Visualización interactiva de los cuadros del torneo (desde 16avos hasta la final). Los ganadores avanzan de llave en la interfaz de forma dinámica.
*   **Directorio de Jugadores:** Catálogo de todos los inscritos organizados por categorías. Incluye un buscador/filtro lateral interactivo (o un *Bottom Tab* en móviles).
*   **Diseño Dinámico:** Tarjetas translúcidas (*glassmorphism*), un fondo estático persistente, botones estilizados y navegación adaptada a gestos en móvil.

### 🛡️ Panel de Administración (Seguro)
*   **Autenticación Protegida:** Acceso exclusivo vía email y contraseña.
*   **Control de Inscripciones y Pagos:** Panel detallado para registrar parejas, asignarles categorías y llevar un control visual (con *toggles*) de quién abonó y quién está pendiente.
*   **Generador Automático de Cuadros:** Algoritmo incorporado que toma una lista de jugadores inscriptos y genera automáticamente un fixture de llaves. Calcula espacios vacíos y asigna **"BYEs"** (Pase directo) cuando el número de parejas no es potencia de 2.
*   **Gestión de Partidos:** Los administradores pueden ingresar resultados de cada set. El sistema detecta ganadores y los **propaga automáticamente** a la siguiente ronda.
*   **Gestión de Canchas (Courts) y Horarios:** Asignación de partidos a canchas específicas en horarios definidos.

---

## 🗄️ Arquitectura de la Base de Datos

La base de datos relacional (PostgreSQL en Supabase) está dividida en 4 tablas principales:

1.  **`categories`**: Almacena las distintas divisiones (ej: 7ma Caballeros, 6ta Damas).
2.  **`courts`**: Almacena las canchas físicas disponibles.
3.  **`players`**: Almacena los jugadores inscriptos, vinculados a una categoría y control de pago.
4.  **`matches`**: La tabla más compleja. Almacena cada encuentro, los puntajes (score) tipo JSON, índices de ronda, lógica de ganadores y si un partido es Walkover (W.O.) o BYE.

> **Nota Realtime:** Todas las tablas están suscritas a la publicación `supabase_realtime` de Postgres, transmitiendo eventos de `INSERT`, `UPDATE` y `DELETE` directamente a los clientes conectados.

---

## 🛠️ Instalación y Desarrollo Local

Si deseas correr este proyecto de forma local en tu máquina:

1. **Clonar el repositorio**
   ```bash
   git clone https://github.com/thxlopez7/copa-primavera-V2.git
   cd copa-primavera-V2
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Variables de Entorno**
   Crea un archivo llamado `.env.local` en la raíz del proyecto y agrega tus credenciales de Supabase:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_supabase_anon_key
   ```

4. **Correr el servidor de desarrollo**
   ```bash
   npm run dev
   ```
   Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

---

## 👨‍💻 Autor

Diseñado y desarrollado con ♥ por **Thiago Lopez**.
*   📸 **Instagram:** [@heythia_](https://www.instagram.com/heythia_/)
*   💼 **LinkedIn:** [Thiago Lopez](https://www.linkedin.com/in/thiago-lopez-284507219)

---
*Copa Primavera App v2.0 - 2026*
