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
    // CEK ELEMENT
    // ======================================================

    if (
        !filterForm ||
        !searchInput ||
        !kategoriSelect ||
        !resetButton ||
        !productContainer ||
        !productCount ||
        !productMessage
    ) {

        console.error(
            "Element produk/filter tidak ditemukan."
        );

        return;

    }


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
        ).format(Number(price) || 0);

    }


    // ======================================================
    // ESCAPE HTML
    // MENCEGAH XSS
    // ======================================================

    function escapeHTML(value) {

        return String(value ?? "")
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
    // UPDATE URL
    // ======================================================

    function updateURL() {

        const search =
            searchInput.value.trim();

        const kategori =
            kategoriSelect.value.trim();


        const params =
            new URLSearchParams();


        if (search) {

            params.set(
                "search",
                search
            );

        }


        if (kategori) {

            params.set(
                "kategori",
                kategori
            );

        }


        const queryString =
            params.toString();


        const newURL =
            queryString
                ? `/produk?${queryString}`
                : "/produk";


        window.history.pushState(
            {},
            "",
            newURL
        );

    }


    // ======================================================
    // LOAD FILTER DARI URL
    // ======================================================

    function loadFilterFromURL() {

        const params =
            new URLSearchParams(
                window.location.search
            );


        const search =
            params.get("search") || "";


        const kategori =
            params.get("kategori") || "";


        searchInput.value =
            search;


        kategoriSelect.value =
            kategori;

    }


    // ======================================================
    // RENDER PRODUCTS
    // ======================================================

    function renderProducts(products) {

        productContainer.innerHTML = "";

        productCount.textContent =
            `${products.length} produk`;


        // ==================================================
        // TIDAK ADA PRODUK
        // ==================================================

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


        // ==================================================
        // RENDER CARD
        // ==================================================

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

                <div
                    class="product-stock ${stockClass}"
                >
                    ${escapeHTML(stockText)}
                </div>

                <a
                    href="/produk/${encodeURIComponent(product.id)}"
                    class="product-detail-link"
                    aria-label="Lihat detail ${escapeHTML(product.name)}"
                >
                    Lihat Detail
                </a>

            `;


            productContainer.appendChild(
                card
            );

        });

    }


    // ======================================================
    // LOAD PRODUCTS DARI API
    // FILTER DIPROSES DI SERVER / DATABASE
    // ======================================================

    async function loadProducts() {

        try {

            showMessage(
                "Memuat data produk..."
            );


            // ==================================================
            // AMBIL FILTER
            // ==================================================

            const search =
                searchInput.value.trim();


            const kategori =
                kategoriSelect.value.trim();


            // ==================================================
            // BUAT QUERY STRING
            // ==================================================

            const params =
                new URLSearchParams();


            if (search) {

                params.set(
                    "search",
                    search
                );

            }


            if (kategori) {

                params.set(
                    "kategori",
                    kategori
                );

            }


            // ==================================================
            // BUAT URL API
            // ==================================================

            const queryString =
                params.toString();


            const apiURL =
                queryString
                    ? `/api/products?${queryString}`
                    : "/api/products";


            console.log(
                "Request API:",
                apiURL
            );


            // ==================================================
            // FETCH API
            // ==================================================

            const response =
                await fetch(
                    apiURL,
                    {
                        method: "GET",

                        headers: {
                            "Accept":
                                "application/json"
                        }
                    }
                );


            // ==================================================
            // PARSE JSON
            // ==================================================

            const result =
                await response.json();


            // ==================================================
            // CEK HTTP RESPONSE
            // ==================================================

            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal mengambil data produk"
                );

            }


            // ==================================================
            // CEK FORMAT RESPONSE
            // ==================================================

            if (
                result.status !== "success" ||
                !Array.isArray(result.data)
            ) {

                throw new Error(
                    "Format response API tidak valid"
                );

            }


            // ==================================================
            // HILANGKAN LOADING
            // ==================================================

            clearMessage();


            // ==================================================
            // RENDER HASIL DARI SERVER
            // ==================================================

            renderProducts(
                result.data
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
        async event => {

            event.preventDefault();


            // ==================================================
            // VALIDASI DASAR
            // ==================================================

            const search =
                searchInput.value.trim();


            const kategori =
                kategoriSelect.value.trim();


            if (
                search.length > 100
            ) {

                showMessage(
                    "Pencarian terlalu panjang.",
                    "error"
                );

                return;

            }


            // ==================================================
            // UPDATE URL
            // ==================================================

            updateURL();


            // ==================================================
            // REQUEST ULANG KE API
            // ==================================================

            await loadProducts();

        }
    );


    // ======================================================
    // RESET FILTER
    // ======================================================

    resetButton.addEventListener(
        "click",
        async event => {

            event.preventDefault();


            searchInput.value = "";

            kategoriSelect.value = "";


            // ==================================================
            // UPDATE URL
            // ==================================================

            window.history.pushState(
                {},
                "",
                "/produk"
            );


            // ==================================================
            // LOAD SEMUA PRODUK
            // ==================================================

            await loadProducts();

        }
    );


    // ======================================================
    // SEARCH DENGAN ENTER
    // ======================================================

    searchInput.addEventListener(
        "keydown",
        event => {

            if (
                event.key === "Enter"
            ) {

                event.preventDefault();

                filterForm.requestSubmit();

            }

        }
    );


    // ======================================================
    // HANDLE BACK/FORWARD BROWSER
    // ======================================================

    window.addEventListener(
        "popstate",
        async () => {

            loadFilterFromURL();

            await loadProducts();

        }
    );


    // ======================================================
    // LOAD FILTER DARI URL SAAT HALAMAN DIBUKA
    // ======================================================

    loadFilterFromURL();


    // ======================================================
    // LOAD PRODUK PERTAMA KALI
    // ======================================================

    loadProducts();

});