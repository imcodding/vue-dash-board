import * as d3 from 'd3';

d3.contextMenu = function (menu, openCallback, objTopo) {
	// create the div element that will hold the context menu


	d3.selectAll('.d3-context-menu').data([1])
		.enter()
		.append('div')
		.attr('class', 'd3-context-menu')
		.on('mouseleave', function(d, i) {
			// d3.select('.d3-context-menu').style('display', 'none');
		});

	// close menu
	d3.select('body').on('click.d3-context-menu', function() {
		// d3.select('.d3-context-menu').style('display', 'none');
	});

	// this gets executed when a contextmenu event occurs
	return function(data, index) {

		var elm = this;

		if(data === undefined) {
			var _node = d3.select(d3.event.target).node();
			var _arr = ['rect', 'ellipse', 'text','tspan'];
			if(_arr.indexOf(_node.nodeName) !== -1) {
				data = d3.select(d3.event.target).data()[0];
			}
		}
		if (menu.call(objTopo, data)) {
			d3.selectAll('.d3-context-menu').html('');
			var list = d3.selectAll('.d3-context-menu').append('ul');
			list.selectAll('li').data(menu.call(objTopo, data)).enter()
				.append('li')
				.attr('class', function (d) {
					return d.local_burette;
				})
				.html(function(d) {
					let _html = document.createElement('div')
					let _img = document.createElement('img')
					
					switch (d.title){

						default:
							_img.src = 'static/img/d3/menu/d3_bullet.png';
							_img.style = 'float: left;padding:7px 3px'
							_html.append(_img)
							break;
					}

					let _span = document.createElement('span');
					_span.innerHTML = d.title
					_span.style = 'float: left;'
					_html.append(_span);
					
					if (d.hotKey) {
						let _span = document.createElement('span');
						_span.innerText = d.hotKey;
						_span.style = 'float:right;padding-right:7px;color:#b8bfc5;font-size:11px;font-family:맑은 고딕, dotum, Trebuchet MS, Verdana, Helvetica,tSans-Serif;'
						_html.append(_span);
					}
					if(d.childrenItems !== undefined && d.childrenItems != null && d.childrenItems.length > 0) {
						let _img = document.createElement('img');
						_img.src = '/img/d3/menu/d3_arrow.png';
						_img.style = 'float: right;padding-top: 11px;padding-right:8px;'
						_html.append(_img);
					}

					if(d.title == 'URL호출') {
						let _img = document.createElement('img');
						_img.src = '/img/d3/menu/d3_arrow.png';
						_img.style = 'float: right;padding-top: 11px;padding-right:8px;'
						_html.append(_img);
					}

					return _html.innerHTML
				})
				.on('click', function(d, i) {
					if(d.childrenItems !== undefined && d.childrenItems != null && d.childrenItems.length > 0) return;
					/* 맵 객체 위치이동 체크(저장여부) */
					// objTopo.checkAlignEdit(d.action.name);
					d.action(elm, data, index, objTopo);
					d3.select('.d3-context-menu').style('display', 'none');
				})
				.on('mouseover', function(d, i) {
					console.log("mouseover");
					try {
						d3.select(this.parentNode).select("ul").remove();
					} catch(e) {}
					try {
						var browserSize = {
							width: window.innerWidth || document.body.clientWidth,
							height: window.innerHeight || document.body.clientHeight
						};
						var menuSize = {
							width: document.getElementsByClassName('.d3-context-menu').width + 10,
							height: document.getElementsByClassName('.d3-context-menu').height + 10
						};

						var _left = this.offsetParent.offsetLeft + (this.clientWidth) + menuSize.width  > browserSize.width? -153 : 153;

						var menuType = d.hasOwnProperty("children_burette") ? 'menu_' + d.children_burette : 'menu_selected';

						d3.select(this).append("ul").classed(menuType, true)
							.style("left", function(d) {
								if((_left + menuSize.width) > browserSize.width) {
									return -151 + 'px';
								}
								else {
									return _left + "px"
								}
							})
							.style("top", function(d) {
								var _height = d.childrenItems.length * 30;
								var _idx = Math.ceil((event.clientY - _top) / 30);
								if((event.clientY + _height) >= browserSize.height) {
									return (menuSize.height - _height - 10) + 'px';
								}
								else {
									return 'auto';
								}
							})
							.style("font-size", "12px")
							.selectAll("li")
							.data(d.childrenItems)
							.enter().append("li")
							.html(function (d) {
								var _html = $('<div></div>');
								if (d.icon !== undefined) {
									_html.append($('<img />').attr({src: '../img/ctxmenu/' + d.icon + '.png'}).css('float', 'left'));
								}
								_html.append($('<span></span>').html(d.title).css('float', 'left'));
								if (d.hotKey) _html.append($('<span></span>').html(d.hotKey)
									.css('float', 'right')
									.css('padding-right', '7px')
									.css('color', '#b8bfc5')
								);
								return _html.html();
							})
							.on("click", function (d, i) {
								d3.select('.d3-context-menu').style('display', 'none');
								/** 관리모드 전환시 토폴로지 편집권한이 없으면 알림메시지 표시 */
								if(TopoConst.envSetting.topoEditYn == 'N' && d.title == "관리모드") {
									alert("토폴로지 편집 권한이 없습니다.");
									return false;
								}

								if (D3Topology.getIsShareGroupRoot()) {
									alert("최상위 그룹에서는 조회모드만 사용가능합니다.");
									return false;
								}
								/* 맵 객체 위치이동 체크(저장여부) */
								objTopo.checkAlignEdit(d.action.name);
								d.action(elm, data, index, objTopo);
								// d3.select('.d3-context-menu').style('display', 'none');
							})
							.on('mouseover', function (d, i) {
								d3.event.stopPropagation();
							});
					} catch(e) {}
				})
				.on("mouseout", function(d, i) {
					try {
						// d3.select(this.parentNode).select("ul:not(.menu_selected)").remove();
					} catch(e) {

					}
//				if(d.hasOwnProperty("childrenItems") && d.childrenItems != null && d.childrenItems.length > 0) return;
				});

			// the openCallback allows an action to fire before the menu is displayed
			// an example usage would be closing a tooltip
			if (openCallback) openCallback(data, index);


			var browserSize = {
				width: window.innerWidth || document.body.clientWidth,
				height: window.innerHeight || document.body.clientHeight
			};

			var menuSize = {
				width: document.getElementsByClassName('.d3-context-menu').width + 10,
				height: document.getElementsByClassName('.d3-context-menu').height + 10
			};

			var _left = d3.event.clientX + menuSize.width > browserSize.width? browserSize.width - menuSize.width : d3.event.clientX,
				_top = d3.event.clientY + menuSize.height > browserSize.height? browserSize.height - menuSize.height : d3.event.clientY;

			// display context menu
			d3.select('.d3-context-menu')
				.style('left', _left + 'px')
				.style('top', _top + 'px')
				.style('display', 'block');

			if (menu.call(objTopo, data)[0].action === 'none' ) d3.select('.d3-context-menu').style('display', function (d) {
				return menu.call(objTopo, data)[0].action === 'none' ? 'none' : 'block';
			});

			d3.event.preventDefault();
			d3.event.stopPropagation();
		}

	};
};

export default d3;
