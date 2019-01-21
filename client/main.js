import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Events = {
	'event_ca': 'Campus Ambassador Program',
	'event_cryptex': 'Cryptex 2019',
	'event_game': 'The Game'
}

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
FlowRouter.route('/supersecretgame', {
	action: () => {
		document.title = "The Game";
		BlazeLayout.render('top', {
			actual: 'gameWelcome', 
			loggedOut: 'user',
			eventName: 'event_game',
			name: 'The Game'
		});
	}
});

FlowRouter.route('/me', {
	action: () => {
		document.title = 'My Profile';
		BlazeLayout.render('user');
	}
})

FlowRouter.route('/culti', {
	action: () => {	window.location.href='/views/culti/culti.html'; }
});
FlowRouter.route('/techy', {
	action: () => {	window.location.href='/views/tech/techy.html'; }
});
FlowRouter.route('/privacypolicy', {
	action: () => {	window.location.href='/views/privacypolicy.html'; }
});
FlowRouter.route('/litr', {
	action: () => {	window.location.href='/views/litr.html'; }
});
FlowRouter.route('/infi', {
	action: () => {	window.location.href='/views/infi.html'; }
});
FlowRouter.route('/sponsors', {
	action: () => {	window.location.href='/views/sponsors.html'; }
});
FlowRouter.route('/us', {
	action: () => {	window.location.href='/views/team.html'; }
});
FlowRouter.route('/team', {
	action: () => {	window.location.href='/views/team.html'; }
});
FlowRouter.route('/biggies', {
	action: () => {	window.location.href='/views/biggies.html'; }
});
FlowRouter.route('/torque', {
	action: () => {	window.location.href='/views/tech/torque.html'; }
});
FlowRouter.route('/robotics', {
	action: () => {	window.location.href='/views/tech/robotics.html'; }
});
FlowRouter.route('/cepheid', {
	action: () => {	window.location.href='/views/tech/cepheid.html'; }
});
FlowRouter.route('/kludge', {
	action: () => {	window.location.href='/views/tech/kludge.html'; }
});
FlowRouter.route('/infero', {
	action: () => {	window.location.href='/views/tech/infero.html'; }
});
FlowRouter.route('/art', {
	action: () => {	window.location.href='/views/culti/art.html'; }
});
FlowRouter.route('/dance', {
	action: () => {	window.location.href='/views/culti/dance.html'; }
});
FlowRouter.route('/drama', {
	action: () => {	window.location.href='/views/culti/drama.html'; }
});
FlowRouter.route('/moviemaking', {
	action: () => {	window.location.href='/views/culti/moviemaking.html'; }
});
FlowRouter.route('/music', {
	action: () => {	window.location.href='/views/culti/music.html'; }
});
FlowRouter.route('/photography', {
	action: () => {	window.location.href='/views/culti/photography.html'; }
});
FlowRouter.route('/workshops', {
	action: () => {	window.location.href='/views/workshops/workshops.html'; }
});
FlowRouter.route('/', {
	action: () => { window.location.href='/index.html'; }
});

FlowRouter.notFound = { 
	action: () => { window.location.href = '/notFound.html'; }
}

Accounts.onLogin((loginDetails) => {
	window.name = 'Sign In';
	if(Meteor.userId()){
		Meteor.ClientCall.setClientId(Meteor.userId())
		window.name = Meteor.user().profile.name;
	}
});

Accounts.onLogout((param) => {
	window.name = 'Sign In';
	Meteor.ClientCall.setClientId(undefined);
	window.Reload._reload();
});

Template.top.helpers({
  	isRegisteredForEvent(eventName) {
  		if(Meteor.user()){
  			return Meteor.user().profile[eventName];
  		}
  	},
});

Template.user.helpers({
	getEvents(){
		var user = Meteor.user();
		if(!user) return null;
		var arr = Object.keys(user.profile).filter((s) => s.startsWith('event_'));
		if(arr.length === 0) return ['None.'];
		else return arr.map((s) => Events[s]);
	},
	getDBList(){
		Meteor.call('getDBNameList', Meteor.userId(), (err, val) => {
			if(!val) return;
			var list = document.getElementById('db_list');
			val.forEach((x) => {
  				var a = document.createElement('option');
  				a.innerHTML = x;
  				a.value = x;
  				list.appendChild(a);
			});
		});
	},

	eventData: () => {
		for(var idx = 0; idx < Object.keys(Events).length; idx++){
			Meteor.call('getEventData', Meteor.userId(), idx, (err, val) => {
				if(val === []) return;

				var table = document.createElement('table');
				var head = document.createElement('tr');
				table.style.display = 'block';
				// table.style['overflow-x'] = 'scroll';
				head.style.display = 'flex';

				for(var col in val[0]){
					if(col === '_id') continue;
					var th = document.createElement('th');
					th.innerHTML = col;
					th.style.width = '100%';
					head.appendChild(th);
				}
				table.appendChild(head);

				for(var reg in val) {
					var tr = document.createElement('tr');
					tr.style.display = 'flex';
					for(var entry in val[reg]){
						if(entry === '_id') continue;
						var td = document.createElement('td');
						td.innerHTML = String(val[reg][entry]);
						td.style.width = '100%';
						tr.appendChild(td);
					}
					table.appendChild(tr);
				}
				document.getElementById('lol').appendChild(table);
			});
		}	
	}
});

Template.user.events({
	'click .export':() => {
		var sheet = document.getElementById('admin_sheet').value;
		var label = document.getElementById('admin_output');
		var list = document.getElementById('db_list');

		if(!sheet) {
			label.innerHTML = 'Enter the Sheet Pair Correctly';
			return;
		}
		var table = list.selectedIndex -1;

		Meteor.call('exportTableToSheet', Meteor.userId(), sheet, table, (err, val) => {
				label.innerHTML = val;
		});
	},
	'click .notify':() => {
		var title = document.getElementById('admin_notif_title').value;
		var content = document.getElementById('admin_notif_text').value;
		var label = document.getElementById('admin_output');

		if(!title || title === '') {
			label.innerHTML = 'Invalid Notification Title';
			return;
		}
		if(!content || content === '') {
			label.innerHTML = 'Invalid Notification Content';
			return;
		}

		var list = document.getElementById('db_list');

		var table = list.options[list.selectedIndex].value;
		if(table === "Users") table = {};
		else {
			var t = {};
			t[table.toLowerCase()] = {$exists:true};
			table = t;
		}

		Meteor.call('notify', Meteor.userId(), table, title, content, (err, val) => {
			label.innerHTML = val;
		});

	}
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
	},
	'click #testNotification': () => {
		if(!webNotification) return;
		webNotification.showNotification('Welcome to Elan & Nvision!', {
			body: 'Congrats! You have enabled Notifications, you will never miss any of our updates again!',
			icon: '/img/symbolOnly.png',
			onClick: () => {},
			autoClose: 8000
		}, function onShow(error, hide) {});
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

Meteor.ClientCall.methods({
	'notify': function(title, message) {
		console.log('Called');
		if(!webNotification) return;
		webNotification.showNotification(title, {
			body: message,
			icon: '/img/symbolOnly.png',
			onClick: () => {},
			autoClose: 4000
		}, function onShow(error, hide) {});
	},
});
