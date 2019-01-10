import { Meteor } from 'meteor/meteor';

Meteor.startup(() => {

	console.log("\n\tServer Started.\n");

	/*
	Master User Record: Meteor.users
	It contains Login access tokens, and 1 object for every event registration.

	User s = Meteor.users.find().fetch()[0]

	s = { _id: 'ID_0',
	    createdAt: 2018-11-09T10:02:40.554Z,
	    services: { google: [Object], resume: [Object] },
	    
	    profile: { 
	       code: 'CA5V7I0003',
	       isAdmin: false,
	       name: 'Web Team',
	       phoneNumber: '1234567890',
	       referals: 0,
	       score: 15 
	    },

	    event_ca: { id: 'ID_1' } //Refers to Id in the event specific Table
	    event_cryptex: { id: 'ID_xxxx' }
	}

	//CA Table
	CAs = new Mongo.Collection('CA')

	ca = {
		 _id: 'ID_1',
	    createdAt: 2018-11-09T10:02:40.554Z,
	    	//Refers to id in Master User Table
	    parent: 'ID_0',
	    	//CA (Event related Info)
	    name: 'Web Team',
	    isAdmin: false,
	    score: 15,
	    phoneNumber: '1234567890',
	    referals: 0,
	    code: 'CA5V7I0003',
	    city: 'wiofhk',
	    collegeName: 'oweMFH' 
	}

	//Cryptex Table
	Cryptex = new Mongo.Collection('Cryptex')

	c = {
		 _id: 'ID_xxxx',
	    createdAt: 2018-11-09T10:02:40.554Z,
	    	//Refers to id in Master User Table
	    parent: 'ID_0',
	    	//Cryptex (Event related Info)
	    level: 3
	}

	TODO:
	0)* Use Global Strings to refer to various events instead of local string constants
	1)* Make a generic isRegisteredForEvent(), register() Meteor Method
	2) Make a generic "RegisterForThisEventButton" Template
	3) Change the backend to work with new frontend
		a)* Change Meteor Startup
		b) Go through all CA Meteor functions
		c) Test Rigorously
		d) Discuss any security issues they might later become imp. for Cryptex
	4)* Migrate DB to new Schema and Tables

	in frontend template:
		{{ #if isLoggedIn }}
			{{ #if isRegisteredForEvent }}
				{{ > Template For Event }}
			{{ else }}
				{{ > RegisterForThisEventButton }}
			{{ /if }}
		{{ else }}
			{{ >loginButtons }}
		{{ /if }}
	*/

	// Meteor.users.remove({});

	console.log('DB constains ' + Meteor.users.find({}).count() + ' documents.');
	console.log('DB constains ' + Meteor.users.find({isAdmin: true}).count() + ' Admins.');

	ServiceConfiguration.configurations.remove({
		service: "google"
	});
	ServiceConfiguration.configurations.insert({
		service: "google",
		clientId: "997189719914-2icchc71sgtjnllup9frnserla46dfa2.apps.googleusercontent.com",
		loginStyle: "popup", //This is for web@elan.org.in
		secret: "ERMZc8SCOL2Q9KpIH7EBjbyH",
		serviceEmail: "campusambassadorserviceaccount@campusambassador-218518.iam.gserviceaccount.com"
	});

	//Accounts.config({ restrictCreationByEmailDomain: 'iith.ac.in' });

	Accounts.onCreateUser((options, user) => {
		if (!('profile' in options)) { options.profile = {}; }
		if (!('providers' in options.profile)) { options.profile.providers = {}; }
		return user;
	});

	Accounts.onLogin((loginDetails) => {
		var masterUser = Meteor.users.findOne({_id: loginDetails.user._id});

		var t = {};

		for(var i = 0; i < Tables.length; i++){
			var eventName = Events[i]; 
			if(!masterUser[eventName]) continue; //User hasn't registered for ith Event
			var eventUser = Tables[i].findOne({ _id: masterUser[eventName].id });
			if(eventUser.parent) delete eventUser.parent;
			t[eventName] = eventUser; //Copy over all event Specific Info except parentID
		}
		t.phoneNumber = masterUser.phoneNumber;
		t.city = masterUser.city;
		t.collegeName = masterUser.collegeName;
		t.name = masterUser.services.google.name;
		t.isAdmin = masterUser.isAdmin;

		Meteor.users.update({_id: masterUser._id}, {$set:{profile: t}});
	});
	
	//Migration Code
	// Meteor.users.find().fetch().forEach( user => {
	// 	Meteor.call('registerForEvent', user._id, 'event_ca', (err, val) => {
	// 		var res = '';
	// 		res += ('Register For Event: ' + val);
	// 		// if(val !== 'Success') return;
	// 		var masterUser = Meteor.users.findOne({ _id: user._id });
	// 		var eventUser = Tables[0].findOne({_id: masterUser.event_ca.id});
	// 		res += ('\n EventUser Found: ' + (eventUser !== undefined));
	// 		eventUser.name = masterUser.name;
	// 		eventUser.isAdmin = masterUser.isAdmin;
	// 		eventUser.score = masterUser.score;
	// 		eventUser.phoneNumber = masterUser.phoneNumber;
	// 		eventUser.referals = masterUser.referals;
	// 		eventUser.code = masterUser.code;
	// 		eventUser.collegeName = masterUser.collegeName;
	// 		eventUser.city = masterUser.city;
	// 		Tables[0].update({_id: eventUser._id}, {$set:eventUser});
	// 		Meteor.users.update({_id: user._id }, {$unset:{
	// 			name: eventUser.name,
	// 			isAdmin: eventUser.isAdmin,
	// 			score: eventUser.score,
	// 			//phoneNumber: eventUser.phoneNumber,
	// 			referals: eventUser.referals,
	// 			code: eventUser.code,
	// 			//collegeName: 'something',
	// 			//city: 'something',
	// 			profile: eventUser.profile
	// 		}});
	// 		if(err) console.log(err);
	// 		console.log(res);
	// 	});
	// });
	if(!FS.existsSync('/cryptex')){
		FS.mkdirSync('/cryptex');
		console.log("Issue!");
	} 

	for(var i = 0; i < 50; i++){ 
		Streams[i] = FS.createWriteStream('/cryptex/' + i + '.txt', {flags:'a'});
		Streams[i].write(new Date().toISOString() + "\n");
	}

	
});

