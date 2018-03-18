<template>
<div class="wrapper wrapper-content animated fadeInRight">
    <transition
      mode="out-in"
      enter-active-class="fadeIn"
      leave-active-class="fadeOut"
      appear>
      <router-view class="animated"></router-view>
    </transition>
    <div class="row wrapper border-bottom white-bg page-heading">
        <div class="col-lg-9">
            <h2>This is main title</h2>
            <ol class="breadcrumb">
                <li>
                    <a href="index.html">This is</a>
                </li>
                <li class="active">
                    <strong>Breadcrumb</strong>
                </li>
            </ol>
        </div>
        <div class="col-lg-3">
            <div class="title-action">
                <a href="" class="btn btn-primary">This is action area</a>
            </div>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-12">
            <div id="myid" class="wrapper wrapper-content">

                <slot name="consumption-form"></slot>

            </div>
        </div>
    </div>
</div>
</template>

<script type="text/babel">
export default {
    data: function () {
        return {
            date: null,
        }
    }
}
</script>

