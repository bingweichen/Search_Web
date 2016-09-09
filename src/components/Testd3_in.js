import { Table, Button, Popover,Radio } from 'antd';
import React, { Component, PropTypes } from 'react';
import Global from "../Global";

import Node from "/Users/chen/project_run/test/json/file1.json";
import Edge from "/Users/chen/project_run/test/json/file2.json";


const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;


var abstract="ss";
const App1 = React.createClass({

  getInitialState() {
    return {
      loading: false,
      iconLoading: false,

      coherence_threhold: 0.5,
      sub_chain_length: 3,
      number_of_nodes: 100,


      nouse: "dddd",

      nodes: "",
      edges: "",

      text:"loading",
      abstract:"",
    };
  },
  onChange(e) {
    console.log(`radio checked:${e.target.value}`);
    this.setState({ coherence_threhold: e.target.value });
  },

  onChange1(e) {
    console.log(`radio checked:${e.target.value}`);
    this.setState({ sub_chain_length: e.target.value });
  },

  onChange2(e) {
    console.log(`radio checked:${e.target.value}`);
    this.setState({ number_of_nodes: e.target.value });
  },


  enterLoading() {
    this.setState({ loading: true });

    var Node;
    var Edge;
    var url="http://localhost:4567/coherence/"+Global.search_query+"/"
      +this.state.coherence_threhold+"/"+ this.state.sub_chain_length
      +"/"+ this.state.number_of_nodes;
    console.log("url");
    console.log(url);

    var _title="Title: "+Global.search_query+" "
      +"Coherence Threhold: "+this.state.coherence_threhold+" "
      +"Sub Chain Length: "+this.state.sub_chain_length+" ";



    fetch(url)
      .then((response) => response.json())
      .then((json) => {
        console.log(json);

        // this.setState({
        //   nodes: json.nodes,
        //   edges: json.edges,
        //
        // });
        Node=json.nodes;
        Edge=json.edges;
        /////////

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


        var width = 1100;
        var height = 400;
        var img_w = 77;
        var img_h = 90;
        var text_dx = -20;
        var text_dy = 20;

        var dataset = [];
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
          .range([20, 1000]);


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

        var title = svg.selectAll(".title")
          .data(nodes)
          .enter()
          .append("text")
          // .style("fill", "black")
          .attr("dx", 40)
          .attr("dy", 10)
          .attr("class","title")
          .text(function(d){
            return _title;
          });

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
            return color(d.date);
          })
          .on("mouseover",function(d,i){
            svg_texts.style("fill-opacity",function(nodes){
              if( nodes.id === d.id ){
                return 1.0;
              }
            });

          })
          .on("mouseout",function(d,i){
            //隐去连接线上的文字
            svg_texts.style("fill-opacity",function(nodes){
              if( nodes.id === d.id  ) {
                return 0.0;
              }
            });
          })
          .on("dblclick",function(d,i){
            window.open(d.url);
          })
          .on("click",function(d,i){
            svg_texts.style("fill-opacity",function(nodes) {
              return 1.0;
            });

          })
          .call(force.drag);	//使得节点能够拖动

//添加描述节点的文字

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
          .attr("transform","translate(20,330)")
          .call(axis);

        this.setState({
          text: "finish",
        });

        this.setState({ loading: false });
        ////////
      })
      .catch(function(error) {
        console.log('request failed', error)
      });





  },
  enterIconLoading() {
    this.setState({ iconLoading: true });
  },

  componentDidMount() {

  },


render() {
  const content = (
      <div>
        <p>内容</p>
      </div>
    )

    return (
      <div>

        <div style={{ flexDirection: 'row',display: 'flex', width: "1000px" }}>
          <div style={{ width: "500px" }}>
            <div>
              Coherence Threshold:
              <RadioGroup onChange={this.onChange} defaultValue="0.5" style={{ marginLeft: 16 }}>
                <RadioButton value="0.1">0.1</RadioButton>
                <RadioButton value="0.2">0.2</RadioButton>
                <RadioButton value="0.3">0.3</RadioButton>
                <RadioButton value="0.4">0.4</RadioButton>
                <RadioButton value="0.5">0.5</RadioButton>
                <RadioButton value="0.7">0.7</RadioButton>
                <RadioButton value="0.8">0.8</RadioButton>
              </RadioGroup>
            </div>

            <div style={{ marginTop: 16 }}>
              Sub-chain length:
              <RadioGroup onChange={this.onChange1} defaultValue="3" style={{ marginLeft: 16 }}>
                <RadioButton value="2">2</RadioButton>
                <RadioButton value="3">3</RadioButton>
                <RadioButton value="4">4</RadioButton>
                <RadioButton value="5">5</RadioButton>
                <RadioButton value="6">6</RadioButton>
                <RadioButton value="8">8</RadioButton>

              </RadioGroup>
            </div>

            <div style={{ marginTop: 16 }}>
              Number of nodes:
              <RadioGroup onChange={this.onChange2} defaultValue="100" style={{ marginLeft: 16 }}>
                <RadioButton value="100">100</RadioButton>
                <RadioButton value="150">150</RadioButton>
                <RadioButton value="200">200</RadioButton>
                <RadioButton value="300">300</RadioButton>
                <RadioButton value="300">500</RadioButton>

              </RadioGroup>
            </div>

          </div>



          <div >
            <p>The currenet search query is: {Global.search_query}</p>

            <p>Move on the circle to see its title. Left click on the circle will show titles of papers.</p>
             <p> Double click on the circle to see the detail of its paper. </p>

            <p>Caution: Only increase the number of nodes when citation map has to less nodes.</p>
            <p> It will spend much time when increasing to 300.</p>
          </div>


        </div>

        <div style={{ marginTop: 16 }}>
        <Button type="primary" loading={this.state.loading} onClick={this.enterLoading} >
          Generate Graph
        </Button>
        </div>


        <h4></h4>
      </div>
);
}
});




export default App1;
/*
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


 */
