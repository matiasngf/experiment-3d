export const getSceneHit = `
RayHit getSceneHit(vec3 p) {
  RayHit FloorObject = FloorSurface(p);
  vec3 pBall = Translate(p, vec3(0.0, 0.0, -15.0));
  // pBall = Translate(pBall, vec3(.0, sin(uTime / 10.0), .0));
  RayHit CenterObject = HouseSurface(
    pBall
  );
  return Union(CenterObject, FloorObject);
}
`;