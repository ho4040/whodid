

function store(storage, commit){
	
	let dict = storage
	let author = commit.author

	if( author in dict  == false)
		dict[author] = []
	
	dict[author].push(commit)

	return dict
}

function run(commits, num=3, author_filter=null){
	
	let storage = {}

	commits.forEach(commit=>{ store(storage, commit) })

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
		grouped_commits.forEach(commit=>{
			if(!!commit.id)
				console.log(`  ${commit.id}\t${commit.totalWeight}\t${commit.text.split("\n")[0]}`)
		})
	}

	return
}

module.exports = {run}
