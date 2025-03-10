import TopoUtil from '../d3map/topo.util'
import TopoConst from '../d3map/hm.topo.resource'
// import d3 from './d3-context-menu';
import * as d3 from 'd3';
import lodash from 'lodash'

var nodes = [];
var point = null, node = null, removeNode = null, gisNode = null;
var scale, cx, cy;
var appVer = null, isIE = null, agent = null;
var circle = null, rect= null, findRect = null;
var defImg = null, defImgData = null, canvas = null;
var enterNode = null, eItemNo = null, targetItemNo = [];
var startX = 0, startY = 0;
var rowCnt = 0, colCnt = 0;
var arrPoint = [];
var objTemp = {};
var retValue = null;
var _left = 0, _top = 0;
var wGap = null, hGap = null, row=0, col=0;
var grpImg = null, healthImg = null, haImg = null, osImg = null, osImgUrl;
var haStatus = null;
var currItemObj = [], oldItemObj = [];
var valueTop = 0, valueLeft = 0;
var labelColor = '#000000';
var browserSize = {}, calcX = 0, calcY = 0;
var divTooltip = null, tHtml = null;
var tooltipSize
var TopoItem = {

		 /**
		  * Node 데이터 추가 (key: id)
		  */
		setNodeData: function(list, objTopo) {
			objTopo.vars.isChangeTopo = false;
			if (objTopo.vars.isChgGrp) oldItemObj = [];
			if(list == null || list.length == 0) {
				objTopo.vars.isChangeTopo = true;
				return list;
			}

			var nodes = [];
			var currItemObj = [];

			list.forEach(function(d) {

				var point = objTopo.convertMapLocation([d.xpoint, d.ypoint]);
	            d.xpoint = point[0];
	            d.ypoint = point[1];
	            var scale, cx, cy;
                // center position
	            if(d.devKind1 == "POINT") {
	            	d.itemSize = 1.5;
	            	scale = TopoUtil.getItemScale(d.itemSize);
                    cx = d.xpoint + (55 * scale / 2);
                    cy = d.ypoint + (55 * scale / 2);
                }
                else {
                    scale = TopoUtil.getItemScale(d.itemSize),
                    cx = d.xpoint + ((55 - (55 * scale)) / 2) + (55 * scale / 2),
                    cy = d.ypoint + (55 * scale / 2);
                }

              // Item 능 설정 정보
              if (d.devPerf) d.devPerf = JSON.parse(d.devPerf);
              // Item 기타 설정 정보
              if (d.itemConf) d.itemConf = JSON.parse(d.itemConf);

							var node = {...d, id: "g"+d.itemNo, x: d.xpoint, y: d.ypoint, cx: cx, cy: cy, xgap: cx-d.xpoint, ygap: cy-d.ypoint};
	            nodes.push(node);

							currItemObj = _.cloneDeep(nodes);
			});
			if ( JSON.stringify(currItemObj) === JSON.stringify(oldItemObj) )
					objTopo.vars.isChangeTopo = false;
			else
					objTopo.vars.isChangeTopo = true;

			oldItemObj = _.cloneDeep(currItemObj);

			return nodes;
		},

		setCenterLoc: function(d) {
            if(d == null) return;
            var scale, cx, cy;
			// center position
			if(d.devKind1 == "POINT") {
				scale = TopoUtil.getItemScale(1.5);
				d.cx = d.x + (55 * scale / 2);
				d.cy = d.y + (55 * scale / 2);
			}
			else {
				scale = TopoUtil.getItemScale(d.itemSize);
				d.cx = d.x + ((55 - (55 * scale)) / 2) + (55 * scale / 2),
				d.cy = d.y + (55 * scale / 2);
			}
		},

		/** 데이터 갱신 */
		callRefresh: function(objTopo) {
			var node_call = objTopo.createDrags(objTopo, objTopo.dragstart, objTopo.dragmove, objTopo.dragend);
			var getBBox = objTopo.createBBox;
			this.refresh(objTopo, objTopo.vars.svg, objTopo.vars.nodes, node_call, getBBox);
		},

		refresh: function(objTopo, svg, nodes, node_call, getBBox) {
			var removeNode = svg.select(".svgGroup").selectAll("g.node");
			//TopoItem.removeEvent(removeNode);
			TopoItem.removeEvent(objTopo, removeNode);
//			removeNode.remove();

			var node = svg.select(".svgGroup").selectAll("g.node").data(nodes);
			node.exit().remove();

			/** node g */
			node = node.enter()
							.append("g")
							.merge(node)
							.attr("id", function (d) { return d.id; })
							.attr("class", function(d) {
								if(d.devKind1 == "POINT") return "node point";
								else return "node";
							})
							.attr("cursor", "pointer")
							.attr("width", 55)
							.attr("height", 55)
							.style("display", "block");

			/** event anmiation circle */
			var grpImg = node.selectAppend("g", "grpImg");

			grpImg
				.attr("x", 0)
	            .attr("y", 0)
				.attr("width", 55)
				.attr("height", 55)
				.attr("class", "grpImg")
				.attr("transform", function(d) {
	            	var scale = TopoUtil.getItemScale(d.itemSize);
                    return "scale(" + [scale, scale].join(",") + ")";
	            });

			grpImg//.filter(function(d) { return d.evtLevel != 1; })
				.selectAppend("circle")
	            .attr("cx", function (d) {
                    return 55 / 2;
	            })
	            .attr("cy",function (d) {
	                return 55 / 2;
	            })
	            .attr("r",function (d) {
	                return 70 / 2;
	            })
	            .style("fill",function (d) {
	            	if(d.devKind1 == "POINT" || d.evtLevel == 0 || d.evtLevel == 1) return "none";

	            	return "url(#radial-gradient" + d.evtLevel + ")";
	            });

			/** node 선택 영역 추가 */
			grpImg.selectAppend("rect", "state")
	            .attr("x", 0)
	            .attr("y", 0)
	            .attr("width", function (d) {
//	                return d.itemSize * 10;
	            	return 55;
	            })
	            .attr("height", function (d) {
//	                return d.itemSize * 10;
	            	return 55;
	            })
	            .style("fill", "transparent")
	            .attr("class", "state");

	        /** 아이콘 이미지 추가 */
			grpImg.selectAppend("image")
				.attr("id", function(d) { return "image-" + d.itemNo; })
				.attr("crossorigin", "anonymous")
	            .attr("width", function (d) {
//	                return d.itemSize * 10;
	            	return 55;
	            })
	            .attr("height", function (d) {
//	                return d.itemSize * 10;
	            	return 55;
	            });

			// 아이템 이미지 설정
            var agent = navigator.userAgent.toLowerCase(),
                appVer = navigator.appVersion.toLowerCase(),
                isIE = agent.indexOf("msie") !== -1 || appVer.indexOf("trident/") > 0;
            if(isIE) TopoItem.setImageUrl_ie(grpImg, nodes);
            else TopoItem.setImageUrl(grpImg, nodes);

	        /** 명칭 text 추가 */
			var text = node.selectAppend("text")
	            .attr("dx", function (d) {
	            	var scale = TopoUtil.getItemScale(d.itemSize);
	                return (55/2) * scale;
	            })
	            .attr("dy", function (d) {
                    var scale = TopoUtil.getItemScale(d.itemSize);
	                return 20 + (55 * scale);
	            })
	            .attr("class", "nodetext")
	            .attr("text-anchor", "middle")
				// .attr("fill", TopoConst.envSetting.fontColor)
				//.attr("fill", 'white')
              .attr("fill", function (d) {
                labelColor = TopoConst.envSetting.fontColor || '#000000';
                if (d.itemConf) {
                  if (d.itemConf.hasOwnProperty("labelColor")) labelColor = d.itemConf.labelColor;
                }
                return labelColor;
              })
	            .attr("pointer-events", "none")
	            .text(function (d) {
	                return d.itemName;
	            })
	            .style("font-size",function (d) {
	                return d.fontSize === 0 ? TopoConst.envSetting.fontSize + "px" : d.fontSize + "px";
	            })
                .style("visibility", function(d) {
                	return TopoConst.envSetting.showLabel==1 && d.showLabel==1? "visible" : "hidden"
                })
	            .call(getBBox);
	            // .call(wrap, 60);

	        /** text뒤에 배경rect 추가 */
          node.selectInsert("rect", "text_bg")
              .attr("labelPosition", function (d) {
                  /* label(명칭) 위치 정렬 */
                  objTemp = {};
                  // d.itemConf.labelPosition = 'C'; // L:좌측, T:상단, R:우측, B:하단, C:중앙
                  objTemp.nodeText = objTopo.vars.svg.select(".svgGroup").selectAll(".nodetext").filter(function (n) {
                      return n.id == d.id;
                  });

                  objTemp.bboxWidth = objTemp.nodeText.data()[0].bbox.width;
                  objTemp.bboxHeigth = objTemp.nodeText.data()[0].bbox.height;
                  objTemp.centerCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize);
                  objTemp.itemScale = TopoUtil.getItemScale(d.itemSize) < 1 ? 1 : TopoUtil.getItemScale(d.itemSize);
                  if (d.itemConf && d.itemConf.labelPosition === 'T') {
                      // 상단
                      objTemp.nodeText.attr("dx", objTemp.centerCalc);
                      objTemp.nodeText.attr("dy", (-1 * objTemp.bboxHeigth / 2));
                  }
                  else if ( !d.itemConf || (d.itemConf && d.itemConf.labelPosition === 'B')) {
                      // 하단 (d.itemConf 값이 없을 경우에 기본 하단에 위치함)
                      objTemp.nodeText.attr("dx", objTemp.centerCalc);
                      objTemp.nodeText.attr("dy", (55 * TopoUtil.getItemScale(d.itemSize)) + 20);
                  }
                  else if (d.itemConf && d.itemConf.labelPosition === 'L') {
                      // 좌측
                      objTemp.nodeText.attr("dx", (-1) * (objTemp.bboxWidth / 2) - 10 );
                      // objTemp.nodeText.attr("dx", (-1) * objTemp.bboxWidth + 15 );
                      objTemp.nodeText.attr("dy", objTemp.centerCalc + 5);
                  }
                  else if (d.itemConf && d.itemConf.labelPosition === 'R') {
                      // 우측
                      //objTemp.nodeText.attr("dx", objTemp.centerCalc + ((objTemp.bboxWidth / 2) * objTemp.itemScale + 26));
                      // objTemp.nodeText.attr("dx", (55 * TopoUtil.getItemScale(d.itemSize) + 26));
                      objTemp.nodeText.attr("dx", (objTemp.bboxWidth / 2) + (55 * TopoUtil.getItemScale(d.itemSize)) + 10);
                      objTemp.nodeText.attr("dy", objTemp.centerCalc + 5);
                  }
                  else {
                      // 중앙
                      objTemp.nodeText.attr("dx", objTemp.centerCalc);
                      objTemp.nodeText.attr("dy", objTemp.centerCalc + 5);
                  }
              })
              .attr("x", function (d) {
                  objTemp = {};
                  objTemp.centerCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize);
                  objTemp.itemScale = TopoUtil.getItemScale(d.itemSize) ;
                  if (!d.itemConf ||
                      (d.itemConf && d.itemConf.labelPosition === 'T') ||
                      (d.itemConf && d.itemConf.labelPosition === 'B') ||
                      (d.itemConf && d.itemConf.labelPosition === 'C') ) {
                      // 상단, 하단 (d.itemConf 값이 없을 경우에 기본 하단에 위치함), 중앙
                      objTemp.xRetVal = objTemp.centerCalc - (d.bbox.width / 2) - 5;
                  }
                  else if (d.itemConf && d.itemConf.labelPosition === 'L') {
                      // 좌측
                      objTemp.xRetVal = (-1) * d.bbox.width - 15;
                  }
                  else if (d.itemConf && d.itemConf.labelPosition === 'R') {
                      // 우측
                      objTemp.xRetVal = (55 * TopoUtil.getItemScale(d.itemSize) + 8 );
                  }

                  return objTemp.xRetVal;
              })
              .attr("y", function (d) {

                  objTemp = {};
                  objTemp.centerCalc = (55 / 2) * TopoUtil.getItemScale(d.itemSize);
                  objTemp.itemScale = TopoUtil.getItemScale(d.itemSize) ;
                  if (d.itemConf && d.itemConf.labelPosition === 'T') {
                      // 상단 (d.itemConf 값이 없을 경우에 기본 하단에 위치함)
                      objTemp.yRetVal = (-1 * d.bbox.height) - 5;
                  }
                  else if (!d.itemConf || (d.itemConf && d.itemConf.labelPosition === 'B')) {
                      // 하단 (d.itemConf 값이 없을 경우에 기본 하단에 위치함)
                      objTemp.yRetVal = d.bbox.y;
                  }
                  else if ((d.itemConf && d.itemConf.labelPosition === 'L') ||
                      (d.itemConf && d.itemConf.labelPosition === 'R') ||
                      (d.itemConf && d.itemConf.labelPosition === 'C')) {
                      // 좌측, 우측, 중앙
                      objTemp.yRetVal = (55 / 2) * TopoUtil.getItemScale(d.itemSize) - (d.bbox.height / 2);
                  }

                  return objTemp.yRetVal;
              })
              .attr("width", function (d) {
                  // debugger
                  return d.bbox.width + 10;
              })
              .attr("height", function (d) {
                  return d.bbox.height;
              })
              .attr("class", "text_bg")
              .style("fill", TopoConst.envSetting.fontBgColor)
              .style('opacity', TopoConst.envSetting.fontBgOpacity)
              // .style("opacity", 0.3)
              // .style("stroke", TopoConst.envSetting.fontBgColor)
              // .style('stroke-opacity', 0.9)
              // .style("fill", "RGBA(0,188,212,0.3)")
              .style("visibility", function (d) {
                  return TopoConst.envSetting.showLabel == 1 && d.showLabel == 1 ? "visible" : "hidden";
              });

			// GIS
            gisNode = node.filter(function (d) {
                return d.temp1 == 'GIS';
            });
            node.selectAll('image.imgGrpViewType').remove();
            if (gisNode.size() > 0) {
                gisNode.each(function (d) {
                    d3.select(this)
                        .selectAppend('image', 'imgGrpViewType')
                        .classed('imgGrpViewType', true)
                        .attr('xlink:href', '/static/img/d3/icon_gis_3d.svg')
                        .attr('width', 30).attr('height', 30)
                        .attr('x', 10).attr('y', -28);
                });
            }

			TopoItem.addEvent(node, objTopo);

			// mapMode에 따른 포인트아이템 visible/hidden
            svg.selectAll(".svgGroup").selectAll("g.node.point").style("display", objTopo.vars.mapMode == TopoConst.mapMode.SEARCH? "none" : "block");

	        return node;
		},

		/** 이벤트 등록 */
		addEvent: function(node, objTopo) {
			node.on("dblclick", function (d) {
                // if (D3Topology.vars.mapMode == TopoConst.mapMode.SEARCH && d.devKind1 == "GRP") {
				if(d.devKind1 == 'GRP') {
                  TopoItem.hideTooltip();
									objTopo.vars.curGrpNo = d.mngNo;
									objTopo.chgGrp.call(objTopo);
						}
				})

				.on("contextmenu", d3.contextMenu(objTopo.clickMenu, null, objTopo))
				.on("mouseenter", function (d) { TopoItem.showTooltip(d, objTopo); })
        .on("mousemove", function (d) { TopoItem.moveTooltip(d, objTopo); })
				.on("mouseleave", TopoItem.hideTooltip)
		},

		/** 이벤트 해제 */
		removeEvent: function(objTopo, node) {
			var circle = objTopo.vars.svg.selectAll("g.node > g.grpImg").selectAll("circle");
			circle.interrupt();

			node.on("contextmenu", null)
				.on("click", null)
				.on("dblclick", null)
				.on("mouseover", null)
				.on("mouseout", null);
		},

  /** 툴팁 show */
  showTooltip: function (d, objTopo) {

      var _devKind1 = d && d.hasOwnProperty("devKind1") && d.devKind1 ? d.devKind1.toUpperCase() : null;
      var _devKind2 = d && d.hasOwnProperty("devKind2") && d.devKind2 ? d.devKind2.toUpperCase() : null;
      if (_devKind1 == null || _devKind1 == "POINT") return;

      tHtml = "<table class='tt-table'>";
      tHtml += "<thead>";

      if (_devKind1 != "LINK") { //회선이 아닌경우 (그룹, 장비, 랙 등등)
          if (_devKind1 == "GRP" && d.uniqId > 0) {
              tHtml += "<tr><th colspan='2'>" + "상속그룹 :" +  (d.itemAlias || d.itemName) + "</th></tr>";
          }
          else {
              tHtml += "<tr><th colspan='2'>" + (d.itemAlias || d.itemName) + "</th></tr>";
          }

          tHtml += "</thead>";
          tHtml += "<tbody>";

          if (_devKind1 != "GRP" && _devKind1 != "RACK") {
              if (_devKind1 != "ETC") {
                  tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "IP :" + "</th>";
                  tHtml += "<td class='tt-td'>" + d.devIp + "</td></tr>";
              }
              else {
                  var tmp = d.devIp ? d.devIp : '-';
                  tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "IP(URL) :" + "</th>";
                  tHtml += "<td class='tt-td'>" + tmp + "</td></tr>";
              }

              if (_devKind1 == "SENSOR") {
                  tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "설치위치 :" + "</th>";
                  tHtml += "<td class='tt-td'>" + (d.temp3 || '-') + "</td></tr>";
              }
          }else if (_devKind1 == "ETC"){
              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "MAC :" + "</th>";
              tHtml += "<td class='tt-td'>" + (d.devIp || '-') + "</td></tr>";
          }
          else if (_devKind1 == "RACK") {
              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "유닛수 :" + "</th>";
              tHtml += "<td class='tt-td'>" + (d.devIp || '-') + "</td></tr>";
          }
          if (_devKind1 != "ETC") {
              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "종류 :" + "</th>";
              tHtml += "<td class='tt-td'>" + (d.devKind2 || '-') + "</td></tr>";
              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "상태 :" + "</th>";
              tHtml += "<td class='tt-td'>" + (TopoUtil.convertEvtLevel(d.evtLevel) || '-') + "</td></tr>";
          }

          // console.dir(d);

          // 장비 및 AP 위치
          if ((_devKind2 == "L2SWITCH" && d.location != '') || (_devKind2 == "AP" && d.location != '')) {
              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "위치 :" + "</th>";
              tHtml += "<td class='tt-td'>" + (d.location || '-') + "</td></tr>";
          }

          // HA 상태
          if (d.haStatus && d.haStatus > -1) {
              haStatus = null;
              if (d.haStatus == 1)  haStatus = 'Active';
              else haStatus = 'Standby';

              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "HA" + "</th>";
              tHtml += "<td class='tt-td'>" + (haStatus || '-')  + "</td></tr>";
          }

          var _userContent = d.hasOwnProperty("userContent") ? d.userContent : null;
          if (_userContent != null) {
              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "메모" + "</th>";
              tHtml += "<td class='tt-td'>" + ((_userContent.replace(/\n/gi, "<br>")) || '-') + "</td></tr>";
          }
          var _dynInfo = d.hasOwnProperty('dynInfo') ? d.dynInfo : null;
          if (_dynInfo != null) {
              tHtml += "<tr class='tt-tr'><td class='tt-td' colspan='2'>" + ((_dynInfo.replace(/\n/, '').replace(/\n/g, '<br>')) || '-') + "</td></tr>";
          }
          if(_devKind1 === "DEV" && d.devPerf) {
              // 일반장비 이며 성능 정보가 있는 경우
              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "CPU :" + "</th>";
              tHtml += "<td class='tt-td'><div class='animated-progress'><div class='progress-bg cpu'></div><span data-progress='" + d.devPerf.CPU + "'></span></div></td></tr>";
              tHtml += "<tr class='tt-tr'><th class='tt-th'>" + "Memory :" + "</th>";
              tHtml += "<td class='tt-td'><div class='animated-progress'><div class='progress-bg mem'></div><span data-progress='" + d.devPerf.MEM + "'></span></div></td></tr>";

          } else if (_devKind1 === "AP_CONTROLLER" && d.devPerf) {
              // AP Controller 이며 성능 정보가 있는 경우
          }
          tHtml += "</tbody>";
          tHtml += "</table>";
          show(objTopo);
        }

        function show(objTopo) {
            // console.log(d3.event);
            browserSize = {
                width: window.innerWidth || document.body.clientWidth,
                height: window.innerHeight || document.body.clientHeight
            };

            tooltipSize = {width: 0, height: 0};
            // debugger

            divTooltip =  d3.select('div#section').select('div.topoTooltip');
            divTooltip.html(tHtml);
            TopoItem.translateTooltip(objTopo);
            $(".animated-progress").each(function (i, d) {
                // debugger
                $(this).children("div").animate({
                        width: $(this).children("span").attr("data-progress") + "%",
                    },
                    500
                );
                $(this).children("span").text($(this).children("span").attr("data-progress") + "%");
            });
        }
	    },
    /** 툴팁 move */
    moveTooltip: function (d, objTopo) {
        TopoItem.translateTooltip(objTopo);
    },
    /** 툴팁 styleTrans */
    translateTooltip: function (objTopo) {

        divTooltip.transition().duration(100).style("opacity", 0.9);

        if (objTopo.viewType === 'default') {
            calcX = d3.event.offsetX;
            calcY = d3.event.offsetY;
            valueTop = 10, valueLeft = 10;
        } else {
            calcX = d3.event.clientX;
            calcY = d3.event.clientY;
            valueTop = -30, valueLeft = -30;
        }

        divTooltip.style("left", function(d) {
            tooltipSize.width = $('.topoTooltip').width() + 30;
            _left = calcX + tooltipSize.width + 60 >= browserSize.width ? calcX - (tooltipSize.width ) : calcX;
            return _left + valueLeft + "px";
        }).style("top", function (d){
            tooltipSize.height = $('.topoTooltip').height() + 40;
            _top = calcY + tooltipSize.height >= browserSize.height ? calcY - tooltipSize.height - 30 : calcY;
            return _top + valueTop  + "px";
        });

    },
	    /** 툴팁 hide */
	    hideTooltip: function () {
        var div = d3.select('div#section').select('div.topoTooltip');
        div.transition().duration(100).style("opacity", 0);
	    },

		/** 장애등급 버블 애니메이션 */
		animation: function(objTopo) {
			var _duration = 500;
			var circle = objTopo.vars.svg.selectAll("g.node > g.grpImg").selectAll("circle").filter(function(d) { return d.evtLevel != 1;});
			circle.on("end", null);
			circle
				.transition().duration(_duration).attr("r", function (d) {
				return 70 / 2 + 4;
			})
				.transition().duration(_duration).attr("r", function (d) {
				return 70 / 2;
			})
				.transition().duration(100)
				.on("end", function repeat() {
					d3.active(this)
						.transition().duration(_duration).attr("r", function (d) {
						return 70 / 2 + 4;
					})
						.transition().duration(_duration).attr("r", function (d) {
						return 70 / 2;
					})
						.transition().duration(100)
						.on("end", repeat);
				});
		},


	/** 아이템 이미지 설정
		 * chrome에서 이미지가 url로 설정하면 export시 로드하지 못함. 그래서 base64로 설정함.
		 * */
	    setImageUrl: function(grpImg, nodes) {
	    	var defImg = new Image(), defImgData;
				defImg.onload = function() {
						var canvas = document.createElement("canvas");
						canvas.width = defImg.width, canvas.height = defImg.height;
						canvas.getContext("2d").drawImage(defImg, 0, 0);
						defImgData = canvas.toDataURL("image/png");
				};
				defImg.src = '/static/img/d3/micons/NoImage.PNG';
        // defImg.src = "/static/img/NoImage.PNG";
	    	nodes.forEach(function(d, idx) {
	    		// usrKind값이 존재하면 우선적용
					if(d.usrKind != null && d.usrKind.length > 0) {
		    		var img = new Image();
						img.crossOrigin = "anonymous";
		    		img.onload = function() {
							var canvas = document.createElement("canvas");
							canvas.width = img.width, canvas.height = img.height;
							canvas.getContext("2d").drawImage(img, 0, 0);
							grpImg.select("#image-" + d.itemNo).attr("xlink:href", canvas.toDataURL("image/png"));
		    			// grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
			    	};
			    	img.onerror = function() { //usrKind이미지를 로드하지 못한 경우 devKind2이미지 적용
								var img2 = new Image();
								img2.crossOrigin = "anonymous";
								img2.onload = function() {
								var canvas = document.createElement("canvas");
								canvas.width = img2.width, canvas.height = img2.height;
								canvas.getContext("2d").drawImage(img2, 0, 0);
								grpImg.select("#image-" + d.itemNo).attr("xlink:href", canvas.toDataURL("image/png"));
								// grpImg.select("#image-" + d.itemNo).attr("xlink:href", img2.src);
							};
							img2.onerror = function() { //기본이미지 적용
								grpImg.select("#image-" + d.itemNo).attr("xlink:href", defImgData);
														// grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/static/img/d3/micons/GROUP_A1.PNG");
							};
							img2.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
			    	};
            var path = process.env.NODE_ENV === 'development' ? 'static/img' : 'image';
            img.src = "/{0}/d3/micons/{1}.PNG".substitute(path, d.usrKind);

		    	}
				// devKind2에 따른 이미지 적용
		    	else {
		    		var img = new Image();
						img.crossOrigin = "anonymous";
		    		img.onload = function() {
							var canvas = document.createElement("canvas");
							canvas.width = img.width, canvas.height = img.height;
							canvas.getContext("2d").drawImage(img, 0, 0);
							grpImg.select("#image-" + d.itemNo).attr("xlink:href", canvas.toDataURL("image/png"));
		    			// grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
		    		};
		    		img.onerror = function() {
							grpImg.select("#image-" + d.itemNo).attr("xlink:href", defImgData);
		    			// grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/assets/images/d3/micons/NoImage.PNG");
		    		};
		    		img.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
		    	}
			});
	    },

		setImageUrl_ie: function(grpImg, nodes) {
			var defImg = '/static/img/d3/micons//NoImage.PNG';

			nodes.forEach(function(d, idx) {
				// usrKind값이 존재하면 우선적용
				if(d.usrKind != null && d.usrKind.length > 0) {
					var img = new Image();
					img.crossOrigin = "anonymous";
					img.onload = function() {
						grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
					};
					img.onerror = function() { //usrKind이미지를 로드하지 못한 경우 devKind2이미지 적용
						var img2 = new Image();
						img2.crossOrigin = "anonymous";
						img2.onload = function() {
							grpImg.select("#image-" + d.itemNo).attr("xlink:href", img2.src);
						};
						img2.onerror = function() { //기본이미지 적용
							grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/static/img/d3/micons/NoImage.PNG");
						};
						img2.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
					};
					img.src = "/static/img/{0}.PNG".substitute(d.usrKind);
				}
				// devKind2에 따른 이미지 적용
				else {
					var img = new Image();
					img.crossOrigin = "anonymous";
					img.onload = function() {
						grpImg.select("#image-" + d.itemNo).attr("xlink:href", img.src);
					};
					img.onerror = function() {
						grpImg.select("#image-" + d.itemNo).attr("xlink:href", "/static/img/d3/micons/NoImage.PNG");
					};
					img.src = TopoItem.getImageUrlByDevKind2(d.devKind2);
				}
			});
		},

	    /**
	     * devKind2 이미지 url 리턴
	     */
	    getImageUrlByDevKind2: function(devKind2) {
	    	var fileName = null;
        var path = process.env.NODE_ENV === 'developmemt' ? 'static/img' : 'image';

    		switch(devKind2) {
            // case "BACKBONE": case "FIREWALL": case "IPS":
			// case "SWITCH": case "L3SWITCH": case "L4SWITCH":
            // case "NAC": case "QOS": case "VPN":
			// case "CLOUD": case "ROUTER":
    			// fileName = devKind2 + "_B1";
    			// break;
			default:
				fileName = devKind2;
				break;
    		}
	    	//return "/assets/images/d3/micons/{0}.PNG".substitute(fileName);
        return "/{0}/d3/micons/{1}.PNG".substitute(path, fileName);
	    }

};

// word wrap test
function wrap(text, width) {
    text.each(function() {
        var text = d3.select(this),
			words = text.text().length > 15? [text.text().substring(0, 15), text.text().substring(16)].reverse() : [text.text()],
            // words = text.text().split(/\_/).reverse(),
            word,
            line = [],
            lineNumber = 0,
            lineHeight = 20, // ems
            y = text.attr("y") || 0,
            dx = parseFloat(text.attr("dx")),
            dy = parseFloat(text.attr("dy")),
			tspan = text.text(null).append("tspan").attr("dx", 0).attr("y", y).attr("dy", dy)
				 .attr("text-anchor", "middle");
        while (word = words.pop()) {
			var _dy = lineNumber++ * lineHeight + dy + (lineNumber * (text.data()[0].fontSize - 2));
			tspan = text.append("tspan").attr("x", 0).attr("dx", dx).attr("y", y).attr("dy", (_dy))
				.attr("text-anchor", "middle").text(word);
        }
    });
}

export default TopoItem
