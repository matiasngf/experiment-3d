import { useRef, useState } from "react";

import { useEffect } from "react";
import { startGl } from "./gl";
import { useControls } from "leva";

function observeResize(
  container: HTMLDivElement,
  callback: (width: number, height: number) => void
) {
  const resizeCallback = () => {
    callback(container.clientWidth, container.clientHeight);
  };

  const resizeObserver = new ResizeObserver(resizeCallback);
  resizeObserver.observe(container);

  // Call once to set initial size
  resizeCallback();

  return () => {
    resizeObserver.disconnect();
  };
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [{ renderer }, setElements] = useState<{
    canvas: HTMLCanvasElement | null;
    container: HTMLDivElement | null;
    renderer: ReturnType<typeof startGl> | null;
  }>({
    canvas: null,
    container: null,
    renderer: null,
  });

  const rendererRef = useRef<ReturnType<typeof startGl> | null>(null);
  rendererRef.current = renderer;

  useControls({
    colors: {
      value: { r: 0, g: 0, b: 0 },
      onChange: (value) => {
        rendererRef.current?.updateUniforms({
          color: [value.r / 255, value.g / 255, value.b / 255],
        });
      },
    },
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const container = containerRef.current;
    if (!container) return;

    const gl = canvas.getContext("webgl2");
    if (!gl) return;

    const renderer = startGl(gl);

    const cleanupResize = observeResize(container, (width, height) => {
      renderer.setSize(width, height, window.devicePixelRatio || 1);
    });

    setElements({ canvas, container, renderer });

    return () => {
      cleanupResize();
      renderer.stopGl();
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
