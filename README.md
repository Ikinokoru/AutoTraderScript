# AutoTraderScript

### **Hướng dẫn cơ bản cách xây dựng thuật toán cho bot với Javascript** 



Bot sẽ không dùng một thuật toán duy nhất mà thay vào đó sẽ chia nhỏ ra thành nhiều thuật toán khác nhau để chạy lệnh. Ví dụ như có thuật toán sử dụng Bollinger Band kết hợp với Orderbook, cũng có thuật toán khác sử dụng đường trung bình kêt hợp với cản... (Xem ví dụ dưới hình)

<img src="https://i.imgur.com/P07w2U9.png" alt="Người dùng có thể thêm nhiều thuật toán khác nhau cho bot chạy"  />

------

### **Khởi tạo một file thuật toán cho bot**

1. Tạo một file .js trống (Bạn có thể sử dụng bất kì IDE nào hỗ trợ Javascript để code thuật toán)

2. Khởi tạo 2 hàm bắt buộc của thuật toán

   ```javascript
   // Hàm này trả về một mảng chứa những chỉ báo sử dụng trong thuật toán
   // p/s: Nếu người dùng cài đặt thiếu chỉ báo thì sẽ hiện một thông báo khi khởi động bot 
   function indicator() {
       return [];
   }
   
   // Hàm này trả về dự đoán của thuật toán sau khi xử lý dữ liệu 
   // (trả về 1 trong 3 giá trị: up, down, skip)
   async function predict() {
       return "skip";
   }
   ```

### **Dữ liệu ở hiện tại**

Sử dụng hàm `await now("tên chỉ báo")` để lấy dữ liệu của chỉ báo đó ở hiện tại

Ví dụ lấy dữ liệu của đường Bollinger Band 20: 

```javascript
// Khai báo chỉ báo Bollinger Bands trong hàm này
function indicator() {
    return ["BB(20,2)"];
}

async function predict() {
    var bollingerBands = await now("BB(20,2)");
    console.log(bollingerBands.upper_band); // In ra thuộc tính upper band (Giá trị band trên)
    console.log(bollingerBands.middle_band); // In ra thuộc tính middle band (Giá trị band giữa)
    console.log(bollingerBands.lower_band); // In ra thuộc tính upper band (Giá trị band dưới)

    return "skip";
}
```

Sử dụng hàm `await now("candle")` để lấy dữ liệu nến ở hiện tại: 

```javascript
async function predict() {
    var candle = await now("candle");
    console.log(candle.open); // In ra thuộc tính open (Giá mở cửa)
    console.log(candle.close); // In ra thuộc tính close (Giá đóng cửa)
    console.log(candle.high); // In ra thuộc tính high (Giá cao nhất)
    console.log(candle.low); // In ra thuộc tính low (Giá thấp nhấp)
    return "skip";
}
```

[Xem danh sách chỉ báo và thuộc tính tại đây](https://github.com/RemVN/AutoTraderScript#danh-s%C3%A1ch-ch%E1%BB%89-b%C3%A1o-v%C3%A0-thu%E1%BB%99c-t%C3%ADnh)

### **Dữ liệu ở quá khứ**

*Sắp ra mắt...*

### Xử lý dữ liệu và trả về dự đoán

Ví dụ kiểm tra nến cắt lên đường Moving Average 10 và trả về dự đoán tăng:

```javascript
function indicator() {
    return ["MA(10,close,0)"]; // Khai báo chỉ báo Ma10
}

async function predict() {
    var ma10 = await now("MA(10,close,0)");
    var candle = await now("candle");
    if(candle.open < ma10.value) { // Giá đóng cửa nằm dưới MA10
        if(candle.close > ma10.value) { // Giá đóng cửa nằm trên MA10
            return "up";  // Trả về dự đoán tăng
        }
    }
    return "skip"; // Trả về dự đoán skip nếu không phù hợp 2 điều kiện trên
}
```

### Danh sách các hàm hiện có

| Tên hàm                  | Giải thích                                                   |
| ------------------------ | ------------------------------------------------------------ |
| await now("tên chỉ báo") | Trả về dữ liệu của chỉ báo đó (Xem danh sách tên chỉ báo và thuộc tính bên dưới) |
| await now("candle")      | Trả về dữ liệu của nến (Có các thuộc tính **open**, **high**, **low**, **close**) |

### Danh sách chỉ báo và thuộc tính

### <a name="indicator_list"></a>

Một số bạn sẽ hỏi tại sao tên chỉ báo lại kiểu có đóng mở ngoặc rồi có số ở trong thì nó là tên của chỉ báo được hiển thị trên biểu đồ của binance

<img src="https://i.imgur.com/hz2KrRy.png"  />

Do vậy khi sử dụng chỉ báo nào thì cần phải khai báo tên trùng với tên trên biểu đồ

| Tên chỉ báo <br />và những thứ khác | Tên mẫu (dùng trong code) | Thuộc tính                                              | Giải thích thuộc tính                                        |
| ----------------------------------- | ------------------------- | ------------------------------------------------------- | ------------------------------------------------------------ |
| Nến                                 | candle                    | **open<br />high<br />low<br />close**                  | Giá mở cửa <br />Giá cao nhất<br />Giá thấp nhát<br />Giá đóng cửa |
| Bollinger Band                      | BB(20,2)                  | **upper_band**<br />**middle_band**<br />**lower_band** | Giá trị band trên<br />Giá trị band giữa<br />Giá trị band dưới |
| Moving Average                      | MA(10,close,2)            | **value**                                               | Giá trị của đường trung bình                                 |
| Sắp cập nhật thêm....               |                           |                                                         |                                                              |

