/*use "scripts": {
    "dev": "nodemon server.js"
  }
  in package.json file to make your server automatically restart during any change in the file
  then run the "npm run dev" in the terminal

*/
const MongoClient = require('mongodb').MongoClient
const bodyParser = require('body-parser');
const express = require('express');
const app = express();

app.set('view engine', 'ejs')
// Middlewares and other routes here...

//this handles mongoDB stuff
  MongoClient.connect(/*this string connects the database to the app*/'mongodb+srv://Ams:Sheltona2!@atlascluster.ytwr7pg.mongodb.net/?retryWrites=true&w=majority', {
    useUnifiedTopology: true})
      .then(client => {
        console.log('Connected to Database')
        const db = client.db('star-wars-quotes')
        //a database is like a room. this room contains boxes which are referred to as collections
        const quotesCollection = db.collection('quotes')
        // Make sure you place body-parser before your CRUD handlers!
        app.use(bodyParser.urlencoded({ extended: true }))
        app.listen(3000, function() {
            console.log('listening on 3000')
          })
        //thes are all of your handlers
          // We normally abbreviate `request` to `req` and `response` to `res`.
        app.get('/', (req, res) => {
            // do something here
            res.sendFile(__dirname + '/index.html')
            // Note: __dirname is the current directory you're in. Try logging it and see what you get!
            // Mine was '/Users/zellwk/Projects/demo-repos/crud-express-mongo' for this app.
            const cursor = db.collection('quotes').find().toArray()
              .then(results => {
                res.render('index.ejs', {quotes: results})
              })
            
              .catch(error => console.error(error))
              
          })
          //this handles the post request and sends it to /quotes
        app.post('/quotes', (req, res) => {
          quotesCollection.insertOne(req.body)
            .then(result => {
              res.redirect('/')
              console.log(result)
            })
            .catch(error => console.error(error))
            })
      })
      .catch(error => console.log('error'))
  