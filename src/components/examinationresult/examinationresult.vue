<template>
	<div class="tab_box">
		<div class="examinationresultBox">
      <ul>
        <li class="examimages">
          <p>
            <img src="../../assets/icon/exampass.png" alt="">
          </p>
        </li>
        <li class="examfenshu left">
          <p class="left">
            <span>本次得分</span>
            <span class="pass">{{Fangscore}}</span>
          </p>
          <p class="left">
            <span>答对题数</span>
            <span class="pass">{{FangAnswerQuestion}}</span>
          </p>
        </li>
        <li class="comrBtnBox left">
          <button class="comrBtnpass" v-on:click="comrBtnedTo">确 定</button>
        </li>
      </ul>
		</div>

    <loading v-show="FangLoading"></loading>
    <fangerror :fangerroring="fangerroring" :fangerrorText="fangerrorText"></fangerror>
	</div>
</template>

<script>
import {ApiUrl,Islogined,returnId} from '../../../static/js/ApiUrl.js'
import loading from '../common/loading/loading.vue'
import fangerror from '../common/fangerror/fangerror.vue'
export default {
  components: {
    loading,fangerror
  },
  data(){
    return {
      FangLoading:false,//Loading控制，true显示，false不显示
      fangerroring:false,//提示文本弹窗，true显示，false不显示
      fangerrorText:'',//提示文本弹窗内容
      Fangscore:'0',//所得的成绩
      FangAnswerQuestion:'0',//答对的题数
    }
  },
  mounted(){
    Islogined();
    document.title = '考试结果';
    $('.select2-dropdown').remove();
    let _This = this;
    console.log(_This.$route.query.result)//获取url参数
    if(_This.$route.query.result != 0 ){
      $('.examimages img').attr('src',require('../../assets/icon/examnopass.png'));
      $('.examfenshu .pass').addClass('nopass');
      $('.comrBtnpass').addClass('comrBtnnopass');
    }
    let Fangscore = sessionStorage.getItem('Fangscore');
    let FangAnswerQuestion = sessionStorage.getItem('FangAnswerQuestion');
    this.Fangscore = Fangscore;
    this.FangAnswerQuestion = FangAnswerQuestion;

    if(Fangscore == '' || FangAnswerQuestion == '' || Fangscore == null || FangAnswerQuestion == null ){
      this.Fangscore = '0';
      this.FangAnswerQuestion = '0';
    }else {
      this.Fangscore = Fangscore;
      this.FangAnswerQuestion = FangAnswerQuestion;
    }
    // this.testInfor(returnId('userId'))

  },
  methods:{
    comrBtnedTo:function(){
      this.$router.push({path: 'index'});
  //	 			window.location.reload(true);
    },
    // 考试成绩/online/student/testInfor
    testInfor:function (STUDENT_ID,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/student/testInfor',
        params: {
          student_id: STUDENT_ID,
        }
      }).then(function (response) {
        if(response.data){
          // _This.schoolListData = response.data;
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
  @import "./examinationresult.styl";
</style>
