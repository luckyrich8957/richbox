<template>
  <div class="three-d-scene">
    <!-- Three.js 場景容器 -->
    <canvas ref="sceneCanvas" class="scene-canvas"></canvas>

    <!-- 互動提示 -->
    <div v-if="showHint" class="interaction-hint">
      <span>👆 點擊或拖動旋轉盲盒</span>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default {
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      controls: null,
      showHint: true,
      boxModel: null,
      animationFrame: null
    }
  },
  mounted() {
    this.initScene()
    this.animate()
    window.addEventListener('resize', this.onWindowResize)
  },
  beforeDestroy() {
    window.removeEventListener('resize', this.onWindowResize)
    cancelAnimationFrame(this.animationFrame)
  },
  methods: {
    initScene() {
      // 初始化場景
      this.scene = new THREE.Scene()
      this.scene.background = new THREE.Color(0xeeeeee)

      // 設置相機
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      )
      this.camera.position.z = 5

      // 初始化渲染器
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.sceneCanvas,
        antialias: true,
        alpha: true
      })
      this.renderer.setSize(window.innerWidth, window.innerHeight)

      // 添加燈光
      const ambientLight = new THREE.AmbientLight(0x404040)
      this.scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
      directionalLight.position.set(1, 1, 1).normalize()
      this.scene.add(directionalLight)

      // 加載盲盒模型
      const loader = new GLTFLoader()
      loader.load('/models/box.glb', (gltf) => {
        this.boxModel = gltf.scene
        this.scene.add(this.boxModel)
      })

      // 添加軌道控制器
      this.controls = new OrbitControls(this.camera, this.renderer.domElement)
      this.controls.enableDamping = true
      this.controls.dampingFactor = 0.05
      this.controls.screenSpacePanning = false
      this.controls.minDistance = 2
      this.controls.maxDistance = 10
      this.controls.maxPolarAngle = Math.PI / 2
    },
    animate() {
      this.animationFrame = requestAnimationFrame(this.animate)
      
      // 更新控制器
      if (this.controls) {
        this.controls.update()
      }

      // 渲染場景
      this.renderer.render(this.scene, this.camera)
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight
      this.camera.updateProjectionMatrix()
      this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
  }
}
</script>

<style scoped>
.three-d-scene {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.scene-canvas {
  width: 100%;
  height: 100%;
}

.interaction-hint {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translate(-50%, 0);
  }
  50% {
    transform: translate(-50%, -10px);
  }
}
</style>