const rateLimit = require('express-rate-limit');

// Global API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 05 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per 15 minutes
  message: "Too many requests, please try again later.",
});

// Login Rate Limiter
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit to 5 login attempts per 10 minutes
  message: "Too many login attempts. Please try again after 10 minutes.",
});

// Registration Rate Limiter
const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // Limit to 5 registration attempts per 10 minutes
  message: "Too many registration attempts. Please try again after an hour.",
});

module.exports = { apiLimiter, loginLimiter, registerLimiter };
