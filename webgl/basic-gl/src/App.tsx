import { useRef } from "react";

import { useEffect } from "react";
import { startGl } from "./gl";

function observeResize(
  container: HTMLDivElement,
  canvas: HTMLCanvasElement,
  gl: WebGL2RenderingContext
) {
  const resizeCallback = () => {
    canvas.width = container.clientWidth;
    canvas.height = container.clientHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  };

  const resizeObserver = new ResizeObserver(resizeCallback);
  resizeObserver.observe(container);

  resizeCallback();

  return () => {
    resizeObserver.disconnect();
  };
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    if (!container) return;

    const gl2 = canvas.getContext("webgl2");
    if (!gl2) return;

    const cleanupResize = observeResize(container, canvas, gl2);

    const stopRender = startGl(gl2);

    return () => {
      cleanupResize();
      stopRender();
    };
  }, []);

  return (
    <>
      <div className="bg-black w-full min-h-lvh relative" ref={containerRef}>
        <canvas
          id="canvas"
          className="absolute top-0 left-0 w-full h-full"
          ref={canvasRef}
        ></canvas>
      </div>
    </>
  );
}

export default App;
