import jwt from 'jsonwebtoken';

const SECRET_KEY = 's3cr3t';

const auth = async (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const decodedData = jwt.verify(token, SECRET_KEY);

        req.userId = decodedData?.id;
        req.userRole = decodedData?.role;

        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
};

export default auth;
