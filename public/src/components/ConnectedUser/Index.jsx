import React, { useState, useEffect } from "react";


export default function index( {
    user,
    getCurrentUser,
    msg="Visit"
}) {
 // const navigate = useNavigate();

  return (
  
    <div className='grid-child' onClick={()=>getCurrentUser(user)}>
      <img src={user.avatarImage}/>
        <p className="name">{user.username}</p>
        <p className="headline">{user.headline}</p>
        <button>{msg}</button>
    </div>

  )
}
