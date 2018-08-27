Design_pattern_desicions.md



Proof of device smart contract does not include any transfer of tokens, or ether. However there are three levels of users that can interact with the smart contract. Based on their levels only certain functions can be executed. 

Ownership:

3 user levels

Owner: Smart contract owner who is equivalent to super user and can temporarily pause and unpause a contract. 
Device Owner: When a new device ID is registered the creator becomes the owner of the device ID. The owner has full control over the device ID and can execute destruct function to delete device ID
Tx Originator: Transaction originator is any common user who would request device ID proof from device owners. They will not be able to delete the device ID or modify any device data. 

The clearly defined 3 levels of roles help in providing secure and easy access to smart contract and ownership.




Maintenance:

Data Segregation: 

ProofOfDevice smart contract only stores the device ID and transactions related to that device ID. This project will be enhanced in future to store additional device information in IPFS and infer the device ID on this contract. By keeping the device ID and device information separately avoids costly data migration in future.



Lifetime:

One of the true value of decentralization is not to have single power of control or single point of failure. Hence this contract does not have any expiration or destruct function by the owner. Hence the smart contract will continue to exist in the blockchain with data and owners of device ID can continue using it with single entity to control and single point of failure. 




Security:

Security of smart contract is very important for its existence. ProofOfDevice smart contract is carefully designed with security in mind to invoke a circuit breaker to pause and unpause the smart contract if a situation arises. This provides owner of the contract to have full control to pause the contract which will not accept any new transactions but still the existing transactions and events will be available for end users. 

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

 
 
 
Emitted Events:

Each function when executed emits events which are recorded in the contract blockchain for history. 

event deviceCreated(uint256 index, bytes32 deviceId, address deviceOwner, uint timestamp);

event txnCreated(uint256 index, bytes32 deviceId, address txnOriginator, uint txType, uint status, uint timestamp);

event deviceProof(uint256 index, bytes32 deviceId, address deviceOwner, uint timestamp);

event deviceTransfer(uint256 index, bytes32 deviceId, address fromOwner, address toOwner, uint timestamp);

event deviceDestruct(uint256 index, bytes32 deviceId, address deviceOwner, uint timestamp);
