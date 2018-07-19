// whodid.js
var execSync = require('child_process').execSync
//var tdqm = require("ntqdm")();

function get_commits(dir=__dirname, since='1.month') {

	let result = execSync(`git log --since=${since} --abbrev-commit --oneline`, {cwd:dir}).toString()
	let commitList = []
	commitTexts = result.split("\n")
	commitTexts.forEach(item=>{
		commitId = item.substr(0, 7)
		text = item.substr(7)	
		commitList.push({id:commitId, text:text})
	})

	return commitList.map(commit=>{
		console.log("..processing..", commit.id)
		return get_commit_detail(commit.id, dir)
	})
}

function get_commit_detail(commitId, dir=__dirname){

	let commit = { id:commitId }
	let result = execSync(`git show ${commitId} --stat`, {cwd:dir}).toString()
	
	let lines = result.split("\n")
	lines.shift() // remove commit part
	
	let author = lines.shift().split(":")[1].trim() // get author part
	author = author.split(" ")[0]
	
	let date = lines.shift().split(":")[1].trim() // get date part
	
	lines.shift() // remove empty line
	
	let note = []
	while(lines[0].substr(0,4)=='    ')
		note.push( lines.shift() )
	note = note.join("\n")

	lines.shift() // remove empty line

	let modifications = []
	while(lines[0].indexOf('|')!=-1) {

		let info = lines.shift().split("|")
		let filename	= info[0]
		let editAmt		= info[1].trim().split(" ")[0] //.replace(/[\+\-]/g, "")

		if(editAmt.match(/[\d]+/))
			modifications.push({"filename":filename, "editAmt":parseInt(editAmt)})
		else
			modifications.push({"filename":filename, "editAmt":1})
	}

	commit["note"] = note
	commit["author"] = author
	commit["date"] = date
	commit["modifications"] = modifications

	// console.log(modifications)

	return commit

}

module.exports = {get_commits}