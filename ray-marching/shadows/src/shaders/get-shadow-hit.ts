export const getShadowHit = `
float getShadowHit(vec3 origin, vec3 normal, RayConfig rayConfig) {
  // return 1.0;
  if(dot(lightDirection, normal) < 0.5) {
    return 1.0;
  }
  origin = origin + lightDirection * 0.6;
  RayResult hit = castRay(
    origin,
    lightDirection,
    rayConfig.maxDistance,
    rayConfig.surfaceDistance,
    rayConfig.maxSteps
  );

  float distanceBias = 0.5;
  float lowerFactor = clamp(hit.lowerHitPoint.dist, 0.0, distanceBias);
  return valueRemap(lowerFactor, 0.0, distanceBias, 0.0, 1.0);

  // if(hit.hit) {
  //   // return 0.0;
  //   float hitDistance = length(origin - hit.position);
  //   float shadowFactor = clamp(hitDistance / 10.0, 0.0, 1.0);
  //   return pow(shadowFactor, 0.3);
  // } else {
  //   // return hit.lowerDistance;
  //   float distanceBias = 0.5;
  //   float lowerFactor = clamp(hit.lowerDistance, 0.0, distanceBias);
  //   return 1.0 - distanceBias + lowerFactor;
  //   return 1.0;
  // }
}
`;