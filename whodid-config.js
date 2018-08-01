var fs = require('fs')

var _m = {
	config:{
		cwd: "./",
		since: "1.month",
		until: "now",
		verbose: false,
		include_merge: false,
		line_accept_max: 500,
		as_json: false,
		num : 10,
		ignore:[]
	}
}

function load_from_file(config_filename){
	
	let config_file_path = config_filename

	if(fs.existsSync(config_file_path)) {
		var confFile = fs.readFileSync(config_file_path, 'utf8');
		_m.config = Object.assign(_m.config, JSON.parse(confFile))
		console.log("config loaded from ", config_file_path)
	}
	else {
		console.log('\x1b[31m%s\x1b[0m',"[WARN]can't find config file from ", config_file_path)
	}

}

function adjust(opt){
	_m.config = Object.assign(_m.config, opt)
}

function retrieve(){
	//console.log('retrieve', _m.config)
	return JSON.parse(JSON.stringify(_m.config)); // return cloned
}



module.exports = { load_from_file, adjust, retrieve }