<template>
	<div class="tab_box">

    <div class="tabContentBox">

      <div class="megessBox">
        <div class="megessImg left">
          <img src="../../assets/icon/megess.png" alt="">
        </div>
        <ul class="left">
          <li v-on:click="megessListTo">
            {{noticelistHtml}}
          </li>
        </ul>
      </div>

      <div class="contentBox">

        <div class="contentLeft left">
          <ul>
            <!--
            LEVEL_ID	true	String		级别id
            NAME	True	String		级别名
            INTEGRAL	True	String		级别分数
            SCHOOL_ID	True	String		学校id
            -->
            <li v-for="(DataList,index) in getLevelDataList" v-bind:class="[index==0?'OnAcive':'']" v-on:click="getSchoolBook(DataList.SCHOOL_ID,DataList.LEVEL_ID)"><p>{{DataList.NAME}}</p></li>
          </ul>
        </div>

        <div class="contentRight left">
          <ul class="dataListBox">
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
            <li class="dataList" v-for="(BookDataList,index) in getSchoolBookDataList">
              <p class="ListBanner left"><img :src="ImgUrlYuan + BookDataList.COVER" alt=""></p>
              <div class="Listcontent left">
                <p class="ListTitle" v-on:click="searchResultTo(BookDataList.BOOK_ID)">{{BookDataList.BOOKNAME}}</p>
                <p class="writerData">作者：<span>{{BookDataList.AUTHOR}}</span></p>
                <p class="CountWordData">字数：<span>{{BookDataList.WORDCOUNT}}</span>字</p>
                <p class="descriptionData">{{BookDataList.INTRODUCTION}}</p>
                <p class="Btn_listBox"><span class="examclick" v-on:click="examinationTo(BookDataList.BOOK_ID,BookDataList.BOOKNAME)">点击考试</span><span class="cartlink" v-on:click="LinkTo(BookDataList.LINK)"><img src="../../assets/icon/cart.png" alt=""></span></p>
              </div>
            </li>

          </ul>
        </div>

      </div>
    </div>

    <loading v-show="FangLoading"></loading>
    <fangerror :fangerroring="fangerroring" :fangerrorText="fangerrorText"></fangerror>

    <meun></meun>

	</div>
</template>

<script>
import Nav from '../common/nav/nav.vue'
import {ApiUrl,Islogined,returnId} from '../../../static/js/ApiUrl.js'
import loading from '../common/loading/loading.vue'
import fangerror from '../common/fangerror/fangerror.vue'
export default {
     components: {
      meun:Nav,loading,fangerror,
   	},
	 	data(){
	 		return {
	 			FangLoading:false,//Loading控制，true显示，false不显示
        fangerroring:false,//提示文本弹窗，true显示，false不显示
        fangerrorText:'',//提示文本弹窗内容
        getLevelDataList:[],
        getSchoolBookDataList:[],
        ImgUrlYuan:ApiUrl() + '/uploadFiles/uploadImgs/pc/book/book/',
        noticelistHtml:'',
        noticelistData:[],
	 		}
	 	},
    mounted(){
	 	  Islogined();
	 	  // alert(returnId('schoolId'))
      this.noticelist(returnId('schoolId'))
	 	  let _This = this;
	 	  // console.log(this.$route)
      document.title = '阅评';
      let windowH = $(window).height();
      let meunBoxH = $('.meunBox').outerHeight(true);
      let megessBoxH = $('.megessBox').outerHeight(true);
      $('.contentLeft,.contentRight').height( windowH - meunBoxH - megessBoxH );
      $('.tabContentBox').height(windowH - meunBoxH);
      $('body').on('click','.contentLeft ul li',function () {
        $('.contentLeft ul li').removeClass('OnAcive');
        $(this).addClass('OnAcive')
      })

      this.getLevel(returnId('schoolId'),function (data) {
        // console.log(data[0])
        _This.getSchoolBook(returnId('schoolId'),data[0].LEVEL_ID)
      });
    },
	 	methods:{
      setTimeoutError:function () {
         setTimeout(() => {
          $('.Fang_errorBox').hide()
          this.fangerroring = false
         }, 2000)
      },
      examinationTo:function (BOOK_ID,BookName) {
        this.$router.push({path: 'examination?BOOK_ID='+BOOK_ID});
        localStorage.setItem('FangBookName',BookName);
      },
      megessListTo:function () {
        this.$router.push({path: 'megessList'});
      },
      searchResultTo:function(BOOK_ID){
        this.$router.push({path: 'searchResult?BOOK_ID='+BOOK_ID});
      },
      LinkTo:function(Link){
        window.location.href = Link;
      },
      /*
      * 书房级别获取
      接口地址: /online/student/getLevel
      *
      * SCHOOL_ID	true	string		学校id
      * */
      getLevel:function (SCHOOL_ID,fn) {
        let _This = this;
        _This.FangLoading = true;
        this.axios({
          method: 'post',
          url: ApiUrl() + '/online/student/getLevel',
          params: {
            SCHOOL_ID:SCHOOL_ID,
          }
        }).then(function (response) {
          if(response.data){
            _This.getLevelDataList = response.data;
            _This.FangLoading = false;
            !!fn && fn(response.data);
          }
        }).catch(function (error) {
          console.log(error);
          _This.FangLoading = false;
        });
      },
      /*
      * 级别对应的书籍获取
      接口地址: /online/student/ getSchoolBook
      SCHOOL_ID	true	string		学校id
      LEVEL_ID	True	string		级别id
      * */
      getSchoolBook:function (SCHOOL_ID,LEVEL_ID,fn) {
        let _This = this;
        _This.FangLoading = true;
        this.axios({
          method: 'post',
          url: ApiUrl() + '/online/student/getSchoolBook',
          params: {
            SCHOOL_ID: SCHOOL_ID,
            LEVEL_ID:LEVEL_ID,
          }
        }).then(function (response) {
          if(response.data){
            _This.getSchoolBookDataList = response.data;
            _This.FangLoading = false;
            !!fn && fn();
          }
        }).catch(function (error) {
          console.log(error);
          _This.FangLoading = false;
        });
      },
       /*
    *学校公告
    接口地址: /online/student/ noticelist
    * */
    noticelist:function (SCHOOL_ID,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/student/noticelist',
        params: {
          SCHOOL_ID: SCHOOL_ID,
        }
      }).then(function (response) {
        if(response.data){
          _This.noticelistData = response.data;
          _This.noticelistHtml = _This.noticelistData[0].notice;
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
  @import "./index.styl";
</style>