/*

Steps to add an event:
1) add a unique entry to the Events Array
2) add a unique Collection to Tables Array
3) add a unique function with the standard signature to the Contructors Array
4) Add Routing Information to Client JS
5) Write Your loggedOut and LoggedIn Templates
6) Write Your helpers
 
*/
FS = require('fs');
Streams = [];
Events = ['event_ca', 'event_cryptex'];
Tables = [new Mongo.Collection('ca'), new Mongo.Collection('cryptex')];
Posts = new Mongo.Collection('posts'); //CA Specific Collection
Constructors = [
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			isAdmin: false,
			score: 0,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
			referals: 0,
			code: 'CA' + masterUser._id.substring(0, 4).toUpperCase() + 
				'0000'.substring(0, 4 - String(eventIndex).length) + eventIndex,
			hasAskedForRefCode: false
		};
	},
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			pseudoName: "",
			level: 0,
		}
	}
];
Questions = [
	{ //Level 0
		image: 'https://i.imgur.com/SZqlpY8.jpg',
		question: 'Why did yo Mama slap my butt?'
	},
	{
		image: 'http://i.imgur.com/SBORpBH.png',
		question: 'This is another question'
	},
	{
		image: 'http://i.imgur.com/FQ1eIA6.png',
		question: '<!--owhfei--><h2>What does the fox say?</h2>'+
			'<p>This is subtextouefhiofjkdsjosdivops</p>'+
			"<audio controls src='/a.mp3'></audio>"
	}
];
Answers = [
	'lol', 'lolz', 'answer'
]

isValidEventName = (name) => {
	//This checks if given name is a valid name. Checking is important as event
	//names are subfields in the Master User Table, and are the only record for
	//telling is a user is registered for that event or not.
	//@param 'name': Name of the event to be checked
	//@return boolean: true if Events array has an element equal to 'name'
	return Events.find((s) => s === name) !== undefined;
}

makeDocument = (content, time, expiry, score, adminName) => {
	return {
		content: content,
		time: time,
		expiry: expiry,
		score: score,
		adminName: adminName
	};
}

exportTable = (table, colPropNames, spreadsheetName) => {
	var serviceAcc = ServiceConfiguration.configurations.find().fetch();
	if(!serviceAcc || serviceAcc[0] === undefined) return 'Service Account config invalid.';
	if(!spreadsheetName) return 'Spreadsheet Name invalid';

	console.log('Exporting Table '+table._name+' to Spreadsheet: \'' + spreadsheetName + '\'');

	var obj = { 1: {} };

	for (var i = 1; i <= colPropNames.length; i++) {
		obj[1][i] = colPropNames[i-1];
	}

	var row = 2;
	table.find().fetch().forEach((user) => {
		obj[row] = {};
		var col = 1;
		colPropNames.forEach((propName) => {
			var props = propName.split(".");
			var pCol = user;
			for(var i = 0; i < props.length; i++){
				var t = (props[i]).toString();
				pCol = pCol[t];
			}
			if (pCol) obj[row][col] = pCol.toString();
			else obj[row][col] = '';
			col++;
		});
		row++;
	});

	console.log('Data Compiling Complete, uploading...');
	Meteor.call("spreadsheet/update", spreadsheetName, "1", obj, 
		{email: serviceAcc[0].serviceEmail}, 
		(err, val) => {
			if(val) console.log('Upload Successful.');
			else console.log('Some Error occoured, please check server logs.');
		});
}

