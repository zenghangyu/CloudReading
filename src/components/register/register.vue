<template>
	<div class="tab_box">
		<div class="registerInput">
      <div class="backBox">
        <p class="close_arrows" v-on:click="GoBackTo">
          <img src="../../assets/icon/close_arrows.png" alt="">
        </p>
      </div>
			<ul>
				<li>
					<p>
            <label class="registerTile left">手机号码</label>
            <input type="number" placeholder="请输入手机号码" class="phoneinput left" oninput="if(value.length>11)value=value.slice(0,11)" />
          </p>
				</li>
				<li>
					<p>
            <label class="registerTile left">密码</label>
						<input type="password" placeholder="请输入密码" class="passwordinput" />
					</p>
				</li>
        <li>
					<p>
            <label class="registerTile left">姓名</label>
            <input type="text" placeholder="请输入姓名" class="left nameinput" maxlength="10" />
          </p>
				</li>
        <li>
					<p>
            <label class="registerTile left">性别</label>
            <label class="wordtit left radioBox"><span class="radio on left" data-sex="1"></span>男</label>
            <label class="wordtit left ctrl_size radioBox"><span class="radio left" data-sex="0"></span>女</label>
          </p>
				</li>
        <li>
					<p>
            <label class="registerTile left">选择地区</label>
            <input type="text" placeholder="地区信息" class="left" id="city-picker" readonly />
          </p>
				</li>
        <li>
					<p>
            <label class="registerTile left">选择学校</label>
            <select name="" id="ChooseSchool" class="left">
              <option value="">选择学校</option>
              <option v-for="(ListData,index) in schoolListData" :value=ListData.SCHOOL_ID>{{ListData.SCHOOL_NAME}}</option>
            </select>
          </p>
				</li>
        <li>
					<p>
            <label class="registerTile left">选择老师</label>
            <select name="" id="ChooseTeacher" class="left" >
              <option value="">选择老师</option>
              <option v-for="(ListData,index) in teacherListData" :value=ListData.USER_ID v-if="schoolListData != ''">{{ListData.NAME}}</option>
            </select>
          </p>
				</li>
			</ul>
		</div>
		<div class="loginButton">
      <button v-on:click="registerTo" class="Btn_login">注 册</button>
		</div>

    <loading v-show="FangLoading"></loading>
    <fangerror :fangerroring="fangerroring" :fangerrorText="fangerrorText"></fangerror>
	</div>
</template>

<script>
require("../../../static/js/lib/select2/js/select2.min");
require("../../../static/js/lib/city/js/jquery-weui.min");
require("../../../static/js/lib/city/js/city-picker.min");
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
      schoolListData:[],
      teacherListData:[],
    }
  },
  mounted(){
    document.title = '注册';
    $('.select2-dropdown').remove();
    let _This = this;
    $('#ChooseSchool,#ChooseTeacher').select2();
    $('body').on('click','.radioBox',function () {
      $('.radioBox').find('span.radio').removeClass('on');
      $(this).find('span.radio').addClass('on');
    })
    $("#city-picker").cityPicker({
      // title: "选择省市区/县",
      /*onChange: function (picker, values, displayValues) {
          // console.log(values, displayValues);
      }*/
    });
    $('body').on('click','.close-picker',function () {
      var districtId = $('.picker-modal-inner .col-district .picker-item.picker-selected').attr('data-picker-value');
      _This.schoolList(districtId,function () {

      })
    }).on('change','#ChooseSchool',function () {
      var thisVal = $(this).val();
      if(thisVal != ''){
        _This.teacherList(thisVal)
      }
    }).on('keydown','.phoneinput',function () {
        // alert($(this).val())
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
      this.$router.push({path: 'login'});
    },
    registerTo:function(){
      var myreg=/^[1][3,4,5,7,8][0-9]{9}$/;
      var phoneinput = $.trim($('.phoneinput').val());//手机号码
      var passwordinput = $.trim($('.passwordinput').val());//密码
      var nameinput = $.trim($('.nameinput').val());//姓名
      var registerSex = $.trim($('.radioBox .radio.on ').data('sex'));
      var citypicker = $.trim($('#city-picker').val());//选择地区
      var ChooseSchool = $('#ChooseSchool').val();//学校
      var ChooseTeacher = $('#ChooseTeacher').val();//老师

      if(phoneinput == ''){
        this.fangerroring = true;
        this.fangerrorText = '手机号码不能为空'
        this.setTimeoutError()
      }else if(phoneinput.length < 11 || !myreg.test(phoneinput)){
        this.fangerroring = true;
        this.fangerrorText = '请输入正确的手机号码'
        this.setTimeoutError()
      }else if(passwordinput == ''){
        this.fangerroring = true;
        this.fangerrorText = '密码不能为空'
        this.setTimeoutError()
      }else if(passwordinput.length < 5 ){
        this.fangerroring = true;
        this.fangerrorText = '密码长度不够'
        this.setTimeoutError()
      }else if(nameinput == '' ){
        this.fangerroring = true;
        this.fangerrorText = '姓名不能为空'
        this.setTimeoutError()
      }else if(citypicker == '' ){
        this.fangerroring = true;
        this.fangerrorText = '请选择地区'
        this.setTimeoutError()
      }else if(ChooseSchool == '' ){
        this.fangerroring = true;
        this.fangerrorText = '请选择学校'
        this.setTimeoutError()
      }else if(ChooseTeacher == '' ){
        this.fangerroring = true;
        this.fangerrorText = '请选择老师'
        this.setTimeoutError()
      }
      else {
        this.checkPhoneAndregister(phoneinput,passwordinput,nameinput,registerSex,'0','0',ChooseSchool,ChooseTeacher)
      }
    },
    checkPhoneAndregister:function (PHONE,PASSWORD,NAME,SEX,INTEGRAL,STATUS,SCHOOL_ID,TEACHER_ID,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/login/checkPhone',
        params: {
          PHONE: PHONE
        }
      }).then(function (response) {
        if(response.data){
          _This.FangLoading = false;
          if(response.data.result == 0){
            _This.FangLoading = true;
            _This.axios({
            method: 'post',
            url: ApiUrl() + '/online/login/register',
            params: {
              PHONE: PHONE,
              PASSWORD:PASSWORD,
              NAME:NAME,
              SEX:SEX,
              INTEGRAL:INTEGRAL,
              STATUS:STATUS,
              SCHOOL_ID:SCHOOL_ID,
              TEACHER_ID:TEACHER_ID,
            }
          }).then(function (response) {
            if(response.data){
              _This.FangLoading = false;
              _This.$router.push({path: 'login'});
            }
          }).catch(function (error) {
            console.log(error);
            _This.FangLoading = false;
          });
          }
          !!fn && fn();
        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
    schoolList:function (districtid,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'get',
        url: ApiUrl() + '/online/student/schoolList',
        params: {
          DISTRICT: districtid
        }
      }).then(function (response) {
        if(response.data){
          _This.schoolListData = response.data;
          _This.FangLoading = false;
          !!fn && fn();
        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
    teacherList:function (SCHOOL_ID,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'get',
        url: ApiUrl() + '/online/student/teacherList',
        params: {
          SCHOOL_ID: SCHOOL_ID
        }
      }).then(function (response) {
        if(response.data){
          _This.teacherListData = response.data;
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
  @import "../../../static/js/lib/select2/css/select2.styl";
  @import "../../../static/js/lib/city/css/jquery-weui.styl";
  @import "./register.styl";
</style>
