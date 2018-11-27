<?php
//GETリクエストに応じカレンダーを生成
$data = [];
$calender = null;
define("ALL_MONTH_LINE",5);//1カ月は最大で何週あるか
define("ENCODE","UTF-8");
define("SUNDAY_COLOR", "#F44336");//休日祭日の赤の色
define("DAY_COLOR", "#000000");
if(isset($_GET["cal"]) && preg_match("/^(2[0-9]{3})([1-9]|1[0-2])$/", $_GET["cal"],$data) === 1){
    $max_year = date("Y",strtotime(date("Y-m-d") . "+ 10year")); //何年まで表示するか
    $jsonarray = [];
    $flag = true;

    if((int) $data[1] > (int) $max_year)
        $flag = false;

    if($flag){
        if((int) $data[2] < 10){
            $data[2] = "0" . $data[2];
        }
        $tomonth = $data[1] . "-" . $data[2];
        $calender = calender_array_make($tomonth);
    }
}
else{
    $flag = false;
}
$jsonarray["flag"] = $flag;
$jsonarray["calender"] = $calender["calender"];
$jsonarray["color"] = $calender["color"];
$json = json_encode($jsonarray);
header('content-type: application/json; charset='.ENCODE);
echo $json;

/**
 * カレンダーに対応した二次元配列を生成<br>
 * 日月火水木金土の順番<br>
 * 日が存在しないマスには-1が入る
 * @param String $tomonth 生成する月 2000-01の形式
 * @return string カレンダーの二次元配列
 */
function calender_array_make($tomonth){
    $today_timestamp = strtotime($tomonth);//
    $now_month = date("n", $today_timestamp);
    $weeknum = 7;
    $calender = [];
    for($i = 0; $i <= ALL_MONTH_LINE;$i++){
        $calender["calender"][$i] = new calender();
        $calender["color"][$i] = new calender();
        for($d = 0;$d < $weeknum;$d++){
            $wks = "d".$d;
            if(date("w",$today_timestamp) === (String)$d
                && date("n",$today_timestamp) === $now_month){
                    $calender["calender"][$i]->$wks = date("j",$today_timestamp);
                    if($d == 0){
                        $calender["color"][$i]->$wks = SUNDAY_COLOR;
                    }
                    else{
                        $calender["color"][$i]->$wks = DAY_COLOR;
                    }
                    $today_timestamp = strtotime($tomonth." + 1day");
                    $tomonth = date("Y-m-d",$today_timestamp);
            }
            else {
                $calender["calender"][$i]->$wks = "-1";
            }
        }
    }
    return $calender;
}
class calender{
    public $d0;
    public $d1;
    public $d2;
    public $d3;
    public $d4;
    public $d5;
    public $d6;
}
?>
