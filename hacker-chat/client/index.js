#!/usr/bin/env node

/*

    chmod +x index.js

*/

/*

npm i -g @Douglas/hacker-chat-client

npm unlink -g @Douglas/hacker-chat-client
hacker-chat \
    --username Douglas\
    --room sala01

./index.js \
    --username Douglas \
    --room sala01

node index.js \
    --username Douglas \
    --room sala01 \
    --hostUri localhost
*/

import Events from 'events';
import CliConfig from './src/cliConfig.js';
import EventManager from './src/eventManager.js';
import SocketClient from './src/socker.js';
import TerminalController from './src/terminalController.js';

/* async function testServer() {
  const options = {
    port: 9898,
    host: 'localhost',
    headers: {
      Connection: 'Upgrade',
      Upgrade: 'websocket',
    },
  };

  const http = await import('http');
  const req = http.request(options);
  req.end();

  req.on('upgrade', (req, socket) => {
    socket.on('data', (data) => {
      console.log('client receveid', data.toString());
    });

    setInterval(() => {
      socket.write('Hello!');
    }, 500);
  });
} */

const [nodePath, filePath, ...commands] = process.argv;
const config = CliConfig.parseArguments(commands);

const componentEmitter = new Events();
const socketClient = new SocketClient(config);
await socketClient.initialize();
const eventManager = new EventManager({ componentEmitter, socketClient });
const events = eventManager.getEvents();
socketClient.attachEvents(events);

const data = {
  roomId: config.room,
  userName: config.username,
};
eventManager.joinRoomAndWaitForMessages(data);

/* 
eventEmitter.on(constants.event.NEW_USER_CONNECTED, (socket) => {
eventEmitter.on(constants.event.NEW_USER_CONNECTED, (socket) => {
  console.log('new connection!!', socket.id);
  socket.on('data', (data) => {
    console.log('server receveid', data.toString());
    socket.write('World!');
  });
});
*/

const controller = new TerminalController();
await controller.initializeTable(componentEmitter);
