var whodid_config = require('./whodid-config.js')
const Table = require('cli-table');
const utils = require('./utils.js')

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
			console.log("\n Author: " + utils.green(author))
			let table = new Table({
				head:['commit', 'line', 'subject']
			})

			grouped_commits = storage[author]
			grouped_commits = grouped_commits.sort((a, b)=>{
				return b.score - a.score
			})

			grouped_commits.length = config.num

			grouped_commits.forEach(e=>{
				if(!!e.hash)
					table.push([ utils.yellow(e.hash.substr(0,7)),  e.score.toFixed(0), e.subject ])
				
			})
			console.log(table.toString())
		}
	}

	return
}

module.exports = {run}
