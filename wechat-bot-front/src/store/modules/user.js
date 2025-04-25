import { login, logout } from '@/api/auth'

const state = {
  currentUser: null,
  token: null,
  loading: false
}

const getters = {
  isAuthenticated: state => !!state.token,
  currentUser: state => state.currentUser
}

const actions = {
  async loginWithWechat({ commit }, code) {
    try {
      commit('SET_LOADING', true)
      const response = await login(code)
      commit('SET_USER', response.data.user)
      commit('SET_TOKEN', response.data.token)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async logoutUser({ commit }) {
    try {
      commit('SET_LOADING', true)
      await logout()
      commit('CLEAR_USER')
      return Promise.resolve()
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_USER(state, user) {
    state.currentUser = user
  },
  SET_TOKEN(state, token) {
    state.token = token
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  CLEAR_USER(state) {
    state.currentUser = null
    state.token = null
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}