
(function() {
	'use strict';


	// Save new data
	var saveData = function() {


			var deviceId = web3.fromAscii(document.getElementById('name').value);
			//var deviceId = '0x444e50564c3538344a434c48';
			var podInstance;

			console.log(deviceId);

			web3.eth.getAccounts(function(error, accounts) {
			if (error) {
				console.log(error);
			}

			var account = accounts[0];

			console.log("Account used is: " + account);

			console.log("deviceId: " + deviceId );

			App.contracts.Pod.deployed().then(function(instance) {
				var podInstance = instance;

				console.log(instance);
			// Execute adopt as a transaction by sending account
			return podInstance.claimDevice(deviceId, {from: account});
		}).then(function(result) {

			console.log(result);

		}).catch(function(err) {
			console.log(err.message);
		});
	});
		//userData.push(datatoAdd);
		//updateTable();
	}

	// Update data
	var updateData = function(id) {
		var upName = document.getElementById('name').value,
			upPhone = document.getElementById('phone').value;

		userData[id].name = upName;
		userData[id].phone = upPhone;
		updateTable();
	}

	// Reset the form
	var refreshForm = function() {
		var nameField = document.getElementById('name'),
			phoneField = document.getElementById('phone'),
			saveButton = document.getElementById('btnSave');

		nameField.value = '';
		saveButton.value = 'Register';
		saveButton.removeAttribute('data-update');
	}

	// Main function
	var init = function() {
		//updateTable();


		var btnSave = document.getElementById('btnSave');
		var	btnReqProof = document.getElementById('btnReqProof');
		var btnReqTransfer = document.getElementById('btnReqTransfer');

		btnSave.onclick = function() {
						console.log('save is clicked');
			if (btnSave.getAttribute('data-update')) {

				updateData(btnSave.getAttribute('data-update'));
			} else {
				saveData();
			}
			refreshForm();
		};

		btnReqProof.onclick = function() {
			console.log('Req.Proof is clicked');
			ReqProofExecute();
		};

		btnReqTransfer.onclick = function() {
			ReqTransferExecute();
		};


	};

	init(); //Intialize the table
})();

function ReqProofExecute()
{

	var deviceId = web3.fromAscii(document.getElementById('name').value);
	console.log(deviceId);

	web3.eth.getAccounts(function(error, accounts) {
	if (error) {
		console.log(error);
	}

	var account = accounts[0];

	console.log("Account used is: " + account);

	App.contracts.Pod.deployed().then(function(instance) {
		var podInstance = instance;

		console.log(instance);
	// Execute adopt as a transaction by sending account
	return podInstance.requestProof(deviceId, {from: account});
}).then(function(result) {

	console.log(result);
	//return App.markAdopted();
}).catch(function(err) {
	console.log(err.message);
});
});


}

function approveProofExecute(deviceId)
{

	console.log(deviceId);

	web3.eth.getAccounts(function(error, accounts) {
	if (error) {
		console.log(error);
	}

	var account = accounts[0];

	console.log("Account used is: " + account);

	App.contracts.Pod.deployed().then(function(instance) {
		var podInstance = instance;

		console.log(instance);
	// Execute adopt as a transaction by sending account
	return podInstance.approveProof(deviceId, {from: account});
}).then(function(result) {

	console.log(result);
	//return App.markAdopted();
}).catch(function(err) {
	console.log(err.message);
});
});


}

function ReqTransferExecute()
{

	var deviceId = web3.fromAscii(document.getElementById('name').value);
	console.log(deviceId);

	web3.eth.getAccounts(function(error, accounts) {
	if (error) {
		console.log(error);
	}

	var account = accounts[0];

	console.log("Account used is: " + account);

	App.contracts.Pod.deployed().then(function(instance) {
		var podInstance = instance;

		console.log(instance);
	// Execute adopt as a transaction by sending account
	return podInstance.requestTransfer(deviceId, {from: account});
}).then(function(result) {

	console.log(result);
	//return App.markAdopted();
}).catch(function(err) {
	console.log(err.message);
});
});


}

function deleteExecute(deviceId)
{

	console.log(deviceId);

	web3.eth.getAccounts(function(error, accounts) {
	if (error) {
		console.log(error);
	}

	var account = accounts[0];

	console.log("Account used is: " + account);

	App.contracts.Pod.deployed().then(function(instance) {
		var podInstance = instance;

		console.log(instance);
	// Execute adopt as a transaction by sending account
	return podInstance.destructDevice(deviceId, {from: account});
}).then(function(result) {

	console.log(result);
	//return App.markAdopted();
}).catch(function(err) {
	console.log(err.message);
});
});


}

function approveTransferExecute(deviceId, newOwner)
{

	console.log(deviceId);

	web3.eth.getAccounts(function(error, accounts) {
	if (error) {
		console.log(error);
	}

	var account = accounts[0];

	console.log("Account used is: " + account);

	App.contracts.Pod.deployed().then(function(instance) {
		var podInstance = instance;

		console.log(instance);
	// Execute adopt as a transaction by sending account
	return podInstance.approveTransfer(deviceId, newOwner, {from: account});
}).then(function(result) {

	console.log(result);
	//return App.markAdopted();
}).catch(function(err) {
	console.log(err.message);
});
});


}

