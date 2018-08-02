var whodid_config = require('./whodid-config.js')
var utils =require('./utils.js')
var moment = require('moment')
const Table = require('cli-table');

function store(storage, commit){

	let d = moment(commit.date, 'YYYY-MM-DD HH:mm Z').format('YYYY-MM-DD')

	if(d in storage == false)
		storage[d] = {}

	if(commit.author in storage[d] == false){
		storage[d][commit.author] = {score:0, commits:[]}
	}

	storage[d][commit.author].score += commit.score
	storage[d][commit.author].commits.push(commit)
	
	return storage
}

function run(commits) {

	let lpad = utils.lpad
	let rpad = utils.rpad
	let green = utils.green

	let config = whodid_config.retrieve()
	let storage = {}

	commits.forEach( commit=>{ store(storage, commit) } )

	let dates = Object.keys(storage)
	dates = dates.sort()

	var result = [['date', 'author', 'score', 'commit num', 'top 3']]

	dates.forEach(date=>{
		let score_dict = storage[date]
		for( let author in score_dict ){
			let score = storage[date][author].score.toFixed(0)
			storage[date][author].commits.sort((a,b)=>{
				return b.score - a.score
			})
			let related_commits = storage[date][author].commits.map(commit=>{return commit.hash.substr(0,7)})
			related_commits.length = Math.min(3, related_commits.length)
			let commit_num = storage[date][author].commits.length
			result.push([date, author, score, commit_num, related_commits.join(", ")])
		}
	})

	if(config.output_as=='json')
		console.log(utils.serialize(result, 'json'))
	else if(config.output_as=='csv')
		console.log(utils.serialize(result, 'csv', {'csv_sep':config.csv_seperator}))
	else
		console.log(utils.serialize(result, 'table', {'colors':[null, null, 'yellow']}))


	return
}

module.exports = {run}
