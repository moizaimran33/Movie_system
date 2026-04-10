function login() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  fetch("http://16.16.233.152:5000/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) throw new Error("Invalid credentials");
      return res.json();
    })
    .then((data) => {
      localStorage.setItem("userRole", data.role);

      if (data.role === "manager") {
        window.location.href = "manager.html";
      } else if (data.role === "staff") {
        window.location.href = "staff.html";
      } else if (data.role === "public") {
        window.location.href = "public.html";
      } else {
        document.getElementById("message").textContent = "Unknown role!";
      }
    })
    .catch((err) => {
      document.getElementById("message").textContent = err.message;
    });
}

let isSignup = false;

function toggleForm() {
  isSignup = !isSignup;
  document.getElementById("formTitle").textContent = isSignup ? "Sign Up" : "Login";
  document.getElementById("submitBtn").textContent = isSignup ? "Sign Up" : "Login";
  document.getElementById("submitBtn").setAttribute("onclick", isSignup ? "signup()" : "login()");
  document.getElementById("confirmPassword").style.display = isSignup ? "block" : "none";
  document.getElementById("message").textContent = "";
}

function signup() {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirmPassword").value.trim();
  if (password !== confirmPassword) {
    document.getElementById("message").textContent = "Passwords do not match!";
    return;
  }
  fetch("http://16.16.233.152:5000/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((res) => {
      if (!res.ok) return res.json().then(d => { throw new Error(d.message) });
      return res.json();
    })
    .then((data) => {
      document.getElementById("message").textContent = "✅ " + data.message + " Please login!";
      toggleForm();
    })
    .catch((err) => {
      document.getElementById("message").textContent = "❌ " + err.message;
    });
}
