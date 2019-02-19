import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Events = {
	'event_ca': {
		eventName: 'event_ca',
		title: 'CA Portal',
		name: 'Campus Ambassador Program',
		cfLink: null,
		googleFormURL: null,
		route: '/ca',
		actual: 'caportal',
		loggedOut: 'home',
	},
	'event_cryptex': {
		eventName: 'event_cryptex',
		title: 'Cryptex',
		name: 'Cryptex',
		cfLink: null,
		googleFormURL: null,
		route: null,
		actual: 'notRegistered',
		loggedOut: 'user'
	},
	'event_elanEJung': {
		eventName: 'event_elanEJung',
		title: 'Elan-E-Jung',
		name: 'Elan-E-Jung',
		cfLink: '/me',
		googleFormURL: 'https://goo.gl/forms/ON5oP0FoEzu6OMmb2',
		route: '/register_elan_e_jung',
		actual: 'notRegistered',
		loggedOut: 'user'
	},
	'event_manthan': {
		eventName: 'event_manthan',
		title: 'Manthan',
		name: 'Manthan',
		cfLink: '/me',
		googleFormURL: 'https://goo.gl/forms/zJC9foTO1S26c2JF3',
		route: '/register_manthan',
		actual: 'notRegistered',
		loggedOut: 'user'
	},
	'event_pp': {
		eventName: 'event_pp',
		title: 'Paper Presentation',
		name: 'Paper Presentation',
		cfLink: null,
		googleFormURL: null,
		route: '/register_paper_presentation',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_battleBots': {
		eventName: 'event_battleBots',
		title: 'Battle Bots',
		name: 'Battle Bots',
		cfLink: '/me',
		googleFormURL: null,
		// googleFormURL: 'https://docs.google.com/forms/d/1AEm0e1XpXCuURimGFSD2SSxC_cgXcRhXvzcfikj9quo',
		route: '/register_battle_bots',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 4,
	},
	'event_roboScoccer': {
		eventName: 'event_roboScoccer',
		title: 'Robo Soccer',
		name: 'Robo Soccer',
		cfLink: '/me',
		googleFormURL: null,
		// googleFormURL: 'https://docs.google.com/forms/d/1MElpazvCa-q9K8WqWm-IYBS-KVyDWZua-3T1Hj0LVXU',
		route: '/register_robo_soccer',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 4,
	},
	'event_lineFollowBot': {
		eventName: 'event_lineFollowBot',
		title: 'Line Follower Bot',
		name: 'Line Follower Bot',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/18xojeWYoamKhlWJUg8uDExbdtmHmPRn03jPt-QjDjFk',
		googleFormURL: null,
		route: '/register_line_bot',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_quadCopter': {
		eventName: 'event_quadCopter',
		title: 'Quad Copter Challenge',
		name: 'Quad Copter Challenge',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/18w5Pr2MKS9_65OgXq6qx0otU1A6Fk3KI6tFkHUFkaXE',
		googleFormURL: null,
		route: '/register_quad_copter',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 4,
	},
	'event_driftKing': {
		eventName: 'event_driftKing',
		title: 'Drift King',
		name: 'Drift King',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/1EP_qEy8btyo2vjUjrpAn-DnijUmMsV9P_Bs3pxpo_Ic',
		googleFormURL: null,
		route: '/register_drift_king',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 4,
	},
	'event_cadPro': {
		eventName: 'event_cadPro',
		title: 'CAD Pro',
		name: 'CAD Pro',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/1NREral7hpECgxROkPqmUppTndq-acEqA3QahTEC1pFQ',
		googleFormURL: null,
		route: '/register_cad_pro',
		actual: 'notRegistered',
		loggedOut: 'user',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 2,
	},
	'event_aquanaut': {
		eventName: 'event_aquanaut',
		title: 'Aquanaut',
		name: 'Aquanaut',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/1HxY4z82XejL85RuIFk5Sq9lCE--onsaCQSGO82ab08U',
		googleFormURL: null,
		route: '/register_aquanaut',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 4,
	},
	'event_galProj': {
		eventName: 'event_galProj',
		title: 'Galileo Project',
		name: 'Galileo Project',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/1yfP2LwniTpkphZXbNEAuHzKcwk8UN9BiBaWMh56G6mw',
		googleFormURL: null,
		route: '/register_galileo',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_bridgeBuilders': {
		eventName: 'event_bridgeBuilders',
		title: 'Bridge Builders',
		name: 'Bridge Builders',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/1IJkyFkc-uEDFuB0gMhaYUWYsdnegbF6SNZ8GjOCylro',
		googleFormURL: 'https://docs.google.com/forms/d/1IJkyFkc-uEDFuB0gMhaYUWYsdnegbF6SNZ8GjOCylro',
		route: '/register_bridge_builders',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_getItWright': {
		eventName: 'event_getItWright',
		title: 'Get It Wright!',
		name: 'Get It Wright!',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/1U7zJ_HF13HWY66z5OIHk5xbb--nIeo9_Pf03wmN6DHg',
		googleFormURL: null,
		route: '/register_get_it_wright',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_campusPrincess': {
		eventName: 'event_campusPrincess',
		title: 'Campus Princess',
		name: 'Campus Princess',
		cfLink: '/me',
		googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLSdVnrJWjgcmR0qg_Lxf-wmyo7fct3n7wDVG58wj467ECvYY_g/viewform',
		route: '/register_campus_princess',
		actual: 'notRegistered',
		loggedOut: 'user'
	},
	'event_dtmf': {
		eventName: 'event_dtmf',
		title: 'DTMF Race',
		name: 'DTMF Race',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLSezXs9Z2KS8ejucQFiAUGyPDH05YOAjUYmh0Nicw-xEisEbuA/viewform',
		googleFormURL: null,
		route: '/register_dtmf_race',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_electabuzz': {
		eventName: 'event_electabuzz',
		title: 'ElektaBuzz',
		name: 'ElektaBuzz',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLSfJbXe0sWBfWwzbfaaSNJbDGNPBHhLBys6n3BME103BlJo4vQ/viewform?usp=sf_link',
		googleFormURL: null,
		route: '/register_elektabuzz',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_machinaDoctrina': {
		eventName: 'event_machinaDoctrina',
		title: 'Machine Doctrina',
		name: 'Machine Doctrina',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLSdkNBknycfrJhRRD0r5S2g-cGiA1Yv0_WpEURvSBo782nh8qw/viewform?usp=sf_link',
		googleFormURL: null,
		route: '/register_machina_doctrina',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_iot': {
		eventName: 'event_iot',
		title: 'IoT Challenge',
		name: 'IoT Challenge',
		cfLink: '/me',
		// googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLSdGQBM9vyw44g2vrJuu8wkm5578Xv4NtmWETeqfUXNlgcTZiw/viewform?usp=sf_link',
		googleFormURL: null,
		route: '/register_iot_challenge',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 2,
	},
	'event_proQuest': {
		eventName: 'event_proQuest',
		title: 'ProQuest',
		name: 'ProQuest',
		cfLink: null,
		googleFormURL: null,
		route: '/register_pro_quest',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_algomania': {
		eventName: 'event_algomania',
		title: 'Algomania',
		name: 'Algomania',
		cfLink: null,
		googleFormURL: null,
		route: '/register_algorithma',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_enigma': {
		eventName: 'event_enigma',
		title: 'Enigma',
		name: 'Enigma',
		cfLink: null,
		googleFormURL: null,
		route: '/register_enigma',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_breakfree': {
		eventName: 'event_breakfree',
		title: 'Breakfree',
		name: 'Breakfree',
		cfLink: '/me',
		googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLSdA-KqyNNm2LgUNhCt4_evJ-3BsYb5my2lhJUl5WjrhZTOU6Q/viewform?usp=sf_link',
		// googleFormURL: null,
		route: '/register_breakfree',
		actual: 'user',
		loggedOut: 'user',
		// minPerTeam: 6,
		// maxPerTeam: 30,
	},
	'event_stepUp': {
		eventName: 'event_stepUp',
		title: 'Step Up',
		name: 'Step Up',
		cfLink: null,
		googleFormURL: null,
		route: '/register_step_up',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 2,
		maxPerTeam: 8,
	},
	'event_nrityanjali': {
		eventName: 'event_nrityanjali',
		title: 'Nrityanjali',
		name: 'Nrityanjali',
		cfLink: null,
		googleFormURL: null,
		route: '/register_nrityanjlai',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_vibrazone': {
		eventName: 'event_vibrazone',
		title: 'Vibrazone',
		name: 'Vibrazone',
		cfLink: 'https://songdew.com/opportunities/campus-idol-vibrazione/503',
		googleFormURL: null,
		route: '/register_vibrazone',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_octaves': {
		eventName: 'event_octaves',
		title: 'Octaves',
		name: 'Octaves',
		cfLink: 'https://www.songdew.com/contests/Octaves_iit_hyderabad/504',
		googleFormURL: null,
		route: '/register_octaves',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_djWars': {
		eventName: 'event_djWars',
		title: 'DJ Wars',
		name: 'DJ Wars',
		cfLink: null,
		googleFormURL: null,
		route: '/register_dj_wars',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_natak': {
		eventName: 'event_natak',
		title: 'Nukkad Natak',
		name: 'Nukkad Natak',
		cfLink: '/me',
		googleFormURL: null,
		// googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLSfzjOy4IjXmnNvlJQm79ihonlG5Nq5Td6ijyRSjKoSptRAFiw/viewform?usp=sf_link',
		route: '/register_natak',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 8,
		maxPerTeam: 20,
	},
	'event_mime': {
		eventName: 'event_mime',
		title: 'Mime',
		name: 'Mime',
		cfLink: null,
		googleFormURL: null,
		// googleFormURL: 'https://docs.google.com/forms/d/e/1FAIpQLSdQR5SDEeoQf3_bAVNmemOGpPUXYh-_KQaPpIY5zAVit73o_w/viewform?usp=sf_link',
		route: '/register_mime',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 8,
	},
	'event_standup': {
		eventName: 'event_standup',
		title: 'Stand Up',
		name: 'Stand Up',
		cfLink: null,
		googleFormURL: null,
		route: '/register_stand_up',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_filmFiesta': {
		eventName: 'event_filmFiesta',
		title: 'Filmfare Fiesta',
		name: 'Filmfare Fiesta<br>The Core Crew for this event Must be limited to 15, you can have as many extras as you wish',
		cfLink: null,
		googleFormURL: null,
		route: '/register_filmfare',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 15,
	},
	'event_screenwriting': {
		eventName: 'event_screenwriting',
		title: 'Screen Writing',
		name: 'Screen Writing',
		cfLink: null,
		googleFormURL: null,
		route: '/register_screenwriting',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_artExhib': {
		eventName: 'event_artExhib',
		title: 'Art Exhibiition',
		name: 'Art Exhibiition',
		cfLink: null,
		googleFormURL: null,
		route: '/register_art_exhibition',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_nailArt': {
		eventName: 'event_nailArt',
		title: 'Nail Art',
		name: 'Nail Art',
		cfLink: null,
		googleFormURL: null,
		route: '/register_nail_art',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_sprayArt': {
		eventName: 'event_sprayArt',
		title: 'Spray Art',
		name: 'Spray Art',
		cfLink: null,
		googleFormURL: null,
		route: '/register_spray_art',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_clayModel': {
		eventName: 'event_clayModel',
		title: 'Clay Modelling',
		name: 'Clay Modelling',
		cfLink: null,
		googleFormURL: null,
		route: '/register_clay_modelling',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_mehendi': {
		eventName: 'event_mehendi',
		title: 'Mehendi',
		name: 'Mehendi',
		cfLink: null,
		googleFormURL: null,
		route: '/register_mehendi',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_picelectric': {
		eventName: 'event_picelectric',
		title: 'Picelectric',
		name: 'Picelectric',
		cfLink: null,
		googleFormURL: null,
		route: '/register_picelectric',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_rjHunt': {
		eventName: 'event_rjHunt',
		title: 'RJ Hunt',
		name: 'RJ Hunt',
		cfLink: null,
		googleFormURL: null,
		route: '/register_rj_hunt',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_ctf': {
		eventName: 'event_ctf',
		title: 'Capture The Flag',
		name: 'Capture The Flag',
		cfLink: null,
		googleFormURL: null,
		route: '/register_capture_the_flag',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	},
	'event_emblazon': {
		eventName: 'event_emblazon',
		title: 'Emblazon',
		name: 'Emblazon',
		cfLink: null,
		googleFormURL: null,
		route: '/register_emblazon',
		actual: 'user',
		loggedOut: 'user',
	},
	'event_autoQuiz': {
		eventName: 'event_autoQuiz',
		title: 'Automobile Quiz',
		name: 'Automobile Quiz',
		cfLink: null,
		googleFormURL: null,
		route: '/register_autoQuiz',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 2,
		maxPerTeam: 2,
	},
	'event_scitechQuiz': {
		eventName: 'event_scitechQuiz',
		title: 'SciTech Quiz',
		name: 'SciTech Quiz',
		cfLink: null,
		googleFormURL: null,
		route: '/register_sciQuiz',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 2,
		maxPerTeam: 2,
	},
	'event_salesman': {
		eventName: 'event_salesman',
		title: 'Salesman of the Year',
		name: 'Salesman of the Year',
		cfLink: null,
		googleFormURL: null,
		route: '/register_salesman_of_the_year',
		actual: 'user',
		loggedOut: 'user'
	},
	'event_sharkTank': {
		eventName: 'event_sharkTank',
		title: 'Shark Tank',
		name: 'Shark Tank',
		cfLink: null,
		googleFormURL: null,
		route: '/register_shark_tank',
		actual: 'user',
		loggedOut: 'user',
		minPerTeam: 1,
		maxPerTeam: 3,
	}
}

