import React, { useEffect, useRef } from 'react'
import "./CustomInputNumber.scss"

const CustomInputNumber = (props) => {
    const { min, max, step, name, value, disabled, onChange, onBlur, dataKey} = props;
    const input = useRef(null);
    const preValue =  useRef(value);
    const mouseDownTimeout = useRef(null);
    const mouseDownFlag = useRef(0);
    const blurSource = useRef(""); //user blur or trigger by code(click button increase/decrease)


    //change by user input
    const inputIntegerFilter = (e) => {
        if(/^\d+$/.test(e.target.value) && Number(e.target.value) >= min && Number(e.target.value) <= max){
            if(preValue.current !== Number(e.target.value)){
                preValue.current = Number(e.target.value);
                e.target.value = Number(e.target.value);
                onChange(e, dataKey);
            }else{
                preValue.current = Number(e.target.value);
                e.target.value = Number(e.target.value);
            }
        }else if(e.target.value === ""){
            //backspace
            e.target.value = min;
            if(preValue.current != min){
                preValue.current = min;
                onChange(e, dataKey);
            }
        }else{
            e.target.value = preValue.current;
        }
    }
    
    const onInputChange = (e) => {
        inputIntegerFilter(e);
    }

    const onInputClick = ()=>{
        blurSource.current = "blurByInput";
    }


    //increase/decrease by button click
    const onButtonClick = (e) => {
        if(e.target.className === "customMinusButton"){
            decrement();
        }else if(e.target.className === "customPlusButton"){
            increment();
        }
    }

    const decrement = () => {
        const valueInNumber = Number(preValue.current);
        if(valueInNumber - step >= min && valueInNumber - step <= max){
            input.current.focus();
            input.current.value = valueInNumber - step;
            preValue.current = input.current.value;
            blurSource.current = "blurByButton";
            input.current.blur();
        }
    }

    const increment = () => {
        const valueInNumber = Number(preValue.current);
        if(valueInNumber + step >= min && valueInNumber + step <= max){
            input.current.focus();
            input.current.value = valueInNumber + step;
            preValue.current = input.current.value;
            blurSource.current = "blurByButton";
            input.current.blur();
        }
    }

    
    //increase/decrease by button mouseDown
    const onButtonMouseDown = (e) => {
        mouseDownTimeout.current = setTimeout(
            ()=>{
                mouseDownFlag.current = 1;
                if(e.target.className === "customMinusButton"){
                    decrementByMouseDown();
                }else if(e.target.className === "customPlusButton"){
                    incrementByMouseDown();
                }
            }
        , 800);
    }

    const onMouseUp = () => {
        clearTimeout(mouseDownTimeout.current);
        mouseDownFlag.current = 0;
    }

    const decrementByMouseDown = () => {
        if(mouseDownFlag.current === 1){
            decrement();
            setTimeout(decrementByMouseDown, 100);
        }
    }

    const incrementByMouseDown = () => {
        if(mouseDownFlag.current === 1){
            increment();
            setTimeout(incrementByMouseDown, 100);
        }
    }


    //user blur or trigger by code(click button increase/decrease)
    const onInputBlur = (e) => {
        if(blurSource.current === "blurByButton"){
            onChange(e, dataKey);
        }else if(blurSource.current === "blurByInput"){
            onBlur(e, dataKey);
        }
    }


    //clear mouseDown timeout
    useEffect(()=>{
        window.addEventListener("mouseup", onMouseUp);
        window.addEventListener("touchend", onMouseUp);
    }, []);


    return (
        <>
            <div className='customInputBlock'>
                <button className="customMinusButton" onClick={onButtonClick} onMouseDown={onButtonMouseDown} onTouchStart={onButtonMouseDown} disabled={((disabled === true || preValue.current<= min) ? "disabled" : false)}>−</button>
                <input className='customInput' ref={input} name={name} type="text" defaultValue={preValue.current} onChange={onInputChange} onBlur={onInputBlur} onClick={onInputClick} disabled={(disabled === true ? "disabled" : false)}></input>
                <button className="customPlusButton" onClick={onButtonClick} onMouseDown={onButtonMouseDown} onTouchStart={onButtonMouseDown} disabled={((disabled === true || preValue.current >= max) ? "disabled" : false)}>＋</button>
            </div>
        </>
    )
}

export default CustomInputNumber