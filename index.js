require('dotenv').config()

const express = require("express");
const bodyParser = require("body-parser");
const pg = require("pg")
const axios = require("axios")



const db = new pg.Client({
    user: process.env.PG_USER,
    host: process.env.PG_HOST,
    database: process.env.PG_DATABASE,
    password: process.env.PG_PASSWORD,
    port: process.env.PG_PORT,

  });
  db.connect();

const app = express();
const port = process.env.PORT 


app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static("public"));

let posts = [];


app.get("/", async (req, res) => {
    try {
   const result = await db.query("SELECT * FROM posts ORDER BY id DESC");
   const comments = await db.query("SELECT * FROM comments ORDER BY date DESC")
   const newComment = comments.rows
   items = result.rows
    res.render("index.ejs", {
        postItems: items,
        userComment: newComment

    });
    } catch (err) {
        console.log(err)
    }
});

app.get("/full-review", async (req, res) => {
    try {
    const result = await db.query("SELECT * FROM posts "); 
    const comments = await db.query("SELECT * FROM comments")
    const newComment = comments.rows
    items = result.rows
    res.render("full-review", {
        post: items,
        userComment: newComment
    }); 
} catch (err) {
        console.log(err)
    }


    });

app.post("/comments", async (req, res) => {
    const newDate = new Date().toLocaleDateString();
    const name = req.body["fullName"];
    const comment = req.body["comment"];
    const date = newDate
    try {
        const result = await db.query("INSERT INTO comments (name, comment, date) VALUES ($1, $2, $3)", [name, comment, date]);
        
      res.redirect("/")
    } catch (err){
        console.log(err)
    }
})


app.post("/full-review", async (req, res) => {
    const id = req.body.thisReviewId
    console.log(id)
    try {
        const result = await db.query("SELECT * FROM posts ");
        items = result.rows
        const postItem = items.find((items) => items.id == id)
        console.log(postItem)
        res.render("full-review", {
            post: postItem,})
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
    res.render("search", { items: postItems})
    } catch (err) {
        console.log(err)
    }
});

app.get("/oldest", async (req, res) => {
    try {
   const result = await db.query("SELECT * FROM posts ORDER BY year ASC ");
   const comments = await db.query("SELECT * FROM comments")
   const newComment = comments.rows
   items = result.rows
    res.render("index.ejs", {
        postItems: items,
        userComment: newComment

    });
    } catch (err) {
        console.log(err)
    }
});

app.get("/newest", async (req, res) => {
    try {
   const result = await db.query("SELECT * FROM posts ORDER BY year DESC ");
   const comments = await db.query("SELECT * FROM comments")
   const newComment = comments.rows
   items = result.rows
    res.render("index.ejs", {
        postItems: items,
        userComment: newComment
    });
    } catch (err) {
        console.log(err)
    }
});

app.get("/highest", async (req, res) => {
    try {
   const result = await db.query("SELECT * FROM posts ORDER BY score DESC ");
   const comments = await db.query("SELECT * FROM comments")
   const newComment = comments.rows
   items = result.rows
    res.render("index.ejs", {
        postItems: items,
        userComment: newComment
    });
    } catch (err) {
        console.log(err)
    }
});

app.get("/lowest", async (req, res) => {
    try {
   const result = await db.query("SELECT * FROM posts ORDER BY score ASC ");
   const comments = await db.query("SELECT * FROM comments")
   const newComment = comments.rows
   items = result.rows
    res.render("index.ejs", {
        postItems: items,
        userComment: newComment
    });
    } catch (err) {
        console.log(err)
    }
});


app.listen(port, () => {
    console.log(`API is running at http://localhost:${port}`);
  });