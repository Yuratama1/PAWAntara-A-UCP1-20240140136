📄 Product Requirements Document (PRD)
Proyek: Website & REST API "Toko Sembako Ariesta" dengan Fitur Tanya AI
Dokumen 	PRD — UCP 1 Pemrograman Aplikasi Web (PAW)
Klien (fiktif) 	Toko Sembako Ariesta (UMKM Sembako & Kebutuhan Rumah Tangga)
Dosen Pengampu 	Ir. Asroni, S.T., M.Eng.
Asisten Dosen 	Rizki Ramadan, Reza Azhari
Status 	Final — Siap Dikerjakan
Versi 	1.0
1. Latar Belakang (Background)

Toko Sembako Ariesta adalah usaha milik Ibu Aries yang menjual beras, minyak goreng, gula, telur, dan kebutuhan pokok rumah tangga lainnya. Selama ini pelanggan memesan lewat WhatsApp, tapi Ibu Aries mulai kewalahan: stok dan harga sering berubah, sementara pertanyaan pelanggan yang masuk kebanyakan itu-itu saja — "gula sekilo berapa?", "masih ada beras 5kg?", "bisa antar ga?".

Ibu Aries ingin punya website toko yang datanya bisa ia kelola sendiri (tanpa minta bantuan programmer tiap kali stok/harga berubah), plus fitur "Tanya AI" yang bisa langsung menjawab pertanyaan umum pelanggan. Karena yang boleh mengubah stok/harga hanya Ibu Aries dan kasirnya — bukan sembarang pengunjung — dashboard admin harus dilindungi dengan sistem login. Tim engineering (mahasiswa) ditugaskan membangun aplikasi web full stack menggunakan Node.js + Express.js sebagai backend, lengkap dengan REST API, autentikasi login admin, dan endpoint khusus untuk fitur Tanya AI.

Karena integrasi API AI sungguhan (OpenAI/Anthropic/dsb) belum diajarkan di mata kuliah ini, balasan "AI" tetap berupa logika dummy yang berjalan di backend Express dan diakses lewat REST API — bukan API AI pihak ketiga.

Proyek dikerjakan dalam 2 sprint:

    Sprint 1 (in-class / lab) — Fokus: struktur semantic HTML/EJS, styling responsive, dan setup server Express dasar.
    Sprint 2 (take-home) — Fokus: REST API penuh (CRUD), integrasi Fetch API di frontend, middleware, dan penyimpanan data.

2. Tujuan (Objectives)

    Mahasiswa mampu menyusun struktur HTML5 semantik beserta form yang aksesibel.
    Mahasiswa mampu membangun layout responsif menggunakan CSS3 (Box Model, Flexbox, Grid, Media Query).
    Mahasiswa mampu memanfaatkan JavaScript untuk manipulasi DOM, event handling, dan operasi asynchronous (Promise/async-await) lewat Fetch API.
    Mahasiswa mampu membangun server dasar dengan Node.js dan Express.js, termasuk middleware dan static file serving.
    Mahasiswa mampu merancang dan mengimplementasikan REST API (GET, POST, PUT, DELETE) dengan kontrak endpoint dan format response JSON yang konsisten.
    Mahasiswa mampu menerapkan mekanisme autentikasi login sederhana untuk membatasi akses ke fitur admin.

3. Ruang Lingkup (Scope)

In-scope:

    Aplikasi web full stack berbasis Express.js (server-rendered HTML/EJS atau HTML statis yang di-serve Express — bebas dipilih).
    REST API penuh untuk CRUD data produk sembako (GET, POST, PUT, DELETE).
    Sistem login admin/kasir — hanya user yang sudah login yang boleh mengakses dashboard dan mengubah data produk (tambah/edit/hapus/update stok).
    Endpoint khusus untuk fitur "Tanya AI" dengan logika balasan dummy di backend.
    Frontend mengonsumsi API menggunakan Fetch API (async/await), tanpa reload halaman untuk update data.
    Penyimpanan data bebas dipilih: array/objek in-memory, SQLite, atau PostgreSQL.
    Styling bebas dipilih: Tailwind CDN atau Bootstrap CDN.

