# whatsapp-send-path-name

1. Menggunakan pertama kali

==> npm start

2. Jika ingin login lagi

==> hapus folder baileys
==> masuk ke terminal dan npm start

3. Untuk mencari id group 
==> uncoment baris kode berikut
      // let getGroups = await sock.groupFetchAllParticipating();
      // let groups = Object.entries(getGroups)
      //   .slice(0)
      //   .map((entry) => entry[1]);
      // console.log(groups);
      
==> cek terminal dan cari id yang diinginkan

4. Mengganti nomor tujuan atau grup tujuan

==> untuk nomor hp (ex. 6287777060010@s.whatsapp.net)
app.use(async (req, res, next) => {
  const path = req.path == "/" ? "home" : req.path.substring(1);
  await sock.sendMessage("[MASUKKAN NOMOR HP TUJUAN]", {
    text: `${path}`,
  });
  console.log(`Path yang diakses: ${path}`);
  next();
});

==> untuk grup whatsapp (ex. 120363152610504443@g.us)
app.use(async (req, res, next) => {
  const path = req.path == "/" ? "home" : req.path.substring(1);
  await sock.sendMessage("[MASUKKAN ID GRUP TUJUAN]", {
    text: `${path}`,
  });
  console.log(`Path yang diakses: ${path}`);
  next();
});
