// whodid.js
var execSync = require('child_process').execSync
var whodid_config = require('./whodid-config.js')

function build_command(){
	let config = whodid_config.retrieve() 
	let cmd = `git log --pretty=format:"%ad||%an||%H||%s" --date="iso-local"`
	let opts = []
	if( !config.include_merge )
		opts.push("--no-merges")
	if('until' in config)
		opts.push(`--until="${config.until}"`)
	if('since' in config)
		opts.push(`--since="${config.since}"`)
	if('author' in config)
		opts.push(`--author="${config.author}"`)
	cmd += " " + opts.join(" ")
	return cmd
}

function get_commits(include_detail=true, verbose=false){
	
	let cmd = build_command()
	let config = whodid_config.retrieve()
	
	if(config.verbose)
		console.log(cmd)
	
	let result = execSync(cmd, {cwd:config.cwd}).toString()
	var items = result.split("\n").filter(e=>{
		return (!!e && e.length > 20)
	}).map(e=>{
		let items = e.split("||")
		let date = items[0]
		let author = items[1]
		let hash = items[2]
		let subject = items[3]

		if(subject.length > 20){
			subject = subject.substr(0, 20)
			subject += ".."
		}

		return {date, author, hash, subject}
	})

	if(include_detail) {
		items = items.map(commit=>{
			if(verbose)
				console.log("load commit detail : ", commit.has)
			return Object.assign(commit, load_detail(commit.hash))
		})
	}

	if(config.verbose && items.length == 0)
		console.log("empty result")


	return items
}

function load_detail(commit_hash){
	
	let config = whodid_config.retrieve()
	let cmd = `git show ${commit_hash} --stat=200`
	let result = execSync(cmd, {cwd:config.cwd}).toString()
	let digest_line = function(line, storage){
		
		let commit_matched 			= line.match(/(commit)\s(.+)/)
		let modification_matched 	= line.match(/\s+(.+)\|\s(\d+)\s(\+*)(\-*)/)
		let author_matched 			= line.match(/(Author:)\s(.+)/)
		let date_matched 			= line.match(/(Date:)\s(.+)/)

		if(modification_matched){
			
			let filename = modification_matched[1].trim()
			let ignore_regexp = config.ignore.find(re=>{ return !!filename.match(RegExp(re, 'g'))  })
			
			if(!!ignore_regexp) {
				storage.ignored.push({filename : filename, reason:"ignore regexp matched with filename"})
				return
			}

			storage.modifications.push({
				filename : filename,
				edit_line_num : parseInt(modification_matched[2]) < parseInt(config.line_accept_max) ? parseInt(modification_matched[2]) : 1,
				insert_ratio : modification_matched[3].length / (modification_matched[4] + modification_matched[3]).length,
				remove_ratio : modification_matched[4].length / (modification_matched[4] + modification_matched[3]).length
			})
		}
		else if(commit_matched){}
		else if(author_matched){}
		else if(date_matched){}
	}

	let storage = {modifications:[], ignored:[]}
	
	// get modifications
	result.split("\n").forEach(line=>{
		digest_line(line, storage)
	})

	// evaluate score
	storage.score = storage.modifications.map(e=>{ 
		return e.edit_line_num * e.insert_ratio 
	}).reduce((a,b)=>a+b, 0)
	

	return storage
}


module.exports = {get_commits, load_detail}