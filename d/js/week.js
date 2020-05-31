class  Week{
    constructor() { //何週目か、何日か
        this.day = [];
    }
    addDay(day,dayColor,dayName){
        this.day.push(new Day(day,dayColor,dayName));
    }
}
