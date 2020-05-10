import rateLimit from "express-rate-limit";

export const emailPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // start blocking after 5 requests
  message: "You have added too many emails.",
});
