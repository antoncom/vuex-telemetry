<template>
        <table id="table_consumption" class="table table-striped table-bordered table-hover dataTables-example" >
            <thead>
            <tr>
                <th>Дата</th>
                <th>Ресурс</th>
                <th>Потребление по ОДУ</th>
                <th>Сумма потребления по квартирам</th>
            </tr>
            </thead>
            <tfoot>
            <tr>
                <th>Дата</th>
                <th>Ресурс</th>
                <th>Потребление по ОДУ</th>
                <th>Сумма потребления по квартирам</th>
            </tr>
            </tfoot>
        </table>
</template>

<script>
export default {
    data() {
        return {}
    },
    mounted: function() {
        // Help: https://vuejsdevelopers.com/2017/05/20/vue-js-safely-jquery-plugin/
        this.table = $(this.$el).DataTable({
            ajax: {
                "url": Vue.axios.defaults.baseURL + "/consumption?table=1&type=2",
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader('X-Auth-Token', sessionStorage.getItem('token'));
                },
                "dataSrc": function ( json ) {
                    if(json.status == "error" && json.code == 401)  {
                        console.log(json)
                    }
                    else {
                        return json.data;
                    }
                }
            },
            language: {
                url: "//cdn.datatables.net/plug-ins/1.10.16/i18n/Russian.json"
            },
            pageLength: 10,
            responsive: true,
            dom: '<"html5buttons"B>Tfgt<"bottom"lp>',
            columns: [
                {data: "date"},
                {data: "res_name"},
                {data: "total"},
                {data: "sum"},
            ],
            select: true,
            buttons: [
//                'excelHtml5',
//                'csvHtml5',
//                'pdfHtml5',
                {
                    extend: 'print',
                    customize: function (win) {
                        $(win.document.body).addClass('white-bg');
                        $(win.document.body).css('font-size', '10px');

                        $(win.document.body).find('table')
                                .addClass('compact')
                                .css('font-size', 'inherit');
                    }
                },
                {
                    text: 'Построить график',
                    action: function (e, dt, node, config) {
                        // code here
                    }
                }
            ]
        });
    },
//    beforeDestroy: function() {
//        console.log(this.table)
//        this.table.destroy(true)
//        console.log(this.table)
//    }
}
</script>

<style>
</style>