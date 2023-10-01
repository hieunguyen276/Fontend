var count = 0;

for (var i = 1; i <=100 ; i++) {
    if(i % 3 == 0 || i % 7 == 0) {
        count++;
    }
}

console.log("Số lượng chia hết cho 3 hoặc 7 từ 0 - 100 là: ",count);