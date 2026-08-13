const loginForm = document.getElementById("loginForm");
const loginMessage = document.getElementById("loginMessage");

function showLoginMessage(message) {
    loginMessage.textContent = message;
    loginMessage.style.display = "block";
}

loginForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value.trim();

    loginMessage.style.display = "none";

    if (!username || !password) {
        showLoginMessage(
            "Username dan password wajib diisi."
        );

        return;
    }

    try {
        const response = await fetch("/api/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        const result = await response.json();

        if (!response.ok) {
            showLoginMessage(
                result.message || "Login gagal."
            );

            return;
        }

        window.location.href = "/dashboard";

    } catch (error) {
        console.error("Login error:", error);

        showLoginMessage(
            "Terjadi kesalahan saat menghubungi server."
        );
    }
});