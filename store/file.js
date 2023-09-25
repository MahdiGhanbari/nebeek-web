import db from '~/plugins/db';

class File {
    constructor(id, name, size = 0, progress = 0, isCompleted = false, errorMessage = '') {
      this.id = id;
      this.name = name;
      this.size = size;
      this.progress = progress;
      this.isCompleted = isCompleted;
      this.errorMessage = errorMessage;
    }
}

export const state =  () => ({
  files: []
})

export const mutations = {
  ADD_FILE(state, file) {
    state.files.push(file);
  },
  REMOVE_FILE(state, file) {
    let idx = state.files.indexOf(file);
    if (idx != -1) {
      state.files.splice(idx, 1);
    }
  }
}

export const actions = {
  async upload ({ commit }, { id, path, file, token }) {
    let trackedFile = new File(id, file.name, file.size);
    let data = new FormData();
    data.append('file', file);
    let config = {
        headers: {
          Authorization: token
        },
        onUploadProgress(progressEvent) {
            var percentCompleted = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
            trackedFile.progress = percentCompleted;
        }
    };
    commit('ADD_FILE', trackedFile);
    try {
      // TODO: how do we pass in the config??
      await db.save(path, data, config);
      trackedFile.isCompleted = true;
    } catch(err) {
      trackedFile.isCompleted = true;
      trackedFile.errorMessage = err.message;
    }
  },
  remove({commit}, file) {
    commit('REMOVE_FILE', file);
  }
}
