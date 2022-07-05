"use strict";
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || "mySecret", (err, decode) => {
      if (err) {
        res.status(401).send({ message: authorization });
      } else {
        req.student = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