Out-of-scope:

    Integrasi API AI sungguhan (OpenAI, Anthropic, Gemini, dsb) — dilarang, karena materi integrasi API pihak ketiga belum diajarkan. Tidak perlu API key apa pun untuk fitur AI.
    Registrasi akun publik — tidak perlu ada fitur "daftar akun" untuk pelanggan. Akun admin/kasir cukup dibuat manual (hardcode/seed data), bukan self-register.
    Role-based access rumit (multi-level permission, dsb) — cukup satu jenis akun "admin/kasir" yang bisa login, tidak perlu berjenjang.
    Wireframe/prototyping di Figma — tidak diwajibkan untuk tugas ini, langsung boleh mulai coding.
    Deployment ke hosting production (GitHub Pages tidak bisa menjalankan backend Node.js — lihat Bagian 8 soal cara pengumpulan).

4. User Persona & User Story

Persona 1 — Rendi (Pelanggan): mengakses halaman publik untuk cek stok, harga, dan bertanya ke fitur AI.

    Sebagai calon pembeli,
    saya ingin melihat daftar produk sembako yang selalu ter-update dan bertanya seputar stok/ongkir lewat chat,
    agar saya tidak perlu menunggu balasan WhatsApp manual sebelum memutuskan belanja.

Persona 2 — Ibu Aries (Admin/Kasir): login ke dashboard untuk mengelola data produk secara aman.

    Sebagai pemilik toko sekaligus kasir,
    saya ingin login dulu sebelum bisa menambah, mengubah harga/stok, atau menghapus produk lewat dashboard,
    agar data toko saya tidak bisa diubah sembarangan oleh pengunjung biasa.

5. Functional Requirements
ID	Requirement	Sprint
FR-01 	Struktur HTML/EJS semua halaman memakai elemen semantik (header, nav, main, section, article, aside, footer sesuai konteks) 	1
FR-02 	Form (tambah produk & Tanya AI) menggunakan elemen form lengkap (input, label, select/textarea jika relevan) dengan label terhubung ke input serta atribut aksesibilitas dasar (alt, aria-label bila perlu) 	1
FR-03 	Layout responsif memakai Flexbox dan/atau CSS Grid, dengan minimal 2 breakpoint media query (mobile & desktop), termasuk navbar dengan menu hamburger fungsional (JS) di layar mobile 	1
FR-04 	Server Express.js berjalan dengan view engine EJS + partials (navbar/footer) serta static assets (CSS/JS/gambar) lewat express.static 	1
FR-05 	Route dinamis GET /produk/:id menampilkan detail 1 produk berdasarkan parameter URL, menangani kasus ID tidak ditemukan dengan wajar 	1
FR-06 	Fitur filter/pencarian produk lewat query string (?kategori= / ?search=) diproses di server 	1
FR-07 	Endpoint GET /api/products (read-only) mengembalikan data produk dummy dalam format JSON 	1
FR-08 	Minimal 1 middleware custom (contoh: request logger) diterapkan di server 	1 & 2
FR-09 	REST API CRUD produk lengkap: GET semua & per-ID (publik/tanpa login), POST tambah, PUT update, DELETE hapus (wajib login) 	2
FR-10 	Halaman Login untuk admin/kasir menggunakan username & password 	2
FR-11 	Endpoint POST /api/login memvalidasi kredensial dan membuat sesi login (session/cookie atau JWT) 	2
FR-12 	Middleware auth melindungi halaman dashboard serta endpoint POST/PUT/DELETE produk — hanya bisa diakses jika sudah login 	2
FR-13 	Tersedia fitur Logout yang menghapus sesi login/token 	2
FR-14 	Endpoint POST /api/chat menerima pertanyaan & mengembalikan balasan AI dummy hasil logika di backend (keyword matching/kondisi, bukan API eksternal) 	2
FR-15 	Semua response API konsisten dalam format JSON (contoh: { status, message, data }) 	1 & 2
FR-16 	Frontend mengonsumsi API dengan Fetch API + async/await, memperbarui DOM tanpa reload halaman penuh 	2
FR-17 	Event handling JS pada form (submit/click) termasuk preventDefault() dan validasi input dasar sebelum request dikirim 	2
FR-18 	Data produk & akun admin tersimpan persisten selama server berjalan, menggunakan array in-memory, SQLite, atau PostgreSQL (bebas pilih) 	2
6. Non-Functional Requirements

    Runtime & framework wajib: Node.js + Express.js.
    View engine: bebas — HTML statis (di-serve Express) atau EJS.
    Styling: bebas — Tailwind CDN atau Bootstrap CDN (pilih salah satu, jangan campur berantakan).
    Database: bebas — array/objek in-memory, SQLite, atau PostgreSQL. Sesuaikan dengan kenyamanan & waktu pengerjaan.
    Autentikasi: bebas mekanisme — session-based (contoh: express-session) atau token sederhana (contoh: JWT) — yang penting dashboard & endpoint mutasi data terlindungi.
    Kredensial admin: boleh hardcode/seed data (contoh: username admin, password admin123) — tidak perlu fitur "lupa password" atau registrasi.
    Password disarankan tidak disimpan dalam bentuk teks polos — gunakan bcrypt untuk hashing jika memungkinkan (nilai plus, bukan wajib mutlak untuk level tugas ini).
    Development tool: disarankan menggunakan nodemon selama development (script npm run dev) agar server auto-restart saat kode berubah.
    Tanpa AI API eksternal: tidak ada pemanggilan API AI pihak ketiga, tidak ada API key.
    Struktur project rapi: pisahkan folder routes/, views/ (jika pakai EJS) atau public/ (jika HTML statis), public/css, public/js.
    package.json wajib memiliki script start dan dev (nodemon) yang berfungsi.

