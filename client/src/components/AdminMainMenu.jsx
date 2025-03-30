import React from 'react'
import { Route, Routes } from 'react-router-dom'
import AdminMenu from './AdminMenu'
import Form from '../pages/Form'

export default function AdminMainMenu() {
  return (
     <main className="flex-1 p-6 bg-gray-50 dark:bg-gray-900 overflow-y-auto">
         <Routes>
           <Route path="/" element={<AdminMenu />} />
           <Route path="/add-user" element={<Form />} />
           {/* <Route path="/all-doctor" element={<AllDoctor />} />
           <Route path="/all-patient" element={<AllPatient />} />
           <Route path="/all-department" element={<AllDepartment />} /> */}
         </Routes>
       </main>
  )
}
