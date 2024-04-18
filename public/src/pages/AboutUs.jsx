import React from 'react';
import { Form } from 'react-router-dom';
import styled from "styled-components";
const AboutUs = () => {
  return (
    <>
        <FormContainer>
      <div className="main-box" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="card">
          <div className="card-info">
            <img
             src="https://img.freepik.com/premium-photo/cartoon-character-baby-generated-ai_644690-8240.jpg?w=360"
             
              alt="Sample Person"
              style={{ width: '100%', height: '100%', borderRadius: '6px' }}
            />
            <h1>Om Vishnu</h1>
            <p>Full Stack Developer</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-info">
            <img
               src="https://miro.medium.com/v2/resize:fit:1400/format:webp/1*5nzLqaFkEzDRA2otBEVqaQ.png"
  
              alt="Sample Person"
              style={{ width: '100%', height: '100%', borderRadius: '6px' }}
            />
            <h1>Morker Krishna</h1>
            <p>Full Stack Developer</p>
          </div>
        </div>
        <div className="card">
          <div className="card-info">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR2mUZ5yEavsXhRNe1ZKGWdpS6xsX3rCYi-bA&usqp=CAU"
              alt="Sample Person"
              style={{ width: '100%', height: '100%', borderRadius: '6px' }}
            />
            <h1>Dhruveel</h1>
            <p>Full Stack Developer</p>
          </div>
        </div>
      </div>
      </FormContainer>
       
    </>
  );
};

export default AboutUs;


const FormContainer = styled.button`
 padding:0;
margin: 0;
width:100%;
height: 80vh;  
background-color: #35374B;

.main-box{
  height:70%;
width:100%;
background-color: #35374B;
display: flex; 
position: relative; 
justify-content: space-around; 
align-items: center; 
margin-bottom:5%;
}


.card {
  background: #191c29;
  width: var(--card-width);
  height: var(--card-height);
  height: 100%; 
 
  padding: 3px;
  position: relative;
  border-radius: 6px;
  justify-content: center;
  align-items: center;
  text-align: center;
  display: flex;
  font-size: 1.5em;
  color: rgb(88 199 250 / 0%);
  cursor: pointer;
  font-family: cursive;
  &:hover {
    color: rgb(88 199 250 / 100%);
    transition: color 1s;
  }
}
.card-info{
  width:100%;
  height:100%;
}
.card:hover:before, .card:hover:after {
  animation: none;
  opacity: 0;
}

.card::before {
  content: "";
  width: 104%;
  height: 102%;
  border-radius: 8px;
  background-image: linear-gradient(
    var(--rotate),
    #5ddcff,
    #3c67e3 43%,
    #4e00c2
  );
  position: absolute;
  z-index: -1;
  top: -1%;
  left: -2%;
  animation: spin 2.5s linear infinite;
}

.card::after {
  position: absolute;
  content: "";
  top: calc(var(--card-height) / 6);
  left: 0;
  right: 0;
  z-index: -1;
  height: 100%;
  width: 100%;
  margin: 0 auto;
  transform: scale(0.8);
  filter: blur(calc(var(--card-height) / 6));
  background-image: linear-gradient(
    var(--rotate),
    #5ddcff,
    #3c67e3 43%,
    #4e00c2,
  );
  opacity: 1;
  transition: opacity 0.5s;
  animation: spin 2.5s linear infinite;
}

@keyframes spin {
  0% {
    --rotate: 0deg;
  }
  100% {
    --rotate: 360deg;
  }
}

a {
  color: #212534;
  text-decoration: none;
  font-family: sans-serif;
  font-weight: bold;
  margin-top: 2rem;
}
`;
