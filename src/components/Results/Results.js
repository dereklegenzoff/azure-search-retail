import React from 'react';
import Result from './Result/Result';
import Answer from './Answer/Answer';

import "./Results.css";

export default function Results(props) {

  let results = props.documents.map((result, index) => {
    return <Result 
        key={index} 
        document={result.document}
      />;
  });

  let beginDocNumber = Math.min(props.skip + 1, props.count);
  let endDocNumber = Math.min(props.skip + props.top, props.count);

  var answer;
  if (props.answers && props.answers.length > 0 && beginDocNumber === 1) {
    console.log("answer found");
    console.log(props.answers);
    const answerDocument = props.documents.find(document => document.document.productID === props.answers[0].key);
    answer = <Answer answer={props.answers[0]} document={answerDocument?.document}></Answer>;
  } else {
    answer = null;
  }

  return (
    <div>
      <p className="results-info">Showing {beginDocNumber}-{endDocNumber} of {props.count.toLocaleString()} results</p>
      <div className="answers">
        {answer}
      </div>
      <div className="row row-cols-md-5 results">
        {results}
      </div>
    </div>
  );
};
