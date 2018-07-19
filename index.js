#! /usr/bin/env node
let whodid_author = require('./whodid-author.js')
let whodid_file = require('./whodid-file.js')

var os = require('os');
var argv = require( 'argv' );

argv.version('v1.0.0');

argv.info([
	"whodid",
	"Usage 1: whodid",
	"Usage 2: whodid author|file"
	].join(os.EOL));

argv.mod({
	mod:'author',
	description:[
		"Check modified or added line numbers of each committer",
		"Example:",
		"\twhodid author",
		"\twhodid author --path=~/someProj",
		"\twhodid author --path=~/someProj --since=1.month"
	].join(os.EOL),
	options:[
		{
			name:"path",
			short:"p",
			type:"string",
			description:"the specification git project path. Default: '.'",
			example:"'whodid author --path=/home/ubuntu/someProj"
		},{
			name:"since",
			short:"s",
			type:"string",
			description:"commition date",
			example:"'whodid author --since=2.month"
		}
	]
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
	options:[
		{
			name:"path",
			short:"p",
			type:"string",
			description:"the specification git project path. Default: '.'",
			example:"'whodid file --path=./"
		},{
			name:"since",
			short:"s",
			type:"string",
			description:"commition date",
			example:"'whodid file --since=2.month"
		}
	]
});

var args = argv.run();
//console.log(JSON.stringify(args.options))
switch(args.mod) {

	case "author":
	{
		let path 	= ((!!args.options.path) 	? args.options.path 	: "./");
		let since = ((!!args.options.since)	? args.options.since	: "1.month");
		//console.log(path, since)
		whodid_author.run(path, since)
	}
	break;

	case "file":
	{
		whodid_file.run(git_proj_path)
		let path = args.options.path?args.options.path:"./";
		let since = args.options.since?args.options.since:"1.month";
		whodid_file.run(path, since)
	}
	break;

	default:
		console.log("mode required. check out whodid -h");
	break;
}

