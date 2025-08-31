// js/student.js
let studentUser, studentProfile;

// Guard Student Login
const guardStudent = async () => {
  return new Promise(resolve => {
    auth.onAuthStateChanged(async (u) => {
      if (!u) return location.href = 'index.html';
      const doc = await db.collection('users').doc(u.uid).get();
      const profile = doc.data();
      if (!profile || profile.role !== 'student') return location.href = 'index.html';
      resolve({ user: u, profile });
    });
  });
};

// Load Teachers for dropdown
const loadTeachers = async () => {
  const snap = await db.collection('users')
    .where('role', '==', 'teacher')
    .where('approved', '==', true)
    .get();

  const select = document.getElementById('teacherSelect');
  select.innerHTML = '<option value="">-- Select Teacher --</option>';

  snap.forEach(doc => {
    const t = doc.data();
    select.insertAdjacentHTML(
      'beforeend',
      `<option value="${doc.id}">${t.name} (${t.department || ''})</option>`
    );
  });
};

// Load student appointments
const loadAppointments = async () => {
  const snap = await db.collection('appointments')
    .where('studentId', '==', studentUser.uid)
    .orderBy('createdAt', 'desc').get();

  const tbody = document.getElementById('apptTbody');
  tbody.innerHTML = '';

  for (const doc of snap.docs) {
    const a = doc.data();

    // Fallback: fetch teacher name if missing
    let teacherName = a.teacherName;
    if (!teacherName && a.teacherId) {
      const teacherDoc = await db.collection('users').doc(a.teacherId).get();
      teacherName = teacherDoc.exists ? teacherDoc.data().name : "Unknown";
    }

    const badge =
      a.status === 'approved' ? 'green' :
      a.status === 'rejected' ? 'red' : 'yellow';

    tbody.insertAdjacentHTML('beforeend', `
      <tr>
        <td>${teacherName}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td><span class="badge ${badge}">${a.status}</span></td>
      </tr>
    `);
  }
};

// Book new appointment
document.getElementById('bookForm')?.addEventListener('submit', async e => {
  e.preventDefault();

  const teacherId = document.getElementById('teacherSelect').value;
  const dateInput = document.getElementById('date').value;
  const time = document.getElementById('time').value;

  if (!teacherId || !dateInput || !time) {
    return alert("⚠️ Please fill all fields!");
  }

  // Fix date format
  const formattedDate = new Date(dateInput).toISOString().split("T")[0];

  const teacherDoc = await db.collection('users').doc(teacherId).get();
  const teacher = teacherDoc.data();

  await db.collection('appointments').add({
    studentId: studentUser.uid,
    studentName: studentProfile.name,
    teacherId,
    teacherName: teacher?.name || "Unknown",
    date: formattedDate,
    time,
    status: 'pending',
    createdAt: firebase.firestore.FieldValue.serverTimestamp()
  });

  alert('✅ Appointment request sent!');
  loadAppointments();
});

// Initialize
guardStudent().then(({ user, profile }) => {
  studentUser = user;
  studentProfile = profile;
  loadTeachers();
  loadAppointments();
});
