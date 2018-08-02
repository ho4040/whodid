const Table = require('cli-table');

module.exports = {
	rpad : function(str, pad=20, pad_char=" "){
		while(str.length < pad)
			str = str + pad_char
		return str
	},
	lpad : function(str, pad=20, pad_char=" "){
		while(str.length < pad)
			str = pad_char+str
		return str
	},
	red : function (str){
		return `\x1b[31m${str}\x1b[0m`
	},
	green : function(str){
		return `\x1b[32m${str}\x1b[0m`
	},
	yellow : function(str){
		return `\x1b[33m${str}\x1b[0m`
	},
	blue : function(str){
		return `\x1b[34m${str}\x1b[0m`
	},
	magenta : function(str){
		return `\x1b[35m${str}\x1b[0m`
	},
	cyan : function(str){
		return `\x1b[36m${str}\x1b[0m`
	},
	col_color:function(tabular_data, colors){
		return tabular_data.map(row=>{
			return row.map((e, i, a)=>{
				if(!!colors[i]){
					let color = colors[i]
					if(typeof colors[i] == 'function')
						return colors[i](e)
					else {
						let color_func = this[color];
						return color_func(e)
					}
				}
				else
					return e
			})
		})
	},
	serialize:function(tabular_data, output_type, opt){
		if(output_type == 'json'){
			return JSON.stringify(tabular_data)
		}else if(output_type == 'csv'){
			if(!opt.csv_sep)
				opt.csv_sep = ", "
			let logs = []
			return tabular_data.map(row=>{ return row.join(opt.csv_sep) }).join("\n")
		}else{
			let result = tabular_data.slice()						
			let table = new Table({head:result.shift(), style:{head:result.map(e=>{ return 'white' })}})
			result = this.col_color(result, opt.colors)
			while(result.length>0)		
				table.push(result.shift())
			return table.toString()
		}
	}
}