<template>
  <div class="open-container">
    <Box3D 
      ref="box3d"
      :modelUrl="modelUrl"
      :eggProbability="eggProbability"
      @box-opened="onBoxOpened"
      @egg-found="onEggFound"
    />
    
    <!-- Red packet rain animation -->
    <div v-if="isRedPacketRain" class="red-packet-rain">
      <div 
        v-for="(packet, index) in redPackets" 
        :key="index"
        class="red-packet"
        :style="packet.style"
        @click="collectRedPacket(index)"
      >
        <img src="@/static/material/material-1.png" alt="紅包">
      </div>
    </div>
  </div>
</template>

<script>
import Box3D from '@/components/blindbox/Box3D.vue';

export default {
  components: {
    Box3D
  },
  data() {
    return {
      modelUrl: '/static/material/egg.png', // 暫時使用現有的彩蛋圖片作為佔位
      eggProbability: 0.1,
      isRedPacketRain: false,
      redPackets: [],
      collectedPackets: []
    };
  },
  methods: {
    onBoxOpened(result) {
      if (result.hasEgg) {
        this.startRedPacketRain();
      }
    },
    onEggFound() {
      this.$notify({
        title: '恭喜！',
        message: '你發現了隱藏彩蛋！',
        type: 'success'
      });
    },
    startRedPacketRain() {
      this.isRedPacketRain = true;
      this.createRedPackets();
      this.animateRedPackets();
    },
    createRedPackets() {
      const packetCount = 50;
      this.redPackets = Array.from({ length: packetCount }, (_, i) => ({
        id: i,
        x: Math.random() * window.innerWidth,
        y: -100,
        speed: Math.random() * 3 + 2,
        rotation: Math.random() * 360,
        style: {}
      }));
    },
    animateRedPackets() {
      const animate = () => {
        if (!this.isRedPacketRain) return;
        
        this.redPackets.forEach(packet => {
          packet.y += packet.speed;
          packet.rotation += 2;
          
          if (packet.y > window.innerHeight) {
            packet.y = -100;
            packet.x = Math.random() * window.innerWidth;
          }
          
          packet.style = {
            transform: `translate(${packet.x}px, ${packet.y}px) rotate(${packet.rotation}deg)`
          };
        });
        
        requestAnimationFrame(animate);
      };
      animate();
    },
    collectRedPacket(index) {
      if (this.collectedPackets.includes(index)) return;
      
      this.collectedPackets.push(index);
      this.$notify({
        title: '獲得獎勵',
        message: `獲得 ${Math.floor(Math.random() * 100)} 遊戲幣`,
        type: 'success'
      });
      
      // Remove collected packet
      this.redPackets.splice(index, 1);
      
      if (this.redPackets.length === 0) {
        this.isRedPacketRain = false;
      }
    }
  },
  beforeDestroy() {
    this.isRedPacketRain = false;
  }
};
</script>

<style scoped>
.open-container {
  position: relative;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.red-packet-rain {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.red-packet {
  position: absolute;
  width: 50px;
  height: 70px;
  pointer-events: auto;
  cursor: pointer;
  transition: transform 0.1s ease-out;
}

.red-packet img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
