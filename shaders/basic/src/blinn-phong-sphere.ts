// Code based on this tutorial https://youtu.be/mL8U8tIiRRg?t=9430

import { BoxGeometry, CapsuleGeometry, Mesh, RingGeometry, ShaderMaterial, SphereGeometry } from "three";

const blinnPhongVS = `
  varying vec3 vNormal;
  varying vec3 vLightDirection;
  varying vec3 wPos;

  
  void main() {
    vLightDirection = normalize(vec3(-1.0, 1.0, 0.0));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    vNormal = normal;
    wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  }
`;

const blinnPhongFS = `
  varying vec3 vNormal;
  varying vec3 vLightDirection;
  varying vec3 wPos;
  
  uniform float glossiness;

  vec3 shadowColor = vec3(0.1, 0.1, 0.1);
  vec3 baseColor = vec3(1.0, 0.0, 1.0) * 0.5;

  void main() {
    // https://youtu.be/mL8U8tIiRRg?t=10696
    float specularExponent = pow(2.0, glossiness * 6.0) + 8.0;

    // diffuse light
    float lambert = clamp(dot(vNormal, vLightDirection), 0.0, 1.0);
    vec3 color = mix(shadowColor, baseColor, lambert);

    // smooth the transition between verteces
    vec3 normal = normalize(vNormal);

    // specular light
    vec3 cameraNormal = normalize(cameraPosition - wPos);
    vec3 halfVector = normalize(vLightDirection + cameraNormal);
    float specularLight = clamp(dot(halfVector, normal), 0.0, 1.0);
    specularLight = pow(specularLight, specularExponent);
    // adjust specularLight to make specular disappear based on lambert
    specularLight = specularLight * smoothstep(0.0, 1.0, lambert * 2.0);
    // approximate light getting weaker as it gets more spread out
    specularLight = specularLight * glossiness;

    // combining the two
    color = mix(color, vec3(1.0, 1.0, 1.0), specularLight);
    gl_FragColor = vec4(vec3(color), 1.0);
  }
`;

export const BlinnPhongSphere = new Mesh(
  // new SphereGeometry(1, 16, 16),
  new CapsuleGeometry(1, 1, 64, 64),
  // new BoxGeometry(1, 1, 1),
  new ShaderMaterial({
    uniforms: {
      glossiness: { value: 0.8 },
    },
    vertexShader: blinnPhongVS,
    fragmentShader: blinnPhongFS
  })
);