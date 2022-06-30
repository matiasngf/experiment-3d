import { ShaderMaterial, TextureLoader, Vector3 } from "three";

import earthDayMapUrl from "./textures/8k_earth_daymap.jpg";
import nightMapUrl from "./textures/8k_earth_nightmap.jpg";
import cloudMapUrl from "./textures/8k_earth_clouds.jpg";
import { lightDirection } from "../globals";

const EarthVertexShader = `
varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

void main() {
  vUv = uv;
  vNormal = normal;

  wPos = (modelMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const EarthFragmentShader = `

varying vec3 vNormal;
varying vec2 vUv;
varying vec3 wPos;

uniform sampler2D dayMap;
uniform sampler2D nightMap;
uniform sampler2D cloudMap;
uniform vec3 lightDirection;

float valueRemap(float value, float min, float max, float newMin, float newMax) {
  return newMin + (newMax - newMin) * (value - min) / (max - min);
}

void main() {

  //setup
  vec3 vLightDirection = normalize(lightDirection);
  vec3 normal = normalize(vNormal);
  vec3 lightColor = vec3(1.0, 1.0, 1.0);
  vec3 viewDirection = normalize(cameraPosition - wPos);

  // diffuse color
  vec3 dayColor = texture2D(dayMap, vUv).rgb;
  float rawLambert = dot(normal, vLightDirection);
  float lambert = clamp(rawLambert, 0.0, 1.0);

  // sun light
  float rawSunLight = valueRemap(rawLambert, 0.0, 0.2, 0.0, 1.0);
  float sunLight = clamp(rawSunLight, 0.0, 1.0);
  vec3 vLambertLight = dayColor * lightColor * sunLight;

  // add night map
  vec3 nightColor = texture2D(nightMap, vUv).rgb;
  nightColor = nightColor * (1.0 - sunLight); // lights only at night
  vLambertLight += nightColor;

  // sunsetColor
  float sunsetFactor = clamp(valueRemap(rawSunLight, -0.1, 0.6, -1.0, 1.0), -1.0, 1.0);
  sunsetFactor = cos(sunsetFactor * 3.14) * 0.5 + 0.5;
  vec3 sunsetColor = vec3(0.325,0.173,0.149) * 2.3;

  // clouds
  float cloudFactor = texture2D(cloudMap, vUv).r;
  //sunset on clouds
  vec3 cloudColor = vec3(1.0) * valueRemap(sunLight, 0.0, 1.0, 0.1, 1.0);
  cloudColor = mix(cloudColor, sunsetColor, sunsetFactor * pow(cloudFactor, 1.3));
  vLambertLight = mix(vLambertLight, cloudColor, cloudFactor);

  // fresnel
  float fresnel = pow((1.0 - dot(normal, viewDirection)), 2.0) * 0.5;
  fresnel += (1.0 - dot(normal, viewDirection)) * 0.2 + 0.2;
  vec3 athmosphereColor = vec3(0.459,0.647,1.);

  vLambertLight = mix(vLambertLight, athmosphereColor, fresnel * sunLight);

  gl_FragColor = vec4(vec3(vLambertLight), 1.0);
  // gl_FragColor = vec4(vec3(sunsetFactor), 1.0);
}
`;

const eathDayTexture = new TextureLoader().load(earthDayMapUrl);
const nightTexture = new TextureLoader().load(nightMapUrl);
const cloudTexture = new TextureLoader().load(cloudMapUrl);

export const EarthMaterial = new ShaderMaterial({
  uniforms: {
    dayMap: {value: eathDayTexture},
    nightMap: {value: nightTexture},
    cloudMap: {value: cloudTexture},
    lightDirection: { value: lightDirection },
  },
  vertexShader: EarthVertexShader,
  fragmentShader: EarthFragmentShader
});