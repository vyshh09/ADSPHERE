const fs = require("fs")

const renameFile = (defaultImagePath, newImagePath) => {
    if (fs.existsSync(defaultImagePath)) {
      fs.rename(defaultImagePath, newImagePath, (err) => {
        if (err) {
          console.error("Error renaming file:", err);
        } else {
          // console.log("File renamed successfully!");
        }
      });
    } else {
      console.log("Default image file does not exist.");
    }
}

module.exports = renameFile;
