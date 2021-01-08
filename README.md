![](https://i.imgur.com/E9DWUHL.png)

## Dành cho ai chưa tải bot

Link tải: **[Download](https://drive.google.com/file/d/1q_b1FLYqswD3pok30yUoYCdoWVK3vXCl/view?usp=sharing)**

Hướng dẫn sử dụng: **[Xem](https://drive.google.com/file/d/1n0-HFdWEjbT2lpr3YI1IAu04QkCDEOw_/view)**

## Giới thiệu về thuật toán tuỳ chỉnh của bot  

Thuật toán tuỳ chỉnh là thuật toán do người dùng tự viết ra hoặc thêm từ thư viện (thư viện chứa những thuật toán do đội ngủ MMD làm sẵn).

Bot sẽ không dùng một thuật toán duy nhất mà thay vào đó sẽ chia nhỏ ra thành nhiều thuật toán khác nhau để chạy lệnh. Ví dụ như có thuật toán sử dụng Bollinger Band kết hợp với Orderbook, cũng có thuật toán khác sử dụng đường trung bình kêt hợp với cản... (Xem ví dụ dưới hình)

<img src="https://i.imgur.com/pJ4Ubkm.png" alt="Người dùng có thể thêm nhiều thuật toán khác nhau cho bot chạy"  />

## **Khởi tạo một file thuật toán cho bot**

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
   async function predict(stats) {
       return "skip";
   }
   ```

## **Dữ liệu ở hiện tại**

Sử dụng hàm `await now("tên chỉ báo")` để lấy dữ liệu của chỉ báo đó ở hiện tại

Ví dụ lấy dữ liệu của đường Bollinger Band 20: 

```javascript
// Khai báo chỉ báo Bollinger Bands trong hàm này
function indicator() {
    return ["BB(20,2)"];
}

async function predict(stats) {
    var bollingerBands = await now("BB(20,2)");
    log(bollingerBands.upper_band); // In ra thuộc tính upper band (Giá trị band trên)
    log(bollingerBands.middle_band); // In ra thuộc tính middle band (Giá trị band giữa)
    log(bollingerBands.lower_band); // In ra thuộc tính upper band (Giá trị band dưới)

    return "skip";
}
```

Sử dụng hàm `await now("candle")` để lấy dữ liệu nến ở hiện tại: 

```javascript
async function predict(stats) {
    var candle = await now("candle");
    log(candle) // In ra dữ liệu nến
    return "skip";
}
```

[Xem danh sách chỉ báo và thuộc tính tại đây](https://github.com/RemVN/AutoTraderScript#danh-s%C3%A1ch-ch%E1%BB%89-b%C3%A1o-v%C3%A0-thu%E1%BB%99c-t%C3%ADnh)

## **Dữ liệu ở quá khứ**

+ Sử dụng hàm `await past("tên chỉ báo", index)` để lấy dữ liệu của chỉ báo đó ở cây nến trước đó với **index** là thứ tự cây nến trước đó. 

  **Lưu ý: nếu chưa có sẵn dữ liệu trong quá khứ thì hàm sẽ trả về null. Bạn phải kiểm tra null khi sử dụng hàm này**

+ Ví dụ lấy dữ liệu đường trung bình MA10 ở cây nến trước đó:

```javascript
var ma10_past = await past("MA(10,close,2)", 0);
if(ma10_past != null) // Đã có dữ liệu trong quá khứ
    log(ma10_past);
```

* Xem hình minh hoạ dưới để hiểu dễ hơn:

![](https://i.imgur.com/ZNUyTNA.png)

## Xử lý dữ liệu và trả về dự đoán

Ví dụ kiểm tra nến cắt lên đường Moving Average 10 và trả về dự đoán tăng:

```javascript
function indicator() {
    return ["MA(10,close,0)"]; // Khai báo chỉ báo Ma10
}

async function predict(stats) {
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

## Xuất dữ liệu ra console của bot

Trong trường hợp bạn muốn kiểm tra các dữ liệu đang được tính toán như thế nào thì bạn có thể sử dụng console của bot

Để kích hoạt console hãy nhấn vào nút này

![](https://i.imgur.com/ubWtg2v.png)

Sau đó cửa số console sẽ hiện lên

<img src="https://i.imgur.com/iRtFjw1.png" style="zoom:80%;" />

Xuất dữ liệu với hàm `log("dữ liệu cần xuất")`

```javascript
async function predict(stats) {
    var ma10 = await now("MA(10,close,2)");
    log(ma10.value);
    
    return "skip";
}
```



## Danh sách các hàm hiện có

| Tên hàm                          | Giải thích                                                   |
| -------------------------------- | ------------------------------------------------------------ |
| log("dữ liệu")                   | Xuất dữ liệu ra console của bot                              |
| await now("tên chỉ báo")         | Trả về dữ liệu của chỉ báo đó (Xem danh sách tên chỉ báo và thuộc tính bên dưới) |
| await now("candle")              | Trả về dữ liệu của nến (Có các thuộc tính **open**, **high**, **low**, **close**) |
| await past("tên chỉ báo", index) | Trả về dữ liệu của chỉ báo đó ở cây nến trước với với **index** là thứ tự cây nến |
| await past("candle", index)      | Trả về dữ liệu của cây nến trước đó với **index** là thứ tự cây nến |

## Danh sách chỉ báo và thuộc tính

Một số bạn sẽ hỏi tại sao tên chỉ báo lại kiểu có đóng mở ngoặc rồi có số ở trong thì nó là tên của chỉ báo được hiển thị trên biểu đồ của binance

<img src="https://i.imgur.com/hz2KrRy.png"  />

Do vậy khi sử dụng chỉ báo nào thì cần phải khai báo tên trùng với tên trên biểu đồ.

**Lưu ý: những chỉ báo có nhiều giá trị (thuộc tính) sẽ được liệt kê dưới bảng này. Những chỉ báo chỉ có 1 giá trị duy nhất nhất như đường trung bình, volume, RSI thì cách lấy giá trị tương tự nhau**

```javascript
// Những chỉ báo chỉ có 1 giá trị
var rsi = await now("RSI(14)");
var ma10 = await now("MA(10,close,2)");
var volume = await now("VOLUME(20)");
log(rsi.value); 
log(ma10.value);
log(volume.value);

// Những chỉ báo này có nhiều hơn 1 giá trị
var bb = await now("BB(20,2)");
log(bb.upper_band);
log(bb.middle_band);
log(bb.lower_band);
```

| Tên chỉ báo <br />và những thứ khác                    | Tên mẫu (dùng trong code)       | Thuộc tính                                                   | Giải thích thuộc tính                                        |
| ------------------------------------------------------ | ------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| Những chỉ báo chỉ có<br />một giá trị duy nhất (Vd MA) | Ví dụ: MA(10,close,2)           | **value**                                                    | Giá trị của chỉ báo đó                                       |
| Nến                                                    | CANDLE                          | **open<br />high<br />low<br />close**                       | Giá mở cửa <br />Giá cao nhất<br />Giá thấp nhát<br />Giá đóng cửa |
| Bollinger Band                                         | BB(20,2)                        | **upper_band**<br />**middle_band**<br />**lower_band**      | Giá trị band trên<br />Giá trị band giữa<br />Giá trị band dưới |
| Aroon                                                  | AROON(14)                       | **upper**<br />**lower**                                     |                                                              |
| Chande Kroll Stop                                      | CHANDEKROLLSTOP(10,1,9)         | **long<br />short**                                          |                                                              |
| Directional Movement (DMI)                             | DMI(14,14)                      | **plus_di<br />minus_di<br />adx**                           | +DI<br />-DI<br />ADX                                        |
| Donchian Channels                                      | DC(20)                          | **lower<br />upper<br />middle**                             |                                                              |
| EMA Cross                                              | EMACROSS(9,26)                  | **short<br />long<br />crosses**                             | <br /><br />null khi không cắt                               |
| Envelope                                               | ENV(20,10)                      | **middle<br />upper<br />lower**                             |                                                              |
| Fisher Transform                                       | FISHER(9)                       | **fisher<br />trigger**                                      |                                                              |
| Ichimoku Cloud                                         | ICHIMOKU(9,26,52,26)            | **conversion_line<br />base_line<br />lagging_span<br />lead1<br />lead2** |                                                              |
| Keltner Channels                                       | KC(20,1)                        | **upper<br />middle<br />lower**                             |                                                              |
| Klinger Oscillator                                     | KLINGEROSCILLATOR               | **plot<br />signal**                                         |                                                              |
| Know Sure Thing                                        | KST(10,15,20,30,10,10,10,15,9)  | **kst<br />signal**                                          |                                                              |
| MA Cross                                               | MACROSS(9,26)                   | **short<br />long<br />crosses**                             | <br /><br />null khi không cắt                               |
| MACD                                                   | MACD(12,26,close,9)             | **histogram<br />macd<br />signal**                          |                                                              |
| Moving Average Channel                                 | MAC(20,20,0,0)                  | **upper<br />lower**                                         |                                                              |
| Price Channel                                          | PC(20,0)                        | **highprice_line<br />lowprice_line**                        |                                                              |
| Relative Vigor Index                                   | RVGI(10)                        | **rvgi<br />signal**                                         |                                                              |
| SMI Ergodic Indicator/Oscillator                       | SMIIO(5,20,5)                   | **indicator<br />signal<br />oscillator**                    |                                                              |
| Stochastic                                             | STOCH(14,1,3)                   | **k<br />d**                                                 | Đường %k<br />Đường %d                                       |
| Stochastic RSI                                         | STOCHRSI(14,14,3,3)             | **k<br />d**                                                 | Đường %k<br />Đường %d                                       |
| True Strength Indicator                                | TRUESTRENGTHINDICATOR(25,13,13) | **line1<br />line2**                                         |                                                              |
| Vortex Indicator                                       | VI(14)                          | **vi_plus<br />vi_minus**                                    | vi+<br />vi-                                                 |
| Williams Alligator                                     | ALLIGATOR(21,13,8)              | **jaw<br />teeth<br />lips**                                 |                                                              |
| Williams Fractal                                       | FRACTALS(2)                     | **down_fractals<br />up_fractals**                           |                                                              |
| ZigZag                                                 | ZIGZAG(5,10)                    | **value**                                                    | có thể null                                                  |

