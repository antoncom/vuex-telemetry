<template>
    <form name="consumption_form" @submit.prevent>
        <div class="container-fluid">
            <div class="row  border-bottom white-bg dashboard-header">
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
                    <div class="row">
                        <h2>Выберите энергоресурс:</h2>
                        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            <ul class="list-unstyled">
                                <li v-for="res in firstHalf(resources)">
                                    <p-radio class="p-icon p-round p-smooth p-plain" name="res" v-model="resid" :value="res.id" color="success-o">
                                        <i slot="extra" class="icon fa fa-check fa-1x"></i>
                                        {{res.name}}
                                    </p-radio>
                                </li>
                            </ul>
                        </div>
                        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            <ul class="list-unstyled">
                                <li v-for="res in secondHalf(resources)">
                                    <p-radio class="p-icon p-round p-smooth p-plain" name="res" v-model="resid" :value="res.id" color="success-o">
                                        <i slot="extra" class="icon fa fa-check fa-1x"></i>
                                        {{res.name}}
                                    </p-radio>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="row">
                        <div class="col-md-12">
                            <hr class="style11">
                            <p-radio class="p-icon p-round p-smooth p-plain" name="res" v-model="resid" :value="0" color="success-o">
                                <i slot="extra" class="icon fa fa-check fa-1x"></i>
                                Все энергоресурсы
                            </p-radio>
                        </div>
                    </div>
                </div>
                <div class="col-lg-6 col-md-6 col-sm-12 col-xs-12 date-consumption">
                    <div class="row">
                        <h2>Выберите дату:</h2>
                        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            <ul class="list-unstyled">
                                <li>
                                    <p-radio class="p-icon p-round p-smooth p-plain" name="period" v-model="togglePeriod" :value="1" color="success-o">
                                        <i slot="extra" class="icon fa fa-check fa-1x"></i>
                                        Произвольные даты
                                    </p-radio>
                                </li>
                                <li>
                                    <p-radio class="p-icon p-round p-smooth p-plain" name="period" v-model="togglePeriod" :value="2" color="success-o">
                                        <i slot="extra" class="icon fa fa-check fa-1x"></i>
                                        Даты по месяцам
                                    </p-radio>
                                </li>
                            </ul>
                        </div>
                        <div class="col-lg-6 col-md-12 col-sm-12 col-xs-12">
                            <template v-if="togglePeriod==1">
                                <label>Начальная дата:</label>
                                <dropdown class="form-group">
                                    <div class="input-group">
                                        <input class="form-control" type="text" name="from" v-model="dating_from">
                                        <div class="input-group-btn">
                                            <btn class="dropdown-toggle"><i class="glyphicon glyphicon-calendar"></i></btn>
                                        </div>
                                    </div>
                                    <template slot="dropdown">
                                        <li>
                                            <date-picker v-model="dating_from" initial-view="d" key="ant1"/>
                                        </li>
                                    </template>
                                </dropdown>
                                <label>Конечная дата:</label>
                                <dropdown class="form-group">
                                    <div class="input-group">
                                        <input class="form-control" type="text" name="from" v-model="dating_to">
                                        <div class="input-group-btn">
                                            <btn class="dropdown-toggle"><i class="glyphicon glyphicon-calendar"></i></btn>
                                        </div>
                                    </div>
                                    <template slot="dropdown">
                                        <li>
                                            <date-picker v-model="dating_to" initial-view="d" key="tat1" />
                                        </li>
                                    </template>
                                </dropdown>
                            </template>
                            <template v-else-if="togglePeriod==2">
                                <label>Начальный месяц:</label>
                                <dropdown class="form-group">
                                    <div class="input-group">
                                        <input class="form-control" type="text" name="from" v-model="dating_from">
                                        <div class="input-group-btn">
                                            <btn class="dropdown-toggle"><i class="glyphicon glyphicon-calendar"></i></btn>
                                        </div>
                                    </div>
                                    <template slot="dropdown">
                                        <li>
                                            <date-picker v-model="dating_from" :months-only="true" :auto-date="1" key="ant2" />
                                        </li>
                                    </template>
                                </dropdown>
                                <label>Конечный месяц:</label>
                                <dropdown class="form-group">
                                    <div class="input-group">
                                        <input class="form-control" type="text" name="from" v-model="dating_to">
                                        <div class="input-group-btn">
                                            <btn class="dropdown-toggle"><i class="glyphicon glyphicon-calendar"></i></btn>
                                        </div>
                                    </div>
                                    <template slot="dropdown">
                                        <li>
                                            <date-picker v-model="dating_to" :months-only="true" :auto-date="31" key="tat2" />
                                        </li>
                                    </template>
                                </dropdown>
                            </template>
                        </div>
                        <div class="row">
                            <button v-on:click="applyFilter" name="apply_filter" class="btn btn-primary align-bottom">Применить</button>
                        </div>
                    </div>
                </div>
            </div>
            <div>
                <datatable v-bind="$data" />
            </div>
        </div>
    </form>
