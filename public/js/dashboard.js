document.addEventListener("DOMContentLoaded", () => {

    const productForm = document.getElementById("productForm");
    const productId = document.getElementById("productId");
    const productName = document.getElementById("productName");
    const productCategory = document.getElementById("productCategory");
    const productPrice = document.getElementById("productPrice");
    const productStock = document.getElementById("productStock");
    const productList = document.getElementById("productList");
    const formTitle = document.getElementById("formTitle");
    const cancelButton = document.getElementById("cancelButton");
    const messageBox = document.getElementById("messageBox");

    let products = [];

    // ==========================
    // LOAD PRODUCTS
    // ==========================
    async function loadProducts() {

        try {

            const response = await fetch("/api/products");

            const result = await response.json();

            if (!response.ok) {
                throw new Error(
                    result.message || "Gagal mengambil data produk"
                );
            }

            products = result.data;

            renderProducts();

        } catch (error) {

            console.error("Load products error:", error);

            showMessage(
                error.message,
                "error"
            );
        }
    }

    // ==========================
    // RENDER PRODUCTS
    // ==========================
    function renderProducts() {

        productList.innerHTML = "";

        if (products.length === 0) {

            productList.innerHTML = `
                <div
                    style="
                        padding:20px;
                        text-align:center;
                        color:#6c757d;
                    "
                >
                    Belum ada produk.
                </div>
            `;

            return;
        }

        products.forEach((product) => {

            const item = document.createElement("div");

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
                        ${escapeHTML(product.name)}
                    </strong>

                    <span
                        style="
                            color:#6c757d;
                            font-size:14px;
                        "
                    >
                        ${escapeHTML(product.category)}
                    </span>

                    <div
                        style="
                            margin-top:8px;
                            font-size:14px;
                        "
                    >
                        Harga:
                        <strong>
                            Rp ${Number(product.price).toLocaleString("id-ID")}
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
        });

        document
            .querySelectorAll(".editButton")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => editProduct(
                        Number(button.dataset.id)
                    )
                );

            });

        document
            .querySelectorAll(".deleteButton")
            .forEach((button) => {

                button.addEventListener(
                    "click",
                    () => deleteProduct(
                        Number(button.dataset.id)
                    )
                );

            });
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
                Number(productPrice.value);

            const stock =
                Number(productStock.value);

            // Frontend validation
            if (!name || !category) {

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

                if (productId.value) {

                    response = await fetch(
                        `/api/products/${productId.value}`,
                        {
                            method: "PUT",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify(data)
                        }
                    );

                } else {

                    response = await fetch(
                        "/api/products",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type":
                                    "application/json"
                            },
                            body: JSON.stringify(data)
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

            } catch (error) {

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
                item => item.id === id
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
                item => item.id === id
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

        } catch (error) {

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

        productId.value = "";

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

        } else {

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
            document.createElement("div");

        div.textContent =
            value;

        return div.innerHTML;
    }

    // ==========================
    // INITIAL LOAD
    // ==========================
    loadProducts();

});