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

		this.create_nodes = __bind(this.create_nodes, this);

		var max_amount;
		this.data = data;
		this.width = 1000;
		this.height = 750;
		this.tooltip = CustomTooltip("gates_tooltip", 240);
		this.center = {
			x : this.width / 2,
			y : this.height / 2
		};
		this.year_centers = {
			"Office Supplies" : {
				x : this.width / 6,
				y : this.height / 5 
			},
			"Travel" : {
				x : 2 * this.width / 6,
				y : this.height / 5
			},
			"Marketing" : {
				x : 3 * this.width / 6,
				y : this.height / 5
			},
			"Meetings" : {
				x : 4* this.width / 6,
				y : this.height / 5
			},
			"Student Court" : {
				x : 5 * this.width /6 ,
				y : this.height / 5
			},
			"Programming" : {
				x : this.width / 6,
				y : 2 * this.height / 5
			},
			"Technology" : {
				x : 2 * this.width / 6,
				y : 2 * this.height / 5
			},
			"Co-Sponsorship" : {
				x : 3 * this.width / 6,
				y : 2 * this.height / 5
			},
			"Athletics" : {
				x : 4 * this.width / 6,
				y : 2 * this.height / 5
			},
			"Education" : {
				x : 5 * this.width / 6,
				y : 2 * this.height / 5
			},
			"Government" : {
				x : this.width / 6,
				y : 3 * this.height / 5
			},
			"Uptown" : {
				x : 2 * this.width / 6,
				y : 3 * this.height / 5
			},
			"Sustainability" : {
				x : 3 * this.width / 6,
				y : 3 * this.height / 5
			},
			"OSGA" : {
				x : 4 * this.width / 6,
				y : 3 * this.height / 5
			},
			"Career Development" : {
				x : 5 * this.width / 6,
				y : 3 * this.height / 5
			},
			"Retreats" : {
				x : this.width / 6,
				y : 4 * this.height / 5
			},
			"Elections" : {
				x : 2 * this.width / 6,
				y : 4 * this.height / 5
			},
			"Inauguration" : {
				x : 3 * this.width / 6,
				y : 4 * this.height / 5
			},
			"Conferences" : {
				x : 4 * this.width / 6,
				y : 4 * this.height / 5
			},
			"FYLP" : {
				x : 5 * this.width /6,
				y : 4 * this.height / 5
			}		};
		this.layout_gravity = -0.01;
		this.damper = 0.1;
		this.vis = null;
		this.nodes = [];
		this.force = null;
		this.circles = null;

		this.fill_color = d3.scale.ordinal().domain(["Programming", "Co-Sponsorship", "Technology", "Meetings", "Marketing", "Office Supplies", "Travel", "Student Court", "Athletics", "Education", "Government", "Uptown", "Career Development", "Retreats", "Sustainability", "OSGA", "Elections", "Conferences", "Inauguration", "FYLP"]).range(["#2060ff", "#ff0000", "#20bfff", "#55ffff", "#2affff", "#ffff54", "#00cfff", "#ff4d00", "#ffbf00", "#209fff", "#fee090 ", "#d73027", "#4575b4", "#91bfdb", "#aaffff", "#7fffff", "#e0f3f8", "#ff7000", "#fff000", "#ff8a00", '#ff0000', '#00ff00']);
		1
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
				radius : _this.radius_scale(parseInt(d.total_amount)),
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

			"Office Supplies" : this.width / 6 - 55,
			"Travel" : 2 * this.width / 6 - 25 ,
			"Marketing" : 3 * this.width / 6 + 20,
			"Meetings"  : 4* this.width / 6 + 65,
			"Student Court"  : 5 * this.width /6 + 85 ,
			
			"Programming"  : this.width / 6,
			"Technology"  : 2 * this.width / 6,
			"Co-Sponsorship"  : 3 * this.width / 6,
			"Athletics"  : 4 * this.width / 6,
			"Education"  : 5 * this.width / 6,
			
			"Government"  : this.width / 6,
			"Uptown"  : 2 * this.width / 6,
			"Sustainability"  : 3 * this.width / 6,
			"OSGA"  : 4 * this.width / 6,
			"Career Development"  : 5 * this.width / 6,
			
			"Retreats" : this.width / 6,
			"Elections" : 2 * this.width / 6,
			"Inauguration" : 3 * this.width / 6,
			"Conferences" : 4 * this.width / 6,
			"FYLP" : 5 * this.width /6	

		};
		years_y = {

			"Office Supplies" : this.height / 6, 
			"Travel" : this.height / 6,
			"Marketing" : this.height / 6,
			"Meetings" : this.height / 6,
			"Student Court" : this.height / 6,

						"Programming" : 2 * this.height / 4,
			"Technology" : 2 * this.height / 4,
			"Co-Sponsorship" : 2 * this.height / 4,
			"Athletics" : 2 * this.height / 4,
			"Education" : 2 * this.height / 4,
			"Government" : 4.5 * this.height / 6,
			"Uptown" : 4.5 * this.height / 6,
			"Sustainability" : 4.5 * this.height / 6,
			"OSGA" : 4.5 * this.height / 6,
			"Career Development" :4.5 * this.height / 6,
			"Retreats" : 4 * this.height / 6,
			"Elections" : 4 * this.height / 6,
			"Inauguration" : 4 * this.height / 6,
			"Conferences" : 4 * this.height / 6,
			"FYLP": 4 * this.height /6
			
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

		content = "<span class=\"name\">Name:</span><span class=\"value\"> " + data.name + "</span><br/>";
		content += "<span class=\"name\">Amount:</span><span class=\"value\"> $" + (addCommas(data.value)) + "</span><br/>";
		content += "<span class=\"name\">Category:</span><span class=\"value\"> " + data.org + "</span>"  + "</span><br/>";
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