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

		if(!masterUser.elanID){
			var numElanIDs = IDS.findOne().num;
			var str = numElanIDs.toString(36);
			while(str.length < 4) str = '0' + str;
			str = 'EL' + str + Math.random().toString(36).substring(2, 4);
			IDS.update({}, {$set: {num: (numElanIDs + 1)}});
			Meteor.users.update({_id: masterUser._id}, {$set:{elanID: str}});
			masterUser.elanID = str;
		}


		for(var i = 0; i < Tables.length; i++){
			var eventName = Events[i]; 
			if(!masterUser[eventName]) continue; //User hasn't registered for ith Event
			var eventUser = Tables[i].findOne({ _id: masterUser[eventName].id });
			if(eventUser.parent) delete eventUser.parent; //Dont send the parent ID to profile on Client
			t[eventName] = eventUser; //Copy over all event Specific Info except parentID
		}
		t.phoneNumber = masterUser.phoneNumber;
		t.city = masterUser.city;
		t.collegeName = masterUser.collegeName;
		t.name = masterUser.services.google.name;
		t.isAdmin = masterUser.isAdmin;
		t.elanID = masterUser.elanID;

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
	// if(!FS.existsSync('/cryptex')){
	// 	FS.mkdirSync('/cryptex');
	// 	console.log("Issue!");
	// } 

	// for(var i = 0; i < 50; i++){ 
	// 	Streams[i] = FS.createWriteStream('/cryptex/' + i + '.txt', {flags:'a'});
	// 	Streams[i].write(new Date().toISOString() + "\n");
	// }

	
});

IDS = new Mongo.Collection('elanIDs');
if(IDS.find().count() < 1)
	IDS.insert({num: 0});

/*

Steps to add an event:
1) add a unique entry to the Events Array (also on the Client)
2) add a unique Collection to Tables Array
3) add a unique function with the standard signature to the Contructors Array
4) Add Routing Information to Client JS
5) Write Your loggedOut and LoggedIn Templates
6) Write Your helpers
 
*/
// FS = require('fs');
// Streams = [];
Events = ['event_ca', 'event_cryptex', 'event_elanEJung', 'event_manthan', 'event_pp', 'event_battleBots',
	'event_roboScoccer', 'event_lineFollowBot', 'event_quadCopter', 'event_driftKing', 'event_cadPro',
	'event_aquanaut', 'event_galProj', 'event_bridgeBuilders', 'event_getItWright', 'event_campusPrincess',
	'event_dtmf', 'event_electabuzz', 'event_machinaDoctrina', 'event_iot', 'event_proQuest', 
	'event_algomania', 'event_enigma', 'event_breakfree', 'event_stepUp', 'event_nrityanjali',
	'event_vibrazone', 'event_octaves', 'event_djWars', 'event_natak', 'event_mime', 'event_standup',
	'event_filmFiesta', 'event_screenwriting', 'event_artExhib', 'event_nailArt', 'event_sprayArt',
	'event_clayModel', 'event_mehendi', 'event_picelectric', 'event_rjHunt', 'event_ctf', 'event_emblazon'];
