const ngrok = require('ngrok');
const port = process.env.PORT || 5000;

(async function() {
  try {
    const url = await ngrok.connect({
      proto: 'http',
      addr: port,
      authtoken: process.env.NGROK_AUTH_TOKEN
    });
    console.log('Ngrok tunnel is active! URL:', url);
    console.log('You can access your app through this URL from anywhere');
  } catch (err) {
    console.error('Error while connecting to ngrok:', err);
  }
})(); 