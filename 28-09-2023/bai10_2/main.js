var tong = 0;
var i = 1;

var n = parseInt(prompt("Mời bạn nhập n", n));

do {
    tong +=i;
    i++;
} while (i <= n);

console.log(tong);