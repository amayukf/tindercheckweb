export const runtime = 'edge';

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || searchParams.get('user');

  try {
    const apiRes = await fetch(`https://vvip.tinderfz.com/api.php?username=${encodeURIComponent(username)}`);
    const apiData = await apiRes.json();
    
    // Transform the API response to match the expected format
    const data = {
      alive: apiData.code === 200 && apiData.data ? true : false,
      accountOk: apiData.code === 200 && apiData.data ? true : false,
      name: apiData.data?.name || null,
      age: apiData.data?.age ? parseInt(apiData.data.age) : null,
      birthDate: apiData.data?.birthday || null,
      regtime: apiData.data?.create_time || null,
      photos: apiData.data?.photos || []
    };
    
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: 'Failed to fetch' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
}
