age_count = 1; //start the age count
age = 19; //my age
while (age_count < age) {
    if(age_count > age / 2)  {
        console.log("Don’t ask how old I am!");
        process.exit();
    }
    else {
        console.log(`age ${age_count}`);
    }
    
    age_count++;
}