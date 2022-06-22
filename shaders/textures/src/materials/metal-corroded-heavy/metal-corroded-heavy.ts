import { RepeatWrapping, ShaderMaterial, TextureLoader, UniformsLib, Vector3, Vector4 } from "three";
import { hexToVector3 } from "../../utils/hexToVector3";

import metalTextureColorUrl from './textures/metal-corroded-heavy-color.jpg';
import metalTextureNormalUrl from './textures/metal-corroded-heavy-normal.jpg';
import metalTextureSpecularUrl from './textures/metal-corroded-heavy-specular.jpg';

const MetalCorroedVertexShader = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;
varying vec3 vTangent;

void main() {
  vUv = uv;
  vNormal = normal;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  //calculate tangent
  vec3 tangent = normalize(cross(vNormal, vec3(0.0, 0.0, 1.0)));
  vTangent = tangent;
}
`;

const MetalCorroedFragmentShader = `

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;
varying vec3 vTangent;

uniform sampler2D albedoMap;
uniform sampler2D normalMap;
uniform sampler2D specularMap;
uniform vec3 lightDirection;
uniform float glossiness;
uniform float normalScale;
uniform vec3 lightColor;

// This function taken directly from the three.js phong fragment shader.
// http://hacksoflife.blogspot.ch/2009/11/per-pixel-tangent-space-normal-mapping.html
vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm ) {

  vec3 q0 = dFdx( eye_pos.xyz );
  vec3 q1 = dFdy( eye_pos.xyz );
  vec2 st0 = dFdx( vUv.st );
  vec2 st1 = dFdy( vUv.st );

  vec3 S = normalize( q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( surf_norm );

  vec3 mapN = texture2D( normalMap, vUv ).xyz * 2.0 - 1.0;
  mapN.xy = normalScale * mapN.xy;
  mat3 tsn = mat3( S, T, N );
  return normalize( tsn * mapN );

}

void main() {

  // setup
  vec3 viewDirection = normalize(cameraPosition - wPos);

  vec3 normal = normalize(vNormal);
  normal = perturbNormal2Arb( viewDirection, normal );
  vec3 vLightDirection = normalize(lightDirection);
  
  // diffuse light
  vec3 diffuseColor = texture2D(albedoMap, vUv).xyz;
  float lambert = clamp(dot(normal, vLightDirection), 0.0, 1.0);
  vec3 vLambertLight = diffuseColor * lightColor * lambert;

  // specular light
  float specularLevel = texture2D(specularMap, vUv).x;
  float specularExponent = pow(2.0, glossiness * specularLevel * 10.0) + 20.0;
  vec3 halfVector = normalize(vLightDirection + viewDirection);
  float specular = max(dot(halfVector, normal), 0.0);
  specular = pow(specular, specularExponent);
  specular = specular * smoothstep(0.0, 1.0, lambert * 2.0);
  specular = specular * glossiness * specularLevel;
  vec3 vSpecularLight = lightColor * specular;

  // normal map
  vec3 normalMapColor = texture2D(normalMap, vUv).xyz;
  // normalMapColor = normalize(normalMapColor / 2.0 - 1.0);

  // combining the two lights
  vec4 light = vec4(vLambertLight + vSpecularLight, 1.0);
  
  gl_FragColor = light;
  // gl_FragColor = vec4(normalMapColor, 1.0);
}
`;

const metalTextureColor = new TextureLoader().load(metalTextureColorUrl);
metalTextureColor.wrapS = metalTextureColor.wrapT = RepeatWrapping;

const metalTextureNormal = new TextureLoader().load(metalTextureNormalUrl);
metalTextureNormal.wrapS = metalTextureNormal.wrapT = RepeatWrapping;

const metalTextureSpecular = new TextureLoader().load(metalTextureSpecularUrl);
metalTextureSpecular.wrapS = metalTextureSpecular.wrapT = RepeatWrapping;

export const MetalCorroedMaterial = new ShaderMaterial({
  uniforms: {
    albedoMap: {
      value: metalTextureColor
    },
    normalMap: {
      value: metalTextureNormal
    },
    specularMap: {
      value: metalTextureSpecular
    },
    normalScale: { value: 0.5 },
    lightColor: { value: hexToVector3("#ffffff") },
    glossiness: { value: 1.0 },
    lightDirection: { value: new Vector3(3, 3, 0) },
  },
  vertexShader: MetalCorroedVertexShader,
  fragmentShader: MetalCorroedFragmentShader
});

console.log(UniformsLib.normalmap);

