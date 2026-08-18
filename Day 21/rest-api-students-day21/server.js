const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Temporary in-memory data. Data resets whenever the server restarts.
let students = [
  { id: 1, name: 'Shubham', age: 21, course: 'B.Tech CSE', email: 'shubham@example.com' },
  { id: 2, name: 'Rahul', age: 21, course: 'B.Tech CSE', email: 'rahul@example.com' },
  { id: 3, name: 'Priya', age: 20, course: 'B.Tech IT', email: 'priya@example.com' }
];

let nextId = 4;

// GET /students - return all students
app.get('/students', (req, res) => {
  res.status(200).json({
    success: true,
    count: students.length,
    data: students
  });
});

// GET /students/:id - return one student
app.get('/students/:id', (req, res) => {
  const id = Number(req.params.id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      success: false,
      message: 'Student ID must be a number'
    });
  }

  const student = students.find((student) => student.id === id);

  if (!student) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  res.status(200).json({
    success: true,
    data: student
  });
});

// POST /students - create a new student
app.post('/students', (req, res) => {
  const { name, age, course, email } = req.body;

  if (!name || age === undefined || !course || !email) {
    return res.status(400).json({
      success: false,
      message: 'name, age, course and email are required'
    });
  }

  const numericAge = Number(age);

  if (!Number.isInteger(numericAge) || numericAge <= 0) {
    return res.status(400).json({
      success: false,
      message: 'age must be a positive integer'
    });
  }

  const newStudent = {
    id: nextId++,
    name: String(name).trim(),
    age: numericAge,
    course: String(course).trim(),
    email: String(email).trim()
  };

  students.push(newStudent);

  res.status(201).json({
    success: true,
    message: 'Student created successfully',
    data: newStudent
  });
});

// PUT /students/:id - update an existing student
app.put('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((student) => student.id === id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      success: false,
      message: 'Student ID must be a number'
    });
  }

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  const { name, age, course, email } = req.body;

  if (!name || age === undefined || !course || !email) {
    return res.status(400).json({
      success: false,
      message: 'name, age, course and email are required'
    });
  }

  const numericAge = Number(age);

  if (!Number.isInteger(numericAge) || numericAge <= 0) {
    return res.status(400).json({
      success: false,
      message: 'age must be a positive integer'
    });
  }

  students[index] = {
    id,
    name: String(name).trim(),
    age: numericAge,
    course: String(course).trim(),
    email: String(email).trim()
  };

  res.status(200).json({
    success: true,
    message: 'Student updated successfully',
    data: students[index]
  });
});

// DELETE /students/:id - delete a student
app.delete('/students/:id', (req, res) => {
  const id = Number(req.params.id);
  const index = students.findIndex((student) => student.id === id);

  if (!Number.isInteger(id)) {
    return res.status(400).json({
      success: false,
      message: 'Student ID must be a number'
    });
  }

  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: 'Student not found'
    });
  }

  const deletedStudent = students.splice(index, 1)[0];

  res.status(200).json({
    success: true,
    message: 'Student deleted successfully',
    data: deletedStudent
  });
});

// Handle unknown API routes
app.use('/students', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Serve frontend for any non-API route
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
