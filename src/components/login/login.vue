<template>
	<div class="tab_box">
		<div class="loginBox">
      <ul>
        <!--<li><a href="javascript:;">姓名登录</a></li>-->
        <li><a href="javascript:;" class="onActive">手机号登录</a></li>
      </ul>
		</div>
		<div class="loginInput">
			<ul>
				<li>
					<p>
            <img src="../../assets/icon/phone.png" alt="">
            <input type="text" placeholder="请输入手机号码" class="LoginPhone"/>
          </p>
				</li>
				<li>
					<p>
            <img src="../../assets/icon/password.png" alt="">
						<input type="password" placeholder="请输入密码" class="LoginPassWord"/>
					</p>
				</li>
			</ul>
		</div>
		<div class="loginButton">
			<button v-on:click="loginTo" class="Btn_login">登 录</button>
      <button v-on:click="registerTo" class="Btn_register">注 册</button>
		</div>

    <loading v-show="FangLoading"></loading>
    <fangerror :fangerroring="fangerroring" :fangerrorText="fangerrorText"></fangerror>

	</div>
</template>

<script>
import {ApiUrl} from '../../../static/js/ApiUrl.js'
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
    }
  },
  mounted(){
    document.title = '手机号登录'
    $('.select2-dropdown').remove();
    let _This = this;
  },
  methods:{
    setTimeoutError:function () {
       setTimeout(() => {
        $('.Fang_errorBox').hide()
        this.fangerroring = false
       }, 2000)
    },
    loginTo:function(){
      let _This = this;
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      var LoginPhone = $('.LoginPhone').val();
      var LoginPassWord = $('.LoginPassWord').val();

      if(LoginPhone == ''){
        this.fangerroring = true;
        this.fangerrorText = '手机号码不能为空'
        this.setTimeoutError()
      }else if(LoginPhone.length < 11 || !myreg.test(LoginPhone)){
        this.fangerroring = true;
        this.fangerrorText = '请输入正确的手机号码'
        this.setTimeoutError()
      }else if(LoginPassWord == ''){
        this.fangerroring = true;
        this.fangerrorText = '密码不能为空'
        this.setTimeoutError()
      }else if(LoginPassWord.length < 5 ){
        this.fangerroring = true;
        this.fangerrorText = '密码长度不够'
        this.setTimeoutError()
      }else {
        this.loginAPIData(LoginPhone,LoginPassWord,function (data) {
          localStorage.setItem('FangschoolId',data.appUser.schoolId)
          localStorage.setItem('FangteacherId',data.appUser.teacherId)
          localStorage.setItem('FanguserId',data.appUser.userId)
          localStorage.setItem('FanguserName',data.appUser.name)
          localStorage.setItem('FanguserPassW',$('.LoginPassWord').val())
          // console.log(data)
          _This.$router.push({path: 'index'});
        })
      }
      // this.$router.push({path: 'index'});
//	 			window.location.reload(true);
    },
    loginAPIData:function(loginAccount,loginPws,fn){
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/login/login',
        params: {
          loginAccount: loginAccount,
          loginPws:loginPws
        }
      }).then(function (response) {
        if(response.data){
          _This.FangLoading = false;
          if(response.data.loginResult != 0){
            !!fn && fn(response.data);
          }else {
            _This.fangerroring = true;
            _This.fangerrorText = '登录失败'
            _This.setTimeoutError()
          }

        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
    registerTo:function(){
      this.$router.push({path: 'register'});
//	 			window.location.reload(true);
    },
  }
 }

</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/meta.styl";
  @import "./login.styl";
</style>
