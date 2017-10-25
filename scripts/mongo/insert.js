const mongoClient = require('../../server/lib/mongo');
const SubscriptionModel = require('../../server/models/sub');


console.log('insert')

// const lb = {
//     '_id': '2a3c3858-da87-4d92-8592-7376b64f49c0',
//     'subscription': {
//         'endpoint': 'https://fcm.googleapis.com/fcm/send/ce7eqNCo0Ds:APA91bHSvj7tG9G63BrSsfO372ohXw9dFQMtzGxnlxX1n-qvvSLosP3hOWQ4bHG5E_gwQ3w1d8ohorIg2ldBZwHUSbE1t_6oZhdha3LsK3crDX6Agj84wr37PP5_Huu06unDVox-LDc1',
//         'expirationTime': null,
//         'keys': {
//             'p256dh': 'BFtgDcvHRzktMP3IBtOTKTHlGrpPhRBFeQtq3kcxN9SaM1GBZ4_rZdvTuYM7Vs0GpclTubX9JOPKEI608Fedz-A=',
//             'auth': '5cK7g2T6ZIxE4DW93E1GVA=='
//         }
//     },
//     'location': {
//         'lat': '51.5073448',
//         'lng': '-0.0947315'
//     },
//     'radius': '200',
//     'mons': [
//         '63',
//         '64',
//         '65',
//         '68',
//         '113',
//         '147',
//         '148',
//         '149',
//         '152',
//         '153',
//         '154',
//         '179',
//         '180',
//         '181',
//         '236',
//         '242',
//         '246',
//         '247',
//         '248'
//     ],
//     '__v': 0
// };

// const lc = {
//     '_id': '0736a951-2725-4c7d-81b8-7ec3c92fbaf4',
//     'subscription': {
//         'endpoint': 'https://fcm.googleapis.com/fcm/send/c75pkRTxZGI:APA91bG_EMLr4e8MxagP-51wDLeVUNDmwPyjgGelaXTmtXaqwH7kQ0iVsiZ8D8Mzb9RNeYWer-vesFKd8uogRSVaEpQ0GhwGXFKsfbnfCQGlWyQ9COUDAj1axokhdzeGtq7S6CT1nw3-',
//         'expirationTime': null,
//         'keys': {
//             'p256dh': 'BOd6DVXT-SSouAZjwXCpfkuoKsqaFYqjMXgSxYjE-hj0TdsyOfNdUPr8R74gbJTcPRfa4J3sp7r9XDACTVAZu4Y=',
//             'auth': 'EeuxZf6nDr01hb1YhNyGjg=='
//         }
//     },
//     'location': {
//         'lat': '51.5073448',
//         'lng': '-0.0947315'
//     },
//     'radius': '2000',
//     'mons': [
//         '25',
//         '26',
//         '45',
//         '63',
//         '64',
//         '65',
//         '68',
//         '108',
//         '113',
//         '131',
//         '143',
//         '147',
//         '148',
//         '149',
//         '152',
//         '153',
//         '154',
//         '155',
//         '156',
//         '157',
//         '179',
//         '180',
//         '181',
//         '191',
//         '192',
//         '201',
//         '236',
//         '237',
//         '242',
//         '246',
//         '247',
//         '248'
//     ],
//     '__v': 0
// };


const lc_canary = {
    "_id": "laura-canary",
    "subscription": {
        "endpoint": "https://fcm.googleapis.com/fcm/send/cZ1F5YCjwTA:APA91bGYA7D5HHC8Ff7irXtxQ6hC5dRtF-PNocYsEHOq8KBTHbWGzGHamhq4YYd2VW0FR6bba-E-35DWngNtR_ilGmfVB3HkoNEPlkpVIeCrjreN25-nzcB3RXtEtmeM1EuiKkau3MqU",
        "expirationTime": null,
        "keys": {
            "p256dh": "BJhdZa_4rpDwDHqWmuqcGyO4Tyspzt1Lyvz0yrlm32WgJFWMUE3pmxOVkwagowlGFoHATzJQehGmLEgaEx-nBas=",
            "auth": "lx-HgY99NxvzKffBGEadOw=="
        }
    },
    "location": {
        "lat": "47.6042494",
        "lng": "19.0628556"
    },
    "radius": "420",
    "mons": [
        "25",
        "68",
        "113",
        "143",
        "147",
        "148",
        "149",
        "155",
        "156",
        "157",
        "179",
        "180",
        "181",
        "191",
        "192",
        "201",
        "236",
        "237",
        "242",
        "246",
        "247",
        "248"
    ],
    "__v": 0
};

mongoClient.then(() => {
	console.log('mongo client done');
	const lcModel = SubscriptionModel(lc_canary);
	// const lbModel = SubscriptionModel(lb);

	lcModel.save(function (a, b) {
		console.log('\n\n\nDONE');
		console.log(a,b);
	});

	// lbModel.save(function (a, b) {
	// 	console.log('\n\n\nDONE');
	// 	console.log(a,b);
	// });
});
