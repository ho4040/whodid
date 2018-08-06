var whodid_config = require('./whodid-config.js')
const Table = require('cli-table');
const utils = require('./utils.js')
var moment = require('moment')

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

	var data = [['date', 'author', 'commit', 'line', 'subject']]

	for(let author in storage) {
		grouped_commits = storage[author]
		grouped_commits = grouped_commits.sort((a, b)=>{
			return b.score - a.score
		})
		grouped_commits.length = config.num
		grouped_commits.forEach(e=>{
			if(!!e.hash){
				let d = moment(e.date, 'YYYY-MM-DD HH:mm Z').format('YYYY-MM-DD')
				data.push([ d, author, e.hash.substr(0,7),  e.score.toFixed(0), e.subject ])
			}
		})
	}

	if(config.output_as=='json')
		console.log(utils.serialize(data, 'json'))
	else if(config.output_as=='csv')
		console.log(utils.serialize(data, 'csv', {'csv_sep':config.csv_seperator}))
	else
		console.log(utils.serialize(data, 'table', {'colors':[null, 'cyan', 'yellow']}))

	return
}

module.exports = {run}
