<?php
class Day implements JsonSerializable{

    private $day;       //何日か
    private $dayColor;  //日の色
    private $dayName;   //何の日か

    private function __construct(){
        $this->day = -1;
        $this->dayColor = DAY_COLOR;
        $this->dayName = "";
    }

    /**
    * 日を生成する
    **/
    public static function make(){
        return new Day();
    }

    /**
    * 何日かを設定する
    **/
    public function setDay($day){
        $this->day = $day;
    }
    /**
    * 日の色を設定する
    **/
    public function setDayColor($color){
        $this->dayColor = $color;
    }
    /**
    * 何の日かを設定する
    **/
    public function setDayName($dayName){
        $this->dayName = $dayName;
    }
    /**
    * JSON出力用
    **/
    public function jsonSerialize() {
        $result = [
            'day' => $this->day,
            'dayColor' => $this->dayColor,
            'dayName' => $this->dayName
        ];

        return $result;
    }
}
