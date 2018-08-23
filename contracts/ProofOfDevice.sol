pragma solidity ^0.4.24;


import 'zeppelin-solidity/contracts/ownership/Ownable.sol';
import 'zeppelin-solidity/contracts/lifecycle/Pausable.sol';

/** @title Proof Of Device. */
contract ProofOfDevice is Ownable, Pausable {

    struct Device {
      uint index;
      address deviceOwner;
      address txOriginator;
      uint txType;
      uint txStatus;

    }

    address public owner;

    mapping (bytes32 => Device) private deviceMap;

    bytes32[] public deviceIds;


    event deviceCreated(uint256 index, bytes32 deviceId, address deviceOwner, uint timestamp);
    event txnCreated(uint256 index, bytes32 deviceId, address txnOriginator, uint txType, uint status, uint timestamp);
    event deviceProof(uint256 index, bytes32 deviceId, address deviceOwner, uint timestamp);
    event deviceTransfer(uint256 index, bytes32 deviceId, address fromOwner, address toOwner, uint timestamp);
    event deviceDestruct(uint256 index, bytes32 deviceId, address deviceOwner, uint timestamp);

    modifier deviceIdExist(bytes32 _deviceId){
        require(isDeviceId(_deviceId));
        _;
    }

    modifier deviceIdNotExist(bytes32 _deviceId){
        require(!isDeviceId(_deviceId));
        _;
    }

    modifier isDeviceOwner(bytes32 _deviceId){
        require(deviceMap[_deviceId].deviceOwner == msg.sender);
        _;

    }

    modifier isTxStatusZero(bytes32 _deviceId){
        require(deviceMap[_deviceId].txStatus == 0);
        _;

    }

    modifier isTxStatusOne(bytes32 _deviceId){
        require(deviceMap[_deviceId].txStatus == 1);
        _;

    }

    constructor() public {

        owner=msg.sender;
    }

    /** @dev Checks to see if device exist
      * @param _deviceId ID of the device.
      * @return isIndeed True if the device ID exists.
      */
    function isDeviceId(bytes32 _deviceId)
       public
       view
       returns(bool isIndeed)
     {
       if(deviceIds.length == 0) return false;
       return (deviceIds[deviceMap[_deviceId].index] == _deviceId);
     }


     /** @dev returns the index of stored deviceID
       * @param _deviceId ID of the device.
       * @return _index index of the device.
       */
     function getDeviceId(bytes32 _deviceId)
        public
        view
        deviceIdExist(_deviceId)
        returns(uint _index)
      {
        return deviceMap[_deviceId].index;
      }

    /** @dev returns address of device owner
      * @param _deviceId ID of the device.
      * @return deviceOwner device owner's address
      */
     function getOwnerByDevice(bytes32 _deviceId)
          public
          view
          returns (address deviceOwner){

              return deviceMap[_deviceId].deviceOwner;

     }

     /** @dev returns up to 10 devices for the device owner
       * @return _deviceIds device ID's of the owner
       */
     function getDevicesByOwner() public view returns(bytes32[10] _deviceIds) {

         uint numDevices;
         bytes32[10] memory devicesByOwner;

         for(uint i = 0; i < deviceIds.length; i++) {

             if(addressEqual(deviceMap[deviceIds[i]].deviceOwner,msg.sender)) {

                 devicesByOwner[numDevices] = deviceIds[i];
                 if (numDevices == 10) {
                   break;
                 }
                 numDevices++;

             }

         }

         return devicesByOwner;
     }

     /** @dev returns up to 10 transactions of device owner
       * @return _deviceIds device ID's of the msg.sender transactions
       */
     function getDevicesByTxn() public view returns(bytes32[10] _deviceIds) {

         uint numDevices;
         bytes32[10] memory devicesByTxOriginator;

         for(uint i = 0; i < deviceIds.length; i++) {

             if(addressEqual(deviceMap[deviceIds[i]].txOriginator,msg.sender)) {

                 devicesByTxOriginator[numDevices] = deviceIds[i];
                 if (numDevices == 10) {
                   break;
                 }
                 numDevices++;

             }

         }

         return devicesByTxOriginator;
     }


     /** @dev returns transaction by device ID
       * @param _deviceId ID of the device.
       * @return deviceMap info of that device
       */
     function getTxnByDeviceId(bytes32 _deviceId)
               public
               view
               deviceIdExist(_deviceId)
               returns(
                        bytes32,
                        uint,
                        address,
                        address,
                        uint,
                        uint) {

                   return (_deviceId, deviceMap[_deviceId].index, deviceMap[_deviceId].deviceOwner, deviceMap[_deviceId].txOriginator, deviceMap[_deviceId].txType, deviceMap[_deviceId].txStatus);

     }

     /** @dev when a new device ID is registered
       * @param _deviceId ID of the device.
       * @return index of stored device
       */
     function claimDevice (bytes32 _deviceId)
          public
          whenNotPaused()
          deviceIdNotExist(_deviceId)
          returns(uint index) {

             deviceMap[_deviceId].deviceOwner = msg.sender;
             deviceMap[_deviceId].txOriginator = msg.sender;
             deviceMap[_deviceId].txType = 0;
             deviceMap[_deviceId].txStatus = 1;
             deviceMap[_deviceId].index = deviceIds.push(_deviceId)-1;

             emit deviceCreated(deviceMap[_deviceId].index, _deviceId, msg.sender, block.timestamp);

             return deviceIds.length-1;

     }

     /** @dev returns request proof of device
       * @param _deviceId ID of the device.
       * @return _index info of that device
       */
      function requestProof(bytes32 _deviceId)
          public
          whenNotPaused()
          deviceIdExist(_deviceId)
          isTxStatusOne(_deviceId)
          returns(uint _index) {

              deviceMap[_deviceId].txOriginator=msg.sender;
              deviceMap[_deviceId].txType=1;
              deviceMap[_deviceId].txStatus=0;

              emit txnCreated(deviceMap[_deviceId].index, _deviceId, msg.sender, deviceMap[_deviceId].txType, deviceMap[_deviceId].txStatus,block.timestamp);

              return deviceMap[_deviceId].index;
      }


      /** @dev returns approve proof of device
        * @param _deviceId ID of the device.
        * @return bool  - approval
        */
      function approveProof(bytes32 _deviceId)
              public
              whenNotPaused()
              deviceIdExist(_deviceId)
              isDeviceOwner(_deviceId)
              isTxStatusZero(_deviceId)
              returns(bool) {

                  require(deviceMap[_deviceId].deviceOwner == msg.sender);
                  deviceMap[_deviceId].txStatus=1;

                  emit deviceProof(deviceMap[_deviceId].index, _deviceId, msg.sender, block.timestamp);
                  return true;
      }

      /** @dev returns request transfer of device
        * @param _deviceId ID of the device.
        * @return index of stored device
        */
      function requestTransfer(bytes32 _deviceId)
            public
            whenNotPaused()
            deviceIdExist(_deviceId)
            isTxStatusOne(_deviceId)
            returns(uint index) {

              deviceMap[_deviceId].txOriginator=msg.sender;
              deviceMap[_deviceId].txType=2;
              deviceMap[_deviceId].txStatus=0;

              emit txnCreated(deviceMap[_deviceId].index, _deviceId, msg.sender, deviceMap[_deviceId].txType, deviceMap[_deviceId].txStatus,block.timestamp);

              return deviceMap[_deviceId].index;

      }

      /** @dev returns approve transfer of device
        * @param _deviceId ID of the device.
        * @return bool approval
        */
      function approveTransfer (bytes32 _deviceId, address newOwner)
              public
              whenNotPaused()
              deviceIdExist(_deviceId)
              isDeviceOwner(_deviceId)
              isTxStatusZero(_deviceId)
              returns(bool) {

                  require(deviceMap[_deviceId].deviceOwner == msg.sender);
                  require(deviceMap[_deviceId].txOriginator == newOwner);

                  deviceMap[_deviceId].deviceOwner=newOwner;
                  deviceMap[_deviceId].txStatus=1;

                  emit deviceTransfer(deviceMap[_deviceId].index, _deviceId, msg.sender, deviceMap[_deviceId].deviceOwner, block.timestamp);

                  return true;

      }
      /** @dev returns true if delete is successful
        * @param _deviceId ID of the device.
        * @return bool delete
        */
      function destructDevice(bytes32 _deviceId)
              public
              whenNotPaused()
              deviceIdExist(_deviceId)
              isDeviceOwner(_deviceId)
              returns(bool success) {

                  uint rowToDelete = deviceMap[_deviceId].index;
                  bytes32 keyToMove = deviceIds[deviceIds.length-1];
                  deviceIds[rowToDelete] = keyToMove;
                  deviceMap[_deviceId].index = rowToDelete;
                  deviceIds.length--;

                  emit deviceDestruct(rowToDelete, _deviceId, msg.sender, block.timestamp);
                  return true;

      }

        //Helper Functions

        /** @dev compares two String equal or not
          * @param a first string, b second string.
          * @return bool true if match
          */
        function bytesEqual(bytes32 a, bytes32 b) private pure returns (bool) {
           return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
         }

       /** @dev compares two address equal or not
         * @param a first address, b second address.
         * @return bool true if match
         */
       function addressEqual(address a, address b) private pure returns (bool) {
          return keccak256(abi.encodePacked(a)) == keccak256(abi.encodePacked(b));
        }



}
