import React, { useState } from 'react';
import '../styles.css';
import type { Category } from '@/services/category-service';




const AddCategories: React.FC = () => {
  // State for categories and form inputs
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [selectedParentId, setSelectedParentId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Generate a unique ID (simple for demo, replace with UUID in production)
  const generateId = () => Math.random().toString(36).substring(2, 10);

  // Handle form submission to add a category
  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    const newCategory: Category = {
      id: generateId(),
      name: categoryName.trim(),
      parentId: selectedParentId || undefined,
      subcategories: [],
    };

    if (!categoryName.trim()) {
    setError('Category name is required');
    return;
  }

  try {
    const response = await axios.post(`${baseUrl}/api/booking/addcategory`, {
      name: categoryName,
      parentId: selectedParentId || null,
    });
    setCategories((prev) => [...prev, response.data]);
    setCategoryName('');
    setSelectedParentId(null);
    setError(null);
  } catch (error) {
    console.error('Error adding category:', error);
    setError('Failed to add category');
  }

    if (!selectedParentId) {
      // Add top-level category
      setCategories([...categories, newCategory]);
    } else {
      // Add subcategory or sub-subcategory
      setCategories((prev) =>
        prev.map((cat) => {
          if (cat.id === selectedParentId) {
            return { ...cat, subcategories: [...(cat.subcategories || []), newCategory] };
          }
          if (cat.subcategories) {
            return {
              ...cat,
              subcategories: cat.subcategories.map((sub) =>
                sub.id === selectedParentId
                  ? { ...sub, subcategories: [...(sub.subcategories || []), newCategory] }
                  : sub
              ),
            };
          }
          return cat;
        })
      );
    }

    // Reset form
    setCategoryName('');
    setSelectedParentId(null);
    setError(null);
  };

  // Render category hierarchy
  const renderCategories = (cats: Category[], level: number = 0) => (
    <ul className={`list-group ${level > 0 ? 'ms-4' : ''}`}>
      {cats.map((cat) => (
        <li key={cat.id} className="list-group-item">
          {cat.name}
          {cat.subcategories && cat.subcategories.length > 0 && renderCategories(cat.subcategories, level + 1)}
        </li>
      ))}
    </ul>
  );

  // Get options for parent category dropdown
  const getParentOptions = (cats: Category[]): { id: string; name: string }[] => {
    let options: { id: string; name: string }[] = [];
    cats.forEach((cat) => {
      options.push({ id: cat.id, name: cat.name });
      if (cat.subcategories) {
        options = [...options, ...getParentOptions(cat.subcategories)];
      }
    });
    return options;
  };

 
  
  


  return (
    <div>
      {/* Sidebar */}
      {/* <div className="sidebar bg-dark text-white p-3">
        <h4 className="mb-4">Admin Dashboard</h4>
        <ul className="nav flex-column">
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Dashboard</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Users</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Bookings</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white active" href="#">Categories</a>
          </li>
          <li className="nav-item">
            <a className="nav-link text-white" href="#">Settings</a>
          </li>
        </ul>
      </div> */}

      {/* Main Content */}
      <div className="flex-grow-1">
        {/* Header */}
        <nav className="navbar navbar-expand-lg navbar-light bg-light border-bottom">
          <div className="container-fluid">
            <h5 className="navbar-brand">Add Categories</h5>
            <div className="ms-auto">
              <span className="navbar-text">Welcome, Admin</span>
            </div>
          </div>
        </nav>

        {/* Form and Category List */}
        <div className="main-content p-4">
          <h2>Manage Categories</h2>
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <h5 className="card-title">Add New Category</h5>
              <form onSubmit={handleAddCategory}>
                <div className="mb-3">
                  <label htmlFor="categoryName" className="form-label">Category Name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="categoryName"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    placeholder="Enter category name"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="parentCategory" className="form-label">Parent Category (Optional)</label>
                  <select
                    className="form-select"
                    id="parentCategory"
                    value={selectedParentId || ''}
                    onChange={(e) => setSelectedParentId(e.target.value || null)}
                  >
                    <option value="">None (Top-Level Category)</option>
                    {getParentOptions(categories).map((option) => (
                      <option key={option.id} value={option.id}>{option.name}</option>
                    ))}
                  </select>
                </div>
                {error && <div className="alert alert-danger">{error}</div>}
                <button type="submit" className="btn btn-primary">Add Category</button>
              </form>
            </div>
          </div>

          <h3>Category Hierarchy</h3>
          {categories.length > 0 ? (
            renderCategories(categories)
          ) : (
            <p>No categories added yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddCategories;