# Toko Sembako Ariesta

Website & REST API **Toko Sembako Ariesta** dengan fitur **Tanya AI Dummy**, autentikasi admin, dashboard pengelolaan produk, dan REST API CRUD menggunakan Node.js dan Express.js.

## 👨‍💻 Identitas Mahasiswa

| Data        | Keterangan                     |
| ----------- | ------------------------------ |
| Nama        | **Yuratama Fadhilah Nugroho**  |
| NIM         | **20240140136**                |
| Mata Kuliah | Pemrograman Aplikasi Web (PAW) |
| UCP         | UCP 1                          |
| Proyek      | Toko Sembako Ariesta           |

---

## 📌 Deskripsi Project

**Toko Sembako Ariesta** merupakan aplikasi web full stack untuk membantu pengelolaan toko sembako dan kebutuhan rumah tangga.

Aplikasi ini memungkinkan pelanggan untuk:

* Melihat daftar produk.
* Melihat detail produk.
* Melakukan pencarian produk.
* Melakukan filter berdasarkan kategori.
* Melihat harga dan stok produk.
* Menggunakan fitur **Tanya AI** untuk mendapatkan jawaban mengenai toko.

Sementara itu, admin/kasir dapat:

* Login ke sistem.
* Mengakses dashboard admin.
* Menambahkan produk.
* Mengubah data produk.
* Mengubah harga dan stok.
* Menghapus produk.
* Logout dari sistem.

Aplikasi dibangun menggunakan **Node.js + Express.js + EJS** dan menyediakan REST API untuk komunikasi antara frontend dan backend.

Fitur Tanya AI menggunakan **logika dummy yang diproses di backend**, bukan menggunakan API AI eksternal seperti OpenAI, Gemini, atau Anthropic.

---

## 🎯 Tujuan

Project ini dibuat untuk memenuhi kebutuhan UCP 1 Pemrograman Aplikasi Web dengan menerapkan:

* HTML5 Semantic.
* Responsive Web Design.
* Express.js.
* EJS Template Engine.
* REST API.
* CRUD.
* Authentication dan Session.
* Middleware.
* Fetch API.
* JavaScript async/await.
* Manipulasi DOM.
* Validasi form.
* Penyimpanan data selama server berjalan.

---

## 🛠️ Teknologi yang Digunakan

### Backend

* Node.js
* Express.js
* Express Session
* REST API

### Frontend

* EJS
* HTML5
* CSS3
* JavaScript
* Bootstrap

### Development

* Nodemon
* npm
* Git & GitHub

---

## 📁 Struktur Project

```text
PAWAntara-A-UCP1-[NIM]/
│
├── config/
│   ├── config.js
│   └── db.js
│
├── middleware/
│   ├── auth.js
│   ├── errorHandler.js
│   └── logger.js
│
├── models/
│   ├── admin.js
│   ├── index.js
│   └── products.js
│
├── public/
│   ├── css/
│   │   └── style.css
│   │
│   └── js/
│       ├── ai.js
│       ├── dashboard.js
│       ├── login.js
│       ├── products.js
│       └── script.js
│
├── routes/
│   ├── api.js
│   └── web.js
│
├── seeders/
│   └── seed.js
│
├── views/
│   ├── partials/
│   │   ├── footer.ejs
│   │   └── navbar.ejs
│   │
│   ├── ai.ejs
│   ├── dashboard.ejs
│   ├── detail.ejs
│   ├── home.ejs
│   ├── login.ejs
│   ├── notfound.ejs
│   └── products.ejs
│
├── .gitignore
├── app.js
├── package.json
├── package-lock.json
└── README.md
```

> Screenshot tampilan website diletakkan di bagian dokumentasi README dan **tidak menjadi bagian dari struktur folder project**.

---

# 🚀 Cara Menjalankan Project

## 1. Clone Repository

```bash
git clone https://github.com/Yuratama1/PAWAntara-A-UCP1-20240140136.git
```

Masuk ke folder project:

```bash
cd PAWAntara-A-UCP1-20240140136
```

## 2. Install Dependency

```bash
npm install
```

## 3. Jalankan Development Server

```bash
npm run dev
```

Server akan berjalan menggunakan Nodemon.

Jika ingin menjalankan menggunakan Node.js:

```bash
npm start
```

## 4. Buka Website

Buka browser dan akses:

```text
http://localhost:3000
```

---

# 🔐 Akun Admin

Akun admin digunakan untuk mengakses dashboard dan melakukan pengelolaan produk.

| Field    | Value                    |
| -------- | ------------------------ |
| Username | **[ISI USERNAME ADMIN]** |
| Password | **[ISI PASSWORD ADMIN]** |

> Sesuaikan bagian ini dengan kredensial yang benar-benar digunakan pada project.

---

# 🌐 Halaman Website

## 🏠 1. Beranda

URL:

```text
GET /
```

Halaman utama website Toko Sembako Ariesta yang menampilkan informasi toko dan beberapa produk.

---

## 🛒 2. Produk

URL:

```text
GET /produk
```

Menampilkan daftar produk sembako yang tersedia.

Halaman produk mendukung:

* Pencarian produk.
* Filter kategori.
* Informasi harga.
* Informasi stok.
* Detail produk.

Contoh pencarian:

```text
/produk?search=beras
```

Contoh filter kategori:

```text
/produk?kategori=Beras
```

---

## 📦 3. Detail Produk

URL:

```text
GET /produk/:id
```

Contoh:

```text
/produk/1
```

Menampilkan informasi detail berdasarkan ID produk.

Jika produk tidak ditemukan, aplikasi menampilkan halaman/pesan yang sesuai tanpa menyebabkan server crash.

---

## 🤖 4. Tanya AI

URL:

```text
GET /tanya-ai
```

Halaman Tanya AI memungkinkan pelanggan mengirim pertanyaan mengenai toko.

Pertanyaan dikirim menggunakan Fetch API ke backend dan mendapatkan balasan dari logika AI dummy.

---

## 🔐 5. Login

URL:

```text
GET /login
```

Digunakan oleh admin/kasir untuk masuk ke sistem.

Login menggunakan:

* Username.
* Password.
* Session.

---

## 📊 6. Dashboard Admin

URL:

```text
GET /dashboard
```

Dashboard hanya dapat diakses oleh user yang sudah login.

Admin dapat:

* Menambah produk.
* Mengedit produk.
* Mengubah harga.
* Mengubah stok.
* Menghapus produk.

Operasi CRUD dilakukan menggunakan Fetch API tanpa reload halaman penuh.

---

# 🔌 REST API

## Authentication

### POST `/api/login`

Melakukan login admin.

Request:

```json
{
  "username": "admin",
  "password": "admin123"
}
```

Response berhasil:

```json
{
  "status": "success",
  "message": "Login berhasil"
}
```

---

### POST `/api/logout`

Melakukan logout dan menghapus session.

Response:

```json
{
  "status": "success",
  "message": "Logout berhasil"
}
```

---

# 📦 Products API

### GET `/api/products`

Mengambil seluruh data produk.

**Akses:** Publik

Contoh response:

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "Beras Premium 5 Kg",
      "price": 78000,
      "stock": 25
    }
  ]
}
```

---

### GET `/api/products/:id`

Mengambil satu produk berdasarkan ID.

**Akses:** Publik

Contoh:

```text
GET /api/products/1
```

Response:

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Beras Premium 5 Kg",
    "price": 78000,
    "stock": 25
  }
}
```

---

### POST `/api/products`

Menambahkan produk baru.

**Akses:** Login

Contoh request:

```json
{
  "name": "Minyak Goreng 2L",
  "category": "Minyak Goreng",
  "price": 34000,
  "stock": 15
}
```

Response:

```json
{
  "status": "success",
  "message": "Produk ditambahkan",
  "data": {
    "id": 4,
    "name": "Minyak Goreng 2L",
    "category": "Minyak Goreng",
    "price": 34000,
    "stock": 15
  }
}
```

---

### PUT `/api/products/:id`

Mengubah data produk.

**Akses:** Login

Contoh:

```text
PUT /api/products/1
```

Request:

```json
{
  "name": "Beras Premium 5 Kg",
  "category": "Beras",
  "price": 68000,
  "stock": 12
}
```

Response:

```json
{
  "status": "success",
  "message": "Produk diperbarui",
  "data": {
    "id": 1,
    "name": "Beras Premium 5 Kg",
    "category": "Beras",
    "price": 68000,
    "stock": 12
  }
}
```

---

### DELETE `/api/products/:id`

Menghapus produk berdasarkan ID.

**Akses:** Login

Contoh:

```text
DELETE /api/products/1
```

Response:

```json
{
  "status": "success",
  "message": "Produk dihapus"
}
```

---

# 🤖 Chat API

### POST `/api/chat`

Endpoint untuk fitur Tanya AI.

**Akses:** Publik

Request:

```json
{
  "message": "Toko buka jam berapa?"
}
```

Response:

```json
{
  "status": "success",
  "data": {
    "reply": "Toko kami buka setiap hari jam 07.00 - 20.00!"
  }
}
```

Balasan diproses menggunakan logika dummy di backend berdasarkan keyword pertanyaan.

Tidak menggunakan API AI eksternal.

---

# 🔒 Authentication & Authorization

Aplikasi menggunakan middleware authentication untuk melindungi halaman dashboard dan endpoint yang melakukan perubahan data.

Endpoint yang membutuhkan login:

```text
POST   /api/products
PUT    /api/products/:id
DELETE /api/products/:id
```

Dashboard juga hanya dapat diakses setelah login.

Jika request API dilakukan tanpa login, server mengembalikan HTTP status:

```text
401 Unauthorized
```

Contoh response:

```json
{
  "status": "error",
  "message": "Anda harus login terlebih dahulu"
}
```

---

# 🧩 Middleware

Project menggunakan middleware custom untuk mendukung proses aplikasi.

