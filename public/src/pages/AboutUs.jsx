import React from 'react';

const About = () => {
  return (
    <>
      <style>
        {`
          :root {
            --rotate: 132deg;
            --card-height: 65vh;
            --card-width: calc(var(--card-height) / 1.5);
          }

          body {
            min-height: 100vh;
            background: #212534;
            display: flex;
            align-items: center;
            flex-direction: column;
            padding-top: 2rem;
            padding-bottom: 2rem;
            box-sizing: border-box;
          }
          .card-container {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 1rem;
          }
          .card {
            background: #191c29;
            width: var(--card-width);
            height: var(--card-height);
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
          }

          .card:hover {
            color: rgb(88 199 250 / 100%);
            transition: color 1s;
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
              #4e00c2
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
        `}
      </style>

      <div className="flex items-center justify-around space-x-4" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <div className="card">
          <div className="card-info">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT1SPQMvARWTqmyuARzk3vTwcVj7lLmxqdadQ&usqp=CAU"
              alt="Sample Person"
              style={{ width: '100%', height: '100%', borderRadius: '6px' }}
            />
            <h1>Raman Prajapati</h1>
            <p>Full Stack Developer</p>
          </div>
        </div>
        
        <div className="card">
          <div className="card-info">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSQI2BrJdpBvQR7YkfQCs9f_Igzplk6FOaeKA&usqp=CAU"
              alt="Sample Person"
              style={{ width: '100%', height: '100%', borderRadius: '6px' }}
            />
            <h1>Vivek Chaudhary</h1>
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
            <h1>Priyanshu Singh</h1>
            <p>Full Stack Developer</p>
          </div>
        </div>
      </div>
     
       
    </>
  );
};

export default About;
