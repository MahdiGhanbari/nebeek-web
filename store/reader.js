import db from '~/plugins/db';

export const state =  () => ({
    visibleFrom: 0,
    pages: [],
    cumulativeHeights: [],
    scale: 1,
    searchResult: [],
    query: '',
    id: 0,
    filePath: '',
    highlight: false,
    startIndex: {page: -1, index: -1},
    endIndex: {page: -1, index: -1},
    currentPage: null,
    tableOfContent: [],
    title : '',
    selectionStarted: false,
    selections: [],
    selectedComment: {ref: null,index: -1}
})
export const getters = {
  isDirectionSelectTop(state) {
    return state.endIndex.page < state.startIndex.page;
  },
  getSelectedText(state) {
    if(state.startIndex.page == -1 || state.endIndex.page == -1)
      return "";
    let fromPage = state.startIndex.page;
    let toPage = state.endIndex.page;
    let min = Math.min(fromPage, toPage);
    let max = Math.max(fromPage, toPage);
    
    let selected = [];
    if(max == min) {
        let minIndex = Math.min(state.startIndex.index, state.endIndex.index)
        let maxIndex = Math.max(state.startIndex.index, state.endIndex.index)
        selected = state.pages[state.startIndex.page].chars.slice(minIndex, maxIndex + 1);
    }else {
        let from = (min == fromPage) ? state.startIndex : state.endIndex;
        let to = (max == toPage) ? state.endIndex : state.startIndex;
        selected = state.pages[from.page].chars.slice(from.index);
        for(let i = min + 1; i < max; i++) 
            Array.prototype.push.apply(selected, state.pages[i].chars);
        Array.prototype.push.apply(selected, state.pages[to.page].chars.slice(0, to.index + 1)); 
    }  
    // temporary
    let result = '';
    for(let ch of selected) {
        if(result.length % 50 == 0)
            result += '\n';
        result += '#';
    }
    //
    return result;
  }
}
export const mutations = {
    SET_ID(state, id) {
      state.id = id;
    },
    SET_VISIBLE_FROM(state, from) {
      state.visibleFrom = from;
    },
    SET_PAGES(state, pages) {
      if(pages)
        state.pages = pages;
      const cumulativeHeights = [0];
      for (const page of pages) {
        const lastHeight = cumulativeHeights[cumulativeHeights.length - 1];
        cumulativeHeights.push(lastHeight + (page.height ? page.height * state.scale : 0) + 60);
      }
      state.cumulativeHeights = cumulativeHeights;
    },
    ZOOM_IN(state) {
      if (state.scale >= 2) return;
      if (state.scale < 1) {
        state.scale += 0.1;
      } else {
        state.scale += 0.25;
      }
    },
    ZOOM_OUT(state) {
      if (state.scale <= 0.5) return;
      if (state.scale <= 1) {
        state.scale -= 0.1;
      } else {
        state.scale -= 0.25;
      }
    },
    SET_SEARCH_RESULT(state, results) {
      state.searchResult = results;
    },
    SET_QUERY(state, newValue) {
      state.query = newValue;
    },
    SET_HIGHLIGHT(state) {
      state.highlight = !state.highlight;
    },
    SET_START_INDEX(state, start) {
      state.startIndex.page = start ? start.page : -1;
      state.startIndex.index = start ? start.index : -1;
    },
    SET_END_INDEX(state, end) {
      state.endIndex.page = end ? end.page : -1;
      state.endIndex.index = end ? end.index : -1;
    },
    SET_CURRENT_PAGE(state, page) {
      state.currentPage = page;
    },
    SET_TABLE_OF_CONTENT(state, items) {
      state.tableOfContent = items;
    },
    SET_TITLE(state, title) {
      state.title = title;
    },
    SET_SELECTION_STARTED(state, value) {
      state.selectionStarted = value;
    },
    SET_SELECTIONS(state, selections) {
      selections.sort((s1, s2)=> {
        let diff = s1.startPage - s2.startPage;
        if(diff < 0)
          return -1;
        else if (diff == 0) 
          return s1.startIndex - s2.startIndex;
        return 1;
      })
      state.selections = selections;
    },
    SET_SELECTED_COMMENT(state, {ref, index}) {
      state.selectedComment.ref = ref;
      state.selectedComment.index = index;
    }
};

export const actions = {
    navigateTo({ commit }, page) {
      commit('SET_VISIBLE_FROM', page);
    },
    async loadDocument({ commit }, id) {
        try {
          commit('SET_ID', id); 
          let doc = await db.find(id);
          if (doc.pdf) {
            commit('SET_TITLE', doc.names);
            let pages = await db.find(id + '/pdf/pages');
            if (pages) {
              commit('SET_PAGES', pages);
            }
            // TODO: fix selections
            commit('SET_SELECTIONS', []);
          }
        } catch(err) {
        }
    },
    zoom({ commit }, zoomIn = true) {
      commit(zoomIn ? 'ZOOM_IN' : 'ZOOM_OUT');
    },
    setVisibleFrom({ commit }, from) {
      commit('SET_VISIBLE_FROM', from);
    },
    searchInDocument({ state, commit }, query) {
      commit('SET_SEARCH_RESULT',
        [
        ]
      );

      commit('SET_QUERY', query);
    },
    async toggleHighlight({commit}) {
      commit('SET_HIGHLIGHT');
      commit('SET_START_INDEX', null);
      commit('SET_END_INDEX', null);
    },
    setStartIndex({commit}, start) {
      commit('SET_START_INDEX', start);
    },
    setEndIndex({commit}, end) {
      commit('SET_END_INDEX', end);
    },
    setCurrentPage({commit}, page) {
      commit('SET_CURRENT_PAGE', page);
    },
    setSelectionStarted({commit}, value) {
      commit('SET_SELECTION_STARTED', value)
    },
    setSelectedComment({commit}, {ref, index}) {
      commit('SET_SELECTED_COMMENT',{ ref, index})
    }
  }