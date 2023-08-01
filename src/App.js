import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { TextField, Button, Box, List, ListItem, Typography, Container } from '@mui/material';
import { deepPurple, grey } from '@mui/material/colors';

const SERVER = 'http://127.0.0.1:4001';

function App() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [id] = useState(uuidv4());
  const [username, setUsername] = useState('');
  const [isLogged, setIsLogged] = useState(false);

  const pollServer = () => {
    axios
      .get(`${SERVER}/poll/${id}`)
      .then((response) => {
        setMessages((messages) => [...messages, ...response.data]);
        pollServer();
      })
      .catch((error) => {
        console.error('Error during poll', error);
        setTimeout(pollServer, 2000);
      });
  };

  const sendMessage = (e) => {
    e.preventDefault();
    axios.post(`${SERVER}/send`, { message: `${username}: ${message}` });
    setMessage('');
  };

  const login = (e) => {
    e.preventDefault();
    setIsLogged(true);
    pollServer();
  };

  if (!isLogged) {
    return (
      <Container maxWidth="sm">
        <Box my={4}>
          <form onSubmit={login}>
            <TextField
              fullWidth
              required
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              variant="outlined"
            />
            <Box mt={2}>
              <Button fullWidth type="submit" variant="contained" color="primary">Enter Chat</Button>
            </Box>
          </form>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Box my={4}>
        <Typography variant="h6">Typing as: {username}</Typography>
        <List>
          {messages.map((message, index) => (
            <ListItem key={index} style={{ background: message.startsWith(username) ? deepPurple[100] : grey[300], marginBottom: '10px', borderRadius: '5px' }}>
              <Typography>{message}</Typography>
            </ListItem>
          ))}
        </List>
        <form onSubmit={sendMessage}>
          <Box mt={2} display="flex">
            <TextField
              fullWidth
              label="Message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              variant="outlined"
            />
            <Box ml={2}>
              <Button type="submit" variant="contained" color="primary">Send</Button>
            </Box>
          </Box>
        </form>
      </Box>
    </Container>
  );
}

export default App;
