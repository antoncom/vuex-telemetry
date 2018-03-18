<template>
<div id="wrapper">
    <nprogress-container></nprogress-container>
    <nav-bar></nav-bar>

    <div id="page-wrapper" class="gray-bg">
        <page-top></page-top>
        <page-main>
            <consumption-form slot="consumption-form"></consumption-form>
        </page-main>
        <page-footer></page-footer>
    </div>
</div>
</template>

<script>
import NprogressContainer from 'vue-nprogress/src/NprogressContainer'
//import { NavBar, PageTop, PageMain, ConsumptionForm, PageFooter } from '../layout'
//import DatePicker from 'DatePicker'
//import DatePicker from '../../../node_modules/uiv/src/components/datepicker/DatePicker.vue'



import DatePicker from '../layout/DatePicker/DatePicker.vue'
import NavBar from '../layout/NavBar.vue'
import PageTop from '../layout/PageTop.vue'
import PageMain from '../layout/PageMain.vue'
import PageFooter from '../layout/PageFooter.vue'
import ConsumptionForm from '../layout/ConsumptionForm.vue'

export default {
    components: {
        NavBar,
        PageTop,
        PageMain,
        ConsumptionForm,
        PageFooter,
        NprogressContainer
    },
    data() {
        return {
            search: 'weqeqweqe',
            api_address: '/consumption?type=2',
            headers: [
                { title: 'Дата' },
                { title: 'Ресурс', class: 'some-special-class' },
                { title: 'Потребление по ОДУ' },
                { title: 'Сумма потребления по квартирам' },
            ],
            from: ''
        }
    },
    watch:{
        users: function(val){
            console.log('WATCH [Consumption]')
            console.log(this.users)

        }
    },
    computed: {
        filteredUsers: function () {
            console.log('COMPUTED [Consumption] - filteredUsers')
            let self = this
            console.log(this.users)
            return self.users
        },
        dating_from: {
            get: function() {
                return this.from
            },
            set: function(val) {
                this.from = val
            }
        },
    }
}
</script>

<style>
</style>