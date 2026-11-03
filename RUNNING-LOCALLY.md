# Run AarogyaNote locally

These steps start the FastAPI backend and Next.js frontend in two separate PowerShell terminals.

## 1. Configure the backend

From the repository root, create the backend environment file:

```powershell
Copy-Item backend/.env.example backend/.env
```

Open `backend/.env` and set:

- `GNANI_API_KEY` to your Gnani API key.
- `GROQ_API_KEY` to your Groq API key. The extraction model defaults to `openai/gpt-oss-120b`.
- `PRISMA_LANGUAGE_CODE` to the language used in the recording, such as `hi-IN` or `en-IN`.

Prisma and Timbre endpoint URLs already have documented defaults in the example file. Adjust them if your Gnani account uses different URLs.

## 2. Start the backend

Open a PowerShell terminal in the repository root and run:

```powershell
cd backend
py -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Keep this terminal running. The API is at `http://localhost:8000`; its interactive docs are at `http://localhost:8000/docs`.

If PowerShell blocks activating the virtual environment, run the backend commands in Command Prompt instead:

```bat
cd backend
py -m venv .venv
.venv\Scripts\activate.bat
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## 3. Configure and start the frontend

Open a second terminal in the repository root. Install the JavaScript dependencies, create the frontend environment file, and start Next.js:

```powershell
npm install
Copy-Item .env.local.example .env.local
npm run dev
```

Keep this terminal running too. Open **http://localhost:3000** in your browser.

`NEXT_PUBLIC_API_URL` in `.env.local` defaults to `http://localhost:8000`. Change it if your backend runs at another address, then restart the frontend server.

## 4. Stop the servers

In each terminal, press `Ctrl+C`.
