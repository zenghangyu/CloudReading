<template>
	<div class="tab_box">

    <div class="tabContentBox">
      <div class="serachBox left">
        <p class="serachInputBox left"><img src="../../assets/icon/serach.png" alt=""><input type="text" class="serachInput" placeholder="可搜索书名/作者/年份/关键词"></p>
        <p id="BtnSerach" class="right" v-on:click="BtnSerachClick">搜索</p>
      </div>

      <!--搜索内容-->
      <div class="serachContentBox">
        <ul class="ContentListData">
          <li v-if="NameAutorAjaxDataList=='' || NameAutorAjaxDataList == 'null'">
            <p class="SContentData">暂无数据</p>
          </li>
          <li v-for="(AjaxDataList,index) in NameAutorAjaxDataList" v-on:click="searchResultTo(AjaxDataList.BOOK_ID)">
            <img src="../../assets/icon/serach.png" alt="" class="icon_serach">
            <p class="SContentData">{{AjaxDataList.BOOKNAME}}</p>
          </li>
        </ul>
      </div>

      <!--历史搜索-->
      <div class="serachHistroyListBox">
        <p class="HistroyListTitle">历史搜索</p>
        <ul class="HistroyListData">
          <li v-for="(DataList,index) in historyDataList">
            <img src="../../assets/icon/histroy.png" alt="" class="icon_histroy">
            <p class="HistroyData">{{DataList}}</p>
            <p class="closeBox">
              <img src="../../assets/icon/close.png" alt="" class="icon_close">
            </p>
          </li>
<!--          <li>
            <img src="../../assets/icon/histroy.png" alt="" class="icon_histroy">
            <p class="HistroyData">老人123</p>
            <p class="closeBox">
              <img src="../../assets/icon/close.png" alt="" class="icon_close">
            </p>
          </li>-->

        </ul>
      </div>
    </div>

    <meun></meun>
	</div>
</template>

<script>
import Nav from '../common/nav/nav.vue'
import {ApiUrl,Islogined,returnId,uniqueArray} from '../../../static/js/ApiUrl.js'
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
      NameAutorAjaxDataList:[],
      historyDataList:[],//历史搜索记录
    }
  },
  mounted(){
    Islogined();
    document.title = '找书';
    let _This = this;
    let windowH = $(window).height();
    let meunBoxH = $('.meunBox').outerHeight(true);
    let serachBoxH = $('.serachBox').outerHeight(true);
    let HistroyListTitleH = $('.HistroyListTitle').outerHeight(true);
    $('.HistroyListData').height( windowH - meunBoxH - serachBoxH - HistroyListTitleH - 10);
    $('.serachContentBox').height(windowH - meunBoxH - serachBoxH  - 10)
    $('.tabContentBox').height(windowH - meunBoxH);

    var gethistoryItems = localStorage.getItem("historyItems");
    if(gethistoryItems != undefined && gethistoryItems != ''){
      var JSONthistoryItems = JSON.parse(gethistoryItems);
      for (var i=0;i<JSONthistoryItems.length;i++){
        _This.historyDataList.push(JSONthistoryItems[i])
      }
    }

    $('body').on('click','.closeBox',function () {
       // 删除搜索历史记录
      $(this).parents('li').remove();
      let historyItems = [];
      $('.HistroyData').each(function (i,o) {
        historyItems.push($(this).text().trim());
      })
      localStorage.setItem("historyItems",JSON.stringify(uniqueArray(historyItems)));
    }).on('keyup','.serachInput',function () {
      var inputValue = $(this).val().trim();
      if(inputValue.length == 0){
        $('.serachContentBox').hide();
        $('.serachHistroyListBox').show();
      }else{
        /*$('.serachHistroyListBox').hide();
        $('.serachContentBox').show();*/
      }
    }).on('click','.HistroyListData .HistroyData',function () {
      var HistroyData = $(this).text().trim();
      $('.serachInput').val(HistroyData)
      _This.NameAutorAjax(HistroyData,returnId('schoolId'),function (data) {
/*        if(data != ''){
          _This.setHistoryItems($('.serachInput').val().trim())
        }*/
        $('.serachHistroyListBox').hide();
        $('.serachContentBox').show();
      })
    })
  },
  methods:{
    searchResultTo:function (BOOK_ID) {
      this.$router.push({path: 'searchResult?BOOK_ID='+ BOOK_ID});
    },
    // 过滤一个结果的空记录添加，过滤空搜索
    setHistoryItems:function(keyword){
      let historyItems = [];
      keyword = keyword.trim();
      var gethistoryItems = localStorage.getItem("historyItems");
      if(gethistoryItems != undefined && gethistoryItems != ''){
        var JSONthistoryItems = JSON.parse(gethistoryItems);
        for (var i=0;i<JSONthistoryItems.length;i++){
          historyItems.push(JSONthistoryItems[i])
        }
      }
      historyItems.unshift(keyword);
      localStorage.setItem("historyItems",JSON.stringify(uniqueArray(historyItems)));
    },
    BtnSerachClick:function () {
      let _This = this;
      _This.NameAutorAjax($('.serachInput').val().trim(),returnId('schoolId'),function (data) {
        // if(data != ''){
          _This.setHistoryItems($('.serachInput').val().trim())
        // }
          _This.historyDataList.unshift($('.serachInput').val().trim());
          uniqueArray(_This.historyDataList)
        $('.serachHistroyListBox').hide();
        $('.serachContentBox').show();
      })
    },
    /*
    * 书籍搜索
    接口地址: /online/student/NameAutorAjax
    *keywords	true	string		搜索词
    SCHOOL_ID	False	String		学校id
    * */
    NameAutorAjax:function (keywords,SCHOOL_ID,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/student/NameAutorAjax',
        params: {
          keywords:keywords,
          SCHOOL_ID:SCHOOL_ID,
        }
      }).then(function (response) {
        if(response.data){
          _This.NameAutorAjaxDataList = response.data;
          _This.FangLoading = false;
          !!fn && fn(response.data);
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
  @import "./findBook.styl";
</style>
