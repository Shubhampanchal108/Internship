# Day 21 - Student REST API

A simple Express.js REST API for managing students, with a frontend using JavaScript `fetch()`.

## Tech Stack

- Node.js
- Express.js
- HTML
- CSS
- JavaScript Fetch API
- In-memory JavaScript array (no database)

## 1. Install dependencies

```bash
npm install
```

## 2. Start the server

```bash
npm start
```

For development:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/students` | Get all students |
| GET | `/students/:id` | Get one student |
| POST | `/students` | Create a student |
| PUT | `/students/:id` | Update a student |
| DELETE | `/students/:id` | Delete a student |

## Example POST body

```json
{
  "name": "Aman",
  "age": 21,
  "course": "B.Tech CSE",
  "email": "aman@example.com"
}
```

## Example PUT body

```json
{
  "name": "Aman Sharma",
  "age": 22,
  "course": "B.Tech CSE",
  "email": "aman@example.com"
}
```

## HTTP Status Codes Used

- `200` - successful GET, PUT and DELETE
- `201` - student created successfully
- `400` - invalid request/input
- `404` - student or route not found

## Important

The students are stored in an array, so all changes are temporary. Restarting the server resets the data.
