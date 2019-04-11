


var calendar = new Vue({
  el: "#maincal",
  data: {
    year: 0,//表示する年
    month: 0,//表示する月
    calendarcol: 5, //カレンダーを何行表示するか
    weekrow: 7,//一週間は何日か
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
    weekString: [],
    weekColor: [],
    editYoubi: -1,
    calendarLastLine: {},//calendarcol+1の行の週情報 通常一番下の行の適切な曜日の欄を半分に分割して表示する
    editOneDay: [],//現在編集中の日にち [0]=週番号 [1]=日番号
    calurl: "calendar.php?cal=",
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
          var url = this.calurl + this.year + this.month;
          var d = new Date();
          if(d.getTime() - this.chengeSecond <= 500){
        	  return;
          }
      	$.ajax({
              url:url,
              type:'GET',
              dataType:"JSON",
          })
          .done( (data) => {
              var st;
              var wkob,wkweek;
              this.calendar = [];
              this.weekString = [];
              this.weekColor = [];
              for(var i = 0;i < this.weekrow;i++){
                  this.weekString.push(data.weekString[i]);
                  this.weekColor.push(data.weekColor[i]);
              }
              for(var i = 0;i < this.calendarcol;i++){
            	  wkob = {};
            	  wkob.flag = data.editFlag[i];
            	  wkob.days = data.calendar[i];
                  wkob.color = data.color[i];
                  wkob.whatday = data.whatDay[i];
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
      editNoneDisplay:function(windex,dindex){//マウスをカレンダー上から離したとき
          this.calendar[windex]["flag"].splice(dindex,1,false) ;
      },
      editYoubiDisplay:function(youbiindex){
          this.editYoubi = youbiindex;
      },
      editYoubiNoneDisplay:function(){
          this.editYoubi = -1;
      },
      editYoubiReturnCss:function(youbiindex){
          if(youbiindex == this.editYoubi){
              return this.editOnMouse;
          }
          return this.editOffMouse;
      },
      color:function(colorcode){ //色CSSを返す
          return "color:"+colorcode;
      },
      colorWandD:function(windex,dindex){//windex,dindexの色情報から色CSSを返す
          return this.color(this.calendar[windex]["color"][dindex]);
      },
      editClickSet:function(windex,dindex){//クリックされた日にちをセットする
          pickerObj(this,windex,dindex);
          this.calendar[windex]["flag"].splice(dindex,1,false) ;
          this.editOneDay = [windex,dindex];
      },
      editClickCheck:function(windex,dindex){//選択中の日にちならtrue
          if(this.editOneDay[0] == windex && this.editOneDay[1] == dindex){
              return true;
          }
          return false;
      },
      editReturnCss:function(windex,dindex){//編集モードに応じて適切なclass属性を返す
          //日にちを編集しているとき
          if(this.editOneDay[0] == windex && this.editOneDay[1] == dindex){
              return this.dayOnceEdit;
          }
          return this.dayOnceNoneEdit;
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
