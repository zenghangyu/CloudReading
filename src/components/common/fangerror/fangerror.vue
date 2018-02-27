<template>
  <div class="Fang_errorBox" v-show="fangerroring">
    <div class="Fang_error">{{fangerrorText}}</div>
  </div>
</template>
<script>
    export default{
        props: {
          fangerrorText: String,
          fangerroring:Boolean,
        },
      mounted(){
      },
      watch:{
　　　　/*fangerrorText(curVal,oldVal){
　　　　　console.log(curVal);
          if(curVal !=''){
            this.setTimeoutError();
          }
　　　　},
        fangerroring(curVal,oldVal){
　　　　　console.log(curVal);
          if(curVal != false){
            $('.Fang_error').show()
          }
　　　　},*/
      },
      methods:{

      },
    }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/meta.styl";
  .Fang_errorBox{
    width:100%;height:100%;position: fixed;top: 0;left: 0;background: rgba(0,0,0,0);z-index: 99999;
  }
  .Fang_error{
    background: rgba(0,0,0,0.6); color:#fff; padding: Fangsize(15) Fangsize(20); Fangfont(16); border-radius: 10px;position: fixed; left: 50%; top: 50%;-webkit-transform: translate(-50%,-50%);-ms-transform: translate(-50%,-50%);	transform: translate(-50%,-50%);z-index: 99999;
  }
</style>
