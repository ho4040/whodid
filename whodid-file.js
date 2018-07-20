function store(storage, filename, amt){
	if(filename in storage == false)
		storage[filename] = 0
	storage[filename] += amt
	return storage
}

function run(commits, num, as_json){
	
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

	if(as_json){
		console.log(JSON.stringify(arr))
	}else{
		console.log("=====================================================")
		console.log(" score\t| Top modified file")
		console.log("-----------------------------------------------------")
		arr.forEach(info=>{
			console.log(` \x1b[33m${info.weight}\x1b[0m`, "\t| "+info.filename, )
		})
		console.log("=====================================================")
	}
}

module.exports = {run}
