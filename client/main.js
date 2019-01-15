import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Events = {
	'event_ca': 'Campus Program',
	'event_cryptex': 'Cryptex 2019'
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

FlowRouter.route('/cryptgame', {
	action: () => {
		// document.getElementsByTagName("BODY")[0].style.background = 'linear-gradient(to bottom, #200122, #6f0000)';
		document.title = "Cryptex 2019";
		// if(!Meteor.user()) window.location.href = '/cryptex';
		// window.location.href = '/cryptex';
		Meteor.call('getQuestion', Meteor.userId(), (err, val) => {
			BlazeLayout.render('top', {
				actual: 'cryptexQuestions', 
				loggedOut: 'cryptexHome',
				eventName: 'event_cryptex',
				name: 'Cryptex 2019',
				image: val.image,
				question: val.question,
			});
		});
	}
});

FlowRouter.route('/cryptex-leaderboards', {
	action: () => {
		// FlowRouter.go('/cryptex-leaderboards.html');
// 		// document.getElementsByTagName("BODY")[0].style.background = 'linear-gradient(to bottom, #200122, #6f0000)';
		// document.title = 'Cryptex Leaderboards';
		// BlazeLayout.render('cryptexLeaderboards');	
	}
});

FlowRouter.route('/cryptex', {
	action: () => {
		// document.getElementsByTagName("BODY")[0].style.background = 'linear-gradient(to bottom, #200122, #6f0000)';
		document.title = "Cryptex 2019";
		BlazeLayout.render('top', {
			actual: 'cryptexMain', 
			loggedOut: 'cryptexHome',
			eventName: 'event_cryptex',
			name: 'Cryptex 2019',
		});
	}
});

FlowRouter.route('/YMpJUMmy.midi', {
	action: () => { window.location.href = '/cryptgame'; }
})

FlowRouter.route('/me', {
	action: () => {
		document.title = 'My Profile';
		BlazeLayout.render('user');
	}
})

FlowRouter.route('/culti', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/culti.html';
	}
});
FlowRouter.route('/techy', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/tech/techy.html';
	}
});
FlowRouter.route('/litr', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/litr.html';
	}
});
FlowRouter.route('/infi', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/infi.html';
	}
});
FlowRouter.route('/sponsors', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/sponsors.html';
	}
});
FlowRouter.route('/us', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/team.html';
	}
});
FlowRouter.route('/biggies', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/biggies.html';
	}
});
FlowRouter.route('/torque', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/tech/torque.html';
	}
});
FlowRouter.route('/robotics', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/tech/robotics.html';
	}
});
FlowRouter.route('/cepheid', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/tech/cepheid.html';
	}
});
FlowRouter.route('/kludge', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/tech/kludge.html';
	}
});
FlowRouter.route('/infero', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/views/tech/infero.html';
	}
});
//Generic Regitser for event route: /_register?event=event_soAndso
FlowRouter.route('/_register', {
	action: () => {
		var event = getQueryParam('event');
		if(!event || !Events[event]) FlowRouter.go('nowhere');
		else BlazeLayout.render('notRegistered', { name: Events[event] });
	}
});

FlowRouter.notFound = {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href = '/notFound.html';
	}
}

FlowRouter.route('/', {
	action: () => {
		window.history.replaceState('','',document.referrer);
		window.location.href='/index.html';
	}
});

Accounts.onLogin((loginDetails) => {
	window.name = undefined;
	if(Meteor.userId()){
		Meteor.ClientCall.setClientId(Meteor.userId())
		window.name = Meteor.user().profile.name;
	}
});

