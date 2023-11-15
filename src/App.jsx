import { useState } from "react";
import imageCompression from "browser-image-compression";
import { useRef } from "react";

const App = () => {
  const fileInputRef = useRef(null);
  const [imageFile, setImageFile] = useState(null);
  const [base64Image, setBase64Image] = useState("");
  const [maxSizeMB, setMaxSizeMB] = useState(0.005);
  const [maxWidthOrHeight, setMaxWidthOrHeight] = useState(50);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    console.log("Original file:", e);

    if (imageFile === null) {
      setImageFile(e);
    }

    if (file) {
      try {
        // Compress the image
        const compressedImage = await imageCompression(file, {
          maxSizeMB: maxSizeMB,
          maxWidthOrHeight: maxWidthOrHeight,
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

  function handleMaxSizeMBChange(e) {
    setMaxSizeMB(e.target.value);
    handleImageChange(imageFile);
  }

  function handleMaxWidthOrHeightChange(e) {
    setMaxWidthOrHeight(e.target.value);
    handleImageChange(imageFile);
  }

  function handleClear() {
    setBase64Image("");
    setImageFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setMaxSizeMB(0.005);
    setMaxWidthOrHeight(50);
  }

  function handleDownload() {
    const link = document.createElement("a");
    link.href = base64Image;
    link.download = "compress.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="container mx-auto my-5 border-gray-300 border rounded-md p-10 max-w-[1200px]">
      <h1 className="text-center my-5">
        <span className="text-3xl font-bold text-gray-900">Image </span>
        <span className="text-3xl font-bold text-violet-700">Compressor</span>
      </h1>
      <input
        type="file"
        className="block  text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-700 hover:file:bg-violet-100 mx-auto mb-5"
        onChange={handleImageChange}
        ref={fileInputRef}
      />

      <div className="flex gap-5 flex-col md:flex-row md:gap-10">
        <div className="input__area w-full md:w-1/2 flex flex-col">
          <label className="text-sm font-medium text-gray-900">
            Max size (MB)
          </label>
          <input
            type="number"
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={maxSizeMB}
            onChange={(e) => handleMaxSizeMBChange(e)}
          />
        </div>
        <div className="input__area w-full md:w-1/2 flex flex-col">
          <label className="text-sm font-medium text-gray-900">
            Max width or height (px)
          </label>
          <input
            type="number"
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
            value={maxWidthOrHeight}
            onChange={(e) => handleMaxWidthOrHeightChange(e)}
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row py-5 gap-10">
        <div className="input__area w-full  md:w-1/2 flex flex-col justify-between">
          <textarea
            className="flex w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 resize-none"
            value={base64Image}
            // onChange={(e) =>  setBase64Image(e.target.value)}
            onChange={() => alert("You can't edit this field")}
            rows={12}
          />
          <button
            onClick={() => navigator.clipboard.writeText(base64Image)}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 w-full mt-5"
          >
            Copy to clipboard
          </button>
          <button
            onClick={handleClear}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 w-full mt-5"
          >
            Clear
          </button>
        </div>
        <div className="input__area w-full  md:w-1/2 flex flex-col">
          {base64Image && (
            <>
              <img
                src={base64Image}
                alt="Everything"
                className="max-h-[300px] grow object-contain"
              />

              <div className="flex flex-row gap-5">
                <button
                  onClick={handleDownload}
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-black text-white shadow hover:bg-black/90 h-9 px-4 py-2 mt-5 w-1/2 mx-auto"
                >
                  Download image
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
