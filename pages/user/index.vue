<template>
    <v-container>
        <h2>Bienvenido {{$auth.user.username}}</h2>
        <v-divider class="my-5"></v-divider>
        <h3>Recipes list</h3>
        <v-btn color="primary" class="my-3" small to="user/newRecipe">Add recipe</v-btn>
        <div v-if="recipes">
            <app-ui-list-recipes :recipes="recipes"></app-ui-list-recipes>
        </div>
        <div v-else>Cargando...</div>
    </v-container>
</template>

<script>
export default {
    middleware: 'auth',
    async asyncData({app}) {
        let client = app.apolloProvider.defaultClient
        let id = app.$auth.user.id
        let query = {
            query: require('../../graphql/userRecipes.gql'),
            variables: {id},
            fetchPolicy:'no-cache'
        }
        let recipes = null
        await client.query(query)
            .then(({data}) => {
                recipes = data.recipes
            })
            .catch((error) => {
                console.error('Error Front => ', error)
            })
        return {recipes}
    },
}
</script>