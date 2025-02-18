import React, { useState } from 'react';
import axios from 'axios'; // Import axios for API requests

const TutorForm = () => {
  const [tutorData, setTutorData] = useState({
    name: '',
    languages: '',
    skills: '',
    experience: '',
    price: '',
    rating: 0,
    profilePic: null,
  });

  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTutorData({ ...tutorData, [name]: value });
  };

  const handleArrayChange = (e, field) => {
    setTutorData({ ...tutorData, [field]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === 'image/jpeg' || file.type === 'image/png')) {
      setTutorData({ ...tutorData, profilePic: file });

      // Show image preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      alert('Please upload a valid image (JPG or PNG)');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', tutorData.name);
    formData.append('languages', tutorData.languages);
    formData.append('skills', tutorData.skills);
    formData.append('experience', tutorData.experience);
    formData.append('price', tutorData.price);
    formData.append('rating', tutorData.rating);
    formData.append('profilePic', tutorData.profilePic);

    try {
      const response = await axios.post('https://interviewbot.intraintech.com/api/api/tutors/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      alert('Tutor uploaded successfully');
      setTutorData({ name: '', languages: '', skills: '', experience: '', price: '', rating: 0, profilePic: null });
      setPreview(null);
    } catch (error) {
      console.error('Error uploading tutor:', error);
      alert('Failed to upload tutor');
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300">
      <div className="bg-white p-8 rounded-lg shadow-md w-full mt-2 mb-3 max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Tutor Registration</h2>
        <form onSubmit={handleSubmit} className="space-y-1 ">
          <div>
            <label className="block text-gray-700">Name:</label>
            <input type="text" name="name" value={tutorData.name} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700">Languages (comma separated):</label>
            <input type="text" value={tutorData.languages} onChange={(e) => handleArrayChange(e, 'languages')} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700">Skills (comma separated):</label>
            <input type="text" value={tutorData.skills} onChange={(e) => handleArrayChange(e, 'skills')} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700">Experience:</label>
            <input type="text" name="experience" value={tutorData.experience} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700">Price:</label>
            <input type="text" name="price" value={tutorData.price} onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700">Rating:</label>
            <input type="number" name="rating" value={tutorData.rating} min="0" max="5" step="0.1" onChange={handleInputChange} required className="w-full px-3 py-2 border rounded-md" />
          </div>

          <div>
            <label className="block text-gray-700">Profile Picture:</label>
            <input type="file" accept="image/png, image/jpeg" onChange={handleFileChange} required className="w-full px-3 py-2 border rounded-md" />
            {preview && <img src={preview} alt="Profile Preview" className="w-24 h-24 rounded-full mt-2" />}
          </div>

          <div>
            <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded w-full">
              Submit
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TutorForm;
