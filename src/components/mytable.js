import { Table, Button } from 'antd';
import React, { Component, PropTypes } from 'react';
import Form1 from "./Form1";
import Global from "../Global";

import Jsonsos from "./jsonnnn.json";

const columns = [{
  title: 'id',
  dataIndex: 'id',
  width: 60,
}, {
  title: 'title',
  dataIndex: 'title',
  width: 150,
}, {
  title: 'author',
  dataIndex: 'author',
  width: 50,
}, {
  title: 'date',
  dataIndex: 'date',
  width: 50,
}, {
  title: 'url',
  dataIndex: 'url',
  width: 150,
}, {
  title: 'score',
  dataIndex: 'score',
  width: 50,
}

];

var data = [];

const App = React.createClass({
  getInitialState() {
    console.log("Jsonsos");
    console.log(Jsonsos);

    return {
      selectedRowKeys: [],  // 这里配置默认勾选列
      loading: false,
      text: "*:*"
    };
  },
  componentWillMount() {
    this.text="";
    this.fetch_solr(Global.searchURL_base+Global.searchURL_add_fl+Global.searchURL_add_row+"&q=*:*"+"&wt=json");

    console.log("Global.json_datasssssssssssss");

  },
  componentDiDMount(){

  },


  fetch_solr(solr_query){
    data=[];
    fetch(solr_query)
      .then((response) => response.json())
      .then((json) => {
        //data=[];
        for (var i = 0; i < json.response.docs.length; i++) {
          data.push({
            key: json.response.docs[i].id,
            id: json.response.docs[i].id,
            title: json.response.docs[i].title,
            author: json.response.docs[i].author,
            date: json.response.docs[i].date,
            url: json.response.docs[i].url,
            score: json.response.docs[i].score,


          });
        }
        // console.log("data");
        // console.log(data);
        // console.log("json.response.docs.length");
        // console.log(json.response.docs.length);
        // console.log("json.response.docs[0].id");
        // console.log(json.response.docs[0].id);
        this.setState({
          solr_json: json.response.docs,
          //dataSource:this.state.dataSource.cloneWithRows(json.response.docs)
        });

        Global.json_data=json;


        // console.log("json.response");
        // console.log(json.response.docs);
      })
      .catch(function(error) {
        console.log('request failed', error)
      });
  },



  start() {

    console.log("selectedRowKeys");
    console.log(this.state.selectedRowKeys);

    // var data123="<delete><query>id:";
    // this.state.selectedRowKeys.map((id)=>{
    //   data123=data123+id+" ";
    //   data=data.filter((e) => e.id != id);
    // });
    // data123=data123+"</query></delete>";
    //
    // //var data123=`<delete><query>id:${this.state.selectedRowKeys}</query></delete>`;
    //
    // $.ajax({
    //   type: 'POST',
    //   url: 'http://54.171.189.58:8983/solr/gettingstarted/update',
    //   crossDomain: true,
    //   // beforeSend: function (request)
    //   // {
    //   //   request.setRequestHeader("Authority", authValue);
    //   // },
    //   data: data123,
    //   // data: data,
    //   //processData: false,
    //   dataType: 'xml',
    //   contentType: "application/xml",
    //
    //   success: function(responseData, textStatus, jqXHR) {
    //     alert('POST sucess.');
    //   },
    //   error: function (responseData, textStatus, errorThrown) {
    //     alert('POST failed.');
    //   }
    // });



    this.setState({ loading: true });
    // 模拟 ajax 请求，完成后清空
    setTimeout(() => {
      this.setState({
        selectedRowKeys: [],
        loading: false,
      });
    }, 1000);



  },
  onSelectChange(selectedRowKeys) {
    console.log('selectedRowKeys changed: ', selectedRowKeys);
    this.setState({ selectedRowKeys });
  },
  changeText(text) {

    if (text === ""|| text === undefined) {
      text = "*:*";
    }
    this.state.text = text;

    Global.search_query=text;

    console.log("this.statetext");
    console.log(this.state.text);
    var url1='';

    //url1= "http://localhost:8983/solr/gettingstarted/select?indent=on&fl=id,title,author,date,url,score&rows=100"+"&q="+this.state.text+"&wt=json";
    url1=Global.searchURL_base+Global.searchURL_add_fl+Global.searchURL_add_row+"&q="+this.state.text+"&wt=json";
    console.log("url");
    console.log(url1);
    this.fetch_solr(url1);
    console.log("text");
    console.log(text);
    this.setState({
      text:text,
    });
  },
  render() {
    const { loading, selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
    };
    const hasSelected = selectedRowKeys.length > 0;
    return (
      <div>
        <Form1 _func={(text) => this.changeText(text)}/>
        <div style={{ marginBottom: 16 }}>
          <Button type="primary" onClick={this.start}
                  disabled={!hasSelected} loading={loading}
          >Select</Button>
          <span style={{ marginLeft: 8 }}>{hasSelected ? `choose ${selectedRowKeys.length} objects` : ''}</span>
        </div>
        <Table rowSelection={rowSelection} columns={columns} dataSource={data} />
      </div>
    );
  },
});
export default App;

