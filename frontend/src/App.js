import React, { useState } from "react";
//import axios from "axios"; - No need with the new imports from number 3
import {
  enhanceResume,
  getInterviewQuestions,
  submitInterviewResponses,
  fetchJobMatches,
  fetchSalaryInsights,
  fetchCareerAdvice,
  fetchJobOfferAnalysis,
  fetchNetworkingTips,
  fetchInterviewSlots,
  confirmInterviewSlot,
  downloadFile,
  fetchStarResponse
} from "./apiService"; //Import API Functions


const API_BASE_URL = "https://animated-meme-5grjvwvqr6jjh4q5g-8000.app.github.dev";

const JobMatchingApp = () => {
  const [resume, setResume] = useState(null);
  const [jobDescription, setJobDescription] = useState("");
  const [enhancedResume, setEnhancedResume] = useState("");
  const [coverLetter, setCoverLetter] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [aiInterviewQuestions, setAiInterviewQuestions] = useState([]);
  const [interviewResponses, setInterviewResponses] = useState({});
  const [interviewFeedback, setInterviewFeedback] = useState("");
  const [scheduleStatus, setScheduleStatus] = useState("");
  const [jobMatches, setJobMatches] = useState([]);
  const [salaryInsights, setSalaryInsights] = useState("");
  const [careerAdvice, setCareerAdvice] = useState("");
  const [jobTrends, setJobTrends] = useState("");
  const [selectedFormat, setSelectedFormat] = useState("pdf");  // Default PDF
  const [interviewSlots, setInterviewSlots] = useState([]); // Store AI-suggested slots
  const [selectedSlot, setSelectedSlot] = useState(""); // Store selected slot
  const [loading, setLoading] = useState(false);  // ✅ Fix: Define `loading` state
  // Handle File Upload
  const handleFileChange = (event) => {
    setResume(event.target.files[0]);
    console.log("Resume file selected:", event.target.files[0]); // Debugging log
  };

  // Process Resume Enhancement
  const handleSubmit = async () => {
    if (!resume || !jobDescription) {
      alert("Please upload a resume and enter a job description.");
      return;
    }
    setLoading(true);  // ✅ Show "Processing..." on Button
    console.log("Submit button clicked!"); // Debugging log

    const formData = new FormData();
    formData.append("resume", resume);
    formData.append("job_description", jobDescription);

    try {
        const data = await enhanceResume(formData);
        console.log("API Response:", data); // ✅ Debugging log for API response
        setResumeText(data.resume_text || "Resume text not available.");
        setEnhancedResume(data.enhanced_resume || "Enhanced resume not available.");
        setCoverLetter(data.cover_letter || "Cover letter not available.");
      
    } catch (error) {
      console.error("Error processing resume:", error); // ✅ Debugging log for error
        alert("Failed to process resume.");
    }
    setLoading(false);  // ✅ Reset Button to Normal
  };

  // Fetch AI Interview Questions
  const fetchAiInterviewQuestions = async () => {
    try {
      const data = await getInterviewQuestions();
      setAiInterviewQuestions(data.questions);
    } catch (error) {
      alert("Failed to fetch AI interview questions.");
    }
  };
  


  // Submit Interview Responses for AI Feedback
  const handleSubmitInterviewResponses = async () => {
    try {
      const data = await submitInterviewResponses(interviewResponses);
      console.log("Interview Feedback Response:", data);
      if (data.feedback) {
        setInterviewFeedback(data.feedback);
      } else {
        alert("No feedback received from AI.");
      }
    } catch (error) {
      alert("Failed to submit interview responses.");
    }
  };
  


  // Improve Resume Based on Interview Answers
  const improveResumeAfterInterview = async () => {
    try {
      const data = await enhanceResume({
        resume_text: enhancedResume,
        interview_feedback: interviewFeedback,
      });
      setEnhancedResume(data.enhanced_resume);
    } catch (error) {
      alert("Failed to improve resume.");
    }
  };
  

  // Fetch Job Matches
  const fetchJobMatches = async () => {
    try {
      const data = await fetchJobMatches();
      setJobMatches(data.matches);
    } catch (error) {
      alert("Failed to fetch job matches.");
    }
  };
  

  // Fetch Salary Insights
  const fetchSalaryInsights = async () => {
    try {
      const data = await fetchSalaryInsights(jobDescription);
      setSalaryInsights(data.salary_range);
    } catch (error) {
      alert("Failed to fetch salary insights.");
    }
  };
  

  // Fetch Career Path Advice
  const fetchCareerAdvice = async () => {
    try {
      const data = await fetchCareerAdvice(jobDescription);
      setCareerAdvice(data.career_path);
    } catch (error) {
      alert("Failed to fetch career advice.");
    }
  };
  

  // Fetch Job Offer Analysis
  const fetchJobOfferAnalysis = async () => {
    try {
      const data = await fetchJobOfferAnalysis(jobDescription);
      alert(data.job_offer_analysis);
    } catch (error) {
      alert("Failed to fetch job offer analysis.");
    }
  };
  

  // Fetch Networking Recommendations
  const fetchNetworkingTips = async () => {
    try {
      const data = await fetchNetworkingTips();
      alert(data.networking_tips);
    } catch (error) {
      alert("Failed to fetch networking tips.");
    }
  };
  
// ✅ Fetch AI-Suggested Interview Slots
const fetchInterviewSlots = async () => {
  try {
    const data = await fetchInterviewSlots();
    setInterviewSlots(data.interview_slots);
  } catch (error) {
    alert("Failed to fetch interview slots.");
  }
};


// ✅ Confirm Selected Interview Slot
const confirmInterview = async () => {
  if (!selectedSlot) {
    alert("Please select an interview time.");
    return;
  }

  try {
    const data = await confirmInterviewSlot(selectedSlot);
    setScheduleStatus(data.message);
  } catch (error) {
    alert("Failed to confirm interview.");
  }
};


  // Download Resume or Cover Letter
  const handleDownloadFile = async (fileType) => {
    try {
      const content = fileType === "resume" ? enhancedResume : coverLetter;
      if (!content) {
        alert(`No ${fileType} available.`);
        return;
      }
      await downloadFile(fileType, content, selectedFormat);
    } catch (error) {
      alert(`Failed to download ${fileType}.`);
    }
  };
  
  // ✅ Fetch AI-Generated STAR Response
  const fetchStarResponse = async (scenario) => {
    try {
      const data = await fetchStarResponse(scenario);
      alert(`STAR Response:\n\n${data.star_response}`);
    } catch (error) {
      alert("Failed to fetch STAR response.");
    }
  };
  


  return (
    <div className="max-w-2xl mx-auto p-4 bg-white shadow-lg rounded-lg">
      <h1 className="text-2xl font-bold mb-4">AI Job Matching System</h1>

      <input type="file" onChange={handleFileChange} className="mb-4" />
      <textarea placeholder="Enter job description..." className="w-full p-2 border rounded mb-4"
        value={jobDescription} onChange={(e) => setJobDescription(e.target.value)}></textarea>

      <button 
        onClick={handleSubmit} 
        className="bg-blue-500 text-white px-4 py-2 rounded"
        disabled={loading} // ✅ Disable button when loading and show Processing
      >
        
        {loading ? "Processing..." : "Submit"} 
      </button>
      <button onClick={fetchJobMatches} className="bg-green-500 text-white px-4 py-2 rounded ml-2">Find Job Matches</button>
      <button onClick={fetchAiInterviewQuestions} className="bg-orange-500 text-white px-4 py-2 rounded ml-2">AI Interview</button>
      <button onClick={fetchSalaryInsights} className="bg-purple-500 text-white px-4 py-2 rounded ml-2">Salary Insights</button>
      <button onClick={fetchCareerAdvice} className="bg-gray-500 text-white px-4 py-2 rounded ml-2">Career Advice</button>
      <button onClick={fetchNetworkingTips} className="bg-teal-500 text-white px-4 py-2 rounded ml-2">Networking Tips</button>
            {/* ✅ Request AI-Generated Interview Slots */}
            <button onClick={fetchInterviewSlots} className="bg-blue-500 text-white px-4 py-2 rounded ml-2">
        Request AI Interview Slots
      </button>
      {/* ✅ Display Enhanced Resume */}
      {enhancedResume && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Enhanced Resume</h2>
          <p>{enhancedResume}</p>
        </div>
      )}

      {/* ✅ Display Cover Letter */}
      {coverLetter && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Generated Cover Letter</h2>
          <p>{coverLetter}</p>
        </div>
      )}
      {/* ✅ Select File Format for Download */}
        <div className="mt-4">
          <label className="block text-gray-700">Choose Download Format:</label>
          <select 
            className="p-2 border rounded"
            value={selectedFormat} 
            onChange={(e) => setSelectedFormat(e.target.value)}
          >
            <option value="pdf">PDF</option>
            <option value="docx">DOCX</option>
          </select>
        </div>

        {/* ✅ Download Enhanced Resume */}
        {enhancedResume && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Enhanced Resume</h2>
            <p>{enhancedResume}</p>
            <button 
              onClick={() => downloadFile("resume")} 
              className="bg-gray-700 text-white px-4 py-2 rounded mt-2"
            >
              Download Resume ({selectedFormat.toUpperCase()})
            </button>
          </div>
        )}

        {/* ✅ Download Cover Letter */}
        {coverLetter && (
          <div className="mt-4">
            <h2 className="text-xl font-semibold">Generated Cover Letter</h2>
            <p>{coverLetter}</p>
            <button 
              onClick={() => downloadFile("cover_letter")} 
              className="bg-gray-700 text-white px-4 py-2 rounded mt-2"
            >
              Download Cover Letter ({selectedFormat.toUpperCase()})
            </button>
          </div>
        )}

      {/* ✅ Display AI-Suggested Interview Slots */}
      {interviewSlots.length > 0 && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Select Interview Time</h2>
          {interviewSlots.map((slot, index) => (
            <div key={index} className="mb-2">
              <input type="radio" name="interviewSlot" value={slot} onChange={() => setSelectedSlot(slot)} />
              <label className="ml-2">{slot}</label>
            </div>
          ))}
          <button onClick={confirmInterview} className="bg-green-500 text-white px-4 py-2 rounded mt-2">
            Confirm Interview
          </button>
        </div>
      )}

      {/* ✅ Show Interview Confirmation Status */}
      {scheduleStatus && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">Interview Scheduled</h2>
          <p>{scheduleStatus}</p>
        </div>
      )}
      {aiInterviewQuestions.length > 0 && (
        <div className="mt-4 p-4 border rounded">
          <h2 className="text-xl font-semibold">AI Interview Questions</h2>
          {aiInterviewQuestions.map((question, index) => (
            <div key={index} className="mb-2">
              <p className="font-medium">{question}</p>
              <textarea
                className="w-full p-2 border rounded"
                placeholder="Your answer..."
                onChange={(e) =>
                  setInterviewResponses({ ...interviewResponses, [index]: e.target.value })
                }
              />
              {/* ✅ STAR Response Button */}
              <button
                onClick={() => fetchStarResponse(question)}
                className="bg-blue-500 text-white px-2 py-1 rounded ml-2 mt-1"
              >
                Generate STAR Response
              </button>
            </div>
          ))}
          <button
            onClick={handleSubmitInterviewResponses}
            className="bg-indigo-500 text-white px-4 py-2 rounded mt-2"
          >
            Submit Responses
          </button>
        </div>
      )}

    
    </div>
    
  );
};

export default JobMatchingApp;
