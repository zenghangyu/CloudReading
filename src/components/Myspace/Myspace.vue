<template>
	<div class="tab_box">
    <div class="backBox">
      <p class="close_arrows" v-on:click="GoBackTo">
        <img src="../../assets/icon/close_arrows.png" alt="">
      </p>
    </div>
    <div class="tabContentBox">

      <div class="MyspaceGradeBox">
        <div class="MyspaceGrade">
          <p class="Grade">
            <img src="../../assets/My/MyspaceGrade1.png" alt="" >
          </p>
          <ul>
            <li class="left">
              <p class="SresultNumber">{{getStudentinforData.INTEGRAL}}</p>
              <p class="SresultTitle">阅读积分</p>
            </li>
            <li class="left">
              <p class="SresultNumber">{{getStudentinforData.LEVELNAME}}</p>
              <p class="SresultTitle">阅读级别</p>
            </li>
          </ul>
        </div>
      </div>

      <div class="MyspacelistBox">
        <ul class="Myspacelist">
          <li>
            <p class="left">我的姓名</p>
            <span class="right">{{getStudentinforData.NAME}}</span>
          </li>
          <li v-on:click="modifyPhoneShow">
            <p class="left">我的手机</p>
            <span class="right PHONEData">{{getStudentinforData.PHONE}}</span>
            <img src="../../assets/icon/arrows.png" alt="" class="ListArrows">
          </li>
          <li v-on:click="modifySchoolShow">
            <p class="left">我的学校</p>
            <span class="right SCHOOLData">{{getStudentinforData.PROVINCES_NAME + getStudentinforData.CITY_NAME + getStudentinforData.DISTRICT_NAME + getStudentinforData.SCHOOL_NAME}}</span>
            <img src="../../assets/icon/arrows.png" alt="" class="ListArrows">
          </li>
          <li v-on:click="modifySchoolShow">
            <p class="left">我的老师</p>
            <span class="right TEACHERData">{{getStudentinforData.TEACHERNAME}}</span>
            <img src="../../assets/icon/arrows.png" alt="" class="ListArrows">
          </li>
        </ul>
      </div>

    </div>

    <!--修改手机号-->
    <div class="modifyPhoneBox" v-show="modifyPhoneBox">
      <div class="modifyPhone">
        <ul>
          <li class="left">
            <p class="PhoneInputVBox">
              <img src="../../assets/icon/phone.png" alt="">
              <input type="text" class="PhoneInputV" maxlength="11" placeholder="请输入手机号码">
            </p>
          </li>
          <li class="CBtnBox left">
            <p class="left" v-on:click="modifyPhoneHide">取 消</p>
            <p class="right" v-on:click="editStudentPHONE">确 定</p>
          </li>
        </ul>
      </div>
    </div>

    <!--修改学校-->
    <div class="modifySchoolBox" v-show="modifySchoolBox">
      <div class="modifySchool">
        <ul>
          <li class="left">
            <p class="left">
              <label class="modifySchoolTile left">选择地区</label>
              <input type="text" placeholder="地区信息" class="left" id="city-picker" readonly />
            </p>
				  </li>
          <li class="modifySchoolList left">
            <p class="SchoolInputVBox left">
              <select name="" class="SchoolInputV left">
                <option value="">请选择学校</option>
                <option v-for="(ListData,index) in schoolListData" :value=ListData.SCHOOL_ID>{{ListData.SCHOOL_NAME}}</option>
              </select>
            </p>
          </li>
          <li class="modifyTeacherList left">
            <p class="TeacherInputVBox left">
              <select name="" class="TeacherInputV left">
                <option value="">请选择老师</option>
                <option v-for="(ListData,index) in teacherListData" :value=ListData.USER_ID v-if="schoolListData != ''">{{ListData.NAME}}</option>
              </select>
            </p>
          </li>
          <li class="CBtnBox left">
            <p class="left" v-on:click="modifySchoolHide">取 消</p>
            <p class="right" v-on:click="editStudentSCHOOLAndTEACHER">确 定</p>
          </li>
        </ul>
      </div>
    </div>

    <!--修改老师-->
<!--    <div class="modifyTeacherBox" v-show="modifyTeacherBox">
      <div class="modifyTeacher">
        <ul>
          <li class="modifyTeacherList left">
            <p class="TeacherInputVBox left">
              <select name="" class="TeacherInputV left">
                <option value="">请选择老师</option>
              </select>
            </p>
          </li>
          <li class="CBtnBox left">
            <p class="left" v-on:click="modifyTeacherHide">取 消</p>
            <p class="right" v-on:click="modifyTeacherHide">确 定</p>
          </li>
        </ul>
      </div>
    </div>-->

    <loading v-show="FangLoading"></loading>
    <fangerror :fangerroring="fangerroring" :fangerrorText="fangerrorText"></fangerror>
	</div>
</template>

