import { useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { shaderMaterial, useTrailTexture } from "@react-three/drei"
import * as THREE from "three"

/* ================= SHADER MATERIAL ================= */

const DotMaterial = shaderMaterial(
  {
    time: 0,
    resolution: new THREE.Vector2(),
    dotColor: new THREE.Color("#FFFFFF"),
    bgColor: new THREE.Color("#121212"),
    mouseTrail: null,
    render: 0,
    rotation: 0,
    gridSize: 100,
    dotOpacity: 0.05,
  },
  `
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  `
    uniform float time;
    uniform vec2 resolution;
    uniform vec3 dotColor;
    uniform vec3 bgColor;
    uniform sampler2D mouseTrail;
    uniform float rotation;
    uniform float gridSize;
    uniform float dotOpacity;

    vec2 rotate(vec2 uv, float angle) {
      float s = sin(angle);
      float c = cos(angle);
      mat2 m = mat2(c, -s, s, c);
      return m * (uv - 0.5) + 0.5;
    }

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution / max(resolution.x, resolution.y);
      return (uv - 0.5) * s + 0.5;
    }

    float sdfCircle(vec2 p, float r) {
      return length(p - 0.5) - r;
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);
      vec2 rotatedUv = rotate(uv, rotation);

      vec2 gridUv = fract(rotatedUv * gridSize);
      vec2 cellCenter = (floor(rotatedUv * gridSize) + 0.5) / gridSize;

      float baseDot = sdfCircle(gridUv, 0.25);

      float screenMask = smoothstep(0.0, 1.0, 1.0 - uv.y);
      float circleDist = length(uv - vec2(0.7, 1.1));
      float circleMask = smoothstep(0.5, 1.0, circleDist);
      float animatedMask = sin(time * 2.0 + circleDist * 10.0);

      float mouseInfluence = texture2D(mouseTrail, cellCenter).r;
      float scaleInfluence = max(mouseInfluence * 0.5, animatedMask * 0.3);

      float dotSize = min(pow(circleDist, 2.0) * 0.3, 0.3);
      float sdfDot = sdfCircle(gridUv, dotSize * (1.0 + scaleInfluence * 0.5));
      float smoothDot = smoothstep(0.05, 0.0, sdfDot);

      float opacityBoost = max(mouseInfluence * 50.0, animatedMask * 0.5);

      vec3 color = mix(
        bgColor,
        dotColor,
        smoothDot * screenMask * circleMask * dotOpacity * (1.0 + opacityBoost)
      );

      gl_FragColor = vec4(color, 1.0);
    }
  `
)

/* ================= SCENE ================= */

function Scene() {
  const { size, viewport } = useThree()

  const [trail, onMove] = useTrailTexture({
    size: 512,
    radius: 0.1,
    maxAge: 400,
    interpolate: 1,
  })

  const material = useMemo(() => new DotMaterial(), [])

  useEffect(() => {
    material.uniforms.dotColor.value.set("#ffffff")
    material.uniforms.bgColor.value.set("#121212")
    material.uniforms.dotOpacity.value = 0.05
  }, [material])

  useFrame((state) => {
    material.uniforms.time.value = state.clock.elapsedTime
  })

  const scale = Math.max(viewport.width, viewport.height) / 2

  return (
    <mesh scale={[scale, scale, 1]} onPointerMove={onMove}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={material}
        resolution={[
          size.width * viewport.dpr,
          size.height * viewport.dpr,
        ]}
        gridSize={100}
        mouseTrail={trail}
      />
    </mesh>
  )
}

/* ================= BACKGROUND WRAPPER ================= */

export default function DotScreenShader() {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
      }}
    >
      <Canvas
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          outputColorSpace: THREE.SRGBColorSpace,
          toneMapping: THREE.NoToneMapping,
        }}
      >
        <Scene />
      </Canvas>
    </div>
  )
}