7. Kontrak REST API (Acuan Minimal)

Gunakan tabel ini sebagai acuan endpoint minimal. Nama field boleh disesuaikan, tapi method & struktur response harus konsisten.
Method	Endpoint	Deskripsi	Akses	Contoh Response (JSON)
POST 	/api/login 	Login admin/kasir dengan username & password 	Publik 	{ "status": "success", "message": "Login berhasil" }
POST 	/api/logout 	Logout, menghapus sesi login 	Login 	{ "status": "success", "message": "Logout berhasil" }
GET 	/api/products 	Ambil seluruh data produk sembako 	Publik 	{ "status": "success", "data": [ { "id": 1, "name": "Beras 5kg", "price": 65000, "stock": 20 } ] }
GET 	/api/products/:id 	Ambil satu produk berdasarkan ID 	Publik 	{ "status": "success", "data": { "id": 1, "name": "Beras 5kg", "price": 65000, "stock": 20 } }
POST 	/api/products 	Tambah produk baru 	Login 	{ "status": "success", "message": "Produk ditambahkan", "data": { "id": 4, "name": "Minyak Goreng 2L", "price": 34000, "stock": 15 } }
PUT 	/api/products/:id 	Update produk (harga/stok) berdasarkan ID 	Login 	{ "status": "success", "message": "Produk diperbarui", "data": { "id": 1, "name": "Beras 5kg", "price": 68000, "stock": 12 } }
DELETE 	/api/products/:id 	Hapus produk berdasarkan ID 	Login 	{ "status": "success", "message": "Produk dihapus" }
POST 	/api/chat 	Kirim pertanyaan, terima balasan AI dummy dari backend 	Publik 	{ "status": "success", "data": { "reply": "Toko kami buka setiap hari jam 07.00 - 20.00!" } }

