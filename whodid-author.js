var whodid_config = require('./whodid-config.js')
var utils =require('./utils.js')

function store(storage, commit){
	let author = commit.author
	if(author in storage == false)
		storage[author] = []
	storage[author].push(commit)
	return storage
}

function run(commits){

	let config = whodid_config.retrieve()
	let storage = {}

	commits.forEach(commit=>{ 
		store(storage, commit) 
	})

	let data = [['score', 'author', 'commit num', 'top 3 heavy commit']]
	for(let author in storage){
		let total_score = storage[author].map(e=>{ return e.score }).reduce((a,b)=>{ return a + b }, 0)
		let num_commits = storage[author].length
		storage[author].sort((a,b)=>{ return b.score-a.score })
		if(storage[author].length > 3) storage[author].length = 3
		let top_3_commits = storage[author].map(commit=>{ return commit.hash.substr(0,7) }).join(", ")
		data.push([total_score.toFixed(0), author, num_commits, top_3_commits])
	}

	data.sort((a,b)=>{
		return b[0] - a[0]
	})

	if(config.num > 0 && data.length > config.num)
		data.length = config.num


	if(config.output_as=='json')
		console.log(utils.serialize(data, 'json'))
	else if(config.output_as=='csv')
		console.log(utils.serialize(data, 'csv', {'csv_sep':config.csv_seperator}))
	else
		console.log(utils.serialize(data, 'table', {'colors':['yellow', null, null, 'cyan']}))
	

}

module.exports = {run}
