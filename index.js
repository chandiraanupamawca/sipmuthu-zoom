const express = require("express");
const request = require("request");
var base64 = require('base-64');

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).send("Started!");
});

app.post("/zoom", (req, res) => {
  console.log(req.body);
  const meetingID = req.body.meetingID;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const accountId = req.body.accountId;
  const clientID = req.body.clientID;
  const clientSecret = req.body.clientSecret;

  // Check for null values
  if (!meetingID || !firstName || !lastName || !accountId || !clientID || !clientSecret) {
    console.log("All fields are required!");
    res.status(400).send("All fields are required!");
    return;
  }

  // Make a request to the Zoom API to get the oAuth Token
  const options = {
    url: `https://zoom.us/oauth/token?grant_type=account_credentials&account_id=${accountId}`,
    method: "POST",
    headers: {
      "Authorization": 'Basic ' + base64.encode(clientID + ":" + clientSecret),
      "Content-Type": "application/json",
    },
  };

  request(options, (err, response, body) => {
    if (err) {
      console.log(err);
      res.status(400).send("Error Getting oAuth Token:" + err);
    } else {
      if (response.statusCode === 200) {
        const responseBody = JSON.parse(body);
        const accessToken = responseBody.access_token;
        // console.log(accessToken)
        console.log("oAuth Token Received successfully");
        addMeetingReg(accessToken);
      } else {
        console.log(body);
        res.status(400).send("Error Getting oAuth Token: " + body);
      }
    }
  });

  function addMeetingReg(accessToken) {
    // Make a request to the Zoom API to add Meeting Registrant
    const options = {
      method: 'POST',
      url: `https://api.zoom.us/v2/meetings/${meetingID}/registrants`,
      headers: { 'Content-Type': 'application/json', "Authorization": "Bearer " + accessToken },
      body: JSON.stringify({
        "first_name": firstName,
        "last_name": lastName,
        "email": firstName + '.' + meetingID + "@sipmuthu.lk",
        "state": "Sri Lanka",
        "comments": "Class Link",
        "job_title": "Student",
        "org": "Sipmuthu",
        "language": "en-US",
        "auto_approve": true
      })
    };

    request(options, (err, response, body) => {
      if (err) {
        console.log(err);
        res.status(400).send("Error Adding Meeting Registrant: " + err);
      } else {
        if (response.statusCode === 201 && (response.statusMessage === "Created" || response.statusMessage === "created")) {
          const finalRes = JSON.parse(body);
          const stJoinURL = finalRes.join_url;
          console.log(`${firstName} ${lastName} Registered Successfully: ${stJoinURL}`);
          res.status(200).send({'join_link': stJoinURL});
        } else {
          console.log(body);
          res.status(400).send("Error: " + JSON.parse(body).message);
        }
      }
    });
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