function updateTable(account)
{
	var dataTable = document.getElementById('table1'),
		tableHead = document.getElementById('table-head'),
		tbody = document.createElement('tbody');

	while (dataTable.firstChild) {
		dataTable.removeChild(dataTable.firstChild);
	}

	dataTable.appendChild(tableHead);

	for (var i = 0; i < tableData.length; i++) {
		var tr = document.createElement('tr'),
			td0 = document.createElement('td'),
			td1 = document.createElement('td'),
			td2 = document.createElement('td'),
			td3 = document.createElement('td'),
			td4 = document.createElement('td'),
			td5 = document.createElement('td'),
			btnDelete = document.createElement('input')
			btnEdit = document.createElement('input');

		if (tableData[i].action ==1)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Registered');
			btnEdit.setAttribute('class', 'btnDisable');
			btnEdit.setAttribute('id', i);

		}

		if (tableData[i].action ==2)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Approve Proof');

			btnEdit.setAttribute('id', i);

		}

		if (tableData[i].action ==3)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Proof Approved');
			btnEdit.setAttribute('class', 'btnDisable');
			btnEdit.setAttribute('id', i);

		}

		if (tableData[i].action ==4)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Approve Transfer');

			btnEdit.setAttribute('id', i);

		}

		if (tableData[i].action ==5)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Transfer Approved');
			btnEdit.setAttribute('class', 'btnDisable');
			btnEdit.setAttribute('id', i);

		}

		if (tableData[i].action ==6)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Requested Proof');
			btnEdit.setAttribute('class', 'btnDisable');
			btnEdit.setAttribute('id', i);

		}

		if (tableData[i].action ==7)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Proved By Owner');
			btnEdit.setAttribute('class', 'btnDisable');
			btnEdit.setAttribute('id', i);

		}

		if (tableData[i].action ==8)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Requested Transfer');
			btnEdit.setAttribute('class', 'btnDisable');
			btnEdit.setAttribute('id', i);

		}

		if (tableData[i].action ==9)
		{
			btnEdit.setAttribute('type', 'button');
			btnEdit.setAttribute('value', 'Transfer Approved');
			btnEdit.setAttribute('class', 'btnDisable');
			btnEdit.setAttribute('id', i);

		}

		tr.appendChild(td0);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tr.appendChild(td4);


		if (account.startsWith((tableData[i].owner).substring(0,20)))
		{
			btnDelete.setAttribute('type', 'button');
			btnDelete.setAttribute('value', 'X');
			btnDelete.setAttribute('class', 'btnDelete');
			btnDelete.setAttribute('id', i);
			tr.appendChild(td5);

		}


		td0.innerHTML = i + 1;
		td1.innerHTML = tableData[i].deviceId;
		td2.innerHTML = tableData[i].owner;
		td3.innerHTML = tableData[i].txOrigin;
		td4.appendChild(btnEdit);
		td5.appendChild(btnDelete);

		btnDelete.onclick = (function() {
			return function() {
				if (confirm("Are you sure you want to remove from blockchain?")) {
					deleteExecute(tableData[this.getAttribute('id')].deviceId);
				}
			};
		})();



		btnEdit.addEventListener('click', function() {


			var editId = this.getAttribute('id');
			window.scrollTo({
					top: 0,
					left: 0,
					behavior: 'smooth'
				});
			console.log('Button Edit ' + editId);
			var deviceId = tableData[editId].deviceId;
			var actionId = tableData[editId].action;
			var txOrigin = tableData[editId].txOrigin;
			var deviceOwner = tableData[editId].owner;

			console.log(deviceId);
			console.log(actionId);



			if (actionId == '2')
			{
				approveProofExecute(deviceId);

			}

			if (actionId == '4')
			{

				approveTransferExecute(deviceId, txOrigin);

			}

		}, false);

		tbody.appendChild(tr);
	}
	dataTable.appendChild(tbody);
}


jQuery(function() {


	//web3 = new Web3(App.web3Provider);

	web3.eth.getAccounts(function(error, accounts) {
	if (error) {
		console.log(error);
	}

	jQuery('body').append('<div style="z-index:1000;text-align:left;font-family:sans-serif;color:#FFF !important;font-size:14px !important;position:absolute;top:0px;left:0px;margin:0 !important;padding:0px !important;width:100%;background:rgb(0,0,0);background:rgba(0,0,0,0.8);"><p style="margin:10px 5px !important;padding:0 !important;line-height:28px;position:relative;color:#FFF !important;">Metamask Account Address: ' + accounts[0] + '<span id="gsgd_hotlink_2" alt="close" title="close" style="cursor:pointer;font-size:18px !important;text-align:center;position:absolute;top:5px;right:5px;background:#C00 !important; color:#FFF !important;width:18px !important;height:18px !important;line-height:16px !important;border-radius:9px;">&#215;</span></p></div>');
	jQuery('#gsgd_hotlink_2').click(function(){jQuery(this).parents('div').fadeOut('slow', function() {jQuery(this).remove()});});
		});
});

$("#message_bar").slideDown("normal", "easeInOutBack");

$("#message_bar").click(function(){
	$(this).slideToggle("normal", "easeInOutBack", function(){
		$("#show_message_bar").slideToggle("normal", "easeInOutBack");
	});
});
$("#show_message_bar").click(function(){
	$(this).slideToggle("normal", "easeInOutBack", function(){
		$("#message_bar").slideToggle("normal", "easeInOutBack");
	});
});
