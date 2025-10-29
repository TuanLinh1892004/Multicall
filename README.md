# 🧠 Hardhat v3 + Multicall Example

Đây là repository minh họa việc **sử dụng Hardhat v3** thông qua ví dụ contract **Multicall**.

---

## 🚀 Tính năng mới của Hardhat v3

Hardhat v3 mang đến nhiều cải tiến đáng chú ý giúp việc phát triển smart contract dễ dàng và bảo mật hơn:

- 🔒 **Không cần sử dụng `.env`** để quản lý biến môi trường.  

- ⎛⎝ ≽ &gt; ⩊ &lt; ≼ ⎠⎞ **Tích hợp sẵn EIP7702**

- 🗝️ **Lưu trữ secret an toàn** thông qua lệnh:
  ```bash
  npx hardhat keystore set SECRET
  ```

- 🧱 **Triển khai bằng Ignition** – framework mới giúp deploy và tự động lưu contract address & ABI.

- ⚙️ **Tích hợp sẵn Foundry** – có thể test các file Solidity trực tiếp (.t.sol).

- 🧪 **Test contract Solidity**:
  ```bash
  npx hardhat test solidity
  ```

- 💻 **Test Node.js trên mạng local**:
  ```bash
  npx hardhat test nodejs
  ```

- ✅ **Xác minh contract (verify)** trên Etherscan:
  ```bash
  npx hardhat verify etherscan --network yourNetwork 0xyourAddress constructorParameter1 constructorParameter2 ...
  ```
  hoặc
  ```bash
  npx hardhat ignition verify chain-11155111 --network sepolia
  ```

---

## 🔗 Multicall Contract
Repository này bao gồm hai cách sử dụng Multicall:

1. 🧩 Contract **Multicall** truyền thống

    Dùng như contract trung gian, cho phép:
    - **Multi-read**: gọi nhiều hàm view trong cùng một giao dịch.
    - **Multi-write**: thực hiện nhiều giao dịch thay đổi trạng thái trong cùng một lần gửi.

2. ⚡ **EIP-7702** – EOA with Code

    Cho phép ví EOA đính kèm thêm đoạn bytecode tạm thời để thực thi logic nâng cao (như multicall, batch send, v.v).

    Ví dụ minh họa cách sử dụng EIP-7702 được trình bày trong thư mục `scripts/`.