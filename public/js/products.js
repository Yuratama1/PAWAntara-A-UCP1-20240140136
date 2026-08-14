document.addEventListener("DOMContentLoaded", () => {

    const filterForm =
        document.getElementById("filter-form");

    const searchInput =
        document.getElementById("search");

    const kategoriSelect =
        document.getElementById("kategori");

    const resetButton =
        document.getElementById("reset-filter");

    const productContainer =
        document.getElementById("product-container");

    const productCount =
        document.getElementById("product-count");

    const productMessage =
        document.getElementById("product-message");


    // ======================================================
    // FORMAT HARGA
    // ======================================================

    function formatRupiah(price) {

        return new Intl.NumberFormat(
            "id-ID",
            {
                style: "currency",
                currency: "IDR",
                maximumFractionDigits: 0
            }
        ).format(price);

    }


    // ======================================================
    // ESCAPE HTML
    // MENCEGAH XSS
    // ======================================================

    function escapeHTML(value) {

        return String(value)
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");

    }


    // ======================================================
    // TAMPILKAN MESSAGE
    // ======================================================

    function showMessage(
        message,
        type = "loading"
    ) {

        productMessage.innerHTML = `
            <div class="product-message ${type}">
                ${escapeHTML(message)}
            </div>
        `;

    }


    // ======================================================
    // HAPUS MESSAGE
    // ======================================================

    function clearMessage() {

        productMessage.innerHTML = "";

    }


    // ======================================================
    // RENDER PRODUCTS
    // ======================================================

    function renderProducts(products) {

        productContainer.innerHTML = "";

        productCount.textContent =
            `${products.length} produk`;


        // ==========================
        // TIDAK ADA PRODUK
        // ==========================

        if (!products.length) {

            productContainer.innerHTML = `
                <div class="empty-state">

                    <h3>
                        Produk tidak ditemukan
                    </h3>

                    <p>
                        Coba gunakan kata kunci
                        atau kategori lainnya.
                    </p>

                </div>
            `;

            return;

        }


        // ==========================
        // RENDER CARD
        // ==========================

        products.forEach(product => {

            const stock =
                Number(product.stock);

            const stockClass =
                stock > 0
                    ? "available"
                    : "empty";

            const stockText =
                stock > 0
                    ? `Stok: ${stock}`
                    : "Stok habis";


            const card =
                document.createElement("article");

            card.className =
                "product-card";


            card.innerHTML = `

                <span class="product-category">
                    ${escapeHTML(product.category)}
                </span>

                <h3 class="product-name">
                    ${escapeHTML(product.name)}
                </h3>

                <div class="product-price">
                    ${formatRupiah(product.price)}
                </div>

                <div class="product-stock ${stockClass}">
                    ${stockText}
                </div>

                <a
                    href="/produk/${encodeURIComponent(product.id)}"
                    class="product-detail-link"
                    aria-label="Lihat detail ${escapeHTML(product.name)}"
                >
                    Lihat Detail
                </a>

            `;


            productContainer.appendChild(card);

        });

    }


    // ======================================================
    // LOAD PRODUCTS
    // ======================================================

    async function loadProducts() {

        try {

            showMessage(
                "Memuat data produk..."
            );


            const response =
                await fetch("/api/products", {
                    method: "GET",
                    headers: {
                        "Accept": "application/json"
                    }
                });


            const result =
                await response.json();


            // ==========================
            // CEK RESPONSE API
            // ==========================

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal mengambil data produk"
                );

            }


            if (
                result.status !== "success" ||
                !Array.isArray(result.data)
            ) {

                throw new Error(
                    "Format response API tidak valid"
                );

            }


            clearMessage();


            // ==========================
            // FILTER
            // ==========================

            const search =
                searchInput.value
                    .trim()
                    .toLowerCase();

            const kategori =
                kategoriSelect.value
                    .trim()
                    .toLowerCase();


            let filteredProducts =
                result.data;


            // ==========================
            // SEARCH NAMA
            // ==========================

            if (search) {

                filteredProducts =
                    filteredProducts.filter(
                        product =>
                            String(product.name)
                                .toLowerCase()
                                .includes(search)
                    );

            }


            // ==========================
            // FILTER KATEGORI
            // ==========================

            if (kategori) {

                filteredProducts =
                    filteredProducts.filter(
                        product =>
                            String(product.category)
                                .toLowerCase() === kategori
                    );

            }


            renderProducts(
                filteredProducts
            );


        } catch (error) {

            console.error(
                "Load products error:",
                error
            );


            productContainer.innerHTML = "";

            productCount.textContent =
                "0 produk";


            showMessage(
                error.message ||
                "Gagal mengambil data produk",
                "error"
            );

        }

    }


    // ======================================================
    // FILTER SUBMIT
    // ======================================================

    filterForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();

            await loadProducts();

        }
    );


    // ======================================================
    // RESET FILTER
    // ======================================================

    resetButton.addEventListener(
        "click",
        async () => {

            searchInput.value = "";

            kategoriSelect.value = "";

            await loadProducts();

        }
    );


    // ======================================================
    // FILTER SAAT MENGETIK
    // ENTER TETAP BISA DIGUNAKAN
    // ======================================================

    searchInput.addEventListener(
        "keydown",
        event => {

            if (event.key === "Enter") {

                event.preventDefault();

                filterForm.requestSubmit();

            }

        }
    );
    
    loadProducts();

});