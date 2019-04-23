const http = require('http');
const express = require('express');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const bodyParser = require('body-parser');
const schedule = require('node-schedule');


const app = express();
app.use(bodyParser.urlencoded({extended : false}));
let pingPongCalendar = {values : []};

let timeRegex = /(1[012]|[1-9]):[03][0](\\s)?/g;

schedule.scheduleJob('0 0 * * *', function(){
  pingPongCalendar.clear();
});

const isValidTime = function(requestedTime){
  let currentTime = new Date();
  currentTime = currentTime.toLocaleTimeString();
  if(requestedTime >= currentTime)
    return true
  return false
}

const bookSlot = function(sender, time, name,message){
  let isAlreadyScheduled = false;
  let hasConflict = false;
  let arr = pingPongCalendar.values;
  for(var i=0 ; i < arr.length ; i++){
    if(arr[i].time == time){
      hasConflict = true;
      break;
    }
    if(arr[i].sender == sender || arr[i].name == name ){
      isAlreadyScheduled = true;
      break;
    }
  }
  if(isAlreadyScheduled && hasConflict){
    message.body('Didnt you already reserved once today ?');
    message.body('https://media.giphy.com/media/Bl7bFllnm3M8E/giphy.gif');
  }
  else if(hasConflict){
    message.body('Someone has the room reserved :(');
    message.media('https://media.giphy.com/media/nPlCNphD1St1e/giphy.gif');
  }
  else if(isAlreadyScheduled){
    message.body('You already had one chance !');
    message.media('https://media.giphy.com/media/TyYRR5oCqIzPq/giphy.gif');
  }
  else{
    let newEntry = {time : new Date(time).toLocaleTimeString() , name : name, sender : sender};
    pingPongCalendar.values.push(newEntry);
    message.body('You are all set.Be on time because..');
    message.media('https://media.giphy.com/media/a96aV981RJ4je/giphy.gif');
  }
}

const grabReqTime = function(reqMessage){
  let d = new Date();
  let requestedTime = reqMessage.match(timeRegex)[0] + ':00';
  let m_d = reqMessage.split(" ")[1]
  requestedTime = requestedTime + " " + m_d
  requestedTime = d.toDateString() + ' ' + requestedTime;
  let name = reqMessage.split(" ");
  name = name[name.length-1].toLowerCase();
  return {requestedTime : requestedTime, name : name};
}


app.post('/sms', (req, res) => {
  const twiml = new MessagingResponse();
  const message = twiml.message();
  let reqMessage = req.body.Body.trim();
  let sender = req.body.From;

  if(reqMessage.includes('Hi') || reqMessage.includes('Hello') ||reqMessage.includes('Yes')){
    message.body('Lets start your scheduling. What time would you like to play ping pong?');
  }
  else if(reqMessage.match(timeRegex) != null && reqMessage.match(timeRegex).length === 1){
    let reqInfo = grabReqTime(reqMessage);
    if(isValidTime(reqInfo.requestedTime)){
      bookSlot(sender, reqInfo.requestedTime, reqInfo.name, message);
    }
    else{
      message.body('Whoa check the time friend');
      message.media('https://media.giphy.com/media/eGNPC9HNmMS4M/giphy.gif');
    }
  }
  else{
    message.body('Maybe try again in proper format ? \n HH:MM <AM/PM> <YourName> is the correct format. Make sure you give 30 minute timeslots.');
    message.media('https://media.giphy.com/media/PPjWj1sfqKcyz3lE6F/giphy.gif');
  }


  res.writeHead(200, {'Content-Type': 'text/xml'});
  res.end(twiml.toString());
});

app.get('/', (req, res) =>{
  res.send(pingPongCalendar);
});

http.createServer(app).listen(1337, () => {
  console.log('Express server listening on port 1337');
});
