class  Calendar{
    constructor(year,month) {
    this.year = year;           //年
    this.month = month;         //月
    this.backgroundImage = "";  //背景画像
    this.alpha = 0;             //透明度
    this.week = [];
    this.weekColor = [];        //曜日単位の色
    this.weekLabel = [];        //曜日の表示
  }
  addWeek(){
      this.week.push(new Week());
  }
  addDay(weekNum,day,dayColor,dayName){
      //console.log(new Day(day,dayColor,dayName));
      this.week[weekNum].addDay(day,dayColor,dayName);
  }
}
