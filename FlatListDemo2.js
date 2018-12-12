import React, { Component } from "react";
import { View, Text, FlatList, ActivityIndicator } from "react-native";
//import { List, ListItem, SearchBar } from "react-native-elements";
import Swipeout from "react-native-swipeout";
import uuid from "uuid/v4";

class FlatListDemo extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      page: 1,
      seed: 1,
      error: null,
      refreshing: false
    };
  }

  componentDidMount() {
    this.makeRemoteRequest();
  }

  makeRemoteRequest = () => {
    const { page, seed } = this.state;
    const url = `https://randomuser.me/api/?seed=${seed}&page=${page}&results=20`;
    this.setState({ loading: true });

    fetch(url)
      .then(res => res.json())
      .then(res => {
        res.results.forEach(item => {
          item.noteId = uuid();
        });

        this.setState({
          data: page === 1 ? res.results : [...this.state.data, ...res.results],
          error: res.error || null,
          loading: false,
          refreshing: false
        });
      })
      .catch(error => {
        this.setState({ error, loading: false });
      });
  };

  handleRefresh = () => {
    this.setState(
      {
        page: 1,
        seed: this.state.seed + 1,
        refreshing: true
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  handleLoadMore = () => {
    this.setState(
      {
        page: this.state.page + 1
      },
      () => {
        this.makeRemoteRequest();
      }
    );
  };

  renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: "86%",
          backgroundColor: "#CED0CE",
          marginLeft: "14%"
        }}
      />
    );
  };

  renderHeader = () => {
    return <SearchBar placeholder="Type Here..." lightTheme round />;
  };

  renderFooter = () => {
    if (!this.state.loading) return null;

    return (
      <View
        style={{
          paddingVertical: 20,
          borderTopWidth: 1,
          borderColor: "#CED0CE"
        }}
      >
        <ActivityIndicator animating size="large" />
      </View>
    );
  };

  onSwipeOpen(item, rowId, direction) {
    this.setState({ activeRow: item.noteId });
  }

  onSwipeClose(item, rowId, direction) {
    if (
      item.noteId === this.state.activeRow && typeof direction !== "undefined"
    ) {
      this.setState({ activeRow: null });
    }
  }

  render() {
    var swipeoutBtnsRight = [
      {
        text: 'Reboot'
      },
      {
        text: 'Shutdown'
      }
    ];
    var swipeoutBtnsLeft = [
      {
        text: 'Messages'
      }
    ];

    return (
      <FlatList
        data={this.state.data}
        renderItem={({ item }) => (
          <Swipeout right={swipeoutBtnsRight} left={swipeoutBtnsLeft} style={{height:50}}>
            <View style={{height:50}}>
              <Text style={{height:50}}>{item.noteId}</Text>
            </View>
          </Swipeout>
        )}
        keyExtractor={item => item.noteId}
        ItemSeparatorComponent={this.renderSeparator}
        onRefresh={this.handleRefresh}
        refreshing={this.state.refreshing}
        onEndReached={this.handleLoadMore}
        onEndReachedThreshold={50}
      />
    );
  }
}

export default FlatListDemo;
