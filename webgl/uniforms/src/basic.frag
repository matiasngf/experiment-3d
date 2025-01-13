#version 300 es
precision highp float;

in vec2 vUv;
in vec2 vAspectUv;

out vec4 fragColor;

uniform vec3 uColor;
uniform float uAspect;
uniform float uSize;

vec2 translate(vec2 a, vec2 b) {
  return a - b;
}

float sphere(vec2 p, float size) {
  float d = length(p);
  return step(d, size);
}

void main() {
  vec2 p = vAspectUv;
  p = translate(p, vec2(0.5, 0.5));

  vec3 color = vec3(0.0);

  float sphereFact = sphere(p, uSize);

  color = mix(color, uColor, sphereFact);

  fragColor = vec4(color, 1.0);
}
