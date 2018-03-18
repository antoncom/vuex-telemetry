<template>
<div class="middle-box text-center loginscreen animated fadeInDown">
    <div>
        <div>
            <h1 class="logo-name">Telemetry</h1>
        </div>
        <h3>Телеметрия</h3>
        <p>Учёт энергоресурсов</p>
        <p>Введите логин и пароль пользователя для входа в личный кабинет.</p>
        <form class="m-t" role="form">
            <div class="alert alert-danger alert-dismissable" v-show="error">
                {{ error }}
            </div>
            <div class="form-group">
                <input type="text" class="form-control" v-model.trim="params.user" placeholder="Username" name="user" required="">
            </div>
            <div class="form-group">
                <input type="password" class="form-control" v-model="params.password" placeholder="Password" name="password" required="">
            </div>
            <button type="submit" @click.prevent="login" class="btn btn-primary block full-width m-b">Войти</button>

            <!--<a href="#"><small>Забыли пароль?</small></a>-->
        </form>
        <p class="m-t"> <small>Telemetry © 2017</small> </p>
    </div>
</div>
</template>

<script>
export default {
    data() {
        return {
            error: '',
            params: {
                user: 'petrenko',
                password: 'petrenko',
            }
        }
    },
    methods: {
        login() {
            this.$store.dispatch('login', this.$data)
        },
        logout() {
            this.$store.dispatch('logout', this.$data)
        }
    }
}
</script>

<style>
</style>