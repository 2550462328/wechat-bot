import { fetchContacts, updateContactChatModel } from '@/api/contacts'

const state = {
  contacts: [],
  loading: false
}

const getters = {
  allContacts: state => state.contacts,
  isLoading: state => state.loading
}

const actions = {
  async fetchUserContacts({ commit, rootState }) {
    try {
      commit('SET_LOADING', true)
      const wxId = rootState.user.currentUser?.wxId
      const response = await fetchContacts(wxId)
      commit('SET_CONTACTS', response.data)
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async updateChatModel({ commit }, { cxId, chatModel }) {
    try {
      commit('SET_LOADING', true)
      const response = await updateContactChatModel(cxId, chatModel)
      commit('UPDATE_CONTACT_CHAT_MODEL', { cxId, chatModel })
      return Promise.resolve(response)
    } catch (error) {
      return Promise.reject(error)
    } finally {
      commit('SET_LOADING', false)
    }
  }
}

const mutations = {
  SET_CONTACTS(state, contacts) {
    state.contacts = contacts
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  UPDATE_CONTACT_CHAT_MODEL(state, { cxId, chatModel }) {
    const contactIndex = state.contacts.findIndex(contact => contact.cxId === cxId)
    if (contactIndex !== -1) {
      state.contacts[contactIndex].chatModel = chatModel
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