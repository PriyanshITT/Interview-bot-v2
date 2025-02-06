import React, { useState } from 'react';
import { saveAs } from 'file-saver';
import './TutorForm.css'; // Importing the CSS for styling

const TutorForm = ({ tutorsData, setTutorsData }) => {
  const [tutorData, setTutorData] = useState({
    id: 8,
    name: '',
    languages: [],
    skills: [],
    experience: '',
    profilePic: '',
    price: '',
    rating: 0,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTutorData({ ...tutorData, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    const { value } = e.target;
    const updatedArray = value.split(',').map(item => item.trim());
    setTutorData({ ...tutorData, [field]: updatedArray });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTutorData({ ...tutorData, profilePic: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image (JPG or PNG)');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const updatedTutorsData = [...tutorsData, tutorData];
    setTutorsData(updatedTutorsData);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden flex justify-center items-center"> {/* Flexbox for centering */}
      <div className="bg-white p-8  mb-4  mt-4 rounded-lg shadow-md w-full max-w-md animate-slide-in-from-bottom"> {/* Added background, padding, rounded corners, shadow, width, and animation */}
        <form onSubmit={handleSubmit} className="tutor-form "> {/* Added spacing between form elements */}
          <h2 className="text-2xl font-bold mb-4 text-center">Tutor Registration Form</h2> {/* Styled the heading */}

          <div className="form-group">
            <label className="block text-gray-700 font-bold mb-2">Name:</label> {/* Added label styling */}
            <input type="text" name="name" value={tutorData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" /> {/* Added input styling */}
          </div>

          {/* ... (Similar styling and layout improvements for other form groups) */}
          <div className="form-group">
            <label className="block text-gray-700 font-bold mb-2">Languages (comma separated):</label>
            <input
              type="text"
              value={tutorData.languages.join(', ')}
              onChange={(e) => handleArrayChange(e, 'languages')}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="form-group">
            <label className="block text-gray-700 font-bold mb-2">Skills (comma separated):</label>
            <input
              type="text"
              value={tutorData.skills.join(', ')}
              onChange={(e) => handleArrayChange(e, 'skills')}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div>

          <div className="form-group">
            <label className="block text-gray-700 font-bold mb-2">Experience:</label>
            <input type="text" name="experience" value={tutorData.experience} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div>

          <div className="form-group">
            <label className="block text-gray-700 font-bold mb-2">Profile Picture:</label>
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
            {tutorData.profilePic && <img src={tutorData.profilePic} alt="Profile Preview" className="profile-pic-preview w-24 h-24 rounded-full mt-2 object-cover" />} {/* Added styling to profile preview */}
          </div>
{/* 
          <div className="form-group">
            <label className="block text-gray-700 font-bold mb-2">Price:</label>
            <input type="text" name="price" value={tutorData.price} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300" />
          </div> */}

          {/* <div className="form-group">
            <label className="block text-gray-700 font-bold mb-2">Rating:</label>
            <input
              type="number"
              name="rating"
              value={tutorData.rating}
              min="0"
              max="5"
              step="0.1"
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
            />
          </div> */}

          <div className="form-actions "> {/* Added margin top */}
            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:ring focus:border-blue-300"> {/* Styled the submit button */}
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorForm;
