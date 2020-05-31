


var calendar = new Vue({
  el: "#maincal",
  data: {
    year: 0,//表示する年
    month: 0,//表示する月
    calendarcol: 5, //カレンダーを何行表示するか
    weekrow: 7,//一週間は何日か
    clen: 'calendarmain',//カレンダー全体に適用するclass属性
    calendar: new Calendar(1900,1),
    editYoubi: -1,
    calendarLastLine: {},//calendarcol+1の行の週情報 通常一番下の行の適切な曜日の欄を半分に分割して表示する
    editOneDay: [],//現在編集中の日にち [0]=週番号 [1]=日番号
    calurl: "svCal/ope.php?cal=",
    chengeSecond: 0,
    editOnMouse: "caleditOnMouse cssanimation fadeIn",
	editOffMouse: "caleditOnMouse editnone",
    dayOnceEdit: "daywapper dayonceedit border border-deepgreen",
    dayOnceNoneEdit:"daywapper",
    youbiEditDayOnce:"daywapper border-left border-right border-deepgreen",
    youbiEditDayOnceLastWeek:"daywapper border-left border-bottom border-right border-deepgreen"
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
          this.chengeSecond = d.getTime();
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
          var url = this.calurl + this.year + this.month;   //カレンダーJSON取得URL
          var d = new Date();
          if(d.getTime() - this.chengeSecond <= 500){ //連打防止
        	  return;
          }
      	$.ajax({
              url:url,
              type:'GET',
              dataType:"JSON",
          })
          .done( (data) => {
              var mainCalendar = new Calendar(data.calendar.year,data.calendar.month);

              mainCalendar.weekColor = data.weekColor;  //曜日ごとの色を設定
              mainCalendar.weekLabel = data.weekString; //曜日のラベルを設定

              var days = data.calendar.calendar;    //日付情報を一時的に格納する変数

              for(var i = 0;i < days.length;i++){   //日付インスタンスを生成しカレンダーに追加する
                  mainCalendar.addWeek(i);
            	  for (var j = 0; j < days[i].length; j++) {
                      //i週目に日付を追加
                      mainCalendar.addDay(i,days[i][j].day,days[i][j].dayName,days[i][j].dayColor);
                  }
              }
              if(data.calendar[this.calendarcol] !== undefined){
                  this.calendarLastLine = data.calendar[this.calendarcol];
              }
              else{
                  this.calendarLastLine = {};
              }
              console.log(data);
              console.log(mainCalendar);

              this.calendar = mainCalendar;
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
      editDisplay:function(windex,dindex){//編集ボタンをクリックしたとき
          if(this.editClickCheck(windex,dindex) == true ){
              this.calendar[windex]["flag"].splice(dindex,1,false) ;
          }
          else{
    	         this.calendar[windex]["flag"].splice(dindex,1,true) ;
          }


      },
      editOnMouseReturnCss:function(windex,dindex){ //マウスオーバーしたとき,離したときのclass属性を返す
          if(this.calendar[windex].flag[dindex] == true){
              return this.editOnMouse;
          }
          else if(this.editYoubi == dindex){
              return this.editOnMouse;
          }
          return this.editOffMouse;
      },
      editYoubiReturnCss:function(youbiindex){
          if(youbiindex == this.editYoubi){
              return this.editOnMouse;
          }
          return this.editOffMouse;
      },
      color:function(colorcode){ //色CSSを返す
          return "color:"+colorcode;
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
