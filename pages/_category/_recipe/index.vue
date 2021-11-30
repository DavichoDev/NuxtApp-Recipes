<template>
    <v-container>
        <h1 class="secondary--text">{{recipe.name}}</h1>
        <h5 class="secondary--text">{{recipe.category.name}}</h5>
        <v-card class="mt-3">
            <v-card-title>
                <v-icon>mdi-information</v-icon>
                Información
            </v-card-title>
            <v-card-text class="black--text">
                <v-row>
                    <v-col cols="6">
                        <v-chip color="primary" outlined>
                            <v-icon left>mdi-account-group</v-icon>
                            Servings: {{recipe.servings}}
                        </v-chip>
                        <v-chip color="primary" outlined>
                            <v-icon left>mdi-clock</v-icon>
                            Duration: {{recipe.duration}}
                        </v-chip> 
                        <v-chip color="primary" outlined>
                            <v-icon left>mdi-account-edit</v-icon>
                            Author: {{recipe.author.username}}
                        </v-chip>
                    <v-divider class="my-3" />
                    <h4 class="body-1">Description</h4>
                    <div v-html="recipe.description"></div>
                    </v-col>
                    <v-col cols="6">
                        <v-img :src="recipe.img" max-height="500"></v-img>
                    </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
                <v-btn @click="toggleLiked" v-if="$auth.loggedIn" icon large>
                    <v-icon large :color="recipeIsLiked ? 'error':'grey'">mdi-heart</v-icon>
                </v-btn>
                <v-icon v-else>mdi-heart</v-icon><span class="overline">Likes {{recipe.likes}}</span>
            </v-card-actions>
        </v-card>

        <div class="mt-3">
            <v-row>
                <v-col cols="5">
                    <v-card>
                        <v-card-title>
                            <v-icon class="mr-3">mdi-fridge</v-icon>
                            Ingredients
                        </v-card-title>
                        <v-list>
                            <v-list-item v-for="(ingredient, i) in recipe.ingredients" :key="i">
                                {{ingredient}}
                            </v-list-item>
                        </v-list>
                    </v-card>
                </v-col>
                <v-col cols="7">
                    <v-card>
                        <v-card-title>
                            <v-icon class="mr-3">mdi-stove</v-icon>
                            Steps
                        </v-card-title>
                        <v-timeline dense>
                            <v-timeline-item color="secondary" v-for="(step, i) in recipe.steps" :key="i" small>
                                {{step}}
                            </v-timeline-item>
                        </v-timeline>
                    </v-card>
                </v-col>
            </v-row>
        </div>

        <div class="mt-3">
        <app-ui-back-btn label="Volver a receta"></app-ui-back-btn>
        </div>
    </v-container>
</template>

<script>
export default {
    data(){
        return {
            likedRecipe: false
        }
    },
    async asyncData({app, route}) {
        const client = app.apolloProvider.defaultClient
        const id = route.params.recipe
        const query = {
            query: require('@/graphql/recipe.gql'),
            variables: {id}
        }
        
        let recipe = {}
        await client.query(query)
            .then(({data}) => {
                recipe = data.recipe
            })
        return {recipe}
    },
    methods:{
        toggleLiked(){
            this.likedRecipe = !this.likedRecipe
            if (this.likedRecipe) {
                this.likeRecipe()
            } else {
                this.unlikeRecipe()
            }
        },
        likeRecipe(){
            this.$store.commit('user/addRecipe', this.recipe)
            let userFav = this.$store.getters['user/favoritesGQL']
            
            const variables = {
                id: this.recipe.id,
                idUser: this.$auth.user.id,
                favorites: userFav
            }

            this.$apollo.query({
                query: require('../../../graphql/getLikes.gql'),
                variables:{id: this.recipe.id}
            }).then(({data}) => {
                let likes = data.recipe.likes + 1
                this.recipe.likes = likes
                variables.likes = likes
                this.$apollo.mutate({
                    context:{
                        headers:{
                            authorization: this.$auth.strategy.token.get()
                        }
                    },
                    mutation: require('../../../graphql/updateLikes.gql'),
                    variables: variables
                })
            })
        },
        unlikeRecipe(){
            this.$store.commit('user/removeRecipe', this.recipe.id)

            let userFav = this.$store.getters['user/favoritesGQL']
            const variables = {
                id: this.recipe.id,
                idUser: this.$auth.user.id,
                favorites: userFav
            }

            this.$apollo.query({
                query: require('../../../graphql/getLikes.gql'),
                variables:{id: this.recipe.id}
            }).then(({data}) => {
                let likes = data.recipe.likes - 1
                this.recipe.likes = likes
                variables.likes = likes
                this.$apollo.mutate({
                    context:{
                        headers:{
                            authorization: this.$auth.strategy.token.get()
                        }
                    },
                    mutation: require('../../../graphql/updateLikes.gql'),
                    variables: variables
                })
            })

        }
    },
    async mounted() {
        if(this.$auth.loggedIn && this.$store.getters['user/favorites'] == null){
            console.log('Call favorites')
            await this.$store.dispatch('user/getFavorites')
        }
    },
    computed:{
        userFavorites(){
            return this.$store.getters['user/favorites']
        },
        recipeIsLiked(){
            let liked = false
            if( this.userFavorites ){
                const id = this.recipe.id
                liked = this.userFavorites.some(fav => fav.id === id)
            }
            this.likedRecipe = liked
            return liked
        }
    }
}
</script>