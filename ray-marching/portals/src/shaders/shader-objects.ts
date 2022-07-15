export const shaderObjects = `

vec3 portal1Center = vec3(-4.0, 1.0, -8.5);
vec3 portal2Center = vec3(4.0, 1.0, -8.5);

vec3 pPortal1(vec3 p) {
  return Translate(p, portal1Center);
}

Material PortalDebugMaterial = Material(
  vec3(0.0, 0.0, 1.0),
  0.0, 0.0
);

Portal PortalSurface(vec3 p, vec3 center, vec3 translation, vec3 rotation) {
  return Portal(
    RayHit(
      sdCuboid(p, vec3(3.0, 2.0, 0.5)),
      PortalDebugMaterial
    ),
    center,
    translation,
    rotation
  );
}

Portal Portal1(vec3 p) {
  return PortalSurface(pPortal1(p), portal1Center, portal2Center, vec3(0.0, 180.0, 0.0));
}

RayHit PortalPlatform(vec3 p) {
  Material PortalPlatformMaterial = Material(
    vec3(0.9, 0.9, 0.9),
    0.9, 0.2
  );
  RayHit BaseSurface = RayHit(sdCuboid(p, vec3(0.1, 5.0, 5.0)), PortalPlatformMaterial);
  vec3 frameSurfacePosition = Translate(p, vec3(0.0, 1.4, 0.0));
  RayHit FrameSurface = RayHit(sdCuboid(frameSurfacePosition, vec3(3.0)), PortalPlatformMaterial);
  return SmoothMin(BaseSurface, FrameSurface, 0.5);
}

RayHit FloorSurface(vec3 p) {
  Material FloorMaterial = Material(
    vec3(0.741,0.576,0.4),
    0.0,
    0.0
  );
  return RayHit(
    sdPlane(p, vec3(0.0, 1.0, 0.0)),
    FloorMaterial
  );
}
`;