//not used!!!!
import React from 'react';
import ReactDOM from 'react-dom';
import Global from "../Global";



import 'whatwg-fetch';
import 'es6-promise/dist/es6-promise.min.js';
import 'fetch-ie8/fetch.js';

var test;

function sortJSON(data, key, way) {
  return data.sort(function(a, b) {
    var x = parseInt(a[key]); var y = parseInt(b[key]);
    if (way === '123' ) { return ((x < y) ? -1 : ((x > y) ? 1 : 0)); }
    if (way === '321') { return ((x > y) ? -1 : ((x < y) ? 1 : 0)); }
  });
}

class CommentBox extends React.Component{
  constructor(props) {


    super(props);
    this.state = {
      json_data: [],
      search_information: '',
      textareavalue: '',
      url: 'http://localhost:8983/solr/gettingstarted/select?indent=on&q=*:*&wt=json&json.wrf=callback',
      url_1: 'http://localhost:8983/solr/gettingstarted/select?indent=on&q=',
      url_2: '&wt=json&json.wrf=callback',
      info_objs: [],
      submessages: [],
    };

  }

  componentDidMount(){
    // ()=>this.loadCommentsFromServer();
    // fetch('http://localhost:8983/solr/gettingstarted/select?indent=on&q=*:*&wt=json&json.wrf=callback',
    //   {
    //     dataType:'jsonp',
    //     jsonpCallback: 'callback',
    //   })
    //   .then(function(response) {
    //     return response.json()
    //   }).then(function(json) {
    //   console.log('parsed json', json)
    // }).catch(function(ex) {
    //   console.log('parsing failed', ex)
    // })

    $.ajax({
      url: "http://localhost:8983/solr/gettingstarted/select?indent=on&q=*:*&wt=json&json.wrf=callback",
      dataType: 'jsonp',
      jsonp: false,
      jsonpCallback: 'callback',
      cache: false,
    }).done(function (data) {

      this.setState({json_data: data});
      //console.log("hello");
      //console.log(data.response);
    }.bind(this));
    //console.log(this.state.json_data.response);
  }

  handleSubmit(e) {
    e.preventDefault();
    if(!this.state.search_information) {
      this.state.search_information="*:*";
    }

    Global.search_query=this.state.search_information;

    var url=this.state.url_1+this.state.search_information+this.state.url_2;
    console.log("url: ");
    console.log(url);

    console.log(this.state.url);

    // console.log("submit this.state.search_information");
    // console.log(this.state.search_information);

    $.ajax({
      url: url,
      dataType: 'jsonp',
      jsonp: false,
      jsonpCallback: 'callback',
      cache: false,
    }).done(function (data) {

      this.setState({json_data: data});
      //console.log("hello");
      //console.log(data.response);
    }.bind(this));

    // var obj = JSON.parse(this.state.json_data);
    // console.log(obj.response[1].name);
    //console.log(this.state.json_data.response);
    //console.log(this.state.json_data[1]);


    this.setState({
      url: url
    });

    for(var i=0; i<this.state.json_data.response.docs.length;i++)
    {
      //console.log(this.state.json_data.response.docs[i].name);

      var temp_ref_date=this.state.json_data.response.docs[i].ref_date;
      var max_date=0;

      // temp_ref_date.forEach(function(data,index,arr){
      //   temp_ref_date.push(+data);
      // });

      if(typeof(temp_ref_date) != "undefined") {
        temp_ref_date = temp_ref_date.map((data)=> {
          return parseInt(data);
        });
        max_date=Math.max(...temp_ref_date)
      }




      var obj={
        title: this.state.json_data.response.docs[i].title,
        score: 0,
        url: this.state.json_data.response.docs[i].url,
        ref_date: temp_ref_date,


        ref_rawString: this.state.json_data.response.docs[i].ref_rawString,
        num:i,
        date: max_date,
      };
      this.state.info_objs[i]=obj;


    }
    this.setState({info_objs: this.state.info_objs});
    console.log("objs");
    console.log(this.state.info_objs);

    var objs_date_order=this.state.info_objs;
    sortJSON(objs_date_order,"date", '123');


    console.log("objs_date_order");
    console.log(objs_date_order);



    var submessages = [];
    for(var ii=0; ii<this.state.info_objs.length; ii++){
      submessages.push(
        <a href={this.state.info_objs[ii].url} target="_blank" key={Math.random()} > {this.state.info_objs[ii].title} </a>
      )
      submessages.push(
        <br/>)

    }
    this.setState({submessages: submessages});


  }

  handleTextChange(e) {
    this.setState({search_information: e.target.value});
  }
  // print: function(){
  //
  //   for(var i=0; i<=this.state.information.length; i++){
  //     out += <h1>this.state.information</h1>+<br/>;
  //
  //   }
  //     return out;
  //
  // },
  render() {

    return (
      <div className="commentBox" >



        <h1>Search</h1>
        <form className="commentForm" onSubmit={this.handleSubmit.bind(this)}>
          <input
            type="text"
            placeholder="Say something..."
            value={this.state.search_information}
            onChange={this.handleTextChange.bind(this)}
          />
          <input type="submit" value="search" />
          <br/>
        </form>
        <br/>
        {this.state.submessages}


        <svg version="1.1" height="1000"
             width="1000"
             style={{backgroundColor: "transparent"}}>
          <circle cx="100" cy="100" r="40" stroke="black"
                  strokeWidth="2" fill="transparent" ><text x="0" y="15" fill="red">I love SVG</text></circle>

          <circle cx="300" cy="100" r="40" stroke="black"
                  strokeWidth="2" fill="red" />

          <circle cx="500" cy="100" r="40" stroke="black"
                  strokeWidth="2" fill="red" />

          <path d="M100 100 S200,200 300 100"
                fill="none"
                stroke="#000000"
                strokeWidth="6"
          />
          <path d="M100 100 S300,300 500 100"
                fill="none"
                stroke="#000000"
                strokeWidth="6"
          />

        </svg>

      </div>
    );
  }
}


export default CommentBox;



// ReactDOM.render(
//   <CommentBox  />,
//   document.getElementById('root')
// );


/*
 <polyline
 points="100,50 300,50"
 fill="none"
 stroke="#BBCE00"
 strokeWidth="6"
 />

 */
