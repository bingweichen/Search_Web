import { Table, Button, Popover } from 'antd';
import React, { Component, PropTypes } from 'react';
import Global from "../Global";

import Node from "/Users/chen/project_run/test/json/file1.json";
import Edge from "/Users/chen/project_run/test/json/file2.json";

var abstract="ss";
const App1 = React.createClass({

  getInitialState() {
    return {
      nouse: "dddd",

      nodes: "",
      edges: "",

      text:"loading",
      abstract:"",
    };
  },
  componentDidMount() {

    console.log("nodexxxxxxxxxxxxx");
    console.log(Node);
    console.log("edgexxxxxxxxxxxxx");
    console.log(Edge);
    var node_id=[];
    var nodes=Node;
    nodes.map((e)=>{
      node_id.push(e.id)
    });
    var edges=[];
    Edge.map((ele)=>{
      edges.push({
        source: node_id.indexOf(ele.source),
        target: node_id.indexOf(ele.target),
      })
    })


    var width = 1500;
    var height = 500;
    var img_w = 77;
    var img_h = 90;
    var text_dx = -20;
    var text_dy = 20;

    var dataset = [];

    var abstract_str="abstract";
    nodes.map((e)=>{
      // console.log("date: "+e.date[0]);
      // console.log("datelen: "+typeof(e.date[0]));
      // console.log("datelen: "+e.date[0].toString().length);


      if(e.date[0].toString().length<8){

        var date_temp=e.date[0].toString().substring(0,4);
        for(var i=0;i<8-e.date[0].toString().length;i++){
          date_temp=date_temp+"0";
        }
        date_temp=date_temp+e.date[0].toString().substring(4,e.date[0].length);
        e.date[0]=date_temp;
      }

      e.date[0]=e.date[0].toString().substring(0,4);
      dataset.push(e.date[0]);
    });

    console.log("dataset");
    console.log(dataset);

    var svg = d3.select("h4")
      .append("svg")
      .attr("width",width)
      .attr("height",height);

    var linear = d3.scale.linear()
      .domain([d3.min(dataset), d3.max(dataset)])
      .range([0, 800]);


    var force = d3.layout.force()
      .nodes(nodes)		//指定节点数组
      .links(edges)		//指定连线数组
      .size([width,height])	//指定范围
      .linkDistance(150)	//指定连线长度
      .charge(-800);	//相互之间的作用力

    force.start();	//开始作用

    console.log(nodes);
    console.log(edges);

    var svg_texts = svg.selectAll(".linetext")
      .data(nodes)
      .enter()
      .append("text")
      // .style("fill", "black")
      .attr("dx", 20)
      .attr("dy", 8)
      .attr("class","linetext")
      .text(function(d){
        return d.title;
      });

//添加连线
    var svg_edges = svg.selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .style("stroke","#ccc")
      .style("stroke-width",1);

    var color = d3.scale.category20();

    // 添加文字
    // var edges_text = svg.selectAll(".linetext")
    //   .data(nodes)
    //   .enter()
    //   .append("text")
    //   .attr("class","linetext")
    //   .attr("dx", 200)
    //   .attr("dy", 80)
    //   .text(function(d){
    //     return d.title;
    //   });


//添加节点
    var svg_nodes = svg.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r",20)
      .style("fill",function(d,i){
        return color(i);
      })
      .on("mouseover",function(d,i){
        //显示连接线上的文字
        // abstract_text.style("fill-opacity",function(edge){
        //   return 1.0;
        // });

        abstract=d.paper_abstract,


        svg_texts.style("fill-opacity",function(nodes){
          // console.log("id: "+d.id);
          // console.log("nodes: "+nodes.id);

          if( nodes.id === d.id ){
            return 1.0;
          }
          // return 1.0;
        });
        // multext.text(function(){
        //   return d.paper_abstract;
        // });

        abstract_str=d.paper_abstract[0];
        var strs = abstract_str.split(" ") ;

        console.log(strs);
        var update = abstract_text.data(strs);
        var enter = update.enter();
        var exit = update.exit();



//update部分的处理：更新属性值
        update.text(function(d){
          return "update " + d;
        });

//enter部分的处理：添加元素后赋予属性值
        enter.append("tspan")
          .text(function(d){
            return "enter " + d;
          });
        exit.remove();



        // abstract_text.selectAll("tspan")
        //   .data(strs)
        //   .text(function(d){
        //     return d;
        //   })

        // abstract_text.text(function(){
        //     abstract_str=d.paper_abstract[0];
        //     return d.paper_abstract;
        //   });

      })
      .on("mouseout",function(d,i){
        //隐去连接线上的文字
        svg_texts.style("fill-opacity",function(nodes){
          if( nodes.id === d.id  ) {
            return 0.0;
          }
        });
        // edges_text.style("fill-opacity",function(edge){
        //   return 0.0;
        // });
      })
      .on("dblclick",function(d,i){
        window.open(d.url);
      })
      .on("click",function(d,i){



      })
      .call(force.drag);	//使得节点能够拖动

//添加描述节点的文字


    var g = svg.append("g");
    //
    var multext;

    var abstract_text = svg.append("text")
        .data(nodes)
        .attr("class","labeltext")
        .attr("x",20)
        .attr("y",20);
        // .text(function(d){
        //   // appendMultiText(svg,d.paper_abstract[0],30,100,500,6,"Futura");
        //   // multext= appendMultiText(g,d.paper_abstract[0],30,100,500);
        //
        //   return abstract_str;
        // });
    // console.log("abstract_text");
    // console.log(abstract_text);

    var strs = abstract_str.split(" ") ;

    console.log(strs);

    abstract_text.selectAll("tspan")
      .data(strs)
      .enter()
      .append("tspan")
      .attr("x",abstract_text.attr("x"))
      .attr("dy","1em")
      .text(function(d){
        return d;
      });





    force.on("tick", function(){	//对于每一个时间间隔
      //限制结点的边界
      nodes.forEach(function(d,i){
        d.x = d.x - img_w/2 < 0     ? img_w/2 : d.x ;
        d.x = d.x + img_w/2 > width ? width - img_w/2 : d.x ;
        d.y = d.y - img_h/2 < 0      ? img_h/2 : d.y ;
        d.y = d.y + img_h/2 + text_dy > height ? height - img_h/2 - text_dy : d.y ;
      });

      nodes.forEach(function (d){
        d.x = d.px = linear(d.date); // similar for y
      });
      //更新连线坐标
      svg_edges.attr("x1",function(d){ return d.source.x; })
        .attr("y1",function(d){ return d.source.y; })
        .attr("x2",function(d){ return d.target.x; })
        .attr("y2",function(d){ return d.target.y; });

      //更新节点坐标
      svg_nodes.attr("cx",function(d){ return d.x; })
        .attr("cy",function(d){ return d.y; });

      //更新文字坐标
      svg_texts.attr("x", function(d){ return d.x; })
        .attr("y", function(d){ return d.y; });
    });


    //
    var axis = d3.svg.axis()
      .scale(linear)      //指定比例尺
      .orient("bottom")   //指定刻度的方向
      .ticks(8);          //指定刻度的数量

    svg.append("g")
      .attr("class","axis")
      .attr("transform","translate(20,430)")
      .call(axis);

    this.setState({
      text: "finish",
    });



  },


render() {
  const content = (
      <div>
        <p>内容</p>
        <p>内容</p>
      </div>
    )

    return (
      <div>
        <text>{abstract}</text>
        <div>
          <text>{this.state.text}</text>
          <Popover content={content} trigger="click" title="标题">
            <div>弹出卡片</div>
          </Popover>
          <Popover content={content}  title="标题1">
            <div>弹出卡片1</div>
          </Popover>
        </div>
        <h4></h4>
      </div>
    );
  }
});




export default App1;
