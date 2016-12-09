import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Input2 from 'react-native-input2';

const domainList = [
  '126.com',
  '163.com',
  'apple.com',
  'gmail.com',
  'hotmail.com',
];

export default class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 输入框的值
      value: '',
      // 建议列表
      mailSuggestions: [],
    };
  }

  getMailSuggestions(text) {
    const info = text.split('@');
    let mailSuggestions;

    if (!info[0]) {
      mailSuggestions = ['anhulife@gmail.com'];
    } else {
      const domainSuggestions = domainList.filter(domain => domain.startsWith(info[1] || ''));
      mailSuggestions = domainSuggestions.map(domain => `${info[0]}@${domain}`);
    }

    this.setState(Object.assign({}, this.state, {
      mailSuggestions,
    }));
  }

  changeValue(value) {
    this.setState(Object.assign({}, this.state, { value }));
  }

  handleSelect(selected) {
    this.input.blur();

    this.changeValue(selected);
  }

  render() {
    const { value, mailSuggestions } = this.state;

    return (
      <View style={styles.container}>
        <Input2
          ref={ref => (this.input = ref)}
          placeholder="Email"
          value={value}
          autoCapitalize="none"
          autoCorrect={false}
          suggestions={mailSuggestions}
          onClear={() => this.changeValue('')}
          onChangeText={text => this.changeValue(text)}
          onSuggestionsFetchRequested={text => this.getMailSuggestions(text)}
          onSuggestionSelected={selected => this.handleSelect(selected)}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
});