Endpoint dengan akses Login wajib menolak request dari user yang belum login, contoh response: { "status": "error", "message": "Unauthorized, silakan login terlebih dahulu" } dengan HTTP status code 401.
8. Ketentuan Repository & Version Control (Berlaku untuk Sprint 1 & Sprint 2)

Sprint 1 dan Sprint 2 dikumpulkan dalam satu repository GitHub yang sama — perbedaannya cukup ditandai lewat commit, bukan repo terpisah atau upload file zip.
📁 Penamaan Repository
Format	Contoh
PAWAntara-[Kelas]-UCP1-[NIM] 	PAWAntara-A-UCP1-20220140020

Repo dibuat public di GitHub sejak awal Sprint 1, lalu dipakai terus sampai Sprint 2 selesai.
📝 Format Commit Message

Setiap commit wajib diawali label sprint, format:
Format	Contoh
Sprint1-[pesan singkat] 	Sprint1-init express project & nodemon setup
Sprint1-add semantic HTML for beranda page
Sprint1-add produk page structure
Sprint1-add responsive layout with flexbox/grid
Sprint1-add basic express route & static file serving
Sprint2-[pesan singkat] 	Sprint2-add products CRUD REST API
Sprint2-add login page & auth middleware
Sprint2-add chat dummy endpoint
Sprint2-connect frontend to API with fetch async/await
Sprint2-add custom logging middleware
Sprint2-add sqlite/array data persistence
📌 Ketentuan Tambahan

    Commit minimal 3 kali per sprint (bertahap, bukan 1 commit besar di akhir) — mencerminkan progres pengerjaan asli.
    Pesan commit ditulis singkat, jelas, dan mencerminkan perubahan yang dilakukan (hindari pesan seperti Sprint1-update atau Sprint2-fix tanpa konteks).
    Riwayat commit (commit history) akan dicek asisten sebagai bagian dari penilaian proses, bukan cuma hasil akhir.
    Branch utama cukup main — tidak perlu branching kompleks untuk tugas ini.
    node_modules/ wajib di-ignore lewat .gitignore — jangan sampai ter-push ke repo.
    Repo minimal berisi: package.json, folder routes/, halaman frontend (HTML/EJS), file API/data (array/SQLite/PostgreSQL config), dan README.md.
    Karena aplikasi ini full stack (backend Node.js), tidak bisa di-deploy ke GitHub Pages. Yang dikumpulkan cukup link repository — bukan link live demo. (Opsional/nilai plus: boleh deploy ke layanan seperti Render/Railway jika ingin, tapi tidak wajib.)

📘 Isi Minimal README.md

    Nama & NIM mahasiswa.
    Deskripsi singkat project.
    Cara menjalankan project secara lokal, contoh:
    npm install
    npm run dev (menjalankan server via nodemon)
    Daftar endpoint API beserta method & deskripsinya (boleh salin dari Bagian 7).
    Penjelasan mengenai tampilan(ui) dan deskripsinya

9. SPRINT 1 — In-Class Assignment (Lab)

Catatan: Ujian ini bersifat open internet — boleh cari referensi dokumentasi, contoh kode, StackOverflow, dsb. Yang tetap dilarang hanya satu: memanggil/mengintegrasikan API AI eksternal (ChatGPT, Gemini, dsb) ke dalam fitur aplikasi, karena materi tersebut belum diajarkan. Karena boleh buka internet, soal Sprint 1 kali ini dibuat sedikit lebih menantang dari versi dasar.
📝 Soal

Ibu Aries minta tim membangun fondasi website tokonya dulu: struktur halaman, styling responsif, dan server Express dasar yang bisa menyajikan halaman-halaman tersebut secara dinamis. Data produk asli lewat REST API penuh (CRUD + auth) baru dikerjakan di sesi berikutnya — tapi pondasi routing dinamis dan endpoint baca data sudah harus jalan dari sekarang.

