


var calendar = new Vue({
  el: "#maincal",
  data: {
    year: 0,//表示する年
    month: 0,//表示する月
    calendarcol: 5, //カレンダーを何行表示するか
    clen: 'calendarmain',//カレンダー全体に適用するclass属性
    /**
    calendar
    カレンダーの各種情報を格納する配列 週ごとに分ける
    calendar[週番号(0～calendarcol-1)].情報種類.d〇(日番号0～6)
    情報種類
    ・calendar カレンダーの日にちの数字を格納 日が存在しない場合は-1
    ・flag カレンダーの各日上のマウスオーバー監視フラグ マウスオーバーしているときはtrue
    ・color 各日の数字の色 RGB
    ・whatday 何の日か 〇〇の日など
    **/
    calendar: [],
    calendarLastLine: {},//calendarcol+1の行の週情報 通常一番下の行の適切な曜日の欄を半分に分割して表示する
    editOneDay: [],
    calurl: "calendar.php?cal=",
    chengesecond: 0,
    editflag: {},
    editOnMouse: "caleditOnMouse cssanimation fadeIn",
	editOffMouse: "caleditOnMouse editnone",
    DayOnceEdit: "daywapper dayonceedit border border-deepgreen",
    DayOnceNoneEdit:"daywapper"
  },
  methods: {
      start:function(){
          var d = new Date();
          this.year = d.getFullYear();
          this.month = d.getMonth() + 1;
          this.calendarget();
          this.editOneDay.push([-1,-1]);
      },
      calendarInAnimation:function(){//カレンダーを表示する時のアニメーション
    	  this.clen = 'calendarmain cssanimation fadeIn';
      },
      calendarOutAnimation:function(){//カレンダーを非表示にするときのアニメーション
          this.clen = 'calendarmain cssanimation fadeOut';
          var d = new Date();
          this.chengesecond = d.getTime();
      },
      calendarchangenext:function(){//次の月へ進めるときの処理
          if(this.month == 12){
              this.year += 1;
              this.month = 1;
          }
          else{
              this.month += 1;
          }
          this.calendarOutAnimation();
          setTimeout(this.calendarget,600);//ボタンが連打された時に連続通信にならないための待ち時間
      },

      calendarchangeprev:function(){//前の月へ戻るときの処理
          if(this.month == 1){
              this.year -= 1;
              this.month = 12;
          }
          else{
              this.month -= 1;
          }
          this.calendarOutAnimation();
    	  setTimeout(this.calendarget, 600);
      },
      calendarLastLineCheck:function(windex,dindex){//カレンダーの最終行があるか
          if(windex !== this.calendarcol - 1){
              return false;
          }
          else if(Object.keys(this.calendarLastLine).length > 0 && this.calendarLastLine[dindex] !== "-1"){

              return true;
          }
          return false;
      },
      /**
      //カレンダーの情報をAjaxで取得
      */
      calendarget:function(){
          var url = this.calurl + this.year + this.month;
          var d = new Date();
          if(d.getTime() - this.chengesecond <= 500){
        	  return;
          }
      	$.ajax({
              url:url,
              type:'GET',
              dataType:"JSON",
          })
          .done( (data) => {
              var st;
              var wkob;
              this.calendar = [];
              for(var i = 0;i < this.calendarcol;i++){
            	  wkob = {};
            	  wkob.flag = {d0:false,d1:false,d2:false,d3:false,d4:false,d5:false,d6:false};
            	  wkob.days = data.calendar[i];
                  wkob.color = data.color[i];
                  wkob.color.d5 = "#eeeeee";
                  wkob.whatday = {d0:"テストの日0",d1:"テストの日1",d2:"テストの日2",d3:"テストの日3",d4:"テストの日4",d5:"テストの日5",d6:"テストの日6"};
            	  this.calendar.push(wkob);
                  this.editOneDay = [-1,-1];

              }
              if(data.calendar[this.calendarcol] !== undefined){
                  this.calendarLastLine = data.calendar[this.calendarcol];
              }
              else{
                  this.calendarLastLine = {};
              }
              this.calendarInAnimation();
          })
          .fail( (data) => {
            console.log(data);
          })
      },
      editOnMouseCheck:function(windex,dindex){//カレンダーの日の上のマウスオーバー判定
    	  if( this.calendar[windex]["flag"][dindex] == !undefined
              || this.calendar[windex]["flag"][dindex] == false){
    		  return this.editOffMouse;
    	  }
    	  return this.editOnMouse;
      },
      editDisplay:function(windex,dindex){//
          if(this.editClickCheck(windex,dindex) == true ){
              this.calendar[windex]["flag"][dindex] = false;
          }
          else{
    	         this.calendar[windex]["flag"][dindex] = true;
          }


      },
      editNoneDisplay:function(windex,dindex){
    	  this.calendar[windex]["flag"][dindex] = false;
      },
      color:function(windex,dindex){ //色CSSを返す
          return "color:"+this.calendar[windex]["color"][dindex];
      },
      editClickSet:function(windex,dindex){
          pickerObj(this,windex,dindex);
          this.calendar[windex]["flag"][dindex] = false;
          this.editOneDay = [windex,dindex];
      },
      editClickCheck:function(windex,dindex){
          if(this.editOneDay[0] == windex && this.editOneDay[1] == dindex){
              return true;
          }
          return false;
      },
      editMoveAnimation:function(windex,dindex){
          if(this.editOneDay[0] == windex && this.editOneDay[1] == dindex){
              return this.DayOnceEdit;
          }
          return this.DayOnceNoneEdit;
      }
  }
});

calendar.start(); //スタート

$(function($){
    $("#picker").spectrum();
});

/**
カラーピッカーを作成
*/
function pickerObj(calendar,windex,dindex) {
    $(function($){
        $(".colorSelecter").spectrum({
            replacerClassName: 'pickerBtn',
            move: function(color){
                calendar.calendar[windex]["color"][dindex] = returnColorCode(color._r,color._g,color._b);
          }
      });
    });
}

/**
rgbからカラーコードを作成
*/
function returnColorCode(r,g,b){
    var red = ("00" + Math.floor(r).toString(16)).slice(-2);
    var green =  ("00" + Math.floor(g).toString(16)).slice(-2);
    var blue = ("00" + Math.floor(b).toString(16)).slice(-2);
    return "#" + red + green + blue;
}