Accounts.onLogout((param) => {
	window.name = undefined;
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

Template.cryptexLeaderboards.helpers({
	data: () => {
		Meteor.call('getCryptexLeaderboard', (err, val) => {
			var table = document.getElementById('crypt-leader-table')
			for(var leader in val) {
				var row = document.createElement('tr');
				var s = document.createElement('td');
				var n = document.createElement('td');
				var l = document.createElement('td');
				s.innerHTML = parseInt(leader)+1;
				n.innerHTML = val[leader].pseudoName;
				l.innerHTML = val[leader].level;
				row.appendChild(s);
				row.appendChild(n);
				row.appendChild(l);
				table.appendChild(row);
			}
		});
	}
});

Template.cryptexLeaderboards.events({
	'click #crypt_rules': () => { window.location.href = '/cryptex'; },
	'click #crypt_forum': () => { window.location = 'http://forum.elan.org.in'; },	
	'click #crypt_play': () => { window.location.href = '/cryptgame'; },
	'click #crypt_feedb':() => { window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdlw152JdFBBFtvoG4_ouyH7KcXKcx9y4qCN0VdqEswE-fj_g/viewform?usp=sf_link'; },
	'click #crypt_cert':() => { window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLScznaXPKAdk-tCpQHY8MPR9-6yizXEG5hvMuZuUhkkheBzYJg/viewform?usp=sf_link'; },
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
	},
	'click #crypt_play': () => { window.location.href = '/cryptgame'; },
	'click #crypt_forum': () => { window.location = 'http://forum.elan.org.in'; },
	'click #crypt_leaders':() => { window.location.href = '/cryptex-leaderboards'; },
	'click #crypt_feedb':() => { window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdlw152JdFBBFtvoG4_ouyH7KcXKcx9y4qCN0VdqEswE-fj_g/viewform?usp=sf_link'; },
	'click #crypt_cert':() => { window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLScznaXPKAdk-tCpQHY8MPR9-6yizXEG5hvMuZuUhkkheBzYJg/viewform?usp=sf_link'; },
});

Template.cryptexMain.helpers({
	hasPseudoName(){
		return (Meteor.user() && Meteor.user().profile.event_cryptex && 
			Meteor.user().profile.event_cryptex.pseudoName != "");
	},
});

Template.cryptexQuestions.helpers({
	hasPseudoName(){
		return (Meteor.user() && Meteor.user().profile.event_cryptex && 
			Meteor.user().profile.event_cryptex.pseudoName != "");
	},
	isLastLevel() {
		if(!Meteor.user() || !Meteor.user().profile.event_cryptex) return false;
		return Meteor.user().profile.event_cryptex.level === 27;
	}
});

var f = () => {
	var guess = document.getElementById('789456123').value;
	var l = document.getElementById('crypt_feedback');
	if(!guess || guess === '' || guess.indexOf(' ') > -1)
		l.innerHTML = 'Invalid or Empty Answer';
	else {
		Meteor.call('guessAnswer', Meteor.userId(), guess, (err, val) => {
			if(val === 'Good Answer'){
				window.Reload._reload();
			} else if(val === 'Wrong Answer') {
				l.innerHTML = val;
				setTimeout(() => { l.innerHTML = ''; }, 1000);
			}
			else {
				document.getElementById('congo_text').innerHTML = 'Congrats. You have won. Change the passoword, keep the account.';
			}
		});
	};
}

Template.cryptexQuestions.events({
	'click #crypt_rules': () => { window.location.href = '/cryptex'; },
	'click #crypt_forum': () => { window.location = 'http://forum.elan.org.in'; },	
	'click #crypt_leaders':() => { window.location.href = '/cryptex-leaderboards'; },
	'click #415263789': () => {f();},
	'keyup #789456123': (event) => {
		if(event.keyCode !== 13) return;
		f();
	},
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
	},
	'click #crypt_feedb':() => { window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLSdlw152JdFBBFtvoG4_ouyH7KcXKcx9y4qCN0VdqEswE-fj_g/viewform?usp=sf_link'; },
	'click #crypt_cert':() => { window.location.href = 'https://docs.google.com/forms/d/e/1FAIpQLScznaXPKAdk-tCpQHY8MPR9-6yizXEG5hvMuZuUhkkheBzYJg/viewform?usp=sf_link'; },
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
