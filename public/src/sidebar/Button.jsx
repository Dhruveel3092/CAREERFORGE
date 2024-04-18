import React from 'react'
import '../pages/JobStyle.css';
const Button = ({onClickHandler, value, title }) => {
  return (
   
      <button onClick={onClickHandler} value={value} className="sidebarButton">
         {title}
      </button>
  )
}

export default Button
