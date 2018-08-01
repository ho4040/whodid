#! /usr/bin/env node

let os 				= require('os');
let argv 			= require( 'argv' );
let whodid_config 	= require('./whodid-config.js')
let whodid_base 	= require('./whodid.js')
let whodid_author 	= require('./whodid-author.js')
let whodid_heavy 	= require('./whodid-heavy.js')
let whodid_file 	= require('./whodid-file.js')
let to_snake_case 	= require('lodash.snakecase')


argv.version('v1.0.11');

function make_extra_option(options){
	return [
		{
			name:"verbose",
			type:"boolean",
			description:"show process or not (default:false)",
			example:"'whodid author --verbose=false"
		},{
			name:"cwd",
			type:"string",
			description:"the specification git project cwd.(default: './')",
			example:"'whodid author --cwd=/home/ubuntu/someProj"
		},{
			name:"since",
			type:"string",
			description:"counting start day. (deafult:2.month)",
			example:"'whodid author --since=2.month"
		},{
			name:"until",
			type:"string",
			description:"counting end day. (deafult:now)",
			example:"'whodid author --until=now"
		},{
			name:"include-merge",
			type:"boolean",
			description:"specify include merge commit or not.(default: false)",
			example:"'whodid author --include-merge=true"
		},{
			name:"line-accept-max",
			type:"integer",
			description:"set acceptable limit of modified line number",
			example:"'whodid author --line-accept-max=10000"
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

var opts = {}
for(let k in args.options)
	opts[to_snake_case(k)] = args.options[k] 

whodid_config.load_from_file("whodid.json", opts.cwd)
whodid_config.adjust(opts)
if(!!opts.verbose)
	console.log(JSON.stringify(whodid_config.retrieve(), null, 4))

switch(args.mod) {
	case "author":
	default:
	{
		let commits = whodid_base.get_commits()	
		whodid_author.run(commits)
	}
	break;
	case "heavy":
	{
		let commits = whodid_base.get_commits()	
		whodid_heavy.run(commits)
	}
	break;
	case "file":
	{
		let commits = whodid_base.get_commits()	
		whodid_file.run(commits)
	}
	break;

	case "debug":
	{
		let commit_hash = args.options.commit?args.options.commit:null;
		if(commit_hash == null)
			console.log("commit option required")
		else{
			console.log("debug commit: ", commit_hash)
			let commit = whodid_base.load_detail(commit_hash)
			let total = 0
			
			commit.modifications.forEach(e=>{
				console.log(`  [accept] ${e.edit_line_num} lines\t ${e.filename}`)
			})
			
			commit.ignored.forEach(e=>{
				console.log(`  [ignore] ${e.filename} by ${e.reason.type}`)
			})

			commit.modifications.forEach(e=>{ total += e.edit_line_num})
			console.log("  total accepted line:", total)
		}
	}
	break;
}

