import jwt from 'jsonwebtoken';

export default (req, res, next) => {
    // pull token out of header
    const token = req.header('x-auth-token')

    if (!token) {
        // return unauthorized error
        return res.status(401).json({errors: [{msg: 'No Token, Auth Denied' }] });
    }

    try {
        const decoded = jwt.verify(token, process.env.jswtSecret);
        req.user = decoded.user;
        next()
    } catch (error) {
        console.error(error);
        res.status(401).json({errors: [{msg: 'Token is not valid'}] });
    }
}