Tables = [
	new Mongo.Collection('ca'), 
	new Mongo.Collection('cryptex'),
	new Mongo.Collection('elan-e-jang'),
	new Mongo.Collection('manthan'),
	new Mongo.Collection('paperpres'),
	new Mongo.Collection('battlebots'),
	new Mongo.Collection('robosoccer'),
	new Mongo.Collection('linefolloebot'),
	new Mongo.Collection('quadcopter'),
	new Mongo.Collection('driftking'),
	new Mongo.Collection('cadpro'),
	new Mongo.Collection('aquanaut'),
	new Mongo.Collection('galileo'),
	new Mongo.Collection('bridgebuild'),
	new Mongo.Collection('getitwright'),
	new Mongo.Collection('campusprince'),
	new Mongo.Collection('dtmf'),
	new Mongo.Collection('electabuzz'),
	new Mongo.Collection('machinadoct'),
	new Mongo.Collection('iot'),
	new Mongo.Collection('proquest'),
	new Mongo.Collection('algomania'),
	new Mongo.Collection('enigma'),
	new Mongo.Collection('breakfree'),
	new Mongo.Collection('stepup'),
	new Mongo.Collection('nrityanjali'),
	new Mongo.Collection('vibrazone'),
	new Mongo.Collection('octaves'),
	new Mongo.Collection('dj'),
	new Mongo.Collection('natak'),
	new Mongo.Collection('mime'),
	new Mongo.Collection('standup'),
	new Mongo.Collection('filmfare'),
	new Mongo.Collection('screenwriting'),
	new Mongo.Collection('artexhib'),
	new Mongo.Collection('nailart'),
	new Mongo.Collection('sprayart'),
	new Mongo.Collection('clay'),
	new Mongo.Collection('mehendi'),
	new Mongo.Collection('picelectric'),
	new Mongo.Collection('rj'),
	new Mongo.Collection('ctf'),
	new Mongo.Collection('emblazon'),
];
Posts = new Mongo.Collection('posts'); //CA Specific Collection
Workshops = new Mongo.Collection('workshopReg');
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
	},//CA
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			pseudoName: "",
			level: 0,
		}
	},//Cryptex
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//elanEJung
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Manthan
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Paper Presentation
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Battle Bots
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Robo Soccer
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Line Follower
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Quad Copter
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Drift King
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//CAD Pro
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//AquaNaut
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Galileo Project
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Bridge Builders
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Get it wright
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Campus Princess
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//DTMF
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Electabuzz
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Machina Doctrina
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//IoT Challenge
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Pro Quest
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Algomania
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Enigma
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Breakfree
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Step Up
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Nrityanjali
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Vibrazone
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Octaves
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//DJWars
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Nukkad Natak
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Mime
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Stand Up
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//FilmFare Fiesta
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Screen Writing
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Art Exhibition
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Nail Art
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Spray Art
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Clay Modelling
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Mehendi
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Picelectric
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//RJ Hunt
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Capture The Flag
	(masterUser, eventIndex) => {
		return {
			name: masterUser.services.google.name,
			email: masterUser.services.google.email,
			phoneNumber: masterUser.phoneNumber,
			collegeName: masterUser.collegeName,
			city: masterUser.city,
		}
	},//Emblazon
];

