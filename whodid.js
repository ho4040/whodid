// whodid.js
var execSync = require('child_process').execSync
//var tdqm = require("ntqdm")();
var fs = require('fs')
var config = null

function load_config(dir, verbose){
	let configFilePath = dir+'whodid.json'
	if(fs.existsSync(configFilePath))
	{
		var confFile = fs.readFileSync(configFilePath, 'utf8');
		config = Object.assign({ignore:[], verbose:verbose}, JSON.parse(confFile))
		config.ignore = config.ignore.map(str=>{ return RegExp(str, 'g')})
		if(verbose)
			console.log("config loaded from ", configFilePath)
	}
	else
	{
		if(verbose)
			console.log('\x1b[31m%s\x1b[0m',"[WARN]can't find config file from ", configFilePath)
		config = Object.assign({ignore:[], verbose:verbose})
	}
}

function get_commits(dir=__dirname, since='1.month', verbose=true, include_merge=false, valid_threshold=1000) {


	let result = execSync(`git log --since=${since} --abbrev-commit --oneline`, {cwd:dir}).toString()
	let commitList = []

	commitTexts = result.split("\n")
	commitTexts.forEach(item=>{
		commitId = item.substr(0, 7)
		text = item.substr(7)	
		commitList.push({id:commitId, text:text})
	})

	let newCommitList = commitList.map(commit=>{		
		let c = get_commit_detail(commit.id, dir)
		c.text = commit.text
		c.totalWeight = 0
		c.modifications.forEach( mod=>{
				if(mod.editAmt < valid_threshold)
					c.totalWeight += 	mod.editAmt
		})

		if(verbose && !!commit.id)
			console.log('\x1b[36m%s\x1b[0m',`${commit.id}`,`${c.totalWeight}\t${c.author}\t${(('merge' in c) ? '\tMERGE' : '') }`)
		
		return c
	})

	if(include_merge == false)
		newCommitList = newCommitList.filter(e=>{ return 'merge' in e == false })

	// console.log("----------------------")
	return newCommitList
}

function parse_line(commit, line, show_each_file=false){
	if(line.indexOf("Merge:") == 0){
		commit["merge"] = line.split(":")[1].trim().split(" ")
	}
	else if(line.indexOf("Author:") == 0){
		commit["author"] = line.split(":")[1].trim()
	}
	else if(line.indexOf("Date:") == 0){
		commit["date"] = line.substr("Date:".length).trim()
	}
	else if(line.match(/(.+)\s+\|\s+(\d+)\s.+/) != null){
		modInfo = line.match(/(.+)\s+\|\s+(\d+)\s.+/)
		filename = modInfo[1].trim()
		lineNum = parseInt(modInfo[2])

		let matched = config.ignore.find(re=>{ return filename.match(re) != null })
		if(matched == null){			
			commit.modifications.push({"filename":filename, "editAmt":lineNum})
		}

		if(show_each_file){
			if(matched == null)
				console.log("  accept:", lineNum, "\t", filename)	
			else
				console.log("  reject:", lineNum, "\t", filename, "\t", matched)
		}
	}
}

function get_commit_detail(commitId, dir=__dirname, show_each_file=false){

	let commit = { id:commitId, modifications:[] }
	let result = execSync(`git show ${commitId} --stat=256`, {cwd:dir}).toString()

	let lines = result.split("\n")
	lines.forEach(line=>{
		parse_line(commit, line, show_each_file)
	})


	return commit

}

module.exports = {get_commits, load_config, get_commit_detail}