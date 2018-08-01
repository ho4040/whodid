var whodid_config = require('./whodid-config.js')

function store(storage, author, amt){
	if(author in storage == false)
		storage[author] = 0
	storage[author] += amt
	return storage
}

function run(commits){

	let config = whodid_config.retrieve()
	let storage = {}

	commits.forEach(commit=>{ 
		store(storage, commit.author, commit.score) 
	})

	if(config.as_json){
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
		
		if(config.num > 0)
			arr.length = config.num

		console.log("=====================================================")
		console.log(" score\t| author")
		console.log("-----------------------------------------------------")
		
		arr.forEach(e=>{
			console.log(` \x1b[33m${e.score.toFixed(0)}\x1b[0m`, "\t| "+e.name, )
		})

		console.log("=====================================================")
	}
}

module.exports = {run}
