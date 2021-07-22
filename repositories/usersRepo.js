const fs = require('fs');

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

	// create will create a new user and add  it
	async create(userData) {
		let data = await this.getAll();
		data.push(userData);
		data = JSON.stringify(data, null, 2);
		await fs.promises.writeFile(this.fileName, data);
	}
}
const user = new UsersRepo('user.json');
const test = async () => {
	await user.create({ name: 'jatin', age: '19' });
	await user.getAll();
};
test();
