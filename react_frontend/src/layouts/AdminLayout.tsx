//import React from 'react';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div>
      <h1>Hello This is Admin Layout</h1>
      <Outlet /> {/* This will render AddQuestionPage when at /admin/add-question */}
    </div>
  );
};

export default AdminLayout;