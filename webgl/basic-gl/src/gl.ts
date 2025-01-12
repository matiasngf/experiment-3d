// basic gl program

const basicVertexShader = /*glsl*/ `#version 300 es
  layout(location = 0) in vec3 position;

  void main() {
    gl_Position = vec4(position, 1.0);
  }
`;

const basicFragmentShader = /*glsl*/ `#version 300 es
  precision highp float;

  out vec4 fragColor;

  void main() {
    fragColor = vec4(0.0, 1.0, 0.0, 1.0);
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

  return program;
};

/** Creates a full screen quad VAO */
const createScreenVao = (gl: WebGL2RenderingContext) => {
  // Create plane vertices (two triangles forming a square)
  const vertices = new Float32Array([
    -1, -1, 0.0, // bottom left
    1, -1, 0.0, // bottom right
    -1, 1, 0.0, // top left
    1, 1, 0.0, // top right
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
  gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 0, 0)

  // Cleanup
  gl.bindVertexArray(null)
  gl.bindBuffer(gl.ARRAY_BUFFER, null)
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

  return vao
}

export function startGl(gl: WebGL2RenderingContext) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);

  const program = createGlProgram(gl, basicVertexShader, basicFragmentShader);
  const planeVao = createScreenVao(gl);

  const renderAbortController = new AbortController();

  const renderLoop = () => {
    if (renderAbortController.signal.aborted) return;

    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);
    gl.bindVertexArray(planeVao);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    requestAnimationFrame(renderLoop);
  }

  renderLoop();

  return () => renderAbortController.abort()
}
