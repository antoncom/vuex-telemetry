<template>
<div id="wrapper">
    <nprogress-container></nprogress-container>
    <nav-bar></nav-bar>

    <div id="page-wrapper" class="gray-bg">
        <page-top></page-top>
        <page-main>


        </page-main>

        <page-footer></page-footer>
    </div>
</div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
//import { PageTop, PageMain, PageFooter } from '../layout/index.js'
import DatePicker from '../layout/DatePicker/DatePicker.vue'
import NavBar from '../layout/NavBar.vue'
import PageTop from '../layout/PageTop.vue'
import PageMain from '../layout/PageMain.vue'
import PageFooter from '../layout/PageFooter.vue'

export default {
    components: {
        NavBar,
        PageTop,
        PageMain,
        PageFooter,
        NprogressContainer,
        DatePicker
    },

    data() {
        return {
            query: { // the 'query' object is bind to datatable component
                // the params are API declared
                res: 2,
                period: 2,
                type: '1',
                from: '2018-01-10',
                to: '2018-01-20',
                // next params are datatable2-component native
                limit: 10,
                offset: null,
                sort: '',
                order: ''
            }
        }
    },
    computed:   {
        dating_to_month: {
            get: function() {
                return this.query.to
            },
            set: function(val) {
                this.query.to = val
            }
        }
    }
}
</script>

<style>
</style>