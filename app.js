//jshint esversion: 6
// (The statement "//jshint esversion: 6" is used to indicate that JavaScript code uses ECMAScript 6 (ES6) syntax and helps code analysis tools like JSHint understand and validate the syntax.)

//require those modules that we just installed
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

//setup our server to listen on port 3000
const app = express();

app.use(express.static("public"));
app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});

app.use(bodyParser.urlencoded({extended: true}));
  app.post("/", function(req, res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
      members: [
        {
          email_address: email,
          status: "subscribed",
          merge_fields: {
            FNAME: firstName,
            LNAME: lastName
          }
        }
      ]
    };

    //here we are using json
    const jsonData = JSON.stringify(data);

    const url = "https://us17.api.mailchimp.com/3.0/lists/f225398653";

    const options = {
      method: "POST",
      auth: "gourab1:95b05e3d53e389d58db36367c3c7cca4-us17"
    }

    //now we are here making http request and we are finnaly going to get some response
    const request = https.request(url, options, function(response) {
      if (response.statusCode === 200) {
        res.sendFile(__dirname +"/success.html");
      }else{
        res.sendFile(__dirname +"/failure.html");
      }
      response.on("data", function(data){
        console.log(JSON.parse(data));
      })
    })

    // request.write(jsonData);
    request.end();
});

app.post("/failure", function(req, res) {
  res.redirect("/");
})

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000");
});

// API Key
// 95b05e3d53e389d58db36367c3c7cca4-us17

// List Id
// f225398653.

// {"name":"Freddie'\''s Favorite Hats","contact":{"company":"Mailchimp","address1":"675 Ponce De Leon Ave NE","address2":"Suite 5000","city":"Atlanta","state":"GA","zip":"30308","country":"US","phone":""},"permission_reminder":"You'\''re receiving this email because you signed up for updates about Freddie'\''s newest hats.","campaign_defaults":{"from_name":"Freddie","from_email":"freddie@freddiehats.com","subject":"","language":"en"},"email_type_option":true}
