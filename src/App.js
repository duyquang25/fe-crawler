import React, { useState, useEffect, useRef } from 'react';
import socketIOClient from 'socket.io-client';
import axios from 'axios';
import './App.css';

const host = 'http://localhost:9000';
const endPointApi = 'http://localhost:9000/api/v1/profit-log';

const SOCKET_EVENT = {
  BID_BTCUSDT: 'bid-btcusdt',
  ASK_BTCUSDT: 'ask-btcusdt',
  BID_ETHBTC: 'bid-ethbtc',
  ASK_ETHBTC: 'ask-ethbtc',
  BID_ETHUSDT: 'bid-ethusdt',
  ASK_ETHUSDT: 'ask-ethusdt',
  PROFIT_RATE: 'profit-rate',
};

function App() {
  const [bestBidBTCUSDT, setbestBidBTCUSDT] = useState('');
  const [bestAskBTCUSDT, setbestAskBTCUSDT] = useState('');
  const [bestBidETHBTC, setbestBidETHBTC] = useState('');
  const [bestAskETHBTC, setbestAskETHBTC] = useState('');
  const [bestBidETHUSDT, setbestBidETHUSDT] = useState('');
  const [bestAskETHUSDT, setbestAskETHUSDT] = useState('');
  const [profitRate, setprofitRate] = useState([]);
  const [data, setData] = useState('');

  const socketRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(endPointApi);
      console.log('...', result.data.data);
      setData(result.data.data);
      setprofitRate(result.data.data.logs);
    };

    fetchData();
  }, []);

  useEffect(() => {
    socketRef.current = socketIOClient.connect(host);

    socketRef.current.on(SOCKET_EVENT.BID_BTCUSDT, (data) => {
      setbestBidBTCUSDT(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_BTCUSDT, (data) => {
      setbestAskBTCUSDT(data);
    });

    socketRef.current.on(SOCKET_EVENT.BID_ETHBTC, (data) => {
      setbestBidETHBTC(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_ETHBTC, (data) => {
      setbestAskETHBTC(data);
    });

    socketRef.current.on(SOCKET_EVENT.BID_ETHUSDT, (data) => {
      setbestBidETHUSDT(data);
    });
    socketRef.current.on(SOCKET_EVENT.ASK_ETHUSDT, (data) => {
      setbestAskETHUSDT(data);
    });

    socketRef.current.on(SOCKET_EVENT.PROFIT_RATE, (data) => {
      console.log(data);
      setprofitRate((prevProfitRate) => {
        const newProfitRate = [data, ...prevProfitRate];
        return newProfitRate.slice(0, 10); // Giới hạn mảng mới chỉ có 10 phần tử
      });
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  return (
    <div class="box-chat">
      <div class="send-box">
        <div> bestBidBTCUSDT:: {bestBidBTCUSDT ? bestBidBTCUSDT : data.rateBidBTCUSDT}</div>
        <br />
        <br />
        <div> bestAskBTCUSDT:: {bestAskBTCUSDT ? bestAskBTCUSDT : data.rateAskETHBTC}</div>
        <br />
        <br />
        <div> bestBidETHBTC:: {bestBidETHBTC ? bestBidETHBTC : data.rateBidETHBTC}</div>
        <br />
        <br />
        <div> bestAskETHBTC:: {bestAskETHBTC ? bestAskETHBTC : data.rateAskETHBTC} </div>
        <br />
        <br />
        <div> bestBidETHUSDT:: {bestBidETHUSDT ? bestBidETHUSDT : data.rateBidETHUSDT}</div>
        <br />
        <br />
        <div> bestAskETHUSDT:: {bestAskETHUSDT ? bestAskETHUSDT : data.rateAskETHUSDT}</div>
        <br />
        <br />
        <h1>Detect triangle arbitrage opportunities - Logs</h1>
        <dir>
          {profitRate?.map((item, index) => (
            <div key={index}>{item}</div>
          ))}
        </dir>

        <ul>
          {/* {data.logs?.map((item, index) => (
            <li key={index}>{item}</li>
          ))} */}
        </ul>
      </div>
    </div>
    // <div class="triangle">
    //   <div class="usdt">USDT</div>
    //   <div class="btc">BTC</div>
    //   <div class="eth">ETH</div>
    //   <div class="currency1">
    //     <span>$1000</span>
    //   </div>
    //   <div class="currency2">
    //     <span>$2000</span>
    //   </div>
    //   <div class="vector1"></div>
    //   <div class="vector2"></div>
    //   <div class="vector3"></div>
    //   <div class="vector4"></div>
    //   <div class="vector5"></div>
    //   <div class="vector6"></div>
    // </div>
  );
}

export default App;
