import { useState } from "react";
import { GrFormUpload } from "react-icons/gr";

const FileUpload = ({ label = "Upload File", onChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onChange?.(file); 
    }
  };

  return (
    <div className="w-full ">
      <label className="w-full border-2 border-dashed border-gray-400 py-2  rounded-md text-gray-400 transition-all duration-300 bg-gray-50 cursor-pointer  gap-2 hover:text-red-700 hover:border-red-700">
        
        <span className="flex justify-center items-center gap-1 para-font"><GrFormUpload className="w-8 h-8" />{label}</span>
        <input
          type="file"
          accept=".png,.jpeg,.pdf,.doc,.docx"
          onChange={handleChange}
          className="hidden"
        />
      </label>

      {previewUrl && (
        <div className="mt-4 text-center">
          <img
            src={previewUrl}
            alt="Preview"
            className="mx-auto w-32 h-32 object-cover "
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
