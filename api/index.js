export const runtime = 'edge';

export default async function handler(req) {
  const { searchParams } = new URL(req.url);
  const user = searchParams.get('user');
  const t = searchParams.get('t');
  const sign = searchParams.get('sign');

  try {
    const apiRes = await fetch(`https://th666.co/?user=${encodeURIComponent(user)}&t=${t}&sign=${sign}`);
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
