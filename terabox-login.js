const axios = require('axios');
const fs = require('fs');
const qs = require('querystring');

const loginUrl = 'https://www.1024terabox.com/login';  // Replace with actual TeraBox login URL

// Get username and password from environment variables
const username = process.argv[2];
const password = process.argv[3];

async function loginAndExtractCookie() {
  try {
    const loginPayload = {
      username,
      password
    };

    const response = await axios.post(loginUrl, qs.stringify(loginPayload), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36'
      },
      withCredentials: true
    });

    const cookies = response.headers['set-cookie'];

    if (cookies) {
      const cookieJson = {
        cookies: cookies.map(cookie => {
          const cookieParts = cookie.split(';');
          return cookieParts[0];  // Save only the name=value part of the cookie
        })
      };

      fs.writeFileSync('terabox_cookie.json', JSON.stringify(cookieJson, null, 2));
      console.log('Cookie extraction successful.');
    } else {
      console.error('No cookies received.');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
}

loginAndExtractCookie();
