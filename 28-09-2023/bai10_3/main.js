var tong = 0;

var n = parseInt(prompt("Mời bạn nhập n", n));
var m = parseInt(prompt("Mời bạn nhập m", m));
var k = parseInt(prompt("Mời bạn nhập k", k));


for (i = n; i <= m ; i++) {
    if (i % k == 0) {
        tong += i ;
    }
}

console.log(`Tổng các số chia hết cho k trong khoảng từ n - m là: ${tong}`);