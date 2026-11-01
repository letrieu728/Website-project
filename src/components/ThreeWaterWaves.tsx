import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Waves, Eye, EyeOff, Sparkles, Droplets } from 'lucide-react';

interface Ripple {
  x: number;
  y: number;
  intensity: number;
  radius: number;
  maxRadius: number;
  decay: number;
}

export function ThreeWaterWaves() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState<boolean>(true);
  const [waveTheme, setWaveTheme] = useState<'emerald' | 'amber' | 'deepSea'>('emerald');
  const [showControls, setShowControls] = useState<boolean>(false);
  
  // Keep theme in ref for render loop without re-instantiating scene
  const themeRef = useRef(waveTheme);
  themeRef.current = waveTheme;

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // 1. Detect software WebGL guard
    const isSoftwareGl = (() => {
      try {
        const gl = document.createElement('canvas').getContext('webgl2');
        if (!gl) return true;
        const ext = gl.getExtension('WEBGL_debug_renderer_info');
        const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
        const gpu = String(gl.getParameter(param));
        gl.getExtension('WEBGL_lose_context')?.loseContext();
        return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
      } catch {
        return false;
      }
    })();

    // 2. Setup Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, -6, 8.5);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: !isSoftwareGl,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 1.75));
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    // 3. Lighting setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x34d399, 1.2);
    dirLight1.position.set(5, 8, 10);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xf59e0b, 0.8);
    dirLight2.position.set(-6, -4, 6);
    scene.add(dirLight2);

    // 4. Create Water Plane Geometry
    // Plane segments: 60x60 is high enough for silky wave motion, low enough for 60fps
    const segX = isSoftwareGl ? 36 : 64;
    const segY = isSoftwareGl ? 36 : 64;
    const planeWidth = 18;
    const planeHeight = 14;
    const geometry = new THREE.PlaneGeometry(planeWidth, planeHeight, segX, segY);

    // Store original positions for base calculation
    const originalPositions = geometry.attributes.position.array.slice() as Float32Array;

    // Theme color presets
    const themePalettes = {
      emerald: {
        color: 0x059669,
        specular: 0x6ee7b7,
        emissive: 0x022c22,
        light1: 0x10b981,
        light2: 0xf59e0b,
      },
      amber: {
        color: 0xd97706,
        specular: 0xfde68a,
        emissive: 0x451a03,
        light1: 0xfbbf24,
        light2: 0xf43f5e,
      },
      deepSea: {
        color: 0x0284c7,
        specular: 0x7dd3fc,
        emissive: 0x082f49,
        light1: 0x38bdf8,
        light2: 0x10b981,
      },
    };

    // Material with physical shininess, wireframe accent option, and translucency
    const currentPalette = themePalettes[themeRef.current];
    const material = new THREE.MeshPhongMaterial({
      color: currentPalette.color,
      specular: currentPalette.specular,
      shininess: 90,
      transparent: true,
      opacity: 0.28,
      wireframe: false,
      side: THREE.DoubleSide,
      flatShading: false,
    });

    // Secondary subtle wireframe overlay for tech/futuristic food rescue aesthetics
    const wireframeMat = new THREE.MeshBasicMaterial({
      color: 0x10b981,
      wireframe: true,
      transparent: true,
      opacity: 0.07,
    });

    const mesh = new THREE.Mesh(geometry, material);
    const wireframeMesh = new THREE.Mesh(geometry, wireframeMat);
    scene.add(mesh);
    scene.add(wireframeMesh);

    // 5. Mouse Interaction Tracking & Ripples
    const mousePlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const raycaster = new THREE.Raycaster();
    const mouseCoord = new THREE.Vector2(-999, -999);
    const targetMouse3D = new THREE.Vector3(0, 0, 0);
    let isMouseOver = false;

    const ripples: Ripple[] = [];

    const handlePointerMove = (e: PointerEvent) => {
      isMouseOver = true;
      mouseCoord.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseCoord.y = -(e.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouseCoord, camera);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(mousePlane, intersectionPoint);

      if (intersectionPoint) {
        targetMouse3D.copy(intersectionPoint);

        // Add ripple impulse when mouse moves swiftly
        if (Math.random() > 0.45 && ripples.length < 12) {
          ripples.push({
            x: intersectionPoint.x,
            y: intersectionPoint.y,
            intensity: 0.45,
            radius: 0.1,
            maxRadius: 3.5,
            decay: 0.965,
          });
        }
      }
    };

    const handlePointerLeave = () => {
      isMouseOver = false;
    };

    const handleWindowClick = (e: MouseEvent) => {
      // Add a stronger splash ripple on click
      mouseCoord.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouseCoord.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouseCoord, camera);
      const intersectionPoint = new THREE.Vector3();
      raycaster.ray.intersectPlane(mousePlane, intersectionPoint);
      if (intersectionPoint) {
        ripples.push({
          x: intersectionPoint.x,
          y: intersectionPoint.y,
          intensity: 0.85,
          radius: 0.1,
          maxRadius: 4.5,
          decay: 0.97,
        });
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('click', handleWindowClick);

    // 6. Window resize handler
    const handleResize = () => {
      if (!renderer || !camera) return;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // 7. Animation Loop with Sine/Cosine Wave Algorithm & Mouse Disturbance
    let animationFrameId = 0;
    let clock = new THREE.Clock();

    const renderLoop = () => {
      const time = clock.getElapsedTime() * 1.35;
      const pos = geometry.attributes.position;
      const count = pos.count;

      // Update color based on current active theme
      const activePalette = themePalettes[themeRef.current];
      material.color.setHex(activePalette.color);
      material.specular.setHex(activePalette.specular);
      wireframeMat.color.setHex(activePalette.light1);
      dirLight1.color.setHex(activePalette.light1);
      dirLight2.color.setHex(activePalette.light2);

      // Expand & decay active ripples
      for (let r = ripples.length - 1; r >= 0; r--) {
        const ripple = ripples[r];
        ripple.radius += 0.08;
        ripple.intensity *= ripple.decay;
        if (ripple.intensity < 0.015 || ripple.radius > ripple.maxRadius) {
          ripples.splice(r, 1);
        }
      }

      // Calculate new heights for each vertex
      for (let i = 0; i < count; i++) {
        const ox = originalPositions[i * 3];
        const oy = originalPositions[i * 3 + 1];

        // Primary harmonious ocean waves
        let z =
          Math.sin(ox * 0.45 + time * 1.2) * 0.22 +
          Math.cos(oy * 0.5 + time * 0.9) * 0.2 +
          Math.sin((ox + oy) * 0.35 + time * 1.4) * 0.15 +
          Math.cos((ox - oy) * 0.28 + time * 0.7) * 0.12;

        // Mouse proximity uplift effect (gentle mound around cursor)
        if (isMouseOver) {
          const dxMouse = ox - targetMouse3D.x;
          const dyMouse = oy - targetMouse3D.y;
          const distMouseSq = dxMouse * dxMouse + dyMouse * dyMouse;
          if (distMouseSq < 8.0) {
            const influence = Math.exp(-distMouseSq / 1.8);
            z += influence * 0.55 * Math.cos(time * 3.0);
          }
        }

        // Apply dynamic ripples from mouse trajectory
        for (let r = 0; r < ripples.length; r++) {
          const rip = ripples[r];
          const dx = ox - rip.x;
          const dy = oy - rip.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const diff = Math.abs(dist - rip.radius);
          if (diff < 1.2) {
            const rippleHeight = Math.cos(diff * Math.PI) * rip.intensity * (1 - diff / 1.2);
            z += rippleHeight;
          }
        }

        pos.setZ(i, z);
      }

      pos.needsUpdate = true;
      geometry.computeVertexNormals();

      // Gentle camera sway
      camera.position.x = Math.sin(time * 0.15) * 0.5;
      camera.position.y = -6.5 + Math.cos(time * 0.12) * 0.25;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      animationFrameId = requestAnimationFrame(renderLoop);
    };

    animationFrameId = requestAnimationFrame(renderLoop);

    // 8. Cleanup on Unmount
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('click', handleWindowClick);
      window.removeEventListener('resize', handleResize);

      geometry.dispose();
      material.dispose();
      wireframeMat.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <>
      {/* Three.js 3D Water Waves Canvas Mount */}
      <div
        ref={containerRef}
        className={`fixed inset-0 pointer-events-none transition-opacity duration-700 -z-10 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{
          background:
            waveTheme === 'emerald'
              ? 'linear-gradient(180deg, rgba(244,249,246,0.92) 0%, rgba(236,248,241,0.85) 50%, rgba(245,245,244,0.95) 100%)'
              : waveTheme === 'amber'
              ? 'linear-gradient(180deg, rgba(255,251,245,0.92) 0%, rgba(254,243,228,0.85) 50%, rgba(245,245,244,0.95) 100%)'
              : 'linear-gradient(180deg, rgba(240,249,255,0.92) 0%, rgba(224,242,254,0.85) 50%, rgba(245,245,244,0.95) 100%)',
        }}
      />

      {/* Floating Wave Surface Controller (Bottom-Right, unobtrusive & collapsable) */}
      <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 text-xs">
        {showControls && (
          <div className="bg-white/95 backdrop-blur-md border border-stone-200/90 shadow-xl rounded-2xl p-3 w-56 flex flex-col gap-2.5 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-2">
              <div className="flex items-center gap-1.5 font-bold text-stone-800">
                <Waves className="w-4 h-4 text-emerald-600" />
                <span>Hiệu Ứng Sóng 3D</span>
              </div>
              <button
                type="button"
                onClick={() => setIsVisible(!isVisible)}
                className={`p-1 rounded-lg transition-colors ${
                  isVisible ? 'bg-emerald-50 text-emerald-700' : 'bg-stone-100 text-stone-500'
                }`}
                title={isVisible ? 'Tắt hiệu ứng nền' : 'Bật hiệu ứng nền'}
              >
                {isVisible ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
              </button>
            </div>

            <div className="text-[11px] text-stone-500 leading-tight">
              Sóng nước 3D Three.js mô phỏng giờ vàng, tự động gợn sóng khi bạn di chuyển con trỏ chuột.
            </div>

            <div className="flex flex-col gap-1.5 pt-1">
              <span className="text-[11px] font-semibold text-stone-600">Sắc độ ánh sáng:</span>
              <div className="grid grid-cols-3 gap-1.5">
                <button
                  type="button"
                  onClick={() => setWaveTheme('emerald')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium text-[11px] transition-all flex items-center justify-center gap-1 ${
                    waveTheme === 'emerald'
                      ? 'bg-emerald-600 text-white shadow-sm ring-1 ring-emerald-500'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Xanh
                </button>
                <button
                  type="button"
                  onClick={() => setWaveTheme('amber')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium text-[11px] transition-all flex items-center justify-center gap-1 ${
                    waveTheme === 'amber'
                      ? 'bg-amber-600 text-white shadow-sm ring-1 ring-amber-500'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  Hổ phách
                </button>
                <button
                  type="button"
                  onClick={() => setWaveTheme('deepSea')}
                  className={`py-1.5 px-2 rounded-xl text-center font-medium text-[11px] transition-all flex items-center justify-center gap-1 ${
                    waveTheme === 'deepSea'
                      ? 'bg-sky-600 text-white shadow-sm ring-1 ring-sky-500'
                      : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  Biển sâu
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Minimal Toggle Button */}
        <button
          type="button"
          onClick={() => setShowControls(!showControls)}
          className="flex items-center gap-1.5 px-3 py-2 bg-white/90 hover:bg-white border border-stone-200 shadow-md hover:shadow-lg rounded-full text-stone-700 hover:text-emerald-700 font-medium text-xs backdrop-blur-md transition-all active:scale-95"
          title="Tùy chỉnh hiệu ứng sóng Three.js"
        >
          <Waves className="w-4 h-4 text-emerald-600 animate-pulse" />
          <span>Sóng Nước 3D</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
        </button>
      </div>
    </>
  );
}
