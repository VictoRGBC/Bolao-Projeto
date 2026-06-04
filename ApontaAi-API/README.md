# Integra Bolão - API

RESTful API built to power the **Integra Bolão** platform, a World Cup prediction game (Bolão). Developed with Django and Django Rest Framework (DRF), this API provides secure endpoints for user authentication, match management, batch data imports, and automated prediction scoring.

## 🚀 Technologies

* Python 3
* Django
* Django Rest Framework (DRF)
* SimpleJWT (JSON Web Token Authentication)
* SQLite (Default Database)

---

## ⚙️ Core Features

### JWT Authentication

Secure login and session management using access and refresh tokens.

### Match Management

Full CRUD capabilities for administrators to manage tournament matches.

### Batch Import Module

Support for bulk insertion and update of matches through JSON payloads.

### Automated Scoring

Django Signals automatically calculate and distribute points to users whenever a match is finalized.

### Ranking System

Real-time leaderboard generation based on user scores.

---

## 🛠️ Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository_url>
cd ApontaAi-API
```

### 2. Create and Activate a Virtual Environment

Linux / macOS:

```bash
python -m venv venv
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

### 4. Apply Database Migrations

```bash
python manage.py makemigrations
python manage.py migrate
```

### 5. Start the Development Server

```bash
python manage.py runserver
```

The API will be available at:

```text
http://127.0.0.1:8000/api/
```

---

## 🔐 Authentication

The API uses JWT authentication via SimpleJWT.

### Obtain Access and Refresh Tokens

**POST**

```http
/api/token/
```

Request:

```json
{
  "username": "user",
  "password": "password"
}
```

Response:

```json
{
  "refresh": "<refresh_token>",
  "access": "<access_token>"
}
```

### Refresh Access Token

**POST**

```http
/api/token/refresh/
```

Request:

```json
{
  "refresh": "<refresh_token>"
}
```

Response:

```json
{
  "access": "<new_access_token>"
}
```

---

## 📡 API Endpoints

### Users

Base URL:

```http
/api/usuarios/
```

| Method | Endpoint         | Description               |
| ------ | ---------------- | ------------------------- |
| GET    | `/api/usuarios/` | List all users and scores |
| POST   | `/api/usuarios/` | Register a new user       |

---

### Matches

Base URL:

```http
/api/jogos/
```

| Method | Endpoint           | Description                 |
| ------ | ------------------ | --------------------------- |
| GET    | `/api/jogos/`      | List all matches            |
| POST   | `/api/jogos/`      | Create a match (Admin only) |
| PATCH  | `/api/jogos/{id}/` | Update a match (Admin only) |
| DELETE | `/api/jogos/{id}/` | Delete a match (Admin only) |

---

### Predictions

Base URL:

```http
/api/palpites/
```

| Method | Endpoint              | Description                            |
| ------ | --------------------- | -------------------------------------- |
| GET    | `/api/palpites/`      | List authenticated user's predictions  |
| POST   | `/api/palpites/`      | Create a prediction                    |
| PATCH  | `/api/palpites/{id}/` | Update a prediction before match start |

---

## 📦 Batch Import Payload

Administrators can submit multiple matches through a batch import endpoint.

Example payload:

```json
[
  {
    "time_a": "Brasil",
    "time_b": "Marrocos",
    "data_hora": "2026-06-13T13:00:00",
    "status": "agendado"
  },
  {
    "time_a": "Holanda",
    "time_b": "Japao",
    "status": "finalizado",
    "resultado": "vitoria_a"
  }
]
```

### Valid Status Values

```text
agendado
em_andamento
finalizado
```

### Valid Result Values

```text
vitoria_a
vitoria_b
empate
null
```

---

## 🏆 Scoring Rules

When a match status changes to:

```text
finalizado
```

A Django Signal is triggered to:

1. Process all related predictions.
2. Calculate earned points.
3. Update each user's score.
4. Refresh the ranking automatically.

---

## 📊 Ranking

User rankings are generated dynamically using accumulated scores and can be consumed by the Front-end application for leaderboard visualization.

---

## 📁 Project Structure

```text
integra_bolao/
│
├── usuarios/
├── jogos/
├── palpites/
├── core/
│
├── manage.py
├── requirements.txt
└── README.md
```

---

## 👨‍💻 Author

**Victor Gabriel Barros Moreira**

Deployment Analyst & Backend Developer
