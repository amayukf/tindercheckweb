export const runtime = 'edge';

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username') || searchParams.get('user');

  try {
    const apiRes = await fetch(`https://vvip.tinderfz.com/api.php?username=${encodeURIComponent(username)}`);
    const data = await apiRes.json();
    
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