Kerjakan tahapan berikut:

    Inisialisasi project Node.js + Express (npm init, npm install express, npm install --save-dev nodemon), buat script dev di package.json.
    Gunakan EJS sebagai view engine (wajib di Sprint 1 ini, bukan HTML statis) dan pecah bagian yang berulang (navbar & footer) menjadi partials (partials/navbar.ejs, partials/footer.ejs) yang di-include di setiap halaman — jangan copy-paste HTML yang sama berkali-kali.
    Siapkan data produk dummy dalam bentuk array of object di file terpisah (contoh: data/products.js), minimal 6 produk sembako dengan field id, name, category, price, stock.
    Buat halaman-halaman berikut lewat route Express (server-side render pakai EJS, data diambil dari array dummy di atas):
        Beranda (GET /) — hero section + preview beberapa produk.
        Produk (GET /produk) — daftar semua produk dalam bentuk card/table.
        Detail Produk (GET /produk/:id) — route dinamis, tampilkan detail 1 produk berdasarkan id dari URL. Kalau id tidak ditemukan, tampilkan halaman/pesan "Produk tidak ditemukan" (bukan error server yang crash).
        Tanya AI (GET /tanya-ai) — tampilan chat + form, belum perlu logic balasan.
    Tambahkan fitur filter produk lewat query string di halaman Produk, contoh: GET /produk?kategori=sembako atau GET /produk?search=beras — logic filter dilakukan di server (req.query), bukan di frontend.
    Buat 1 endpoint REST API read-only: GET /api/products yang mengembalikan seluruh data produk dummy dalam format JSON (lihat format di Bagian 7) — ini jadi fondasi buat REST API penuh di Sprint 2.
    Susun setiap halaman dengan elemen semantik HTML5 yang sesuai, serta form yang aksesibel (label terhubung ke input) pada form Tanya AI.
    Terapkan layout responsif menggunakan Flexbox/Grid + media query, dengan styling bebas Tailwind CDN atau Bootstrap CDN. Navbar wajib punya menu hamburger di mobile yang bisa dibuka/tutup pakai vanilla JS (addEventListener + toggle class), bukan cuma disembunyikan pakai CSS doang.

📌 Ketentuan

    Server harus benar-benar berjalan lewat Express (node app.js atau npm run dev) — bukan dibuka langsung sebagai file HTML dari file explorer.
    Static assets (CSS/JS/gambar) disajikan lewat express.static, bukan ditulis inline semua.
    Wajib EJS + partials di Sprint 1 ini — HTML statis tanpa templating tidak diterima untuk sesi ini.
    Struktur HTML5 wajib semantik (header, nav, main, section, article, aside, footer sesuai konteks) di setiap halaman.
    Navbar identik (lewat partial) di seluruh halaman, dengan tautan yang benar-benar berfungsi berpindah antar halaman, termasuk versi mobile (hamburger).
    Route dinamis /produk/:id wajib menangani kasus ID tidak valid/tidak ditemukan dengan rapi (tidak crash / tidak undefined polos di layar).
    Endpoint GET /api/products wajib bisa diuji langsung lewat browser atau Postman dan mengembalikan JSON valid.
    Minimal 2 breakpoint media query (mobile & desktop) diterapkan.
    Boleh pakai Tailwind CDN atau Bootstrap CDN — pilih salah satu.
    Belum wajib ada database sungguhan atau autentikasi di sesi ini — array dummy di file terpisah sudah cukup, itu baru "naik level" ke SQLite/PostgreSQL + login di Sprint 2.
    Dilarang memanggil API AI eksternal apa pun.
    Output: kode di-push ke repository GitHub PAWAntara-[Kelas]-UCP1-[NIM] milikmu, dengan commit berlabel Sprint1-... (lihat Bagian 8), langsung setelah sesi lab berakhir.

