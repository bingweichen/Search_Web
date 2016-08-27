var Global = {

  searchURL_base: "http://localhost:8983/solr/gettingstarted/select?indent=on",
  searchURL_add_fl: "&fl=id,title,author,date,url,score,ref_title",
  searchURL_add_row: "&rows=100",
  
  search_query: "*:*",

  json_data: [],

  node:[],
  edge:[],


};
module.exports = Global;
