const pinataApiKey = '639d0dfdc673f1247b61';
const pinataSecretApiKey = '565c297cacecab488ef40a210c2e2c17f1fc4f8279663b044358b0b15ff71c16';
const pinataSDK = require('@pinata/sdk');
const pinata = pinataSDK(pinataApiKey, pinataSecretApiKey);

const options = {
	pinataMetadata: {
		name: 'MooNFT'
	},
	pinataOptions: {
		cidVersion: 0
	}
};
pinata
	.testAuthentication()
	.then((result) => {
		//handle successful authentication here
		console.log(result);

		const fs = require('fs');
		const readableStreamForFile = fs.createReadStream('../public/poster.jpg');

		pinata
			.pinFileToIPFS(readableStreamForFile, options)
			.then((result) => {
				const body = {
					description: 'Fumigene poster',
					image: 'https://ipfs.io/ipfs/' + result.IpfsHash,
					name: 'Fumigene',
					attributes: {
						size: 1024,
						smoke: 'yes'
					}
				};
				pinata
					.pinJSONToIPFS(body, options)
					.then((result) => {
						//handle results here
						console.log(result);
					})
					.catch((err) => {
						//handle error here
						console.log(err);
					});
				console.log(result);
			})
			.catch((err) => {
				//handle error here
				console.log(err);
			});
	})

	.catch((err) => {
		//handle error here
		console.log(err);
	});
