import React from 'react';

export default function Box(props) {

  function handleBoxClick() {
    if (props.currentUser === "computer") return;
     
    if (!props.hasValue) {
      props.handleSelect(props.index);
    }
    else {
      props.handleUnselect(props.index);
    }
  }

  return (
      <div className="box" onClick={handleBoxClick}>
            { props.hasValue && props.icon }
      </div>
  );
}