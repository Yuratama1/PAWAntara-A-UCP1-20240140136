document.addEventListener("DOMContentLoaded", () => {

    // ==========================
    // ELEMENT
    // ==========================

    const productForm =
        document.getElementById("productForm");

    const productId =
        document.getElementById("productId");

    const productName =
        document.getElementById("productName");

    const productCategory =
        document.getElementById("productCategory");

    const productPrice =
        document.getElementById("productPrice");

    const productStock =
        document.getElementById("productStock");

    const productList =
        document.getElementById("productList");

    const formTitle =
        document.getElementById("formTitle");

    const cancelButton =
        document.getElementById("cancelButton");

    const messageBox =
        document.getElementById("messageBox");

    const filterForm =
        document.getElementById("filterForm");

    const searchInput =
        document.getElementById("searchProduct");

    const categorySelect =
        document.getElementById("filterCategory");

    const resetButton =
        document.getElementById("resetFilter");

    const searchResultInfo =
        document.getElementById("searchResultInfo");


    // ==========================
    // DATA
    // ==========================

    let products = [];

    let filteredProducts = [];


    // ==========================
    // LOAD PRODUCTS
    // ==========================

    async function loadProducts() {

        try {

            const response =
                await fetch("/api/products");

            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal mengambil data produk"
                );

            }


            products =
                result.data || [];


            filteredProducts =
                [...products];


            renderCategories();

            renderProducts(filteredProducts);

            updateSearchInfo(
                filteredProducts.length,
                products.length
            );


        } catch (error) {

            console.error(
                "Load products error:",
                error
            );


            if (productList) {

                productList.innerHTML = `
                    <div
                        style="
                            padding:30px;
                            text-align:center;
                            color:#b91c1c;
                            background:#fff;
                            border:1px solid #fee2e2;
                            border-radius:12px;
                        "
                    >
                        Gagal mengambil data produk.
                    </div>
                `;

            }

        }

    }



    // ==========================
    // RENDER CATEGORIES
    // ==========================

    function renderCategories() {

        if (!categorySelect) {
            return;
        }


        const categories = [
            ...new Set(
                products
                    .map(product => product.category)
                    .filter(Boolean)
            )
        ];


        categorySelect.innerHTML = `
            <option value="">
                Semua Kategori
            </option>
        `;


        categories
            .sort()
            .forEach(category => {

                const option =
                    document.createElement("option");


                option.value =
                    category;


                option.textContent =
                    category;


                categorySelect.appendChild(
                    option
                );

            });

    }



    // ==========================
    // APPLY PRODUCT FILTER
    // ==========================

    function applyProductFilter() {

        const search =
            searchInput
                ? searchInput.value
                    .trim()
                    .toLowerCase()
                : "";


        const category =
            categorySelect
                ? categorySelect.value
                : "";


        filteredProducts =
            products.filter(product => {

                const productName =
                    String(
                        product.name || ""
                    ).toLowerCase();


                const productCategory =
                    String(
                        product.category || ""
                    );


                const matchesSearch =
                    !search ||
                    productName.includes(search);


                const matchesCategory =
                    !category ||
                    productCategory === category;


                return (
                    matchesSearch &&
                    matchesCategory
                );

            });


        // PENTING:
        // render hasil FILTER,
        // bukan semua products

        renderProducts(
            filteredProducts
        );


        updateSearchInfo(
            filteredProducts.length,
            products.length
        );

    }



    // ==========================
    // UPDATE SEARCH INFO
    // ==========================

    function updateSearchInfo(
        resultCount,
        totalCount
    ) {

        if (!searchResultInfo) {
            return;
        }


        const search =
            searchInput
                ? searchInput.value.trim()
                : "";


        const category =
            categorySelect
                ? categorySelect.value
                : "";


        if (!search && !category) {

            searchResultInfo.textContent =
                `Menampilkan semua produk (${totalCount} produk)`;

            return;

        }


        searchResultInfo.textContent =
            `Menampilkan ${resultCount} dari ${totalCount} produk`;

    }



    // ==========================
    // RENDER PRODUCTS
    // ==========================

    function renderProducts(
        productsToRender = products
    ) {

        productList.innerHTML = "";


        // Tidak ada produk sama sekali

        if (products.length === 0) {

            productList.innerHTML = `
                <div
                    style="
                        padding:30px;
                        text-align:center;
                        color:#6c757d;
                        background:#ffffff;
                        border:1px solid #e9ecef;
                        border-radius:12px;
                    "
                >
                    Belum ada produk.
                </div>
            `;

            return;

        }


        // Tidak ada hasil filter

        if (productsToRender.length === 0) {

            productList.innerHTML = `
                <div
                    style="
                        padding:35px;
                        text-align:center;
                        color:#6c757d;
                        background:#ffffff;
                        border:1px solid #e9ecef;
                        border-radius:12px;
                    "
                >

                    <div
                        style="
                            font-size:30px;
                            margin-bottom:10px;
                        "
                    >
                        🔍
                    </div>

                    <strong
                        style="
                            display:block;
                            margin-bottom:6px;
                            color:#343a40;
                        "
                    >
                        Produk tidak ditemukan
                    </strong>

                    <span
                        style="
                            font-size:13px;
                        "
                    >
                        Coba gunakan kata kunci atau kategori lain.
                    </span>

                </div>
            `;

            return;

        }



        // Render hasil

        productsToRender.forEach(
            (product) => {

                const item =
                    document.createElement("div");


                item.style.cssText = `
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:20px;
                    padding:18px;
                    margin-bottom:12px;
                    border:1px solid #e9ecef;
                    border-radius:12px;
                    background:#ffffff;
                `;


                item.innerHTML = `

                    <div>

                        <strong
                            style="
                                display:block;
                                margin-bottom:6px;
                            "
                        >
                            ${escapeHTML(
                                product.name
                            )}
                        </strong>


                        <span
                            style="
                                color:#6c757d;
                                font-size:14px;
                            "
                        >
                            ${escapeHTML(
                                product.category
                            )}
                        </span>


                        <div
                            style="
                                margin-top:8px;
                                font-size:14px;
                            "
                        >

                            Harga:

                            <strong>
                                Rp ${Number(
                                    product.price
                                ).toLocaleString("id-ID")}
                            </strong>

                            &nbsp; | &nbsp;

                            Stok:

                            <strong>
                                ${product.stock}
                            </strong>

                        </div>

                    </div>


                    <div
                        style="
                            display:flex;
                            gap:8px;
                            flex-shrink:0;
                        "
                    >

                        <button
                            type="button"
                            class="editButton"
                            data-id="${product.id}"
                            style="
                                border:none;
                                background:#ffc107;
                                color:#212529;
                                padding:8px 13px;
                                border-radius:7px;
                                cursor:pointer;
                                font-weight:600;
                            "
                        >
                            Edit
                        </button>


                        <button
                            type="button"
                            class="deleteButton"
                            data-id="${product.id}"
                            style="
                                border:none;
                                background:#dc3545;
                                color:#ffffff;
                                padding:8px 13px;
                                border-radius:7px;
                                cursor:pointer;
                                font-weight:600;
                            "
                        >
                            Hapus
                        </button>

                    </div>

                `;


                productList.appendChild(item);

            }
        );



        // ==========================
        // EDIT BUTTON
        // ==========================

        document
            .querySelectorAll(".editButton")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        editProduct(
                            Number(
                                button.dataset.id
                            )
                        );

                    }
                );

            });



        // ==========================
        // DELETE BUTTON
        // ==========================

        document
            .querySelectorAll(".deleteButton")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => {

                        deleteProduct(
                            Number(
                                button.dataset.id
                            )
                        );

                    }
                );

            });

    }



    // ==========================
    // SEARCH FORM
    // ==========================

    if (filterForm) {

        filterForm.addEventListener(
            "submit",
            (event) => {

                event.preventDefault();

                applyProductFilter();

            }
        );

    }



    // ==========================
    // ENTER SEARCH
    // ==========================

    if (searchInput) {

        searchInput.addEventListener(
            "keydown",
            (event) => {

                if (
                    event.key === "Enter"
                ) {

                    event.preventDefault();

                    applyProductFilter();

                }

            }
        );

    }



    // ==========================
    // CATEGORY CHANGE
    // ==========================

    if (categorySelect) {

        categorySelect.addEventListener(
            "change",
            () => {

                applyProductFilter();

            }
        );

    }



    // ==========================
    // RESET FILTER
    // ==========================

    if (resetButton) {

        resetButton.addEventListener(
            "click",
            () => {

                if (searchInput) {

                    searchInput.value =
                        "";

                }


                if (categorySelect) {

                    categorySelect.value =
                        "";

                }


                filteredProducts =
                    [...products];


                renderProducts(
                    filteredProducts
                );


                updateSearchInfo(
                    filteredProducts.length,
                    products.length
                );

            }
        );

    }



    // ==========================
    // ADD / UPDATE PRODUCT
    // ==========================

    productForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const name =
                productName.value.trim();


            const category =
                productCategory.value.trim();


            const price =
                Number(
                    productPrice.value
                );


            const stock =
                Number(
                    productStock.value
                );



            // ==========================
            // VALIDATION
            // ==========================

            if (
                !name ||
                !category
            ) {

                showMessage(
                    "Nama dan kategori wajib diisi.",
                    "error"
                );

                return;

            }


            if (
                Number.isNaN(price) ||
                price < 0
            ) {

                showMessage(
                    "Harga harus berupa angka yang valid.",
                    "error"
                );

                return;

            }


            if (
                Number.isNaN(stock) ||
                stock < 0
            ) {

                showMessage(
                    "Stok harus berupa angka yang valid.",
                    "error"
                );

                return;

            }



            const data = {
                name,
                category,
                price,
                stock
            };



            try {

                let response;


                // ==========================
                // UPDATE
                // ==========================

                if (productId.value) {

                    response =
                        await fetch(
                            `/api/products/${productId.value}`,
                            {
                                method: "PUT",
                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },
                                body:
                                    JSON.stringify(
                                        data
                                    )
                            }
                        );

                }


                // ==========================
                // ADD
                // ==========================

                else {

                    response =
                        await fetch(
                            "/api/products",
                            {
                                method: "POST",
                                headers: {
                                    "Content-Type":
                                        "application/json"
                                },
                                body:
                                    JSON.stringify(
                                        data
                                    )
                            }
                        );

                }



                const result =
                    await response.json();


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Gagal menyimpan produk"
                    );

                }



                showMessage(
                    result.message,
                    "success"
                );


                resetForm();


                await loadProducts();

            }


            catch (error) {

                console.error(
                    "Save product error:",
                    error
                );


                showMessage(
                    error.message,
                    "error"
                );

            }

        }
    );



    // ==========================
    // EDIT PRODUCT
    // ==========================

    function editProduct(id) {

        const product =
            products.find(
                item =>
                    item.id === id
            );


        if (!product) {
            return;
        }


        productId.value =
            product.id;


        productName.value =
            product.name;


        productCategory.value =
            product.category;


        productPrice.value =
            product.price;


        productStock.value =
            product.stock;


        formTitle.textContent =
            "Edit Produk";


        cancelButton.style.display =
            "inline-block";


        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });

    }



    // ==========================
    // DELETE PRODUCT
    // ==========================

    async function deleteProduct(id) {

        const product =
            products.find(
                item =>
                    item.id === id
            );


        if (!product) {
            return;
        }


        const confirmed =
            window.confirm(
                `Hapus produk "${product.name}"?`
            );


        if (!confirmed) {
            return;
        }



        try {

            const response =
                await fetch(
                    `/api/products/${id}`,
                    {
                        method: "DELETE"
                    }
                );


            const result =
                await response.json();


            if (!response.ok) {

                throw new Error(
                    result.message ||
                    "Gagal menghapus produk"
                );

            }


            showMessage(
                result.message,
                "success"
            );


            await loadProducts();

        }


        catch (error) {

            console.error(
                "Delete product error:",
                error
            );


            showMessage(
                error.message,
                "error"
            );

        }

    }



    // ==========================
    // RESET FORM
    // ==========================

    function resetForm() {

        productForm.reset();


        productId.value =
            "";


        formTitle.textContent =
            "Tambah Produk";


        cancelButton.style.display =
            "none";

    }


    cancelButton.addEventListener(
        "click",
        resetForm
    );



    // ==========================
    // MESSAGE
    // ==========================

    function showMessage(
        message,
        type
    ) {

        messageBox.textContent =
            message;


        messageBox.style.display =
            "block";


        if (type === "success") {

            messageBox.style.background =
                "#d1e7dd";


            messageBox.style.color =
                "#0f5132";

        }

        else {

            messageBox.style.background =
                "#f8d7da";


            messageBox.style.color =
                "#842029";

        }


        setTimeout(() => {

            messageBox.style.display =
                "none";

        }, 3500);

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
            value;


        return div.innerHTML;

    }



    // ==========================
    // INITIAL LOAD
    // ==========================

    loadProducts();

});