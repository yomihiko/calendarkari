<?php
//GETリクエストに応じカレンダーを生成
$data = [];
$calendar = null;
const ALL_MONTH_LINE = 5;//1カ月は最大で何週あるか
const WEEKNUM = 7;       //1週間は何日か

require_once("day.php");


class Calendar implements JsonSerializable {

    private $year;  //年
    private $month; //色
    private $calArray;//カレンダーの二次元配列

    private function __construct($year,$month){
        $this->year = $year;
        $this->month = $month;
        $this->calArray = [];
    }

    //カレンダーを生成する
    public static function create($year,$month){
        $Calendar = new Calendar($year,$month);
        $Calendar->calendar_array_make();
        return $Calendar;
    }


    /**
     * カレンダーに対応した二次元配列を生成<br>
     * 日月火水木金土の順番<br>
     * 日が存在しないマスには-1が入る
     * @param String $tomonth 生成する月 2000-01の形式
     * @return string カレンダーの二次元配列
     */
    public function calendar_array_make(){
        $m = $this->month;
        if((int) $m < 10){  //9月以前の時はyyyy-0mとする
            $m = "0" . $m;
        }
        $tomonth = $this->year . "-" . $m;     //yyyy-mmの文字列
        $today_timestamp = strtotime($tomonth); //タイムスタンプ
        $now_month = date("n", $today_timestamp);//月


        //1カ月分繰り返し
        for($i = 0; $i <= ALL_MONTH_LINE;$i++){
            for($d = 0;$d < WEEKNUM;$d++){
                $dayIns = Day::make();
                $this->calArray[$i][$d] = $dayIns;//カレンダー

                //この日が対象の月の範囲内か(翌月、先月の日ではない)
                if(date("w",$today_timestamp) === (String)$d
                    && date("n",$today_timestamp) === $now_month){
                        $dayIns->setDay(date("j",$today_timestamp));//日を設定する
                        $dayIns->setDayName("天使の日");//何の日か設定する(仮)

                        //日曜日の場合
                        if($d == 0){
                            $dayIns->setDayColor(SUNDAY_COLOR);//赤色にする

                        }
                        $today_timestamp = strtotime($tomonth." + 1day");//タイムスタンプを1日進める
                        $tomonth = date("Y-m-d",$today_timestamp);//
                }
            }
        }
    }
    /**
    * JSON出力用
    **/
    public function jsonSerialize() {
        $result = [
            'year' => $this->year,
            'month' => $this->month,
            'calendar' => $this->calArray
        ];

        return $result;
        }
}
?>
