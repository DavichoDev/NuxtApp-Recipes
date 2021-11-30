<template>
    <div>
        <v-btn icon @click="dialog = true"><v-icon>mdi-delete</v-icon></v-btn>
        <v-dialog v-model="dialog" max-width="590">
            <v-card>
                <v-card-title class="headline">Delete recipe</v-card-title>
                <v-card-text>
                    Do you really want to delete this recipe?
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn @click="returnChoice(true)" color="error" small>Borrar</v-btn>
                    <v-btn @click="returnChoice(false)" color="primary" small>Cancel</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            dialog: false
        }
    },
    methods:{
        returnChoice( choice ){
            this.dialog = false
            this.$emit("choice", choice)
        }
    }
}
</script>