import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { extractPublicId } from "cloudinary-build-url";

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadFromUrl = async (remoteUrl) => {
   try {
      if (!remoteUrl) return null;

      return await cloudinary.uploader.upload(remoteUrl, {
         resource_type: "image",
      });
   } catch (error) {
      console.log(error?.message);
      return null;
   }
};

const uploadOnCloudinary = async (localFilePath, options = {}) => {
   try {
      if (!localFilePath) return null;

      //! cloudinary file upload
      const response = await cloudinary.uploader.upload(localFilePath, {
         resource_type: "auto",
         ...options, //! like { type: "authenticated" }
      });

      //! after successful file upload
      fs.unlinkSync(localFilePath);
      return response;
   } catch (error) {
      if (fs.existsSync(localFilePath)) fs.unlinkSync(localFilePath);
      return null;
   }
};

const deleteFromCloudinary = async (
   cloudinaryUrlOrPublicId,
   resource_type = "image",
   type = "upload"
) => {
   if (!cloudinaryUrlOrPublicId) return null;

   try {
      //! If there's a URL then extract its public id
      const publicId = cloudinaryUrlOrPublicId.startsWith("http")
         ? extractPublicId(cloudinaryUrlOrPublicId)
         : cloudinaryUrlOrPublicId;

      await cloudinary.uploader.destroy(publicId, {
         resource_type,
         type,
      });

      return true;
   } catch (error) {
      console.log(error?.message);
      return false;
   }
};

export {uploadOnCloudinary, deleteFromCloudinary, uploadFromUrl};