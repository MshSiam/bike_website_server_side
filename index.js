const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const { MongoClient } = require("mongodb")
const port = process.env.PORT || 5000

// middleWere
app.use(cors())

const uri = ` mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.woosd.mongodb.net/myFirstDatabase?retryWrites=true&w=majority
`

console.log(uri)
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})

// run function
async function run() {
  try {
    await client.connect()
    // console.log("db connected")
  } finally {
    //   await client close()
  }
}
run().catch(console.dir)

app.get("/", (req, res) => {
  res.send("Bike Server")
})

app.listen(port, () => {
  console.log(`app running at `, port)
})
