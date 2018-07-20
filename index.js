#! /usr/bin/env node
let whodid = require('./whodid.js')
let whodid_author = require('./whodid-author.js')
let whodid_file = require('./whodid-file.js')
let whodid_heavy = require('./whodid-heavy.js')

var os = require('os');
var argv = require( 'argv' );

argv.version('v1.0.4');

function make_extra_option(options){
	return [
		{
			name:"verbose",
			type:"boolean",
			description:"show process or not",
			example:"'whodid author -v=false"
		},{
			name:"path",
			type:"string",
			description:"the specification git project path. Default: '.'",
			example:"'whodid author --path=/home/ubuntu/someProj"
		},{
			name:"since",
			type:"string",
			description:"commition date",
			example:"'whodid author --since=2.month"
		},{
			name:"include-merge",
			type:"boolean",
			description:"specify include merge commit or not.(default: false)",
			example:"'whodid author --include-merge=true"
		},{
			name:"commit-drop-threshold",
			type:"integer",
			description:"If number of modifed line is to big then drop commit out.(default:10000)",
			example:"'whodid author --commit-drop-threshold=10000"
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
	options:make_extra_option([{
			name:"num",
			type:"integer",
			description:"number of result",
			example:"'whodid file --since=2.month --num=10"
		}])
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
	options:make_extra_option([{
			name:"num",
			type:"integer",
			description:"number of result",
			example:"'whodid file --since=2.month --num=10"
		}])
});

var args = argv.run();

let path = args.options.path?args.options.path:"./";
let since = args.options.since?args.options.since:"1.month";
let verbose = ((!!args.options.verbose)	? args.options.verbose	: false);
let include_merge = ((!!args.options['include-merge'])	? args.options['include-merge']	: false);
let commit_drop_threshold = ((!!args.options['commit-drop-threshold'])	? args.options['commit-drop-threshold']	: 10000);

let commits = whodid.get_commits(path, since, verbose, include_merge, commit_drop_threshold)

switch(args.mod) {

	default:
	case "author":
		whodid_author.run(commits)
	break;

	case "file":
	{
		let num = ((!!args.options.num)	? args.options.num	: 3);
		whodid_file.run(commits, num)
	}
	break;

	case "heavy":
	{
		let author = args.options.author?args.options.author:null;
		let num = ((!!args.options.num)	? args.options.num	: 3);
		whodid_heavy.run(commits, num, author)
	}
	break;

}