</template>

<script type="text/babel">
import DatePicker from '../layout/DatePicker/DatePicker.vue'
export default {
    components: {
        DatePicker
    },
    data: () => {
        return {
            resources: [],
            api_resources: '/resources',
            data: [],
            total: 0,
            // data for vue2-datatable-component
            api_consumptions: '/consumption',
            query: { // the 'query' object is bind to datatable component
                // the params are API declared
                res: 0,
                period: 1,
                type: null,
                from: '',
                to: '',
                // next params are datatable2-component native
                limit: 10,
                offset: null,
                sort: '',
                order: ''
            },
            columns: [
                { title: 'Дата', field: 'date', sortable: true },
                { title: 'Ресурс', field: 'res_name' },
                { title: 'Потребление по ОДУ', field: 'total', sortable: true },
                { title: 'Сумма потребления по квартирам', field: 'sum' }
            ]
        }
    },
    mounted: function()    {
        Vue.axios.get(this.api_resources)
            .then(response => {
                this.resources = response.data
            })
            .catch(error => {
                console.log(error.response)
            })
        let query = jQuery.param(_.pickBy(this.query)) // получаем строку параметров, удалив предварительно пустые параметры или равные null

        Vue.axios.get(this.api_consumptions + '/index?' + query)
                .then(response => {
                    this.data = response.data
                    // this.total = response.total
                })
                .catch(error => {
                    console.log(error.response)
                })
    },
    methods: {
        // Выводим ресурсы (галочки-радиобатоны) в две колонки
        firstHalf: function (resources) {
            return _.take(resources, Math.ceil(resources.length/2))
        },
        secondHalf: function (resources) {
            return _.takeRight(resources, Math.floor(resources.length/2))
        },
        applyFilter: function ()    {
            // Обновляем таблицу данных
            let query = jQuery.param(_.pickBy(this.query)) // получаем строку параметров, удалив предварительно пустые параметры или равные null
            Vue.axios.get(this.api_consumptions + '/index?' + query)
                    .then(response => {
                        this.data = _.castArray(response.data)
                    })
                    .catch(error => {
                        console.log(error.response)
                    })
        }
    },
    computed:  {
        dating_from: {
            get: function() {
                return this.query.from
            },
            set: function(val) {
                this.query.from = val
            }
        },
        dating_to: {
            get: function() {
                return this.query.to
            },
            set: function(val) {
                this.query.to = val
            }
        },
        // this used twice:
        // 1. To switch between templates containing datepickers
        // 2. To bind "change date type" radio (Произвольные даты vs Даты по месяцам
        togglePeriod:  {
            get: function() {
                let a = this.query.period
                return a
            },
            set: function(val) {
                this.query.from = ''
                this.query.to = ''
                this.query.period = val
            }
        },
        resid: {
            get: function() {
                return this.query.res
            },
            set: function(val) {
                this.query.res = val
            }
        },
    }
}
</script>

<style>
    .pretty {
        font-size: 20px;
        margin-bottom: 10px;
    }

    .pretty label   {
        font-color: #189818;
    }

    hr.style11 {
        height: 6px;
        background: url(http://ibrahimjabbari.com/english/images/hr-11.png) repeat-x 0 0;
        border: 0;
        margin-top: 0;
    }

    button[name=apply_filter]   {
        display: block;
        margin-left: 30px;
    }

    .red    {
        border: 1px solid red;
    }

    .green    {
        border: 1px solid green;
    }

    .pretty .state label {
        font-size: 0.8em!important;
        line-height: 100%!important;
        text-indent: 1.8em!important;
    }

    .pretty .state label:after,
    .pretty .state label:before {
        top: calc((0% - (100% - 1em)) + 30%)!important;
    }

    body{
        color: #3E4A52!important;
    }
    /*@media (min-width: 768px)   {*/
        /*.date-consumption   {*/
            /*padding-left: 0px!important;*/
        /*}*/
    /*}*/

    h2  {
        margin-left: 13px;
        margin-top: 15px;
        margin-bottom: 15px;
    }


</style>