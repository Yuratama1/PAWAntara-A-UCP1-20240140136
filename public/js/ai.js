document.addEventListener("DOMContentLoaded", () => {
    const aiForm = document.getElementById("aiForm");
    const questionInput = document.getElementById("question");
    const chatArea = document.getElementById("chatArea");

    if (!aiForm || !questionInput || !chatArea) {
        return;
    }

    aiForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const question = questionInput.value.trim();

        // ======================
        // VALIDASI
        // ======================
        if (!question) {
            addMessage(
                "Silakan masukkan pertanyaan terlebih dahulu.",
                "ai"
            );

            return;
        }

        // Tampilkan pertanyaan user
        addMessage(question, "user");

        // Kosongkan textarea
        questionInput.value = "";

        // Disable button saat request
        const submitButton = aiForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Memproses...";
        }

        try {
            const response = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    question
                })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message ||
                    "Gagal mendapatkan jawaban"
                );
            }

            addMessage(
                result.data.answer,
                "ai"
            );

        } catch (error) {
            console.error("AI error:", error);

            addMessage(
                "Maaf, terjadi kesalahan saat memproses pertanyaan.",
                "ai"
            );

        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Kirim Pertanyaan";
            }

            questionInput.focus();
        }
    });

    // ======================
    // TAMBAH PESAN KE CHAT
    // ======================
    function addMessage(message, sender) {
        const wrapper = document.createElement("div");

        wrapper.style.display = "flex";
        wrapper.style.marginBottom = "12px";

        if (sender === "user") {
            wrapper.style.justifyContent = "flex-end";
        } else {
            wrapper.style.justifyContent = "flex-start";
        }

        const bubble = document.createElement("div");

        bubble.textContent = message;

        bubble.style.maxWidth = "78%";
        bubble.style.padding = "14px 16px";
        bubble.style.borderRadius = "15px";
        bubble.style.fontSize = "13px";
        bubble.style.lineHeight = "1.7";
        bubble.style.whiteSpace = "pre-wrap";

        if (sender === "user") {
            bubble.style.background = "#1f7a4d";
            bubble.style.color = "#ffffff";
            bubble.style.borderRadius = "15px 15px 5px 15px";
        } else {
            bubble.style.background = "#eaf7ef";
            bubble.style.color = "#33433a";
            bubble.style.border = "1px solid #d7ebde";
            bubble.style.borderRadius = "15px 15px 15px 5px";
        }

        wrapper.appendChild(bubble);
        chatArea.appendChild(wrapper);

        // Scroll otomatis ke pesan terbaru
        chatArea.scrollTop = chatArea.scrollHeight;
    }
});