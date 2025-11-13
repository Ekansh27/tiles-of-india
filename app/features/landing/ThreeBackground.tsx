'use client'

import { useRef, useEffect } from 'react'
import * as THREE from 'three'

export function ThreeBackground() {
  const mountRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!mountRef.current) return
    const mount = mountRef.current
    let renderer: THREE.WebGLRenderer | null = null

    try {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        mount.clientWidth / mount.clientHeight,
        0.1,
        1000
      )
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(mount.clientWidth, mount.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      mount.appendChild(renderer.domElement)

      // Add floating cubes
      const cubes: THREE.Mesh[] = []
      for (let i = 0; i < 12; i++) {
        const size = Math.random() * 0.3 + 0.2
        const cubeGeom = new THREE.BoxGeometry(size, size, size)
        const cubeMat = new THREE.MeshStandardMaterial({
          color: 0x228B22,
          wireframe: true,
          transparent: true,
          opacity: 0.25,
        })
        const cube = new THREE.Mesh(cubeGeom, cubeMat)
        cube.position.set(
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 10,
          (Math.random() - 0.5) * 10
        )
        cube.userData.speed = Math.random() * 0.01 + 0.005
        cube.userData.rotSpeed = Math.random() * 0.02 + 0.01
        cubes.push(cube)
        scene.add(cube)
      }

      // Particle system
      const particleCount = 200
      const particleGeom = new THREE.BufferGeometry()
      const positions = new Float32Array(particleCount * 3)
      const velocities: Array<{ x: number; y: number; z: number }> = []

      for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 30
        positions[i * 3 + 1] = (Math.random() - 0.5) * 20
        positions[i * 3 + 2] = (Math.random() - 0.5) * 20
        velocities.push({
          x: (Math.random() - 0.5) * 0.005,
          y: (Math.random() - 0.5) * 0.005,
          z: (Math.random() - 0.5) * 0.005,
        })
      }

      particleGeom.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
      )
      const particleMat = new THREE.PointsMaterial({
        color: 0x228B22,
        size: 0.08,
        transparent: true,
        opacity: 0.25,
        blending: THREE.AdditiveBlending,
      })
      const particles = new THREE.Points(particleGeom, particleMat)
      scene.add(particles)

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)

      const pointLight1 = new THREE.PointLight(0x228B22, 2)
      pointLight1.position.set(5, 5, 5)
      scene.add(pointLight1)

      const pointLight2 = new THREE.PointLight(0x10b981, 1.5)
      pointLight2.position.set(-5, -3, 3)
      scene.add(pointLight2)

      camera.position.z = 5

      const handleResize = () => {
        camera.aspect = mount.clientWidth / mount.clientHeight
        camera.updateProjectionMatrix()
        renderer?.setSize(mount.clientWidth, mount.clientHeight)
      }
      window.addEventListener('resize', handleResize)

      let animationFrameId: number
      let time = 0

      const animate = () => {
        animationFrameId = requestAnimationFrame(animate)
        time += 0.01

        // Animate cubes
        cubes.forEach((cube) => {
          cube.rotation.x += cube.userData.rotSpeed
          cube.rotation.y += cube.userData.rotSpeed
          cube.position.y += Math.sin(time + cube.position.x) * 0.005
        })

        // Animate particles
        const pos = particles.geometry.attributes.position.array as Float32Array
        for (let i = 0; i < particleCount; i++) {
          pos[i * 3] += velocities[i].x
          pos[i * 3 + 1] += velocities[i].y
          pos[i * 3 + 2] += velocities[i].z

          if (Math.abs(pos[i * 3]) > 15) velocities[i].x *= -1
          if (Math.abs(pos[i * 3 + 1]) > 10) velocities[i].y *= -1
          if (Math.abs(pos[i * 3 + 2]) > 10) velocities[i].z *= -1
        }
        particles.geometry.attributes.position.needsUpdate = true

        pointLight1.position.x = Math.sin(time * 0.5) * 7
        pointLight1.position.z = Math.cos(time * 0.5) * 7

        renderer?.render(scene, camera)
      }
      animate()

      return () => {
        window.removeEventListener('resize', handleResize)
        cancelAnimationFrame(animationFrameId)
        if (renderer) renderer.dispose()
        if (mount && renderer?.domElement)
          mount.removeChild(renderer.domElement)
      }
    } catch (error) {
      console.error('Failed to create WebGL context:', error)
      if (renderer && mount && renderer.domElement)
        mount.removeChild(renderer.domElement)
    }
  }, [])

  return <div ref={mountRef} className="landing-background" />
}
