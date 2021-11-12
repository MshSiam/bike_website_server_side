const express = require("express")
const app = express()
const cors = require("cors")
require("dotenv").config()
const { MongoClient } = require("mongodb")
const port = process.env.PORT || 5000
const ObjectId = require("mongodb").ObjectId

// middleWere
app.use(cors())
app.use(express.json())

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
    const database = client.db("bike_website")
    const bikeCollection = database.collection("bikes")
    const orderCollection = database.collection("orders")
    const usersCollection = database.collection("users")

    //--------GET api (bikes)------- //
    app.get("/bikes", async (req, res) => {
      const cursor = bikeCollection.find({})
      const bikes = await cursor.toArray()
      res.send(bikes)
    })
    // Get Single Bike
    app.get("/bikes/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const bike = await bikeCollection.findOne(query)
      res.json(bike)
    })

    //  get order according to user
    app.get("/purchasing", async (req, res) => {
      const email = req.query.email
      const query = { email: email }
      const cursor = orderCollection.find(query)
      const order = await cursor.toArray()
      res.json(order)
    })
    // post orders
    app.post("/purchasing", async (req, res) => {
      const order = req.body
      // console.log("hit api", order)
      const result = await orderCollection.insertOne(order)
      res.json(result)
    })

    // post user from client to db
    app.post("/users", async (req, res) => {
      const user = req.body
      const result = await usersCollection.insertOne(user)
      res.json(result)
    })

    // delete ordered product api
    app.delete("/purchasing/:id", async (req, res) => {
      const id = req.params.id
      const query = { _id: ObjectId(id) }
      const result = await orderCollection.deleteOne(query)
      console.log("deleting", result)
      res.json(result)
    })
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
