<template>
    <v-card>
        <v-card-title>
            <v-icon class="mr-3">mdi-account-key</v-icon>
            Log In
        </v-card-title>
        <v-card-text>
            <v-form @submit.prevent="onsubmit" ref="loginForm">
                <v-text-field 
                    v-model="userInfo.identifier" 
                    dense outlined 
                    label="Username"
                ></v-text-field>
                <v-text-field 
                    v-model="userInfo.password" 
                    dense outlined 
                    label="Password"
                    :type="show ? 'text' : 'password'"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    @click:append="show = !show"
                ></v-text-field>
                <div class="d-flex justify-space-between">
                    <v-btn
                        color="primary"
                        small
                        type="submit"
                    >Login</v-btn>
                    <v-btn
                        color="primary"
                        small
                        outlined
                        @click="close"
                    >Close</v-btn>
                </div>
            </v-form>
        </v-card-text>
    </v-card>
</template>

<script>
export default {
    data(){
        return {
            userInfo:{
                identifier: '',
                password: '',
            },
            show: false,
        }
    },
    methods:{
        close(){
            this.$emit('close', false)
        },
        async onsubmit(){
            await this.$auth.loginWith('local', {data: this.userInfo})
                .then(() => {
                    this.$store.dispatch('snackbar/setSnack',{
                        text: `Welcome ${this.$auth.user.username}!`,
                        color: 'success'
                    })
                    this.close()
                    this.$refs.loginForm.reset()
                    console.log(this.$auth)
                })
                .catch(error => {
                    this.$store.dispatch('snackbar/setSnack',{
                        text: 'Verify your username or password',
                        color: 'error'
                    })
                    console.log(error)
                })
        }
        
    }
}
</script>