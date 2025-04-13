import jwt from "jsonwebtoken";

//* validate jwt token

export const authenticateToken = (req, res, next) => {
  const auth = req.headers.authorization;

  if (!auth || !auth.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized, JWT Token is required",
    });
  }

  const token = auth.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.AUTH_TOKEN);
    req.user = decoded;
    console.log(decoded);
    next();
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};
