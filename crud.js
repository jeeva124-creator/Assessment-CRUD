import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-database.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz1oBq7HfAOeNVVssooLem1HtW00-hfQ0",
  authDomain: "crud-a0484.firebaseapp.com",
  databaseURL: "https://crud-a0484-default-rtdb.firebaseio.com",
  projectId: "crud-a0484",
  storageBucket: "crud-a0484.firebasestorage.app",
  messagingSenderId: "1093352115724",
  appId: "1:1093352115724:web:f43cecf966fef8a8b46829",
  measurementId: "G-J7H1YL4N53",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

window.editStudent = function (id) {
  const studentItem = document.querySelector(`[data-id='${id}']`);
  console.log(studentItem);

  if (!studentItem) {
    console.error("Student not found");
    return;
  }

  const nameElement = studentItem.querySelector(".student-name");
  const ageElement = studentItem.querySelector(".student-age");

  if (!nameElement || !ageElement) {
    console.error("Student name or age not found");
    return;
  }

  const name = nameElement.textContent.trim();
  const age = ageElement.textContent.trim();

  studentName.value = name;
  studentAge.value = age;

  // store id
  window.editingStudentId = id;
};

const form = document.getElementById("student-form");
const studentName = document.getElementById("student-name");
const studentAge = document.getElementById("student-age");
const studentList = document.getElementById("student-list");

form.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = studentName.value;
  const age = studentAge.value;

  if (window.editingStudentId) {
    const studentRef = ref(db, "students/" + window.editingStudentId);
    await update(studentRef, { name, age });

    studentName.value = "";
    studentAge.value = "";
    window.editingStudentId = null;
  } 
  else {
    const studentId = new Date().getTime().toString();
    await set(ref(db, "students/" + studentId), { name, age });
    console.log(`New student added with ID ${studentId}`);

    studentName.value = "";
    studentAge.value = "";
  }

  fetchStudents();
});

const fetchStudents = async () => {
  const dbRef = ref(db, "students");
  const snapshot = await get(dbRef);
  studentList.innerHTML = "";

  if (snapshot.exists()) {
    const students = snapshot.val();
    for (const studentId in students) {
      const student = students[studentId];

      const li = document.createElement("li");
      li.setAttribute("data-id", studentId);
      li.innerHTML = `
        <span class="student-name">${student.name}</span> - Age: <span class="student-age">${student.age}</span>
        <button class="edit-btn" onclick="editStudent('${studentId}')">Edit</button>
        <button class="delete-btn" onclick="deleteStudent('${studentId}')">Delete</button>
      `;
      studentList.appendChild(li);
    }
  }
};

// Delete Student
window.deleteStudent = async (id) => {
  const studentRef = ref(db, "students/" + id);
  await remove(studentRef);
  fetchStudents(); // Refresh the list after deletion
};

// Initial Fetch of Students
fetchStudents();
