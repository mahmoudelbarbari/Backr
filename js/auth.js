import { User } from "./apiCalls.js";

export function registerAccount() {
  const signupForm = document.getElementById("signupForm");

  if (!signupForm) {
    console.error("Signup form not found");
    return;
  }
  if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      const regexPhoneNum = /^(\+201|01|00201)[0-2,5]{1}[0-9]{8}/;

      const errorMessage = document.getElementById("message");

      const name = document.getElementById("signupName").value;
      const email = document.getElementById("signupEmail").value;
      const phoneNumber = document.getElementById("signupPhone").value;
      const password = document.getElementById("signupPassword").value;
      const confirmPassword = document.getElementById(
        "signupConfirmPassword"
      ).value;
      // const role = document.querySelector('input[name="role"]:checked').value;

      if (password !== confirmPassword) {
        errorMessage.textContent = "Passwords do not match";
        errorMessage.className = "error-message";
        return;
      } else if (email === "" || password === "") {
        errorMessage.textContent = "Email and password are required";
        errorMessage.className = "error-message";
        return;
      } else if (regexEmail.test(email) === false) {
        errorMessage.textContent = "Invalid email address";
        errorMessage.className = "error-message";
        return;
      } else if (regexPhoneNum.test(phoneNumber) === false) {
        errorMessage.textContent = "Invalid phone number";
        errorMessage.className = "error-message";
        return;
      }

      try {
        const userData = {
          name,
          email,
          phoneNumber,
          password,
          role: "backer",
          isActive: true,
        };

        const res = await User.registerUser(userData);

        if (res.id) {
          errorMessage.textContent = "";
          errorMessage.className = "";

          const loaderDiv = document.createElement("div");
          loaderDiv.classList.add("loader");
          errorMessage.appendChild(loaderDiv);

          document.getElementById("signupForm").reset();
        }
      } catch (e) {
        errorMessage.textContent = e.message === "User with this email already exists" 
          ? "This email is already registered. Please login instead."
          : "Registration failed. Please try again later.";
        errorMessage.className = "error-message";
        console.log(e);
      }
    }); // end of event listener signup
  }
}

export function loginAccount() {
  const loginForm = document.getElementById("loginForm");
  if (!loginForm) {
    console.error("Login form not found");
    return;
  }

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const regexEmail = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const errorMessage = document.getElementById("messagelogin");
    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    if (email === "" || password === "") {
      errorMessage.textContent = "Email and password are required";
      errorMessage.className = "error-message";
      return;
    } else if (regexEmail.test(email) === false) {
      errorMessage.textContent = "Invalid email address";
      errorMessage.className = "error-message";
      return;
    }

    try {
      const loginData = {
        email,
        password,
      };

      const res = await User.loginUser(loginData);
      if (res.id) {
        errorMessage.textContent = "";
        errorMessage.className = "";
        sessionStorage.setItem("user", JSON.stringify(res));
      }
      
      if (res.role === "admin") {
        window.location.href = "../adminDashboard.html";
      } else if (res.role === "campaigner") {
        window.location.href = "../campaignerDashboard.html";
      } else if (res.role === "backer") {
        window.location.href = "../";
      }
    } catch (err) {
      errorMessage.textContent = "Invalid email or password";
      errorMessage.className = "error-message";
      console.log(err);
    }
  });
}


 

