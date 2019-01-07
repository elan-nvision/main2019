import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

FlowRouter.route('/ca', {
	action: () => {
		document.title = "CA Portal";
		BlazeLayout.render('top', {
			actual: 'caportal', 
			loggedOut: 'home',
			eventName: 'event_ca',
			name: 'the Campus Ambassador Program'
		});
	}
});

FlowRouter.route('/cryptex', {
	action: () => {
		document.title = "Cryptex 2019";
		BlazeLayout.render('top', {
			actual: 'cryptexMain', 
			loggedOut: 'cryptexHome',
			eventName: 'event_cryptex',
			name: 'Cryptex 2019'
		});
	}
});

FlowRouter.route('/*', {
	action: () => {
		window.location.href='/Home.html' 
	}
});

Accounts.onLogin((loginDetails) => {
	if(Meteor.userId())
		Meteor.ClientCall.setClientId(Meteor.userId())
});

Accounts.onLogout((param) => {
	Meteor.ClientCall.setClientId(undefined);
});

Template.top.helpers({
  	isRegisteredForEvent(eventName) {
  		if(Meteor.user()){
  			return Meteor.user().profile[eventName];
  		}
  	},
});

Template.top.events({
	'click #Register': () => {
		Meteor.call('registerForEvent', Meteor.user()._id, 
			Template.instance().data.eventName(), (err, val) => {
				console.log(val);
				window.Reload._reload();
			})
	}
});


Template.registerNumber.events({
	'click #addNumber': () => {
		var t = document.getElementById('actualNumber').value;
		var n = document.getElementById('collegeName').value;
		var c = document.getElementById('city').value;

		var heading = document.getElementById('ThisNeedsToBeSomething');

		if(t.toString().length !== 10 || isNaN(parseFloat(t))){
			heading.innerHTML = "Please Enter your Correct 10 digit Phone Number";
			return;
		}
		if(!n){
			heading.innerHTML = "Please Enter Your College Name";
			return;
		}
		if(!c){
			heading.innerHTML = "Please Enter Your City of Residence";
			return;
		}

		Meteor.call('registerNumber', Meteor.user()._id, t, n, c,
			(err, val) => { 
				heading.innerHTML = val;
				window.Reload._reload();
			}
		);
	}
});


Template.caportal.helpers({
  	entries() {
  		Meteor.call('getPosts', 0, 100,
  		(err, val) => { 
  			var table = document.getElementById('table');

  			for(var i = 0; i < val.length; i++){
  				var row = document.createElement('tr');
  				var content = document.createElement('td');
  				var expiry = document.createElement('td');
  				var admin = document.createElement('td');
  				content.innerHTML = val[i].content;
  				expiry.innerHTML = val[i].expiry.toDateString();
  				admin.innerHTML = val[i].score;
  				row.appendChild(content);
  				row.appendChild(expiry);
  				row.appendChild(admin);
  				if(Meteor.user() && Meteor.user().profile.event_ca.isAdmin){
  					var rmBtn = document.createElement('button');
					rmBtn.innerHTML = 'Remove';
					rmBtn.style.color = 'Black';
					rmBtn.removeID = val[i]._id;
					rmBtn.row = row;
					rmBtn.addEventListener('click', (e) => {
						Meteor.call('removePost', Meteor.user().profile.event_ca._id, e.target.removeID);
						table.removeChild(e.target.row);
					});
  					row.appendChild(rmBtn);
  				}
  				table.appendChild(row);
  			}
		});
  	},
  	displayLeaderBoards() {
  		Meteor.call('fetchLeaderBoards', (err, val) => {
  			var list = document.getElementById('leaderboards');
  			for(var i = 0; i < val.length; i++){
  				var name = document.createElement('td'),
  					rank = document.createElement('td'),
  					score = document.createElement('td'),
  					email = document.createElement('td');
  				rank.innerHTML = i + 1;
  				name.innerHTML = val[i].name;
  				score.innerHTML = val[i].score;
  				email.innerHTML = val[i].email;
  				var row = document.createElement('tr');
				row.appendChild(rank);
				row.appendChild(name);
				row.appendChild(score);
				row.appendChild(email);
  				list.appendChild(row);
  			};
  		});
  	},
	caentries() {
  		Meteor.call('getCAs', Meteor.user().profile.event_ca._id,
  		(err, val) => { 
  			if(val === 'Access Denied') {
  				document.getElementById('listLegend').innerHTML = val;
  				return;
  			}

			numAdmins = 0;
			numCA = 0;
  			var list = document.getElementById('catable');
  			for(var i = 0; i < val.length; i++){
  				if(val[i].isAdmin) {
					numAdmins++;
  					continue;
  				}
  				numCA ++;
  				var row = document.createElement('tr'),
  					name = document.createElement('td'),
  					score = document.createElement('td'),
  					email = document.createElement('td'),
  					number = document.createElement('td'),
  					colgName = document.createElement('td'),
  					city = document.createElement('td');
  				name.innerHTML = val[i].name;
  				score.innerHTML = val[i].score;
  				email.innerHTML = val[i].email;
  				number.innerHTML = val[i].phoneNumber;
  				colgName.innerHTML = val[i].collegeName;
  				city.innerHTML = val[i].city;
  				row.appendChild(name);
  				row.appendChild(score);
  				row.appendChild(email);
  				row.appendChild(number);
  				row.appendChild(colgName);
  				row.appendChild(city);
  				list.appendChild(row);
  			}

  			document.getElementById('listLegend').innerHTML = 
  				'CAs Registered ' + numAdmins + ' Admins and ' + numCA + ' CAs.';
		});
  	},
  	getServiceAccount(){
  		if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.event_ca.isAdmin){	
	  		Meteor.call('getServiceAccount', Meteor.user().profile.event_ca._id, (err, val) => {
	  			document.getElementById('servAccName').innerHTML = val;
	  		});
	  	}
  	},
  	hasAskedForRefCode(){
  		return Meteor.user().profile.event_ca.hasAskedForRefCode;
  	},
});