// Events['event_manthan'] = {
// 	eventName: 'event_manthan',
// 	title: 'Example',
// 	name: 'Example',
// 	cfLink: null,
// 	googleFormURL: null,
// 	minPerTeam: 1,
// 	maxPerTeam: 10,
// 	actual: 'user',
// 	loggedOut: 'user'
// }

FlowRouter.route('/register_salesman_of_the_year', {
	action: () => {	
		document.title = 'Salesman of the Year';
		BlazeLayout.render('top', Events['event_salesman']);
	}
});
FlowRouter.route('/register_emblazon', {
	action: () => {	
		document.title = 'Emblazon';
		BlazeLayout.render('top', Events['event_emblazon']);
	}
});
FlowRouter.route('/register_capture_the_flag', {
	action: () => {	
		document.title = 'Capture The Flag';
		BlazeLayout.render('top', Events['event_ctf']);
	}
});
FlowRouter.route('/register_rj_hunt', {
	action: () => {	
		document.title = 'RJ Hunt';
		BlazeLayout.render('top', Events['event_rjHunt']);
	}
});
FlowRouter.route('/register_picelectric', {
	action: () => {	
		document.title = 'Picelectric';
		BlazeLayout.render('top', Events['event_picelectric']);
	}
});
FlowRouter.route('/register_mehendi', {
	action: () => {	
		document.title = 'Mehendi';
		BlazeLayout.render('top', Events['event_mehendi']);
	}
});
FlowRouter.route('/register_clay_modelling', {
	action: () => {	
		document.title = 'Clay Modelling';
		BlazeLayout.render('top', Events['event_clayModel']);
	}
});
FlowRouter.route('/register_spray_art', {
	action: () => {	
		document.title = 'Spray Art';
		BlazeLayout.render('top', Events['event_sprayArt']);
	}
});
FlowRouter.route('/register_nail_art', {
	action: () => {	
		document.title = 'Nail Art';
		BlazeLayout.render('top', Events['event_nailArt']);
	}
});
FlowRouter.route('/register_art_exhibition', {
	action: () => {	
		document.title = 'Art Exhibiition';
		BlazeLayout.render('top', Events['event_artExhib']);
	}
});
FlowRouter.route('/register_screenwriting', {
	action: () => {	
		document.title = 'Screen Writing';
		BlazeLayout.render('top', Events['event_screenwriting']);
	}
});
FlowRouter.route('/register_filmfare', {
	action: () => {	
		document.title = 'Filmfare Fiesta';
		BlazeLayout.render('top', Events['event_filmFiesta']);
	}
});
FlowRouter.route('/register_stand_up', {
	action: () => {	
		document.title = 'Stand Up';
		BlazeLayout.render('top', Events['event_standup']);
	}
});
FlowRouter.route('/register_mime', {
	action: () => {	
		document.title = 'Mime';
		BlazeLayout.render('top', Events['event_mime']);
	}
});
FlowRouter.route('/register_natak', {
	action: () => {	
		document.title = 'Nukkad Natak';
		BlazeLayout.render('top', Events['event_natak']);
	}
});
FlowRouter.route('/register_dj_wars', {
	action: () => {	
		document.title = 'DJ Wars';
		BlazeLayout.render('top', Events['event_djWars']);
	}
});
FlowRouter.route('/register_octaves', {
	action: () => {	
		document.title = 'Octaves';
		BlazeLayout.render('top', Events['event_octaves']);
	}
});
FlowRouter.route('/register_vibrazone', {
	action: () => {	
		document.title = 'Vibrazone';
		BlazeLayout.render('top', Events['event_vibrazone']);
	}
});
FlowRouter.route('/register_nrityanjlai', {
	action: () => {	
		document.title = 'Nrityanjali';
		BlazeLayout.render('top', Events['event_nrityanjali']);
	}
});
FlowRouter.route('/register_step_up', {
	action: () => {	
		document.title = 'Step Up';
		BlazeLayout.render('top', Events['event_stepUp']);
	}
});
FlowRouter.route('/register_breakfree', {
	action: () => {	
		document.title = 'Breakfree';
		BlazeLayout.render('top', Events['event_breakfree']);
	}
});
FlowRouter.route('/register_enigma', {
	action: () => {	
		document.title = 'Enigma';
		BlazeLayout.render('top', Events['event_enigma']);
	}
});
FlowRouter.route('/register_algorithma', {
	action: () => {	
		document.title = 'Algomania';
		BlazeLayout.render('top', Events['event_algomania']);
	}
});
FlowRouter.route('/register_pro_quest', {
	action: () => {	
		document.title = 'ProQuest';
		BlazeLayout.render('top', Events['event_proQuest']);
	}
});
FlowRouter.route('/register_iot_challenge', {
	action: () => {	
		document.title = 'IoT Challenge';
		BlazeLayout.render('top', Events['event_iot']);
	}
});
FlowRouter.route('/register_machina_doctrina', {
	action: () => {	
		document.title = 'Machine Doctrina';
		BlazeLayout.render('top', Events['event_machinaDoctrina']);
	}
});
FlowRouter.route('/register_elektabuzz', {
	action: () => {	
		document.title = 'Elektabuzz';
		BlazeLayout.render('top', Events['event_electabuzz']);
	}
});
FlowRouter.route('/register_dtmf_race', {
	action: () => {	
		document.title = 'DTMF Race';
		BlazeLayout.render('top', Events['event_dtmf']);
	}
});
FlowRouter.route('/register_campus_princess', {
	action: () => {	
		document.title = 'Campus Princess';
		BlazeLayout.render('top', Events['event_campusPrincess']);
	}
});
FlowRouter.route('/register_get_it_wright', {
	action: () => {	
		document.title = 'Get It Wright!';
		BlazeLayout.render('top', Events['event_getItWright']);
	}
});
FlowRouter.route('/register_bridge_builders', {
	action: () => {	
		document.title = 'Bridge Builders';
		BlazeLayout.render('top', Events['event_bridgeBuilders']);
	}
});
FlowRouter.route('/register_galileo', {
	action: () => {	
		document.title = 'Galileo Project';
		BlazeLayout.render('top', Events['event_galProj']);
	}
});
FlowRouter.route('/register_aquanaut', {
	action: () => {	
		document.title = 'Aquanaut';
		BlazeLayout.render('top', Events['event_aquanaut']);
	}
});
FlowRouter.route('/register_cad_pro', {
	action: () => {	
		document.title = 'CAD Pro';
		BlazeLayout.render('top', Events['event_cadPro']);
	}
});
FlowRouter.route('/register_drift_king', {
	action: () => {	
		document.title = 'Drift King';
		BlazeLayout.render('top', Events['event_driftKing']);
	}
});
FlowRouter.route('/register_quad_copter', {
	action: () => {	
		document.title = 'Quad Copter Challenge';
		BlazeLayout.render('top', Events['event_quadCopter']);
	}
});
FlowRouter.route('/register_line_bot', {
	action: () => {	
		document.title = 'Line Follower Bot';
		BlazeLayout.render('top', Events['event_lineFollowBot']);
	}
});
FlowRouter.route('/ca', {
	action: () => {	
		document.title = 'CA Portal';
		BlazeLayout.render('top', Events['event_ca']);
	}
});
FlowRouter.route('/register_elan_e_jung', {
	action: () => {	
		document.title = 'Elan-E-Jung';
		BlazeLayout.render('top', Events['event_elanEJung']);
	}
});
FlowRouter.route('/register_manthan', {
	action: () => {	
		document.title = 'Manthan';
		BlazeLayout.render('top', Events['event_manthan']);
	}
});
FlowRouter.route('/register_paper_presentation', {
	action: () => {	
		document.title = 'Paper Presenation';
		BlazeLayout.render('top', Events['event_pp']);
	}
});
FlowRouter.route('/register_battle_bots', {
	action: () => {	
		document.title = 'Battle Bots';
		BlazeLayout.render('top', Events['event_battleBots']);
	}
});
FlowRouter.route('/register_robo_soccer', {
	action: () => {	
		document.title = 'Robo Soccer';
		BlazeLayout.render('top', Events['event_roboScoccer']);
	}
});

