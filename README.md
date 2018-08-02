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
$ whodid author --cwd=<your-project-path> --since=1.month
```

#### check most modfied files

```bash
$ whodid file --verbose=false --cwd=<your-project-path> --since=1.month
```

#### Check what is most heavy commit of each author

```bash
$ whodid heavy --cwd=<your-project-path> --since=1.month
```

you can make it quiet or not with verbose flag

```bash
$ whodid author --cwd=<your-project-path> --since=1.month --verbose=false
```

### Check working history

```bash
$ whodid history --since=1.month --author="sally"
```


#### JSON or CSV result

you can get json output with `--output-as` option

```bash
$ whodid --cwd=./ --output-as=json
```

or

```bash
$ whodid --cwd=./ --output-as=csv --csv-seprator="|"
```

### Check evaluation process more precisely

```bash
$  whodid debug --commit=a1b2c3d
```

#### Check another options in help command.

```bash
$ whodid --help
```


#### Default action

```bash
$ whodid --cwd=./ --since=1.month --verbose --include-merge=false  --line-accept-max=1000
```
is same as

```bash
$ whodid
```


# Setting with config file

most of option can be predefined in `whodid.json`.


```json
{
	"ignore":[
			".+.svg",
			".+/bower_components/.+",
			".+/node_modules/.+",
			".+/__libs__/.+"
	],
	"line_accept_num":1000, 
	"output_as":"csv", // table or csv or json
	"csv_seperator":", ", // you can speicify seperator
}
```


# ignore file speicification

To avoid counting of external library files or image files in commit, 

Specify Regexp on `whodid.json` and make this file place in your project directory.
