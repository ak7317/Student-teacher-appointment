// js/auth.js
const info = document.getElementById('info');

// ✅ Login
document.getElementById('loginForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const email = document.getElementById('loginEmail').value;
  const pass = document.getElementById('loginPassword').value;
  try {
    const { user } = await auth.signInWithEmailAndPassword(email, pass);
    const doc = await db.collection('users').doc(user.uid).get();
    const u = doc.data();

    // Redirect based on role
    if (u.role === 'student') window.location.href = 'dashboard.html';
    else if (u.role === 'teacher') window.location.href = 'teacher.html';
    else if (u.role === 'admin') window.location.href = 'admin.html';
    else info.textContent = "Unknown role, contact admin.";
  } catch (err) {
    info.textContent = err.message;
  }
});

// ✅ Register
document.getElementById('registerForm')?.addEventListener('submit', async e => {
  e.preventDefault();
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const pass = document.getElementById('regPassword').value;
  const role = document.getElementById('regRole').value;
  const dept = document.getElementById('regDept')?.value || null;
  const subject = document.getElementById('regSubject')?.value || null;

  try {
    const { user } = await auth.createUserWithEmailAndPassword(email, pass);
    await db.collection('users').doc(user.uid).set({
      name, email, role,
      department: dept, subject,
      approved: role === 'teacher' ? false : true, // teachers need approval
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    });
    info.textContent = '✅ Registered successfully. Now login.';
  } catch (err) {
    info.textContent = err.message;
  }
});
