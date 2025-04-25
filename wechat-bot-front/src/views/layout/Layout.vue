<template>
  <el-container class="layout-container">
    <el-aside :width="isCollapse ? '64px' : '200px'" class="sidebar-container">
      <div class="logo-container">
        <img src="https://via.placeholder.com/40" alt="Logo" class="logo" />
        <span v-show="!isCollapse" class="title">微信管理系统</span>
      </div>
      <el-menu
        :default-active="activeMenu"
        :collapse="isCollapse"
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409EFF"
        router
      >
        <el-menu-item index="/dashboard/contacts">
          <i class="el-icon-user"></i>
          <span slot="title">联系人管理</span>
        </el-menu-item>
        <el-menu-item index="/dashboard/groups">
          <i class="el-icon-s-grid"></i>
          <span slot="title">群组管理</span>
        </el-menu-item>
      </el-menu>
    </el-aside>
    
    <el-container class="main-container">
      <el-header class="header">
        <div class="header-left">
          <i 
            :class="isCollapse ? 'el-icon-s-unfold' : 'el-icon-s-fold'" 
            class="toggle-button"
            @click="toggleSidebar">
          </i>
          <breadcrumb />
        </div>
        <div class="header-right">
          <el-dropdown trigger="click" @command="handleCommand">
            <span class="user-info">
              <img src="https://via.placeholder.com/30" alt="头像" class="avatar" />
              <span class="username">{{ currentUser ? currentUser.userName : '用户' }}</span>
              <i class="el-icon-caret-bottom"></i>
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="logout">
                <i class="el-icon-switch-button"></i> 登出
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </el-header>
      
      <el-main class="content-container">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from './components/Breadcrumb'

export default {
  name: 'Layout',
  components: {
    Breadcrumb
  },
  data() {
    return {
      isCollapse: false
    }
  },
  computed: {
    ...mapGetters({
      currentUser: 'user/currentUser'
    }),
    activeMenu() {
      return this.$route.path
    }
  },
  methods: {
    toggleSidebar() {
      this.isCollapse = !this.isCollapse
    },
    async handleCommand(command) {
      if (command === 'logout') {
        try {
          await this.$store.dispatch('user/logoutUser')
          this.$message.success('登出成功')
          this.$router.push('/login')
        } catch (error) {
          this.$message.error('登出失败，请重试')
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.layout-container {
  height: 100vh;
  
  .sidebar-container {
    transition: width 0.3s;
    background-color: #304156;
    overflow: hidden;
    
    .logo-container {
      height: 60px;
      display: flex;
      align-items: center;
      padding: 0 10px;
      background-color: #263445;
      
      .logo {
        width: 40px;
        height: 40px;
        margin-right: 10px;
      }
      
      .title {
        color: #fff;
        font-size: 16px;
        font-weight: bold;
        white-space: nowrap;
        overflow: hidden;
      }
    }
  }
  
  .main-container {
    background-color: #f0f2f5;
    
    .header {
      background-color: #fff;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 20px;
      box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      
      .header-left {
        display: flex;
        align-items: center;
        
        .toggle-button {
          font-size: 20px;
          cursor: pointer;
          margin-right: 20px;
          color: #606266;
        }
      }
      
      .header-right {
        .user-info {
          display: flex;
          align-items: center;
          cursor: pointer;
          
          .avatar {
            width: 30px;
            height: 30px;
            border-radius: 50%;
            margin-right: 8px;
          }
          
          .username {
            margin-right: 8px;
            color: #606266;
          }
        }
      }
    }
    
    .content-container {
      padding: 20px;
      overflow-y: auto;
    }
  }
}

@media screen and (max-width: 768px) {
  .sidebar-container {
    position: fixed;
    z-index: 1001;
    height: 100%;
  }
  
  .main-container {
    margin-left: 64px;
  }
}
</style>