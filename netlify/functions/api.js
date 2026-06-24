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
            const apiData = JSON.parse(responseData);
            // Transform the API response to match the expected format
            const transformedData = {
              alive: apiData.code === 200 && apiData.data ? true : false,
              accountOk: apiData.code === 200 && apiData.data ? true : false,
              name: apiData.data?.name || null,
              age: apiData.data?.age ? parseInt(apiData.data.age) : null,
              birthDate: apiData.data?.birthday || null,
              regtime: apiData.data?.create_time || null,
              photos: apiData.data?.photos || []
            };
            resolve(transformedData);
          } catch (e) {
            resolve({ error: 'Invalid response format' });
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
