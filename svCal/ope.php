<?php
const ENCODE = "UTF-8";    //文字コード
const SUNDAY_COLOR = "F44336";   //日曜日の色
const DAY_COLOR = "#000000";     //通常の色
$weekString = ["日","月","火","水","木","金","土"];
$weekColor = [SUNDAY_COLOR,DAY_COLOR,DAY_COLOR,DAY_COLOR,DAY_COLOR,DAY_COLOR,DAY_COLOR];

require_once("calendar.php");

if(isset($_GET["cal"]) && preg_match("/^(2[0-9]{3})([1-9]|1[0-2])$/", $_GET["cal"],$data) === 1){
    $max_year = date("Y",strtotime(date("Y-m-d") . "+ 10year")); //何年まで表示するか
    $jsonarray = [];
    $flag = true;

    if((int) $data[1] > (int) $max_year)
        $flag = false;

    if($flag){
        $calendar = Calendar::create($data[1],$data[2]);
    }
}
else{
    $flag = false;
}
$jsonarray["flag"] = $flag;
$jsonarray["calendar"] = $calendar;
$jsonarray["weekString"] = $weekString;
$jsonarray["weekColor"] = $weekColor;
$json = json_encode($jsonarray);
header('content-type: application/json; charset='.ENCODE);
echo $json;
?>
