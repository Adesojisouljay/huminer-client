import React, { useRef, useState } from "react";
import "./index.css";

const Certificate = () => {
  const canvasRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [isGenerated, setIsGenerated] = useState(false);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPhoto(URL.createObjectURL(file));
    }
  };

  const generateImage = (e) => {
    e.preventDefault();
    const name = e.target.name.value;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Clear
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#facc15");
    gradient.addColorStop(1, "#b45309");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Border
    ctx.strokeStyle = "#065f46";
    ctx.lineWidth = 8;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Logo (top-left)
    ctx.fillStyle = "#fff";
    ctx.font = "bold 20px Georgia";
    ctx.textAlign = "left";
    ctx.fillText("MEADOW", 20, 30);

    // Title
    ctx.fillStyle = "#fff";
    ctx.font = "bold 32px Georgia";
    ctx.textAlign = "center";
    ctx.fillText("I WILL BE ATTENDING", canvas.width / 2, 80);

    // Theme (instead of program input)
    ctx.fillStyle = "#15803d";
    ctx.font = "bold 38px Verdana";
    ctx.fillText("INVASION", canvas.width / 2, 150);

    // Draw user photo
    if (photo) {
      const img = new Image();
      img.src = photo;
      img.onload = () => {
        const photoSize = 120;
        const centerX = canvas.width / 2;
        const centerY = 240;

        ctx.save();
        ctx.beginPath();
        ctx.arc(centerX, centerY, photoSize / 2, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.clip();

        ctx.drawImage(
          img,
          centerX - photoSize / 2,
          centerY - photoSize / 2,
          photoSize,
          photoSize
        );
        ctx.restore();

        // Border around photo
        ctx.beginPath();
        ctx.arc(centerX, centerY, photoSize / 2 + 2, 0, Math.PI * 2, true);
        ctx.strokeStyle = "#15803d";
        ctx.lineWidth = 4;
        ctx.stroke();

        // Name BELOW photo
        ctx.fillStyle = "#1e293b";
        ctx.font = "bold 24px Arial";
        ctx.textAlign = "center";
        ctx.fillText(name, centerX, centerY + photoSize / 2 + 40);

        // Date at the bottom
        ctx.fillStyle = "#fff";
        ctx.font = "bold 20px Georgia";
        ctx.fillText("September 27, 2025", canvas.width / 2, canvas.height - 30);

        setIsGenerated(true);
      };
    } else {
      // If no photo uploaded, draw name directly
      ctx.fillStyle = "#1e293b";
      ctx.font = "bold 24px Arial";
      ctx.textAlign = "center";
      ctx.fillText(name, canvas.width / 2, 260);

      // Date at the bottom
      ctx.fillStyle = "#fff";
      ctx.font = "bold 20px Georgia";
      ctx.fillText("September 27, 2025", canvas.width / 2, canvas.height - 30);

      setIsGenerated(true);
    }
  };

  const download = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "attendance.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div className="certificate-container">
      <form onSubmit={generateImage} className="certificate-form">
        <input type="text" name="name" placeholder="Enter your name" required />
        <input type="file" accept="image/*" onChange={handleImageUpload} />
        <button type="submit">Generate Attendance Image</button>
      </form>

      <canvas ref={canvasRef} width={600} height={400} className="canvas-box" />

      {isGenerated && (
        <button onClick={download} className="download-btn">
          Download Image
        </button>
      )}
    </div>
  );
};

export default Certificate;
