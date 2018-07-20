// whodid.js
var execSync = require('child_process').execSync
//var tdqm = require("ntqdm")();

function get_commits(dir=__dirname, since='1.month', verbose=true, include_merge=false, commit_drop_threshold=2000) {

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
				if(mod.editAmt < commit_drop_threshold)
					c.totalWeight += 	mod.editAmt
		})
		if(verbose)
			console.log(`${commit.id}\t${c.totalWeight}\t${c.author}\t${(('merge' in c) ? '\tMERGE' : '') }`)
		return c
	})

	if(include_merge == false)
		newCommitList = newCommitList.filter(e=>{ return 'merge' in e == false })

	// console.log("----------------------")
	return newCommitList
}

function parse_line(data, line){
	if(line.indexOf("Merge:") == 0){
		data["merge"] = line.split(":")[1].trim().split(" ")
	}
	else if(line.indexOf("Author:") == 0){
		data["author"] = line.split(":")[1].trim()
	}
	else if(line.indexOf("Date:") == 0){
		data["date"] = line.substr("Date:".length).trim()
	}
	else if(line.match(/(.+)\s+\|\s+(\d+)\s.+/) != null){
		modInfo = line.match(/(.+)\s+\|\s+(\d+)\s.+/)
		filename = modInfo[1]
		lineNum = parseInt(modInfo[2])
		data.modifications.push({"filename":filename, "editAmt":lineNum})
	}
}

function get_commit_detail(commitId, dir=__dirname){

	let commit = { id:commitId, modifications:[] }
	let result = execSync(`git show ${commitId} --stat`, {cwd:dir}).toString()

	let lines = result.split("\n")
	lines.forEach(line=>{
		parse_line(commit, line)
	})


	return commit

}

module.exports = {get_commits}