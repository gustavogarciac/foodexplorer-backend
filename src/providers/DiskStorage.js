const fs = require("fs");
const path = require("path");
const uploadsConfig = require("../configs/upload");

class DiskStorage {
  async saveFile(file) {
    //This method is responsible for changing the image folder from tmp_folder to uploads_folder
    await fs.promises.rename(
      path.resolve(uploadsConfig.TMP_FOLDER, file),
      path.resolve(uploadsConfig.UPLOADS_FOLDER, file)
    );

    return file;
  }

  async deleteFile(file) {
    const filePath = path.resolve(uploadsConfig.UPLOADS_FOLDER, file);

    try {
      await fs.promises.stat(filePath); // Responsible for returning the file status
    } catch {
      return;
    }

    await fs.promises.unlink(filePath); // This is responsible for actually deleting the file.
  }
}

module.exports = DiskStorage;
