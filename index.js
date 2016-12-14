import React, { Component, PropTypes } from 'react';
import {
  Image,
  ListView,
  PixelRatio,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

const propTypes = {
  // 自定义的样式集
  styles: PropTypes.object,
  // 建议列表
  suggestions: PropTypes.array,
  // 自定义建议列表项的渲染函数
  // renderSuggestion(item, handleSelect)
  renderSuggestion: PropTypes.func,
  // 每当需要更新建议列表时会调用该函数，目前只有当组件实例化和输入框的值变化时才会触发调用
  // onSuggestionsFetchRequested(text)
  onSuggestionsFetchRequested: PropTypes.func,
  // 每当用户选择建议列表中的一项时会调用该函数
  // onSuggestionSelected(selected)
  onSuggestionSelected: PropTypes.func,
  // 是否显示清空按钮
  showClearButton: PropTypes.bool,
  // 点击清空按钮的事件回调
  onClear: PropTypes.func,
  // 前缀的节点
  prependSlot: PropTypes.node,
  // 后缀的节点
  appendSlot: PropTypes.node,
};

const defaultProps = {
  showClearButton: true,
  styles: {},
};

export default class Input2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 输入框是否聚焦
      isFocused: false,
    };

    const { onSuggestionsFetchRequested, value } = this.props;

    if (onSuggestionsFetchRequested) {
      // 创建数据源
      this.suggestionsDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      // 初始化时触发获取建议列表事件
      setImmediate(() => onSuggestionsFetchRequested(value))
    }
  }

  componentWillReceiveProps(nextProps) {
    // 文本框的内容变化后，需要重新获取建议列表
    if (this.props.value !== nextProps.value) {
      nextProps.onSuggestionsFetchRequested(nextProps.value);
    }
  }

  // 处理输入框得到焦点的事件
  handleFocus() {
    const { onFocus, fetchSuggestions } = this.props;

    if (onFocus) {
      onFocus();
    }

    this.setState(Object.assign({}, this.state, {
      isFocused: true,
    }));
  }

  // 处理输入框失去焦点的事件
  handleBlur() {
    const { onBlur, fetchSuggestions } = this.props;

    if (onBlur) {
      onFocus();
    }

    this.setState(Object.assign({}, this.state, {
      isFocused: false,
    }));
  }

  // 聚焦
  focus() {
    this.input.focus();
  }

  // 失去焦点
  blur() {
    this.input.blur();
  }

  render() {
    const { styles: userStyles, onFocus, onBlur, prependSlot, appendSlot, ...other } = this.props;

    return (
      <View style={[styles.container, userStyles.container]}>
        {prependSlot}
        <TextInput
          ref={ref => (this.input = ref)}
          style={[styles.input, userStyles.input]}
          onFocus={() => this.handleFocus()}
          onBlur={() => this.handleBlur()}
          {...other}
        />
        {this.renderClearButton()}
        {appendSlot}
        {this.renderSuggestions()}
      </View>
    );
  }

  // 渲染清空按钮
  renderClearButton() {
    const { showClearButton, onClear, value, styles: userStyles } = this.props;
    const { isFocused } = this.state;

    // 输入框没有值、失去焦点或用户禁止显示按钮时不渲染按钮
    if (!showClearButton || !isFocused || !value) {
      return null;
    }

    return (
      <TouchableOpacity onPress={onClear}>
        <Image
          style={[styles.clearButton, userStyles.clearButton]}
          source={require('./images/clear.png')}
        />
      </TouchableOpacity>
    );
  }

  // 渲染建议列表
  renderSuggestions() {
    const { suggestions, onSuggestionSelected, styles: userStyles } = this.props;
    const { isFocused } = this.state;

    // 没有建议项或是失去焦点的情况下，不渲染建议列表
    if (!suggestions || suggestions.length === 0 || !isFocused ) {
      return null;
    }

    return (
      <ListView
        keyboardShouldPersistTaps
        style={[styles.suggestions, userStyles.suggestions]}
        dataSource={this.suggestionsDataSource.cloneWithRows(suggestions)}
        renderRow={item => this.renderSuggestion(item, () => onSuggestionSelected(item))}
        renderSeparator={(sectionID, rowID) => this.renderSeparator(rowID)}
      />
    );
  }

  // 渲染建议项
  renderSuggestion(item, handleSelect) {
    const { renderSuggestion, styles: userStyles } = this.props;

    // 如果用户传递了自定义的渲染函数就使用用户的
    if (renderSuggestion) {
      return renderSuggestion(item, handleSelect);
    }

    return (
      <TouchableWithoutFeedback onPress={handleSelect}>
        <View style={[styles.suggestion, userStyles.suggestion]}>
          <Text
            ellipsizeMode="middle"
            numberOfLines={1}
            style={[styles.suggestionText, userStyles.suggestionText]}
          >
            {item.label || item}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  }

  // 渲染建议项之间的分隔符
  renderSeparator(rowID) {
    const { suggestions, styles: userStyles } = this.props;

    // 最后一行不渲染分隔符
    if (parseInt(rowID, 10) === suggestions.length - 1) {
      return null;
    }

    return (
      <View
        key={rowID}
        style={[styles.suggestionSeparator, userStyles.suggestionSeparator]}
      />
    );
  }
}

Input2.defaultProps = defaultProps;

Input2.propTypes = propTypes;

const pixelDensity = PixelRatio.get();
const fontSize = 32 / pixelDensity;
const itemHeight = 90 / pixelDensity;
const onePixel = 1 / pixelDensity;
const topOffset = 91 / pixelDensity;
const greyColor = '#dfdfde';

const styles = StyleSheet.create({
  // 容器
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'relative',
    borderBottomWidth: onePixel,
    borderBottomColor: greyColor,
  },

  // 输入框
  input: {
    fontSize,
    height: itemHeight,
    flex: 1,
  },

  // 清空按钮
  clearButton: {
    width: 32 / pixelDensity,
    height: 32 / pixelDensity,
    margin: 20 / pixelDensity,
  },

  // 建议列表
  suggestions: {
    position: 'absolute',
    top: topOffset,
    left: 0,
    right: 0,
    maxHeight: 4 * itemHeight,
  },

  // 建议项
  suggestion: {
  },

  // 建议项的文本
  suggestionText: {
    fontSize,
    lineHeight: itemHeight,
  },

  // 建议项之间的分隔符
  suggestionSeparator: {
    // height: onePixel,
    borderBottomWidth: onePixel,
    borderBottomColor: greyColor,
  }
});
