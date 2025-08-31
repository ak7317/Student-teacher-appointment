let teacherUser, teacherProfile;

// Guard to check teacher login
const guardTeacher = async () => {
  return new Promise(resolve => {
    auth.onAuthStateChanged(async (u) => {
      if (!u) return location.href = "index.html";
      const doc = await db.collection("users").doc(u.uid).get();
      const profile = doc.data();
      if (!profile || profile.role !== "teacher") return location.href = "index.html";
      resolve({ user: u, profile });
    });
  });
};

// Load teacher's appointments
const loadAppointments = async () => {
  const snap = await db.collection("appointments")
    .where("teacherId", "==", teacherUser.uid)
    .orderBy("createdAt", "desc")
    .get();

  const tbody = document.getElementById("apptTbody");
  tbody.innerHTML = "";

  if (snap.empty) {
    tbody.innerHTML = `<tr><td colspan="5">No appointment requests</td></tr>`;
    return;
  }

  snap.forEach(doc => {
    const a = doc.data();
    const badge =
      a.status === "approved" ? "green" :
      a.status === "rejected" ? "red" : "yellow";

    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${a.studentName}</td>
        <td>${a.date}</td>
        <td>${a.time}</td>
        <td><span class="badge ${badge}">${a.status}</span></td>
        <td>
          ${a.status === "pending" ? `
            <button class="button success" onclick="updateStatus('${doc.id}','approved')">Approve</button>
            <button class="button danger" onclick="updateStatus('${doc.id}','rejected')">Reject</button>
          ` : "-"}
        </td>
      </tr>
    `);
  });
};

// Update appointment status
const updateStatus = async (id, status) => {
  await db.collection("appointments").doc(id).update({ status });
  loadAppointments();
};

// Init
guardTeacher().then(({ user, profile }) => {
  teacherUser = user;
  teacherProfile = profile;
  loadAppointments();
});
