// basic gl program

const FLOAT_SIZE = 4;

const basicVertexShader = /*glsl*/ `#version 300 es
  precision highp float;

  layout(location = 0) in vec3 position;
  layout(location = 1) in vec2 uv;


  out vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

const basicFragmentShader = /*glsl*/ `#version 300 es
  precision highp float;

  in vec2 vUv;
  
  out vec4 fragColor;

  uniform vec3 uColor;
  
  void main() {
    fragColor = vec4(uColor, 1.0);
  }
`;

function createShader(gl: WebGL2RenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type)
  if (!shader) throw new Error('Failed to create shader')

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const info = gl.getShaderInfoLog(shader)
    throw new Error(`Shader compilation failed: ${info}`)
  }

  return shader
}

interface ProgramUniforms {
  color: [number, number, number],
}

const createGlProgram = (gl: WebGL2RenderingContext, vertexShaderSource: string, fragmentShaderSource: string) => {
  const program = gl.createProgram();
  if (!program) throw new Error("Failed to create program");

  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const info = gl.getProgramInfoLog(program)
    throw new Error(`Program linking failed: ${info}`)
  }

  // Clean up shaders
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  const uColor = gl.getUniformLocation(program, "uColor")
  if (!uColor) throw new Error("Could not find the uniform uColor");

  const setUniforms = (newValues: Partial<ProgramUniforms>) => {
    if (newValues.color) {
      gl.uniform3f(uColor, newValues.color[0], newValues.color[1], newValues.color[2])
    }
  }

  return [program, setUniforms] as const;
};

/** Creates a full screen quad VAO */
const createScreenVao = (gl: WebGL2RenderingContext) => {
  // Create plane vertices (two triangles forming a square)
  const vertices = new Float32Array([
    -1, -1, 0.0, // bottom left
    0.0, 0.0, // bottom left uv

    1, -1, 0.0, // bottom right
    1.0, 0.0, // bottom right uv

    -1, 1, 0.0, // top left
    0.0, 1.0, // top left uv

    1, 1, 0.0, // top right
    1.0, 1.0, // top right uv
  ])

  const indices = new Uint16Array([
    0, 1, 2,  // first triangle
    1, 3, 2   // second triangle
  ])

  // Create and bind VAO
  const vao = gl.createVertexArray()
  if (!vao) throw new Error('Failed to create VAO')
  gl.bindVertexArray(vao)

  // Create and bind vertex buffer
  const vertexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer)
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

  // Create and bind index buffer
  const indexBuffer = gl.createBuffer()
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer)
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW)

  // Setup vertex attributes
  gl.enableVertexAttribArray(0)
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 5 * FLOAT_SIZE, 0)

  // setup uv attributes
  gl.enableVertexAttribArray(1)
  gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 5 * FLOAT_SIZE, 3 * FLOAT_SIZE)

  // Cleanup
  gl.bindVertexArray(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

  return vao
}

export function startGl(gl: WebGL2RenderingContext) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const [basicProgram, setBasicProgramUniforms] = createGlProgram(gl, basicVertexShader, basicFragmentShader);
  const planeVao = createScreenVao(gl);

  let shouldUpdateUniforms: null | Partial<ProgramUniforms> = null

  const updateUniforms = (uniforms: Partial<ProgramUniforms>) => {
    shouldUpdateUniforms = uniforms
  }

  const renderAbortController = new AbortController();

  let shouldUpdateSize: null | { width: number, height: number, pixelRatio: number } = null

  const setSize = (width: number, height: number, pixelRatio: number = 1) => {
    shouldUpdateSize = {
      width,
      height,
      pixelRatio
    }
  }

  const renderLoop = () => {
    if (renderAbortController.signal.aborted) return;

    if (shouldUpdateSize) {
      gl.canvas.width = shouldUpdateSize.width * shouldUpdateSize.pixelRatio
      gl.canvas.height = shouldUpdateSize.height * shouldUpdateSize.pixelRatio
      gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

      if ("style" in gl.canvas) {
        gl.canvas.style.width = `${shouldUpdateSize.width}px`
        gl.canvas.style.height = `${shouldUpdateSize.height}px`
      }
      shouldUpdateSize = null
    }

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(basicProgram);
    if (shouldUpdateUniforms) {
      setBasicProgramUniforms(shouldUpdateUniforms);
    }
    gl.bindVertexArray(planeVao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(renderLoop);
  }

  renderLoop();

  const stopGl = () => renderAbortController.abort()

  return {
    stopGl,
    setSize,
    updateUniforms
  }
}
