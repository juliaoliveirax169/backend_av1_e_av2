import jwt from 'jsonwebtoken';

export default function auth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido.' });

  const [tipo, token] = authHeader.split(' ');
  if (tipo !== 'Bearer' || !token) return res.status(401).json({ error: 'Token mal formatado.' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.clienteId = payload.id;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}
