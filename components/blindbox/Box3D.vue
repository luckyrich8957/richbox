<template>
  <div class="box3d-container">
    <canvas ref="canvas" class="box3d-canvas"></canvas>
    <div v-if="isOpening" class="box-opening-overlay">
      <div class="box-opening-text">開盒中...</div>
    </div>
  </div>
</template>

<script>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader.js';
import { gsap } from 'gsap';

export default {
  name: 'Box3D',
  props: {
    modelUrl: {
      type: String,
      required: true
    },
    eggProbability: {
      type: Number,
      default: 0.1
    }
  },
  data() {
    return {
      scene: null,
      camera: null,
      renderer: null,
      box: null,
      isOpening: false,
      isEggFound: false,
      raycaster: new THREE.Raycaster(),
      mouse: new THREE.Vector2(),
      rotationSpeed: 0.01,
      shakeThreshold: 0.5,
      lastPosition: new THREE.Vector3(),
      lastTime: 0
    };
  },
  mounted() {
    this.initScene();
    this.loadModel();
    this.addEventListeners();
    this.animate();
  },
  methods: {
    initScene() {
      // Scene setup
      this.scene = new THREE.Scene();
      
      // Advanced camera with orbit controls
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      this.camera.position.set(0, 2, 5);
      
      // Add orbit controls
      this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.05;
      this.controls.screenSpacePanning = false;
      this.controls.minDistance = 3;
      this.controls.maxDistance = 10;
      this.controls.maxPolarAngle = Math.PI / 2;
      
      // Add post-processing effects
      this.composer = new THREE.EffectComposer(this.renderer);
      this.renderPass = new THREE.RenderPass(this.scene, this.camera);
      this.composer.addPass(this.renderPass);
      
      // Add bloom effect
      this.bloomPass = new THREE.UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5, // strength
        0.4, // radius
        0.85 // threshold
      );
      this.composer.addPass(this.bloomPass);
      
      // Add FXAA antialiasing
      this.fxaaPass = new THREE.ShaderPass(THREE.FXAAShader);
      this.fxaaPass.uniforms['resolution'].value.set(
        1 / window.innerWidth,
        1 / window.innerHeight
      );
      this.composer.addPass(this.fxaaPass);

      // Renderer
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.$refs.canvas,
        antialias: true,
        alpha: true
      });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);

      // Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      this.scene.add(ambientLight);

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
      directionalLight.position.set(1, 1, 1).normalize();
      this.scene.add(directionalLight);
    },
    loadModel() {
      const loader = new GLTFLoader();
      loader.load(this.modelUrl, (gltf) => {
        this.box = gltf.scene;
        this.scene.add(this.box);
        
        // Adjust box position and scale
        const boxSize = new THREE.Box3().setFromObject(this.box);
        const center = new THREE.Vector3();
        boxSize.getCenter(center);
        this.box.position.sub(center);
        
        const maxDim = Math.max(boxSize.max.x, boxSize.max.y, boxSize.max.z);
        const scale = 2 / maxDim;
        this.box.scale.set(scale, scale, scale);
      });
    },
    addEventListeners() {
      window.addEventListener('mousedown', this.onMouseDown);
      window.addEventListener('touchstart', this.onTouchStart);
      window.addEventListener('deviceorientation', this.onDeviceOrientation);
      window.addEventListener('resize', this.onWindowResize);
      
      // Add tap/knock detection
      let lastTapTime = 0;
      let tapCount = 0;
      
      window.addEventListener('touchstart', (e) => {
        const currentTime = new Date().getTime();
        const tapInterval = currentTime - lastTapTime;
        
        if (tapInterval < 300 && tapInterval > 0) {
          tapCount++;
          if (tapCount >= 2) {
            this.onKnockDetected();
            tapCount = 0;
          }
        } else {
          tapCount = 1;
        }
        
        lastTapTime = currentTime;
      });
    },
    
    onKnockDetected() {
      if (this.box) {
        // Add knock animation
        gsap.to(this.box.position, {
          x: this.box.position.x + (Math.random() - 0.5) * 0.2,
          y: this.box.position.y + (Math.random() - 0.5) * 0.2,
          z: this.box.position.z + (Math.random() - 0.5) * 0.2,
          duration: 0.1,
          ease: 'power2.out',
          onComplete: () => {
            gsap.to(this.box.position, {
              x: 0,
              y: 0,
              z: 0,
              duration: 0.2,
              ease: 'elastic.out(1, 0.3)'
            });
          }
        });
      }
    },
    onMouseDown(event) {
      this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      this.checkIntersection();
    },
    onTouchStart(event) {
      if (event.touches.length > 0) {
        this.mouse.x = (event.touches[0].clientX / window.innerWidth) * 2 - 1;
        this.mouse.y = -(event.touches[0].clientY / window.innerHeight) * 2 + 1;
        this.checkIntersection();
      }
    },
    onDeviceOrientation(event) {
      const currentTime = Date.now();
      const timeDiff = currentTime - this.lastTime;
      
      if (timeDiff > 100) {
        const gamma = event.gamma || 0;
        const beta = event.beta || 0;
        
        if (Math.abs(gamma) > this.shakeThreshold || 
            Math.abs(beta) > this.shakeThreshold) {
          this.shakeBox();
        }
        
        this.lastTime = currentTime;
      }
    },
    shakeBox() {
      if (this.box) {
        gsap.to(this.box.rotation, {
          x: this.box.rotation.x + (Math.random() - 0.5) * 0.5,
          y: this.box.rotation.y + (Math.random() - 0.5) * 0.5,
          duration: 0.2,
          ease: 'power2.out'
        });
      }
    },
    checkIntersection() {
      if (!this.box) return;
      
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObject(this.box, true);
      
      if (intersects.length > 0) {
        this.openBox();
      }
    },
    openBox() {
      if (this.isOpening) return;
      
      this.isOpening = true;
      
      // Open box animation
      gsap.to(this.box.rotation, {
        y: this.box.rotation.y + Math.PI * 2,
        duration: 2,
        ease: 'power2.out',
        onComplete: () => {
          this.checkForEgg();
          this.$emit('box-opened', { hasEgg: this.isEggFound });
          this.isOpening = false;
        }
      });
    },
    checkForEgg() {
      this.isEggFound = Math.random() < this.eggProbability;
      if (this.isEggFound) {
        this.$emit('egg-found');
        this.showRedPacketRain();
      }
    },
    
    showRedPacketRain() {
      const redPacketCount = 20;
      const redPackets = [];
      
      for (let i = 0; i < redPacketCount; i++) {
        const geometry = new THREE.PlaneGeometry(0.2, 0.3);
        const texture = new THREE.TextureLoader().load('/static/images/red-packet.png');
        const material = new THREE.MeshBasicMaterial({
          map: texture,
          transparent: true
        });
        const redPacket = new THREE.Mesh(geometry, material);
        
        redPacket.position.set(
          (Math.random() - 0.5) * 5,
          Math.random() * 5 + 5,
          (Math.random() - 0.5) * 5
        );
        
        redPacket.userData = {
          value: Math.floor(Math.random() * 100) + 1
        };
        
        this.scene.add(redPacket);
        redPackets.push(redPacket);
      }
      
      const animateRedPackets = () => {
        redPackets.forEach(redPacket => {
          redPacket.position.y -= 0.1;
          redPacket.rotation.z += 0.05;
          
          if (redPacket.position.y < -5) {
            this.scene.remove(redPacket);
          }
        });
        
        if (redPackets.length > 0) {
          requestAnimationFrame(animateRedPackets);
        }
      };
      
      animateRedPackets();
    },
    
    reverseDraw() {
      if (this.$store.state.userInfo.coins < 100) {
        this.$emit('not-enough-coins');
        return;
      }
      
      this.$store.dispatch('useCoins', { amount: 100 })
        .then(() => {
          this.isOpening = false;
          this.isEggFound = false;
          this.openBox();
        })
        .catch(() => {
          this.$emit('reverse-failed');
        });
    },
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      requestAnimationFrame(this.animate);
      
      if (this.box) {
        this.box.rotation.x += this.rotationSpeed;
        this.box.rotation.y += this.rotationSpeed;
      }
      
      this.controls.update();
      this.composer.render();
    }
  },
  beforeDestroy() {
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('deviceorientation', this.onDeviceOrientation);
    window.removeEventListener('resize', this.onWindowResize);
  }
};
</script>

<style scoped>
.box3d-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.box3d-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  touch-action: none;
}

.box-opening-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  font-size: 2rem;
  pointer-events: none;
}
</style>
