var tableData = [{}];
var localData = [{}];

App = {
  web3Provider: null,
  contracts: {},

  init: function() {


    return App.initWeb3();
  },

  getContract: function() {

    App.contracts.Pod.deployed().then(function(instance) {
    //console.log(instance);
  });

  },

  initWeb3: function() {
    // Is there an injected web3 instance?

    if (typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      //App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');

    } else {
      // If no injected web3 instance is detected, fall back to Ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://127.0.0.1:7545');
    }
    web3 = new Web3(App.web3Provider);

    web3.eth.getAccounts(function(error, accounts) {
      if (error) {
        console.log(error);
      }




    });

    var str = web3.fromAscii('ethereum');
    console.log(str); // "0x657468657265756d"

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('ProofOfDevice.json', function(data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      var PodArtifact = data;

      console.log(PodArtifact);



      var account = web3.eth.accounts[0];
      console.log(account);

      App.contracts.Pod = TruffleContract(PodArtifact);

      // Set the provider for our contract
      App.contracts.Pod.setProvider(App.web3Provider);

      App.getContract();

      App.contracts.Pod.deployed().then(function(instance) {
        var podInstance = instance;

        console.log(podInstance);


      //First call contract to get all registered devices by th eaccount holder
      podInstance.getDevicesByOwner.call().then(function(result) {
          console.log(result);

          for (var i = 0; i < result.length; i++) {

            if (result[i] == "0x0000000000000000000000000000000000000000000000000000000000000000") break;

            var deviceId = result[i];

            var newdeviceId = web3.toAscii(deviceId) ,
                          newOwner = account,
                          action = 1,
                          datatoAdd = {
                                    deviceId: newdeviceId,
                                    owner: newOwner,
                                    action: action
                                };

            localData.push(datatoAdd);

          }

          //Then call contract to get all devices where owner originated transaction
          podInstance.getDevicesByTxn.call().then(function(resultTxn) {
            console.log(resultTxn);

            for (var z = 0; z < (resultTxn.length); z++) {

                if (resultTxn[z] == "0x0000000000000000000000000000000000000000000000000000000000000000") break;

                var deviceId = resultTxn[z];
                console.log(deviceId);

                var isMatched=false;
                for (var j = 0; j < (localData.length); j++) {

                      console.log(j);

                    if (localData[j].deviceId == web3.toAscii(deviceId))
                    {
                       isMatched=true;
                       console.log(localData[j].deviceId);
                       break;

                    }

                }

                if (!isMatched)
                {

                  var newdeviceId2 = web3.toAscii(deviceId) ,
                                newOwner = account,
                                action = 2,
                                datatoAdd = {
                                          deviceId: newdeviceId2,
                                          owner: newOwner,
                                          action: action
                                      };

                  localData.push(datatoAdd);

                }

              }

              tableData.shift();

              localData.shift();

              //Loop through all devices to get additional information and populate User Interface

              for (var j = 0; j < (localData.length); j++) {

                  console.log(localData[j]);

                  var txndeviceId = web3.fromAscii(localData[j].deviceId);
                  console.log(txndeviceId);


                  podInstance.getTxnByDeviceId.call(txndeviceId).then(function(result3) {
                      console.log(result3);
                      var actionId=0;
                      var deviceId = web3.toAscii(result3[0]);
                      var indexId = result3[1].toString();
                      var deviceOwner = result3[2];
                      var txOriginator = result3[3];
                      console.log(result3[4].toString());
                      console.log(result3[5].toString());

                      if (result3[4].toString() == '0' && result3[5].toString() == '1') actionId=1; //Claim
                      if (result3[4].toString() == '1' && result3[5].toString() == '0') actionId=2; //proof requested
                      if (result3[4].toString() == '1' && result3[5].toString() == '1') actionId=3; //proof approved
                      if (result3[4].toString() == '2' && result3[5].toString() == '0') actionId=4; //transfer requested
                      if (result3[4].toString() == '2' && result3[5].toString() == '1') actionId=5; //transfer approved
                      if (deviceOwner != account && result3[4].toString() == '1' && result3[5].toString() == '0') actionId=6; //proof requested
                      if (result3[4].toString() == '1' && result3[5].toString() == '1') actionId=7; //Approved by Owner
                      if (deviceOwner != account && result3[4].toString() == '2' && result3[5].toString() == '0') actionId=8; //transfer requested
                      if (result3[4].toString() == '2' && result3[5].toString() == '1') actionId=9; //transfer approved

                      var newdeviceId3 = deviceId ,
                                    newOwner = deviceOwner,
                                    action = actionId,
                                    txorigin = txOriginator,
                                    datatoAdd2 = {
                                              deviceId: newdeviceId3,
                                              owner: newOwner,
                                              txOrigin: txorigin,
                                              action: action
                                          };

                      tableData.push(datatoAdd2);

                      updateTable(account);

                    });





              }



              //updateTable();
            }).catch(function(err) {
              console.log(err.message);
            });
          //updateTable();
        }).catch(function(err) {
          console.log(err.message);
        });



      });




      });


  }

  };

$(function() {
  $(window).load(function() {

    App.init();
  });
});
