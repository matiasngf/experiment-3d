

export const getAmbientOcclusion = `

vec3 getTangent(vec3 v) {
  vec3 forward = vec3(0.0, 0.0, 1.0);
  vec3 up = vec3(0.0, 1.0, 0.0);
  vec3 tangent = cross(v, forward);
  if(length(tangent) < 0.01) {
    tangent = cross(v, up);
  }
  return tangent;
}

#define AO_SAMPLES 4

float getAmbientOcclusion(vec3 p, vec3 normal) {
  vec3 t = getTangent(normal);

  vec3 normal2 = rotate(normal, t, PI / 4.0);

  float aoM = 1.0;
  
  vec3 sampleVectors[AO_SAMPLES];

  for (int i = 0; i < AO_SAMPLES; i++) {
    float angle = float(i) * (PI * 2.0 / float(AO_SAMPLES));
    vec3 sampleVector = rotate(normal2, normal, angle);
    float d = getSceneHit(sampleVector).dist;
    aoM = d;
  }
  return aoM;

  RayHit hit = getSceneHit(p + normal);
  float ao = hit.dist;
  ao = valueRemap(ao, 0.0, 1.0, 0.0, 1.0);
  return ao;
}
`;