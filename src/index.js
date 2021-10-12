import React from 'react';
import ReactDOM from 'react-dom';
import App from './app';

const secret = process.env.SECRET_STRING

ReactDOM.render(
    <App secret={secret} />, 
    document.getElementById('root')
);