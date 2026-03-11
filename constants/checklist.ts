import { ChecklistCategory } from "@/types/inspection";

export const DEFAULT_CHECKLIST: ChecklistCategory[] = [
  {
    id: "legal",
    name: "Legalitas",
    weight: 0.3,
    icon: "FileCheck",
    items: [
      {
        id: "leg-1",
        question: "STNK (Surat Tanda Nomor Kendaraan) asli dan masih berlaku",
        tooltip:
          "Surat Tanda Nomor Kendaraan (STNK) adalah dokumen resmi bukti pendaftaran dan kepemilikan sah kendaraan bermotor di Indonesia yang diterbitkan Samsat (Polri, Dispenda, Jasa Raharja). \n\nPastikan STNK asli, bukan fotokopi, dan masa berlaku masih aktif.",
        riskIndicator: "critical",
      },
      {
        id: "leg-2",
        question:
          "Nomor rangka di STNK (Surat Tanda Nomor Kendaraan) cocok dengan mobil",
        tooltip:
          "Cara cek rangka mesin:\n\n1. Lihat nomor rangka di STNK (biasanya terdiri dari 17 karakter huruf dan angka).\n2. Cari nomor rangka di mobil (biasanya di ruang mesin, bawah kursi depan, atau pilar pintu).\n3. Pastikan nomor di mobil sama dengan di STNK dan ukirannya rapi.\n\nContoh nomor rangka: MHFCBA123JK456789.",
        riskIndicator: "critical",
      },
      {
        id: "leg-3",
        question:
          "Nomor mesin di STNK (Surat Tanda Nomor Kendaraan) cocok dengan mobil",
        tooltip:
          "Cara cek nomor mesin:\n\n1. Lihat nomor mesin di STNK.\n2. Buka kap mesin mobil.\n3. Cari nomor mesin yang terukir di blok mesin.\n4. Cocokkan huruf dan angka dengan STNK.\n5. Pastikan semuanya sama persis.\n\nNomor mesin biasanya terletak di blok mesin dekat sambungan ke transmisi atau di bagian samping mesin.",
        riskIndicator: "critical",
      },
      {
        id: "leg-4",
        question: "BPKB (Buku Pemilik Kendaraan Bermotor) asli tersedia",
        tooltip:
          "Buku Pemilik Kendaraan Bermotor (BPKB) adalah dokumen resmi yang diterbitkan oleh Satlantas Polri sebagai bukti sah kepemilikan kendaraan bermotor, baik mobil maupun motor. \n\nBPKB adalah bukti kepemilikan pastikan asli dan tidak gadai.",
        riskIndicator: "critical",
      },
      {
        id: "leg-5",
        question:
          "Nama pemilik STNK (Surat Tanda Nomor Kendaraan) atau BPKB (Buku Pemilik Kendaraan Bermotor) cocok dengan penjual",
        tooltip:
          "Lihat nama pemilik di STNK atau BPKB. Pastikan sesuai dengan identitas penjual. Jika berbeda, tanyakan alasan atau pastikan ada surat kuasa atau bukti jual beli.",
        riskIndicator: "high",
      },
      {
        id: "leg-6",
        question: "Pajak kendaraan tidak menunggak lebih dari 1 tahun",
        tooltip:
          "Contoh di STNK: Berlaku sampai 12-08-2025\n\nJika hari ini sudah lewat lebih dari 1 tahun dari tanggal tersebut, berarti pajak menunggak dan biasanya akan dikenakan denda.",
        riskIndicator: "high",
      },
      {
        id: "leg-7",
        question: "Tidak ada catatan tilang",
        tooltip:
          "Cara cek catatan tilang\n\nCek di aplikasi Samsat Online dengan memasukkan:\n1. Nomor Polisi (Plat Nomor)\n2. Nomor Rangka\n3. Nomor Mesin (data ada di STNK).",
        riskIndicator: "medium",
      },
      {
        id: "leg-8",
        question: "Faktur pembelian asli tersedia (jika mobil baru)",
        tooltip:
          "Faktur mobil adalah dokumen resmi bukti pembelian sah yang dikeluarkan oleh dealer atau Agen Tunggal Pemegang Merek (ATPM) saat pembelian kendaraan baru. \n\nFaktur asli menambah kepercayaan dan nilai jual kembali.",
        riskIndicator: "low",
      },
      {
        id: "leg-9",
        question: "Riwayat service tercatat (jika ada)",
        tooltip:
          "Riwayat servis mobil adalah catatan kronologis perawatan, perbaikan, dan penggantian komponen yang pernah dilakukan, biasanya tercantum dalam buku servis resmi, faktur, atau aplikasi bengkel. \n\nService record resmi menunjukkan perawatan teratur dan meningkatkan nilai kondisi mobil.",
        riskIndicator: "low",
      },
    ],
  },
  {
    id: "exterior",
    name: "Eksterior",
    weight: 0.2,
    icon: "Car",
    items: [
      {
        id: "ext-1",
        question: "Bodi mobil bebas dari goresan dan penyok",
        tooltip:
          "Periksa seluruh permukaan bodi mobil seperti pintu, kap mesin, dan bumper. \n\n1. Lihat mobil dari jarak sekitar 2–3 meter untuk memastikan permukaan bodi terlihat rata. Periksa di tempat terang agar goresan kecil mudah terlihat. \n\n2. Lihat dari sudut miring untuk melihat pantulan cahaya pada bodi mobil. Jika pantulan terlihat bergelombang atau tidak rata, kemungkinan ada penyok atau bekas perbaikan.",
        riskIndicator: "low",
      },
      {
        id: "ext-2",
        question: "Bodi mobil rata dan simetris",
        tooltip:
          "Periksa keselarasan bodi mobil seperti kap mesin, pintu, dan bagasi.\n\n1. Lihat celah antar panel (misalnya antara pintu dan bodi mobil).\n2. Pastikan celah terlihat lurus dan jaraknya hampir sama dari atas sampai bawah.\n3. Bandingkan sisi kiri dan kanan mobil untuk melihat apakah simetris.\n4. Ketuk bodi mobil dan jika bunyi:\nSuara Nyaring(ting): bukan bekas perbaikan\nSuara Berat(duk): bekas perbaikan/dempul\n5. Jika ada panel yang terlihat lebih masuk, menonjol, atau celah tidak sama, kemungkinan mobil pernah mengalami benturan atau perbaikan bodi.",
        riskIndicator: "medium",
      },
      {
        id: "ext-3",
        question: "Tidak ada tanda pengecatan ulang yang tidak rapi",
        tooltip:
          "Cara cek kerapian cat:\n\n1. Periksa bagian karet jendela, karet pintu, dan plastik di sekitar bodi mobil.\n2. Lihat apakah ada bintik atau bekas cat pada karet, lampu, atau trim plastik.\n3. Raba bagian tersebut dengan tangan, jika terasa kasar bisa jadi ada bekas cat.\n4. Jika ditemukan bekas cat di area yang seharusnya tidak dicat, kemungkinan mobil pernah dicat ulang setelah kerusakan.\n\n Pengecetan ulang bisa menutupi kerusakan akibat tabrakan.",
        riskIndicator: "high",
      },
      {
        id: "ext-4",
        question: "Kaca Lampu depan & belakang tidak retak/berembun/menguning",
        tooltip:
          "Periksa kondisi lampu depan (headlamp) dan lampu belakang mobil.\n\n1. Lihat permukaan kaca lampu apakah ada retakan, pecah, atau goresan besar.\n2. Periksa bagian dalam lampu, pastikan tidak ada embun atau air di dalamnya.\n3. Perhatikan apakah warna lampu terlihat jernih atau sudah menguning.\n4. Jika ada retakan atau embun di dalam lampu, kemungkinan lampu pernah rusak atau seal lampu sudah tidak rapat.\n\nLampu retak atau berembun menunjukkan kerusakan atau pemasangan tidak sempurna.",
        riskIndicator: "medium",
      },
      {
        id: "ext-5",
        question: "Kaca depan/belakang/samping tidak retak",
        tooltip:
          "Periksa kondisi semua kaca mobil seperti kaca depan, kaca belakang, dan kaca samping.\n\n1. Lihat permukaan kaca dari luar untuk memastikan tidak ada retakan panjang.\n2. Periksa apakah ada pecahan kecil seperti titik atau bintang pada kaca.\n3. Lihat kaca dari dalam mobil untuk memastikan tidak ada retakan yang sulit terlihat dari luar.\n4. Jika ditemukan retakan, kaca bisa menjadi lebih mudah pecah dan biasanya perlu diperbaiki atau diganti.\n\nRetakan kecil bisa membesar dan berbahaya saat berkendara.",
        riskIndicator: "medium",
      },
      {
        id: "ext-6",
        question: "Ban masih tebal dan tidak retak",
        tooltip:
          "Periksa kondisi ban mobil untuk memastikan masih aman digunakan.\n\n1. Lihat pola tapak ban (alur ban). Pastikan alurnya masih dalam dan tidak terlalu halus.\n2. Masukkan jari atau koin ke dalam alur ban untuk mengecek apakah masih cukup dalam.\n3. Periksa sisi samping ban apakah ada retakan, benjolan, atau sobekan.\n4. Jika alur ban sudah tipis atau terdapat retakan di sisi ban, ban sebaiknya segera diganti karena bisa berbahaya saat digunakan.\n\nPeriksa ketebalan alur ban dan retakan di dinding ban (sidewall).",
        riskIndicator: "high",
      },
      {
        id: "ext-7",
        question: "Velg tidak bengkok/retak",
        tooltip:
          "Periksa kondisi velg pada setiap roda mobil.\n\n1. Lihat bentuk velg dari depan untuk memastikan bentuknya masih bulat dan tidak penyok.\n2. Periksa apakah ada retakan pada permukaan velg.\n3. Perhatikan bagian pinggir velg, pastikan tidak ada bagian yang bengkok atau penyok.\n4. Jika velg terlihat bengkok atau retak, hal ini dapat mempengaruhi keseimbangan roda dan berbahaya saat mobil digunakan.\n\nVelg bengkok menyebabkan getaran dan tidak aman.",
        riskIndicator: "high",
      },
      {
        id: "ext-8",
        question: "Tidak ada tanda karat di kolong/roda",
        tooltip:
          "Periksa bagian kolong mobil dan area sekitar roda untuk memastikan tidak ada karat.\n\n1. Jongkok dan lihat bagian kolong mobil menggunakan senter atau di tempat yang terang.\n2. Periksa bagian rangka bawah, sekitar roda, dan suspensi.\n3. Perhatikan apakah ada warna coklat kemerahan yang menandakan karat.\n4. Jika terlihat karat tebal atau bagian logam yang rapuh, kemungkinan mobil pernah terkena air lama atau jarang dirawat.\n\nTanda karat berlebihan bisa menunjukkan mobil pernah terendam banjir.",
        riskIndicator: "critical",
      },
      {
        id: "ext-9",
        question: "Karet kaca (seal) masih lentur",
        tooltip:
          "Periksa kondisi karet di sekitar kaca depan, belakang, dan samping mobil.\n\n1. Lihat apakah karet kaca terlihat retak, kering, atau terlepas dari tempatnya.\n2. Tekan karet dengan jari secara perlahan.\n3. Pastikan karet terasa lentur atau elastis, tidak keras.\n4. Jika karet terasa keras, retak, atau sudah rusak, air bisa masuk ke dalam mobil saat hujan.\n\nKaret kaca yang kaku atau rusak menunjukkan mobil terpapar panas berlebihan atau tua",
        riskIndicator: "low",
      },
      {
        id: "ext-10",
        question: "Spion utuh dan berfungsi normal",
        tooltip:
          "Periksa kondisi spion kiri dan kanan mobil.\n\n1. Lihat kaca spion apakah ada retakan atau pecah.\n2. Pastikan spion terpasang dengan kuat dan tidak longgar.\n3. Coba atur posisi spion (manual atau elektrik) untuk memastikan masih bisa digerakkan.\n4. Pastikan kaca spion dapat memberikan pandangan yang jelas ke belakang.\n5. Jika spion retak, longgar, atau tidak bisa diatur, maka spion perlu diperbaiki atau diganti.",
        riskIndicator: "low",
      },
    ],
  },
  {
    id: "interior",
    name: "Interior",
    weight: 0.2,
    icon: "Armchair",
    items: [
      {
        id: "int-1",
        question: "Jok mobil tidak robek atau rusak",
        tooltip:
          "Periksa kondisi jok pada kursi depan dan belakang mobil.\n\n1. Lihat permukaan jok untuk memastikan tidak ada robekan, sobekan, atau lubang.\n2. Perhatikan bagian pinggir dan jahitan jok karena bagian ini sering mengalami kerusakan.\n3. Tekan jok dengan tangan untuk memastikan busa di dalamnya masih terasa empuk dan tidak kempes.\n4. Jika jok terlihat robek atau busanya sudah kempes, kemungkinan jok perlu diperbaiki atau diganti.",
        riskIndicator: "low",
      },
      {
        id: "int-2",
        question: "Dashboard tidak retak atau rusak",
        tooltip:
          "Periksa kondisi dashboard mobil di bagian depan kabin.\n\n1. Lihat permukaan dashboard apakah ada retakan atau pecah.\n2. Perhatikan apakah ada bagian yang terlihat meleleh, bergelombang, atau berubah bentuk.\n3. Sentuh permukaan dashboard untuk memastikan tidak lengket atau terlalu lembek.\n4. Jika dashboard retak atau berubah bentuk, biasanya disebabkan oleh panas matahari dalam waktu lama.\n\nDashboard retak atau lengket menunjukkan paparan panas berlebihan",
        riskIndicator: "medium",
      },
      {
        id: "int-3",
        question: "Semua tombol switch berfungsi",
        tooltip:
          "Periksa tombol-tombol di dalam kabin mobil seperti tombol power window, lampu, AC, dan lainnya.\n\n1. Nyalakan kontak mobil (posisi ON).\n2. Tekan satu per satu tombol seperti power window, lampu kabin, dan tombol lainnya.\n3. Perhatikan apakah tombol merespons dengan baik saat ditekan.\n4. Jika ada tombol yang tidak merespons atau macet, kemungkinan ada masalah pada saklar atau kelistrikan.",
        riskIndicator: "medium",
      },
      {
        id: "int-4",
        question: "Tidak ada bau tidak sedap di dalam mobil",
        tooltip:
          "Periksa bau di dalam kabin mobil saat pintu dibuka.\n\n1. Buka pintu mobil dan cium udara di dalam kabin.\n2. Perhatikan apakah ada bau apek seperti lembap atau bau jamur.\n3. Periksa apakah ada bau bensin, oli, atau bau mesin yang tidak normal.\n4. Jika terdapat bau apek, bisa jadi interior pernah terkena air atau lembap. Jika ada bau bensin atau mesin, kemungkinan ada kebocoran atau masalah pada sistem kendaraan.\n\nBau aneh bisa menunjukkan kebocoran, mobil terbakar, atau banjir",
        riskIndicator: "critical",
      },
      {
        id: "int-5",
        question: "Karpet kering dan tidak berjamur",
        tooltip:
          "Periksa kondisi karpet di lantai mobil.\n\n1. Lihat permukaan karpet apakah terlihat kering dan bersih.\n2. Sentuh karpet dengan tangan untuk memastikan tidak lembap atau basah.\n3. Perhatikan apakah ada noda, jamur, atau bau apek pada karpet.\n4. Jika karpet terasa lembap atau berjamur, kemungkinan mobil pernah terkena air atau banjir.\n\nKarpet basah atau berjamur adalah tanda klasik mobil bekas banjir",
        riskIndicator: "critical",
      },
      {
        id: "int-6",
        question: "Atap bagian dalam mobil tidak kotor atau robek",
        tooltip:
          "Periksa kondisi atap bagian dalam mobil.\n\n1. Lihat permukaan atap apakah ada noda kotor, bekas air, atau perubahan warna.\n2. Perhatikan apakah ada robekan atau bagian kain yang terlepas.\n3. Sentuh bagian plafon secara perlahan untuk memastikan masih terpasang dengan baik.\n4. Jika atap kotor parah, robek, atau terlihat turun, kemungkinan pernah terkena air atau sudah lama tidak dirawat.",
        riskIndicator: "low",
      },
      {
        id: "int-7",
        question: "Sabuk pengaman berfungsi dan tidak robek",
        tooltip:
          "Periksa kondisi sabuk pengaman (seatbelt) pada setiap kursi.\n\n1. Tarik seatbelt perlahan untuk memastikan sabuk bisa keluar dengan lancar.\n2. Periksa kain seatbelt apakah ada robekan, sobekan, atau bagian yang sudah tipis.\n3. Coba pasang seatbelt ke penguncinya sampai terdengar bunyi 'klik'.\n4. Tarik sedikit seatbelt setelah terpasang untuk memastikan kunci bekerja dengan baik.\n5. Jika seatbelt sulit ditarik, tidak mengunci, atau kainnya robek, sebaiknya diperbaiki atau diganti.",
        riskIndicator: "high",
      },
      {
        id: "int-8",
        question: "Sunroof tidak bocor (jika ada)",
        tooltip:
          "Sunroof dan moonroof adalah panel atap mobil yang dirancang untuk ventilasi dan pencahayaan alami.\n\nPeriksa kondisi sunroof atau moonroof pada mobil (jika mobil memiliki fitur ini).\n\n1. Lihat bagian kaca dan karet di sekitar sunroof apakah ada retakan atau karet yang rusak.\n2. Periksa bagian plafon di sekitar sunroof apakah ada noda air atau bekas lembap.\n3. Jika memungkinkan, buka dan tutup sunroof untuk memastikan mekanismenya berfungsi dengan baik.\n4. Jika terlihat bekas air, noda, atau plafon lembap, kemungkinan sunroof pernah mengalami kebocoran.",
        riskIndicator: "medium",
      },
      {
        id: "int-9",
        question: "Audio mobil berfungsi normal",
        tooltip:
          "Periksa sistem audio dan speaker di dalam mobil.\n\n1. Nyalakan sistem audio atau radio mobil.\n2. Putar musik atau radio dengan volume rendah terlebih dahulu.\n3. Dengarkan apakah suara keluar dari speaker dengan jelas.\n4. Naikkan volume sedikit untuk memastikan tidak ada suara pecah atau berisik.\n5. Jika ada speaker yang tidak mengeluarkan suara atau suaranya pecah, kemungkinan speaker atau sistem audio perlu diperbaiki.",
        riskIndicator: "low",
      },
    ],
  },
  {
    id: "engine",
    name: "Mesin & Fungsi",
    weight: 0.3,
    icon: "Settings",
    items: [
      {
        id: "eng-1",
        question: "Lampu Check Engine tidak menyala saat mesin hidup",
        tooltip:
          "Periksa kondisi aki mobil di ruang mesin.\n\n1. Buka kap mesin dan temukan aki mobil.\n2. Lihat bagian terminal aki (kutub positif dan negatif).\n3. Pastikan tidak ada kerak putih atau hijau yang menandakan korosi.\n4. Nyalakan mobil untuk memastikan aki masih mampu menyalakan mesin dengan normal.\n5. Jika terdapat banyak korosi atau mobil sulit dinyalakan, kemungkinan aki perlu dibersihkan atau diganti.",
        riskIndicator: "medium",
      },
      {
        id: "eng-2",
        question: "Mesin hidup mulus tanpa getaran berlebihan",
        tooltip:
          "Periksa kondisi mesin saat mobil dinyalakan.\n\n1. Nyalakan mesin mobil dan dengarkan suara mesin.\n2. Perhatikan apakah suara mesin terdengar halus dan stabil.\n3. Rasakan apakah ada getaran berlebihan pada setir, dashboard, atau kursi.\n4. Jika mesin terasa bergetar kuat atau suaranya tidak stabil, kemungkinan ada masalah pada mesin atau dudukan mesin (engine mounting).\n\nGetaran berlebihan menunjukkan engine mounting rusak atau masalah internal",
        riskIndicator: "high",
      },
      {
        id: "eng-3",
        question: "Tidak ada suara ketukan/kasar dari mesin",
        tooltip:
          "Periksa suara mesin saat mobil dinyalakan.\n\n1. Nyalakan mesin mobil dan dengarkan suara dari ruang mesin.\n2. Pastikan suara mesin terdengar halus dan tidak ada bunyi ketukan atau bunyi kasar.\n3. Perhatikan apakah ada suara seperti 'ketuk-ketuk', 'tek-tek', atau suara logam.\n4. Jika terdengar suara ketukan atau kasar, kemungkinan ada masalah pada bagian mesin yang perlu diperiksa lebih lanjut.\n\nSuara ketukan (knocking) menunjukkan kerusakan mesin serius",
        riskIndicator: "critical",
      },
      {
        id: "eng-4",
        question: "Tidak ada asap berlebihan dari knalpot",
        tooltip:
          "Periksa asap yang keluar dari knalpot saat mesin mobil menyala.\n\n1. Nyalakan mesin mobil dan lihat bagian knalpot di belakang mobil.\n2. Perhatikan apakah ada asap yang keluar secara berlebihan.\n3. Jika ada asap tebal berwarna putih, biru, atau hitam, kemungkinan ada masalah pada mesin.\n4. Mesin normal biasanya hanya mengeluarkan asap tipis yang cepat hilang.\n\nAsap putih = bocor oli\nAsap hitam = pembakaran tidak sempurna\nAsap biru = ring piston aus",
        riskIndicator: "critical",
      },
      {
        id: "eng-5",
        question: "Oli mesin normal",
        tooltip:
          "Periksa kondisi oli mesin menggunakan dipstick (batang pengukur oli).\n\n1. Buka kap mesin mobil.\n2. Cari dipstick oli mesin (biasanya memiliki pegangan berwarna terang).\n3. Tarik dipstick, lalu lap dengan kain atau tisu bersih.\n4. Masukkan kembali dipstick lalu tarik lagi untuk melihat warna oli.\n5. Jika oli terlihat terlalu hitam pekat atau sangat kotor, kemungkinan oli sudah lama tidak diganti.\n\nOli yang sangat hitam menunjukkan jarang diganti atau kondisi mesin buruk\n\nCek oli mesin melalui warna, volume dan kekentalan",
        riskIndicator: "medium",
      },
      {
        id: "eng-6",
        question: "Tidak ada kebocoran oli pada mesin",
        tooltip:
          "Periksa apakah ada kebocoran oli di sekitar mesin.\n\n1. Buka kap mesin mobil.\n2. Lihat bagian sekitar mesin apakah ada cairan berwarna hitam atau coklat seperti oli.\n3. Periksa juga bagian bawah mesin apakah ada noda oli atau bekas tetesan.\n4. Jika terlihat oli menetes atau ada banyak noda oli, kemungkinan ada kebocoran pada mesin yang perlu diperbaiki.",
        riskIndicator: "high",
      },
      {
        id: "eng-7",
        question: "Air radiator cukup",
        tooltip:
          "Periksa tabung reservoir radiator.\n\n1. Pastikan mesin dalam kondisi dingin.\n2. Lihat level air radiator pada tabung reservoir.\n3. Pastikan berada di antara garis MIN dan MAX.\n\nJika berada di bawah MIN, sistem pendingin bisa kurang efektif.",
        riskIndicator: "high",
      },
      {
        id: "eng-8",
        question: "Warna air radiator normal",
        tooltip:
          "Perhatikan warna cairan radiator.\n\n1. Coolant normal biasanya berwarna hijau, merah, biru, atau pink.\n2. Jika warna berubah menjadi coklat atau keruh, coolant kemungkinan sudah kotor.\n3. Coolant yang kotor dapat menyebabkan karat dan penyumbatan radiator.",
        riskIndicator: "medium",
      },
      {
        id: "eng-9",
        question: "Tidak ada kebocoran radiator",
        tooltip:
          "Periksa area sekitar radiator dan bawah mobil.\n\n1. Lihat apakah ada tetesan cairan di bawah mobil.\n2. Periksa selang radiator dan sekitar mesin.\n3. Jika ada cairan berwarna hijau, merah, atau biru menetes, kemungkinan ada kebocoran pada sistem pendingin.",
        riskIndicator: "critical",
      },
      {
        id: "eng-10",
        question: "Suhu mesin tetap normal saat mobil diam",
        tooltip:
          "Periksa indikator suhu mesin saat mobil menyala tetapi tidak dijalankan (idle).\n\n1. Nyalakan mesin mobil dan biarkan beberapa menit tanpa dijalankan.\n2. Lihat indikator suhu mesin pada dashboard.\n3. Pastikan jarum atau indikator suhu naik secara perlahan lalu berhenti di posisi normal.\n4. Jika suhu terus naik hingga mendekati area merah, kemungkinan ada masalah pada sistem pendingin mesin.\n\nSuhu harus stabil di tengah setelah warm up",
        riskIndicator: "high",
      },
      {
        id: "eng-11",
        question: "Perpindahan gigi transmisi terasa halus",
        tooltip:
          "Periksa perpindahan gigi pada transmisi mobil.\n\n1. Nyalakan mesin mobil dan injak pedal rem.\n2. Pindahkan tuas transmisi secara perlahan (misalnya dari P ke R atau N ke D untuk mobil otomatis).\n3. Perhatikan apakah perpindahan gigi terasa halus.\n4. Jika terasa hentakan kuat atau bunyi 'jedug', kemungkinan ada masalah pada sistem transmisi.",
        riskIndicator: "critical",
      },
      {
        id: "eng-12",
        question: "Setir terasa ringan dan tidak berbunyi",
        tooltip:
          "Periksa kondisi setir mobil saat mesin menyala.\n\n1. Nyalakan mesin mobil.\n2. Putar setir ke kiri dan ke kanan secara perlahan.\n3. Pastikan setir terasa ringan dan mudah diputar.\n4. Dengarkan apakah ada bunyi aneh seperti 'krek' atau 'tek' saat memutar setir.\n5. Jika setir terasa berat atau muncul bunyi, kemungkinan ada masalah pada sistem kemudi atau power steering.",
        riskIndicator: "high",
      },
      {
        id: "eng-13",
        question: "Rem terasa pakem dan tidak berbunyi",
        tooltip:
          "Periksa kondisi rem mobil untuk memastikan masih bekerja dengan baik.\n\n1. Nyalakan mesin mobil dan jalankan mobil secara perlahan di tempat yang aman.\n2. Tekan pedal rem secara perlahan.\n3. Perhatikan apakah mobil bisa berhenti dengan baik.\n4. Dengarkan apakah ada bunyi seperti 'cit-cit' atau 'berdecit' saat mengerem.\n5. Jika rem terasa kurang pakem atau muncul bunyi, kemungkinan kampas rem sudah aus atau ada masalah pada sistem rem.",
        riskIndicator: "critical",
      },
      {
        id: "eng-14",
        question: "Tidak ada bunyi aneh dari bawah mobil saat berjalan",
        tooltip:
          "Periksa apakah ada bunyi tidak normal saat mobil dijalankan.\n\n1. Jalankan mobil secara perlahan di jalan yang aman.\n2. Dengarkan suara dari bagian depan, belakang, dan bawah mobil.\n3. Pastikan tidak ada bunyi aneh seperti 'kletek', 'gluduk', atau 'berderak'.\n4. Jika muncul bunyi aneh saat mobil berjalan atau saat melewati jalan tidak rata, kemungkinan ada komponen kaki-kaki atau suspensi yang bermasalah.",
        riskIndicator: "high",
      },
      {
        id: "eng-15",
        question: "Suspensi terasa nyaman saat mobil berjalan",
        tooltip:
          "Periksa kenyamanan suspensi saat mobil berjalan.\n\n1. Jalankan mobil secara perlahan.\n2. Lewati jalan yang sedikit bergelombang atau tidak rata.\n3. Perhatikan apakah mobil terasa terlalu keras atau memantul berlebihan.\n4. Suspensi yang baik akan meredam getaran sehingga mobil tetap terasa nyaman.\n\nJika mobil terasa sangat keras, terlalu memantul, atau tidak stabil, kemungkinan suspensi atau shockbreaker sudah melemah.",
        riskIndicator: "high",
      },
      {
        id: "eng-16",
        question: "AC dingin dan blower kencang",
        tooltip:
          "Blower AC mobil adalah motor dinamo yang berfungsi menghembuskan udara dingin dari evaporator ke dalam kabin melalui kisi-kisi AC.\n\nPeriksa apakah AC mobil dapat mendinginkan kabin dengan baik.\n\n1. Nyalakan mesin mobil lalu hidupkan AC.\n2. Atur suhu ke paling dingin dan nyalakan blower.\n3. Rasakan udara yang keluar dari ventilasi AC.\n4. Pastikan udara terasa dingin dan hembusan anginnya cukup kuat.\n5. Jika udara tidak dingin atau hembusannya lemah, kemungkinan ada masalah pada sistem AC.\n\nAC harus dingin dalam 1-2 menit dan semua speed blower berfungsi",
        riskIndicator: "medium",
      },
      {
        id: "eng-17",
        question: "Aki tidak korosi dan tegangan normal",
        tooltip:
          "Periksa kondisi aki mobil di ruang mesin.\n\n1. Buka kap mesin dan temukan aki mobil.\n2. Lihat bagian terminal aki (kutub positif dan negatif).\n3. Pastikan tidak ada kerak putih atau hijau yang menandakan korosi.\n4. Nyalakan mobil untuk memastikan aki masih mampu menyalakan mesin dengan normal.\n5. Jika terdapat banyak korosi atau mobil sulit dinyalakan, kemungkinan aki perlu dibersihkan atau diganti.",
        riskIndicator: "medium",
      },
    ],
  },
];

export const CRITICAL_ISSUES = [
  "Tidak ada tanda karat di kolong/roda",
  "Tidak ada bau apek/masuk angin/bau mesin",
  "Karpet kering dan tidak berjamur",
  "Tidak ada suara ketukan/kasar dari mesin",
  "Tidak ada asap berlebihan dari knalpot",
  "Transmisi shifting mulus tanpa jedug",
  "Rem pakem dan tidak bunyi",
  "STNK asli dan masih berlaku",
  "Nomor rangka di STNK cocok dengan mobil",
  "Nomor mesin di STNK cocok dengan mobil",
  "BPKB asli tersedia",
];
