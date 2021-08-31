const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
// promisifying the hashing fn
const scrypt = util.promisify(crypto.scrypt);
// the repo to store users data
class UsersRepo {
	constructor(fileName) {
		// need to have the filename to which the data will be saved and retrieved from
		if (!fileName) {
			throw new Error('please enter the filename on which the data is to be stored!!');
		}
		this.fileName = fileName;
		// if the filename doesnt exist, so need to create a new one with empty array
		try {
			fs.accessSync(this.fileName);
		} catch (err) {
			fs.writeFileSync(this.fileName, '[]');
		}
	}

	// getAll will fetch the whole array of data from json DB
	async getAll() {
		return JSON.parse(
			await fs.promises.readFile(this.fileName, {
				encoding: 'utf8'
			})
		);
	}

	//  writeAll is the utility fn to save the data
	async writeAll(data) {
		data = JSON.stringify(data, null, 2);
		await fs.promises.writeFile(this.fileName, data);
	}
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

	//  randomId will create randomId and assign to the new created user
	randomId() {
		//se the crypto module function
		return crypto.randomBytes(4).toString('hex');
	}

	//  getOne will get data of a particular user based on the id pased
	async getOne(id) {
		const data = await this.getAll();
		const foundUser = data.find((curr) => curr.id === id);
		// if (!foundUser) {
		// 	throw new Error("User doesn't exist");
		// } else {
		// 	return foundUser;
		// }
		return foundUser;
	}
	// update will update userData, the updaets are sent in as updatesObj<Object>
	async update(id, updatesObj) {
		let data = await this.getAll();
		const foundUser = data.find((curr) => curr.id === id);
		if (!foundUser) {
			throw new Error("User doesn't exist");
		}
		data.forEach((curr) => {
			if (curr.id == id) Object.assign(curr, updatesObj);
		});
		await this.writeAll(data);
	}
	// delete will delete the userData, recieves id as argum
	async delete(id) {
		let data = await this.getAll();
		const foundUser = data.find((curr) => curr.id === id);
		if (!foundUser) {
			throw new Error("User doesn't exist");
		}
		data = data.filter((curr) => curr.id != id);
		this.writeAll(data);
	}
	//  getOneBy will get the user based on filters pased , filters will be pased in as filtersObj<Object>
	async getOneBy(filtersObj) {
		let data = await this.getAll();
		for (let userData of data) {
			let isFound = true;
			for (let key in filtersObj) {
				if (filtersObj[key] != userData[key]) isFound = false;
			}
			if (isFound) {
				return userData;
			}
		}
		return;
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
