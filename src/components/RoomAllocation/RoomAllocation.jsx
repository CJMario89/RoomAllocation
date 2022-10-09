import React, { useEffect, useRef, useState } from 'react'
import CustomInputNumber from '../CustomInputNumber/CustomInputNumber';
import { v4 as uuidv4 } from 'uuid';
import "./RoomAllocation.scss"

const RoomAllocation = (props) => {
    const {guest, room, onChange} = props;
    const [remainGuest, setRemainGuest] = useState(0);
    const mounted = useRef(false);
    const defaultRoomMax = 4;
    const [roomStates, setRoomStates] = useState(()=>{
        const roomStatesInit = [];
        for(let i = 0; i < props.room; i++){
            const key = uuidv4();
            const roomState = {
                "key": key,
                "adult": 1,
                "child": 0,
                "total": 1,
                "childMin": 0,
                "adultMin": 1,
                "min": 1,
                "childMax": defaultRoomMax - 1,
                "adultMax": defaultRoomMax,
                "max": defaultRoomMax,
            }
            roomStatesInit.push(roomState);
            
        }
        return roomStatesInit;
    });


    const onCustomInputNumberChange = (e, key) => {
        console.log('%c***','color:red;');
        console.log("%cEvent: onChange", 'color:red;');
        console.log('%cEvent.target.name: ' + e.target.name, 'color:blue;');
        console.log('%cEvent.target.value: ' + e.target.value, 'color:blue;');
        const index = roomStates.findIndex(roomState => roomState.key === key);
        const copyRoomStates = roomStates.slice();
        if(index !== -1){
            changeState(copyRoomStates, index, e);
        }
    }

    function changeState(copyRoomStates, index, e){
        copyRoomStates[index][e.target.name] = Number(e.target.value);

        //e.target.value(child or adult) affect total and all rooms' max
        //total
        console.log(e.target.name)
        console.log(e.target.value)
        copyRoomStates[index]["total"] = copyRoomStates[index]["child"] + copyRoomStates[index]["adult"];

        //all rooms' max
        for(let i = 0; i < copyRoomStates.length; i++){
            let roomMax = guest;
            for(let j = 0; j < copyRoomStates.length; j++){
                if(i != j){
                    roomMax -= copyRoomStates[j]["total"];
                }
            }
            if(roomMax > defaultRoomMax){
                roomMax = defaultRoomMax;
            }
            copyRoomStates[i]["max"] = roomMax;
        }

        //all rooms' max affect all rooms' adultMax and childMax
        for(let i = 0; i < copyRoomStates.length; i++){
            copyRoomStates[i]["adultMax"] = copyRoomStates[i]["max"] - copyRoomStates[i]["child"];
            copyRoomStates[i]["childMax"] = copyRoomStates[i]["max"] - copyRoomStates[i]["adult"];
        }
        
        setRoomStates(copyRoomStates)
    }



    //after setState return result to onChange
    useEffect(()=>{
        if(mounted.current === true){
            const result = roomStates.map((roomState) => {return {"adult": roomState.adult,"child": roomState.child} });
            onChange(result);
        }else if(mounted.current === false){
            mounted.current = true;
        }

        
        //set remain guest
        setRemainGuest(() => roomStates.reduce((previous, current) => previous - current.total, guest));

    }, [roomStates]);


    const onBlur = (e) => {
        console.log('%c***','color:red;');
        console.log("%cEvent: onBlur", 'color:red;');
        console.log('%cEvent.target.name: ' + e.target.name, 'color:blue;');
        console.log('%cEvent.target.value: ' + e.target.value, 'color:blue;');
    }




    const rooms = [];
    for(let i = 0; i < room; i++){
        rooms.push(
            <div key={roomStates[i].key} className="roomStatistics">
                <div className="roomStatisticsTotal">
                    房間：<span>{roomStates[i].total}</span>人
                </div>
                <div className="roomStatisticsAdult">
                    <div>大人</div>
                    <CustomInputNumber min={roomStates[i].adultMin} max={roomStates[i].adultMax} step={1} name={"adult"} value={roomStates[i].adult} disabled={false} onChange={onCustomInputNumberChange} onBlur={onBlur} dataKey={roomStates[i].key} />
                </div>
                <div className="roomStatisticsChild">
                    <div className=''>小孩</div>
                    <CustomInputNumber min={roomStates[i].childMin} max={roomStates[i].childMax} step={1} name={"child"} value={roomStates[i].child} disabled={false} onChange={onCustomInputNumberChange} onBlur={onBlur} dataKey={roomStates[i].key} />
                </div>
            </div>
        )
    }
    

    return (
        <>
            <div className='totalRoomContainer'>
                <div className='totalRoomStatistics'>
                    住客人數：<span>{ guest }</span> 人 / {room} 房
                </div>
                <div className='remainStatistics'>
                    尚未分配人數：<span>{remainGuest}</span> 人
                </div>
                {rooms}
            </div>
        </>
    )
}

export default RoomAllocation