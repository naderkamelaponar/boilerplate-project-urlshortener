require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
// Edit Below this Line 
const URI = process.env['URI']
const mongoose = require('mongoose')
mongoose.connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
const { Schema } = mongoose
const urlSchema = new Schema({
  originalUrl: { type: String, required: true }
  , shortUrl: Number
})
const Url = mongoose.model('Urls', urlSchema)
let bodyParser = require('body-parser')
let resJson = {}
app.post('/api/shorturl',
  bodyParser.urlencoded({ extended: false }),
  (req, response) => {
    let reqUrl = req.body['url']
    if (reqUrl.indexOf('http') == -1 || reqUrl.indexOf('https') == -1) {
      response.json({ error: 'invalid url' })
    }
    else {
      let shortUrl=0
      resJson['original_url'] = reqUrl
      Url.findOne({})
        .sort({ shortUrl: "desc" })
        .exec((error, resault) => {
          if (!error && resault != undefined) {
             shortUrl = resault.shortUrl + 1
          }
          if (!error) {
            Url.findOneAndUpdate(
              { originalUrl: reqUrl },
              { originalUrl: reqUrl, shortUrl }
              , { new: true, upsert: true }
              , (err, updated) => {
                console.log(updated.shortUrl)
                resJson['short_url'] = updated.shortUrl
                response.json(resJson)
              }
            )
          }
          else {
            response.json(resJson)
          }
        })
    }
  })
app.get('/api/shorturl/:input', (req, res) => {
  let shortNo = req.params.input
  Url.findOne({ shortUrl: shortNo },
    (err, found) => {
      if (!err && found != undefined) {
        res.redirect(found.originalUrl)
      }
    })
})
// Edit Above this Line
