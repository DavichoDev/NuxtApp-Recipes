<template>
  <v-container>
    <v-row>
      <v-col 
        v-for="category in categories" 
        :key="category.id"
        cols="3">
        <app-ui-nav-card :category="category">
        </app-ui-nav-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  middleware: 'initData',
  data() {
    return {
      category: {
        type: Object,
        required: true
      }
    };
  },
  computed: {
    categories() {
      return this.$store.getters.readCategories;
    },
  },
};
</script> 