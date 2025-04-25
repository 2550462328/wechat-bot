import { fetchGroups, updateGroupChatModel } from '@/api/groups'

const state = {
  groups: [],
  loading: false
}

const getters = {
  allGroups: state => state.groups,
  isLoading: state => state.loading
}

const actions = {
  async fetchUserGroups({ commit, rootState }) {
    try {
      commit('SET_LOADING', true)
      const wxId = rootState.user.currentUser?.wxId
      const response = await fetchGroups(wxId)
      commit('SET_GROUPS', response.data)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateChatModel({ commit }, { gxId, chatModel }) {
    try {
      commit('SET_LOADING', true)
      const response = await updateGroupChatModel(gxId, chatModel)
      commit('UPDATE_GROUP_CHAT_MODEL', { gxId, chatModel })
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_GROUPS(state, groups) {
    state.groups = groups
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  UPDATE_GROUP_CHAT_MODEL(state, { gxId, chatModel }) {
    const groupIndex = state.groups.findIndex(group => group.gxId === gxId)
    if (groupIndex !== -1) {
      state.groups[groupIndex].chatModel = chatModel
    }
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}