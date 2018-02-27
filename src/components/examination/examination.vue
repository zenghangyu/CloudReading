<template>
	<div class="tab_box">

    <div class="examinationHeader">
      <p class="close_arrows left" v-on:click="GoBackTo">
        <img src="../../assets/icon/close_arrows.png" alt="">
      </p>
      <p class="chooseTimu left">已选 <span class="choosedNum">{{ChoosedQuestion}}</span>/<span class="ExamTotles">{{questionCountData}}</span></p>
      <p class="chengjiNum left"><span class="ExamName">{{userName}} </span><span class="ExaminationGrade">一级</span>
        <!--<span class="ExaminationMark">{{scoreNumber}}</span>分-->
      </p>
    </div>

    <div class="TestQuestionsBoxBig">
      <div class="TestQuestionsBox" v-if="questionCountDataShowBox">

        <!--判断题-->
        <div class="TestQuestionsListBox">

          <div v-for="(questionList,index) in questionDataList" :class="{ 'PanduanChooseBox': questionList.question_type == 1, 'DanChooseBox': questionList.question_type == 2,'DuoChooseBox': questionList.question_type == 3}">
            <p class="TestQuestionsTit" :data-questionid="questionList.question_id">
              <span class="TestQuestionsTNum left">{{parseInt(indexData) + parseInt(1)}}. </span>
              <span class="TestQuestionsText left">{{questionList.question_content}}</span>
            </p>
            <ul class="QuestionsChooseList">
              <li v-for="(answerList,indexs) in questionList.answer":data-index="indexs" :data-answerId="answerList.answerId" v-if="answerList.answer != ''" v-on:click="DuoChooseBoxClick($event)">
                <p class="ChooseSorf left">{{questionChooseListWord[indexs]}}</p>
                <p class="ChooseTitle left">{{answerList.answer}}</p>
              </li>
            </ul>
          </div>

        </div>

        <!--单选题-->
        <!--<div class="DanChooseBox" v-if="questionDataList[indexData].question_type==2">
          <p class="TestQuestionsTit" :data-questionid="questionDataList[indexData].question_id">
            <span class="TestQuestionsTNum left">{{parseInt(indexData) + parseInt(1)}}. </span>
            <span class="TestQuestionsText left">{{questionDataList[indexData].question_content}}</span>
          </p>
          <ul class="QuestionsChooseList" v-bind:class="WatchisOnActiveChoosed(indexData)">
            <li v-for="(answerList,index) in answerListData" :data-index="index" :data-answerId="answerList.answerId" v-if="answerList.answer != ''">
              <p class="ChooseSorf left">{{questionChooseListWord[index]}}</p>
              <p class="ChooseTitle left">{{answerList.answer}}</p>
            </li>
          </ul>
        </div>-->

        <!--多选题-->
        <!--<div class="DuoChooseBox" v-if="questionDataList[indexData].question_type==3">
          <p class="TestQuestionsTit" :data-questionid="questionDataList[indexData].question_id">
            <span class="TestQuestionsTNum left">{{parseInt(indexData) + parseInt(1)}}. </span>
            <span class="TestQuestionsText left">{{questionDataList[indexData].question_content}}</span>
          </p>
          <ul class="QuestionsChooseList" v-bind:class="WatchisOnActiveChoosed(indexData)">
            <li v-for="(answerList,index) in answerListData" :data-index="index" :data-answerId="answerList.answerId" v-if="answerList.answer != ''" v-on:click="DuoChooseBoxClick(index)">
              <p class="ChooseSorf left">{{questionChooseListWord[index]}}</p>
              <p class="ChooseTitle left">{{answerList.answer}}</p>
            </li>
          </ul>
        </div>-->

        <div class="BtnQuestionsBox">
          <p class="BtnQuestionsPrev BtnQuestionsNullclick left" v-if="indexData==0">上一题</p>
          <p class="BtnQuestionsPrev left BtnPrevQuestionsclick" v-if="indexData>0" v-on:click="BtnQuestionsPrevTo(parseInt(indexData) - parseInt(1))">上一题</p>
          <p class="BtnQuestionsNext right BtnNextQuestionsclick" v-on:click="BtnQuestionsNextTo(parseInt(indexData) + parseInt(1),$event)" v-if="parseInt(indexData) + parseInt(1) < questionDataList.length">下一题</p>
          <p class="BtnQuestionsNext right" v-on:click="examinationresultTo(parseInt(indexData),$event)" v-if="parseInt(indexData) + parseInt(1) == questionDataList.length">提交</p>
        </div>
      </div>
    </div>

    <loading v-show="FangLoading"></loading>
    <fangerror :fangerroring="fangerroring" :fangerrorText="fangerrorText"></fangerror>

	</div>
