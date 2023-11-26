function authenticateUser() {
    // Replace these values with your actual username and password
    var correctUsername = "sam";
    var correctPassword = "123";

    var usernameInput = document.getElementById("username").value;
    var passwordInput = document.getElementById("password").value;

    if (usernameInput === correctUsername && passwordInput === correctPassword) {
      // Redirect to the dashboard page upon successful login
      window.location.href = "C:\Users\DELL\OneDrive\Desktop\hack'\PsiHarmony\healthpage\index.html";
    } else {
      alert("Invalid username or password")
    }
};