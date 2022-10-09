import React from 'react'
import RoomAllocation from './components/RoomAllocation/RoomAllocation';
import "./App.scss"

const App = () => {

    const guest = 10;
    const room = 3;

    return (
        <div>
            <RoomAllocation guest={guest} room={room} onChange={result => console.log(result)}/>
        </div>

    )
}

export default App