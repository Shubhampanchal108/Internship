const API_URL = '/students';

const form = document.getElementById('studentForm');
const studentIdInput = document.getElementById('studentId');
const nameInput = document.getElementById('name');
const ageInput = document.getElementById('age');
const courseInput = document.getElementById('course');
const emailInput = document.getElementById('email');
const tableBody = document.getElementById('studentTableBody');
const studentCount = document.getElementById('studentCount');
const message = document.getElementById('message');
const formTitle = document.getElementById('formTitle');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');
const refreshBtn = document.getElementById('refreshBtn');

function showMessage(text, type = '') {
  message.textContent = text;
  message.className = `message ${type}`;
}

function resetForm() {
  form.reset();
  studentIdInput.value = '';
  formTitle.textContent = 'Add Student';
  submitBtn.textContent = 'Add Student';
  cancelBtn.classList.add('hidden');
}

async function loadStudents() {
  try {
    const response = await fetch(API_URL);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to load students');
    }

    renderStudents(result.data);
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

function renderStudents(students) {
  tableBody.innerHTML = '';
  studentCount.textContent = `${students.length} student${students.length === 1 ? '' : 's'} found`;

  if (students.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="6" class="empty">No students found.</td></tr>';
    return;
  }

  students.forEach((student) => {
    const row = document.createElement('tr');

    row.innerHTML = `
      <td>${student.id}</td>
      <td>${escapeHtml(student.name)}</td>
      <td>${student.age}</td>
      <td>${escapeHtml(student.course)}</td>
      <td>${escapeHtml(student.email)}</td>
      <td class="row-actions">
        <button class="edit-btn" onclick="editStudent(${student.id})">Edit</button>
        <button class="delete-btn" onclick="deleteStudent(${student.id})">Delete</button>
      </td>
    `;

    tableBody.appendChild(row);
  });
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

async function editStudent(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Student not found');
    }

    const student = result.data;

    studentIdInput.value = student.id;
    nameInput.value = student.name;
    ageInput.value = student.age;
    courseInput.value = student.course;
    emailInput.value = student.email;

    formTitle.textContent = 'Edit Student';
    submitBtn.textContent = 'Update Student';
    cancelBtn.classList.remove('hidden');
    showMessage(`Editing student #${student.id}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function deleteStudent(id) {
  const confirmed = confirm(`Delete student #${id}?`);
  if (!confirmed) return;

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Failed to delete student');
    }

    showMessage(result.message, 'success');
    await loadStudents();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const id = studentIdInput.value;
  const student = {
    name: nameInput.value.trim(),
    age: Number(ageInput.value),
    course: courseInput.value.trim(),
    email: emailInput.value.trim()
  };

  const isEditing = Boolean(id);
  const url = isEditing ? `${API_URL}/${id}` : API_URL;
  const method = isEditing ? 'PUT' : 'POST';

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(student)
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Request failed');
    }

    showMessage(result.message, 'success');
    resetForm();
    await loadStudents();
  } catch (error) {
    showMessage(error.message, 'error');
  }
});

cancelBtn.addEventListener('click', resetForm);
refreshBtn.addEventListener('click', loadStudents);

loadStudents();
