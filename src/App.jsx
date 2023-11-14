import { useState } from "react";
import imageCompression from "browser-image-compression";

const App = () => {
  const [base64Image, setBase64Image] = useState(null);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      try {
        // Compress the image
        const compressedImage = await imageCompression(file, {
          maxSizeMB: 0.005,
          maxWidthOrHeight: 50,
        });

        // Convert the compressed image to Base64
        const base64String = await imageCompression.getDataUrlFromFile(
          compressedImage
        );

        // Update state with the Base64 string
        setBase64Image(base64String);
      } catch (error) {
        console.error("Error compressing image:", error);
      }
    }
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageChange} />
      {base64Image && <img src={base64Image} alt="Compressed" />}

      {/* <textarea name="" id="" cols="30" rows="10" value={base64Image} /> */}

      {/* <Textarea */}

      <button onClick={() => navigator.clipboard.writeText(base64Image)}>
        Copy to clipboard
      </button>
    </div>
  );
};

export default App;
