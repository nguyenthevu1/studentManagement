const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const path = require("path");

const createUser = async (data) => {
  try {
    const msv = generateMsv();
    const isExits = await checkUserEmail(data.email);

    if (isExits) {
      return {
        success: false,
        message: "Email da ton tai",
      };
    } else {
      const user = await Users.create({
        ...data,
        msv: msv,
      });

      return {
        success: true,
        user: user,
      };
    }
  } catch (e) {
    return { success: false, message: "Dang Ky that bai" };
  }
};

const handlerLogin = async (msv, pass) => {
  try {
    const user = await Users.findOne({ msv });

    if (user) {
      const match = await bcrypt.compare(pass, user.password);

      if (!match) {
        return {
          success: false,
          message: "tai khoan hoac mat khau sai",
        };
      }

      const { password, ...info } = user;

      const token = jwt.sign({ info }, "mySecret");
      return {
        success: true,
        user: info,
        token,
      };
    } else {
      return {
        success: false,
        message: "Tai khoan hoac mat khau sai ",
      };
    }
  } catch (e) {
    return e;
  }
};

const uploadAvatarUser = async (id, data, user) => {
  try {
    const currentPath = path.resolve(sails.config.appPath, "assets/images");

    if (user.isAdmin === "admin" || user.id === id) {
      const upload = data._files[0].stream,
        allowedTypes = ["image/jpeg", "image/png"],
        headers = upload.headers;

      let validated = true;
      if (!allowedTypes.includes(headers["content-type"])) {
        validated = false;
        return {
          success: false,
          message: "File khong dung dinh dang",
        };
      }

      if (validated == true) {
        const uploaded = await data.upload({
          dirname: currentPath,
        });
        if (!uploaded) {
          return {
            success: false,
            message: "khong the uploaded",
          };
        }
        await Users.update({ id }, { avatar: uploaded._files[0].stream.fd });

        return {
          success: true,
        };

        // async function (err, uploadedFiles) {
        //   if (err) return { err };
        //   console.log("upload", err);
        //   if (uploadedFiles) {
        //     await Users.update({ id }, { avatar: uploadedFiles[0].fd });
        //     console.log("upload done");
        //     return {
        //       success: true,
        //     };
        //   }
        // }
      }
    } else {
      return {
        success: false,
        message: "khong co quyen update",
      };
    }
  } catch (e) {
    return {
      success: false,
      message: "khong the upload",
    };
  }
};

const generateMsv = () => {
  const id = Math.floor(Math.random() * 1000000) + 100000;
  return id;
};

const handlerUpdateUser = async (id, data, user) => {
  try {
    const isExits = await checkUserEmail(data.email);

    console.log({ ...data });
    if (isExits) {
      return { success: false, message: "Email da ton tai" };
    }
    if (user.isAdmin === "admin" || user.id === id) {
      await Users.update({ id }, { ...data });
      return {
        success: true,
      };
    } else {
      return {
        success: false,
        message: "khong co quyen 123",
      };
    }
  } catch (e) {
    return e;
  }
};

const checkUserEmail = async (email) => {
  try {
    const user = await Users.findOne({ email });
    if (user) {
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
  createUser,
  handlerLogin,
  handlerUpdateUser,
  uploadAvatarUser,
};
