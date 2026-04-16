# Sepcam Node API v2

This repository contains the backend architecture for the Sepcam Web platform. It has been entirely rewritten in TypeScript, following Test-Driven Development (TDD) principles, replacing the legacy Azure Table Storage implementation with Prisma ORM and a robust MariaDB instance, while dynamically retaining Azure Blob functionality for PDF and media hosting.

## 🚀 Tech Stack
- **Runtime**: Node.js (v22+)
- **Framework**: Express.js (v5+)
- **Database & ORM**: MariaDB / Prisma ORM v7
- **Authentication**: JWT & bcrypt
- **Testing**: Jest, Supertest

## 📦 Prerequisites
- **Node.js**: `v22` or higher natively installed.
- **MariaDB/MySQL**: An active database instance available.
- **Azure Blob Storage**: Storage Account with explicitly established containers (`audios`, `pdfs`, `images`).

## 🛠️ Environment Configuration
Create a `.env` file in the root of the project using `.env.example` as a template:

```env
PORT=3000
JWT_SECRET=your_super_secret_jwt_key_for_auth

# Database URL
DATABASE_URL="mysql://root:password@localhost:3306/sepcam_db"

# Azure Blob Storage Configuration
AZURE_STORAGE_CONNECTION_STRING="DefaultEndpointsProtocol=... EndpointSuffix=core.windows.net"
AZURE_AUDIO_CONTAINER="audios"
AZURE_PDF_CONTAINER="pdfs"
AZURE_IMAGE_CONTAINER="images"
```

## 🏗️ Prisma & Database Initialization
Because this project utilizes Prisma v7, explicit driver adapters (`@prisma/adapter-mariadb`, `mariadb`) are natively baked into `src/lib/prisma.ts`. 

To apply your schema and push migrations internally to your locally hooked MariaDB, run:
```bash
npx prisma db push
```

*Note: The Prisma bindings regenerate securely automatically on every `npm install`, gracefully handled via the `postinstall` script block in `package.json`.*

## 🧪 Testing
The architecture has been designed rigorously using TDD. All external APIs and Database adapters are safely mocked natively in the global singleton scopes (`src/lib/prisma.ts`) so executing tests never requires active manual database mounts.

Execute the unit and integration testing suite:
```bash
npm run test
```

## 🚦 Running Locally
To launch natively into your development environment safely equipped with hot-reload (Nodemon) natively via TS:
```bash
npm run dev
```

## 📖 API Documentation (Swagger)

This project uses `swagger-autogen` and `swagger-ui-express` to automatically generate and host interactive API documentation directly from the Express endpoints.

To generate or update the Swagger definition file (`src/swagger-output.json`), run:
```bash
npm run swagger
```

When the application is running successfully (e.g., via `npm run dev`), you can view and test the interactive API documentation at:
👉 **[http://localhost:5000/api-docs](http://localhost:5000/api-docs)** *(Ensure the port matches your `.env` configuration).*

## 🌐 API Overview

| Method | Endpoint | Description | Protected |
|--------|----------|-------------|-----------|
| `GET`  | `/`               | Health Check Validation            | No  |
| `GET`  | `/recentMsg`      | Fetches the most recent message    | No  |
| `GET`  | `/search?keyword=`| Lookups matching `title` or `theme`| No  |
| `GET`  | `/resources`      | Paginated API loading message logs | No  |
| `GET`  | `/readMsg/:id`    | Full read of a single message      | No  |
| `GET`  | `/churchEvents`   | List upcoming and past events      | No  |
| `POST` | `/user/login`     | Receive natively signed Auth token | No  |
| `POST` | `/admin/upload`   | Upload Message payload/Azure Blobs | Yes |
| `PUT`  | `/admin/edit/:id` | Update standard Message string data| Yes |
| `DELETE`| `/admin/delete/:id`| Remove Message UUID rows         | Yes |

*Note: Admin routes are guarded gracefully by the `/middlewares/auth.ts` enforcing strict JWT verification.*

## 🚢 Deployment (Hostinger)
For deploying effectively into Hostinger's standard cPanel Node.js architecture:
1. Transfer the workspace repository to your `public_html` (or designated App Directory) domain path mappings.
2. Initialize and configure `.env` internally hooking Hostinger DB parameters explicitly.
3. Install production dependencies safely: `npm install --omit=dev`.
4. Compile TypeScript explicitly to `JS` mapping or simply spin up the script via Standard NPM execution.
