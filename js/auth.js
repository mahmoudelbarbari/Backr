import { User } from "./apiCalls.js";

document.addEventListener("DOMContentLoaded", () => {
  const signupForm = document.querySelector("#signupForm");

  if (!signupForm) {
    console.error("Signup form not found");
    return;
  }

  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const errorMessage = document.getElementById("message");
    errorMessage.textContent = "";
    errorMessage.className = "";
    errorMessage.textContent = "";

    const name = document.getElementById("signupName").value;
    const email = document.getElementById("signupEmail").value;
    const phoneNumber = document.getElementById("signupPhone").value;
    const password = document.getElementById("signupPassword").value;
    const confirmPassword = document.getElementById(
      "signupConfirmPassword"
    ).value;

    if (password !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match";
      errorMessage.className = "error-message";
      return;
    }
    if (email === "" || password === "") {
      errorMessage.textContent = "Email and password are required";
      errorMessage.className = "error-message";
      return;
    }
    if (regex.test(email) === false) {
      errorMessage.textContent = "Invalid email address";
      errorMessage.className = "error-message";
      return;
    }

    try {
      const userData = {
        name,
        email,
        phoneNumber,
        password,
        role: "user",
        isActive: true,
      };

      const res = await User.registerUser(userData);

      if (res.id) {
        errorMessage.textContent = "";
        errorMessage.className = "";

        const loaderDiv = createElement("div");
        loaderDiv.className = "loader";
        errorMessage.appendChild(loaderDiv);

        document.getElementById("signupForm").reset();

        setTimeout(() => {
          window.location.href = "adminDashboard.html";
        }, 2000);
      }
    } catch (e) {
      errorMessage.textContent = "Registration failed. Please try again later.";
      errorMessage.className = "error-message";
    }
  }); // end of event listener signup
}); // end of DOMContentLoaded
