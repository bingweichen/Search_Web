import React, { Component, PropTypes } from 'react';

import { Button, Form, Input } from 'antd';

const createForm = Form.create;
const FormItem = Form.Item;


function noop() {
  return false;
}

var BasicDemo = React.createClass({


  fetch_solr(solr_query){

    fetch(solr_query)
      .then((response) => response.json())
      .then((json) => {
        this.setState({
          solr_json: json.response.docs,
          dataSource:this.state.dataSource.cloneWithRows(json.response.docs)
        });
        // console.log("json.response");
        // console.log(json.response.docs);
      })
      .catch(function(error) {
        console.log('request failed', error)
      });
  },


  ComponentDidMount(){

  },


  handleReset(e) {
    e.preventDefault();
    this.props.form.resetFields();
  },

  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((errors, value) => {
      this.props._func(value.id);
      // console.log("value.id");
      // console.log(value.id);
    });
  },

  userExists(rule, value, callback) {
    if (!value) {
      callback();
    } else {
      setTimeout(() => {
        if (value === 'JasonWood') {
          callback([new Error('抱歉，该用户名已被占用。')]);
        } else {
          callback();
        }
      }, 800);
    }
  },

  checkPass(rule, value, callback) {
    const { validateFields } = this.props.form;
    if (value) {
      validateFields(['rePasswd'], { force: true });
    }
    callback();
  },

  checkPass2(rule, value, callback) {
    const { getFieldValue } = this.props.form;
    if (value && value !== getFieldValue('passwd')) {
      callback('两次输入密码不一致！');
    } else {
      callback();
    }
  },

  render() {
    const { getFieldProps, getFieldError, isFieldValidating } = this.props.form;
    const therule={
      rules: [
        { required: true,  },
      ],
    }


    const formItemLayout = {
      labelCol: { span: 7 },
      wrapperCol: { span: 12 },
    };
    return (
      <Form horizontal form={this.props.form}>
        <FormItem
          {...formItemLayout}
          label="Search query"
          hasFeedback
          help={isFieldValidating('id') ? '校验中...' : (getFieldError('name') || []).join(', ')}
        >
          <Input {...getFieldProps('id',therule)} placeholder="Enter search query or id:(1 2 3)" />
        </FormItem>

        <FormItem wrapperCol={{ span: 12, offset: 7 }}>
          <Button type="primary" onClick={this.handleSubmit}>Search</Button>
          &nbsp;&nbsp;&nbsp;
          <Button type="ghost" onClick={this.handleReset}>replace</Button>
        </FormItem>
      </Form>
    );
  },
});
BasicDemo = createForm()(BasicDemo);
export default BasicDemo;
