let whodid = require('./whodid.js')

function add_contribution(storage, author, filename, amt){

	if('statDict' in storage == false) 					storage.statDict = {}
	if('statDictOnlyAuth' in storage == false)	storage.statDictOnlyAuth = {}
	if('statDictOnlyFile' in storage == false) 	storage.statDictOnlyFile = {}

	if(author in storage.statDict	== false) {
		storage.statDict[author] = {}
		storage.statDictOnlyAuth[author] = 0		
	}

	if(filename in storage.statDict[author] == false) {
		storage.statDict[author][filename] = 0
		storage.statDictOnlyFile[filename] = 0
	}

	storage.statDict[author][filename] += amt
	storage.statDictOnlyAuth[author] += amt
	storage.statDictOnlyFile[filename] += amt

	return storage
}

function run(dir=__dirname, since='1.month'){
	let commits = whodid.get_commits(dir, since)
	let storage = {}
	commits.forEach(commit=>{
		commit.modifications.forEach(mod=>{
			add_contribution(storage, commit.author, mod.filename, mod.editAmt)
		})
	})

	console.log(storage.statDictOnlyFile)
}

module.exports = {run}
