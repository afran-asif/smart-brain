import React from 'react';
import Tilt from 'react-parallax-tilt';
import brain from './brain.png'; // তোমার কাছে লোগো ইমেজ থাকলে সেটি এখানে দিও
import './Logo.css';

const Logo = () => {
    return (
        <div className='ma4 mt0'>
            <Tilt className="Tilt br2 shadow-2" style={{ height: '150px', width: '150px', backgroundColor: 'linear-gradient(89deg, #FF5EDF 0%, #04C8DE 100%)' }}>
                <div className='pa3'>
                    <img style={{paddingTop: '5px'}} alt='logo' src={brain}/>
                </div>
            </Tilt>
        </div>
    );
}

export default Logo;