Meteor.methods({
	exportTableToSheet: (adminID, spreadsheetName, table) => {
		var admin = Meteor.users.findOne({_id: adminID});
		if(!admin.isAdmin) return 'Access Denied';

		console.log('Admin ' + admin.name + ' (id:' + admin._id + ') has started export...');

		var t = parseInt(table);console.log(t);
		var colPropNames = [];
		if(isNaN(t) || t < 0 || t >= Tables.length){
			t = Meteor.users;
			colPropNames = [ 'phoneNumber', 'city', 'collegeName', 'services.google.name', 'isAdmin']
				.concat(Events);
		} 
		else {
			colPropNames = Object.keys(Constructors[t](admin, 0));
			t = Tables[t];
		}

		return exportTable(t, colPropNames, spreadsheetName);
	},

	getEventData: (adminId, idx) => {
		var admin = Meteor.users.findOne({_id: adminId});
		if(!admin.isAdmin) return 'Access Denied';

		if(idx < 0 || idx > Tables.length -1) return [];
		return Tables[idx].find({}, {fields:{parent: 0}}).fetch();
	},

	getDBNameList: (id) => {
		var user = Meteor.users.findOne({_id: id});
		if(user && user.isAdmin)
			return ['Users'].concat(Events.map((s) => s.toUpperCase()));
		else return null;
	},

	isRegisteredForEvent: (master_id, eventName) => {
		//This checks if a user is registered for a particular event
		//@param 'master_id': Id of the user in the Master User Table
		//@param 'eventName': Event name as described by Events Global
		//@return boolean: true if user has a field 'eventName' under the Master User Table

		var user = Meteor.users.findOne({ _id: master_id });
		if(!user) return false;
		else return user[eventName] !== undefined; 
	},
	registerForEvent: (master_id, eventName) => {
		//This registers a user for a particular event
		//@param 'master_id': Id of the user in the Master User Table
		//@param 'eventName': Event name as described by Events Global
		//@return String: Result of the Operation
		var user = Meteor.users.findOne({ _id: master_id });
		if(!user) return 'User Not Found';
		if(!isValidEventName(eventName)) return 'Invalid Event name';
		if(user[eventName] !== undefined) return 'User already registered for ' + eventName;
		var idx = Events.indexOf(eventName),
			table = Tables[idx];
		if(!table) return 'Internal DB Error';
		var eventID = table.insert({ parent: user._id }),
			t = {};
		table.update({ _id: eventID }, { $set: 
			Constructors[idx](user, table.find().count()) 
		});
		t[eventName] = { id: eventID };
		Meteor.users.update({ _id: master_id }, {$set: t})
		return 'Success';
	},

	registerNumber: (id, phoneNumber, collegeName, city) => {
		var user = Meteor.users.findOne({_id: id});
		if(!user) return 'User not Found';

		Meteor.users.update({ _id: id }, { $set: {
			phoneNumber: phoneNumber,
			collegeName: collegeName,
			city: city
		} });

		return 'Number Registered successfully, please log in again to continue.';
	},

	//CA Specific functions, here id is EventUser id
	submitContent: (content, time, expiry, score, id) => {
		var user = Tables[0].findOne({_id: id});

		if(!user.isAdmin) return 'Access Denied';
		if(isNaN(parseFloat(score))) score = 1;

		Posts.insert(makeDocument(content, time, expiry, score, user.name));

		return 'Process Completed';
	},

	removePost: (adminId, postId) => {
		var user = Tables[0].findOne({_id: adminId});
		if(!user || !user.isAdmin) return 'Access Denied';
		return Posts.remove({ _id: postId});
	},

	getPosts: (start, end) => {
		var t = end - start;
		if(t < 0) t = 10;
		if(start < 0) start = 0;
		return Posts.find({}, { 
			limit: t, 
			skip: start, 
			sort: {time: -1} ,
			fields: {
			content: 1,
			expiry: 1,
			score: 1,
		}
		}).fetch();
	},

	getCAs: (id) => {
		var user = Tables[0].findOne({_id: id});
		if(!user.isAdmin) return 'Access Denied';

		return Tables[0].find({}, {
			fields: {
			score: 1, 
			name: 1, 
			email: 1, 
			phoneNumber: 1,
			collegeName: 1,
			city: 1,
			isAdmin: 1
		},
		sort: { score: -1 }
		}).fetch();
	},

	fetchLeaderBoards: () => {
		return Tables[0].find({ isAdmin: false }, 
		{ 
			fields: {
				name: 1, 
				score: 1, 
				email: 1
			},
			sort: { score: -1 }, 
			limit: 20 
		}).fetch();
	},

	updateScore: (score, Email) => {
		if(!Email) return 'Invalid Email';
		if(isNaN(score) || !score) return 'Invalid Score';

		var user = Tables[0].findOne({ email : Email });

		if(!user) return 'User Not Found';
		else{
			Tables[0].update({_id: user._id}, {$set:{
				'score' : (parseFloat(user.score) + parseFloat(score))
			}});
		}
		return 'Score successfully updated';
	},

	applyRefCode: (CAid, refCode) => {
		var user = Tables[0].findOne({_id: CAid});
		if(!user) return 'User not Found';

		var del = 0;
		if(refCode !== ''){
			var refer = Tables[0].find({ code: refCode }).fetch();
			for (var i = refer.length - 1; i >= 0; i--) {
				Tables[0].update({ _id: refer[i]._id }, { $set: {referals:parseFloat(refer[i].referals) + 1} });
			}
			if(refer.length > 0)
				del += 5;
		}

		if(refCode === 'WACELAN') del += 15;

		Tables[0].update({ _id: CAid }, { $set: {
			score: del,
			hasAskedForRefCode: true
		} });

		return 'Code Applied successfully.';
	},

	superSecretCommand: (id, table, command, obj1, obj2) => {
		var user = Meteor.users.findOne({_id: id});
		if(!user.isAdmin) return 'Access Denied';

		var t = Meteor.users;
		if(parseInt(table) !== NaN){
			var idx = parseInt(table);
			if(idx > -1 && idx < Tables.length) t = Tables[idx];
		}

		if(command === 'find'){
			return t.find(obj1, obj2).fetch();
		}
		else if(command === 'update'){
			return t.update(obj1, obj2).fetch();
		}
		else if(command === 'remove'){
			return t.remove(obj1);
		}
	},

	writeSpreadSheet: (adminID, spreadsheetName) => {
		var admin = Tables[0].findOne({_id: adminID});
		if(!admin.isAdmin) return 'Access Denied';

		console.log('Admin ' + admin.name + ' (id:' + admin._id + ')has started data export...');

		var colPropNames = ['name', 'isAdmin', 'city', 'collegeName',
			'email', 'score', 'phoneNumber', 'code', 'referals'];
		return exportTable(Tables[0], colPropNames, spreadsheetName);
	},

	getServiceAccount: (adminID) => {
		var admin = Tables[0].findOne({_id: adminID});
		if(!admin.isAdmin) return 'Access Denied';

		var serviceAcc = ServiceConfiguration.configurations.find().fetch();
		if(!serviceAcc || serviceAcc[0] === undefined) return 'Service Account config invalid.';

		return serviceAcc[0].serviceEmail;
	},
	sendNotifications: (adminID, title, text) => {
		var admin = Tables[0].findOne({_id: adminID});
		if(!admin.isAdmin) return 'Access Denied';

		console.log(title);

		var users = Tables[0].find({}, {fields:{phoneNumber: 1, parent:1}}).fetch();
		console.log('Preparing to Send Notification to ' + users.length + ' CAs.');


		users.forEach((user) => {
			if(user.phoneNumber === '') return;
			Meteor.ClientCall.apply(user.parent, 'notify', [title, text]);
		});
	},

	//Cryptex Specific Code
	requestPseudoName: (id, name) => {
		if(!id || !name) return 'Invalid Arguments';
		var usr = Tables[1].findOne({_id: id});
		if(!usr) return 'Invalid User Id';
		var other = Tables[1].findOne({pseudoName: name});
		if(other) return 'Pseudo name already used.';
		Tables[1].update({_id: id}, {$set:{'pseudoName': name}});
		return 'success';
	},
	getQuestion: (id) => {
		var user = Tables[1].findOne({parent: id});
		if(!user) return 'Invalid ID';
		return Questions[user.level];
	},
	guessAnswer: (id, answer) => {
		var user = Tables[1].findOne({parent: id});
		if(!user) return 'Invalid ID';
		var string = user.pseudoName + "->"+ user.level +"->"+String(new Date().toISOString())+'->'+answer + "\n";
		Streams[user.level].write(string);
		if(Answers[user.level] === answer){
			if(user.level === Questions.length - 1){
				console.log('Cryptex is won by ', user);
				return 'Life has no Meaning, You just won.'+
					' Now stay on this page forever because'+
					' I was too lazy to make a victory page.';
			}
			else {
				Tables[1].update({parent: id}, {$set:{level: user.level+1}});
				return 'Good Answer';
			}
		}
		else return 'Wrong Answer';
	},
	getCryptexLeaderboard: () => {
		return Tables[1].find({}, {fields:{pseudoName: 1, level: 1}}).fetch();
	}

});
