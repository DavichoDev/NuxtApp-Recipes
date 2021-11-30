export const strict = false

export const state = () => ({
    favorites: null
})

export const getters = {
    favorites(state){
        return state.favorites
    },
    favoritesGQL(state){
        let favorites = []
        if (Array.isArray(state.favorites)) {
            favorites = state.favorites.map(fav => fav.id)
        }
        return favorites
    }
}


export const mutations = {
    setFavorites(state, payload){
        state.favorites = payload
    },
    addRecipe(state, payload){
        state.favorites.push(payload)
    },
    removeRecipe(state, id){
        const myRecipe = state.favorites.find(fav => fav.id === id)
        const index = state.favorites.indexOf(myRecipe)
        state.favorites.splice(index, 1)
    },
    resetFav(state){
        state.favorites = null
    }
}

export const actions = {
    async getFavorites({commit}){
        let client = this.app.apolloProvider.defaultClient
        let id = this.$auth.user.id
        const query = {
            context:{
                headers:{
                    authorization: this.$auth.strategy.token.get()
                }
            },
            fetchPolicy:'no-cache',
            query: require('../graphql/userFavorites.gql'),
            variables:{id}
        }
        await client.query(query)
            .then(({data}) => {
                commit('setFavorites', data.user.favorites)
            })
            .catch((error) => {
                console.error('Vuex -> User.js error: ', error)
            })
    }
}