FlowRouter.route('/me', {
	action: () => {
		document.title = 'My Profile';
		BlazeLayout.render('user');
	}
});

FlowRouter.route('/somethingunique/:workshop', {
	action: (params, queryParams) => {
		BlazeLayout.render('workshopsPlaceholder', {workshop: params.workshop});
	}
});

FlowRouter.route('/online', {
	action: () => {	window.location.href='/views/online.html'; }
});
FlowRouter.route('/culti', {
	action: () => {	window.location.href='/views/culti/dance.html'; }
});
FlowRouter.route('/techy', {
	action: () => {	window.location.href='/views/tech/techy.html'; }
});
FlowRouter.route('/elektronika', {
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
FlowRouter.route('/aero', {
	action: () => {	window.location.href='/views/tech/aero.html'; }
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
FlowRouter.route('/ecell', {
	action: () => {	window.location.href='/views/tech/Ecell.html'; }
});
FlowRouter.route('/quizzes', {
	action: () => {	window.location.href='/views/tech/quiz.html'; }
});
FlowRouter.route('/paperpresentation', {
	action: () => {	window.location.href='/views/tech/paper_pres.html'; }
});
FlowRouter.route('/civil', {
	action: () => {	window.location.href='/views/tech/civil.html'; }
});
FlowRouter.route('/hackathon', {
	action: () => {	window.location.href='/views/tech/hackathon.html'; }
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
FlowRouter.route('/accommodation', {
	action: () => {	window.location.href='/views/accommodation.html'; }
});
FlowRouter.route('/', {
	action: () => { window.location.href='/index.html'; }
});

FlowRouter.notFound = { 
	action: () => { window.location.href = '/notFound.html'; }
}

FlowRouter.route('/feedback', { 
	action: () => { window.location.href = 
		'https://docs.google.com/forms/d/1V1REvuihZwJgy_iFF6Qr0q0qMJc-CfUCEJ_bf3RTxpI'; }
});


FlowRouter.route('/reg_team/:event', {
	action: (params, queryParams) => {
		var eventName = params.event;
		var event = Events[eventName];
		if(!event) FlowRouter.go('/rytouiy'); //Event Doesn't exist
		if(!event.minPerTeam) FlowRouter.go('/rytouiy'); //Event is not a Team Event
		document.title = event.name;
		BlazeLayout.render('topTeam', event);
	}
});

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

Template.topTeam.helpers({
  	isRegisteredForEvent(eventName) {
  		if(Meteor.user()){
  			return Meteor.user().profile[eventName];
  		}
  	},
});


Template.user.helpers({
  	getServiceAccount(){
  		if(Meteor.user() && Meteor.user().profile && Meteor.user().profile.isAdmin){	
	  		Meteor.call('getServiceAccountOverAll', Meteor.userId(), (err, val) => {
	  			document.getElementById('servAccName').innerHTML = val;
	  		});
	  	}
  	},
	getEvents(){
		var user = Meteor.user();
		if(!user) return null;
		try{
			var arr = Object.keys(user.profile).filter((s) => s.startsWith('event_'));
			if(arr.length === 0) return ['None.'];
			else return arr.map((s) => {
				if(user.profile[s].teamID) return Events[s].name + ' - TeamID: ' + user.profile[s].teamID;
				else return Events[s].name;
			});
		} catch(err) { console.log(err); }
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

	// eventData: () => {
	// } 
});

Template.notRegisteredTeam.helpers({
	count: (n) => { return new Array(n).fill(0); },
	plusOne: (n) => { return n + 1; }
});
Template.notRegisteredTeam.events({
	'click #Register': (e, template) => {

		var minPerTeam = Template.instance().data.minPerTeam();
		var maxPerTeam = Template.instance().data.maxPerTeam();

		var elanIDs = [];

		for(var i = 0; i < maxPerTeam; i++){
			var elanID = document.getElementById('team-mem-' + i).value;
			if(!elanID || elanID === '') continue;
			if(!elanID.startsWith('EL')){
				document.getElementById('team-reg-alert').innerHTML = 'ElanID number ' + (i+1) + ' is invalid.';
			}
			elanIDs.push(elanID);
		}

		if(elanIDs.length < minPerTeam) {
			document.getElementById('team-reg-alert').innerHTML = 'Too Few Team Members Listed.';
			return;
		}

		Meteor.call('registerForEventTeam', elanIDs, 
			Template.instance().data.eventName(), (err, val) => {
				document.getElementById('team-reg-alert').innerHTML = val;
				// if(!template.data.googleFormURL())
				// 	window.Reload._reload();
				// else window.location.href = template.data.cfLink();
			});
	}
});

Template.workshopsPlaceholder.onRendered(() => {
	if(!Meteor.userId()) {
		window.location.href = '/me';
		return;
	}
	temp = Template.instance();
	Tracker.autorun(() => {
		if (Accounts.loginServicesConfigured()) {
			if(!Meteor.user().profile.phoneNumber) {
				BlazeLayout.render('registerNumber');
			}
			else {
				console.log('redirect');
				Meteor.call('visitedWorkshop', Meteor.userId(), 
					temp.data.workshop(), (err, val) => {
						window.location.href = 
						'https://www.thecollegefever.com/college-events/city/iit%20hyderabad/elan-nvision-2019';
				});
			}
		}
	});
});

Template.user.events({
	'click .export':() => {
		var sheet = document.getElementById('admin_sheet').value;
		var label = document.getElementById('admin_output');
		var list = document.getElementById('db_list');

		if(!sheet) {
			label.innerHTML = 'Enter the Spreadsheet Name Correctly';
			return;
		}
		var table = list.selectedIndex - 2;

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
	},
	'click .dump_db':() => { 
		var idx = document.getElementById('db_list');
		idx = idx.selectedIndex - 2;

		Meteor.call('getEventData', Meteor.userId(), idx, (err, val) => {
			if(val === []) {
				document.getElementById('admin_output').innerHTML = 'Empty Table.';
				return;
			}

			var table = document.createElement('table');
			var head = document.createElement('tr');
			table.style.display = 'block';
			head.style.display = 'flex';

			// var last = val[val.length - 1];

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
				for(var entry in val[0]){
					if(entry === '_id') continue;
					var td = document.createElement('td');
					td.innerHTML = String(val[reg][entry]);
					td.style.width = '100%';
					tr.appendChild(td);
				}
				table.appendChild(tr);
			}
			var div = document.getElementById('lol');
			if(div.childNodes[0]){
				div.replaceChild(table, div.childNodes[0]);
			} else {
				div.appendChild(table);
			}
		});
	},
});

Template.notRegistered.onRendered(() => {
	var eventName = Template.instance().data.eventName();
	Meteor.call('visitedEvent', Meteor.user()._id, eventName, (err, val) => {
		console.log(val);
	})
});

Template.notRegistered.events({
	'click #Register': (e, template) => {
		Meteor.call('registerForEvent', Meteor.user()._id, 
			Template.instance().data.eventName(), (err, val) => {
				console.log(val);
				if(!template.data.cfLink())
					window.Reload._reload();
				else window.location.href = template.data.cfLink();
			});
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
  				content.innerHTML = 
  				'<h4><b> Deadline: '+val[i].expiry.toDateString() + '</b></h4>'+
  				'<h4><b> Score: '+val[i].score + '</b></h4>' + val[i].content;
  				// expiry.innerHTML = val[i].expiry.toDateString();
  				// admin.innerHTML = val[i].score;
  				row.appendChild(content);
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
