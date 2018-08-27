Avoiding_common_attacks.md

ProofOfDevice smart contract is carefully designed and coded to avoid all common attacks and exploits that were found and implements security measures to avoid any similar ones. 

ProofOfDevice smart contract is carefully designed with security in mind to invoke a circuit breaker to pause and unpause the smart contract if a situation arises. This provides owner of the contract to have full control to pause the contract which will not accept any new transactions but still the existing transactions and events will be available for end users. 

Security within ProofOfDevice is built at 2 levels. 

Contract level security: At contract level the owner of the contract can pause and unpause the contract anytime. The functionality is included as part of open zeppelin  ownable and pausable libraries
import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';


Function level security: At each function level, there are several modifiers to validate device ownership, transaction type and transaction status. They are
modifier deviceIdExist(bytes32 _deviceId)
modifier deviceIdNotExist(bytes32 _deviceId)
modifier isDeviceOwner(bytes32 _deviceId)
modifier isTxStatusZero(bytes32 _deviceId)
require(deviceMap[_deviceId].txStatus == 0)
modifier isTxStatusOne(bytes32 _deviceId)
require(deviceMap[_deviceId].txStatus == 1)



Following are the common attacks and prevention exists in ProofOfDevice smart contract.


1) External calls: There are no external calls in the smart contract

2) Reentrancy: Contract functions does not allow any reentrancy

3) Cross function race condition: Function calls prevent calling another function within the smart contract

4) Timestamp dependence: There are no timestamp dependent actions within the smart contract

5) Integer overflow/underflow: There are no integer calculations code 

6) Forcibly sending ether to the contract: This contract does not accept any ether. 

7) DoS block gas limit: With modifiers in place, the function is not executed if the gas limit is low.

8) Transaction order limitance: Each transaction executed on a device ID has Tx type and status. This prevents users to change state from one to the other bypassing multiple status and test. 
E.g. Only when a device ID is in requested transfer state the owner can approve the transfer request. 

If the device is already in a requested transfer state, if msg sender is not owner then no other transaction is accepted. 



Visibility in functions and state variables:

Each function is clearly defined as external, public, internal or private. State variables are clearly marked as public. 
