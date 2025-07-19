const express = require("express");
const fetch = require("node-fetch");
const app = express();

app.get("/*", async (req, res) => {
  try {
    const targetUrl = req.path.slice(1);
    if (!targetUrl.startsWith("http")) {
      return res.status(400).send("Url tidak valid");
    }

    const target = new URL(targetUrl);

    const response = await fetch(target.href, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        "Referer": target.origin + "/",
      },
    });

    res.set("Access-Control-Allow-Origin", "*");

    for (const [key, value] of response.headers.entries()) {
      if (!["content-encoding", "content-length", "transfer-encoding", "connection"].includes(key)) {
        res.setHeader(key, value);
      }
    }

    res.status(response.status);
    response.body.pipe(res);
  } catch (err) {
    res.status(500).send("Gagal proxy: " + err.message);
  }
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log("Proxy aktif di port " + PORT));
