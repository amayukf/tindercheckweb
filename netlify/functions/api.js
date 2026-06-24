const https = require('https');

exports.handler = async (event) => {
  const { username, user } = event.queryStringParameters || {};
  const targetUsername = username || user;
  const targetUrl = `https://vvip.tinderfz.com/api.php?username=${encodeURIComponent(targetUsername)}`;

  try {
    const data = await new Promise((resolve, reject) => {
      let responseData = '';
      https.get(targetUrl, (resp) => {
        resp.on('data', (chunk) => {
          responseData += chunk;
        });
        resp.on('end', () => {
          try {
            resolve(JSON.parse(responseData));
          } catch (e) {
            resolve(responseData);
          }
        });
      }).on('error', reject);
    });

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify(data),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ error: 'Failed to fetch' }),
    };
  }
};
