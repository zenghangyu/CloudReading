<template>
	<div class="tab_box">

    <div class="backBox">
      <p class="close_arrows" v-on:click="GoBackTo">
        <img src="../../assets/icon/close_arrows.png" alt="">
      </p>
    </div>

    <div class="megessListBox">
      <ul class="megessList">
        <li v-for="(DataList,index) in noticelistDataList">
          <p class="megessTitle left">[公告]</p>
          <p class="megessContent left">{{DataList.notice}}</p>
          <p class="megessTime right">{{DataList.notice_updatetime.substring(0,16)}}</p>
        </li>
        <!--<li>
          <p class="megessTitle left">[公告]</p>
          <p class="megessContent left">本书库新增书本《钢铁是怎样炼本书库新增书本《钢铁是怎样炼本书库新增书本《钢铁是怎样炼....</p>
          <p class="megessTime right">15:58</p>
        </li>
        <li>
          <p class="megessTitle left">[公告]</p>
          <p class="megessContent left">本书库新增书本《钢铁是怎样炼本书库新增书本《钢铁是怎样炼本书库新增书本《钢铁是怎样炼....</p>
          <p class="megessTime right">15:58</p>
        </li>
        <li>
          <p class="megessTitle left">[公告]</p>
          <p class="megessContent left">本书库新增书本《钢铁是怎样炼本书库新增书本《钢铁是怎样炼本书库新增书本《钢铁是怎样炼....</p>
          <p class="megessTime right">15:58</p>
        </li>-->
      </ul>
    </div>

    <loading v-show="FangLoading"></loading>
    <fangerror :fangerroring="fangerroring" :fangerrorText="fangerrorText"></fangerror>
	</div>
</template>

<script>
import {ApiUrl,Islogined,returnId,formatDate} from '../../../static/js/ApiUrl.js'
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
      noticelistDataList:[],
    }
  },
  mounted(){
    Islogined();
    document.title = '公告';
    let windowH = $(window).height();
    let backBoxH = $('.backBox').outerHeight(true);
    $('.megessListBox').height(windowH - backBoxH);
    this.noticelist(returnId('schoolId'))
  },
  methods:{
    GoBackTo:function () {
      this.$router.go(-1);
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
          _This.noticelistDataList = response.data;
          _This.FangLoading = false;
          !!fn && fn();
        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
  },
  filters: {
    formatDate(time) {
      var date = new Date(time);
      return formatDate(date, "yyyy-MM-dd hh:mm");
    }
  },
}

</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/meta.styl";
  @import "./megessList.styl";
</style>
