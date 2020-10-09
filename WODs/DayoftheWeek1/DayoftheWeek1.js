var day = 4;
var month = "Dec";
var year = 2000;

step1 = year % 100;
step2 = Math.floor(step1 / 4);
step3 = step1 + step2;
if (month == "Jan") {
    step5 = step3 + day;
} else {
    switch (month) {
        case "Feb":
            step4 = 3;
        case "Mar":
            step4 = 3;
        case "Apr":
            step4 = 6;
        case "May":
            step4 = 1;
        case "Jun":
            step4 = 4;
        case "Jul":
            step4 = 6;
        case "Aug":
            step4 = 2;
        case "Sep":
            step4 = 5;
        case "Oct":
            step4 = 0;
        case "Nov":
            step4 = 3;
        case "Dec":
            step4 = 5;
    }
}
step6= step4 + step3;
step7 = step6+day;
step8 = (typeof step5 !== 'undefined') ? step5 : step7;
isleapYear = (year % 4 == 0) && (year % 100 == 0) && (year % 400 == 0) ;

if (year/100 == 19) {
   if(isleapYear){
       if(month == "Feb" ||	month =="Jan");{
           step9 = step8-1;
       }
   } 
} 
   else{
    if (isleapYear){
        if(month == "Feb" || month =="Jan") {
            step9 = step8-2;
        }else{
            step9 = step8 - 1;
      }
    } else {
        step9 = step8-1;
    }
} 
step10 = step9 % 7;
if(step10 == 0 ){
    dow = 'Sunday';
}
else if (step10 == 1){
    dow ='Monday'
}
else if (step10 == 2){
    dow ='Tuesday'
}
else if (step10 == 3){
    dow ='Wednesday'
}
else if (step10 == 4){
    dow ='Thursday'
}
else if (step10 == 5){
    dow ='Friday'
}
else if (step10 == 6){
    dow ='Saturday'
}

console.log(`${month}/${day}/${year} is a ${dow}`);