var whodid_config = require('./whodid-config.js')
var utils =require('./utils.js')

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

	var arr = []
	for(let author in storage){
		arr.push({name:author, score:storage[author]})
	}
	
	arr.sort((a,b)=>{
		return b.score - a.score
	})
	
	if(config.num > 0)
		arr.length = config.num


	var result = [['score', 'author']]
	arr.forEach(e=>{
		result.push([e.score.toFixed(0), e.name])
	})

	if(config.output_as=='json')
		console.log(utils.serialize(result, 'json'))
	else if(config.output_as=='csv')
		console.log(utils.serialize(result, 'csv', {'csv_sep':config.csv_seperator}))
	else
		console.log(utils.serialize(result, 'table', {'colors':['yellow', null]}))
	

}

module.exports = {run}
