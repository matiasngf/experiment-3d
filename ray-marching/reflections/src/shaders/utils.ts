export const structs = `
struct Material {
  vec3 color;
  float glossiness;
  float reflectivity;
};

struct RayHit {
  float dist;
  Material material;
};

struct RayResult {
  bool hit;
  vec3 position;
  RayHit rayHit;
};

struct RayLightResult {
  vec3 color;
  float reflectFactor;
};

struct LightResult {
  vec3 color;
  vec3 normal;
  float reflectFactor;
};
`;

// https://www.shadertoy.com/view/3styDs
export const getNormal = `

// Normal calculation function (using gradient):
const vec3 GRADIENT_STEP = vec3(0.001, 0.0, 0.0);
vec3 getNormal(in vec3 p) {
  float gradientX = getSceneHit(p + GRADIENT_STEP.xyy).dist - getSceneHit(p - GRADIENT_STEP.xyy).dist;
  float gradientY = getSceneHit(p + GRADIENT_STEP.yxy).dist - getSceneHit(p - GRADIENT_STEP.yxy).dist;
  float gradientZ = getSceneHit(p + GRADIENT_STEP.yyx).dist - getSceneHit(p - GRADIENT_STEP.yyx).dist;
  return normalize(vec3(gradientX, gradientY, gradientZ));
}
`;

export const getLight = `

const vec3 lightDirection = normalize(vec3(1.0, 1.0, 1.0));
const vec3 lightColor = vec3(1.0, 1.0, 1.0);

LightResult getLight(vec3 p, vec3 rd, RayHit hit) {
  vec3 viewDirection = -rd;
  Material hitMat = hit.material;
  vec3 normal = getNormal(p);
  
  // diffuse light
  float lambert = clamp(dot(normal, lightDirection), 0.0, 1.0);
  // global illumination
  lambert = clamp(lambert, 0.3, 1.0);
  vec3 vLambertLight = hitMat.color * lightColor * lambert;
  
  // specular light
  float specularExponent = pow(2.0, hitMat.glossiness * 10.0) + 20.0;
  vec3 halfVector = normalize(lightDirection + viewDirection);
  float specular = max(dot(halfVector, normal), 0.0);
  specular = pow(specular, specularExponent);
  specular = specular * smoothstep(0.0, 1.0, lambert * 2.0);
  specular = specular * hitMat.glossiness;
  vec3 vSpecularLight = lightColor * specular;

  // combining the two lights
  vec3 light = vLambertLight + vSpecularLight;

  return LightResult(
    light,
    normal,
    hitMat.reflectivity
  );
}
`;

export const booleanFunctions = `
RayHit Union(RayHit hit1, RayHit hit2) {
  if (hit1.dist < hit2.dist) {
      return hit1;
  } else {
      return hit2;
  }
}

RayHit Intersection(RayHit hit1, RayHit hit2) {
  if (hit1.dist > hit2.dist) {
      return hit1;
  } else {
      return hit2;
  }
}

RayHit Difference(RayHit hit1, RayHit hit2) {
  return Intersection(hit1, RayHit(-hit2.dist, hit2.material));
}

RayHit SmoothMin (RayHit hit1, RayHit hit2, float k) {
  // distance mix
  float d1 = hit1.dist;
  float d2 = hit2.dist;
  float h = max(k - abs(d1-d2), 0.0) / k;
  float d = min(d1, d2) - h*h*h*k*1.0/6.0;

  // color mix
  float d3 = d1 + d2;
  float cMix = d1 / d3;
  vec3 mixedColor = mix(hit1.material.color, hit2.material.color, cMix);
  float mixedGlossiness = mix(hit1.material.glossiness, hit2.material.glossiness, cMix);
  float mixedReflectivity = mix(hit1.material.reflectivity, hit2.material.reflectivity, cMix);
  Material mat = Material(mixedColor, mixedGlossiness, mixedReflectivity);
  return RayHit(d, mat);
}
`;

export const distanceFunctions = `
float sdSphere(vec3 p, float radius) {
  return length(p) - radius;
}

float sdPlane(vec3 p, vec3 normal) {
  return dot(normal, p);
}

// sdCuboid(), sdCone(), and sdCylinder() are taken from Inigo Quilez's 3D distance functions article (https://iquilezles.org/articles/distfunctions):
float sdCuboid(in vec3 p, in vec3 size) {
    float h = size.x; 
    float w = size.y;
    float d = size.z;
    vec3 q = abs(p) - 0.5 * vec3(w, h, d);
    return length(max(q, 0.0)) + min(max(q.x, max(q.y, q.z)), 0.0);
}

float sdCone(in vec3 p, in float b, in float h) {
    p.y -= h;
    vec2 q = h * vec2(b / h * 2.0, -2.0);
    
    vec2 w = vec2( length(p.xz), p.y );
    vec2 a = w - q * clamp(dot(w, q) / dot(q, q), 0.0, 1.0);
    vec2 c = w - q * vec2(clamp(w.x / q.x, 0.0, 1.0), 1.0);
    float k = sign(q.y);
    float d = min(dot(a, a), dot(c, c));
    float s = max(k * (w.x * q.y - w.y * q.x), k * (w.y - q.y));
    return sqrt(d) * sign(s);
}

float sdCylinder(in vec3 p, in float h, in float r) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, 0.5 * h);
    return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
}

`;

export const transformations = `
// From https://www.shadertoy.com/view/3styDs
vec3 Translate(in vec3 p, in vec3 t) {
  return p - t;
}
vec3 Rotate(in vec3 p, in vec3 r) {
  vec3 rad = radians(-r);
  vec3 cosRad = cos(rad);
  vec3 sinRad = sin(rad);

  mat3 xRotation = mat3(1.0,      0.0,       0.0,
                        0.0, cosRad.x, -sinRad.x,
                        0.0, sinRad.x,  cosRad.x);

  mat3 yRotation = mat3( cosRad.y, 0.0, sinRad.y,
                              0.0, 1.0,      0.0,
                        -sinRad.y, 0.0, cosRad.y);

  mat3 zRotation = mat3(cosRad.z, -sinRad.z, 0.0,
                        sinRad.z,  cosRad.z, 0.0,
                             0.0,       0.0, 1.0);

  return zRotation * yRotation * xRotation * p;
}

vec3 Scale(in vec3 p, in vec3 s) {
  return p / s;
}
`;