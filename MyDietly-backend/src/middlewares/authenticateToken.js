import jwt from 'jsonwebtoken';

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) {
    return res.status(401).json({ message: 'Token não fornecido.' });
  }

  if (!authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Formato de token inválido.' });
  }

  console.log("RECEBENDO requisição com o cabeçalho:", authHeader);
  jwt.verify(token, process.env.JWT_SECRET, (err, userPayload) => {
     console.log("VERIFICANDO token com a chave:", process.env.JWT_SECRET);
    if (err) {
      console.error("ERRO na verificação do JWT:", err.message);
      return res.status(403).json({ message: 'Token inválido ou expirado.' });
    }
    req.userId = userPayload.userId;
    next();
  });
};

export default authenticateToken;