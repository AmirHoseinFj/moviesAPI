/*********************************************************************************
* WEB422 – Assignment 1* I declare that this assignment is my own work in accordance with Seneca Academic Policy.
* No part of this assignment has been copied manually or electronically from any other source
* (including web sites) or distributed to other students.
*
* Name: Amirhossein Ghaffarzadeh Student ID: 120734223 Date: 2024-01-19
* Cyclic Link: https://zany-gold-cheetah-vest.cyclic.app
/*********************************************************************************/

const MoviesDB = require('./modules/moviesDB.js');
const db = new MoviesDB();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({ message: "API Listening" });
});

app.post('/api/movies', async (req, res) => {
    try {
        let result = await db.addNewMovie(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/movies', async (req, res) => {
    let { page, perPage, title } = req.query;
    try {
        let result = await db.getAllMovies(parseInt(page), parseInt(perPage), title);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/movies/:id', async (req, res) => {
    try {
        let result = await db.getMovieById(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/movies/:id', async (req, res) => {
    try {
        await db.updateMovieById(req.body, req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/movies/:id', async (req, res) => {
    try {
        await db.deleteMovieById(req.params.id);
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// "Initializing" the Module before the server starts
db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        app.listen(HTTP_PORT, () => {
            console.log(`Server listening on port ${HTTP_PORT}`);
        });
    })
    .catch((err) => {
        console.log(err);
    });
