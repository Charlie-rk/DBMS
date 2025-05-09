/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation } from 'react-router-dom'
import { signoutSuccess } from '../redux/user/userSlice';
import { Sidebar } from 'flowbite-react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';

const DashSidebar = () => {
    const location=useLocation();
    const dispatch=useDispatch();
    const {currentUser}=useSelector((state)=>state.user);
    const [tab,setTab]=useState('');

    useEffect(()=>{
        const urlParams=new URLSearchParams(location.search);
        const tabFromUrl=urlParams.get('tab');
        if(tabFromUrl){
            setTab(tabFromUrl);
        }
    },[location.search]);

    const handleSignout=async()=>{
        try{
           const res=await fetch('/api/user/signout',{
            method:'POST',
           });
           const data=await res.json();
           if(!res.ok){
            console.log(data.message);
           }else{
            dispatch(signoutSuccess());
           }
        }catch(error){
            console.log(error.message);
        }
    }

  return (
     <Sidebar className='w-full md:w-56'>
        <Sidebar.Items>
            <Sidebar.ItemGroup className='flex flex-col gap-1'>
              <Link to='/dashboard?tab=profile'>
                <Sidebar.Item
                  active={tab==='profile'}
                  icon={HiUser}
                  label='User'
                  labelColor='dark'
                  as='div'
                ></Sidebar.Item>
                </Link>  
             

              <Sidebar.Item icon={HiArrowSmRight}
                className ="cursor-pointer"
                onClick={handleSignout}>
                Sign Out
              </Sidebar.Item>
            </Sidebar.ItemGroup>
        </Sidebar.Items>
     </Sidebar>
  )
}

export default DashSidebar