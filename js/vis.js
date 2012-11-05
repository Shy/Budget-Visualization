var BubbleChart, root, __bind = function(fn, me) {
	return function() {
		return fn.apply(me, arguments);
	};
};

BubbleChart = (function() {

	function BubbleChart(data) {
		this.hide_details = __bind(this.hide_details, this);

		this.show_details = __bind(this.show_details, this);

		this.hide_years = __bind(this.hide_years, this);

		this.display_years = __bind(this.display_years, this);

		this.move_towards_year = __bind(this.move_towards_year, this);

		this.display_by_year = __bind(this.display_by_year, this);

		this.move_towards_center = __bind(this.move_towards_center, this);

		this.display_group_all = __bind(this.display_group_all, this);

		this.start = __bind(this.start, this);

		this.create_vis = __bind(this.create_vis, this);
`
		this.create_nodes = __bind(this.create_nodes, this);

		var max_amount;
		this.data = data;
		this.width = window.innerWidth;
		this.height = window.innerHeight - 100;
		this.tooltip = CustomTooltip("gates_tooltip", 240);
		this.center = {
			x : this.width / 2,
			y : this.height / 2
		};
		this.year_centers = {
			"Office Supplies" : {
				x : this.width * 4/20,
				y : this.height * 7/32 
			},
			"Travel" : {
				x : this.width * 7/20,
				y : this.height * 7/32
			},
			"Athletics" : {
				x : this.width * 1/2,
				y : this.height * 7/32
			},
			"Meetings" : {
				x : this.width * 13/20,
				y : this.height * 7/32
			},
			"Student Court" : {
				x : this.width * 16/20,
				y : this.height * 7/32
			},
			"Marketing" : {
				x : this.width * 4/20,
				y : this.height * 6.5/16
			},
			"Technology" : {
				x : this.width * 7/20,
				y : this.height * 6.5/16
			},
			"Programming" : {
				x : this.width * 1/2,
				y : this.height * 6.5/16
			},
			"Co-Sponsorship" : {
				x : this.width * 13/20,
				y : this.height * 6.5/16
			},
			"Retreats" : {
				x : this.width * 16/20,
				y : this.height * 6.5/16
			},
			"Government" : {
				x : this.width * 4/20,
				y : this.height * 9.5/16
			},
			"Uptown" : {
				x : this.width * 7/20,
				y : this.height * 9.5/16
			},
			"Sustainability" : {
				x : this.width * 1/2,
				y : this.height * 9.5/16
			},
			"OSGA" : {
				x : this.width * 13/20,
				y : this.height * 9.5/16
			},
			"Career Development" : {
				x : this.width * 16/20,
				y : this.height * 9.5/16
			},
			"Education" : {
				x : this.width * 4/20,
				y : this.height * 13/16
			},
			"Elections" : {
				x : this.width * 7/20,
				y : this.height * 13/16
			},
			"Inauguration" : {
				x : this.width * 1/2,
				y : this.height * 13/16
			},
			"Conferences" : {
				x : this.width * 13/20,
				y : this.height * 13/16
			},
			"FYLP" : {
				x : this.width * 16/20,
				y : this.height * 13/16
			}		};
		this.layout_gravity = -0.01;
		this.damper = 0.1;
		this.vis = null;
		this.nodes = [];
		this.force = null;
		this.circles = null;

		this.fill_color = d3.scale.ordinal().domain(["Programming", "Co-Sponsorship", "Technology", "Meetings", "Marketing", "Office Supplies", "Travel", "Student Court", "Athletics", "Education", "Government", "Uptown", "Career Development", "Retreats", "Sustainability", "OSGA", "Elections", "Conferences", "Inauguration", "FYLP"])
		.range(["#587C0B", "#9FC54Di", "#D0FB74", "#FBC97B", "#DFF2B1", "#073D35", "#0B7C74", "#41DFD3", "#BAE2DC", "#210770", "#6340D3", "#8D79E0", "#AC9ECA", "#701B2D", "#D34265", "#EC869B", "#FCC8D4", "#4B2E01", "#7C5212", "#F9A423"]);
		
		max_amount = d3.max(this.data, function(d) {
			return parseInt(d.total_amount);
		});
		this.radius_scale = d3.scale.pow().exponent(0.5).domain([0, max_amount]).range([2, 85]);
		
		this.create_nodes();
		this.create_vis();
	}


	BubbleChart.prototype.create_nodes = function() {
		var _this = this;
		this.data.forEach(function(d) {
			var node;
			
			node = {
				id : d.id,
				radius : (_this.width*_this.height /630000) * Math.sqrt(d.total_amount/3.14) ,

				value : d.total_amount,
				name : d.name,
				org : d.category,
				bill : d.bill,
	
				
				x : Math.random() * 1900,
				y : Math.random() * 1800
			};
			return _this.nodes.push(node);
		});
		return this.nodes.sort(function(a, b) {
			return b.value - a.value;
		});
	};

	BubbleChart.prototype.create_vis = function() {
		var that, _this = this;
		this.vis = d3.select("#vis").append("svg").attr("width", this.width).attr("height", this.height).attr("id", "svg_vis");
		this.circles = this.vis.selectAll("circle").data(this.nodes, function(d) {
			return d.id;
		});
		that = this;
		this.circles.enter().append("circle").attr("r", 0).attr("fill", function(d) {
			return _this.fill_color(d.org);
		}).attr("stroke-width", 2).attr("stroke", function(d) {
			return d3.rgb(_this.fill_color(d.org)).darker();
		}).attr("id", function(d) {
			return "bubble_" + d.id;
		}).on("mouseover", function(d, i) {
			return that.show_details(d, i, this);
		}).on("mouseout", function(d, i) {
			return that.hide_details(d, i, this);
		});
		return this.circles.transition().duration(2000).attr("r", function(d) {
			return d.radius;
		});
	};

	BubbleChart.prototype.charge = function(d) {
		return -Math.pow(d.radius, 2.0) / 8;
	};

	BubbleChart.prototype.start = function() {
		return this.force = d3.layout.force().nodes(this.nodes).size([this.width, this.height]);
	};

	BubbleChart.prototype.display_group_all = function() {
		var _this = this;
		this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
			return _this.circles.each(_this.move_towards_center(e.alpha)).attr("cx", function(d) {
				return d.x;
			}).attr("cy", function(d) {
				return d.y;

			});
		});
		this.force.start();
		return this.hide_years();
	};

	BubbleChart.prototype.move_towards_center = function(alpha) {
		var _this = this;
		return function(d) {
			d.x = d.x + (_this.center.x - d.x) * (_this.damper + 0.02) * alpha;
			return d.y = d.y + (_this.center.y - d.y) * (_this.damper + 0.02) * alpha;
		};
	};

	BubbleChart.prototype.display_by_year = function() {
		var _this = this;
		this.force.gravity(this.layout_gravity).charge(this.charge).friction(0.9).on("tick", function(e) {
			return _this.circles.each(_this.move_towards_year(e.alpha)).attr("cx", function(d) {
				return d.x;
			}).attr("cy", function(d) {
				return d.y;
			});
		});
		this.force.start();
		return this.display_years();
	};

	BubbleChart.prototype.move_towards_year = function(alpha) {
		var _this = this;
		return function(d) {
			var target;
			target = _this.year_centers[d.org];
			
			d.x = d.x + (target.x - d.x) * (_this.damper + 0.02) * alpha * 1.1;
			return d.y = d.y + (target.y - d.y) * (_this.damper + 0.02) * alpha * 1.1;
		};
	};

	BubbleChart.prototype.display_years = function() {
		var years, years_data, years_x,years_y, _this = this;
		years_x = {

			"Office Supplies" : this.width * 4/20,
			"Travel" : this.width * 7/20,
			"Athletics" : this.width * 1/2,
			"Meetings"  : this.width * 13/20,
			"Student Court"  : this.width * 16/20,
			
			"Marketing"  : this.width * 4/20,
			"Technology"  : this.width * 7/20,
			"Programming"  : this.width * 1/2,
			"Co-Sponsorship"  : this.width * 13/20,
			"Retreats"  : this.width * 16/20,
			
			"Government"  : this.width * 4/20,
			"Uptown"  : this.width * 7/20 ,
			"Sustainability"  : this.width * 1/2,
			"OSGA"  : this.width * 13/20,
			"Career Development"  : this.width * 16/20,
			
			"Education" : this.width * 4/20,
			"Elections" : this.width * 7/20,
			"Inauguration" : this.width * 1/2,
			"Conferences" : this.width * 13/20,
			"FYLP" : this.width * 16/20	

		};
		years_y = {

			"Office Supplies" : this.height * 7/32, 
			"Travel" : this.height * 7/32,
			"Athletics" : this.height * 7/32,
			"Meetings" : this.height * 7/32,
			"Student Court" : this.height * 7/32,

			"Marketing" : this.height * 17/32,
			"Technology" : this.height * 17/32,
			"Programming" : this.height * 17/32,
			"Co-Sponsorship" : this.height * 17/32,
			"Retreats" : this.height * 17/32,
			
			"Government" : this.height * 24/32,
			"Uptown" : this.height * 24/32,
			"Sustainability" : this.height * 24/32,
			"OSGA" : this.height * 24/32,
			"Career Development" : this.height * 24/32,
			
			"Education" : this.height * 31/32,
			"Elections" : this.height * 31/32,
			"Inauguration" : this.height * 31/32,
			"Conferences" : this.height * 31/32,
			"FYLP": this.height * 31/32
			
		};
		
		years_data = d3.keys(years_x);
		years = this.vis.selectAll(".years").data(years_data);
		return years.enter().append("text").attr("class", "years").attr("x", function(d) {
			return years_x[d];
		}).attr("y", function(d){
			return years_y[d] + 10;
		}).attr("text-anchor", "middle").text(function(d) {
			return d;
		});
	};

	BubbleChart.prototype.hide_years = function() {
		var years;
		return years = this.vis.selectAll(".years").remove();
	};

	BubbleChart.prototype.show_details = function(data, i, element) {
		var content;
		d3.select(element).attr("stroke", "black");

		content = "<h6 class=\"head\"> " + data.name + "</h6><br/>";
		content += "<span class=\"name\">Amount:</span><span class=\"value\"> $" + (addCommas(data.value)) + "</span><br/>";
		content += "<span class=\"name\">Line Item:</span><span class=\"value\"> " + data.org + "</span>"  + "</span><br/>";
		content += "<span class=\"name\">Type:</span><span class=\"value\"> " + data.bill + "</span>";
		
		
		return this.tooltip.showTooltip(content, d3.event);

	};

	BubbleChart.prototype.hide_details = function(data, i, element) {
		var _this = this;
		d3.select(element).attr("stroke", function(d) {
			return d3.rgb(_this.fill_color(d.org)).darker();
		});
		return this.tooltip.hideTooltip();
	};

	return BubbleChart;

})();

root = typeof exports !== "undefined" && exports !== null ? exports : this;

$(function() {
	var chart, render_vis, _this = this;
	chart = null;
	render_vis = function(csv) {
		chart = new BubbleChart(csv);
		chart.start();
		return root.display_all();
	};
	root.display_all = function() {
		return chart.display_group_all();
	};
	root.display_year = function() {
		return chart.display_by_year();
	};
	root.toggle_view = function(view_type) {
		if (view_type === 'year') {
			return root.display_year();
		} else {
			return root.display_all();
		}
	};
	return d3.csv("data/budget.csv", render_vis);
}); 