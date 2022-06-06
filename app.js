// app.js
const express = require("express")
const path = require("path")
require('dotenv').config();

const app = express()

app.use(
  "/css",
  express.static(path.join(__dirname, "views/css"))
)
app.use(
  "/js",
  express.static(path.join(__dirname, "views/js"))
)
app.use(
  "/assets",
  express.static(path.join(__dirname, "views/assets"))
)

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views/index.html"))
})
app.get("/foto", (req, res) => {
  res.sendFile(path.join(__dirname, "views/curso_foto.html"))
})

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port " + process.env.PORT || 5000)
  console.log("        Don`t trhead on me.         ")
  console.log("located on: http://localhost:" + process.env.PORT || 5000)
})