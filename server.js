"use strict";

const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;
const { MongoClient, ObjectId } = require("mongodb");
const uri =
    "mongodb+srv://remyBG:4rR9k83kue0yAKuY@parrage.wub7rn9.mongodb.net/?retryWrites=true&w=majority";

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(express.json());
// Create a MongoClient
const client = new MongoClient(uri);

app.use(cors());

app.get("/getHorses", async (req, res) => {
    try {
        // Connect the client to the server
        await client.connect();

        // retrieve data
        const collection = client
            .db("Parrage")
            .collection("Chevaux");
        const horses = await collection.find({}).toArray();

        //send back data
        res.status(200).send(horses);
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.post("/addHorses", async (req, res) => {
    try {
        // Connect the client to the server
        await client.connect();

        const horse = {
            Nom: req.body.Nom,
            Ecurie: req.body.Ecurie,
            Dernier_Parage: req.body.Dernier_Parage,
            Prochain_Parage: req.body.Prochain_Parage,
            Paré: false
        }

        // retrieve data
        const collection = client
            .db("Parrage")
            .collection("Chevaux");
        const insertedHorse = await collection.insertOne(horse);

        //send back data
        res.status(201).send({
            status: "Saved",
            message: "Horse has been added!",
            data: insertedHorse,
        });
    } finally {
        // Ensures that the client will close when you finish/error
        await client.close();
    }
});

app.put("/updateHorses", async (req, res) => {
    try {
        // Connect the client to the server
        await client.connect();

        const modifiedHorses = req.body;
        const collection = client
            .db("Parrage")
            .collection("Chevaux");

        // Update each modified horse
        for (const modifiedHorse of modifiedHorses) {
            const filter = { _id: new ObjectId(modifiedHorse.id) };
            const update = {
                $set: {
                    Nom: modifiedHorse.name,
                    Ecurie: modifiedHorse.stable,
                    Dernier_Parage: modifiedHorse.lastTrim,
                    Prochain_Parage: modifiedHorse.nextTrim,
                    Paré: modifiedHorse.trimmed,
                }
            };

            const result = await collection.findOneAndUpdate(filter, update, { returnDocument: 'after' });

            if (result.value !== null) {
                console.log("Updated Document:", result.value);
            } else {
                console.log("Document not found for update:", filter);
            }
        }

        // Send back success response
        res.status(200).send({
            status: "Updated",
            message: "Horses updated successfully",
        });
    } finally {
        // Ensure that the client will close when you finish/error
        await client.close();
    }
});



app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
