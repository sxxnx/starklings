import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { StarknetProvider, getInstalledInjectedConnectors } from '@starknet-react/core'
import { wrapper } from './store/store'
import { Provider } from 'react-redux'


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const connectors = getInstalledInjectedConnectors()

root.render(
  <React.StrictMode>
    <Provider store={wrapper}>
      <StarknetProvider connectors={connectors}>
        <App />
      </StarknetProvider>
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
