// import { NavLink } from 'react-router-dom';
import '../Style/Header.scss';
import logo from '../../assets/logo.png';
import React, { useRef} from 'react';
import { Button } from 'primereact/button';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Divider } from 'primereact/divider';
import 'primeicons/primeicons.css';
             

const Header = () => {
    const op = useRef(null);
return (
    <nav className='flex justify-between'>
        <div className="flex flex-row items-center">
            <img src={logo} alt="logo" className="logo" />
            <h2 className='text-white font-semibold text-2xl'>Metro Tracker</h2>
        </div>
        <div className="flex justify-between gap-5 flex-row items-center"> 
            <Button id="sign-in">Sign In</Button>
            <div className='changeLng'>
                <button className='option'id="vi">VN</button>
                <button className='option active'id="en">EN</button>
            </div>
            <div className="spacer"></div>
            <div className="card flex justify-content-center">
                <Button id="region" type="button" icon="pi pi-map-marker" label="Ho Chi Minh City" onClick={(e) => op.current.toggle(e)} />
                <OverlayPanel className="bg-slate-50 mt-2 p-5 rounded" ref={op}>
                   <p id="region-title">Select region</p>
                   <Divider className='bg-slate-300 my-2 h-px'/>
                   <p>Select the region you want to find your bus route</p>
                </OverlayPanel>
            </div>
        </div>
    </nav>
  );
};

export default Header;