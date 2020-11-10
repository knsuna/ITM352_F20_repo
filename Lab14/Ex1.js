var fs = require(`fs`);

var user_data_filename = `user_name.json`;

var data = fs.readFileSync(user_data_filename, `utf-8`);

user_reg_data = JSON.parse(data);

console.log(user_reg_data[`dport`].password);