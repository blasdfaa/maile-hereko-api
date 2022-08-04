import jwt from "jsonwebtoken";

export default (req, res, next) => {
  const token = (req.headers.authorization || "").replace(/Bearer\s?/, "");

  if (!token) return res.status(401).json({ ok: false, message: "Access denied" });

  try {
    const decodedToken = jwt.verify(token, "secret");

    req.userId = decodedToken.id;
    next();
  } catch (error) {
    console.log("error: ", error);
    return res.status(401).json({ ok: false, message: "Access denied" });
  }
};
