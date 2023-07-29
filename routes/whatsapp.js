const express = require('express');
const router = express.Router();

const { Client } = require('whatsapp-web.js');
const client = new Client();
const qrcode = require('qrcode-terminal');

client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

client.on('ready', () => {
  console.log('WA Ready');
  const number = '62' + '87816462666' + '@c.us';
  console.log(number);
  const msg = 021021;
  client.sendMessage(number, msg).then((res) => {
    console.log('Message sent to ' + number);
  });
});

client.initialize();

router.get('/', (req, res) => {
  res.send('Hehe');
});

router.post('/verify', (req, res) => {
  if (req.body.number === '021021') {
    return res.send({ status: 'success' });
  }
  res.statusCode(400).send({ status: 'error' });
});

router.post('/send-otp', (req, res) => {
  const number = '62' + req.body.number + '@c.us';
  const msg = '021021';
  client.sendMessage(number, msg).then((res) => {
    console.log('Message sent to ' + number);
  });
  res.send('Otp Sent');
});

module.exports = router;
