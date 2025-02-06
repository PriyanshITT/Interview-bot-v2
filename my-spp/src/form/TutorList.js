import React from 'react';

const TutorList = ({ tutorsData }) => {
  return (
    <div>
      <h2>Tutor List</h2>
      <ul>
        {tutorsData.map((tutor, index) => (
          <li key={index}>
            <h3>{tutor.name}</h3>
            <p>Languages: {tutor.languages.join(', ')}</p>
            <p>Skills: {tutor.skills.join(', ')}</p>
            <p>Experience: {tutor.experience}</p>
            <p>Price: {tutor.price}</p>
            <p>Rating: {tutor.rating}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TutorList;
