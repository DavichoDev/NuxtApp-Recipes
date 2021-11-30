<template>
    <v-card>
        <v-card-title class="title secondary white--text">
            <v-icon class="mr-3" dark >mdi-account-plus</v-icon>
            Register form
        </v-card-title>
        <v-card-text>
            <v-container>
                <v-form @submit.prevent="onsubmit" ref="registerForm">
                    <v-text-field v-model="userInput.username"
                    dense
                    outlined
                    label="Username"
                    :rules="[rules.required]"
                    >
                    </v-text-field>
                    <v-text-field v-model="userInput.email"
                    dense
                    outlined
                    label="Email"
                    :rules="[rules.required, rules.email]"
                    >
                    </v-text-field>
                    <v-text-field v-model="userInput.password"
                    dense
                    outlined
                    label="Password"
                    counter
                    :rules="[rules.required, rules.min, rules.match]"
                    :type="showPassword ? 'text' : 'password'"
                    :append-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showPassword = !showPassword"
                    >
                    </v-text-field>
                    <v-text-field v-model="userInput.rePassword"
                    dense
                    outlined
                    label="ConfirmPassword"
                    counter
                    :rules="[rules.required, rules.min, rules.match]"
                    :type="showRePassword ? 'text' : 'password'"
                    :append-icon="showRePassword ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="showRePassword = !showRePassword"
                    >
                    </v-text-field>
                    <div class="d-flex justify-space-between">
                        <v-btn
                            color="secondary"
                            small
                            type="submit"
                        >Register</v-btn>
                        <v-btn
                            color="secondary"
                            small
                            outlined
                            @click="close"
                        >Close</v-btn>
                    </div>
                </v-form>
            </v-container>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    data(){
        return {
            rules: {
                required: (value) => !!value || 'This field is required',
                min: (v) => (v || '').length >= 8 || 'Minimum 8 characters',
                email: (v) => /.+@/.test(v) || 'Must be an e-mail',
                match: () => (
                        this.userInput.password === this.userInput.rePassword 
                        && this.userInput.rePassword === this.userInput.password)
                        || 'Passwords must match'
            },
            userInput: {
                username: '',
                email: '',
                password: '',
                rePassword: ''
            },
            showPassword: false,
            showRePassword: false,
        }
    },
    methods:{
        close(){
            this.$emit('close', false)
        },
        onsubmit(){
            if (this.$refs.registerForm.validate()) {
                // Setting necesary property
                this.userInput.identifier = this.userInput.username
                this.$apollo.mutate({
                    mutation: require('@/graphql/mutations/register.graphql'),
                    variables: this.userInput
                })
                .then(() => {
                    this.$auth.loginWith('local', {data: this.userInput})
                    .then(() => {
                        this.$store.dispatch('snackbar/setSnack',{
                            text: `Welcome ${this.$auth.user.username}!`,
                            color: 'success'
                        })
                        this.close()
                        this.$refs.registerForm.reset()
                    })
                })    
            }
        }
    }
}
</script>