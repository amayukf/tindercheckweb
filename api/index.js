const fetch = require('node-fetch');

module.exports = async (req, res) => {
  try {
    const { user, t, sign } = req.query;
    const apiRes = await fetch(`https://tinder6.com/getUser.php?user=${encodeURIComponent(user)}&t=${t}&sign=${sign}`);
    const data = await apiRes.json();
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.status(200).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch' });
  }
};
