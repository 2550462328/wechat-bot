<template>
  <div class="login-container">
    <div class="login-box">
      <h1 class="title">微信后台管理系统</h1>
      <div class="qrcode-container">
        <div v-if="qrCode" class="qrcode">
          <img :src="qrCode" alt="微信扫码登录" />
        </div>
        <div v-else class="qrcode-loading">
          <el-skeleton :rows="5" animated />
        </div>
      </div>
      <div class="scan-tips">
        <p>使用微信扫一扫，登录后台管理系统</p>
        <el-button 
          v-if="qrCodeExpired" 
          type="primary" 
          @click="refreshQrCode">
          刷新二维码
        </el-button>
      </div>
    </div>
  </div>
</template>

<script>
import { getWxQrCode } from '@/api/auth'

export default {
  name: 'Login',
  data() {
    return {
      qrCode: '',
      qrCodeExpired: false,
      pollTimer: null,
      expiryTimer: null
    }
  },
  created() {
    this.getQrCode()
  },
  beforeDestroy() {
    this.clearTimers()
  },
  methods: {
    async getQrCode() {
      try {
        this.qrCodeExpired = false
        const res = await getWxQrCode()
        this.qrCode = res.data.qrCodeUrl
        
        // 设置二维码过期时间 (2分钟)
        this.setExpiryTimer()
        
        // 开始轮询检查是否扫码成功
        this.startPolling(res.data.sceneId)
      } catch (error) {
        this.$message.error('获取二维码失败，请刷新重试')
      }
    },
    
    setExpiryTimer() {
      // 清除旧的定时器
      if (this.expiryTimer) {
        clearTimeout(this.expiryTimer)
      }
      
      // 设置2分钟后过期
      this.expiryTimer = setTimeout(() => {
        this.qrCodeExpired = true
        this.clearTimers()
      }, 2 * 60 * 1000)
    },
    
    startPolling(sceneId) {
      // 清除旧的定时器
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
      }
      
      // 每3秒检查一次登录状态
      this.pollTimer = setInterval(async () => {
        try {
          const response = await this.$store.dispatch('user/loginWithWechat', sceneId)
          
          if (response && response.code === 0) {
            this.$message.success('登录成功')
            this.clearTimers()
            this.$router.push('/dashboard')
          }
        } catch (error) {
          console.log('等待扫码...')
        }
      }, 3000)
    },
    
    clearTimers() {
      if (this.pollTimer) {
        clearInterval(this.pollTimer)
        this.pollTimer = null
      }
      
      if (this.expiryTimer) {
        clearTimeout(this.expiryTimer)
        this.expiryTimer = null
      }
    },
    
    refreshQrCode() {
      this.getQrCode()
    }
  }
}
</script>

<style lang="scss" scoped>
.login-container {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
  
  .login-box {
    width: 400px;
    padding: 40px;
    background-color: #fff;
    border-radius: 8px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
    text-align: center;
    
    .title {
      margin-bottom: 40px;
      font-size: 24px;
      color: #303133;
    }
    
    .qrcode-container {
      margin: 0 auto 20px;
      width: 200px;
      height: 200px;
      
      .qrcode {
        width: 100%;
        height: 100%;
        
        img {
          width: 100%;
          height: 100%;
        }
      }
      
      .qrcode-loading {
        padding: 20px;
      }
    }
    
    .scan-tips {
      color: #606266;
      margin-top: 20px;
      
      p {
        margin-bottom: 20px;
      }
    }
  }
}

@media screen and (max-width: 768px) {
  .login-box {
    width: 90% !important;
    padding: 20px !important;
  }
}
</style>