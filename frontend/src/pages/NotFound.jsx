import { useEffect, useRef } from "react"
import * as THREE from "three"
import { useNavigate } from "react-router-dom"

export default function NotFound() {
  const containerRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const scene = new THREE.Scene()
    const camera = new THREE.Camera()
    camera.position.z = 1

    const geometry = new THREE.PlaneGeometry(2, 2)

    const material = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        resolution: { value: new THREE.Vector2() }
      },
      vertexShader: `
        void main() {
          gl_Position = vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        precision highp float;
        uniform float time;
        uniform vec2 resolution;

        float noise(vec2 p) {
          return sin(p.x * 10.0) * sin(p.y * 10.0);
        }

        void main() {
          vec2 uv = (gl_FragCoord.xy * 2.0 - resolution.xy)
                    / min(resolution.x, resolution.y);

          float n = noise(uv + time * 0.2);
          float glow = 1.0 / (abs(length(uv) - 0.3) * 20.0 + 0.1);

          vec3 color = vec3(
            0.9 + 0.1 * sin(time + uv.x),
            0.4 + 0.2 * n,
            0.3
          );

          gl_FragColor = vec4(color * glow, 1.0);
        }
      `
    })

    const mesh = new THREE.Mesh(geometry, material)
    scene.add(mesh)

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    container.appendChild(renderer.domElement)

    const resize = () => {
      const w = window.innerWidth
      const h = window.innerHeight
      renderer.setSize(w, h)
      material.uniforms.resolution.value.set(
        renderer.domElement.width,
        renderer.domElement.height
      )
    }

    resize()
    window.addEventListener("resize", resize)

    let frame
    const animate = () => {
      material.uniforms.time.value += 0.02
      renderer.render(scene, camera)
      frame = requestAnimationFrame(animate)
    }
    animate()

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("resize", resize)
      renderer.dispose()
      geometry.dispose()
      material.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [])

  return (
    <>
      {/* Three.js Background */}
      <div
        ref={containerRef}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: -1,
          background: "black"
        }}
      />

      {/* 404 Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center text-white text-center px-6">
        <h1 className="text-7xl font-bold tracking-widest mb-4">404</h1>
        <p className="text-lg opacity-80 mb-8">
          The page you’re looking for doesn’t exist.
        </p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 border border-white/60 hover:bg-white hover:text-black transition"
        >
          Go Home
        </button>
      </div>
    </>
  )
}