✅ Definition of Done (Sprint 1)

    Server Express berjalan tanpa error lewat npm run dev, memakai EJS + partials (navbar/footer tidak diulang manual di tiap file).
    Minimal 4 route halaman (Beranda, Produk, Detail Produk dinamis, Tanya AI) tersedia dan dapat diakses bolak-balik lewat navbar tanpa link rusak.
    /produk/:id menampilkan data yang sesuai untuk ID valid, dan menampilkan pesan wajar untuk ID yang tidak ada.
    Filter produk lewat query string (?kategori= atau ?search=) terbukti mengubah hasil yang ditampilkan.
    GET /api/products mengembalikan response JSON yang valid dan sesuai format di Bagian 7.
    Navbar mobile (hamburger) bisa dibuka/ditutup dan berfungsi dengan JS, bukan sekadar CSS media query show/hide.
    Tampilan responsif — tidak rusak di lebar layar mobile maupun desktop.
    Repository PAWAntara-[Kelas]-UCP1-[NIM] sudah dibuat public dan berisi minimal 3 commit berlabel Sprint1-....

10. SPRINT 2 — Take-Home Assignment
📝 Soal

Fondasi website sudah siap. Sekarang Ibu Aries minta websitenya benar-benar "hidup": ia mau bisa tambah/ubah/hapus produk beserta harga dan stoknya sendiri lewat dashboard, tanpa minta bantuan programmer tiap kali ada perubahan harga sembako. Pelanggan juga harus bisa benar-benar kirim pertanyaan dan dapat balasan real-time dari server — meskipun "otak" AI-nya masih simulasi buatan sendiri (dummy), bukan API AI sungguhan.

Lanjutkan project dari Sprint 1 dengan menambahkan:

    Sistem login untuk admin/kasir: halaman login (username & password), endpoint POST /api/login, dan penyimpanan sesi (session/cookie atau token).
    Middleware auth yang melindungi halaman dashboard dan endpoint POST/PUT/DELETE produk — kalau belum login, tolak akses (redirect ke halaman login untuk halaman, atau response 401 untuk API).
    Fitur logout yang menghapus sesi login.
    Lengkapi REST API CRUD produk sesuai kontrak di Bagian 7 — endpoint GET /api/products sudah ada dari Sprint 1, sekarang tambahkan POST/PUT/DELETE (wajib login) dan pastikan data yang dibaca GET berasal dari sumber yang sama dengan yang diubah endpoint mutasi (bukan dua sumber data terpisah).
    Dashboard untuk admin (Ibu Aries) menambah, mengedit (termasuk update stok & harga), dan menghapus produk lewat form — memanggil API di atas lewat Fetch API, dan hanya bisa dibuka setelah login.
    Halaman Produk di sisi publik mengambil data dari GET /api/products secara dinamis (bukan data hardcode lagi) — halaman ini tetap bisa diakses tanpa login.
    Endpoint POST /api/chat — logika balasan dummy (keyword matching / if-else / random dari array) diproses di backend, dikirim balik sebagai JSON. Contoh keyword yang bisa direspons: jam buka, ongkir/antar, cara pembayaran, ketersediaan stok.
    Halaman Tanya AI memanggil endpoint tersebut lewat Fetch API (async/await), menampilkan bubble chat pelanggan & balasan AI secara dinamis di DOM.
    Minimal 1 middleware custom lain di luar auth (contoh: logger yang mencatat method + endpoint + waktu setiap request masuk ke terminal).
    Validasi input dasar di frontend (JS) sebelum request dikirim (contoh: cegah submit form kosong, termasuk form login).
    Data produk dan akun admin disimpan menggunakan array in-memory, SQLite, atau PostgreSQL (pilih salah satu).

