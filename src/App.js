import "./style.css";
import React, { useState } from "react";
import jsPDF from "jspdf";

const pxToMm = 0.164583; // Conversion from pixels to mm

function App() {
  const [images, setImages] = useState([]);
  const [filePathNames, setFilePathNames] = useState([]);
  const doc = new jsPDF({
    orientation: "landscape",
  });
  doc.deletePage(1);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    setFilePathNames((prevFilePathNames) => [...prevFilePathNames, file]);
    reader.onload = (e) => {
      setImages((prevImages) => [...prevImages, e.target.result]); // Append new image
    };
    reader.readAsDataURL(file);
  };

  const handleGeneratePDF = () => {
    let numPagesDone = 0;

    if (images.length == 0) {
      return;
    }
    images.forEach((image, index) => {
      const imageObject = new Image();
      imageObject.src = image;

      imageObject.onload = () => {
        if (imageObject.height < imageObject.width) {
          // Case for horizontal photo
          doc.addPage(
            [imageObject.height * pxToMm, imageObject.width * pxToMm],
            "landscape"
          );
          doc.addImage(
            image,
            "jpg",
            0,
            0,
            imageObject.width * pxToMm,
            imageObject.height * pxToMm
          );
        } else {
          // Case for vertical photo
          doc.addPage(
            [imageObject.height * pxToMm, imageObject.width * pxToMm],
            "landscape"
          );
          doc.addImage(
            image,
            "jpg",
            0,
            0,
            imageObject.height * pxToMm,
            imageObject.width * pxToMm
          );
        }

        numPagesDone++;

        if (numPagesDone == images.length) {
          doc.save("merged.pdf");
        }
      };
    });
  };

  return (
    <>
      <div className="title">Join Images to PDF</div>

      <div className="upload">
        <div className="uploadTitle">Upload</div>
        <div className="color1">
          <input
            className="uploadFile"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
          />
        </div>
        <div className="fileListTitle"> File List</div>
        <nav className="color1">
          <ul className="fileList">
            {filePathNames.map((item, index) => (
              <li className="color2" key={index}>
                {index + 1}. &nbsp; &nbsp;
                {item.name}
              </li>
            ))}
          </ul>
        </nav>
        <div className="preview">
          <div className="previewText"> Preview </div>
          <div className="imagePreviewListOuterContainer">
            <nav>
              <ul className="imagePreviewList">
                {images.map((image, index) => (
                  <li className="color2" key={index}>
                    <img className="previewImage" src={image} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>
      </div>
      <div className="downloadButton">
        <button className="generatePDFButton" onClick={handleGeneratePDF}>
          Generate PDF
        </button>
      </div>
    </>
  );
}

export default App;
