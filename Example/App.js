import React, { Component } from 'react';
import {
  StyleSheet,
  View,
} from 'react-native';

import Input2 from './Input2';

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
      value: '',
    };
  }

  getMailSuggestions(text) {
    const info = text.split('@');

    if (!info[0]) {
      return ['anhulife@gmail.com'];
    }

    const domainSuggestions = domainList.filter(domain => domain.startsWith(info[1] || ''));

    return domainSuggestions.map(domain => `${info[0]}@${domain}`);
  }

  handleSelect(selected) {
    this.input.blur();

    this.setState({ value: selected });
  }

  render() {
    const { value } = this.state;

    return (
      <View style={styles.container}>
        <Input2
          ref={ref => (this.input = ref)}
          placeholder="Email"
          value={value}
          autoCapitalize="none"
          autoCorrect={false}
          showClearButton={!!value}
          onClear={() => this.setState({ value: '' })}
          onChangeText={text => this.setState({ value: text })}
          fetchSuggestions={text => this.getMailSuggestions(text)}
          onSelect={selected => this.handleSelect(selected)}
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
