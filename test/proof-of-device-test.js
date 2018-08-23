var PoD = artifacts.require('../contracts/ProofOfDevice.sol')

//var PoD = artifacts.require('../contracts/PodTest.sol')

//contract
contract('ProofOfDevice', function(accounts) {

    const owner = accounts[0]
    const creator = accounts[1]
    const sponsor = accounts[2]
    const regUser = accounts[3]
    const emptyAddress = '0x0000000000000000000000000000000000000000'
    const inputString1 = 'C02PD34MFVH8'
    const inputString2 = 'DNPVL584JCLH'
    const inputString3 = 'DNPVL584JCLJ'
    const inputString4 = 'C02PD34MFVH7'
    const wrongString = '0x4d';

    var eventEmitted=false
    var eventEmitted1=false;
    var eventEmitted2=false;

    var inputString1_bytes32 = web3.fromAscii(inputString1);
    //console.log('Input String in Bytes32 1 - ' + inputString1_bytes32);
    var inputString2_bytes32 = web3.fromAscii(inputString2);
      //console.log('Input String in Bytes32 2 - ' + inputString2_bytes32);
    var inputString3_bytes32 = web3.fromAscii(inputString3);
      //console.log('Input String in Bytes32 3 - ' + inputString3_bytes32);
    var inputString4_bytes32 = web3.fromAscii(inputString4);
      //console.log('Input String in Bytes32 4 - ' + inputString4_bytes32);

        it("1. Store Serial Numbers and confirm existance in blockchain", async() => {
              const pod = await PoD.deployed()

              //console.log(web3.toUtf8(inputString1))
              var event1 = pod.deviceCreated()
              await event1.watch((err, res) => {
                    //console.log('devID: ' + res.args.index.toString())
                    eventEmitted1 = true
              })

              await pod.claimDevice(inputString1_bytes32)

              var event2 = pod.deviceCreated()
              await event2.watch((err, res) => {
                    //console.log('devID: ' + res.args.index.toString())
                    eventEmitted2 = true
              })

              await pod.claimDevice(inputString2_bytes32)

              var devId1 = await pod.getDeviceId.call(inputString1_bytes32)
              var devId2 = await pod.getDeviceId.call(inputString2_bytes32)
              var devId3 = await pod.isDeviceId.call(inputString3_bytes32)

              var allDevices = await pod.getDevicesByOwner.call()

              //console.log(allDevices);

              //console.log('Device 1: ' + web3.toAscii(allDevices[0]))
              //console.log('Device 2: ' + web3.toAscii(allDevices[1]))

              assert.equal(eventEmitted1, true, 'Event 1 is emmitted')
              assert.equal(eventEmitted2, true, 'Event 2 is emmitted')
              assert.equal(devId1.valueOf(), 0, 'DEV ID Value is 0')
              assert.equal(devId2.valueOf(), 1, 'DEV ID Value is 1')
              assert.equal(devId3, false, 'DEV ID Value is 0 for wrong string')
              assert.equal(((web3.toAscii(allDevices[0])).replace(/\0[\s\S]*$/g,'')),(inputString1), 'Input String 1 is same')
              assert.equal(((web3.toAscii(allDevices[1])).replace(/\0[\s\S]*$/g,'')),(inputString2), 'Input String 2 is same')



        })

        it("2. Request proof for Serial Number and confirm transaction exists", async() => {
              const pod = await PoD.deployed()

              var event1 = pod.txnCreated()
              await event1.watch((err, res) => {
                      eventEmitted1 = true
                    //console.log(res.args)
                    //console.log('devId: ' + res.args.index.toString())

              })

              await pod.requestProof(inputString2_bytes32, {from: accounts[1]})

              var txDetails = await pod.getTxnByDeviceId.call(inputString2_bytes32)

              //console.log('TxDetails: ' + txDetails[0], txDetails[1], txDetails[2], txDetails[3], txDetails[4].toString(), txDetails[5].toString())

              assert.equal(eventEmitted1, true, 'Txn Event is emmitted')
              assert.equal(txDetails[1], 1, 'Device ID Value is 1')


        })



        it("3. Confirm proof of device ownership and confirm transaction exists", async() => {
              const pod = await PoD.deployed()

              var event1 = pod.deviceProof()
              await event1.watch((err, res) => {
                      eventEmitted1 = true
                    //console.log(res.args)
                    //console.log('devId: ' + res.args.index.toString())

              })

              var result = await pod.approveProof(inputString2_bytes32)

              //console.log('Approve result: ' + result.valueOf())

              var txDetails = await pod.getTxnByDeviceId.call(inputString2_bytes32)

              //console.log('TxDetails: ' + txDetails[0], txDetails[1], txDetails[2], txDetails[3], txDetails[4].toString(), txDetails[5].toString())

              assert.equal(eventEmitted1, true, 'Txn Event is emmitted')
              //assert.equal(result.valueOf(), true, 'Output is true')
              assert.equal(txDetails[1], 1, 'Device ID Value is 1')


        })



        it("4. Request/Approve device ownership and confirm transaction exists", async() => {
              const pod = await PoD.deployed()

              var allDevices = await pod.getDevicesByOwner.call()

              //console.log('Current Device Owner: ' + web3.toAscii(allDevices[0]))

              var currentDeviceOwner = web3.toAscii(allDevices[0])

              var event1 = pod.txnCreated()
              await event1.watch((err, res) => {
                      eventEmitted1 = true
                    //console.log(res.args)
                    //console.log('TxType: ' + res.args.txType.toString())
                    //console.log('txId: ' + res.args.txId.toString())

              })

              var result1 = await pod.requestTransfer(inputString1_bytes32, {from: accounts[1]})

              //console.log('requestTransfer: ' + result1[0])

              var event2 = pod.deviceTransfer()
              await event2.watch((err, res) => {
                      eventEmitted2 = true
                    //console.log(res.args)
                    //console.log('txId: ' + res.args.txId.toString())

                    //console.log('call from account 2: ' + pod.getDevicesByOwner.call({from: accounts[1]}))

              })

              let result2 = await pod.approveTransfer(inputString1_bytes32, accounts[1])
              //console.log('approveTransfer: ' + result2.valueOf())
              allDevices = await pod.getDevicesByOwner.call({from: accounts[1]})
              //console.log('New Device Owner 1: ' + web3.toAscii(allDevices[0]))
              var newDeviceOwner = web3.toAscii(allDevices[0])

              assert.equal(eventEmitted1, true, 'Txn Event is emmitted')
              assert.equal(currentDeviceOwner, newDeviceOwner, 'Ownership transferred successfully')


        })

        it("5. Confirm if contract is Pausable ", async() => {
          const pod = await PoD.deployed()

          var event1 = pod.Pause()
          await event1.watch((err, res) => {
                  eventEmitted1 = true

          })

          await pod.pause()

          assert.equal(eventEmitted1, true, 'Txn Pause() Event is emmitted')
        });

        it("6 Confirm if contract is UnPausable ", async() => {
          const pod = await PoD.deployed()

          var event1 = pod.Unpause()
          await event1.watch((err, res) => {
                  eventEmitted1 = true

          })

          await pod.unpause()

          assert.equal(eventEmitted1, true, 'Txn Unpause() Event is emmitted')
        });



        /*

        it("6. Confirm all events fired ", async() => {
          const pod = await PoD.deployed()

          var events = pod.allEvents({fromBlock: 0, toBlock: 'latest'});
              events.get(function(error, res) {
                          console.log(res)
                        });

              })


              */

  });
