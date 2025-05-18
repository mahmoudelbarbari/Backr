const user = JSON.parse(localStorage.getItem("user"));
if (user) {
    document.title = "Unauthorized Access";
  document.querySelector(".unauthorized-title").innerHTML = "Unauthorized Access";
document.querySelector(".unauthorized-message").innerHTML = "You are not authorized to access this page. Please contact the administrator if you believe this is an error.";
document.querySelector(".Action-btn").innerHTML = "Go to Home";
}

