let whodid = require('./whodid.js')

function add_contribution(storage, filename, amt){
	if(filename in storage == false)
		storage[filename] = 0
	storage[filename] += amt
	return storage
}

function run(dir=__dirname, since='1.month', verbose=true, num=100){
	let commits = whodid.get_commits(dir, since, verbose)
	let storage = {}
	commits.forEach(commit=>{
		commit.modifications.forEach(mod=>{
			add_contribution(storage, mod.filename, mod.editAmt)
		})
	})
	var arr = []
	for( filename in storage ){
		arr.push({filename:filename, weight:storage[filename]})
	}
	arr = arr.sort((a,b)=>{
		return b.weight-a.weight
	})
	if(num > 0)
		arr.length = num

	console.log("\n")
	console.log("Top modified files since "+since)
	arr.forEach(info=>{
		console.log(`  ${info.filename} ${info.weight}`)
	})
}

module.exports = {run}
