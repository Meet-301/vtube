import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
   try {
      if (!localFilePath) return null;

      //! cloudinary file upload
      const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto",
      });

      //! after successful file upload
      fs.unlinkSync(localFilePath)
      return response;
   } catch (error) {
      fs.unlinkSync(localFilePath); //! remove the file from local server as the upload operation failure
      return null;
   }
};

export default uploadOnCloudinary;
