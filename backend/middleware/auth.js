const jwt = require("jsonwebtoken");

// Middleware to verify if a user is logged in
const verifyToken = (req, res, next) => {
  // Get the token from the request headers
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).json({ msg: "No token provided, access denied!" });
  }

  try {
    // Decode the token using our secret key
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach the user details (like ID and Role) to the request
    next(); // Move on to the next function/route
  } catch (err) {
    return res.status(401).json({ msg: "Invalid token, access denied!" });
  }
};

// Middleware to check if the user is a CareManager
const isCareManager = (req, res, next) => {
  if (req.user && req.user.role === "CareManager") {
    next(); // User is CareManager, allow access
  } else {
    return res.status(403).json({ msg: "Requires CareManager Privileges!" });
  }
};

module.exports = { verifyToken, isCareManager };
