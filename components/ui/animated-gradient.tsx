"use client";

import { useEffect, useRef } from "react";

type Props = { className?: string };

// Prism preset from the supplied AnimatedGradient component.
const PRISM = {
  color1: "#050505",
  color2: "#66B3FF",
  color3: "#FFFFFF",
  rotation: -50,
  proportion: 1,
  scale: 0.01,
  speed: 30,
  distortion: 0,
  swirl: 50,
  swirlIterations: 16,
  softness: 47,
  offset: -299,
  shapeSize: 45,
};

export function AnimatedGradient({ className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    const gl = canvas?.getContext("webgl2", { alpha: true, antialias: true });
    if (!canvas || !container || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type)!;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      return shader;
    };

    const program = gl.createProgram()!;
    const vertex = compile(gl.VERTEX_SHADER, `#version 300 es
      in vec2 a_position;
      void main() { gl_Position = vec4(a_position, 0.0, 1.0); }
    `);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    gl.useProgram(program);

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    const position = gl.getAttribLocation(program, "a_position");
    gl.enableVertexAttribArray(position);
    gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

    const uniform = (name: string) => gl.getUniformLocation(program, name);
    const locations = {
      time: uniform("u_time"), resolution: uniform("u_resolution"), pixelRatio: uniform("u_pixelRatio"),
      scale: uniform("u_scale"), rotation: uniform("u_rotation"), proportion: uniform("u_proportion"),
      softness: uniform("u_softness"), distortion: uniform("u_distortion"), swirl: uniform("u_swirl"),
      iterations: uniform("u_swirlIterations"), shapeScale: uniform("u_shapeScale"),
      color1: uniform("u_color1"), color2: uniform("u_color2"), color3: uniform("u_color3"),
    };

    const rgb = (hex: string) => [parseInt(hex.slice(1, 3), 16) / 255, parseInt(hex.slice(3, 5), 16) / 255, parseInt(hex.slice(5, 7), 16) / 255] as const;
    const [r1, g1, b1] = rgb(PRISM.color1);
    const [r2, g2, b2] = rgb(PRISM.color2);
    const [r3, g3, b3] = rgb(PRISM.color3);
    let frame = 0;
    const start = performance.now();

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(container.clientWidth * ratio);
      canvas.height = Math.round(container.clientHeight * ratio);
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    const draw = (now: number) => {
      gl.uniform1f(locations.time, ((now - start) / 1000) * 0.25 + PRISM.offset * 0.01);
      gl.uniform2f(locations.resolution, canvas.width, canvas.height);
      gl.uniform1f(locations.pixelRatio, Math.min(window.devicePixelRatio || 1, 2));
      gl.uniform1f(locations.scale, PRISM.scale);
      gl.uniform1f(locations.rotation, (PRISM.rotation * Math.PI) / 180);
      gl.uniform1f(locations.proportion, PRISM.proportion / 100);
      gl.uniform1f(locations.softness, PRISM.softness / 100);
      gl.uniform1f(locations.distortion, PRISM.distortion / 50);
      gl.uniform1f(locations.swirl, PRISM.swirl / 100);
      gl.uniform1f(locations.iterations, PRISM.swirlIterations);
      gl.uniform1f(locations.shapeScale, PRISM.shapeSize / 100);
      gl.uniform4f(locations.color1, r1, g1, b1, 1);
      gl.uniform4f(locations.color2, r2, g2, b2, 1);
      gl.uniform4f(locations.color3, r3, g3, b3, 1);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      frame = requestAnimationFrame(draw);
    };

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(container);
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={`pointer-events-none absolute inset-0 h-full w-full ${className}`} />;
}

const FRAGMENT_SHADER = `#version 300 es
precision highp float;
uniform float u_time, u_pixelRatio, u_scale, u_rotation, u_proportion, u_softness, u_distortion, u_swirl, u_swirlIterations, u_shapeScale;
uniform vec2 u_resolution;
uniform vec4 u_color1, u_color2, u_color3;
out vec4 fragColor;
#define PI 3.14159265359
#define TWO_PI 6.28318530718
vec2 rotate(vec2 uv, float a) { return mat2(cos(a), sin(a), -sin(a), cos(a)) * uv; }
float random(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p); f = f * f * (3.0 - 2.0 * f);
  return mix(mix(random(i), random(i + vec2(1., 0.)), f.x), mix(random(i + vec2(0., 1.)), random(i + vec2(1., 1.)), f.x), f.y);
}
void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float t = .5 * u_time;
  float noiseScale = .0005 + .006 * u_scale;
  uv -= .5; uv *= noiseScale * u_resolution; uv = rotate(uv, u_rotation * .5 * PI); uv /= u_pixelRatio; uv += .5;
  float n1 = noise(uv + t), n2 = noise(uv * 2. - t), angle = n1 * TWO_PI;
  uv += 4. * u_distortion * n2 * vec2(cos(angle), sin(angle));
  for (float i = 1.; i <= 30.; i++) {
    if (i > ceil(clamp(u_swirlIterations, 1., 30.))) break;
    uv.x += u_swirl / i * cos(t + i * 1.5 * uv.y);
    uv.y += u_swirl / i * cos(t + i * uv.x);
  }
  vec2 checks = uv * (.5 + 3.5 * u_shapeScale);
  float shape = .5 + .5 * sin(checks.x) * cos(checks.y);
  float mixer = shape + .48 * sign(u_proportion - .5) * pow(abs(u_proportion - .5), .5);
  float edge = 1. - clamp(u_softness, 0., 1.);
  float m1 = smoothstep(.35 * edge, .7 - .35 * edge + .01, mixer);
  float m2 = smoothstep(.3 + .35 * edge, 1. - .35 * edge + .01, mixer);
  fragColor = vec4(mix(mix(u_color1.rgb, u_color2.rgb, m1), u_color3.rgb, m2), 1.);
}`;
