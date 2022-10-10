import React, { useState } from "react";
import GenerateChart from './GenerateChart';

// var ChartArray = [];

export default function AddGraphButton() {
    const [inputList, setInputList] = useState([]);

    const onAddBtnClick = event => {
        setInputList(inputList.concat(<GenerateChart />));
    };

    return (
        <div>
            <button onClick={onAddBtnClick} className="mainButton" type="button">Generate Data</button>
            {inputList}
        </div>
    );
}


