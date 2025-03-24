import { useState } from "react";

const CLOUDINARY_NAME = "dow7paiip";
const UPLOAD_PRESET = "trave-logs";
const TRANSFORM_CONFIG = "w_800,q_40";

const useImageUpload = () => {
  const [images, setImages] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);
  const [isUploaded, setIsUploaded] = useState(false);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const selectedImages = e.target.files;
    // console.log(selectedImages, "selectedImages");
    if (selectedImages) {
      const selectedImagesToArray = Array.from(selectedImages);
      setImages((prev) => {
        return [...prev, ...selectedImagesToArray];
      });
    }
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      return setError("no image selected");
    }
    setIsUploading(true);
    setError(null);
    setUploadedUrls([]);
    setIsUploaded(false);

    const uploadImages = images.map(async (file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", UPLOAD_PRESET);

      try {
        const res = await fetch(
          `https://api.cloudinary.com/v1_1/${CLOUDINARY_NAME}/upload`,
          {
            method: "POST",
            body: formData,
          }
        );
        const data = await res.json();
        const transformedUrl = data.secure_url.replace(
          "/upload/",
          `/upload/${TRANSFORM_CONFIG}/`
        );
        return transformedUrl;
      } catch (err) {
        setError("error uploading images");
        throw err;
      }
    });

    try {
      const urls = await Promise.all(uploadImages);
      setUploadedUrls(urls);
      setIsUploaded(true);
    } catch (error) {
      console.log(error);
    } finally {
      setIsUploading(false);
    }
  };

  //   console.log(uploadedUrls, "uploadedUrls");

  return {
    images,
    isUploading,
    uploadedUrls,
    error,
    handleImageChange,
    uploadImages,
    isUploaded,
  };
};

export default useImageUpload;
