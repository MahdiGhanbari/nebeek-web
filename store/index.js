import db from '~/plugins/db';
import { unsetToken, setToken, getUserFromCookie } from '~/utils/auth'

export const state = () => ({
  user: null,
  isLoggedIn: false,
  lingual: 'fa',
  altLingual: 'en',
  dialog: null
})

export const mutations = {
  SET_USER: function (state, user) {
    state.user = user;
    state.isLoggedIn = user != null;
    if (user) {
      user.id = user.sub;
    }
  },
  SET_LINGUAL(state, lingual) { 
    state.lingual = lingual;
    state.altLingual = lingual == 'fa' ? 'en' : 'fa';
  },
  OPEN_DIALOG(state, dialog) {
    state.dialog = dialog;
  },
  CLOSE_DIALOG(state) {
    state.dialog = null;
  }
}

export const getters = {
  currentDialog(state) {
    if(!state.dialog) {
      return {
        name: null,
        data: null,
        dimensions: {
          height: null,
          width: null
        }
      }
    }
    return state.dialog;
  }
}

export const actions = {
  nuxtServerInit ({ commit }, { req }) {
    const loggedUser = getUserFromCookie(req)
    commit('SET_USER', loggedUser)
    //if (req.session && req.session.authUser) {
    //  commit('SET_USER', req.session.authUser)
    //}
  },
  async login ({ commit }, { username, password }) {
    try {
      let token = await db.login(username, password);
      commit('SET_USER', setToken(token));
      return true;
    } catch(error) {
      //if (error.response.status === 401) {
      //  throw new Error('Bad credentials')
      //}
      return false;
    }
  },
  logout ({ commit }) {
    //return db.post('/site/logout')
    //.then(() => {
      unsetToken();
      commit('SET_USER', null)
    //})
  },
  changeLingual({commit}, lingual) {
    commit('SET_LINGUAL', lingual);
  },
  openDialog({commit}, { name, dimensions, data }) {
    let dialog = {
      name: name,
      dimensions : dimensions,
      data: data
    }
    commit('OPEN_DIALOG', dialog);
  },
  closeDialog({commit}) {
    commit('CLOSE_DIALOG');
  }
}