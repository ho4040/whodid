

function store(storage, author, amt){
	if(author in storage == false)
		storage[author] = 0
	storage[author] += amt
	return storage
}

function run(commits, as_json){
	
	let storage = {}
	commits.forEach(commit=>{ store(storage, commit.author, commit.totalWeight) })

	if(as_json){
		console.log(JSON.stringify(storage, null, 4))
	}else{
		console.log("\n")
		console.log("Contribution state")
		var arr = []
		for(let author in storage){
			arr.push({name:author, score:storage[author]})
		}
		arr.sort((a,b)=>{
			return b.score - a.score
		})
		console.log("=====================================================")
		console.log(" score\t|\tauthor")
		console.log("-----------------------------------------------------")
		arr.forEach(e=>{
			console.log(` \x1b[33m${e.score}\x1b[0m`, "\t|\t"+e.name, )
		})
		console.log("=====================================================")
	}

}

module.exports = {run}
