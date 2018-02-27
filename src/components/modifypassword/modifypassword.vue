<template>
	<div class="tab_box">
    <div class="backBox">
      <p class="close_arrows" v-on:click="GoBackTo">
        <img src="../../assets/icon/close_arrows.png" alt="">
      </p>
    </div>
		<div class="modifyInput">
			<ul>
				<li>
          <p>
            <label class="modifyTile left">旧密码</label>
            <input type="password" placeholder="请填写旧密码" id="oldpassword"/>
					</p>
          </p>
				</li>
				<li>
					<p>
            <label class="modifyTile left">新密码</label>
						<input type="password" placeholder="请填写新密码" id="newpassword"/>
					</p>
				</li>
        <li>
          <p>
            <label class="modifyTile left">确认密码</label>
            <input type="password" placeholder="请再次输入新密码" id="Comripassword"/>
					</p>
				</li>
			</ul>
      <p class="modifyguifan">密码必须至少8个字符，而且同时包含字母和数字</p>
		</div>
		<div class="loginButton">
      <button  class="Btn_login" v-on:click="modifyTo">提 交</button>
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
    loading,fangerror,
  },
  data(){
    return {
      FangLoading:false,//Loading控制，true显示，false不显示
      fangerroring:false,//提示文本弹窗，true显示，false不显示
      fangerrorText:'',//提示文本弹窗内容
    }
  },
  mounted(){
    Islogined();
    document.title = '修改密码';
    $('.select2-dropdown').remove();
    let _This = this;

    $('body').on('click','.close-picker',function () {

    }).on('change','#ChooseSchool',function () {
      var thisVal = $(this).val();
      if(thisVal != ''){

      }
    })

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
    modifyTo:function(){
      let _This = this;
      var oldpassword = $('#oldpassword').val();
      var newpassword = $('#newpassword').val();
      var Comripassword = $('#Comripassword').val();

      if(oldpassword == ''){
        this.fangerroring = true;
        this.fangerrorText = '旧密码不能为空'
        this.setTimeoutError()
      }else if(oldpassword != returnId('userPassW')){
        this.fangerroring = true;
        this.fangerrorText = '旧密码不正确'
        this.setTimeoutError()
      }else if(newpassword == ''){
        this.fangerroring = true;
        this.fangerrorText = '新密码不能为空'
        this.setTimeoutError()
      } else if(newpassword.length <= 5 ){
        this.fangerroring = true;
        this.fangerrorText = '新密码长度不够'
        this.setTimeoutError()
      }else if(newpassword == oldpassword){
        this.fangerroring = true;
        this.fangerrorText = '旧密码和新密码不能一致'
        this.setTimeoutError()
      }else if(Comripassword == ''){
        this.fangerroring = true;
        this.fangerrorText = '确认密码不能为空'
        this.setTimeoutError()
      }else if(Comripassword.length <= 5 ){
        this.fangerroring = true;
        this.fangerrorText = '确认密码长度不够'
        this.setTimeoutError()
      } else if(newpassword != Comripassword){
        this.fangerroring = true;
        this.fangerrorText = '新密码和确认密码不一致'
        this.setTimeoutError()
      }else {
        this.editStudent(returnId('userId'),Comripassword,function (data) {
          _This.$router.push({path: 'login'});
        })
      }
  //	 			window.location.reload(true);
    },
    /*
    * 学生信息修改
    接口地址: /online/student/editStudent
    *
    * */
    /* STUDENT_ID	true	string		学生id
    NAME	False	String		学生名
    PASSWORD	False	String		密码
    PHONE	False	String		手机号
    INTEGRAL	False	String		积分
    TEACHER_ID	False	String		老师id
    SCHOOL_ID	False	String		学校id*/
    editStudent:function (STUDENT_ID,PASSWORD,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/student/editStudent',
        params: {
          STUDENT_ID:STUDENT_ID,
          PASSWORD:PASSWORD,
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
  @import "./modifypassword.styl";
</style>
