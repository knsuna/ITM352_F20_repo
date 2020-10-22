age =19;
name = "Kai;"
attributes  =  name + ";" + age + ";" + (19 + 0.5) +";" + (0.5 - 19);

parts = attributes.split(";");
for (i in parts){
    parts[i] = `${typeof parts[i]} ${parts [i]}`;
}
console.log(parts.join(","));