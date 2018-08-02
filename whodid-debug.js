var whodid_config = require('./whodid-config.js')
let whodid_base 	= require('./whodid.js')
const Table = require('cli-table');
const utils = require('./utils.js')

function run(commit_hash) {

	let config = whodid_config.retrieve()
	let commit = whodid_base.load_detail(commit_hash)

	let result = [['state', 'filename', 'evaluate result']]
	commit.modifications.forEach(e=>{
		result.push(['accept', e.filename, `${e.edit_line_num} line accepted`])
	})
	commit.ignored.forEach(e=>{
		result.push(['reject', e.filename, e.reason])
	})

	if(config.output_as=='json')
		console.log(utils.serialize(result, 'json'))
	else if(config.output_as=='csv')
		console.log(utils.serialize(result, 'csv', {'csv_sep':config.csv_seperator}))
	else
		console.log(utils.serialize(result, 'table', {'colors':[function(state){
			if(state=='accept')
				return utils.green(state)
			else
				return utils.red(state)
		}]}))


	return
}

module.exports = {run}
