module.exports = (tokens, req, res) => {
  const format = [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'),
    '-',
    tokens['response-time'](req, res),
    'ms'
  ];

  if (req.method === 'POST') {
    const { name, number } = req.body;
    format.push(JSON.stringify({ name, number }));
  }

  return format.join(' ');
};
