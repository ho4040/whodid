var whodid_config = require('./whodid-config.js')
const Table = require('cli-table');
const utils = require('./utils.js')

function store(storage, filename, amt){
	if(filename in storage == false)
		storage[filename] = 0
	storage[filename] += amt
	return storage
}

function run(commits){
	
	let config = whodid_config.retrieve()
	let storage = {}

	commits.forEach(commit=>{
		commit.modifications.forEach(mod=>{
			store(storage, mod.filename, mod.edit_line_num)
		})
	})
	
	var arr = []
	for( filename in storage ){
		arr.push({filename:filename, weight:storage[filename]})
	}
	arr = arr.sort((a,b)=>{
		return b.weight-a.weight
	})
	if(config.num > 0)
		arr.length = config.num

	if(config.as_json){
		console.log(JSON.stringify(arr))
	}else{
		let table = new Table({head:['weight', 'top modified file']})
		arr.forEach(info=>{
			table.push([info.weight, info.filename])
		})
		console.log(table.toString())
	}
}

module.exports = {run}
