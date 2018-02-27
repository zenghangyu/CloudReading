<template>
  <div class="meunBox">
    <ul>
      <li class="index" v-on:click="indexTo">
        <img src="../../../assets/icon/index.png" alt="">
        <span>我的书房</span>
      </li>
      <li class="findBook" v-on:click="findBookTo">
        <img src="../../../assets/icon/findBook.png" alt="">
        <span>找书</span>
      </li>
      <li class="My" v-on:click="MyTo">
        <img src="../../../assets/icon/My.png" alt="">
        <span>我的资料</span>
      </li>
    </ul>
  </div>
</template>

<script>
	 export default {
	 	data(){
	 		return {
	 			canSee:true,
	 			seen:false,
	 			passWord:null
	 		}
	 	},
    mounted(){
      let active = this.$route.name;
      if(active == 'index' || active == 'findBook' || active == 'My'){
        $('.meunBox ul li').removeClass('OnActiveClick');
        $('.meunBox .'+active+'').addClass('OnActiveClick');
        $('.meunBox .'+active+' img').attr('src',require('@/assets/icon/'+active+'_active.png'));
      }
      $('body').on('click','.meunBox ul li',function () {
        if($(this).hasClass('OnActiveClick')){
          $('.meunBox').css('display','block');
        }else {
          $('.meunBox').css('display','none');
        }
      })
    },
	 	methods:{
      indexTo:function () {
        this.$router.push({path: 'index'});
      },
      findBookTo:function () {
        this.$router.push({path: 'findBook'});
      },
      MyTo:function () {
        this.$router.push({path: 'My'});
      },
	 	}
	 }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../stylus/meta.styl";
  @import "./nav.styl";
</style>
