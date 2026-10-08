'use client';

import { useEffect, useRef } from 'react';
import { Mesh, Program, Renderer, Triangle, Vec3 } from 'ogl';

type VoicePoweredOrbProps = {
  className?: string;
  hue?: number;
  voiceLevel: number;
  active: boolean;
};

const vertexShader = /* glsl */ `
precision highp float;
attribute vec2 position;
attribute vec2 uv;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = /* glsl */ `
precision highp float;
uniform float iTime;
uniform vec3 iResolution;
uniform float hue;
uniform float hover;
uniform float rot;
uniform float hoverIntensity;
varying vec2 vUv;

vec3 rgb2yiq(vec3 c) {
  return vec3(dot(c, vec3(0.299, 0.587, 0.114)), dot(c, vec3(0.596, -0.274, -0.322)), dot(c, vec3(0.211, -0.523, 0.312)));
}
vec3 yiq2rgb(vec3 c) {
  return vec3(c.x + 0.956*c.y + 0.621*c.z, c.x - 0.272*c.y - 0.647*c.z, c.x - 1.106*c.y + 1.703*c.z);
}
vec3 adjustHue(vec3 color, float degrees) {
  float angle = degrees * 3.14159265 / 180.0;
  vec3 yiq = rgb2yiq(color);
  yiq.yz = mat2(cos(angle), -sin(angle), sin(angle), cos(angle)) * yiq.yz;
  return yiq2rgb(yiq);
}
vec3 hash33(vec3 p) {
  p = fract(p * vec3(0.1031, 0.11369, 0.13787));
  p += dot(p, p.yxz + 19.19);
  return -1.0 + 2.0 * fract(vec3(p.x + p.y, p.x + p.z, p.y + p.z) * p.zyx);
}
float snoise3(vec3 p) {
  const float K1 = 0.333333333;
  const float K2 = 0.166666667;
  vec3 i = floor(p + (p.x + p.y + p.z) * K1);
  vec3 d0 = p - (i - (i.x + i.y + i.z) * K2);
  vec3 e = step(vec3(0.0), d0 - d0.yzx);
  vec3 i1 = e * (1.0 - e.zxy);
  vec3 i2 = 1.0 - e.zxy * (1.0 - e);
  vec3 d1 = d0 - (i1 - K2);
  vec3 d2 = d0 - (i2 - K1);
  vec3 d3 = d0 - 0.5;
  vec4 h = max(0.6 - vec4(dot(d0,d0), dot(d1,d1), dot(d2,d2), dot(d3,d3)), 0.0);
  vec4 n = h*h*h*h*vec4(dot(d0,hash33(i)), dot(d1,hash33(i+i1)), dot(d2,hash33(i+i2)), dot(d3,hash33(i+1.0)));
  return dot(vec4(31.316), n);
}
vec4 extractAlpha(vec3 colorIn) {
  float alpha = max(max(colorIn.r, colorIn.g), colorIn.b);
  return vec4(colorIn / (alpha + 1e-5), alpha);
}
float light1(float intensity, float attenuation, float dist) { return intensity / (1.0 + dist * attenuation); }
float light2(float intensity, float attenuation, float dist) { return intensity / (1.0 + dist * dist * attenuation); }

vec4 draw(vec2 uv) {
  vec3 color1 = adjustHue(vec3(0.611765, 0.262745, 0.996078), hue);
  vec3 color2 = adjustHue(vec3(0.298039, 0.760784, 0.913725), hue);
  vec3 color3 = adjustHue(vec3(0.062745, 0.078431, 0.6), hue);
  float angle = atan(uv.y, uv.x);
  float len = length(uv);
  float invLen = len > 0.0 ? 1.0 / len : 0.0;
  float noise = snoise3(vec3(uv * 0.65, iTime * 0.5)) * 0.5 + 0.5;
  float radius = mix(mix(0.6, 1.0, 0.4), mix(0.6, 1.0, 0.6), noise);
  float edge = distance(uv, (radius * invLen) * uv);
  float body = light1(1.0, 10.0, edge) * smoothstep(radius * 1.05, radius, len);
  float colorMix = cos(angle + iTime * 2.0) * 0.5 + 0.5;
  vec2 lightPos = vec2(cos(-iTime), sin(-iTime)) * radius;
  float shineDist = distance(uv, lightPos);
  float shine = light2(1.5, 5.0, shineDist) * light1(1.0, 50.0, edge);
  float outer = smoothstep(1.0, mix(0.6, 1.0, noise * 0.5), len);
  float inner = smoothstep(0.6, 0.8, len);
  vec3 color = mix(color1, color2, colorMix);
  color = (mix(color3, color, body) + shine) * outer * inner;
  color = clamp(color, 0.0, 1.0);
  return extractAlpha(color);
}
void main() {
  vec2 center = iResolution.xy * 0.5;
  float size = min(iResolution.x, iResolution.y);
  // Use the fragment's actual canvas pixel position so the orb stays centered
  // even when the WebGL triangle extends beyond the viewport for full coverage.
  vec2 uv = (gl_FragCoord.xy - center) / size * 2.0;
  float s = sin(rot);
  float c = cos(rot);
  uv = vec2(c * uv.x - s * uv.y, s * uv.x + c * uv.y);
  uv.x += hover * hoverIntensity * 0.1 * sin(uv.y * 10.0 + iTime);
  uv.y += hover * hoverIntensity * 0.1 * sin(uv.x * 10.0 + iTime);
  vec4 color = draw(uv);
  gl_FragColor = vec4(color.rgb * color.a, color.a);
}`;

export function VoicePoweredOrb({ className = '', hue = 0, voiceLevel, active }: VoicePoweredOrbProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const stateRef = useRef({ level: voiceLevel, active, hue });
  stateRef.current = { level: voiceLevel, active, hue };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: false, antialias: true, dpr: Math.min(window.devicePixelRatio || 1, 2) });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    container.appendChild(gl.canvas);
    gl.canvas.style.display = 'block';
    gl.canvas.style.width = '100%';
    gl.canvas.style.height = '100%';

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Vec3(1, 1, 1) },
        hue: { value: hue },
        hover: { value: 0 },
        rot: { value: 0 },
        hoverIntensity: { value: 0 },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });
    let frameId = 0;
    let previousTime = 0;
    let rotation = 0;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      renderer.setSize(rect.width * dpr, rect.height * dpr);
      program.uniforms.iResolution.value.set(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    const render = (time: number) => {
      frameId = window.requestAnimationFrame(render);
      const dt = Math.min((time - previousTime) / 1000, 0.05);
      previousTime = time;
      const state = stateRef.current;
      const level = Math.max(0, Math.min(1, state.level));
      program.uniforms.iTime.value = time * 0.001;
      program.uniforms.hue.value = state.hue;
      program.uniforms.hover.value = state.active ? Math.min(level * 2, 1) : 0;
      program.uniforms.hoverIntensity.value = state.active ? Math.min(level * 0.64, 0.8) : 0;
      if (state.active && level > 0.05) rotation += dt * (0.3 + level * 2.4);
      program.uniforms.rot.value = rotation;
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      renderer.render({ scene: mesh });
    };
    frameId = window.requestAnimationFrame(render);

    return () => {
      window.cancelAnimationFrame(frameId);
      observer.disconnect();
      if (container.contains(gl.canvas)) container.removeChild(gl.canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return <div ref={containerRef} className={`relative h-full w-full ${className}`} aria-hidden="true" />;
}