// Questions = [
// 	{ //Level 0
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/c_scale,h_1310/v1547187213/cwCttzzf79MdWSqi.png',
// 		question: ''
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547188610/4dZS6uWGKZAUcqkYZyxb.png',
// 		question: ''
// 	},
// 	{
// 		image: 'https://i.imgur.com/7yGkZwW.png',
// 		question: "<audio controls autoplay loop src='https://drive.google.com/uc?export=download&id=1cid_nv9aIt5Ne2HxAQme7UZbbfj_z8Zn'></audio>"
// 	},
// 	{
// 		image: '',
// 		question: "169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n"+
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E\n" + 
// 			"169B62169B62169B62FFFFFFFFFFFFFFFFFFFF883EFF883EFF883E"
// 	}, //Level 4
// 	{
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547190457/Y6hSJj4Qst9YNB0TJhyz/UJjTF6OnrjaWQ0LB13fv.jpg',
// 		question: ''
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547192728/fpF6juWJPP7D2S9BJWcc/LQtD12ldlFRZ4OT90cDj.png',
// 		question: ''
// 	},
// 	{   //Level 6
// 		image: '',
// 		question: '<h1><a href="/YMpJUMmy.midi">Right click and choose "Save Link As" option.</a></h1>',
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547210805/3Si5jlEWEcJtUI55Syic.jpg',
// 		question: ''
// 	},
// 	{	//Level 8
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547235495/F95FQ2pJkgF5U4HssEfq/qxUk4r63hpR77xvyb5ys.png',
// 		question: ''
// 	},
// 	{
// 		image: '',
// 		question: 'You took this long to get to the ninth question?<br>\n'+
// 			'HAAHHAHA HAAAAHHH HAAHHHAA HAAHHAHA HAAHAAHH HAAAHHAA HAAHAHHA HAAHAAAA\n'+
// 			'HAAAHHAH HHAHAAHH HHAHHHHH HAAHAHHH HAAHHAHA HHAHHHHH HAAHHAHA HAAAAHHH\n'+
// 			'HAAHHHAA HAAHAAHH HAAHHHHA HAAHAHHA HAAHAAHA HAAHHAHA HAAHHAHH HHHHAHAH\n'+
// 			'HAHHAHHH HAAHAHHA HAAAHHAA HHAHHHHH HAAHAAHH HAAHAHHA HAAHHAAH HAAHHAHA\n'+
// 			'HHAHHHHH HAAHHHHA HAAHAAAH HAAHHAHH HHAHHHHH HAAAHHAA HAAAHAHH HAAHAAAA\n'+
// 			'HAAAHHAH HAAHAHHA HAAHHAHA HAAAHHAA HHAHAAHH HHAHHHHH HAAHHHAA HAAHAAAA\n'+
// 			'HAAHAAHA HAAHAHHA HAAHAAAH HAAHHAAA HHAHHHHH HAAAHAHH HAAHAAAA HHAHHHHH\n'+
// 			'HAAHHHHA HHAHHHHH HAAHAHHH HAAHHHHA HAAHAAHH HAAAHAHH HHHHAHAH<br>\n'+
// 			'You two-dimensional, depth lacking loser!'
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547211291/0PNQNGAOck2NQwyb6hQV.png',
// 		question: ''
// 	},
// 	{
// 		image: 'https://i.imgur.com/wUJtRX2.png',
// 		question: ''
// 	},
// 	{	//Level 12
// 		image: 'https://res.cloudinary.com/drgddftct/image/upload/v1547292346/QPADBgJd8EkeBut6.png',
// 		question: ''
// 	},
// 	{	// Level 13
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547199869/hU0oMwizsTIOL1CxZ2p3/FHYQ0MaRHYdHybVkBbml.png',
// 		question: ''
// 	},
// 	{	// Level 14
// 		image:'https://res.cloudinary.com/dmridruee/image/upload/v1547253798/PJwj2xQAhSgqL6RjAW7W/UzsC9bfQ4xwv5NUQsB7E.png',
// 		question: ''
// 	},
// 	{ //Level 15
// 		image:'',
// 		question:'<h1>Antonin to Sholes</h1>Urgp ycm.o y.oy.ew dryy.p ydab irne<br>'+
// 			'Orm. nct. m. xrne orm. nct. m. jrnew<br>'+
// 			'Ann bcidy frgp o.bo.o C x.drne<br>'+
// 			'Jd.jt frgp ;.prow n.y cy x. yrne<br>'+
// 			'Mafx. ocq ycm.ow rp mafx. y.burne<br>'+
// 			'Oafcbi cy yd. oam. ,afw yday co yrr rnev'
// 	},
// 	{	// Level 16
// 		image: '',
// 		question: 	["<div onClick='document.u += String(0);' class='kbtn'>U+2191</div>",
//     				"<div onClick='document.u += String(1);' class='kbtn'>U+2193</div>",
//     				"<div onClick='document.u += String(2);' class='kbtn'>U+2190</div>",
//     				"<div onClick='document.u += String(3);' class='kbtn'>U+2192</div>",
//     				"<div onClick='document.u += String(4);' class='kbtn'>U+0061</div>",
//     				"<div onClick='document.u += String(5);' class='kbtn'>U+0062</div>",
//     				"<div onClick='let t=document.u;",
//     				"document.getElementById(String(789456123)).value=t;document.getElementById(String(415263789)).click();",
//     				"document.getElementById(String(789456123)).value=String();document.u=undefined;console.log(t);' class='kbtn'>start</div>"].join('')
// 	},
// 	{
// 		image: '',
// 		question: "<!--https://gist.github.com/thenarcissist/81fad46d4bf8d10c3d1029a66fa5e17e-->"

