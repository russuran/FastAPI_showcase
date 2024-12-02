import React, { useEffect, useRef } from 'react';

const AnimatedBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    let animationFrameId;

    const render = (time) => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      let radius = canvas.width * 0.002;
      if (canvas.width < 500) {
        radius = canvas.width * 0.01;
      }
      const numParticles = 15;
      for (let i = 0; i < numParticles; i++) {
        for (let j = -150; j < canvas.height * 1; j += 50) {
            const x = Math.tan(time * 0.0000001 * (j + 150) + i) ** 2 * 150;
            const y = Math.cos(time * 0.0000001 * (j + 150) + i) ** 2 * 150 + j;

            context.fillStyle = `rgb(46, 139, 87)`;
            context.beginPath();
            context.arc(x, y, radius, 0, Math.PI * 2);
            //context.arcTo(x, y, x + 5, y + 5, 1);
            context.fill();
        }

        for (let j = -150; j < canvas.height * 1; j += 50) {
            const x = -1 * Math.tan(time * 0.0000001 * (j + 150) + i) * 150;
            const y = -1 * Math.cos(time * 0.0000001 * (j + 150) + i) * 150 + j;

            context.fillStyle = `rgb(125, 125, 125)`;
            context.beginPath();
            context.arc(x + canvas.width, y, radius, 0, Math.PI * 2);
            //context.arcTo(x, y, x + 5, y + 5, 1);
            context.fill();
        }
        
      }


      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: -1 }} width={window.innerWidth} height={window.innerHeight} />;
};

export default AnimatedBackground;
