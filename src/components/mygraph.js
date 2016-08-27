import { Table, Button } from 'antd';
import React, { Component, PropTypes } from 'react';
import Global from "../Global";

// import Node from "/Users/chen/project_run/test/json/file1.json";


var re = /\s*\b/g;
var re2 = /[A-Z]/g;

function convert(propertyName)
{
  function upperToLower(match)
  {
    return match.toLowerCase();
  }
  return propertyName.replace(re2, upperToLower);
}

function fenci(string){
  string = convert(string);
  var output = [];
  output = string.replace(/\n/g,'').split(re);
  var output_1 = [];
  for (var i = 0; i < output.length; i++) {
    if (output[i]!==',' && output[i]!==';' && output[i]!=='.')
      output_1.push(output[i]);
  }
  return output_1;
}
function compare(x1, y1) {
  var x = x1.slice();
  var y= y1.slice();
  var z = 0;
  var s = x.length + y.length;;

  x.sort();
  y.sort();

  var a = x.shift();
  var b = y.shift();

  while(a !== undefined && b !== undefined) {
    if (a === b) {
      z++;
      a = x.shift();
      b = y.shift();
    } else if (a < b) {
      a = x.shift();
    } else if (a > b) {
      b = y.shift();
    }
  }
  return z/s * 200;
}


const App1 = React.createClass({
  // fetch_solr(solr_query){
  //   fetch(solr_query)
  //     .then((response) => response.json())
  //     .then((json) => {
  //       //data=[];
  //       Global.json_data=json;
  //       console.log("json.response");
  //       console.log(json.response.docs);
  //       this.setState({
  //         solr_json: json.response.docs,
  //         //dataSource:this.state.dataSource.cloneWithRows(json.response.docs)
  //       });
  //     })
  //     .catch(function(error) {
  //       console.log('request failed', error)
  //     });
  // },

  getInitialState() {
    // this.fetch_solr(Global.searchURL_base+Global.searchURL_add_fl+Global.searchURL_add_row+"&q=*:*"+"&wt=json");
    return {
      nouse: "dddd",
    };
  },
  componentDidMount() {
    // var string1 = "Generalizing biomedical event extraction.";
    // var string2 = "\nGeneralizing Biomedical Event Extraction\n";
    //
    // var output1=fenci(string1);
    // var output2=fenci(string2);
    //
    // console.log("score");
    // console.log(compare(output1, output2));
    var count_num=0;

    var score;

    console.log("Global.json_data");
    console.log(Global.json_data);
    var data=Global.json_data.response.docs;
    console.log("data");
    console.log(data);
    var node=[];
    var edge=[];
    data.map((ele)=>{
      if(ele.title) {
        node.push(ele.title[0]);
      }
    });

    console.log("node");
    console.log(node);

    data.map((ele)=>{

      if(ele.ref_title && ele.title) {
        ele.ref_title.map((e)=> {

          // console.log("reftitle");
          // console.log(e);
          for (var i = 0; i < node.length; i++) {



            score=compare(fenci(e),fenci(node[i]));


            if (score>80) {
              console.log("score");
              console.log(score);
              console.log("title");
              console.log(ele.title[0]);
              console.log("e");
              console.log(e);
              console.log("node[i]");
              console.log(node[i]);

              count_num++;


              edge.push([node[i],ele.title[0]]);
            }
          }
        });
      }
    });

    console.log("count num");
    console.log(count_num);

    console.log("edge");
    console.log(edge);

    Global.node=node;
    Global.edge=edge;






    // console.log("Global.node");
    // console.log(Global.node);
    // console.log("Global.edge");
    // console.log(Global.edge);

    var vaild_nodes=[];
    Global.edge.map((e)=>{
      vaild_nodes.push(e[0]);
      vaild_nodes.push(e[1]);
    });

    console.log("vaild_nodes");
    console.log(vaild_nodes);

    var vaild_nodes_no_same=[];
    Global.node.map((ele)=>{
      if(vaild_nodes.indexOf(ele)>=0){
        vaild_nodes_no_same.push(ele);
      }
    });

    console.log("vaild_nodes_no_same");
    console.log(vaild_nodes_no_same);

    var nodes=[];
    vaild_nodes_no_same.map((ele1)=>{
      nodes.push({name: ele1});
    });
    // console.log("vaild_nodes");
    // console.log(vaild_nodes);

    var edges=[];
    Global.edge.map((ele)=>{
      console.log("ele[0]");
      console.log(ele[0]);

      // console.log("vaild_nodes.indexOf(ele[0])");
      // console.log(vaild_nodes.indexOf(ele[0]));
      console.log("Global.node.indexOf(ele[0])");
      console.log(Global.node.indexOf(ele[0]));


      edges.push({
        source: vaild_nodes_no_same.indexOf(ele[0]),
        target: vaild_nodes_no_same.indexOf(ele[1]),
      })
    });
    console.log("nodes");
    console.log(nodes);
    console.log("edges");
    console.log(edges);

    // console.log("mynode");
    // console.log(mynode);
    //
    // console.log("myedge");
    // console.log(myedge);


    // var nodes = [ { name: "桂林"    }, { name: "广州" },
    //   { name: "厦门"    }, { name: "杭州"   },
    //   { name: "上海"   }, { name: "青岛"    },
    //   { name: "天津"    } ];
    //
    // var edges = [  { source : 0  , target: 1 } , { source : 0  , target: 2 } ,
    //   { source : 0  , target: 3 } , { source : 1  , target: 4 } ,
    //   { source : 1  , target: 5 }  ];


    var width = 600;
    var height = 600;


    var svg = d3.select("h3")
      .append("svg")
      .attr("width",width)
      .attr("height",height);

    var force = d3.layout.force()
      .nodes(nodes)		//指定节点数组
      .links(edges)		//指定连线数组
      .size([width,height])	//指定范围
      .linkDistance(150)	//指定连线长度
      .charge(-400);	//相互之间的作用力

    force.start();	//开始作用

    console.log(nodes);
    console.log(edges);

//添加连线
    var svg_edges = svg.selectAll("line")
      .data(edges)
      .enter()
      .append("line")
      .style("stroke","#ccc")
      .style("stroke-width",1);

    var color = d3.scale.category20();

//添加节点
    var svg_nodes = svg.selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r",20)
      .style("fill",function(d,i){
        return color(i);
      })
      .call(force.drag);	//使得节点能够拖动

//添加描述节点的文字
    var svg_texts = svg.selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .style("fill", "black")
      .attr("dx", 20)
      .attr("dy", 8)
      .text(function(d){
        return d.name;
      });


    force.on("tick", function(){	//对于每一个时间间隔

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

  },



  render() {
    return (
      <div>
        <h3>ddddddd</h3>
      </div>
    );
  }
});


export default App1;
