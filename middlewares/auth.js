import jwt from 'jsonwebtoken';


export default (req, res, next) => {
    const token = req.cookies.token ? req.cookies.token : null;
    //console.log(token);
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }

    try {
        const decoded = jwt.verify(token, process.env.TokenKey);
        req.user = decoded; 
        next();
    } catch (error) {
        console.error('Token verification failed', error);
        res.status(401).json({ message: 'Token is not valid' });
    }
};