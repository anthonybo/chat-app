const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());
app.use(express.json());

let messages = [];
let clients = {};

app.get('/poll/:id', (req, res) => {
  const id = req.params.id;
  if (!clients[id]) {
    clients[id] = 0;
  }

  if (messages.length > clients[id]) {
    res.send(messages.slice(clients[id]));
    clients[id] = messages.length;
  } else {
    setTimeout(checkForNewMessages, 1000, res, id);
  }
});

function checkForNewMessages(res, id) {
  if (messages.length > clients[id]) {
    res.send(messages.slice(clients[id]));
    clients[id] = messages.length;
  } else {
    setTimeout(checkForNewMessages, 1000, res, id);
  }
}

app.post('/send', (req, res) => {
  messages.push(req.body.message);
  res.sendStatus(200);
});

const port = process.env.PORT || 4001;
app.listen(port, () => console.log(`Server running on port ${port}`));
