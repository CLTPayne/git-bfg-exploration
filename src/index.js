import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const secret = "COOL_SECRET"

ReactDOM.render(
    <App secret={secret} />, 
    document.getElementById('root')
);