<script>
require("../../../static/js/lib/select2/js/select2.min");
require("../../../static/js/lib/city/js/jquery-weui.min");
require("../../../static/js/lib/city/js/city-picker.min");
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
      modifyPhoneBox:false,//修改手机号弹窗控制，true显示，false不显示
      modifySchoolBox:false,//修改学校弹窗控制，true显示，false不显示
      // modifyTeacherBox:false,//修改老师弹窗控制，true显示，false不显示
      getStudentinforData:[],
      schoolListData:[],
      teacherListData:[],
    }
  },
  mounted(){
    Islogined();
    let _This = this;
    document.title = '我的空间';
    $('.select2-dropdown').remove();
    $('.SchoolInputV,.TeacherInputV').select2();
    this.getStudentinfor(returnId('userId'));
    $('body').on('click','.close-picker',function () {
      var districtId = $('.picker-modal-inner .col-district .picker-item.picker-selected').attr('data-picker-value');
      _This.schoolList(districtId,function () {

      })
    }).on('change','.SchoolInputV',function () {
      var thisVal = $(this).val();
      if(thisVal != ''){
        _This.teacherList(thisVal)
      }
    })
   /* $("#city-picker").cityPicker({

    });*/
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
    // 修改手机号弹窗
    modifyPhoneShow:function () {
      this.modifyPhoneBox = true;
      $('.PhoneInputV').val('');
    },
    modifyPhoneHide:function () {
      this.modifyPhoneBox = false;
    },
    // 修改学校弹窗
    modifySchoolShow:function () {
      this.modifySchoolBox = true;
      $("#city-picker").cityPicker({

      });
    },
    modifySchoolHide:function () {
      this.modifySchoolBox = false;
    },
    // 修改老师弹窗
   /* modifyTeacherShow:function () {
      this.modifyTeacherBox = true;
    },
    modifyTeacherHide:function () {
      this.modifyTeacherBox = false;
    },*/
    MymodifyPasswordTo:function () {
      this.$router.push({path: 'modifypassword'});
    },
    //学生信息获取
    getStudentinfor:function (STUDENT_ID,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/student/getStudentinfor',
        params: {
          STUDENT_ID:STUDENT_ID,
        }
      }).then(function (response) {
        if(response.data){
          _This.getStudentinforData = response.data;
          _This.FangLoading = false;
          !!fn && fn();
        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
    //学生信息修改/online/student/editStudent
   /* STUDENT_ID	true	string		学生id
    NAME	False	String		学生名
    PASSWORD	False	String		密码
    PHONE	False	String		手机号
    INTEGRAL	False	String		积分
    TEACHER_ID	False	String		老师id
    SCHOOL_ID	False	String		学校id*/
    editStudent:function (STUDENT_ID,NAME,PASSWORD,PHONE,INTEGRAL,TEACHER_ID,SCHOOL_ID,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/student/editStudent',
        params: {
          STUDENT_ID:STUDENT_ID,
          NAME:NAME,
          PASSWORD:PASSWORD,
          PHONE:PHONE,
          INTEGRAL:INTEGRAL,
          TEACHER_ID:TEACHER_ID,
          SCHOOL_ID:SCHOOL_ID,
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
    editStudentPHONE:function () {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/student/editStudent',
        params: {
          STUDENT_ID:returnId('userId'),
          PHONE:$('.PhoneInputV').val().trim(),
        }
      }).then(function (response) {
        if(response.data){
          // _This.schoolListData = response.data;
          _This.FangLoading = false;
          if(response.data.result == '1'){
            $('.PHONEData').text($('.PhoneInputV').val().trim());
            _This.fangerroring = true;
            _This.fangerrorText = '修改成功'
            _This.setTimeoutError();
            _This.modifyPhoneBox = false;
          }else {
            _This.fangerroring = true;
            _This.fangerrorText = '修改失败'
            _This.setTimeoutError()
          }
        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
    //获取学校列表
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
    //获取老师列表
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
    editStudentSCHOOLAndTEACHER:function () {
      let _This = this;
      var citypicker = $.trim($('#city-picker').val());//选择地区
      var ChooseSchool = $('.SchoolInputV').val();//学校
      var ChooseTeacher = $('.TeacherInputV').val();//老师
      if(citypicker == '' ){
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
      }else {
        _This.FangLoading = true;
        this.axios({
          method: 'post',
          url: ApiUrl() + '/online/student/editStudent',
          params: {
            STUDENT_ID:returnId('userId'),
            TEACHER_ID:$('.TeacherInputV').val(),
            SCHOOL_ID:$('.SchoolInputV').val(),
          }
        }).then(function (response) {
          if(response.data){
            // _This.schoolListData = response.data;
            _This.FangLoading = false;
             _This.FangLoading = false;
            if(response.data.result == '1'){
              $('.SCHOOLData').text($('#city-picker').val().replace(/\s/g,"") + $('.SchoolInputV option:selected').text().trim());
              $('.TEACHERData').text($('.TeacherInputV option:selected').text().trim());
              _This.fangerroring = true;
              _This.fangerrorText = '修改成功'
              _This.setTimeoutError();
              _This.modifySchoolBox = false;
            }else {
              _This.fangerroring = true;
              _This.fangerrorText = '修改失败'
              _This.setTimeoutError()
            }
            // !!fn && fn();
          }
        }).catch(function (error) {
          console.log(error);
          _This.FangLoading = false;
        });
      }
    },

  }
}

</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/meta.styl";
  @import "../../../static/js/lib/select2/css/select2.styl";
  @import "../../../static/js/lib/city/css/jquery-weui.styl";
  @import "./Myspace.styl";
</style>
