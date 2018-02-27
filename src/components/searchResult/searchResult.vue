<template>
	<div class="tab_box">

    <div class="backBox">
      <p class="close_arrows" v-on:click="GoBackTo">
        <img src="../../assets/icon/close_arrows.png" alt="">
      </p>
    </div>

    <div class="searchResultBox">
      <ul class="ResultTitleList">
        <!--
        BOOKNAME	true	String		书籍名称
        BOOK_ID	True	String		书籍id
        BOOKROOM_ID	True	String		学校书库id
        AUTHOR	True	String		作者
        COVER	True	String		封面
        /uploadFiles/uploadImgs/pc/book/book/COVER 	图片地址
        INTEGRAL	True	String		积分
        INTRODUCTION	True	String		简介
        LEVEL_ID	True	String		级别id
        SCHOOL_ID	True	String		学校id
        -->
        <li class="Resultimage left">
          <p>
            <img :src="ImgUrlYuan + getBookDataList.COVER" alt="">
          </p>
        </li>
        <li class="ResultTitleData left">
          <p class="ResultTitle">{{getBookDataList.BOOKNAME}}</p>
          <p>作者：<span class="spanCtrl">{{getBookDataList.AUTHOR}}</span></p>
          <p>字数：<span class="spanCtrl">{{getBookDataList.WORDCOUNT}}<span class="WordDW">字</span></span></p>
          <p>儿童 | 家庭 | 童话</p>
        </li>
      </ul>
      <div class="ResultContentBox">
          <div class="ResultContent">
            <p>
              {{getBookDataList.INTRODUCTION}}
            </p>
          </div>
        <div class="BtnZhankaiBox">
          <p class="BtnZhankaiText left">展开</p>
          <img src="../../assets/icon/zhankai.png" alt="" class="zhankaiImage left">
        </div>
      </div>

      <div class="BtnClickExamBox">
        <p class="BtnClickExam left" v-on:click="examinationTo(getBookDataList.BOOK_ID,getBookDataList.BOOKNAME)">点击考级</p>
        <p class="BtnClickLink right" v-on:click="LinkTo(getBookDataList.LINK)">
          <img src="../../assets/icon/cart.png" alt="">
        </p>
      </div>

    </div>

    <loading v-show="FangLoading"></loading>
    <fangerror :fangerroring="fangerroring" :fangerrorText="fangerrorText"></fangerror>
	</div>
</template>

<script>
import {ApiUrl,Islogined} from '../../../static/js/ApiUrl.js'
import loading from '../common/loading/loading.vue'
import fangerror from '../common/fangerror/fangerror.vue'
export default {
  components: {
    loading,fangerror,
  },
  data(){
    return {
      FangLoading:false,//Loading控制，true显示，false不显示
      fangerroring:false,//提示文本弹窗，true显示，false不显示
      fangerrorText:'',//提示文本弹窗内容
      getBookDataList:[],
      ImgUrlYuan:ApiUrl() + '/uploadFiles/uploadImgs/pc/book/book/',
    }
  },
  mounted(){
    Islogined();
    document.title = '我的成绩';
    let windowH = $(window).height();
    // let meunBoxH = $('.meunBox').outerHeight(true);
    let backBoxH = $('.backBox').outerHeight(true);
    $('.tabContentBox').height(windowH - backBoxH);
    var tab_box = $('.tab_box').outerHeight(true)
    $('body').on('click','.BtnZhankaiBox',function () {
      var ResultContentCSS = $('.ResultContent').css('-webkit-line-clamp');
      if(ResultContentCSS != '999999'){
        $('.ResultContent').css({'height':'auto','-webkit-line-clamp': '999999'});
        $('.BtnZhankaiText').text('收起')
        $('.zhankaiImage').attr('src',require('../../assets/icon/shouqi.png'))
      }else {
        $('.ResultContent').css({'height':'4.533333333333333rem','-webkit-line-clamp': '6'});
        $('.BtnZhankaiText').text('展开')
        $('.zhankaiImage').attr('src',require('../../assets/icon/zhankai.png'))
      }
    })
    if(tab_box > windowH){
      $('.line').height(tab_box)
    }else {
      $('.line').css('height','100%')
    }
    console.log(this.$route.query.BOOK_ID)
    let BOOK_ID = this.$route.query.BOOK_ID
    this.getBook(BOOK_ID)
  },
  methods:{
    setTimeoutError:function () {
       setTimeout(() => {
        $('.Fang_errorBox').hide()
        this.fangerroring = false
       }, 2000)
    },
    GoBackTo:function () {
      this.$router.go(-1);
    },
    LinkTo:function(Link){
        if(Link != undefined ){
          window.location.href = Link;
        }
      },
    examinationTo:function(BOOK_ID,BookName) {
      this.$router.push({path: 'examination?BOOK_ID='+ BOOK_ID});
      localStorage.setItem('FangBookName',BookName);
    },
    /*
      * 书籍具体信息获取
      接口地址: /online/student/getBook
      BOOK_ID	true	string		书籍id
      * */
      getBook:function (BOOK_ID,fn) {
        let _This = this;
        _This.FangLoading = true;
        this.axios({
          method: 'post',
          url: ApiUrl() + '/online/student/getBook',
          params: {
            BOOK_ID:BOOK_ID,
          }
        }).then(function (response) {
/*          console.log(response)
          // alert(response.data.BOOK_ID)*/
          if(response.data){
            if(response.data.BOOK_ID != undefined){
              _This.getBookDataList = response.data;
            }
            _This.FangLoading = false;
            !!fn && fn();
          }
        }).catch(function (error) {
          console.log(error);
          _This.FangLoading = false;
        });
      },

  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/meta.styl";
  @import "./searchResult.styl";
</style>
