export const getSceneHit = `
float VOXEL_SIZE = 0.3;

vec3 getClosestBoxel(vec3 p) {
  return round(p / VOXEL_SIZE) * VOXEL_SIZE;
}

RayHit getScene(vec3 p) {
  vec3 pCenter = Translate(p, vec3(0.0, 0.3, -15.0));
  vec3 pBall = Translate(pCenter, vec3(
    .0,
    sin(uTime / 10.0) * 5.0 + 1.0,
    .0
  ));
  pBall = getClosestBoxel(pBall);

  RayHit BallObject = BallSurface(pBall, 3.1);
  return BallObject;
}

float getSafeDist() {
  float safeDist = length(vec3(VOXEL_SIZE / 3.0));
  return safeDist;
}

float getQuadDist(vec3 p, vec3 quadCenter) {
  vec3 chunkP = quadCenter - p;
  if(getScene(quadCenter).dist > SURFACE_DIST) {
    return VOXEL_SIZE;
  } else {
    return sdCuboid(chunkP, vec3(VOXEL_SIZE));
  }
}

float getChunkDist(vec3 p, vec3 chunkCenter) {
  float minDist = VOXEL_SIZE;
  for(int x = -1; x <= 1; x += 1) {
    for(int y = -1; y <= 1; y += 1) {
      for(int z = -1; z <= 1; z += 1) {
        if(!(x == 0 && y == 0 && z == 0)) {
          vec3 quadCenter = chunkCenter + vec3(float(x) * VOXEL_SIZE, float(y) * VOXEL_SIZE, float(z) * VOXEL_SIZE);
          minDist = min(minDist, getQuadDist(p, quadCenter));
        }
      }
    }
  }
  return minDist;
}

RayHit getSceneHit(vec3 p) {
  RayHit Hit = getScene(p);
  float safeDist = getSafeDist();
  if(Hit.dist <= safeDist) {
    vec3 center = getClosestBoxel(p);
    Hit.dist = getChunkDist(p, center);
  } else {
    Hit.dist = max(Hit.dist - safeDist, SURFACE_DIST);
  }
  return Hit;
}
`;