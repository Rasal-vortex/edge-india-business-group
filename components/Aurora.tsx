'use client';

import { Color, Mesh, Program, Renderer, Triangle } from 'ogl';
import { useEffect, useRef } from 'react';
import { useReducedMotion } from 'motion/react';
import './Aurora.css';

const vertexShader = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;

const fragmentShader = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
out vec4 fragColor;

vec3 permute(vec3 x) {
  return mod(((x * 34.0) + 1.0) * x, 289.0);
}

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = x0.x > x0.y ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m *= m;
  m *= m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop { vec3 color; float position; };

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  ColorStop stops[3];
  stops[0] = ColorStop(uColorStops[0], 0.0);
  stops[1] = ColorStop(uColorStops[1], 0.5);
  stops[2] = ColorStop(uColorStops[2], 1.0);
  vec3 rampColor;
  if (uv.x < 0.5) {
    rampColor = mix(stops[0].color, stops[1].color, uv.x * 2.0);
  } else {
    rampColor = mix(stops[1].color, stops[2].color, (uv.x - 0.5) * 2.0);
  }
  float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = uv.y * 2.0 - height + 0.2;
  float intensity = 0.6 * height;
  float auroraAlpha = smoothstep(0.20 - uBlend * 0.5, 0.20 + uBlend * 0.5, intensity);
  float coverage = clamp(auroraAlpha * (0.55 + 0.45 * clamp(intensity, 0.0, 1.0)), 0.0, 0.72);
  vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
  float peak = max(chroma.r, max(chroma.g, chroma.b));
  chroma /= max(peak, 0.0001);
  fragColor = vec4(mix(vec3(1.0), chroma, min(coverage, 0.84)), 1.0);
}`;

const DEFAULT_COLOR_STOPS: [string, string, string] = ['#12358f', '#9bbcff', '#bb0013'];

type AuroraProps = {
  colorStops?: [string, string, string];
  amplitude?: number;
  blend?: number;
  speed?: number;
};

const colorToRgb = (hex: string) => {
  const color = new Color(hex);
  return [color.r, color.g, color.b];
};

export default function Aurora({
  colorStops = DEFAULT_COLOR_STOPS,
  amplitude = 0.85,
  blend = 0.46,
  speed = 0.24,
}: AuroraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({ alpha: false, antialias: false, dpr: 1 });
    } catch {
      return;
    }

    const gl = renderer.gl;
    gl.clearColor(1, 1, 1, 1);
    const geometry = new Triangle(gl);
    if (geometry.attributes.uv) delete geometry.attributes.uv;

    const program = new Program(gl, {
      vertex: vertexShader,
      fragment: fragmentShader,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: colorStops.map(colorToRgb) },
        uResolution: { value: [1, 1] },
        uBlend: { value: blend },
      },
    });
    const mesh = new Mesh(gl, { geometry, program });
    const canvas = gl.canvas;
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const resize = () => {
      const { width, height } = container.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height);
      program.uniforms.uResolution.value = [width, height];
      renderer.render({ scene: mesh });
    };

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    resize();

    let frameId = 0;
    const animate = (time: number) => {
      program.uniforms.uTime.value = reducedMotion ? 0 : time * 0.001 * speed;
      renderer.render({ scene: mesh });
      if (!reducedMotion) frameId = requestAnimationFrame(animate);
    };
    if (!reducedMotion) frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      if (canvas.parentNode === container) container.removeChild(canvas);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, [amplitude, blend, colorStops, reducedMotion, speed]);

  return <div ref={containerRef} className="aurora-background" aria-hidden="true" />;
}
