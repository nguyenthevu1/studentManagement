/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const {
  createUser,
  handlerLogin,
  handlerUpdateUser,
  uploadAvatarUser,
} = require("../services/userService");

module.exports = {
  create: async function (req, res) {
    if (req.body.email === " " || !req.body.email) {
      res.status(400).json({
        message: "Email khong duoc bo trong",
      });
    } else {
      const user = await createUser(req.body);
      return res.status(200).json({
        user,
      });
    }
  },

  login: async function (req, res) {
    const { msv, password } = req.body;
    if (!msv || msv === " ") {
      res.status(400).json({
        message: "Ma sinh vien khong duoc bo trong",
      });
    }
    if (!password || password === " ") {
      res.status(400).json({
        message: "Mat khau khong duoc bo trong",
      });
    }

    const user = await handlerLogin(msv, password);

    res.status(200).json(user);
  },

  getAllUser: async function (req, res) {
    const { hoTen, lop, tinh, xa, huyen } = req.query;

    // console.log(req.query);

    const users = await Users.find({
      or: [{ hoTen }, { lop }, { tinh }, { xa }, { huyen }],
    });

    res.status(200).json({
      success: true,
      users,
    });
  },

  getSingleUser: async function (req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        res.status(400).json({ success: false, message: "User khong ton tai" });
      }

      const user = await Users.findOne({ id });
      const { password, ...info } = user;

      res.status(200).json({
        success: true,
        user: info,
      });
    } catch (e) {
      res.status(500).json({ success: false, message: "User khong ton tai" });
    }
  },

  updateUser: async function (req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ success: false, message: "User khong ton tai" });
      }

      const user = await Users.findOne({ id });

      if (!user) {
        res.status(400).json({ success: false, message: "User khong ton tai" });
      }

      const newUser = await handlerUpdateUser(id, req.body, req.user);

      res.status(200).json({
        newUser,
      });
    } catch (e) {
      res.status(500).json({ success: false, message: "User khong ton tai" });
    }
  },

  deleteUser: async function (req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        res.status(400).json({ success: false, message: "User khong ton tai" });
      }

      await User.destroy({ id: id });

      res.status(200).json({
        success: true,
      });
    } catch (e) {
      res.status(500).json({
        success: false,
      });
    }
  },

  uploadAvatar: async function (req, res) {
    try {
      const id = req.params.id;
      const uploaded = await uploadAvatarUser(id, req.file("avatar"), req.user);
      res.status(200).json({
        uploaded,
      });
    } catch (e) {
      res.status(5000).json({ e });
    }
  },
};
