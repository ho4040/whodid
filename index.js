#! /usr/bin/env node
let whodid_author = require('./whodid-author.js')
let whodid_file = require('./whodid-file.js')
let whodid_heavy = require('./whodid-heavy.js')

var os = require('os');
var argv = require( 'argv' );

argv.version('v1.0.2');

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
	options:[
		{
			name:"verbose",
			short:"v",
			type:"boolean",
			description:"show process or not",
			example:"'whodid author -v=false"
		},{
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
			name:"verbose",
			short:"v",
			type:"boolean",
			description:"show process or not",
			example:"'whodid file -v=false"
		},{
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

argv.mod({
	mod:'heavy',
	description:[
		"Check what is heavy commit",
		"Examples:",
		"\twhodid heavy",
		"\twhodid heavy --path=~/someProj",
		"\twhodid heavy --path=~/someProj --since=1.month",
		"\twhodid heavy --path=~/someProj --author=jeff",
	].join(os.EOL),
	options:[
		{
			name:"verbose",
			type:"boolean",
			description:"show process or not",
			example:"'whodid heavy --verbose=false"
		},{
			name:"path",
			type:"string",
			description:"the specification git project path. Default: '.'",
			example:"'whodid heavy --path=./"
		},{
			name:"since",
			short:"s",
			type:"string",
			description:"commition date",
			example:"'whodid heavy --since=2.month"
		},{
			name:"author",
			type:"string",
			description:"author filter",
			example:"'whodid heavy --since=2.month"
		},{
			name:"num",
			type:"integer",
			description:"number of top heavy to see",
			example:"'whodid heavy --since=2.month --author=zero --num=10"
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
		let verbose = ((!!args.options.verbose)	? args.options.verbose	: false);
		//console.log(path, since)
		whodid_author.run(path, since, verbose)
	}
	break;

	case "file":
	{
		let path = args.options.path?args.options.path:"./";
		let since = args.options.since?args.options.since:"1.month";
		let verbose = ((!!args.options.verbose)	? args.options.verbose	: false);
		let num = ((!!args.options.num)	? args.options.num	: 3);
		whodid_file.run(path, since, verbose, num)
	}
	break;

	case "heavy":
	{
		let path = args.options.path?args.options.path:"./";
		let since = args.options.since?args.options.since:"1.month";
		let verbose = ((!!args.options.verbose)	? args.options.verbose	: false);
		let num = ((!!args.options.num)	? args.options.num	: 3);
		let author = args.options.author
		//console.log("path:", path)
		//console.log("verbose:", verbose)
		whodid_heavy.run(path, since, verbose, num, author)
	}
	break;

	default:
		let path 	= ((!!args.options.path) 	? args.options.path 	: "./");
		let since = ((!!args.options.since)	? args.options.since	: "1.month");
		let verbose = ((!!args.options.verbose)	? args.options.verbose	: false);
		//console.log(path, since)
		whodid_author.run(path, since, verbose)
		//console.log("mode required. check out whodid -h");
	break;
}

