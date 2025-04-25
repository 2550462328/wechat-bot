import Vue from 'vue'
import Vuex from 'vuex'
import createPersistedState from 'vuex-persistedstate'
import user from './modules/user'
import contacts from './modules/contacts'
import groups from './modules/groups'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    user,
    contacts,
    groups
  },
  plugins: [
    createPersistedState({
      key: 'wechat-admin',
      paths: ['user.currentUser', 'user.token']
    })
  ]
})