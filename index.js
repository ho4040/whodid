#! /usr/bin/env node
let whodid = require('./whodid.js')
let whodid_author = require('./whodid-author.js')
let whodid_file = require('./whodid-file.js')
let whodid_heavy = require('./whodid-heavy.js')

var os = require('os');
var argv = require( 'argv' );

argv.version('v1.0.8');

function make_extra_option(options){
	return [
		{
			name:"verbose",
			type:"boolean",
			description:"show process or not (default:false)",
			example:"'whodid author --verbose=false"
		},{
			name:"path",
			type:"string",
			description:"the specification git project path.(default: './')",
			example:"'whodid author --path=/home/ubuntu/someProj"
		},{
			name:"since",
			type:"string",
			description:"counting start day. (deafult:2.month)",
			example:"'whodid author --since=2.month"
		},{
			name:"include-merge",
			type:"boolean",
			description:"specify include merge commit or not.(default: false)",
			example:"'whodid author --include-merge=true"
		},{
			name:"valid-threshold",
			type:"integer",
			description:"drop file when counting lines, if number of modifed line is to big.(default:1000)",
			example:"'whodid author --valid-threshold=10000"
		},{
			name:"as-json",
			type:"boolean",
			description:"print as json (default:false)",
			example:"'whodid author --as-json=true"
		},{
			name:"num",
			type:"integer",
			description:"number of result",
			example:"'whodid heavy --since=2.month --num=10"
		}
	].concat(options)
}

argv.info([
	"whodid",
	"Usage 1: whodid",
	"Usage 2: whodid author|file"
	].join(os.EOL));

argv.mod({
	mod:'author',
	description:[
		"Check modified or added line numbers of each committer",
		"Examples:",
		"\twhodid author",
		"\twhodid author --verbose=false",
		"\twhodid author --path=~/someProj",
		"\twhodid author --path=~/someProj --since=1.month"
	].join(os.EOL),
	options:make_extra_option([])
});

argv.mod({
	mod:'file',
	description:[
		"Check file list of most modified",
		"Example:",
		"\twhodid file",
		"\twhodid file --path=~/someProj",
		"\twhodid file --path=~/someProj --since=1.month"
	].join(os.EOL),
	options:make_extra_option([])
});

argv.mod({
	mod:'heavy',
	description:[
		"Check what is heavy commit",
		"Examples:",
		"\twhodid heavy",
		"\twhodid heavy --path=~/someProj",
		"\twhodid heavy --path=~/someProj --since=1.month",
		"\twhodid heavy --path=~/someProj --author='zero <zero@nooslab.com>'",
	].join(os.EOL),
	options:make_extra_option([{
			name:"author",
			type:"string",
			description:"show only specific author",
			example:"'whodid heavy --author='zero <zero@nooslab.com>'"
		}])
});

argv.mod({
	mod:'debug',
	description:[
		"show log commit parsing log",
		"Examples:",
		"\twhodid debug --commit=<commit-id>",
	].join(os.EOL),
	options:make_extra_option([{
			name:"commit",
			type:"string",
			description:"commit hash",
			example:"'whodid debug --commit=a1b2c3d"
		}])
});

var args = argv.run();

let path = args.options.path?args.options.path:"./";
let since = args.options.since?args.options.since:"1.month";
let verbose = ((!!args.options.verbose)	? args.options.verbose	: false);
let include_merge = ((!!args.options['include-merge'])	? args.options['include-merge']	: false);
let valid_threshold = ((!!args.options['valid-threshold'])	? args.options['valid-threshold']	: 1000);
let as_json = ((!!args.options['as-json'])	? args.options['as-json']	: false);
let num = ((!!args.options.num)	? args.options.num	: 10);

if(path[path.length-1] != "/")
	path = path+"/"

if(verbose){	
	console.log("path:", path)
	console.log("since:", since)
	console.log("include-merge:", include_merge)
	console.log("valid-threshold:", valid_threshold)
	console.log("as-json:", as_json)
	console.log("num:", num)
}

whodid.load_config(path, verbose)

switch(args.mod) {

	case "author":
	default:
	{
		let commits = whodid.get_commits(path, since, verbose, include_merge, valid_threshold)	
		whodid_author.run(commits, num, as_json)
	}
	break;

	case "file":
	{
		let commits = whodid.get_commits(path, since, verbose, include_merge, valid_threshold)	
		whodid_file.run(commits, num, as_json)
	}
	break;

	case "heavy":
	{
		let commits = whodid.get_commits(path, since, verbose, include_merge, valid_threshold)	
		let author = args.options.author?args.options.author:null;
		whodid_heavy.run(commits, num, author, as_json)
	}
	break;

	case "debug":
	{
		let commitId = args.options.commit?args.options.commit:null;
		if(commitId == null)
			console.log("commit option required")
		else{
			console.log("debug commit: ", commitId)
			whodid.get_commit_detail(commitId, path, true)
		}
	}
	break;

}