// 	},
// 	{
// 		image: '',
// 		question: "<h1><a href='/xrdtfygbhhjkmnbkhfutr6789y875edrycgvhbjnk.txt'>iarcjphpio </a></h1>"
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547295044/qsQK5bRhRvgXjh378d5J/7yXw9wkWaTMXafsC7USs.png',
// 		question: ''
// 	},
// 	{ //Level 20
// 		image: '',
// 		question: '<h1><a href="cfghuipk678ijnhted.docx"> Download this File </a> <br> This is a story question, mostly the pictures are relevant.</h1>'
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/drgddftct/image/upload/v1547314202/ft78ikjfde4567ujfrt678ikmnvft678.png',
// 		question: ''
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547324694/7hXrD85VnHtn9tHm/rdbJbyt6wc7LkTUVm4wb/uPuARfCUPnUe6zTrMUJz.png',
// 		question: ''
// 	},
// 	{ //Level23
// 		image: 'https://res.cloudinary.com/drgddftct/image/upload/v1547388253/sdtyuio.png',
// 		question: ''
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/dmridruee/image/upload/v1547330705/b5JFUyjjR7c9HjkxrXxr/ek3ZW2wReBG6UVYtUXfF.png',
// 		question: ''
// 	},
// 	{
// 		image: '',
// 		question: '000000011101001011000100000002011111010101<br>'+'100000011101111102010001011111001101100101000<br>'+'1020100010100010101101011010001020100010<br>'+'1101111111000110100010201111101001001101011010111110200000001010101010<br>'+'101010000000211111111100011000111011111111<br>'+'200000100001011100010101010101200111010110100010000000001110210101001110110001111000111111<br>'+'211110111011100101111111010101200001001100101011001111110011200010<br>'+'1100011111100000001011102111000001100011000111100100112010001110110110011<br>'+'101000011012000000000010111110110110100112010010100011000101100100010102011011<br>'+'00110110000011001011011201101010010100111110010001101201010100000101000011000001000211111111010111110001011100000200000001<br>'+'01100110001001010001120111110110001100111001110110120100010101101111101100000101120100010<br>'+'1000100010000111010000201000101001110000101110000001201111101001100111101011010101200000001010101000010101000011'
// 	},
// 	{
// 		image: 'https://res.cloudinary.com/drgddftct/image/upload/v1547371349/5g92e2eRNxtjrDLg/XbWkuXbv8tCpRwwK.gif',
// 		question: ''
// 	},
// 	{ //Level 27
// 		image: 'https://res.cloudinary.com/drgddftct/image/upload/v1547335402/5s7dYxNsNbq9eetq.png',
// 		question: ''
// 	}

// ];
// Answers = [
// 	'cryptex', 'marieantoinette', 'dontpanic', 'ireland', 'groot', 'fcuk', 'beatles',
// 	'bananaequivalentdose', 'alzheimersgroup', 'stanlee', 'pabloescobar', 'absolut',
// 	'triskaidekaphobia', 'philipshue', 'motugi', '12648430', 'undefined0011232354',
// 	'quadratumlatinum', 'dancingmen', 'nerdfameagain', 'buckinghampalace', 'fortytwo', 'markhamill', 'ladystardust', 'oaktoys', 'imaginativeness', '502286', 'ursaminor'
// ]

