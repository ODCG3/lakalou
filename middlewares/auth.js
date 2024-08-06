import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    // Extraire le token des cookies de la requête
    const token = req.cookies.token || null;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        // Vérifier et décoder le token JWT
        const decoded = jwt.verify(token, process.env.TokenKey);

        // Assigner les informations de l'utilisateur à req.user
        req.user = decoded; 
        next();
    } catch (error) {
        console.error('Token verification failed', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
