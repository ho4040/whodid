# Overview

CLI contribution check tool from git repository.
this tool read all log with `git log` command and count edited line from all commits.


![demo](https://i.imgur.com/T9mJfIk.png)


### Features

* aggregation of edited line from all commits by each author
* aggregation of most edited file from all commits
* find heaviest commit from commits of each author

# Install

```
$ npm install -g whodid
```


# Usage

befor run `whodid` you have to pull from git repository

```bash
$ cd your-proj-dir
$ git pull origin master
```

and then..


#### check most contributed author in 1.month

```bash
$ whodid author --path=<your-project-path> --since=1.month
```

#### check most modfied files

```bash
$ whodid file --verbose=false --path=<your-project-path> --since=1.month
```

#### check what is most heavy commit of each author

```bash
$ whodid heavy --path=<your-project-path> --since=1.month
```

you can make it quiet with verbose flag

```bash
$ whodid author --path=<your-project-path> --since=1.month --verbose=false
```

### Default action

```bash
$ whodid --path=./ --since=1.month --verbose=false --include-merge=false  --commit-drop-threshold=2000
```
is same as

```bash
$ whodid
```

and you can check another options in help command.

```bash
$ whodid --help
```

# Make exceptions

To avoid counting of external library files or image files in commit, 

Specify Regexp on `whodid.json` and make this file place in your project directory.

```json
{
	"ignore":[
			".+.svg",
			".+/bower_components/.+",
			".+/node_modules/.+",
			".+/__libs__/.+"
	]
}
```
