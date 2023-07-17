<!DOCTYPE html>
<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Test Meeting Registration</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@100;200;300;400;500;600;700;800;900&display=swap" rel="stylesheet">
<style>
body {
    padding: 2% 20%;
    font-family: 'Outfit'}
    * {box-sizing: border-box;}

input[type=text], select, textarea {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
  margin-top: 6px;
  margin-bottom: 16px;
  resize: vertical;
}

button {
  width: 100%;
  background-color: #2851a8;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

button:hover {
  background-color: #4562a0;
}

.container {
  border-radius: 5px;
  background-color: #f2f2f2;
  padding: 20px;
}

.topic {
  font-size: 20px;
}
</style>
</head>
<body>

<h4 class="topic"><center>Test Meeting Registration</center></h4>

<div class="container">
  <form>
    <label for="fname">First Name</label>
    <input type="text" id="fname" name="firstname" placeholder="Your first name..">

    <label for="lname">Last Name</label>
    <input type="text" id="lname" name="lastname" placeholder="Your last name..">

    <label for="lname">Meeting ID</label>
    <input type="text" id="mid" name="mid" placeholder="Your Meeting ID..">

    <label for="accountId">Zoom Account ID</label>
    <input type="text" id="accountId" name="accountId" placeholder="Your Zoom Account ID">

    <label for="clientID">Zoom Client ID</label>
    <input type="text" id="clientID" name="clientID" placeholder="Your Zoom Client ID">

    <label for="clientSecret">Zoom Client Secret</label>
    <input type="text" id="clientSecret" name="clientSecret" placeholder="Your Zoom Client Secret">

    <button type="submit" value="Submit" id="submit">Submit</button>
  </form>
</div>
<script>
    document.getElementById("submit").addEventListener("click", function(event){
        event.preventDefault()
        meetingID = document.getElementById('mid').value
        firstName = document.getElementById('fname').value
        lastName = document.getElementById('lname').value
        accountId = document.getElementById('accountId').value
        clientID = document.getElementById('clientID').value
        clientSecret = document.getElementById('clientSecret').value

        const xhr = new XMLHttpRequest();
        xhr.open("POST", "https://sipmuthu-zoom.onrender.com/zoom");
        xhr.setRequestHeader("Content-Type", "application/json");

        const data = {
          meetingID: meetingID,
          firstName: firstName,
          lastName: lastName,
          accountId: accountId,
          clientID: clientID,
          clientSecret: clientSecret
        };

        xhr.send(JSON.stringify(data));

        xhr.onload = function() {
        if (xhr.status === 200) {
            const response = xhr.responseText;
            console.log(xhr.responseText);
            join_link = (JSON.parse(response))["join_link"]
            alert("Registrant created successfully.\nJoin link: " + join_link);
            window.open(join_link)
        } else {
            const error = xhr.responseText;
            alert("Error creating registrant\n" + error);
        }
        };

    });
</script>
</body>
</html>