Template.caportal.events({
	'click .submit' : () => {
		if(!Meteor.user()) return;
		var content = document.getElementById('content').value;
		var score = document.getElementById('postScore').value;
		var expiry = document.getElementById('postExpiry').value;
		var bel = document.getElementById('legend');
		if(!content || !score || !expiry)
			i = 'Invalid Content';
		else{
			i = 'Request Submitted.';
			Meteor.call('submitContent',
			 	content, new Date(), new Date(expiry), score,
			 	Meteor.user().profile.event_ca._id,
			 	(err, val) => { 
					if(err) bel.innerHTML = err;
					else bel.innerHTML = val;
				}
			);
		}
		bel.innerHTML = i;
	},
	'click .update' : () => {
		if(!Meteor.user()) return;
		var score = document.getElementById('delScore').value;
		var email = document.getElementById('idOfCA').value;
		var bel = document.getElementById('legend');
		if(!content)
			i = 'Invalid Content';
		else if(!email)
			i = 'Invalid email of CA';
		else{
			i = 'Submitted and waiting for response...';
			Meteor.call('updateScore',
			 	score, 
			 	email,
			 	Meteor.user().profile.event_ca._id,
			 	(err, val) => { 
					if(err) bel.innerHTML = err;
					else bel.innerHTML = val;
				}
			);
		}
		bel.innerHTML = i;
	},
	'click .export' : () => {
  		if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.event_ca.isAdmin){
			var name = document.getElementById('nameOfSHeet').value;
			var i = 'Request Submitted.';
			if(!name)
				i = 'Invalid Name';
			else{
				Meteor.call('writeSpreadSheet',
				 	Meteor.user().profile.event_ca._id, 
				 	name
				);
			}
			document.getElementById('sheetsNotice').innerHTML = i;
		}
	},
	'click .notify' : () => {
		var title = document.getElementById('notifTitle').value;
		var text = document.getElementById('notifContent').value;
		var bel = document.getElementById('legend');
		var i = 'Notification Request given to server.';
		if(!title || !text)
			i = 'Invalid entry';
		else {
			Meteor.call('sendNotifications',
				Meteor.user().profile.event_ca._id,
				title, 
				text
			);
		}
		bel.innerHTML = i;
	},
	'click .RefCodeSubmit' : () => {
		var code = document.getElementById('ReferralCode').value;
		Meteor.call('applyRefCode', Meteor.user().profile.event_ca._id, code);
		window.Reload._reload();
	},
	'click .RefCodeNah' : () => {
		Meteor.call('applyRefCode', Meteor.user().profile.event_ca._id, '');
		window.Reload._reload();
	}
});

Template.cryptexMain.events({
	'click .submit_crypt_name': () => {
		var name = document.getElementById('crypt_name').value;
		var label = document.getElementById('crypt_label');
		if(!name || name === '') {
			label.innerHTML = "Enter a Valid Name";
			return;
		}
		Meteor.call('requestPseudoName',  Meteor.user().profile.event_cryptex._id, name,
			(err, val) => {
				if(val === 'success') window.Reload._reload();
				else label.innerHTML = val;
			}
		);
	}
});

Template.cryptexMain.helpers({
	hasPseudoName(){
		return (Meteor.user() && Meteor.user().profile.event_cryptex && 
			Meteor.user().profile.event_cryptex.pseudoName != "");
	},
});

Meteor.ClientCall.methods({
	'notify': function(title, message) {
		console.log('Called');
		if(!webNotification) return;
		webNotification.showNotification(title, {
			body: message,
			icon: '/images/logo.png',
			onClick: () => {},
			autoClose: 4000
		}, function onShow(error, hide) {});
	},
});
