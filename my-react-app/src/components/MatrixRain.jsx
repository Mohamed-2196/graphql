import { useEffect } from "react";

const MatrixRain = () => {
  useEffect(() => {
    const canvas = document.getElementById("matrixCanvas");
    const ctx = canvas.getContext("2d");

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Characters for matrix rain
    const matrixChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ123456789@#$%^&*()*&^%+-/~{[|`]}";
    const characters = matrixChars.split("");
    const fontSize = 16;
    const columns = canvas.width / fontSize;

    // Array of drops, one per column
    const drops = Array(Math.floor(columns)).fill(1);

    function draw() {
      // Set background with slight opacity for fading effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = "#00aaff"; // Change text color to blue
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, index) => {
        const text = characters[Math.floor(Math.random() * characters.length)];
        const x = index * fontSize;
        ctx.fillText(text, x, y * fontSize);

        // Reset drop to top randomly or move down
        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[index] = 0;
        }
        drops[index]++;
      });
    }

    const interval = setInterval(draw, 50);

    // Adjust canvas on window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      drops.length = Math.floor(canvas.width / fontSize);
      drops.fill(1);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      clearInterval(interval);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas id="matrixCanvas" style={{ position: "fixed", top: 0, left: 0, zIndex: 0 }}></canvas>;
};

export default MatrixRain;