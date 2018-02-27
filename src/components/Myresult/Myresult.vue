<template>
	<div class="tab_box">

    <div class="backBox">
      <p class="close_arrows" v-on:click="GoBackTo">
        <img src="../../assets/icon/close_arrows.png" alt="">
      </p>
    </div>

    <div class="tabContentBox">
      <div class="line"></div>
      <div class="MyresultListBox">
        <ul class="MyresultList">

          <li class="ListBoxon" v-for="(DataList,index) in testInforDataList" v-if="DataList.pass == '1'">
            <div class="lineBox">
              <div class="circle"></div>
            </div>

            <div class="rightBox">
              <p class="resultTimes">{{DataList.passdate | formatDate}}</p>

              <ul class="resultListDataBox">
                <li class="ListDataImgage left">
                  <img src="../../assets/My/laoren.jpg" alt="">
                </li>
                <li class="left ListDataContent">
                  <p class="ListDataContentTitle">{{DataList.bookname}}</p>
                  <p>
                    等级：<span>{{DataList.levelName}}</span>
                  </p>
                  <p>
                    得分：<span>{{DataList.score}}</span>
                  </p>
                  <p>
                    积分：<span>{{DataList.INTEGRAL}}</span>
                  </p>
                </li>
                <li class="left IconGreatorCheckBox">
                  <p class="IconGreatorCheck">
                    <img src="../../assets/My/icon_Great.png" alt="">
                  </p>
                </li>
              </ul>
            </div>
          </li>

          <li class="ListBoxon" v-for="(DataList,index) in testInforDataList" v-if="DataList.pass == '0'">
            <div class="lineBox">
              <div class="circle"></div>
            </div>

            <div class="rightBox">
              <p class="resultTimes">{{DataList.passdate | formatDate}}</p>

              <ul class="resultListDataBox">
                <li class="ListDataImgage left">
                  <img src="../../assets/My/laoren.jpg" alt="">
                </li>
                <li class="left ListDataContent">
                  <p class="ListDataContentTitle">{{DataList.bookname}}</p>
                  <p>
                    等级：<span>{{DataList.levelName}}</span>
                  </p>
                  <p>
                    得分：<span>{{DataList.score}}</span>
                  </p>
                  <p>
                    积分：<span>{{DataList.INTEGRAL}}</span>
                  </p>
                </li>
                <li class="left IconGreatorCheckBox">
                  <p class="IconGreatorCheck">
                    <img src="../../assets/My/icon_Check.png" alt="">
                  </p>
                </li>
              </ul>
            </div>
          </li>

        </ul>
      </div>
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
      testInforDataList:[],
    }
  },
  mounted(){
    Islogined()
    document.title = '我的成绩';
    let windowH = $(window).height();
    let backBoxH = $('.backBox').outerHeight(true);
    $('.tabContentBox').height(windowH - backBoxH);
    var tab_box = $('.tab_box').outerHeight(true)

    this.testInfor(returnId('userId'),function () {
      setTimeout(() => {
        if(tab_box > windowH){
          $('.line').height(windowH - backBoxH)
        }else {
          $('.line').height($('.MyresultListBox').height())
        }
      }, 50)
    })

  },
  methods:{
    GoBackTo:function () {
      this.$router.go(-1);
    },
    /*
    * 学生考试书籍列表
请求类型: HTTP
接口地址: /online/student/testInfor
student_id	true	string		学生id
    * */
    testInfor:function (student_id,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/student/testInfor',
        params: {
          student_id: student_id,
        }
      }).then(function (response) {
        if(response.data){
          _This.testInforDataList = response.data;
          _This.FangLoading = false;
          // alert($('#app').height())
          // $('.line').height($('#app').height())
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
  @import "./Myresult.styl";
</style>
