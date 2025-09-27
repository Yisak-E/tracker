// Dashboard.jsx
import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import Header from "./util/Header.jsx";
import LogMeal from "./util/LogMeal.jsx";
import Tracker from "./util/Track.jsx";
import Report from "./util/Report.jsx";

function Dashboard({ user }) {
  const navigate = useNavigate();
  const[show, setShow] = useState({
    logMeal: true,
    tracker: false,
    reports: false,
  });

  const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return screenSize;
};


  return (
   <>
    <Header show={show} setShow={setShow} />
  <div className="grid lg:grid-cols-12 lg:gap-4 bg-gradient-to-br from-green-100 to-white h-screen ">
    <div className="lg:col-span-4 bg-amber-100 p-4 grid grid-rows-3 ">
      <div className="bg-gradient-to-br from-green-100 to-green-400 rounded-t-3xl shadow-lg overflow-hidden ">
        <h3 className={'lg:text-3xl font-bold font-serif text-left p-4 italic'}>Log meal</h3>

      </div>
      <div className="bg-gradient-to-br from-yellow-100 to-yellow-400  shadow-lg overflow-hidden ">
        <h3 className={'lg:text-3xl font-bold font-serif text-left p-4 italic'}>Daily Track</h3>

      </div>
      <div className="bg-gradient-to-br from-red-100 to-red-400 rounded-b-3xl shadow-lg overflow-hidden ">
        <h3 className={'lg:text-3xl font-bold font-serif text-left p-4 italic'}>Reports</h3>


      </div>

    </div>

    <div className="lg:col-span-8 bg-blue-400 p-4">
      {show.logMeal &&(
          <LogMeal user={user} />
      )
      }

      {
        show.reports && (
             <Report user={user} />
          )
      }

      {
        show.tracker && (
            <Tracker user={user} />
          )
      }
    </div>
  </div>

   </>
  );
}

export default Dashboard;