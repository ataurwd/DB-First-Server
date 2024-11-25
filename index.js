const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express()

app.use(express.json())
app.use(cors())


const uri = "mongodb+srv://ataurrahman24707:tEt88ey8LswveXf1@cluster0.4jm04.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    await client.connect();

    // to get data from database (mongoDB)
    app.get('/user', async(req, res) => {
        const cursor = userCollection.find();
        const result = await cursor.toArray();
        res.send(result)
    })

    const userCollection = client.db("userDB").collection("newUsers");

    //post data in the server (MongoDB)
    app.post('/users', async (req, res) => {
        const newUser = req.body;
        const result = await userCollection.insertOne(newUser);
        res.send(result)
    })

    // delete data from ui and also the server (MongoDB)
    app.delete('/user/:id', async(req, res) => {
        const userId = req.params.id;
        const quary = {_id: new ObjectId(userId)}
        const result = await userCollection.deleteOne(quary)
        res.send(result)
        console.log('delted id', result)
    })

    // update profile
    app.get('/user/:id', async(req, res) => {
        const newUserId = req.params.id;
        const quary = {_id: new ObjectId(newUserId)}
        const userInfo = await userCollection.findOne(quary)
        res.send(userInfo)
    })

    app.put('/user/:id', async(req, res) => {
        const userId = req.params.id
        const updateUser = req.body;
        const filter = {_id: new ObjectId(userId)}
        const options = { upsert: true };
        const newUpdateUser = {
            $set: {
                name: updateUser.name,
                email: updateUser.email
            }
        }
        const result = await userCollection.updateOne(filter, newUpdateUser, options)
        res.send(result)
        console.log(updateUser)
    })

    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } 
    finally {
  }
}
run().catch(console.log);


app.listen(port, () => {
    console.log(port)
})





// user  Name: ataurrahman24707
//password: tEt88ey8LswveXf1