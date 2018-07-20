function store(storage, filename, amt){
	if(filename in storage == false)
		storage[filename] = 0
	storage[filename] += amt
	return storage
}

function run(commits, num){
	
	let storage = {}

	commits.forEach(commit=>{
		commit.modifications.forEach(mod=>{
			store(storage, mod.filename, mod.editAmt)
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
	console.log("Top modified files")
	arr.forEach(info=>{
		console.log(`  ${info.weight}\t${info.filename}`)
	})
}

module.exports = {run}
