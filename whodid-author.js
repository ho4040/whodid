

function store(storage, author, amt){
	if(author in storage == false)
		storage[author] = 0
	storage[author] += amt
	return storage
}

function run(commits){
	
	let storage = {}
	commits.forEach(commit=>{ store(storage, commit.author, commit.totalWeight) })

	console.log("\n")
	console.log("Contribution state")
	console.log(JSON.stringify(storage, null, 4))
}

module.exports = {run}
