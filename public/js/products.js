document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // ELEMENT
    // ==========================

    const productContainer =
        document.getElementById("productContainer");

    const searchInput =
        document.getElementById("search");

    const categoryFilter =
        document.getElementById("kategori");

    const productMessage =
        document.getElementById("productMessage");

    const productCount =
        document.getElementById("productCount");

    const filterForm =
        document.getElementById("filterForm");


    // ==========================
    // DATA
    // ==========================

    let products = [];


    // ==========================
    // GET PRODUCTS
    // ==========================

    async function loadProducts() {

        try {

            showMessage(
                "Memuat data produk...",
                "loading"
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


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal mengambil data produk"
                );

            }


            products =
                Array.isArray(result.data)
                    ? result.data
                    : [];


            populateCategories();

            renderProducts();


        } catch (error) {

            console.error(
                "Gagal mengambil produk:",
                error
            );


            products = [];


            if (productContainer) {
                productContainer.innerHTML = "";
            }


            if (productCount) {
                productCount.textContent =
                    "0 Produk";
            }


            showMessage(
                error.message ||
                "Gagal mengambil data produk.",
                "error"
            );

        }

    }


    // ==========================
    // CATEGORY
    // ==========================

    function populateCategories() {

        if (!categoryFilter) {
            return;
        }


        const categories = [
            ...new Set(
                products
                    .map(
                        product =>
                            product.category
                    )
                    .filter(Boolean)
            )
        ].sort();


        categoryFilter.innerHTML = `
            <option value="">
                Semua Kategori
            </option>
        `;


        categories.forEach(
            (category) => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    category;


                option.textContent =
                    category;


                categoryFilter.appendChild(
                    option
                );

            }
        );

    }


    // ==========================
    // FILTER
    // ==========================

    function getFilteredProducts() {

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const category =
            categoryFilter
                ? categoryFilter.value
                : "";


        return products.filter(
            (product) => {

                const productName =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const productCategory =
                    String(
                        product.category || ""
                    ).toLowerCase();


                const matchesSearch =
                    !search ||
                    productName.includes(
                        search
                    );


                const matchesCategory =
                    !category ||
                    productCategory ===
                    category.toLowerCase();


                return (
                    matchesSearch &&
                    matchesCategory
                );

            }
        );

    }


    // ==========================
    // RENDER PRODUCTS
    // ==========================

    function renderProducts() {

        if (!productContainer) {
            return;
        }


        const filteredProducts =
            getFilteredProducts();


        productContainer.innerHTML = "";


        // JUMLAH PRODUK
        if (productCount) {

            productCount.textContent =
                `${filteredProducts.length} Produk`;

        }


        // TIDAK ADA PRODUK
        if (
            filteredProducts.length === 0
        ) {

            showEmptyState();

            return;

        }


        hideMessage();


        // RENDER CARD
        filteredProducts.forEach(
            (product) => {

                const card =
                    document.createElement(
                        "article"
                    );


                card.className =
                    "product-card";


                card.style.cssText = `
                    background:#fff;
                    border:1px solid #e7e5df;
                    border-radius:18px;
                    overflow:hidden;
                    transition:
                        transform .2s ease,
                        box-shadow .2s ease;
                `;


                const stock =
                    Number(product.stock);


                const price =
                    Number(product.price);


                const stockAvailable =
                    stock > 0;


                const stockColor =
                    stockAvailable
                        ? "#22c55e"
                        : "#dc3545";


                const stockText =
                    stockAvailable
                        ? "Stok tersedia"
                        : "Stok habis";


                card.innerHTML = `

                    <!-- ICON AREA -->

                    <div
                        style="
                            height:205px;
                            display:flex;
                            align-items:center;
                            justify-content:center;
                            background:
                                linear-gradient(
                                    145deg,
                                    #f5faf6,
                                    #fffaf0
                                );
                            overflow:hidden;
                        "
                    >

                        <div
                            style="
                                width:98px;
                                height:98px;
                                display:flex;
                                align-items:center;
                                justify-content:center;
                                background:#fff;
                                border:1px solid #e0ebe3;
                                border-radius:25px;
                                box-shadow:
                                    0 14px 28px
                                    rgba(31,70,48,.08);
                            "
                            aria-hidden="true"
                        >

                            ${getProductIcon(
                                product.category
                            )}

                        </div>

                    </div>


                    <!-- CONTENT -->

                    <div
                        style="
                            padding:20px;
                        "
                    >

                        <!-- CATEGORY -->

                        <span
                            style="
                                color:#1f7a4d;
                                font-size:10px;
                                font-weight:850;
                                letter-spacing:.8px;
                                text-transform:uppercase;
                            "
                        >
                            ${escapeHTML(
                                product.category
                            )}
                        </span>


                        <!-- NAME -->

                        <h3
                            style="
                                min-height:48px;
                                margin:8px 0 0;
                                color:#26352d;
                                font-size:17px;
                                line-height:1.4;
                            "
                        >
                            ${escapeHTML(
                                product.name
                            )}
                        </h3>


                        <!-- PRICE -->

                        <div
                            style="
                                margin-top:14px;
                                color:#1f7a4d;
                                font-size:23px;
                                font-weight:850;
                            "
                        >
                            Rp ${price.toLocaleString(
                                "id-ID"
                            )}
                        </div>


                        <!-- STOCK -->

                        <div
                            style="
                                margin-top:6px;
                                color:#929a95;
                                font-size:11px;
                            "
                        >

                            <span
                                style="
                                    display:inline-block;
                                    width:7px;
                                    height:7px;
                                    margin-right:4px;
                                    background:${stockColor};
                                    border-radius:50%;
                                "
                            ></span>

                            ${stockText}:

                            <strong
                                style="
                                    color:#5c6961;
                                "
                            >
                                ${stock}
                            </strong>

                        </div>


                        <!-- DETAIL -->

                        <a
                            href="/produk/${product.id}"
                            class="primary-btn"
                            style="
                                display:block;
                                margin-top:18px;
                                padding:11px;
                                background:#1f7a4d;
                                color:#fff;
                                border-radius:10px;
                                text-align:center;
                                font-size:12px;
                                font-weight:800;
                                text-decoration:none;
                            "
                        >
                            Lihat Detail Produk →
                        </a>

                    </div>

                `;


                // HOVER

                card.addEventListener(
                    "mouseenter",
                    () => {

                        card.style.transform =
                            "translateY(-4px)";

                        card.style.boxShadow =
                            "0 12px 30px rgba(31,41,55,.08)";

                    }
                );


                card.addEventListener(
                    "mouseleave",
                    () => {

                        card.style.transform =
                            "translateY(0)";

                        card.style.boxShadow =
                            "none";

                    }
                );


                productContainer.appendChild(
                    card
                );

            }
        );

    }


    // ==========================
    // PRODUCT ICON
    // ==========================

    function getProductIcon(category) {

        const value =
            String(category || "")
                .toLowerCase();


        /*
         * Icon dibuat menggunakan SVG sederhana.
         * Tidak menggunakan emoji.
         */

        if (
            value.includes("beras")
        ) {

            return `
                <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    stroke="#1f7a4d"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M20 13h24"/>
                    <path d="M22 13l-4 36h28l-4-36"/>
                    <path d="M18 25h28"/>
                    <path d="M22 35h20"/>
                    <path d="M27 43h10"/>
                </svg>
            `;

        }


        if (
            value.includes("minyak")
        ) {

            return `
                <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    stroke="#1f7a4d"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M25 10h14"/>
                    <path d="M27 10v8"/>
                    <path d="M37 10v8"/>
                    <path d="M22 18h20"/>
                    <path d="M20 18v34h24V18"/>
                    <path d="M26 29h12"/>
                    <path d="M26 37h12"/>
                </svg>
            `;

        }


        if (
            value.includes("gula")
        ) {

            return `
                <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    stroke="#1f7a4d"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M16 20h32v30H16z"/>
                    <path d="M16 20l8-8h24l-8 8"/>
                    <path d="M48 20v30"/>
                    <path d="M25 29h14"/>
                    <path d="M25 37h10"/>
                </svg>
            `;

        }


        if (
            value.includes("tepung")
        ) {

            return `
                <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    stroke="#1f7a4d"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M19 14h26"/>
                    <path d="M21 14l-3 38h28l-3-38"/>
                    <path d="M20 24h24"/>
                    <path d="M25 34h14"/>
                    <path d="M25 42h9"/>
                </svg>
            `;

        }


        if (
            value.includes("mie")
        ) {

            return `
                <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    stroke="#1f7a4d"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M13 22h38"/>
                    <path d="M16 22l3 30h26l3-30"/>
                    <path d="M20 31c6-6 12 6 18 0s10 0 10 0"/>
                    <path d="M21 40c6-6 12 6 18 0s10 0 10 0"/>
                </svg>
            `;

        }


        if (
            value.includes("telur")
        ) {

            return `
                <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    stroke="#1f7a4d"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M32 11c-8 0-16 14-16 25 0 11 7 17 16 17s16-6 16-17c0-11-8-25-16-25Z"/>
                </svg>
            `;

        }


        if (
            value.includes("minuman")
        ) {

            return `
                <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    stroke="#1f7a4d"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M22 11h20"/>
                    <path d="M24 11l2 40h12l2-40"/>
                    <path d="M25 21h14"/>
                    <path d="M28 31h8"/>
                </svg>
            `;

        }


        if (
            value.includes("bumbu")
        ) {

            return `
                <svg
                    viewBox="0 0 64 64"
                    width="54"
                    height="54"
                    fill="none"
                    stroke="#1f7a4d"
                    stroke-width="3"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                >
                    <path d="M18 20h28"/>
                    <path d="M21 20l3 31h16l3-31"/>
                    <path d="M25 14h14"/>
                    <path d="M27 34h10"/>
                </svg>
            `;

        }


        // DEFAULT ICON

        return `
            <svg
                viewBox="0 0 64 64"
                width="54"
                height="54"
                fill="none"
                stroke="#1f7a4d"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
            >
                <path d="M10 22h44"/>
                <path d="M14 22l3 30h30l3-30"/>
                <path d="M22 22a10 10 0 0 1 20 0"/>
                <path d="M22 34h20"/>
            </svg>
        `;

    }


    // ==========================
    // EMPTY STATE
    // ==========================

    function showEmptyState() {

        if (!productContainer) {
            return;
        }


        productContainer.innerHTML = `

            <div
                style="
                    grid-column:1/-1;
                    padding:65px 25px;
                    background:#fff;
                    border:1px solid #e7e5df;
                    border-radius:18px;
                    text-align:center;
                "
            >

                <div
                    style="
                        width:70px;
                        height:70px;
                        margin:0 auto 18px;
                        display:flex;
                        align-items:center;
                        justify-content:center;
                        background:#eaf7ef;
                        border-radius:50%;
                    "
                >

                    <svg
                        viewBox="0 0 24 24"
                        width="32"
                        height="32"
                        fill="none"
                        stroke="#1f7a4d"
                        stroke-width="1.8"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        aria-hidden="true"
                    >
                        <circle
                            cx="10.8"
                            cy="10.8"
                            r="6.8"
                        />

                        <path d="m16 16 4 4"/>

                    </svg>

                </div>


                <h3
                    style="
                        margin:0;
                        color:#173326;
                        font-size:20px;
                    "
                >
                    Produk tidak ditemukan
                </h3>


                <p
                    style="
                        max-width:420px;
                        margin:8px auto 20px;
                        color:#727b75;
                        font-size:13px;
                    "
                >
                    Coba gunakan kata kunci lain
                    atau pilih kategori yang berbeda.
                </p>


                <button
                    type="button"
                    id="resetFilter"
                    style="
                        display:inline-block;
                        padding:10px 18px;
                        background:#1f7a4d;
                        color:#fff;
                        border:none;
                        border-radius:10px;
                        font-size:12px;
                        font-weight:800;
                        cursor:pointer;
                    "
                >
                    Lihat Semua Produk
                </button>

            </div>

        `;


        const resetButton =
            document.getElementById(
                "resetFilter"
            );


        if (resetButton) {

            resetButton.addEventListener(
                "click",
                resetFilters
            );

        }

    }


    // ==========================
    // RESET FILTER
    // ==========================

    function resetFilters() {

        if (searchInput) {
            searchInput.value = "";
        }


        if (categoryFilter) {
            categoryFilter.value = "";
        }


        renderProducts();

    }


    // ==========================
    // MESSAGE
    // ==========================

    function showMessage(
        message,
        type = "loading"
    ) {

        if (!productMessage) {
            return;
        }


        productMessage.textContent =
            message;


        productMessage.style.display =
            "block";


        if (type === "error") {

            productMessage.style.background =
                "#f8d7da";

            productMessage.style.color =
                "#842029";

        } else if (type === "empty") {

            productMessage.style.background =
                "#fff3cd";

            productMessage.style.color =
                "#664d03";

        } else {

            productMessage.style.background =
                "#eaf7ef";

            productMessage.style.color =
                "#1f7a4d";

        }

    }


    // ==========================
    // HIDE MESSAGE
    // ==========================

    function hideMessage() {

        if (!productMessage) {
            return;
        }


        productMessage.style.display =
            "none";

    }


    // ==========================
    // ESCAPE HTML
    // ==========================

    function escapeHTML(value) {

        const div =
            document.createElement(
                "div"
            );


        div.textContent =
            value ?? "";


        return div.innerHTML;

    }


    // ==========================
    // SEARCH
    // ==========================

    if (searchInput) {

        searchInput.addEventListener(
            "input",
            renderProducts
        );

    }


    // ==========================
    // CATEGORY
    // ==========================

    if (categoryFilter) {

        categoryFilter.addEventListener(
            "change",
            renderProducts
        );

    }


    // ==========================
    // FORM
    // ==========================

    if (filterForm) {

        filterForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                renderProducts();

            }
        );

    }


    // ==========================
    // INITIAL LOAD
    // ==========================

    loadProducts();

});