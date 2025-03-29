/* eslint-disable no-unused-vars */
// src/components/DashSidebar.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom';
import { signoutSuccess } from '../redux/user/userSlice';
import { Sidebar } from 'flowbite-react';
import { 
  HiHome, 
  HiUser, 
  HiCalendar, 
  HiClipboardCheck, 
  HiOutlineOfficeBuilding 
} from 'react-icons/hi';

const DashSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  // const { currentUser } = useSelector((state) => state.user);
  const [activeTab, setActiveTab] = useState('');

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get('tab');
    if (tabFromUrl) {
      setActiveTab(tabFromUrl);
    }
  }, [location.search]);

  const handleSignout = async () => {
    try {
      const res = await fetch('/api/user/signout', {
        method: 'POST',
      });
      const data = await res.json();
      if (!res.ok) {
        console.log(data.message);
      } else {
        dispatch(signoutSuccess());
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <Sidebar className="w-full md:w-64 bg-gray-50 shadow-lg">
      <Sidebar.Items>
        <Sidebar.ItemGroup>
          <Link to="/dashboard?tab=dashboard">
            <Sidebar.Item active={activeTab === 'dashboard'} icon={HiHome}>
              Dashboard
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=register">
            <Sidebar.Item active={activeTab === 'register'} icon={HiUser}>
              Patient Registration
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=appointment">
            <Sidebar.Item active={activeTab === 'appointment'} icon={HiCalendar}>
              Appointment
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=admission">
            <Sidebar.Item active={activeTab === 'admission'} icon={HiClipboardCheck}>
              Admission
            </Sidebar.Item>
          </Link>
          <Link to="/dashboard?tab=discharge">
            <Sidebar.Item active={activeTab === 'discharge'} icon={HiOutlineOfficeBuilding}>
              Discharge
            </Sidebar.Item>
          </Link>
        </Sidebar.ItemGroup>
        <Sidebar.ItemGroup>
          <Sidebar.Item className="cursor-pointer" onClick={handleSignout}>
            Sign Out
          </Sidebar.Item>
        </Sidebar.ItemGroup>
      </Sidebar.Items>
    </Sidebar>
  );
};

export default DashSidebar;
