import React from 'react'
const Footer = () => {
     const styles = `
    @import url("https://fonts.googleapis.com/css2?family=Poppins:wght@200;300;400;500;600;700;800;900&display=swap");

  

    .footer {
      position: relative;
      width: 100%;
      background: #3586ff;
      min-height: 100px;
      padding: 20px 50px;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
    }

    .social-icon,
    .menu {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px 0;
      flex-wrap: wrap;
    }

    .social-icon__item,
    .menu__item {
      list-style: none;
    }

    .social-icon__link {
      font-size: 2rem;
      color: #fff;
      margin: 0 10px;
      display: inline-block;
      transition: 0.5s;
    }
    .social-icon__link:hover {
      transform: translateY(-10px);
    }

    .menu__link {
      font-size: 1.2rem;
      color: #fff;
      margin: 0 10px;
      display: inline-block;
      transition: 0.5s;
      text-decoration: none;
      opacity: 0.75;
      font-weight: 300;
    }

    .menu__link:hover {
      opacity: 1;
    }

    .footer p {
      color: #fff;
      margin: 15px 0 10px 0;
      font-size: 1rem;
      font-weight: 300;
    }

    .wave {
      position: absolute;
      top: -100px;
      left: 0;
      width: 100%;
      height: 100px;
      background: url("https://i.ibb.co/wQZVxxk/wave.png");
      background-size: 1000px 100px;
    }

    .wave#wave1 {
      z-index: 1000;
      opacity: 1;
      bottom: 0;
      animation: animateWaves 4s linear infinite;
    }

    .wave#wave2 {
      z-index: 999;
      opacity: 0.5;
      bottom: 10px;
      animation: animate 4s linear infinite !important;
    }

    .wave#wave3 {
      z-index: 1000;
      opacity: 0.2;
      bottom: 15px;
      animation: animateWaves 3s linear infinite;
    }

    .wave#wave4 {
      z-index: 999;
      opacity: 0.7;
      bottom: 20px;
      animation: animate 3s linear infinite;
    }

    @keyframes animateWaves {
      0% {
        background-position-x: 1000px;
      }
      100% {
        background-position-x: 0px;
      }
    }

    @keyframes animate {
      0% {
        background-position-x: -1000px;
      }
      100% {
        background-position-x: 0px;
      }
    }
  `;
  return (
    <div>
          <style>{styles}</style>

      <footer className="footer">
  <div className="waves">
    <div className="wave" id="wave1" />
    <div className="wave" id="wave2" />
    <div className="wave" id="wave3" />
    <div className="wave" id="wave4" />
  </div>
  <ul className="social-icon">
    <li className="social-icon__item">
      <a className="social-icon__link" href="#">
        <ion-icon name="logo-facebook" />
      </a>
    </li>
    <li className="social-icon__item">
      <a className="social-icon__link" href="#">
        <ion-icon name="logo-twitter" />
      </a>
    </li>
    <li className="social-icon__item">
      <a className="social-icon__link" href="#">
        <ion-icon name="logo-linkedin" />
      </a>
    </li>
    <li className="social-icon__item">
      <a className="social-icon__link" href="#">
        <ion-icon name="logo-instagram" />
      </a>
    </li>
  </ul>
  <ul className="menu">
    <li className="menu__item">
      <a className="menu__link" href="#">
        Home
      </a>
    </li>
    <li className="menu__item">
      <a className="menu__link" href="#">
        About
      </a>
    </li>
    <li className="menu__item">
      <a className="menu__link" href="#">
        Services
      </a>
    </li>
    <li className="menu__item">
      <a className="menu__link" href="#">
        Team
      </a>
    </li>
    <li className="menu__item">
      <a className="menu__link" href="#">
        Contact
      </a>
    </li>
  </ul>
</footer>
     
    </div>
  )
}

export default Footer
