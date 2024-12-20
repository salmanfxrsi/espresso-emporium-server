const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.upkox.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const database = client.db("coffeesDB");
    const coffeesCollection  = database.collection("coffees");

    // get data
    app.get('/coffees', async(res,req) => {
      const cursor = coffeesCollection.find()
      const result = await cursor.toArray()
      req.send(result)
    })

    app.get('/coffees/:id', async (req,res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) }
      const cursor = await coffeesCollection.findOne(query)
      res.send(cursor)
    })

    // post data 
    app.post('/coffees', async(req,res) => {
      const newCoffee = req.body
      const result = await coffeesCollection.insertOne(newCoffee)
      res.send(result)
    })

    app.put('/coffees/:id', async(req,res) => {
      const id = req.params.id
      const query = { _id: new ObjectId(id) }
      const updatedCoffee = req.body
      console.log(updatedCoffee)
      const options = { upsert: true }
      const coffee = {
        $set: {
          name: updatedCoffee.name,
          chef: updatedCoffee.chef,
          supplier: updatedCoffee.supplier,
          taste: updatedCoffee.taste,
          category: updatedCoffee.category,
          details: updatedCoffee.details,
          photo: updatedCoffee.photo
        }
      }
      const result = await coffeesCollection.updateOne(query,coffee, options)
      res.send(result)
    })

    app.delete('/coffees/:id', async(req,res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await coffeesCollection.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);



app.get('/',(req,res) => {
    res.send("espresso is connected")
})

app.listen(port,() => {
    console.log(`espresso server is running on port: ${port}`)
})
