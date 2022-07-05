const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const createStudent = async (data) => {
  try {
    const msv = generateMsv();
    const isExits = await checkStudentEmail(data.email);

    if (isExits) {
      return {
        success: false,
        message: "Email da ton tai",
      };
    } else {
      const student = await Student.create({
        ...data,
        msv: msv,
      });

      return {
        success: true,
        student: student,
      };
    }
  } catch (e) {
    return { success: false, message: "Dang Ky that bai" };
  }
};

const handlerLogin = async (msv, pass) => {
  try {
    const student = await Student.findOne({ msv });
    if (student) {
      const match = await bcrypt.compare(pass, student.password);

      if (!match) {
        return {
          success: false,
          message: "tai khoan hoac mat khau sai",
        };
      }

      const { password, ...info } = student;

      const token = jwt.sign({ info }, "mySecret");
      return {
        success: true,
        student: info,
        token,
      };
    }
  } catch (e) {
    return e;
  }
};

const generateMsv = () => {
  const id = Math.floor(Math.random() * 1000000) + 100000;
  return id;
};

const handlerUpdateStudent = async (id, data) => {
  try {
    const isExits = await checkStudentEmail(data.email);

    if (isExits) {
      return { success: false, message: "Email da ton tai" };
    }

    await Student.update({ id }, { ...data });

    return {
      success: true,
    };
  } catch (e) {
    return e;
  }
};

const checkStudentEmail = async (email) => {
  try {
    const student = await Student.findOne({ email });
    if (student) {
      return true;
    } else {
      return false;
    }
  } catch (e) {
    return e;
  }
};

module.exports = {
  generateMsv,
  createStudent,
  handlerLogin,
  handlerUpdateStudent,
};
