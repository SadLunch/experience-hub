// @see https://discourse.threejs.org/t/production-ready-green-screen-with-three-js/23113/2

// shaders.js
const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;

  uniform sampler2D tex;
  uniform vec3  keyColor;
  uniform float similarity;
  uniform float smoothness;
  uniform float spill;
  uniform float grayscale; // 0..1 mix to grayscale

  varying vec2 vUv;

  // Convert to YCrCb (Y, Cr, Cb) per common chroma-key approach
  vec3 rgb2ycrcb(vec3 c) {
    float y  = dot(c, vec3(0.2989, 0.5866, 0.1145));
    float cr = 0.7132 * (c.r - y);
    float cb = 0.5647 * (c.b - y);
    return vec3(y, cr, cb);
  }

  void main() {
    vec4 src = texture2D(tex, vUv);

    // Distance in chroma space
    vec3 ycc    = rgb2ycrcb(src.rgb);
    vec3 keyYcc = rgb2ycrcb(keyColor);
    float chromaDist = distance(ycc.yz, keyYcc.yz);

    // Matte: 0 (fully keyed) .. 1 (fully keep)
    float matte = smoothstep(similarity, similarity + smoothness, chromaDist);

    // Simple spill suppression (reduce G-ish component near key)
    float spillFactor = clamp(1.0 - spill * (1.0 - matte), 0.0, 1.0);
    vec3  despilled   = vec3(src.r, min(src.g, (src.r + src.b) * 0.5), src.b);
    vec3  keyedColor  = mix(despilled, src.rgb, spillFactor);

    // Grayscale mix AFTER keying/spill
    float g = dot(keyedColor, vec3(0.299, 0.587, 0.114));
    vec3  finalRGB = mix(keyedColor, vec3(g), grayscale);

    gl_FragColor = vec4(finalRGB, matte * src.a);
  }
`;


export {
  VERTEX_SHADER,
  FRAGMENT_SHADER,
}