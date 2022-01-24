const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const repo = require('./repo');
// promisifying the hashing fn
const scrypt = util.promisify(crypto.scrypt);

// the repo to store users data
class UsersRepo extends repo {
	// create will create a new user and add  it
	async create(userData) {
		console.log('inside create');
		userData.id = this.randomId();
		// here we will apll the hashing steps for securign passwords

		// generating a salt
		const salt = crypto.randomBytes(4).toString('hex');
		// hashing the password and salt
		let hashBuff = await scrypt(userData.password, salt, 64);
		hashBuff = hashBuff.toString('hex');
		// storing the hashed pass in  DB
		const record = {
			...userData,
			password: `${hashBuff}.${salt}`
		};

		let records = await this.getAll();
		records.push(record);
		await this.writeAll(records);
		return records;
	}
	async comparePasswords(dbStored, userEntered) {
		const [ hashPass, salt ] = dbStored.split('.');
		let checkPass = await scrypt(userEntered, salt, 64);
		checkPass = checkPass.toString('hex');
		console.log(hashPass + ' ' + checkPass);
		return hashPass == checkPass ? true : false;
	}
}
module.exports = new UsersRepo('users.json');
