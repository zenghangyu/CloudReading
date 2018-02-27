/**
 * Created by Administrator on 20180125.
 */
function ApiUrl(){
  var API_address;
  API_address = "http://wx.fineland.cn:8080/readonline";
  return API_address;
}

function Islogined() {
  var schoolId = localStorage.getItem('FangschoolId');
  var teacherId = localStorage.getItem('FangteacherId');
  var userId = localStorage.getItem('FanguserId');
  if(schoolId == '' || teacherId == '' || userId == '' || schoolId == null || teacherId == null || userId == null){
    window.location.href = './#/login';
  }
}

function returnId(id) {
  var Ids = localStorage.getItem('Fang'+id);
  return Ids;
}

function formatDate(date, fmt) {
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    var o = {
        'M+': date.getMonth() + 1,
        'd+': date.getDate(),
        'h+': date.getHours(),
        'm+': date.getMinutes(),
        's+': date.getSeconds()
    };
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            var str = o[k] + '';
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
        }
    }
    return fmt;
};

function padLeftZero(str) {
    return ('00' + str).substr(str.length);
}

// 去掉数组重复元素
function uniqueArray(data){
   data = data || [];
   var a = {};
   for (var i=0; i<data.length; i++) {
       var v = data[i];
       if (typeof(a[v]) == 'undefined'){
            a[v] = 1;
       }
   };
   data.length=0;
   for (var i in a){
        data[data.length] = i;
   }
   return data;
}
 //获取对象长度
function objLength(o){
  var t = typeof o;
  if(t == 'string'){
    return o.length;
  }else if(t == 'object'){
    var n = 0;
    for(var i in o){
      n++;
    }
    return n;
  }
  return false;
}

export {
  ApiUrl,Islogined,returnId,formatDate,uniqueArray,objLength
}
