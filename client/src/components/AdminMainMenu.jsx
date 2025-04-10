import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminMenu from './AdminMenu'
import Form from '../pages/Form'
import Alldepartment from '../pages/Alldepartment'
import Alldoctor from '../pages/Alldoctor'
import AllPatient from '../pages/AllPatient'
import AllFDO from '../pages/AllFDO'
import AllEDO from '../pages/AllEDO'
import Messages from '../pages/Message'

export default function AdminMainMenu() {
  return (
     <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
         <Routes>
           <Route path="/" element={<AdminMenu />} />
           <Route path="/add-user" element={<Form />} />
           <Route path="/all-department" element={<Alldepartment />} />
           <Route path="/all-doctor" element={<Alldoctor />} />
           <Route path="/all-patient" element={<AllPatient />} />
           <Route path="/all-fdo" element={<AllFDO />} />
           <Route path="/all-edo" element={<AllEDO />} />
           <Route path="/message" element={<Messages />} />

           {/* <Route path="/all-doctor" element={<AllDoctor />} />
           <Route path="/all-patient" element={<AllPatient />} />
           <Route path="/all-department" element={<AllDepartment />} /> */}
         </Routes>
       </main>
  )
}
