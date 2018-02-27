<template>
  <div id="app">
    <transition :name="transitionName">
      <router-view class="child-view" ></router-view>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted() {

  },
  data () {
      return {
        transitionName: 'slide-left',
      }
   },
  methods:{

  },
   beforeRouteUpdate (to, from, next) {
      let isBack = this.$router.isBack
      if (isBack) {
        this.transitionName = 'slide-right'
      } else {
        this.transitionName = 'slide-left'
      }
      this.$router.isBack = false
   },
}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "./components/common/stylus/meta.styl";

.child-view {
  width:100%;
  transition: all 0.1s cubic-bezier(.55,0,.1,1);
}
.slide-left-enter, .slide-right-leave-active {
  opacity: 0;
/*  -webkit-transform: translate(10%, 0);
  transform: translate(10%, 0);*/
}
.slide-left-leave-active, .slide-right-enter {
  opacity: 0;
  -webkit-transform: translate(-10%, 0);
  transform: translate(-10%, 0);
}
</style>
