
# whatsapp-send-path-name

aplikasi yang dapat mengirimkan pesan secara otomatis dimana path kita jika kita berada di suatu path yang ada pada webserver kita


## Run Locally

Clone the project

```bash
  git clone https://link-to-project
```

Go to the project directory

```bash
  cd my-project
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run start
```


## Mencari id grup 
mencari id grup whatsapp dengan cara uncomment baris kode yand ada dibawah ini pada halaman index.js

```javascript
  // let getGroups = await sock.groupFetchAllParticipating();
  // let groups = Object.entries(getGroups)
  //   .slice(0)
  //   .map((entry) => entry[1]);
  // console.log(groups);
```
lalu jalankan aplikasi pada terminal dengan cara 

```bash
  npm run start
```

lalu lihat id grup yang anda cari pada terminal

## Mengganti id group atau nomor tujuan
untuk mengganti id grup dengan 

```javascript
  app.use(async (req, res, next) => {
  const path = req.path == "/" ? "home" : req.path.substring(1);
  await sock.sendMessage("[ID GRUP]", { 
    text: `${path}`,
  });
  console.log(`Path yang diakses: ${path}`);
  next();
});
```
untuk mengganti nomor whatsapp tujuan (untuk format nomor wa seperti ini 6287777060010@s.whatsapp.net)

```javascript
  app.use(async (req, res, next) => {
  const path = req.path == "/" ? "home" : req.path.substring(1);
  await sock.sendMessage("[NO WA TUJUAN]", { 
    text: `${path}`,
  });
  console.log(`Path yang diakses: ${path}`);
  next();
});
```
lalu jalankan kembali aplikasi pada terminal dengan cara

```bash
  npm run start
```
