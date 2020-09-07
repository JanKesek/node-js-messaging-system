const express = require('express');
const webpush = require('web-push');
//const https = require('https');
const readline = require('readline-promise').default;
const fs=require('fs').promises
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)


const init = async () => {
  const keyFile = await fs.readFile('keys.txt','utf8'); 
  const keys= keyFile.split('\r\n').filter(Boolean);

  const privateVapidKey=keys[0]
  const publicVapidKey = 'BIDzYuSnEsuZo3XU5jdB6avGVODC4wIqB62PpGWCDm5V4fEiBDUg-xnDx0EiKGfODz7NXbCRiLfSrfXNz_XAOVU';

  // Replace with your email
  webpush.setVapidDetails('mailto:admin@domain.com', publicVapidKey, privateVapidKey);
  webpush.setGCMAPIKey(keys[1]);
  const app = express();

  //const key = fs.readFileSync('./key.pem');
  //const cert = fs.readFileSync('./cert.pem');



  //const server = https.createServer({key: key, cert: cert }, app);
  app.use(require('body-parser').json());


  app.get("/",(req,res) => {
    res.sendFile(__dirname + "/news.html");
  })
  app.get("/sub",(req,res)=> {
    res.sendFile(__dirname+"/sub.html")
  })
  app.post('/subscribe', (req, res) => {
    const subscription = req.body;
    //const subs= db.get("subscriptions").push(subscription).write()
    console.log("SUBSCRIBING")
    const doesExist = db.get("subscriptions").find(subscription).value()
    if(typeof(doesExist)==='undefined') {
      console.log("NEW SUB ADDED: ",subscription)
      db.get("subscriptions").push(subscription).write()
    }
    res.status(201).json({});
    //const payload = JSON.stringify({ title: 'test' });

    //console.log(subscription);

  });
  app.post('/send',(req,res) => {
    const msg={title:req.body.body};
    //const smsg=JSON.stringify(msg)
    const smsg=JSON.stringify(msg);
    console.log(smsg);
    const subs= db.get("subscriptions").value();
    for(let subscription of subs) {
      webpush.sendNotification(subscription, smsg).catch(error => {console.error(error.stack);});
    }
    msg.date=req.body.date;
    db.get("messages").push(msg).write()
    res.status(201).json({})
  });
  /*
  app.get("/news2",() => {
    return db.get("messages").value().map(v=> html`<h1> ${v.date} </h1> <p> ${v.title}</p> `)
  })
  */
  app.use(require('express-static')('./'));

  app.listen(3000, () => {console.log("Listen on port 3000")});

}
init()
//server.listen(3000, () => { console.log('listening on 3000') });
