# EIP7702

Để có thể batch các giao dịch lại và thực hiện trong 1 giao dịch duy nhất, **EIP7702** cho phép ví EOA **đính kèm 1 đoạn bytecode của contract** vào địa chỉ ví và thực thi. Có thể hiểu như ví EOA `delegatecall` tới 1 contract logic nào đó.

---

Để bắt đầu, ta có ví dụ sau:  
**Bob** muốn `mint` vài token `TROLL` (ERC20) trên mạng Sepolia và `transfer` cho **Alice**. Bob muốn batch 2 giao dịch mint và transfer để tiết kiệm gas.

Bob viết 1 script để sử dụng chuẩn **EIP7702**, [code Bob](./eip7702-no-hardhat.ts) khá là xấu nên Bob sẽ giải thích từng bước.

---

Bob sử dụng thư viện **viem**, một thư viện có hỗ trợ cho **EIP7702**.

---

Đầu tiên, Bob triển khai contract **`EIP7702Multicall`** giúp batch nhiều giao dịch. Khi dùng EIP7702, ví EOA của Bob sẽ đính kèm logic của contract `EIP7702Multicall` và có thể thực hiện nhiều giao dịch cùng lúc.  
Bob đã triển khai sẵn giúp các bạn, mà Bob bất cẩn chỉ mới triển khai ở chain **Sepolia**. Nếu các bạn muốn dùng multicall ở các chain khác thì hãy nhờ Bob nhé.

---

Tiếp theo, Bob khởi tạo **`publicClient`** và **`walletClient`**, client dành cho việc **đọc và ghi blockchain**.

---

Contract **`EIP7702Multicall`** yêu cầu nhập vào các giao dịch, gồm:

- **`to`**: địa chỉ nhận  
- **`value`**: native token gửi  
- **`data`**: function được gọi  

Bob muốn `mint` và `transfer` TROLL cho Alice, nên Bob encode các function lại để có thể dùng multicall. Sau đó Bob encode function của multicall để có thể đính kèm vào ví EOA của Bob. Thật tiện thay, thư viện viem có sẵn hàm `encodeFunctionData` để hỗ trợ.

---

Để đính kèm, Bob chỉ cần ký ủy quyền cho contract `EIP7702Multicall` – *authorization*.

---

Bước cuối cùng là thực hiện giao dịch:  
Bob tạo giao dịch gửi tới chính **Bob**, `data` là function multicall đã encode, và thêm danh sách `authorizationList` bao gồm `authorization` đã ký.

---

Vậy là Bob đã chia sẻ chút TROLL cho Alice.  
Nếu bạn cũng muốn nắm giữ TROLL, hãy liên hệ cho [Bob](https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1).
