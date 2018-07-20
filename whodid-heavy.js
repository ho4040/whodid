

function store(storage, commit){
	
	let dict = storage
	let author = commit.author

	if( author in dict  == false)
		dict[author] = []
	
	dict[author].push(commit)

	return dict
}

function run(commits, num=3, author_filter=null, as_json=false){
	
	let storage = {}

	commits.forEach(commit=>{ store(storage, commit) })

	if(as_json){
		console.log(JSON.stringify(storage))
	}else{
		for(let author in storage){
			if(!!author_filter && author != author_filter)
				continue

			grouped_commits = storage[author]
			grouped_commits = grouped_commits.sort((a, b)=>{
				//console.log(JSON.stringify(a))
				return b.totalWeight - a.totalWeight
			})

			console.log("\n")
			console.log(author)
			grouped_commits.length = num


			console.log("=====================================================")
			console.log(" commit\t| line\t | note")
			console.log("-----------------------------------------------------")
			grouped_commits.forEach(e=>{
				if(!!e.id)
				console.log(`\x1b[36m${e.id}\x1b[0m\t| ${e.totalWeight}\t | ${e.text.split("\n")[0]}`)
			})
			console.log("=====================================================")

		}
	}

	return
}

module.exports = {run}
