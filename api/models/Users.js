/**
 * Student.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */
const bcrypt = require("bcrypt");
module.exports = {
  attributes: {
    msv: { type: "string", required: true, unique: true },
    hoTen: { type: "string", required: true },
    ngaySinh: { type: "string", required: true },
    lop: { type: "string", required: true },
    email: { type: "string", required: true, unique: true },
    password: { type: "string", required: true },
    tinh: { type: "string" },
    huyen: { type: "string" },
    xa: { type: "string" },
    isAdmin: { type: "string", defaultsTo: "user" },
    avatar: {
      type: "string",
      defaultsTo:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-icon-vector-social-media-user-photo-183042379.jpg",
    },
  },

  beforeCreate: function (user, cb) {
    bcrypt.hash(user.password, 10, function (err, hash) {
      if (hash) {
        user.password = hash;
        return cb(null, hash);
      }

      if (err) {
        return cb(err);
      }
    });
  },

  // comparePass: function (password, student) {
  //   bcrypt.compare(password, student.password, function (err, match) {
  //     if (err) {
  //       return err;
  //     }
  //     if (match) {
  //       return true;
  //     } else {
  //       return false;
  //     }
  //   });
  // },
};
