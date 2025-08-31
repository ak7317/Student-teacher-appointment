// Load Users
const loadUsers = async () => {
  const snap = await db.collection("users").get();
  const tbody = document.getElementById("usersTbody");
  tbody.innerHTML = "";

  if (snap.empty) {
    tbody.innerHTML = `<tr><td colspan="5">No users found</td></tr>`;
    return;
  }

  snap.forEach(doc => {
    const u = doc.data();
    const badge = u.approved ? "green" : "yellow";

    tbody.insertAdjacentHTML("beforeend", `
      <tr>
        <td>${u.name || "N/A"}</td>
        <td>${u.email || "N/A"}</td>
        <td>${u.role || "N/A"}</td>
        <td><span class="badge ${badge}">${u.approved ? "Approved" : "Pending"}</span></td>
        <td>
          ${!u.approved && u.role === "teacher" 
            ? `<button class="button success approveBtn" data-id="${doc.id}">Approve</button>`
            : "-"
          }
        </td>
      </tr>
    `);
  });

  // Handle Approve button clicks
  document.querySelectorAll(".approveBtn").forEach(btn => {
    btn.onclick = async () => {
      const id = btn.getAttribute("data-id");
      await db.collection("users").doc(id).update({ approved: true });
      loadUsers();
    };
  });
};

// Guard for admin role
const guardAdmin = async () => {
  return new Promise(resolve => {
    auth.onAuthStateChanged(async (u) => {
      if (!u) return location.href = "index.html";
      const doc = await db.collection("users").doc(u.uid).get();
      const profile = doc.data();
      if (!profile || profile.role !== "admin") return location.href = "index.html";
      resolve({ user: u, profile });
    });
  });
};

// Init
guardAdmin().then(() => {
  loadUsers();
});
