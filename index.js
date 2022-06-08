// app.js
const express = require("express")
const path = require("path")
const main = require("./src/index.js"); 
var bodyParser = require('body-parser')
require('dotenv').config();

const app = express()

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

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
app.get("/clientes", (req, res) => {
  res.sendFile(path.join(__dirname, "views/clientes.html"))
})
app.post("/aprove", (req, res) => {
  try {
    const data = main.aprovePurchase(req.body, res);
    
    res.sendFile(path.join(__dirname, "views/clientes.html"))
}
catch (err) {
    res.status(500).json({message: err.message});
}
})
app.get("/consultas-productos", (req, res) => {
  try {
    const data = main.getProducts();
    res.status(200).json(data);
}
catch (err) {
    res.status(500).json({message: err.message});
}
})
app.post("/buy", (req, res) => {
  try {
    const response =  main.buy(req.body, res);
    
    res.sendFile(path.join(__dirname, "views/curso_foto.html"))
}
catch (err) {
    res.status(500).json({message: err.message});
}
 
})

app.listen(process.env.PORT || 5000, () => {
  console.log("Listening on port " + process.env.PORT || 5000)
  console.log("        Don`t trhead on me.         ")
  console.log("located on: http://localhost:" + process.env.PORT || 5000)
})