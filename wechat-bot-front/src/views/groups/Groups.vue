<template>
  <div class="groups-container">
    <el-card>
      <div slot="header" class="header">
        <span>群组管理</span>
        <el-button type="primary" size="small" @click="refreshList">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
      
      <el-table
        v-loading="loading"
        :data="groups"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="contactName"
          label="群组名称"
          min-width="120"
        />
        <el-table-column
          prop="gxId"
          label="群组ID"
          min-width="120"
        />
        <el-table-column
          label="聊天模式"
          min-width="150"
        >
          <template slot-scope="scope">
            <el-tag :type="getChatModelType(scope.row.chatModel)">
              {{ getChatModelName(scope.row.chatModel) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          width="260"
          align="center"
        >
          <template slot-scope="scope">
            <el-radio-group 
              v-model="scope.row.chatModel" 
              size="medium"
              @change="(value) => handleChangeModel(scope.row, value)"
            >
              <el-radio-button :label="1">关键字</el-radio-button>
              <el-radio-button :label="2">知识库</el-radio-button>
              <el-radio-button :label="3">大模型</el-radio-button>
            </el-radio-group>
          </template>
        </el-table-column>
      </el-table>
      
      <div class="pagination-container" v-if="groups.length > 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="groups.length"
          :page-size="10"
        >
        </el-pagination>
      </div>
      
      <el-empty v-if="groups.length === 0 && !loading" description="暂无群组数据"></el-empty>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Groups',
  data() {
    return {
      modelChanging: false
    }
  },
  computed: {
    ...mapGetters({
      groups: 'groups/allGroups',
      loading: 'groups/isLoading'
    })
  },
  created() {
    this.fetchGroups()
  },
  methods: {
    async fetchGroups() {
      try {
        await this.$store.dispatch('groups/fetchUserGroups')
      } catch (error) {
        this.$message.error('获取群组列表失败，请重试')
      }
    },
    
    refreshList() {
      this.fetchGroups()
    },
    
    getChatModelName(model) {
      switch (model) {
        case 1:
          return '关键字模式'
        case 2:
          return '知识库模式'
        case 3:
          return '大模型模式'
        default:
          return '未知模式'
      }
    },
    
    getChatModelType(model) {
      switch (model) {
        case 1:
          return 'info'
        case 2:
          return 'success'
        case 3:
          return 'warning'
        default:
          return 'info'
      }
    },
    
    async handleChangeModel(group, value) {
      if (this.modelChanging) return
      
      this.modelChanging = true
      try {
        await this.$store.dispatch('groups/updateChatModel', {
          gxId: group.gxId,
          chatModel: value
        })
        this.$message.success(`已将 ${group.contactName} 的聊天模式改为 ${this.getChatModelName(value)}`)
      } catch (error) {
        // 恢复原来的值
        this.$message.error('修改聊天模式失败，请重试')
        await this.fetchGroups()
      } finally {
        this.modelChanging = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.groups-container {
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .pagination-container {
    margin-top: 20px;
    text-align: center;
  }
}
</style>