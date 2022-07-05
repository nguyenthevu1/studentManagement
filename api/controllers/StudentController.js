/**
 * StudentController
 *
 * @description :: Server-side logic for managing students
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const {
  createStudent,
  handlerLogin,
  handlerUpdateStudent,
} = require("../services/studentService");

module.exports = {
  create: async function (req, res) {
    if (req.body.email === " " || !req.body.email) {
      res.status(400).json({
        message: "Email khong duoc bo trong",
      });
    } else {
      const student = await createStudent(req.body);
      return res.status(200).json({
        student,
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
    const student = await handlerLogin(msv, password);

    res.status(200).json(student);
  },

  getAllStudent: async function (req, res) {
    let queryStr = { ...req.query };
    console.log(queryStr);
    // const students = await Student.find({
    //   or: [{ hoTen: queryStr.hoTen }, { email: queryStr.email }],
    // });
    // console.log(students);

    // res.status(200).json({
    //   success: true,
    //   students,
    // });
  },

  getSingleStudent: async function (req, res) {
    try {
      const id = req.params.id;
      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Student khong ton tai" });
      }

      const student = await Student.findOne({ id });
      const { password, ...info } = student;
      res.status(200).json({
        success: true,
        student: info,
      });
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: "Student khong ton tai" });
    }
  },

  updateStudent: async function (req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Student khong ton tai" });
      }

      const student = await Student.findOne({ id });

      if (!student) {
        res
          .status(400)
          .json({ success: false, message: "Student khong ton tai" });
      }

      const newStudent = await handlerUpdateStudent(id, req.body);

      res.status(200).json({
        newStudent,
      });
    } catch (e) {
      res
        .status(500)
        .json({ success: false, message: "Student khong ton tai" });
    }
  },

  deleteStudent: async function (req, res) {
    try {
      const id = req.params.id;

      if (!id) {
        res
          .status(400)
          .json({ success: false, message: "Student khong ton tai" });
      }

      await Student.destroy({ id: id });

      res.status(200).json({
        success: true,
      });
    } catch (e) {
      res.status(500).json({
        success: false,
      });
    }
  },
};
