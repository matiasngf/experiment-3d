import { Vector3 } from "three";

// export const lightDirection = new Vector3(1, 0.5, 1);
export const lightDirection = new Vector3(1, 0, 0);
lightDirection.applyAxisAngle(new Vector3(0, 0, 1), Math.PI * (23 / 180));

const axis = new Vector3(0, 1, 0);
const angle = Math.PI * (-100 / 180);
lightDirection.applyAxisAngle(axis, angle);

export const perturbNormal2Arb = `
vec3 perturbNormal2Arb( vec3 eye_pos, vec3 surf_norm, vec2 uv, sampler2D map, float scale ) {

  vec3 q0 = dFdx( eye_pos.xyz );
  vec3 q1 = dFdy( eye_pos.xyz );
  vec2 st0 = dFdx( uv.st );
  vec2 st1 = dFdy( uv.st );

  vec3 S = normalize( q0 * st1.t - q1 * st0.t );
  vec3 T = normalize( -q0 * st1.s + q1 * st0.s );
  vec3 N = normalize( surf_norm );

  vec3 mapN = texture2D( map, uv ).xyz * 2.0 - 1.0;
  mapN.xy = scale * mapN.xy;
  mat3 tsn = mat3( S, T, N );
  return normalize( tsn * mapN );

}
`

export const valueRemap = `
float valueRemap(float value, float min, float max, float newMin, float newMax) {
  return newMin + (newMax - newMin) * (value - min) / (max - min);
}
`

export const perturbNormalArb = `
vec2 dHdxy_fwd(vec2 uv, sampler2D map, float scale) {

  float scaledBumpScale = scale / 10.0;

  vec2 dSTdx = dFdx( uv );
  vec2 dSTdy = dFdy( uv );

  float Hll = scaledBumpScale * texture2D( map, uv ).x;
  float dBx = scaledBumpScale * texture2D( map, uv + dSTdx ).x - Hll;
  float dBy = scaledBumpScale * texture2D( map, uv + dSTdy ).x - Hll;

  return vec2( dBx, dBy );

}

vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy ) {

  vec3 vSigmaX = dFdx( surf_pos );
  vec3 vSigmaY = dFdy( surf_pos );
  vec3 vN = surf_norm;		// normalized

  vec3 R1 = cross( vSigmaY, vN );
  vec3 R2 = cross( vN, vSigmaX );

  float fDet = dot( vSigmaX, R1 );

  vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
  return normalize( abs( fDet ) * surf_norm - vGrad );

}
`;

export const curveUp = `
float curveUp( float x, float factor ) {
  return ( 1.0 - factor / (x + factor) ) * (factor + 1.0);
}
`