📌 Ketentuan

    Seluruh komunikasi frontend-backend wajib lewat Fetch API dengan async/await (bukan reload halaman biasa/form action tradisional untuk operasi CRUD & chat).
    Response API konsisten format JSON sesuai contoh di Bagian 7.
    Gunakan HTTP method yang sesuai secara semantik (jangan semua pakai POST) — GET untuk ambil data, POST untuk tambah, PUT untuk update, DELETE untuk hapus.
    Endpoint GET /api/products dan GET /api/products/:id tetap bisa diakses tanpa login (pelanggan cuma lihat, gak ubah). Endpoint POST/PUT/DELETE produk wajib dicek status login-nya di server (bukan cuma disembunyikan di frontend saja — kalau di-hit langsung lewat Postman tanpa login, tetap harus ditolak).
    Password admin jangan hardcode plain text langsung dibandingkan tanpa proteksi kalau memungkinkan — disarankan pakai bcrypt, tapi jika waktu terbatas, minimal jangan taruh password di file yang ke-commit tanpa disamarkan (boleh pakai .env).
    Tetap dilarang menggunakan API AI eksternal apa pun (OpenAI/Anthropic/Gemini/dsb) — logika balasan AI 100% buatan sendiri di backend Express.
    Lanjutkan commit di repository yang sama dengan Sprint 1 (PAWAntara-[Kelas]-UCP1-[NIM]), berlabel Sprint2-... (lihat Bagian 8) — bukan repo baru.
    nodemon disarankan aktif selama development lewat script npm run dev.
    Pastikan node_modules/ dan file .env (jika ada) tidak ikut ter-push (cek .gitignore).
    Pengumpulan di Moodle berupa: link repository GitHub (sama seperti Sprint 1) yang sudah berisi seluruh commit Sprint 1 & Sprint 2, serta README lengkap sesuai Bagian 8 (termasuk kredensial akun admin untuk keperluan pengecekan asisten).

✅ Definition of Done (Sprint 2)

    Halaman login berfungsi — login dengan kredensial benar berhasil masuk, kredensial salah ditolak dengan pesan error.
    Dashboard tidak bisa diakses sebelum login (baik lewat URL langsung maupun lewat API).
    Fitur logout berhasil menghapus sesi, dan setelah logout dashboard tidak bisa diakses lagi tanpa login ulang.
    Semua endpoint CRUD produk berfungsi dan bisa diuji (manual lewat dashboard, atau lewat Postman/Thunder Client) — endpoint mutasi (POST/PUT/DELETE) terbukti menolak request tanpa sesi login.
    Dashboard admin bisa tambah/edit/hapus produk (termasuk stok & harga), dan perubahan langsung terlihat di halaman Produk publik tanpa restart server.
    Fitur Tanya AI mengirim pertanyaan ke POST /api/chat dan menampilkan balasan dari server (bukan hardcode di frontend saja).
    Minimal 1 middleware custom (selain auth) aktif dan terbukti berjalan (terlihat di log terminal saat request masuk).
    Validasi input dasar mencegah submit kosong, baik di form login, form produk, maupun form Tanya AI.
    Server dapat dijalankan ulang dari nol oleh orang lain hanya dengan npm install lalu npm run dev, mengikuti instruksi di README.
    Repository berisi total minimal 6 commit (≥3 Sprint1-... + ≥3 Sprint2-...).

11. Rubrik Penilaian (Ringkas)
Komponen	Bobot
Struktur HTML semantik, EJS partials, & aksesibilitas form 	10%
Styling & responsivitas (Flexbox/Grid, media query, hamburger menu JS) 	10%
Setup Express (routing dinamis, query filter, middleware, static file serving) 	15%
Implementasi REST API (CRUD, kontrak endpoint, format response JSON) 	25%
Autentikasi & proteksi endpoint (login, middleware auth) 	15%
Integrasi frontend-backend (Fetch API, DOM update, validasi) 	15%
Kerapian repo, commit history, & README 	10%
12. Timeline
Tahap	Kapan	Output
Sprint 1 	Sesi lab (±100 menit) 	Commit Sprint1-... ke repo PAWAntara-[Kelas]-UCP1-[NIM]
Sprint 2 	Take-home 	Commit Sprint2-... di repo yang sama, REST API & dashboard berfungsi penuh
Deadline final 	(isi sesuai jadwal kelas) 	Link repository GitHub dikumpulkan di Moodle