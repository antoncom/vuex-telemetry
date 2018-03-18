<template>
  <div :style="pickerStyle" data-role="date-picker" @click="onPickerClick">
    <date-view
            v-show="view==='d'&&monthsOnly===false"
            :month="currentMonth"
            :year="currentYear"
            :date="valueDateObj"
            :today="now"
            :limit="limit"
            :week-starts-with="weekStartsWith"
            :icon-control-left="iconControlLeft"
            :icon-control-right="iconControlRight"
            :date-class="dateClass"
            :months-only="monthsOnly"
            :auto-date="autoDate"
            @month-change="onMonthChange"
            @year-change="onYearChange"
            @date-change="onDateChange"
            @view-change="onViewChange"/>
    <month-view
            v-show="view==='m'"
            :month="currentMonth"
            :year="currentYear"
            :icon-control-left="iconControlLeft"
            :icon-control-right="iconControlRight"
            @month-change="onMonthChange"
            @year-change="onYearChange"
            @view-change="onViewChange"/>
    <year-view
            v-show="view==='y'"
            :year="currentYear"
            :icon-control-left="iconControlLeft"
            :icon-control-right="iconControlRight"
            @year-change="onYearChange"
            @view-change="onViewChange"/>
    <div v-if="todayBtn||clearBtn">
      <br/>
      <div class="text-center">
        <btn data-action="select" type="info" size="sm" v-if="todayBtn&&monthsOnly===false" @click="selectToday">{{t('uiv.datePicker.today')}}</btn>
        <btn data-action="select" size="sm" v-if="clearBtn" @click="clearSelect">{{t('uiv.datePicker.clear')}}</btn>
      </div>
    </div>
  </div>
</template>

<script>
  import Locale from '../../../../node_modules/uiv/src/mixins/localeMixin'
  import DateView from './DateView.vue'
  import MonthView from './MonthView.vue'
  import YearView from './YearView.vue'
  import Btn from '../../../../node_modules/uiv/src/components/button/Btn'
  import {stringify} from '../../../../node_modules/uiv/src/utils/dateUtils'
  import {isNumber} from '../../../../node_modules/uiv/src/utils/objectUtils'

  export default {
    mixins: [Locale],
    components: {DateView, MonthView, YearView, Btn},
    props: {
      value: null,
      width: {
        type: Number,
        default: 270
      },
      todayBtn: {
        type: Boolean,
        default: true
      },
      clearBtn: {
        type: Boolean,
        default: true
      },
      closeOnSelected: {
        type: Boolean,
        default: true
      },
      monthsOnly: {
        type: Boolean,
        default: false
      },
      autoDate: {
        type: [Number, String],
        default: '1'
      },
      limitFrom: null,
      limitTo: null,
      format: {
        type: String,
        default: 'yyyy-MM-dd'
      },
      initialView: {
        type: String,
        default: 'd'
      },
      dateParser: {
        type: Function,
        default: Date.parse
      },
      dateClass: Function,
      weekStartsWith: {
        type: Number,
        default: 0,
        validator (value) {
          return value >= 0 && value <= 6
        }
      },
      iconControlLeft: {
        type: String,
        default: 'glyphicon glyphicon-chevron-left'
      },
      iconControlRight: {
        type: String,
        default: 'glyphicon glyphicon-chevron-right'
      }
    },
    data () {
      return {
        show: false,
        now: new Date(),
        currentMonth: 0,
        currentYear: 0,
        view: 'd'
      }
    },
    computed: {
      valueDateObj () {
        let ts = this.dateParser(this.value)
        if (isNaN(ts)) {
          return null
        } else {
          let date = new Date(ts)
          if (date.getHours() !== 0) {
            date = new Date(ts + date.getTimezoneOffset() * 60 * 1000)
          }
          return date
        }
      },
      pickerStyle () {
        return {
          width: this.width + 'px'
        }
      },
      limit () {
        let limit = {}
        if (this.limitFrom) {
          let from = this.dateParser(this.limitFrom)
          if (!isNaN(from)) {
            from = new Date(from)
            from.setHours(0, 0, 0, 0)
            limit.from = from
          }
        }
        if (this.limitTo) {
          let to = this.dateParser(this.limitTo)
          if (!isNaN(to)) {
            to = new Date(to)
            to.setHours(0, 0, 0, 0)
            limit.to = to
          }
        }
        return limit
      }
    },
    mounted () {
      if (this.value) {
        this.setMonthAndYearByValue(this.value)
      } else {
        this.currentMonth = this.now.getMonth()
        this.currentYear = this.now.getFullYear()
        // this.view = this.initialView
        // ant below //
        this.view = (this.monthsOnly) ? 'm' : this.initialView
        //
      }
    },
    watch: {
      value (val, oldVal) {
        this.setMonthAndYearByValue(val, oldVal)
      }
    },
    methods: {
      setMonthAndYearByValue (val, oldVal) {
        let ts = this.dateParser(val)
        if (!isNaN(ts)) {
          let date = new Date(ts)
          if (date.getHours() !== 0) {
            date = new Date(ts + date.getTimezoneOffset() * 60 * 1000)
          }
          if (this.limit && ((this.limit.from && date < this.limit.from) || (this.limit.to && date >= this.limit.to))) {
            this.$emit('input', oldVal || '')
          } else {
            this.currentMonth = date.getMonth()
            this.currentYear = date.getFullYear()
          }
        }
      },
      onMonthChange (month) {
        this.currentMonth = month
        /// ant below ///
        if(this.monthsOnly)  {
          // make autoDate valid
          let lastDayOfMonth = new Date(this.currentYear, month + 1, 0).getDate()
          this.autoDate = (this.autoDate <= 0) ? 1: this.autoDate
          this.autoDate = (this.autoDate > lastDayOfMonth) ? lastDayOfMonth : this.autoDate

          // set date and hide datepicker
          let _date = new Date(this.currentYear, month, this.autoDate)
          this.$emit('input', stringify(_date, this.format))
          this.$parent.show = false
        }
      },
      onYearChange (year) {
        this.currentYear = year
        this.currentMonth = undefined
      },
      onDateChange (date) {
        if (date && isNumber(date.date) && isNumber(date.month) && isNumber(date.year)) {
          let _date = new Date(date.year, date.month, date.date)
          this.$emit('input', stringify(_date, this.format))
        } else {
          this.$emit('input', '')
        }
      },
      onViewChange (view) {
        this.view = view
      },
      selectToday () {
        this.view = 'd'
        this.onDateChange({
          date: this.now.getDate(),
          month: this.now.getMonth(),
          year: this.now.getFullYear()
        })
      },
      clearSelect () {
        /// ant ///
        if(this.monthsOnly)  {
          this.currentMonth = this.now.getMonth()
          this.currentYear = this.now.getFullYear()
          this.view = 'm'
          this.$emit('input', '')
        }
        else {
          this.view = 'd'
          this.onDateChange()
        }
      },
      onPickerClick (event) {
        if (event.target.getAttribute('data-action') !== 'select' || !this.closeOnSelected) {
          event.stopPropagation()
        }
      }
    }
  }
</script>
