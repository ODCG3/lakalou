import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

export default (req, res, next) => {
    // Extraire le token des en-têtes de la requête
    console.log(req.cookies);
    const token = req.cookies.token ? req.cookies.token : null;

    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error('Token verification failed', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};
