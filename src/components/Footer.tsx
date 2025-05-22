import React from 'react';
import { Link } from 'react-router-dom';
import styles from './styles/Footer.module.scss';

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.links}>
            <Link to="/terms-of-use">
              <p className='font-[Fustat] font-light text-[12px] [leading-trim:cap-height] leading-[14px] tracking-normal text-center underline decoration-solid decoration-[0%] underline-offset-[0%] text-[#798682]'> Terms of use</p> 
            </Link>
            <span>•</span>
            <Link to="/privacy-policy" >
            <p className='font-[Fustat] font-light text-[12px] [leading-trim:cap-height] leading-[14px] tracking-normal text-center underline decoration-solid decoration-[0%] underline-offset-[0%] text-[#798682]' > Privacy Policy</p>
             
            </Link>
            
            <span>•</span>
            <Link to="/responsible-ai">
            <p className='font-[Fustat] font-light text-[12px] [leading-trim:cap-height] leading-[14px] tracking-normal text-center underline decoration-solid decoration-[0%] underline-offset-[0%] text-[#798682] '> Responsible AI</p>
            </Link>

            <span >•</span>
            <Link to="/responsible-ai">
            <p className='font-[Fustat] font-light text-[12px] [leading-trim:cap-height] leading-[14px] tracking-normal text-center underline decoration-solid decoration-[0%] underline-offset-[0%] text-[#798682]'> Ethcial  AI</p>
            </Link>

          </div>
          <div className={styles.copyright}>
            <p className='font-[Fustat] font-light text-[12px] [leading-trim:cap-height] leading-[14px] tracking-normal text-center decoration-solid decoration-[0%] underline-offset-[0%] text-[#798682] ' >
              Copyright 2025. All rights reserved. &nbsp;&nbsp; Spider AI, a Product by&nbsp;
              <span className="font-[Fustat] font-[700] text-[12px] [leading-trim:cap-height] leading-[14px] tracking-normal text-center">NeuralArc</span>
            </p>
          </div>
          <span className='text-[#798682]'>•</span>
         <p className={styles.spiderText}>Spider</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 