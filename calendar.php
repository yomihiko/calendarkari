<?php
//GETリクエストに応じカレンダーを生成
$data = [];
$calendar = null;
define("ALL_MONTH_LINE",5);//1カ月は最大で何週あるか
define("ENCODE","UTF-8");
define("SUNDAY_COLOR", "#F44336");//休日祭日の赤の色
define("DAY_COLOR", "#000000");
$weekString = ["日","月","火","水","木","金","土"];
$weekColor = ["#F44336","#000000","#000000","#000000","#000000","#000000","#000000"];
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
        $calendar = calendar_array_make($tomonth);
    }
}
else{
    $flag = false;
}
$jsonarray["flag"] = $flag;
$jsonarray["calendar"] = $calendar["calendar"];
$jsonarray["color"] = $calendar["color"];
$jsonarray["whatDay"] = $calendar["whatDay"];
$jsonarray["editFlag"] = $calendar["flag"];
$jsonarray["weekString"] = $weekString;
$jsonarray["weekColor"] = $weekColor;
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
function calendar_array_make($tomonth){
    $today_timestamp = strtotime($tomonth);//
    $now_month = date("n", $today_timestamp);
    $weeknum = 7;
    $calendar = [];
    for($i = 0; $i <= ALL_MONTH_LINE;$i++){
        for($d = 0;$d < $weeknum;$d++){
            $calendar["flag"][$i][$d] = false;
            if(date("w",$today_timestamp) === (String)$d
                && date("n",$today_timestamp) === $now_month){
                    $calendar["calendar"][$i][$d] = date("j",$today_timestamp);
                    $calendar["whatDay"][$i][$d] = "天使の日";
                    if($d == 0){
                        $calendar["color"][$i][$d] = SUNDAY_COLOR;

                    }
                    else{
                        $calendar["color"][$i][$d] = DAY_COLOR;
                    }
                    $today_timestamp = strtotime($tomonth." + 1day");
                    $tomonth = date("Y-m-d",$today_timestamp);
            }
            else {
                $calendar["calendar"][$i][$d] = "-1";
                $calendar["whatDay"][$i][$d] = "";
                $calendar["color"][$i][$d] = "";
            }
        }
    }
    return $calendar;
}
?>
