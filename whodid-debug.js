var whodid_config = require('./whodid-config.js')
let whodid_base 	= require('./whodid.js')
const Table = require('cli-table');
const utils = require('./utils.js')

function run(commit_hash) {

	let table = new Table({head:['state', 'filename', 'modified lines', 'reject reason']})
	console.log("Debug commit: ", utils.cyan(commit_hash))
	let commit = whodid_base.load_detail(commit_hash)
	let total = 0
	
	commit.modifications.forEach(e=>{
		table.push([utils.green('accepted'), e.filename, e.edit_line_num, ''])
	})
	
	commit.ignored.forEach(e=>{
		table.push([utils.red('rejected'), e.filename, e.edit_line_num, e.reason.type])
	})

	console.log(table.toString())
	commit.modifications.forEach(e=>{ total += e.edit_line_num})
	console.log("total accepted line:", utils.yellow(total))
	return
}

module.exports = {run}
