<template>
    <v-container>
        <div v-if="recipes.length != 0">
            <v-list>
                <v-list-item-group>
                    <template v-for="recipe in recipes">
                        <v-list-item two-line :key="recipe.id">
                            <v-list-item-content>
                                <v-list-item-title>{{recipe.name}}</v-list-item-title>
                                <v-list-item-subtitle>{{recipe.category.name}}</v-list-item-subtitle>
                            </v-list-item-content>
                            <v-list-item-action >
                                <v-row align="center" justify="center">
                                    <v-btn icon :to="{name: 'user-edit-id', params:{id: recipe.id}}"><v-icon>mdi-pencil</v-icon></v-btn>
                                    <app-ui-delete-item @choice="deleteRecipe($event, recipe.id)"></app-ui-delete-item>
                                </v-row>
                            </v-list-item-action>
                        </v-list-item>
                    </template>
                </v-list-item-group>
            </v-list>
        </div>
        <div v-else>
            There are no recipes
        </div>
    </v-container>
</template>

<script>
export default {
    props: {
        recipes: {
            type: Array,
            default: () => ([])
        }
    },
    methods:{
        deleteRecipe( choice, id ){
            if (choice) {
                this.$apollo.mutate({
                    context:{
                        headers:{
                            authorization: this.$auth.strategy.token.get()
                        }
                    },
                    mutation: require('../../graphql/deleteRecipe.gql'),
                    variables:{id}
                })
                .then(() => {
                    const recipe = this.recipes.find(recipe => recipe.id === id)
                    const index = this.recipes.indexOf(recipe)
                    this.recipes.splice(index, 1)
                })
                .catch((error) => {
                    console.log('Front Error => deleteRecipe: ', error)
                })
            }
        }
    }
}
</script>