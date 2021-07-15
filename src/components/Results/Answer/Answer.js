// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import React from 'react';
import ReactHtmlParser from 'react-html-parser';

import './Answer.css';


export default function Answer(props) {

    const bodyStyle = {
        padding: '0.25rem',
        overflowWrap: 'normal'
    };


    return (
        <div className="card answer" >
            <div className="card-body" style={bodyStyle}>
                <p>
                    {/* {props.data[0].highlights} */}
                    {ReactHtmlParser(props.answer.highlights || "")}
                </p>
                <a href={`/details/${props.answer.key}`}>
                    <div style={bodyStyle}>
                        <h6 className="title-style">{props.document?.productName}</h6>
                    </div>
                </a>
            </div>
        </div>
    );
}
