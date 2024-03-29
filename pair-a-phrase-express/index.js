require("dotenv").config();
const express = require('express');
const App = express();
const cors = require("cors");

const PORT = process.env.PORT || 8080;
const ENV = process.env.ENV || "development";

const BodyParser = require("body-parser");
const morgan = require('morgan');
const axios = require('axios');
const { v4: uuidv4 } = require("uuid");

App.use(morgan('dev'))
App.use(BodyParser.urlencoded({ extended: true }));
App.use(BodyParser.json());
App.use(cors());


App.post('/translate', function(req, res) {
  console.log("req from backend: ", req.body);

  const string = req.body.string;
  const startLang = req.body.startLang;
  const endLang = req.body.endLang;

  const subscriptionKey = process.env.SUBSCRIPTION_KEY
  var endpoint = "https://api.cognitive.microsofttranslator.com"

  // Add your location, also known as region. The default is global.
  // This is required if using a Cognitive Services resource.
  var location = "global";

  axios({
    baseURL: endpoint,
    url: "/translate",
    method: "post",
    headers: {
      "Ocp-Apim-Subscription-Key": subscriptionKey,
      "Ocp-Apim-Subscription-Region": location,
      "Content-type": "application/json",
      "X-ClientTraceId": uuidv4().toString(),
    },
    params: {
      "api-version": "3.0",
      from: startLang,
      to: [startLang, endLang],
    },
    data: [
      {
        text: string,
      },
    ],
    responseType: "json",
  }).then((result) => {
    console.log('result from backend: ', result.data);
    return res.json(result.data);
  })
    .catch(err => console.log('translation err: ', err))
});

App.post('/register', (req, res) => {
  console.log('req.body in register: ', req.body);
  console.log('type of data in req.body: ', typeof req.body.username);

  const username = req.body.username
  const secret = req.body.secret
  const first_name = req.body.first_name
  const last_name = req.body.last_name
  const avatar = req.body.avatar

  const data = {
    "username": `${username}`,
    "secret": `${secret}`,
    "first_name": `${first_name}`,
    "last_name": `${last_name}`,
    // "avatar": `${avatar}`
  };

  const config = {
    method: 'post',
    url: 'https://api.chatengine.io/users/',
    headers: {
      'PRIVATE-KEY': process.env.PRIVATE_KEY
    },
    data: data
  };

  axios(config)
    .then(function(response) {
      console.log("JSON Stringfy: ", response.data);
      return res.json(response.data)
    })
    .catch(function(error) {
      console.log("Catch Error: ", error);
      return res.json(error.response.data.message)
    });

});


App.listen(PORT, function() {
  console.log(`Example app listening on port ${PORT}!`);
});