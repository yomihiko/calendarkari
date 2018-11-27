
var calender = new Vue({
  el: "#maincal",
  data: {
    year: 0,//表示する年
    month: 0,//表示する月
    calendercol: 5, //カレンダーを何行表示するか
    clen: 'calendermain',//カレンダー全体に適用するclass属性
    /**
    calender
    カレンダーの各種情報を格納する配列 週ごとに分ける
    calender[週番号(0～calendercol-1)].情報種類.d〇(日番号0～6)
    情報種類
    ・calender カレンダーの日にちの数字を格納 日が存在しない場合は-1
    ・flag カレンダーの各日上のマウスオーバー監視フラグ マウスオーバーしているときはtrue
    ・color 各日の数字の色 RGB
    **/
    calender: [],
    calenderLastLine: [],//calendercol+1の行の週情報 通常一番下の行の適切な曜日の欄を半分に分割して表示する
    editOneDay: [],
    calurl: 'http://localhost/calenderkari/calender.php?cal=',
    chengesecond: 0,
    editflag: {},
    editOnMouse: "caledit cssanimation fadeIn",
	editOffMouse: "caledit editnone",
    DayOnceEdit: "dayonce dayonceedit border border-deepgreen",
    DayOnceNoneEdit:"dayonce"
  },
  methods: {
      start:function(){
          var d = new Date();
          this.year = d.getFullYear();
          this.month = d.getMonth() + 1;
          this.calenderget();
          this.editOneDay.push([-1,-1]);
      },
      calenderInAnimation:function(){//カレンダーを表示する時のアニメーション
    	  this.clen = 'calendermain cssanimation fadeIn';
      },
      calenderOutAnimation:function(){//カレンダーを非表示にするときのアニメーション
          this.clen = 'calendermain cssanimation fadeOut';
          var d = new Date();
          this.chengesecond = d.getTime();
      },
      calenderchangenext:function(){//次の月へ進めるときの処理
          if(this.month == 12){
              this.year += 1;
              this.month = 1;
          }
          else{
              this.month += 1;
          }
          this.calenderOutAnimation();
          setTimeout(this.calenderget,600);//ボタンが連打された時に連続通信にならないための待ち時間
      },

      calenderchangeprev:function(){//前の月へ戻るときの処理
          if(this.month == 1){
              this.year -= 1;
              this.month = 12;
          }
          else{
              this.month -= 1;
          }
          this.calenderOutAnimation();
    	  setTimeout(this.calenderget, 600);
      },
      calenderLastLineCheck:function(windex,dindex){//カレンダーの最終行があるか
          if(windex !== this.calendercol - 1){
              return false;
          }
          else if(this.calenderLastLine[dindex] !== "-1"){
              return true;
          }
          return false;
      },
      calenderget:function(){//カレンダーの情報をAjaxで取得
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
              this.calender = [];
              for(var i = 0;i < this.calendercol;i++){
            	  wkob = {};
            	  wkob.flag = {d0:false,d1:false,d2:false,d3:false,d4:false,d5:false,d6:false};
            	  wkob.days = data.calender[i];
                  wkob.color = data.color[i];
            	  this.calender.push(wkob);
                  this.editOneDay = [-1,-1];

              }
              this.calenderLastLine = data.calender[this.calendercol];
              this.calenderInAnimation();
          })
          .fail( (data) => {

          })
      },
      editOnMouseCheck:function(windex,dindex){
    	  if( this.calender[windex]["flag"][dindex] == !undefined
              || this.calender[windex]["flag"][dindex] == false){
    		  return this.editOffMouse;
    	  }
    	  return this.editOnMouse;
      },
      editDisplay:function(windex,dindex){
          if(this.editClickCheck(windex,dindex) == true ){
              this.calender[windex]["flag"][dindex] = false;
          }
          else{
    	         this.calender[windex]["flag"][dindex] = true;
          }


      },
      editNoneDisplay:function(windex,dindex){


    	  this.calender[windex]["flag"][dindex] = false;
      },
      color:function(windex,dindex){
          return "color:"+this.calender[windex]["color"][dindex];
      },
      editClickSet:function(windex,dindex){
          this.calender[windex]["flag"][dindex] = false;
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
