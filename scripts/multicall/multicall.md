# Multicall

Hướng dẫn sử dụng **contract Multicall**.

> Không cần thư viện **viem** để chạy; bất kỳ thư viện nào hỗ trợ **read** và **write** blockchain đều dùng được.

Thông tin triển khai: [multicall](./multicall.json)

> **Lưu ý:** Đây là contract có **access control**. Muốn **write**, bạn phải được quyền **admin**.

---

## Cấu trúc giao dịch

Mỗi giao dịch sẽ bao gồm các trường:

- **`to`**: địa chỉ nhận  
- **`value`**: native token gửi đi  
- **`data`**: function muốn gọi  

---

## Read

Ví dụ sử dụng: [read](./read.ts)

1. Viết ra các **hàm view/pure** muốn gọi.  
2. Để chúng **dạng array** và truyền vào contract multicall.  
3. Kết quả nhận được là **1 danh sách các chuỗi bytes (`bytes[][]`)**:  
   - Chuỗi thứ i là kết quả của giao dịch thứ i  
   - Bạn cần **decode / cast** để ra kết quả mong muốn

---

## Write

Ví dụ sử dụng: [write](./write.ts)

- Tương tự với **read**, nhưng **không có kết quả trả về**.
- Lưu ý rằng địa chỉ trực tiếp thực hiện chuỗi các giao dịch là contract `multicall` chứ không phải là bạn, hãy sử dụng **EIP7702** để tránh gặp lỗi
