import { User } from "./apiCalls.js";

export function registerAccount() {
  const signupForm = document.getElementById("signupForm");

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
      const role = document.querySelector('input[name="userType"]:checked').value.toLowerCase();
      console.log("Selected role:", role);

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
        if(phoneNumber.length > 0 || phoneNumber.length <= 8) {
          errorMessage.textContent = "Invalid phone number";
          errorMessage.className = "error-message";
          return;
        }
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
          role,
          isActive: true,
          isApproved: role === "backer"
        };

        const res = await User.registerUser(userData);

        if (res.id) {
          if (errorMessage) {
            errorMessage.textContent = "";
            errorMessage.className = "";
          }

         
          document.getElementById("signupForm").reset();
        }
      } catch (e) {
        if (errorMessage) {
          errorMessage.textContent = e.message;
          errorMessage.className = "error-message";
        }
        console.error("Registration error:", e);
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


 

