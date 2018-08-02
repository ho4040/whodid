var whodid_config = require('./whodid-config.js')
var utils =require('./utils.js')
var moment = require('moment')
const Table = require('cli-table');

function store(storage, commit){

	let d = moment(commit.date, 'YYYY-MM-DD HH:mm Z').format('YYYY-MM-DD')

	if(d in storage == false)
		storage[d] = {}

	if(commit.author in storage[d] == false)
		storage[d][commit.author] = 0

	storage[d][commit.author] += commit.score
	
	return storage
}

function run(commits) {

	let lpad = utils.lpad
	let rpad = utils.rpad
	let green = utils.green

	let config = whodid_config.retrieve()
	let storage = {}

	commits.forEach(commit=>{ store(storage, commit) })

	if(config.as_json){
		console.log(JSON.stringify(storage))
	}else{

		const table = new Table({
			head:['date', 'author', 'score']
		});

		for( let date in storage ){
			let score_dict = storage[date]
			for( let author in score_dict ){
				table.push([date, author, storage[date][author]])
			}
		}

		console.log(table.toString());
	}

	return
}

module.exports = {run}
