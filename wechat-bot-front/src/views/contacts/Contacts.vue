<template>
  <div class="contacts-container">
    <el-card>
      <div slot="header" class="header">
        <span>联系人管理</span>
        <el-button type="primary" size="small" @click="refreshList">
          <i class="el-icon-refresh"></i> 刷新
        </el-button>
      </div>
      
      <el-table
        v-loading="loading"
        :data="contacts"
        style="width: 100%"
        border
      >
        <el-table-column
          prop="contactName"
          label="联系人名称"
          min-width="120"
        />
        <el-table-column
          prop="cxId"
          label="微信ID"
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
      
      <div class="pagination-container" v-if="contacts.length > 0">
        <el-pagination
          background
          layout="prev, pager, next"
          :total="contacts.length"
          :page-size="10"
        >
        </el-pagination>
      </div>
      
      <el-empty v-if="contacts.length === 0 && !loading" description="暂无联系人数据"></el-empty>
    </el-card>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'Contacts',
  data() {
    return {
      modelChanging: false
    }
  },
  computed: {
    ...mapGetters({
      contacts: 'contacts/allContacts',
      loading: 'contacts/isLoading'
    })
  },
  created() {
    this.fetchContacts()
  },
  methods: {
    async fetchContacts() {
      try {
        await this.$store.dispatch('contacts/fetchUserContacts')
      } catch (error) {
        this.$message.error('获取联系人列表失败，请重试')
      }
    },
    
    refreshList() {
      this.fetchContacts()
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
    
    async handleChangeModel(contact, value) {
      if (this.modelChanging) return
      
      this.modelChanging = true
      try {
        await this.$store.dispatch('contacts/updateChatModel', {
          cxId: contact.cxId,
          chatModel: value
        })
        this.$message.success(`已将 ${contact.contactName} 的聊天模式改为 ${this.getChatModelName(value)}`)
      } catch (error) {
        // 恢复原来的值
        this.$message.error('修改聊天模式失败，请重试')
        await this.fetchContacts()
      } finally {
        this.modelChanging = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.contacts-container {
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