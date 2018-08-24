PROOF OF DEVICE

In our daily life we carry several digital devices with us. The only thing that ties as proof of ownership of those devices is either the data that resides on the device or purchase receipt. Both are perishable. But if the device data gets erased then the only way to prove the device ownership is with the purchase receipt. While all devices carry a unique serial number, often this is not tied to purchase receipt. Odds are against the owner if the purchase receipt is lost or simply does not exist.

This is a good use case for storing the device serial number or unique identification number in the blockchain. The functionality includes not just storing the serial number but also have the ability for the owner to prove device ownership. At the same time when the device is sold or transferred then the ownership on the blockchain should also be transferred to another owner.

The following lists the functionality available in this smart contract. There are 6 functions that can be executed in /contracts/ProofOfDevice.sol

1) Register Device (function claimDevice): The owner of the device with unique serial number executes this function to store the unique serial number in the blockchain. For each unique Ethereum wallet address, up to 10 serial numbers can be stored. The function checks for duplicates and executes if the same serial number is not found. An event is emitted to record the transaction.

2) Request Proof (function requestProof) : Imagine you are about to buy a phone through craigslist or eBay and wanted to confirm if the device serial is real and verify owner. You get the serial number from the listing or listing owner. Then you execute the request proof function with a unique serial number. If the serial number already exists in the contract then the transaction is executed successfully and an event is emitted sending notification to the device owner.

3) Approve Proof (function approveProof): When someone request proof, as a device owner you can approve proof which will execute transaction and emit event if the transaction is successful. This proves the device ownership

4) Request Transfer (function requestTransfer) : When the device is sold or transferred to another owner, the new owner can request transfer of serial number. Once the transaction is successful, an event is emitted to notify the owner to approve transfer.

5) Approve Transfer (function approveTransfer) : Device owner can approve transfer by calling this function and sending the serial number. If the transaction is successful then the device ownership is successfully changed and the original owner can no longer have control over this device ID.

6) Destruct device (function destructDevice): If the device no longer exists or device owner does not want the device ID to be in the blockchain then this function can be executed by the device owner. If the transaction is executed successfully then the device ID entry is deleted. However all the events emitted for the device is still there to prove transaction history.

Find the Youtube link for functionality and UI demonstration. Youtube link: https://youtu.be/V-lNcSGaweg

Installation & Execution steps

Pre-requsites: truffle, node, npm, metamask, ganache, ganache-cli

NOTE: the ganache port is set to 7545. If you are using ganaceh-cli, please change it to 8545 in truffle.js

Step 1: Download project zip file from github and unzip to a folder


Step 2: Install zeppelin-solidity using the command

command to execute: npm install -E zeppelin-solidity

---------------- Step 2 Output ----------------------------------------
npm WARN deprecated zeppelin-solidity@1.12.0: This package has been renamed to openzeppelin-solidity. Please update your dependency, or you will no longer receive updates.
+ zeppelin-solidity@1.12.0
added 1 package from 1 contributor and audited 2 packages in 2.85s
found 0 vulnerabilities
----------------End of Output ----------------------------------

Step 3: Compilation should complete successfully without errors

command to execute: truffle compile

---------------- Step 3 Output ----------------------------------------
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/ProofOfDevice.sol...
Compiling zeppelin-solidity/contracts/lifecycle/Pausable.sol...
Compiling zeppelin-solidity/contracts/ownership/Ownable.sol...
Writing artifacts to ./build/contracts
----------------End of Output ----------------------------------

Step 4: Confirm 6 tests are passed successfully

command to execute: truffle test

---------------- Step 4 Output ----------------------------------------
Using network 'development'.

  Contract: ProofOfDevice
    ✓ 1. Store Serial Numbers and confirm existance in blockchain (365ms)
    ✓ 2. Request proof for Serial Number and confirm transaction exists (150ms)
    ✓ 3. Confirm proof of device ownership and confirm transaction exists (111ms)
    ✓ 4. Request/Approve device ownership and confirm transaction exists (232ms)
    ✓ 5. Confirm if contract is Pausable  (59ms)
    ✓ 6 Confirm if contract is UnPausable  (107ms)


  6 passing (1s)
  ----------------End of Output ----------------------------------


Step 5: Migration to development environment should be completed successfully. Note down the deployed contract address just for reference.

command to execute: truffle migrate

---------------- Step 5 Output ----------------------------------------
truffle migrate
Using network 'development'.

Running migration: 1_initial_migration.js
 Deploying Migrations...
 ... 0x723c1d337a824781d986b56094a9c75c53a392e1b0ca270dee09bf8dde8df672
 Migrations: 0xc298c9fac91e6a5825c78b025028d34fdb66df36
Saving successful migration to network...
 ... 0xb9c4378613ce38e0f02039f0797f3ef2a68d02d0f16e49bd6291e3c0b5486c5c
Saving artifacts...
Running migration: 2_deploy_contracts.js
 Deploying ProofOfDevice...
 ... 0xb1e051f6abe73d5c28b5700687ba981a96fbe3ae3e6b1b0582370976dce12c6b
 ProofOfDevice: 0x579ddd711d5d14e539d61ed42c5741de16d1e613
Saving successful migration to network...
 ... 0xd00a82812b390986c24ad86259471b1caa8c3cc07fb57683a0f8f37949ba2629
Saving artifacts...
----------------End of Output ----------------------------------

Step 6: Install npm lite-server to serve the UI

Command to execute: npm install --save-dev lite-server

---------------- Step 6 Output ----------------------------------------

> fsevents@1.2.4 install /Users/arunnedun/source/proof-of-devices/node_modules/fsevents
> node install

[fsevents] Success: "/Users/arunnedun/source/proof-of-devices/node_modules/fsevents/lib/binding/Release/node-v64-darwin-x64/fse.node" already installed
Pass --update-binary to reinstall or --build-from-source to recompile
+ lite-server@2.4.0
----------------End of Output ----------------------------------

Step 7: Start the UI to serve the web page from /src folder

Command to execute: npm run dev 

// Serves the front-end on http://localhost:3000

---------------- Step 7 Output ----------------------------------------
> proof-of-device@1.0.0 dev /Users/arunnedun/source/proof-of-devices
> lite-server
----------------End of Output ----------------------------------

User interface will open in chrome browser. Based on the functionality explained in the youtube video, please test and provide feedback.
