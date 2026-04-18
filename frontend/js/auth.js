import { registerUser, loginUser } from "./api.js";

const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const registerMessage = document.getElementById("registerMessage");
const loginMessage = document.getElementById("loginMessage");

function setMessage(element, message, type) {
    if (!element) return;
    element.textContent = message;
    element.className = `${type}-message`;
}

if (registerForm) {
    registerForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const payload = {
            firstName: document.getElementById("firstName").value.trim(),
            lastName: document.getElementById("lastName").value.trim(),
            email: document.getElementById("email").value.trim(),
            password: document.getElementById("password").value.trim(),
            phoneNumber: document.getElementById("phoneNumber").value.trim()
        };

        try {
            await registerUser(payload);
            setMessage(registerMessage, "Account created successfully. You can now log in.", "success");
            registerForm.reset();
        } catch (error) {
            console.error("Register error:", error);
            setMessage(registerMessage, error.message || "Registration failed.", "error");
        }
    });
}

if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const payload = {
            email: document.getElementById("loginEmail").value.trim(),
            password: document.getElementById("loginPassword").value.trim()
        };

        try {
            const user = await loginUser(payload);
            localStorage.setItem("currentUser", JSON.stringify(user));
            setMessage(loginMessage, `Welcome back, ${user.firstName}. Redirecting...`, "success");

            setTimeout(() => {
                window.location.href = "index.html";
            }, 1000);
        } catch (error) {
            console.error("Login error:", error);
            setMessage(loginMessage, error.message || "Login failed.", "error");
        }
    });
}