// LeaderBoards = Tables[1].find({}, {fields:{pseudoName: 1, level: 1}, 
// 				sort: {level: -1, lastCorrectAnswer: 1}
// 			}).fetch().filter((s) => s.pseudoName !== "");

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
	visitedWorkshop: (id, workshop) => {
		var v = Workshops.findOne({ name: workshop });
		var t = {}; t[id] = 1;
		if(!v) 
			Workshops.insert({ name: workshop }, (err, i) => {
				Workshops.update({ name: workshop }, {$set: t});
			});
		else Workshops.update({ name: workshop }, {$set: t});
	},

	visitedEvent: (master_id, eventName) => {
		var user = Meteor.users.findOne({_id: master_id});
		if(!user) return 'User nto found';
		if(!isValidEventName(eventName)) return 'Invalid Event name';
		
		//User might have or might not have registered for the event
		var t = user.visited;
		if(!t) t = {};
		t[eventName] = 1;

		Meteor.users.update({_id: master_id}, { $set: {visited: t} });
		return 'success;'
	},
	notify: (adminID, filter, title, text) => {
		var admin = Meteor.users.findOne({_id: adminID});
		if(!admin.isAdmin) return 'Access Denied';

		var users = Meteor.users.find(filter, {fields:{phoneNumber: 1}}).fetch();
		console.log('Preparing to Send Notification to ' + users.length + ' Users.');

		users.forEach((user) => {
			if(user.phoneNumber === '') return;
			Meteor.ClientCall.apply(user._id, 'notify', [title, text]);
		});
	},
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

		if(idx > Tables.length -1) return [];
		else if (idx < 0) {
			var fields = { visited: 0, createdAt: 0, profile: 0, event_game: 0};
			return Meteor.users.find({}, {fields: fields}).map((s) => {
				s.name = s.services.google.name;
				delete s.services;
				for(var i in s) if(i.startsWith('event_')) delete s[i];
				return s;
			});
		}
		else {
			var eventName = Events[idx];
			var query = {}, fields = { services: 0, profile: 0, createdAt: 0};

			query['visited.' + eventName] = 1;
			query[eventName] = { $exists: false }; //All people who visited but didnt register

			var t = Meteor.users.find(query, {fields:fields}).map((s) => {
				for(var i in s) if(i.startsWith('event_')) delete s[i];
				s.registered = 0; s.visited = 1; return s;
			});
			return Tables[idx].find({}, {fields:{parent: 0}}).map((s) => {
				s.visited = 1; s.registered = 1; return s;
			}).concat(t);
		}
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
	registerForEventTeam: (elanIDs, eventName) => {
		//This registers users for a particular team event
		//@param 'elanIDs': Array of elanIds of the users in the Master User Table
		//@param 'eventName': Event name as described by Events Global
		//@return String: Result of the Operation
		
		if(!isValidEventName(eventName)) return 'Invalid Event name';
		if(!elanIDs || !elanIDs || (elanIDs.length < 1)) return 'Invalid Registration Length';
		var teamID = 'T' + elanIDs[0];
		var idx = Events.indexOf(eventName), table = Tables[idx];
		if(!table) return 'Internal DB Error';

		var count = 0, countInv = 0, countAlr = 0;

		for(var i of elanIDs){
			var user = Meteor.users.findOne({ elanID: i });
			if(!user) {
				countInv ++;
				continue; //Ignore invalid elanID.
			}

			var eventUser = Constructors[idx](user, table.find().count());
			eventUser.parent = user._id;
			eventUser.teamID = teamID;

			var preUser = table.findOne({ parent: user._id });
			if(preUser){
				countAlr++;
				continue; //Ignore if User has already registered.
			}

			var eventID = table.insert(eventUser);
			var t = {};
			t[eventName] = { id: eventID };
			Meteor.users.update({ _id: user._id }, {$set: t});
			count++;
		}

		return 'Success Registered ' + count + ' team members, ' + countInv + ' invalid elanIDs found, '+
			countAlr + ' people had already registered for this event. Please ask your team members to check ' + 
			' their teamIDs at the <a href="elan.org.in/me> Me </a>" page.';
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
	getServiceAccountOverAll: (adminID) => {
		var admin = Meteor.users.findOne({_id: adminID});
		if(!admin.isAdmin) return 'Access Denied';

		var serviceAcc = ServiceConfiguration.configurations.find().fetch();
		if(!serviceAcc || serviceAcc[0] === undefined) return 'Service Account config invalid.';

		return serviceAcc[0].serviceEmail;
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
	// requestPseudoName: (id, name) => {
	// 	if(!id || !name) return 'Invalid Arguments';
	// 	if(name === '') return 'Invalid Arguments';
	// 	var usr = Tables[1].findOne({_id: id});
	// 	if(!usr) return 'Invalid User Id';
	// 	var other = Tables[1].findOne({pseudoName: name});
	// 	if(other) return 'Pseudo name already used.';
	// 	Tables[1].update({_id: id}, {$set:{'pseudoName': name}});
	// 	return 'success';
	// },
	// getQuestion: (id) => {
	// 	var user = Tables[1].findOne({parent: id});
	// 	if(!user) return 'Invalid ID';
	// 	return Questions[user.level];
	// },
	// guessAnswer: (id, answer) => {
	// 	var user = Tables[1].findOne({parent: id});
	// 	if(!user) return 'Invalid ID';
	// 	var string = user.pseudoName + "->"+ user.level +"->"+user.lastCorrectAnswer+'->'+answer + "\n";
	// 	// Streams[user.level].write(string);
	// 	if(Answers[user.level] === answer){
	// 		user.lastCorrectAnswer = String(new Date().toISOString());
	// 		if(user.level >= Questions.length - 1){
	// 			console.log('Cryptex is won by ', user);
	// 			return 'Life has no Meaning, You just won.'+
	// 				' Now stay on this page forever because'+
	// 				' I was too lazy to make a victory page.';
	// 		}
	// 		else {
	// 			Tables[1].update({parent: id}, {$set:{
	// 				level: user.level+1,
	// 				lastCorrectAnswer: user.lastCorrectAnswer
	// 			}});
	// 			return 'Good Answer';
	// 		}
	// 	}
	// 	else return 'Wrong Answer';
	// },
	// getCryptexLeaderboard: () => {
	// 	return LeaderBoards;
	// },
	// log: (val) => {
	// 	console.log(val);
	// }

});
