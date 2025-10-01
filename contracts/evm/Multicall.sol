// SPDX-License-Identifier: MIT
pragma solidity ^0.8;

contract Multicall {
    struct Call {
        address receiver;
        uint256 value;
        bytes data;
    }

    function multicall(Call[] memory calls) external payable {
        for (uint256 i = 0; i < calls.length; i++) {
            bool success;
            if (calls[i].value > 0) {
                (success,) = calls[i].receiver.call{value: calls[i].value}(calls[i].data);
            } else {
                (success,) = calls[i].receiver.call(calls[i].data);
            }
            
            require(success, string(abi.encodePacked("Multicall failed at tx ", _toString(i))));
        }
        if (address(this).balance > 0) {
            (bool ok,) = payable(msg.sender).call{value: address(this).balance}("");
            require(ok, "transfer failed");
        }
    }

    function _toString(uint256 value) internal pure returns (string memory str) {
        assembly {
            let m := mload(0x40)
            str := add(m, 0x20)
            let end := str

            for { let temp := value } 1 {} {
                str := sub(str, 1)
                mstore8(str, add(48, mod(temp, 10)))
                temp := div(temp, 10)
                if iszero(temp) { break }
            }

            let length := sub(end, str)
            str := sub(str, 0x20)
            mstore(str, length)
            mstore(0x40, add(end, 0x20))
        }
    }

    fallback() external payable {}
    receive() external payable {}
}