## Authentication Middleware

Digunakan untuk mengecek apakah session admin tersedia sebelum memberikan akses ke dashboard atau endpoint CRUD.

## Logger Middleware

Digunakan untuk mencatat request yang masuk ke server, termasuk:

* Method.
* Endpoint.
* Waktu request.

Contoh log:

```text
[2026-08-14T...] GET /produk
[2026-08-14T...] POST /api/login
[2026-08-14T...] GET /api/products
```

---

# ⚡ Fetch API

Frontend menggunakan **Fetch API dengan async/await** untuk berkomunikasi dengan backend.

Implementasinya digunakan pada:

* Login.
* CRUD produk.
* Tanya AI.
* Pengambilan data produk.
* Logout.

Operasi CRUD dan chat dilakukan tanpa reload halaman penuh.

---

# ✅ Validasi Form

Validasi input dasar diterapkan pada form:

* Login.
* Tambah produk.
* Edit produk.
* Tanya AI.

Validasi dilakukan menggunakan JavaScript sebelum request dikirim ke server.

Form juga menggunakan:

```javascript
event.preventDefault();
```

untuk mencegah submit tradisional dan memungkinkan komunikasi menggunakan Fetch API.

---

# 📱 Responsive Design

Website dirancang agar dapat digunakan pada:

* Desktop.
* Tablet.
* Mobile.

Layout menggunakan Flexbox/Grid dan media query.

Navbar juga memiliki menu hamburger yang dapat dibuka dan ditutup menggunakan JavaScript pada perangkat mobile.

---

# 🖼️ Dokumentasi Tampilan Website

## 🏠 Beranda

> Tambahkan screenshot halaman Beranda di sini.

---

## 🛒 Halaman Produk

> Tambahkan screenshot halaman Produk di sini.

---

## 📦 Detail Produk

> Tambahkan screenshot halaman Detail Produk di sini.

---

## 🔐 Halaman Login

> Tambahkan screenshot halaman Login di sini.

---

## 📊 Dashboard Admin

> Tambahkan screenshot Dashboard Admin di sini.

---

## 🤖 Tanya AI

> Tambahkan screenshot halaman Tanya AI di sini.

---

# 📋 Functional Requirements yang Dipenuhi

| ID    | Fitur                     | Status |
| ----- | ------------------------- | ------ |
| FR-01 | HTML/EJS Semantic         | ✅      |
| FR-02 | Form & Accessibility      | ✅      |
| FR-03 | Responsive + Hamburger    | ✅      |
| FR-04 | Express + EJS + Partials  | ✅      |
| FR-05 | Dynamic Product Detail    | ✅      |
| FR-06 | Search & Category Filter  | ✅      |
| FR-07 | GET Products API          | ✅      |
| FR-08 | Custom Middleware         | ✅      |
| FR-09 | REST API CRUD             | ✅      |
| FR-10 | Login Admin               | ✅      |
| FR-11 | POST `/api/login`         | ✅      |
| FR-12 | Authentication Middleware | ✅      |
| FR-13 | Logout                    | ✅      |
| FR-14 | Dummy AI Chat API         | ✅      |
| FR-15 | Consistent JSON Response  | ✅      |
| FR-16 | Fetch API + async/await   | ✅      |
| FR-17 | Form Validation           | ✅      |
| FR-18 | In-memory Data Storage    | ✅      |

---

# 📝 Version Control

Project dikerjakan dalam satu repository untuk Sprint 1 dan Sprint 2.

Commit menggunakan format:

```text
Sprint1-[pesan perubahan]
Sprint2-[pesan perubahan]
```

Contoh:

```text
Sprint1-init express project & nodemon setup
Sprint1-add semantic HTML for beranda page
Sprint1-add responsive layout with flexbox/grid

Sprint2-add products CRUD REST API
Sprint2-add login page & auth middleware
Sprint2-add chat dummy endpoint
Sprint2-connect frontend to API with fetch async/await
Sprint2-add custom logging middleware
Sprint2-add project README documentation
```

Repository menggunakan branch utama:

```text
main
```

---

# ⚠️ Catatan

Project ini dibuat untuk kebutuhan akademik UCP 1 Pemrograman Aplikasi Web.

Fitur **Tanya AI hanya menggunakan logika dummy yang dibuat sendiri pada backend Express.js** dan tidak menggunakan API AI eksternal.

Tidak terdapat:

* OpenAI API.
* Gemini API.
* Anthropic API.
* API key AI eksternal.
* Registrasi akun pelanggan.
* Role-based permission yang kompleks.

---

# 📄 Status Project

**Status: Selesai — Sprint 1 & Sprint 2**

Project telah mencakup:

* Website Toko Sembako Ariesta.
* REST API CRUD produk.
* Authentication admin.
* Dashboard admin.
* Logout.
* Middleware authentication.
* Custom logger middleware.
* Fetch API.
* Validasi form.
* Tanya AI dummy.
* Search dan filter produk.
* Responsive design.
* Dokumentasi README.
