import React, { Fragment } from 'react';

const Secret = () => {
    const newSecret = "***REMOVED***"
    return (
        <Fragment>
            <p>secrets are snazzy</p>
            <p>like this one: {newSecret}</p>
        </Fragment>
    )
}

const App = () => (
    <div>
        Hello we have secrets:
        <p>***REMOVED***</p>
        <p>moving stuff around but still having secrets</p>
        <Secret />
    </div>
)

export default App;