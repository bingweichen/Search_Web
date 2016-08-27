import React from 'react';
import ReactDOM from 'react-dom';

var CommentBox = React.createClass({
  loadCommentsFromServer: function() {

  },
 getInitialState: function() {
   var obj={
     title: "",
     score: 0,
     url: "",
     ref_date: [],
     ref_rawstring: [],
   };
    return {
      json_data: [],
      search_information: '',
      textareavalue: '',
      url: 'http://localhost:8983/solr/gettingstarted/select?indent=on&q=*:*&wt=json&json.wrf=callback',
      url_1: 'http://localhost:8983/solr/gettingstarted/select?indent=on&q=',
      url_2: '&wt=json&json.wrf=callback',
      info_objs: [],
    };
  },
  componentDidMount: function() {
    // ()=>this.loadCommentsFromServer();
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
  },

  handleSubmit: function(e) {
    e.preventDefault();
    if(!this.state.search_information) {
      this.state.search_information="*:*";
    }
    var url=this.state.url_1+this.state.search_information+this.state.url_2;



    console.log("url: ");
    console.log(this.state.url);
    console.log("submit this.state.search_information");
    console.log(this.state.search_information);

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
    console.log(this.state.json_data.response);
    //console.log(this.state.json_data[1]);


    this.setState({
      url: url
    });





    for(var i=0; i<this.state.json_data.response.docs.length;i++)
    {
      //console.log(this.state.json_data.response.docs[i].name);
      var obj={
        title: this.state.json_data.response.docs[i].title,
        score: 0,
        url: this.state.json_data.response.docs[i].url,
        ref_date: this.state.json_data.response.docs[i].ref_date,
        ref_rawString: this.state.json_data.response.docs[i].ref_rawString,
      };
      this.state.info_objs[i]=obj;


    }

    this.setState({info_objs: this.state.info_objs});


    // var obj = eval ("(" + this.state.json_data + ")");
    // console.log("obj");
    // console.log(obj);


    // this.props.onCommentSubmit({author: author, text: text});
    // this.setState({author: '', text: ''});
  },

  handleTextChange: function(e) {
    this.setState({search_information: e.target.value});
  },


  // print: function(){
  //
  //   for(var i=0; i<=this.state.information.length; i++){
  //     out += <h1>this.state.information</h1>+<br/>;
  //
  //   }
  //     return out;
  //
  // },
    render: function() {
      var submessages = [];
      for(var ii=0; ii<this.state.info_objs.length; ii++){
        submessages.push(
          <h3 >  {this.state.info_objs[ii].title} </h3>
        )
      }
      return (
        <div className="commentBox" >
          <h1>Search</h1>
          <form className="commentForm" onSubmit={this.handleSubmit}>
            <input
              type="text"
              placeholder="Say something..."
              value={this.state.search_information}
              onChange={this.handleTextChange}
            />
            <input type="submit" value="Post" />
            <br/>
          </form>
          <br/>
          {submessages}
        </div>
      );
    }
});





ReactDOM.render(
  <CommentBox  />,
  document.getElementById('root')
);






// /**
//  * This file provided by Facebook is for non-commercial testing and evaluation
//  * purposes only. Facebook reserves all rights not expressly granted.
//  *
//  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
//  * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
//  * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
//  * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
//  */
//
// var Comment = React.createClass({
//   rawMarkup: function() {
//     var md = new Remarkable();
//     var rawMarkup = md.render(this.props.children.toString());
//     return { __html: rawMarkup };
//   },
//
//   render: function() {
//     return (
//       <div className="comment">
//         <h2 className="commentAuthor">
//           {this.props.author}
//         </h2>
//         <span dangerouslySetInnerHTML={this.rawMarkup()} />
//       </div>
//     );
//   }
// });
//
// var CommentBox = React.createClass({
//   loadCommentsFromServer: function() {
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       cache: false,
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   handleCommentSubmit: function(comment) {
//     var comments = this.state.data;
//     // Optimistically set an id on the new comment. It will be replaced by an
//     // id generated by the server. In a production application you would likely
//     // not use Date.now() for this and would have a more robust system in place.
//     comment.id = Date.now();
//     var newComments = comments.concat([comment]);
//     this.setState({data: newComments});
//     $.ajax({
//       url: this.props.url,
//       dataType: 'json',
//       type: 'POST',
//       data: comment,
//       success: function(data) {
//         this.setState({data: data});
//       }.bind(this),
//       error: function(xhr, status, err) {
//         this.setState({data: comments});
//         console.error(this.props.url, status, err.toString());
//       }.bind(this)
//     });
//   },
//   getInitialState: function() {
//     return {data: []};
//   },
//   componentDidMount: function() {
//     this.loadCommentsFromServer();
//     setInterval(this.loadCommentsFromServer, this.props.pollInterval);
//   },
//   render: function() {
//     return (
//       <div className="commentBox">
//         <h1>Comments</h1>
//         <CommentList data={this.state.data} />
//         <CommentForm onCommentSubmit={this.handleCommentSubmit} />
//       </div>
//     );
//   }
// });
//
// var CommentList = React.createClass({
//   render: function() {
//     var commentNodes = this.props.data.map(function(comment) {
//       return (
//         <Comment author={comment.author} key={comment.id}>
//           {comment.text}
//         </Comment>
//       );
//     });
//     return (
//       <div className="commentList">
//         {commentNodes}
//       </div>
//     );
//   }
// });
//
// var CommentForm = React.createClass({
//   getInitialState: function() {
//     return {author: '', text: ''};
//   },
//   handleAuthorChange: function(e) {
//     this.setState({author: e.target.value});
//   },
//   handleTextChange: function(e) {
//     this.setState({text: e.target.value});
//   },
//   handleSubmit: function(e) {
//     e.preventDefault();
//     var author = this.state.author.trim();
//     var text = this.state.text.trim();
//     if (!text || !author) {
//       return;
//     }
//     this.props.onCommentSubmit({author: author, text: text});
//     this.setState({author: '', text: ''});
//   },
//   render: function() {
//     return (
//       <form className="commentForm" onSubmit={this.handleSubmit}>
//         <input
//           type="text"
//           placeholder="Your name"
//           value={this.state.author}
//           onChange={this.handleAuthorChange}
//         />
//         <input
//           type="text"
//           placeholder="Say something..."
//           value={this.state.text}
//           onChange={this.handleTextChange}
//         />
//         <input type="submit" value="Post" />
//       </form>
//     );
//   }
// });
//
// ReactDOM.render(
//   <CommentBox url="/api/comments" pollInterval={2000} />,
//   document.getElementById('content')
// );
