<template>
  <v-app>
    <v-navigation-drawer
      app
      v-model="drawer"
      :clipped="$vuetify.breakpoint.lgAndUp"
      color="grey lighten-4"
    >
      <v-list color="primary--text">
        <v-list-item to="/">
          <v-list-item-icon>
            <v-icon>mdi-home</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Home </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item
          v-for="link in links"
          :key="link.id"
          :to="{ name: 'category', params: { category: link.slug } }"
        >
          <v-list-item-icon>
            <v-icon>{{ link.icon }}</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title>
              {{ link.name }}
            </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
        <v-list-item v-if="$auth.loggedIn" to="/user/favorites">
          <v-list-item-icon>
            <v-icon>mdi-heart</v-icon>
          </v-list-item-icon>
          <v-list-item-content>
            <v-list-item-title> Favorites </v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar
      app
      :clipped-left="$vuetify.breakpoint.lgAndUp"
      color="grey lighten-4"
      flat
    >
      <v-app-bar-nav-icon @click="drawer = !drawer" />
      <v-toolbar-title v-text="title"></v-toolbar-title>
      <v-spacer></v-spacer>

      <v-menu v-model="search" :close-on-content-click="false" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn v-on="on" color="primary" icon>
            <v-icon>mdi-magnify</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-card-title>Search recipe</v-card-title>
          <v-card-text>
            <v-text-field
              @input="searchRecipe()"
              outlined
              label="recipe"
              v-model="findRecipe"
              dense
            >
            </v-text-field>
            <v-list v-if="findRecipe.length !== 0">
              <v-list-item
                v-for="recipe in filteredRecipes"
                :key="recipe.id"
                @click="seeRecipe(recipe.category.slug, recipe.id)"
              >
                {{ recipe.name }}
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-menu>
      <div v-if="$auth.loggedIn">
        {{ $auth.user.username }}
        <v-btn text color="primary" @click="logout">Logout</v-btn>
        <v-menu v-model="loginMenu" offset-y>
          <template v-slot:activator="{ on }">
            <v-btn v-on="on" icon>
              <v-avatar color="secondary">
                <span class="white--text headline">{{
                  $auth.user.username[0]
                }}</span>
              </v-avatar>
            </v-btn>
          </template>

          <v-card>
            <v-list-item>
              <v-list-item-content>
                <v-list-item-title>{{ $auth.user.username }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  $auth.user.email
                }}</v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action>
                <v-btn to="/user" small>Admin</v-btn>
              </v-list-item-action>
            </v-list-item>
            <v-card-actions>
              <v-btn text color="primary" @click="loginMenu = false" small
                >Close</v-btn
              >
              <v-btn color="primary" @click="logout" small>Logout</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </div>

      <div v-else>
        <v-btn
          text
          color="primary"
          @click="
            dialog = true;
            type = 'app-forms-login';
          "
          >Login</v-btn
        >
        <v-btn
          text
          color="primary"
          @click="
            dialog = true;
            type = 'app-forms-register';
          "
          >Register</v-btn
        >
      </div>
    </v-app-bar>

    <v-main class="grey lighten-4">
      <Nuxt />

      <v-snackbar
        v-for="(snack, i) in snacks.filter((s) => s.showing)"
        :key="i"
        v-model="snack.showing"
        :color="snack.color"
        :timeout="snack.timeout"
        :style="`bottom: ${i * 60 + 8}px`"
        right
      >
        <v-btn slot="action" small icon @click="snack.showing = false">
          <v-icon small>mdi-close</v-icon>
        </v-btn>
        {{ snack.text }}
      </v-snackbar>
    </v-main>

    <v-dialog max-width="600" v-model="dialog">
      <component :is="type" @close="dialog = $event" />
    </v-dialog>

    <v-footer padless>
      <v-row justify="center" no-gutters>
        <v-btn color="primary" small icon><v-icon>mdi-facebook</v-icon></v-btn>
        <v-btn color="primary" small icon><v-icon>mdi-instagram</v-icon></v-btn>
        <v-btn color="primary" small icon><v-icon>mdi-pinterest</v-icon></v-btn>
        <v-btn color="primary" small icon><v-icon>mdi-twitter</v-icon></v-btn>
        <v-col class="text-center primary--text" cols="12">
          &copy; {{ new Date().getFullYear() }} - LE COQ
        </v-col>
      </v-row>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      drawer: false,
      title: "LE COQ",
      search: false,
      findRecipe: "",
      dialog: false,
      type: "app-forms-login",
      snack: false,
      loginMenu: false,
    };
  },
  methods: {
    seeRecipe(category, recipe) {
      this.findRecipe = "";
      this.search = false;
      this.$router.push({
        name: "category-recipe",
        params: { category, recipe },
      });
    },
    searchRecipe() {
      this.$store.dispatch("searchRecipe", this.findRecipe);
    },
    test() {
      this.$store.dispatch("snackbar/setSnack", {
        text: "hola action",
        color: "info",
      });
    },
    logout() {
      this.loginMenu = false;
      this.$auth.logout();
      this.$store.commit('user/resetFav')
    },
  },
  computed: {
    ...mapGetters({
      links: "readCategories",
      recipes: "readLoadedRecipes",
      snacks: "snackbar/readSnackbars",
    }),
    filteredRecipes() {
      return this.recipes.filter((recipe) =>
        recipe.name.toLowerCase().match(this.findRecipe.toLowerCase())
      );
    },
  },
};
</script>
