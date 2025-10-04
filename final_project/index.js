const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Session middleware
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));

// 🔐 Authentication middleware
app.use("/customer/auth/*", function auth(req, res, next) {
  if (!req.session || !req.session.authorization) {
    return res.status(403).json({ message: "User not logged in" });
  }

  const token = req.session.authorization.accessToken;

  try {
    const decoded = jwt.verify(token, "access"); // Use your secret key here or from .env
    req.user = decoded; // Attach decoded token data to request
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid or expired token" });
  }
});

// Route handlers
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server is running at ${PORT}`));
