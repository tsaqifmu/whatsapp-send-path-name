const express = require("express");
const bodyParser = require("body-parser");
const {
  default: makeWASocket,
  MessageType,
  MessageOptions,
  Mimetype,
  DisconnectReason,
  BufferJSON,
  AnyMessageContent,
  delay,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  MessageRetryMap,
  useMultiFileAuthState,
  msgRetryCounterMap,
} = require("@adiwajshing/baileys");
const { Boom } = require("@hapi/boom");
const { session } = { session: "baileys_auth_info" };
var cron = require("node-cron");
const fs = require("fs");

const port = 3000;
const app = express();
let sock;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("baileys_auth_info");
  let { version, isLatest } = await fetchLatestBaileysVersion();
  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    version,
  });
  sock.multi = true;
  sock.ev.on("connection.update", async (update) => {
    //console.log(update);
    const { connection, lastDisconnect } = update;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect.error).output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(
          `Bad Session File, Please Delete ${session} and Scan Again`,
        );
        sock.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Connection closed, reconnecting....");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Connection Lost from Server, reconnecting...");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "Connection Replaced, Another New Session Opened, Please Close Current Session First",
        );
        sock.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(
          `Device Logged Out, Please Delete ${session} and Scan Again.`,
        );
        sock.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Restart Required, Restarting...");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Connection TimedOut, Reconnecting...");
        connectToWhatsApp();
      } else {
        sock.end(`Unknown DisconnectReason: ${reason}|${lastDisconnect.error}`);
      }
    } else if (connection === "open") {
      console.log("opened connection");
      // let getGroups = await sock.groupFetchAllParticipating();
      // let groups = Object.entries(getGroups)
      //   .slice(0)
      //   .map((entry) => entry[1]);
      // console.log(groups);
      return;
    }
  });
  sock.ev.on("creds.update", saveCreds);
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    //console.log(messages);
    if (type === "notify") {
      if (!messages[0].key.fromMe) {
        //tentukan jenis pesan berbentuk text
        const pesan = messages[0].message.conversation;

        //nowa dari pengirim pesan sebagai id
        const noWa = messages[0].key.remoteJid;

        await sock.readMessages([messages[0].key]);

        //kecilkan semua pesan yang masuk lowercase
        const pesanMasuk = pesan.toLowerCase();

        if (!messages[0].key.fromMe && pesanMasuk === "ping") {
          await sock.sendMessage(
            noWa,
            { text: "Pong" },
            { quoted: messages[0] },
          );
        }
      }
    }
  });
}

// run in main file
connectToWhatsApp().catch((err) => console.log("unexpected error: " + err));

// ===> CRON <===

// cron.schedule("0 19 * * *", async () => {
//   // console.log("every minutes");
//   // await sock.sendMessage("6287777060010@s.whatsapp.net", { text: `Setiap menit ngirim ~bot` });
//   await sock.sendMessage("120363048687522791@g.us", { text: `"Jangan lupa untuk share desain di grup angkatan, dan jangan lupa kepada yang bertugas untuk segera mengirim desainnya kesini ya😉" ~bot` });
// });

app.use(async (req, res, next) => {
  const path = req.path == "/" ? "home" : req.path.substring(1);
  await sock.sendMessage("120363152610504443@g.us", {
    text: `${path}`,
  });
  console.log(`Path yang diakses: ${path}`);
  next();
});

app.get("/", async (req, res) => {
  res.send("welcome😊");
  // await sock.sendMessage("6287777060010@s.whatsapp.net", { text: `tes ~bot` });
});

app.listen(process.env.PORT || port, () => {
  console.log(
    `Express server listening on port ${port} in ${app.settings.env} mode`,
  );
});