</template>

<script>
import {ApiUrl,Islogined,returnId,objLength} from '../../../static/js/ApiUrl.js'
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
      userName:'',
      questionCountDataShowBox:false,
      isOnActiveChoosed:false,
      questionDataList:[],
      answerListData:[],
      questionCountData:'0',//总题目数统计器
      indexData:'0',
      questionChooseListWord:['A','B','C','D','E','F','G','H','I','J'],//选项序号
      scoreTotle:'100',//总分
      scoreNumber:'0',//成绩统计器
      AnswerQuestion:'0',//答对题数
      ChoosedQuestion:'0',//已选题数
      saveTestListData:[],//答案list
    }
  },
  mounted(){
    Islogined();
    let _This = this;
    this.userName = returnId('userName');
    document.title = returnId('BookName') + '在线考试';
    $('.select2-dropdown').remove();
    let windowH = $(window).height();
    let examinationHeaderH = $('.examinationHeader').outerHeight(true);
    $('.TestQuestionsBoxBig').height(windowH - examinationHeaderH)

    let BOOK_ID = this.$route.query.BOOK_ID;
    this.testQuestion(BOOK_ID,function () {
      _This.EveryanswerData(0);
      setTimeout(() => {
        $('.TestQuestionsListBox div').eq(0).css('display','block');
       }, 50)
    })
  },
  methods:{
    setTimeoutError:function (fn) {
       setTimeout(() => {
        $('.Fang_errorBox').hide()
        this.fangerroring = false;
        !!fn && fn();
       }, 1500)
    },
    // 多选题选择、单选和判断题选择
    DuoChooseBoxClick:function (event) {
      // console.log(event.currentTarget)
      var el = event.currentTarget;
      var ChooseBoxClass = $(el).parents('.QuestionsChooseList').parents('div').attr('class')
      if(ChooseBoxClass == 'DuoChooseBox'){
        $(el).toggleClass('OnActiveChoosed');
      }else {
        $(el).addClass('OnActiveChoosed');
        $(el).siblings('li').removeClass('OnActiveChoosed');
      }
    },
    GoBackTo:function () {
      this.$router.go(-1);
    },
    //下一题
   BtnQuestionsNextTo:function (NextIndex,event) {
      let _This = this;
      var el = event.currentTarget;
      var ChoosedDivBlock = $(el).parents('.BtnQuestionsBox').siblings('.TestQuestionsListBox').children('div').eq(parseInt(NextIndex) - 1);
      var OnActiveChoosedanswerid = ChoosedDivBlock.children('.QuestionsChooseList').children('.OnActiveChoosed[data-answerid]')
      let QuestionsChooseList = ChoosedDivBlock.children('.QuestionsChooseList').children('li');
      let answeridStr = '';
      OnActiveChoosedanswerid.each(function (i,o) {
        // console.log($(this).attr('data-answerid'))
        answeridStr += $(this).attr('data-answerid') + ','
      })
      if(QuestionsChooseList.hasClass('OnActiveChoosed')){
        this.saveTestListDataArrayFn(ChoosedDivBlock.children('.TestQuestionsTit').attr('data-questionid'),answeridStr.substring(0,answeridStr.length-1))
      }else {
        this.saveTestListDataArrayFn($('.TestQuestionsTit').attr('data-questionid'),'')
      }

      _This.EveryanswerData(NextIndex);
      $('.TestQuestionsListBox div').css('display','none');
      $('.TestQuestionsListBox div').eq(NextIndex).css('display','block');

   },
    // 上一题
    BtnQuestionsPrevTo:function (PrevIndex) {
      let _This = this;
      _This.EveryanswerData(PrevIndex);
      $('.TestQuestionsListBox div').css('display','none');
      $('.TestQuestionsListBox div').eq(PrevIndex).css('display','block');
      this.saveTestListData.pop();
      console.log(this.saveTestListData)
   },
    //试题获取online/test/testQuestion
    /*book_id	true	string		书籍id
    */
    testQuestion:function (book_id,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/test/testQuestion',
        params: {
          book_id: book_id,
        }
      }).then(function (response) {
        if(response.data){
          if(response.data.questionList == ''){
            _This.fangerroring = true;
            _This.questionCountDataShowBox = false;
            _This.fangerrorText = response.data.errinfo;
            _This.setTimeoutError(function () {
              _This.$router.push({path: 'index'});
            })
          }else {
            _This.questionDataList = response.data.questionList;
            _This.questionCountData = response.data.questionList.length;//总题目数
            _This.questionCountDataShowBox = true;
            _This.ChoosedQuestion = parseInt(_This.indexData) + parseInt(1)

            for(var i=0;i<_This.questionDataList.length;i++){

              var result = [];
              var Llength = objLength(_This.questionDataList[i].answer)
              for(var j=0;j<Llength;j++){
                // console.log(_This.questionDataList[i].answer['answer'+j])
                var ListDataobj=_This.questionDataList[i].answer['answer'+j];
                if(!!ListDataobj["answer"]){
                  result.push(ListDataobj);
                }
              }
              _This.questionDataList[i].answer = result;

            }

            !!fn && fn(response.data);
          }
          _This.FangLoading = false;
        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
    //跳转下一题或者上一题
    EveryanswerData:function (index,fn) {
      let _This = this;
      _This.indexData = index;
      _This.ChoosedQuestion = parseInt(index) + parseInt(1)
      !!fn && fn();
    },
    /*
    * 成绩保存
    接口地址: online/test/saveTest
    book_id	true	string		书籍id
    answerList	True	object		答案list
    * */
    saveTest:function (book_id,answerList,fn) {
      let _This = this;
      _This.FangLoading = true;
      this.axios({
        method: 'post',
        url: ApiUrl() + '/online/test/saveTest',
        params: {
          book_id: book_id,
          answerList:JSON.stringify({answerList}).replace('{"answerList":','').replace('}]}','}]'),
        }
      }).then(function (response) {
        if(response.data){
          _This.FangLoading = false;
          !!fn && fn(response.data);
        }
      }).catch(function (error) {
        console.log(error);
        _This.FangLoading = false;
      });
    },
    //提交答题
    examinationresultTo:function (indexData,event) {
      let _This = this;
      let BOOK_ID = this.$route.query.BOOK_ID;

      var el = event.currentTarget;
      var ChoosedDivBlock = $(el).parents('.BtnQuestionsBox').siblings('.TestQuestionsListBox').children('div').eq(indexData);
      var OnActiveChoosedanswerid = ChoosedDivBlock.children('.QuestionsChooseList').children('.OnActiveChoosed[data-answerid]')
      let QuestionsChooseList = ChoosedDivBlock.children('.QuestionsChooseList').children('li');

      if(_This.saveTestListData.length < _This.questionCountData){
        let answeridStr = '';
        OnActiveChoosedanswerid.each(function (i,o) {
          // console.log($(this).attr('data-answerid'))
          answeridStr += $(this).attr('data-answerid') + ','
        })
        if(QuestionsChooseList.hasClass('OnActiveChoosed')){
          this.saveTestListDataArrayFn(ChoosedDivBlock.children('.TestQuestionsTit').attr('data-questionid'),answeridStr.substring(0,answeridStr.length-1))
        }else {
          this.saveTestListDataArrayFn($('.TestQuestionsTit').attr('data-questionid'),'')
        }

      }
      this.saveTest(BOOK_ID,_This.saveTestListData,function (data) {
        console.log(data)
        if(data.errinfo != undefined ){
          sessionStorage.setItem('Fangscore',data.score);
          sessionStorage.setItem('FangAnswerQuestion',data.rightCount);
          if(data.ispass != '0'){
            _This.$router.push({path: 'examinationresult?result=0'});//考试通过
          }else {
            _This.$router.push({path: 'examinationresult?result=1'});//考试不通过
          }
        }else {
          _This.fangerrorText = '网络出现异常！';
          _This.setTimeoutError();
        }
      })
    },
    /*
    *answerList:
    参数名称	是否必须	类型	默认值	描述
    question_id	true	string		问题id
    _id	True	string		答案id
    [
      {question_id:'',_id:''},
      {question_id:'',_id:''},
    ]
    * */
    saveTestListDataArrayFn:function (question_id,_id,fn) {
      let question_idObj = {};
      question_idObj.question_id = question_id;
      question_idObj.answer_id = _id;
      this.saveTestListData.push(question_idObj);
      console.log(this.saveTestListData)
      !!fn && fn();
    },

  }
 }

</script>
<style lang="stylus" rel="stylesheet/stylus">
  @import "../common/stylus/meta.styl";
  @import "./examination.styl";
</style>
