import React from 'react';
import axios from 'axios';
import {Table, Input, Button, Icon, Menu, Dropdown} from 'antd';
import Highlighter from 'react-highlight-words';
import {Container, Nav, Navbar} from 'react-bootstrap';
import Modal from './modal';

class AssetList extends React.Component{

  constructor(props){
    super(props);
    this.state = {
      loading: false,
      assets: [],
      high: {},
      searchText: '',
      modal: false,
      orderbook: 'All orderbooks'
    }
    this.exchanges = ['binance', 'poloniex', 'bitfinex', 'huobi', 'bittrex', 'hitbtc', 'okex', 'kraken', 'kucoin', 'bitmex'];
  }

  componentDidMount(){
    this.fetchData();
  }

  fetchData = async() => {
    this.toggleLoader();
    try{
      let high = {};
      const {data} = await axios('https://arbitrack.com/data');
      const assets = JSON.parse(data[0]);
      if(data[1]){
        high = JSON.parse(data[1]);
      }
      this.setState(({
        assets,
        high
      }));
    }
    catch(e){
      console.log(e);
    }
    this.toggleLoader();
  }

  toggleLoader = () => {
    this.setState((prevState) => ({
      loading: !prevState.loading
    }));
  }

  changeModalState = () => {
    this.setState((prevState) => ({
      modal: !prevState.modal
    }));
  }

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes(value.toLowerCase()),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({ searchText: '' });
  };

  renderContainer = () => {
    const {symbol, spread, high, low, high_exchange, low_exchange} = this.state.high;
      return(
        <div id="box">
          <div id="left_container">
            <span id="container_header">Symbol</span>
            <span id="val">{symbol}</span>
          </div>
          <div id="left_container">
            <span id="container_header">24hHigh</span>
            <span id="val">{Math.round(spread * 100) / 100}%</span>
          </div>
           <div id="container">
            <img id="image" src={require(`../logo/${high_exchange}.jpeg`)} alt="" />
            <div id="sub_container">
              <span id="container_header">{high_exchange}</span>
              <span id="val">{high}</span>
            </div>
          </div>
           <div id="container">
            <img id="image" src={require(`../logo/${low_exchange}.jpeg`)} alt="" />
            <div id="sub_container">
              <span id="container_header">{low_exchange}</span>
              <span id="val">{low}</span>
            </div>
          </div>
        </div>
      );
    }

  changeOrderbookChoice = ({key}) => {
    this.setState(({
      orderbook: key
    }));
  }

  switch = (key) => {
    switch(key){
      case 'All orderbooks':
        return ['/BTC', '/ETH', '/USD', '/USDT'];
      case 'BTC orderbook':
        return ['/BTC'];
      case 'ETH orderbook':
        return ['/ETH'];
      case 'USD orderbook':
        return ['/USD', '/USDT'];
      default:
        return ['/BTC', '/ETH', '/USD', '/USDT'];   
    }
  }

  render(){

    const columns = [
      {
        title: <span id="table_header">Symbol</span>,
        dataIndex: 'symbol',
        key: 'symbol',
        className: 'table_column',
        render: (text, row, index) => {
          return(
            <span id="table_symbol">{text}</span>
          )
        },
        filteredValue: this.switch(this.state.orderbook),
        ...this.getColumnSearchProps('symbol')
      },
      {
        title: <span id="table_header">Spread</span>,
        dataIndex: 'spread',
        key: 'spread',
        className: 'table_column',
        sorter: (a, b) => a.spread - b.spread,
        defaultSortOrder: 'descend',
        render: (text, row, index) => {
          return(
            <span id="table_spread">{Math.round(text * 100) / 100}%</span>
          )
        },
      },
      {
        title: <span id="table_header">High Exchange</span>,
        dataIndex: 'high_exchange',
        key: 'high_exchange',
        className: 'table_column',
        render: (text, row, index) => {
          return(
            <span id="table_high">{text}</span>
          )
        },
      },
      {
        title: <span id="table_header">Low Exchange</span>,
        dataIndex: 'low_exchange',
        key: 'low_exchange',
        className: 'table_column',
        render: (text, row, index) => {
          return(
            <span id="table_low">{text}</span>
          )
        },
      },
      {
        title: <span id="table_header">High</span>,
        dataIndex: 'high',
        key: 'high',
        className: 'table_column',
        render: (text, row, index) => {
          return(
            <span id="table_price">{text}</span>
          )
        },
      },
      {
        title: <span id="table_header">Low</span>,
        dataIndex: 'low',
        key: 'low',
        className: 'table_column',
        render: (text, row, index) => {
          return(
            <span id="table_price">{text}</span>
          )
        },
      }
    ];

    const expandedRowRender = (record, index) => {
      const columns = [
        { title: 'Type', dataIndex: 'type', key: 'type' },
        { title: 'Binance', dataIndex: 'binance', key: 'binance' },
        { title: 'Poloniex', dataIndex: 'poloniex', key: 'poloniex' },
        { title: 'Bitfinex', dataIndex: 'bitfinex', key: 'bitfinex' },
        { title: 'Huobi', dataIndex: 'huobi', key: 'huobi' },
        { title: 'Bittrex', dataIndex: 'bittrex', key: 'bittrex' },
        { title: 'Hitbtc', dataIndex: 'hitbtc', key: 'hitbtc' },
        { title: 'Okex', dataIndex: 'okex', key: 'okex' },
        { title: 'Kraken', dataIndex: 'kraken', key: 'kraken' },
        { title: 'Kucoin', dataIndex: 'kucoin', key: 'kucoin' },
        { title: 'Bitmex', dataIndex: 'bitmex', key: 'bitmex' }
      ];

      const asks = record.asks.reduce((obj, ask, index) => {
        obj['key'] = index;
        obj['type'] = 'Asks';
        if(ask === null){
          obj[this.exchanges[index]] = '-';
        }
        else{
          obj[this.exchanges[index]] = ask;
        }
        return obj;
      }, {});

      const bids = record.bids.reduce((obj, bid, index) => {
        obj['key'] = index;
        obj['type'] = 'Bids';
        if(bid === null){
          obj[this.exchanges[index]] = '-';
        }
        else{
          obj[this.exchanges[index]] = bid;
        }
        return obj;
      }, {});

    return <Table columns={columns} dataSource={[asks, bids]} pagination={false} />;
  };

    const menu = (
      <Menu onClick={this.changeOrderbookChoice}>
        <Menu.Item key="All orderbooks">All orderbooks</Menu.Item>
        <Menu.Item key="BTC orderbook">BTC orderbook</Menu.Item>
        <Menu.Item key="ETH orderbook">ETH orderbook</Menu.Item>
        <Menu.Item key="USD orderbook">USD orderbook</Menu.Item>
      </Menu>
    );

    return (
      <div id="assetListContainer">
        <div id="row" className="sticky-top">
          <Container>
            <Navbar id="navbar" className="navbar-dark" expand="lg">
              <Navbar.Brand href="#home" id="logo_container">
                <img id="logo" src={require('../logo/graph.png')} alt="" />
                <span id="name">Arbitrack</span>
              </Navbar.Brand>
              <Navbar.Toggle aria-controls="basic-navbar-nav" />
              <Navbar.Collapse id="navbar_container">
                <Nav id="navbar_items">
                  <Nav.Link href="#"><span onClick={this.changeModalState}>info</span></Nav.Link>
                  <Nav.Link href="#main"><span>home</span></Nav.Link>
                  <Nav.Link href="https://dapper.network" target="_blank"><span>Dapper</span></Nav.Link>
                </Nav>
              </Navbar.Collapse>
            </Navbar>
          </Container>
        </div>  
        <div id="main" className="container_top">
          <span id="header">Arbitrage Bot</span>
          <p id="description">Arbitrage opportunities in 10+ exchanges.</p>
          {this.state.high.symbol && this.renderContainer()}
        </div>
        <div id="container_bottom">
          <div id="table_container">
            <div id="table_menu_container">
              <Dropdown overlay={menu}>
                <Button id="dropdown">
                  <span>{this.state.orderbook}</span>
                  <Icon id="dropdown_icon" type="down" />
                </Button>
              </Dropdown>
              <Button id="refresh_button" type="primary" icon="reload" loading={this.state.loading} onClick={this.fetchData}>
                Refresh
              </Button>
            </div>
            <Table loading={this.state.loading} dataSource={this.state.assets} columns={columns}
            expandedRowRender={expandedRowRender} pagination={false} />
          </div>
        </div>
        <Modal isOpen={this.state.modal} closeModal={this.changeModalState} />
      </div>
    );
  }

}

export default AssetList;
