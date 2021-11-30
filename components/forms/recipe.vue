<template>
  <div>
    <v-card max-width="800" class="mx-auto">
      <v-card-title class="heading">My recipe</v-card-title>
      <v-card-text>
        <v-form @submit.prevent="onSubmit">
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="recipe.name"
                  dense
                  outlined
                  label="Recipe's name"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="recipe.duration"
                  dense
                  outlined
                  label="Recipe's duration"
                />
              </v-col>

              <v-col cols="4">
                <v-text-field
                  v-model="recipe.servings"
                  dense
                  outlined
                  label="Recipe's servings"
                />
              </v-col>

              <v-col cols="4">
                <v-select
                    v-model="recipe.category"
                    :items="categories"
                    item-text="name"
                    item-value="id"
                    label="Category"
                    dense
                    outlined></v-select>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="recipe.img"
                  dense
                  outlined
                  label="Recipe's image"
                />
              </v-col>

              <v-col cols="12">
                <v-textarea
                  v-model="recipe.description"
                  dense
                  outlined
                  label="Recipe's description"
                />
              </v-col>

              <v-col cols="12">
                <h3 class="mb-5">Ingredients</h3>
                <div
                  v-for="(ingredient, i) in recipe.ingredients"
                  :key="i + 'ingredients'"
                >
                  <v-text-field
                    dense
                    outlined
                    :label="`Ingredient ${i + 1}`"
                    v-model="recipe.ingredients[i]"
                  />
                </div>
                <v-btn class="primary" small @click="addItem('ingredients')"
                  >Add Ingredient</v-btn
                >
                <v-divider class="my-5"></v-divider>
              </v-col>

              <v-col cols="12">
                <h3 class="mb-5">Steps</h3>
                <div v-for="(step, i) in recipe.steps" :key="i + 'steps'">
                  <v-text-field
                    dense
                    outlined
                    :label="`Step ${i + 1}`"
                    v-model="recipe.steps[i]"
                  />
                </div>
                <v-btn class="primary" small @click="addItem('steps')"
                  >Add step</v-btn
                >
              </v-col>
            </v-row>

            <v-btn type="submit" class="secondary my-5" small>
              {{ hasId ? 'Save Recipe' : 'Add Recipe' }}
            </v-btn>
          </v-container>
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>

<script>
export default {
  props: {
    recipe: {
      type: Object,
      default: () => ({
        name: "",
        duration: 0,
        servings: 0,
        img: "",
        description: "",
        ingredients: [""],
        steps: [""],
        category: 1,
      }),
    },
  },
  methods: {
    addItem(item) {
      if (this.recipe[item] === null) {
        this.recipe[item] = [];
      }
      this.recipe[item].push("");
    },
    async onSubmit(){
        // Getting author => ID , token
        const id = this.$auth.user.id
        const token = this.$auth.strategy.token.get()
        this.recipe.author = id
        // ToNumber
        this.recipe.duration = Number(this.recipe.duration)
        this.recipe.servings = Number(this.recipe.servings)
        const mutation = this.hasId ? "updateRecipe" : "createRecipe"
        if(typeof this.recipe.category === 'object'){
          this.recipe.category = this.recipe.category.id
        }
        await this.$apollo.mutate({
            context: {
                headers:{
                    authorization: token
                }
            },
            mutation: require(`../../graphql/${mutation}.gql`),
            variables: this.recipe,
            // UpdateCache
            update: (cache, myRecipe) => {
              if(mutation === 'createRecipe'){
                const data = cache.readQuery({ query: require('../../graphql/userRecipes.gql'), variables: {id} })
                  data.recipes.push(myRecipe.data[mutation].recipe)
                  cache.writeQuery({ 
                      query: require('../../graphql/userRecipes.gql'),
                      variables: {id},
                      data
                  })
              }
            }
        })
        .then(({data}) => {
            this.$router.push({name: 'user'})
            this.$store.dispatch('snackbar/setSnack', {text: 'Receta guardada', color:'info'})
        })
        .catch((error) => {
            console.error('FrontError => onSubmit: ', error)
            this.$store.dispatch('snackbar/setSnack', {text: 'Error al guardar receta', color:'error'})
        })
    }
  },
  computed:{
      categories(){
          return this.$store.getters.readCategories
      },
      hasId(){
        return this.recipe.hasOwnProperty("id")
      }
  }
};
</script>