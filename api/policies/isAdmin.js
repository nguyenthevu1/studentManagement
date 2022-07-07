"use strict";
const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET || "mySecret", (err, decode) => {
      if (err) {
        res.status(401).send({ message: 12345 });
      } else {
        req.user = decode.info;
        if (req.user.isAdmin === "admin") {
          next();
        } else {
          res.status(400).send({ message: "khong co quyen " });
        }
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};
