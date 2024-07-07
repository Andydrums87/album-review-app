require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg");
const axios = require("axios")


// const { Pool } = require('pg');
// const itemsPool = new Pool ({
//     user: 'Andydrums87',
//     password: 'B7Byyhfyzva7Ze1PhElOgS8gA5S7ADTO',
//     database: 'albums_o84k',
//     host: 'dpg-cq40nhiju9rs739mus1g-a',
//     port: 5432,
//     connectionString: process.env.DBConnLink,
//     ssl: {
//         rejectUnauthorized: false
//     }
// });

const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,
  });
  db.connect();

const app = express();
const port = process.env.BACKPORT;
const key = process.env.API_KEY;


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(express.static("public"));

let posts = [];


app.get("/", async (req, res) => {
    try {
         const result = await db.query("SELECT * FROM posts ORDER BY id DESC" );
   items = result.rows
    res.render("admin.ejs", {
        postItems: items
    });
    } catch (err) {
        console.log(err)
    }
})

app.post("/api/posts", async (req, res) => {
    const artist = req.body["artist"];
    const title = req.body["title"];
    const review = req.body["review"];
    const score = req.body["score"];
    const year = req.body["year"];
    const para = req.body['openingPara'];
    try {
        const response = await axios.get(`http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key=${key}&artist=${artist}&album=${title}&format=json`);
        const data = response.data
        const image = data.album.image[2]['#text'];


        console.log(image)
        const result = await db.query("INSERT INTO posts (artist, title, review, image, score, year, para) VALUES ($1, $2, $3, $4, $5, $6, $7)", [artist, title, review, image, score, year, para]);
        res.redirect("/")
    } catch (err) {
        console.log(err)
    }
});

app.get("/edit-post", async (req, res) => {
    try {
        const result = await db.query("SELECT * FROM posts" );
  items = result.rows
   res.render("edit-post.ejs", {
       postItems: items
   });
   } catch (err) {
       console.log(err)
   }

})

app.post("/search", async (req, res) => {
 
    try {
    let searchTerm = req.body.searchTerm
    const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9 ]/g, "")
    const postItems = items.filter((items) => items.title == searchTerm || items.artist == searchTerm)
    console.log(postItems)
    res.render("edit-post", { items: postItems })
    } catch (err) {
        console.log(err)
    }
});

app.post("/edit:id", async (req, res) => {
    const updatedArtist = req.body.updatedArtist;
    const updatedTitle = req.body.updatedTitle;
    const updatedReview = req.body.updatedReview;
    const updatedScore = req.body.updatedScore;
    const updatedYear = req.body.updatedYear;
    const updatedPara = req.body.updatedOpeningPara;
    const id = req.body.updatedItemId;
    
    try {
       
        const result = await db.query("UPDATE posts SET artist = ($1), title = ($2), review = ($3), score = ($4), year = ($5), para = ($6) WHERE id = $7", [updatedArtist, updatedTitle, updatedReview, updatedScore, updatedYear, updatedPara, id]);
        res.redirect("/")
    } catch (err) {
        console.log(err)
    }
})

app.post("/delete", async (req, res) => {
    const id = req.body.deleteItemId;
    try {
      await db.query("DELETE FROM posts WHERE id = $1", [id]);
      res.redirect("/");
    } catch (err) {
      console.log(err);
    }
  });

app.listen(port, () => {
    console.log(`Backend server is running at http://localhost:${port}`);
  });