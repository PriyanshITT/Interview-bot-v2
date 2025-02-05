import React, { useState } from "react";
import "../../styles/LiveInterview.css";
import "primeicons/primeicons.css";

const tutorsData = [
  {
    id: 1,
    name: "John Doe",
    languages: ["English", "Spanish"],
    skills: ["React", "JavaScript", "Node.js"],
    experience: "5 years",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRmHqMB1mclWsngm5okkBXzEcdDwIHSoOr5Q&s",
    price: "$50/hour",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Jane Smith",
    languages: ["French", "German"],
    skills: ["Python", "Django", "Machine Learning"],
    experience: "7 years",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS5IASKO4XxX0tLpf7H00SHqw7faU3pGgY4Gg&s",
    price: "$60/hour",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Alice Johnson",
    languages: ["English", "Chinese"],
    skills: ["Java", "Spring Boot", "SQL"],
    experience: "4 years",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRO5sS6VgmpwcN-NjMg1Bnc1qwf6XGjbspCqQ&s",
    price: "$45/hour",
    rating: 4.3,
  },
  {
    id: 4,
    name: "Bob Brown",
    languages: ["Spanish", "Portuguese"],
    skills: ["Angular", "TypeScript", "Firebase"],
    experience: "6 years",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThsZWJAU2np1zNVNDMdlLNuc0b8N6k-DbHGdC3R1YAnyFBjjK-eSyU9BY&s",
    price: "$55/hour",
    rating: 4.6,
  },
  {
    id: 5,
    name: "Emma Wilson",
    languages: ["English", "Italian"],
    skills: ["Swift", "iOS Development", "UI/UX Design"],
    experience: "5 years",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThsZWJAU2np1zNVNDMdlLNuc0b8N6k-DbHGdC3R1YAnyFBjjK-eSyU9BY&s",
    price: "$65/hour",
    rating: 4.7,
  },
  {
    id: 6,
    name: "Liam Martinez",
    languages: ["French", "Spanish"],
    skills: ["C++", "Game Development", "Unity"],
    experience: "8 years",
    profilePic:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThsZWJAU2np1zNVNDMdlLNuc0b8N6k-DbHGdC3R1YAnyFBjjK-eSyU9BY&s",
    price: "$70/hour",
    rating: 4.9,
  },
  {
    id: 7,
    name: "Olivia Taylor",
    languages: ["English", "Russian"],
    skills: ["Cybersecurity", "Ethical Hacking", "Networking"],
    experience: "6 years",
    profilePic:
      "data:image/jpeg;base64,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",
    price: "$75/hour",
    rating: 4.8,
  },
  {
    id: 8,
    name: "Noah Anderson",
    languages: ["German", "Dutch"],
    skills: ["Blockchain", "Solidity", "Cryptocurrency"],
    experience: "7 years",
    profilePic:
      "data:image/jpeg;base64,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",
    price: "$80/hour",
    rating: 5.0,
  },
];

const LiveInterview = () => {
  const [tutors, setTutors] = useState(tutorsData);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [filterLanguage, setFilterLanguage] = useState("");

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    const filteredTutors = tutorsData.filter((tutor) =>
      tutor.skills.some((skill) =>
        skill.toLowerCase().includes(e.target.value.toLowerCase())
      )
    );
    setTutors(filteredTutors);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
    const sortedTutors = [...tutors].sort((a, b) => {
      if (e.target.value === "name") {
        return a.name.localeCompare(b.name);
      } else if (e.target.value === "price") {
        return a.price.localeCompare(b.price);
      }
      return 0;
    });
    setTutors(sortedTutors);
  };

  const handleFilter = (e) => {
    setFilterLanguage(e.target.value);
    const filteredTutors = tutorsData.filter((tutor) =>
      tutor.languages.includes(e.target.value)
    );
    setTutors(filteredTutors);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-300 via-purple-300 to-pink-300 overflow-hidden">
      <div className="flex flex-col items-center py-12">
        <h1 className="text-4xl font-bold text-white mb-8">
          Live Interview Tutors
        </h1>

        <div className="flex flex-row justify-center gap-4 mb-16">
          <select
            className="border text-gray-500 rounded-md py-2 px-3"
            value={filterLanguage}
            onChange={handleFilter}
          >
            <option value="">Filter by Language</option>
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
            <option value="Portuguese">Portuguese</option>
          </select>

          <select
            className="border text-gray-500 rounded-md py-2 px-3"
            value={sortBy}
            onChange={handleSort}
          >
            <option value="name">Sort by Name</option>
            <option value="price">Sort by Price</option>
          </select>

          <input
            className="border rounded-md pl-4 pr-10 py-2 w-full"
            type="text"
            placeholder="Search Skills"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-12 w-[70%]">
          {tutors.map((tutor) => (
            <div
              key={tutor.id}
              className="bg-white p-6 rounded-xl shadow-lg flex flex-row items-center space-x-6 hover:shadow-xl transition-shadow duration-300"
            >
              <div className="flex flex-col items-center">
                <img
                  src={tutor.profilePic}
                  alt={tutor.name}
                  className="w-28 h-28 rounded-full object-cover mb-3"
                />
                <p className="flex items-center text-yellow-500 text-lg">
                  <i className="pi pi-star-fill"></i> {tutor.rating}
                </p>
              </div>

              <div className="flex flex-col justify-between">
                <h2 className="text-xl font-semibold">{tutor.name}</h2>
                <p className="text-gray-600">
                  <strong>Languages:</strong> {tutor.languages.join(", ")}
                </p>
                <p className="text-gray-600">
                  <strong>Skills:</strong> {tutor.skills.join(", ")}
                </p>
                <p className="text-gray-600">
                  <strong>Experience:</strong> {tutor.experience}
                </p>
                <p className="text-gray-600">
                  <strong>Price:</strong> {tutor.price}
                </p>

                <div className="flex gap-4 mt-6">
                  <button className="bg-blue-500 text-white px-7 py-1.5 rounded-md hover:bg-blue-600 transition">
                    Chat
                  </button>
                  <button className="bg-green-500 text-white px-4 py-1.5 rounded-md hover:bg-green-600 transition">
                    Schedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p class="query-text">
          For any queries, go to the{" "}
          <a href="/contact-us" class="contact-link">
            Contact Us
          </a>{" "}
          page.
        </p>
      </div>
    </div>
  );
};

export default LiveInterview;
