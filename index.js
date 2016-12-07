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
  // 自定义的输入建议列表项
  // customItem(item, handleSelect)
  customItem: PropTypes.func,
  // 获取输入列表项的建议列表
  // fetchSuggestions(text)
  fetchSuggestions: PropTypes.func,
  // 选择建议项的事件回调
  // onSelect(selected)
  onSelect: PropTypes.func,
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
  styles: {},
};

export default class Input2 extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 输入框是否聚焦
      isFocused: false,
      // 输入建议的数据源
      suggestionsDataSource: null,
    };

    const { value, defaultValue, fetchSuggestions } = this.props;

    if (fetchSuggestions) {
      // 创建数据源
      this.suggestionsDataSource = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

      this.fetchSuggestionsByText(value || defaultValue || '');
    }
  }

  componentWillReceiveProps(nextProps) {
    // 文本框的内容变化后，需要重新获取建议列表
    if (this.props.value !== nextProps.value) {
      this.fetchSuggestionsByText(nextProps.value);
    }
  }

  // 获取建议列表
  fetchSuggestionsByText(text) {
    const { fetchSuggestions } = this.props;

    if (!fetchSuggestions) {
      return;
    }

    // 获取建议列表
    Promise.resolve(fetchSuggestions(text))
      .then(suggestions => {
        this.setState(Object.assign({}, this.state, {
          suggestionsDataSource: this.suggestionsDataSource.cloneWithRows(suggestions),
        }));
      })
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

  renderClearButton() {
    const { showClearButton, onClear, styles: userStyles } = this.props;
    const { isFocused } = this.state;

    if (!showClearButton || !isFocused) {
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

  renderSuggestions() {
    const { onSelect, styles: userStyles } = this.props;
    const { suggestionsDataSource, isFocused } = this.state;
    const rowCount = suggestionsDataSource ? suggestionsDataSource.getRowCount(0) : 0;

    // 没有建议项或是失去焦点的情况下，不渲染建议列表
    if (rowCount === 0 || !isFocused ) {
      return null;
    }

    const customItem = this.props.customItem || ((item, handleSelect) => (
      <TouchableWithoutFeedback onPress={handleSelect}>
        <View style={[styles.suggestion, userStyles.suggestion]}>
          <Text
            ellipsizeMode="middle"
            numberOfLines={1}
            style={[styles.suggestionText, userStyles.suggestionText]}
          >
            {item.value || item}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    ));

    return (
      <ListView
        keyboardShouldPersistTaps
        style={[styles.suggestions, userStyles.suggestions]}
        dataSource={suggestionsDataSource}
        renderRow={item => customItem(item, () => onSelect(item))}
        renderSeparator={(sectionID, rowID) => this.renderSeparator(rowID, rowCount)}
      />
    );
  }

  renderSeparator(rowID, rowCount) {
    const { onSelect, styles: userStyles } = this.props;

    // 最后一行不渲染分隔符
    if (parseInt(rowID, 10) === rowCount - 1) {
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
