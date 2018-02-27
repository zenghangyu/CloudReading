<template>
	<div class="tab_box">
    <div class="tabContentBox">

      <div class="portraitBox">
        <div class="portrait">
          <button id="upload2">
            <img :src="head_images" alt="" id='img1' >
            <form enctype="multipart/form-data">
               <input type="file" class="file" style="opacity: 0;" accept="image/gif, image/jpeg,image/png" v-on:change="editStudentHead($event)">
            </form>
          </button>
          <span>{{getStudentinforData.NAME}}</span>
        </div>
      </div>

      <div class="MylistBox">
        <ul class="Mylist">
          <li v-on:click="MyspaceTo">
            <img src="../../assets/icon/Myspace.png" alt="" class="Myspace">
            <p>我的空间</p>
            <img src="../../assets/icon/arrows.png" alt="" class="ListArrows">
          </li>
          <li v-on:click="MyresultTo">
            <img src="../../assets/icon/Myresult.png" alt="" class="Myresult">
            <p>我的成绩</p>
            <img src="../../assets/icon/arrows.png" alt="" class="ListArrows">
          </li>
          <li v-on:click="MymodifyPasswordTo">
            <img src="../../assets/icon/MymodifyPassword.png" alt="" class="MymodifyPassword">
            <p>修改密码</p>
            <img src="../../assets/icon/arrows.png" alt="" class="ListArrows">
          </li>
        </ul>
      </div>

    </div>

    <div class="BtnTuichuBox" v-on:click="BtnTuichuDaBoxShow">
      退出
    </div>

    <!--退出提示弹窗-->
    <div class="BtnTuichuDaBox" v-show="BtnTuichuDaBox">
      <div class="BtnTuichuDa">
        <ul>
          <li class="left">
            <p class="BtnTuichuVBox">
              确定退出登录?
            </p>
          </li>
          <li class="CBtnBox left">
            <p class="left" v-on:click="BtnTuichuDaBoxHide">取 消</p>
            <p class="right" v-on:click="BtnTuichuTo">确 定</p>
          </li>
        </ul>
      </div>
    </div>

    <!--头像截图-->
    <!--<section class="head_portrait">
      <div class="lazy_tip" id="lazy_tip"><span>1%</span><br>载入中......</div>
      <div class="lazy_cover"></div>
      <div class="resource_lazy hide"></div>
      <div class="pic_edit">
        <div class="clearfix hd">
          <span class="fh"></span>
          <span id="remove">关闭</span>
          <span id="clipBtn">下一步</span>
        </div>
        <div id="clipArea">

        </div>
        <input type="file" id="file" style="opacity: 0;">
        <div id="plan" style="display:none"><canvas id="myCanvas"></canvas></div>
      </div>
      <img src="" fileName="" id="hit" style="display:none;z-index: 9">

      <div id="cover"></div>
    </section>-->

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
      BtnTuichuDaBox:false,
      getStudentinforData:[],
      head_imagesUrl:ApiUrl() + '/uploadFiles/uploadImgs/mobile/student/head_images/',
      head_images:'',
    }
  },
  mounted(){
    Islogined();
    let  _This = this;
    document.title = '我的';
    let windowH = $(window).height();
    let meunBoxH = $('.meunBox').outerHeight(true);
    $('.tabContentBox').height(windowH - meunBoxH);
    this.getStudentinfor(returnId('userId'));
  },
  methods:{
    MyspaceTo:function () {
      this.$router.push({path: 'Myspace'});
    },
    MyresultTo:function () {
      this.$router.push({path: 'Myresult'});
    },
    MymodifyPasswordTo:function () {
      this.$router.push({path: 'modifypassword'});
    },
    BtnTuichuTo:function () {
      localStorage.FangschoolId = '';
      localStorage.FangteacherId = '';
      localStorage.FanguserId = '';
      localStorage.FanguserPassW ='';
      localStorage.FanguserName ='';
      this.BtnTuichuDaBoxHide();
      this.$router.push({path: 'login'});
    },
    BtnTuichuDaBoxShow:function () {
      this.BtnTuichuDaBox = true;
    },
    BtnTuichuDaBoxHide:function () {
      this.BtnTuichuDaBox = false;
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
          if(response.data.HEADIMAGE == ' ' || response.data.HEADIMAGE == '' || response.data.HEADIMAGE == null || response.data.HEADIMAGE == undefined){
            _This.head_images = require('../../assets/My/portrait.jpg');
          }else {
             _This.head_images = _This.head_imagesUrl + response.data.HEADIMAGE;
          }
          _This.getStudentinforData = response.data;
          _This.FangLoading = false;
          !!fn && fn();
        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
    /*
    * 学生头像修改
    接口地址: /online/student/editStudentHead
    STUDENT_ID	true	string		学生id
    file	False	File		头像图片
    * */
    editStudentHead(event) {
      this.file = event.target.files[0];
      console.log(this.file);
      event.preventDefault();
      let formData = new FormData();
      formData.append('STUDENT_ID', returnId('userId'));
      formData.append('file', this.file);
      let config = {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
       let _This = this;
      _This.FangLoading = true;

      this.axios.post(ApiUrl() + '/online/student/editStudentHead', formData, config).then(function (res) {
        _This.FangLoading = false;
        window.location.reload(true);
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
  @import "./My.styl";
</style>
