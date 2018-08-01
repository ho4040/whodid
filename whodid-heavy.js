var whodid_config = require('./whodid-config.js')

function store(storage, commit){
	
	let dict = storage
	let author = commit.author

	if( author in dict  == false)
		dict[author] = []
	
	dict[author].push(commit)

	return dict
}

function run(commits) {

	let config = whodid_config.retrieve()
	let storage = {}

	commits.forEach(commit=>{ store(storage, commit) })

	if(config.as_json){
		console.log(JSON.stringify(storage))
	}else{
		for(let author in storage){

			grouped_commits = storage[author]
			grouped_commits = grouped_commits.sort((a, b)=>{
				return b.score - a.score
			})

			console.log("\n")
			console.log(author)
			grouped_commits.length = config.num

			console.log("=====================================================")
			console.log(" commit\t| line\t | note")
			console.log("-----------------------------------------------------")
			grouped_commits.forEach(e=>{
				if(!!e.hash)
				console.log(`\x1b[36m${e.hash.substr(0,7)}\x1b[0m\t| ${e.score.toFixed(0)}\t | ${e.subject.split("\n")[0]}`)
			})
			console.log("=====================================================")
		}
	}

	return
}

module.exports = {run}
