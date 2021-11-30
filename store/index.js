export const strict = false

export const state = () => ({
  counter: 0,
  categories: [],
  loadedRecipes: []
});

export const getters = {
  readCounter(state) {
    return state.counter;
  },
  readCategories(state){
    return state.categories
  },
  readLoadedRecipes(state){
    return state.loadedRecipes
  }
};

export const mutations = {
  addCategories(state, payload) {
    state.categories = payload;
  },
  increment(state) {
    state.counter++;
  },
  addLoadedRecipes(state, payload){
    state.loadedRecipes = payload
  }
};

export const actions = {
  async nuxtServerInit({ commit }) {
    // return new Promise((resolve, reject) => {
      const client = this.app.apolloProvider.defaultClient
      const query = {
        query: require("../graphql/categories.gql"),
      };

      await client
        .query(query)
        .then(({data}) => {
          commit('addCategories', data.categories)
          // commit('addLoadedRecipes', data.recipes)
          // resolve()
        })
        .catch((error) => {
          console.error(error)
          // reject()
        });
    // });
  },
  increment({ commit }) {
    setTimeout(() => {
      commit("increment");
    }, 1000);
  },
  searchRecipe({commit}, payload){
    let client = this.app.apolloProvider.defaultClient
    const query = {
      query: require('@/graphql/searchRecipe'),
      variables:{term: payload}
    }

    client.query(query)
    .then(({data}) => {
      commit('addLoadedRecipes', data.recipes)
    }).catch(error => {
      console.error(error);
    })
  }
};
