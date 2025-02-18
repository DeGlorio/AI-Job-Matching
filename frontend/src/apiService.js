import axios from "axios";

const API_BASE_URL = "https://animated-meme-5grjvwvqr6jjh4q5g-8000.app.github.dev";

// ✅ Helper function for API requests
const apiRequest = async (method, endpoint, data = {}, responseType = "json") => {
  try {
    const response = await axios({
      method,
      url: `${API_BASE_URL}${endpoint}`,
      data,
      responseType,
      headers: method === "post" ? { "Content-Type": "application/json" } : {},
    });

    return response.data;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// ✅ API Calls for App.js
export const enhanceResume = (formData) => apiRequest("post", "/enhance_resume", formData);
export const getInterviewQuestions = () => apiRequest("post", "/ai_interview_questions");
export const submitInterviewResponses = (responses) => apiRequest("post", "/evaluate_interview", { responses });
export const fetchJobMatches = () => apiRequest("get", "/match_jobs");
export const fetchSalaryInsights = (role) => apiRequest("get", `/salary_benchmark?role=${role}`);
export const fetchCareerAdvice = (role) => apiRequest("get", `/career_path?role=${role}`);
export const fetchJobOfferAnalysis = (details) => apiRequest("post", "/analyze_job_offer", { details });
export const fetchNetworkingTips = () => apiRequest("get", "/networking_recommendations");
export const fetchInterviewSlots = () => apiRequest("post", "/schedule_interview", { candidate_email: "candidate@example.com", recruiter_email: "recruiter@example.com" });
export const confirmInterviewSlot = (selectedSlot) => apiRequest("post", "/confirm_interview", { candidate_email: "candidate@example.com", recruiter_email: "recruiter@example.com", selected_time: selectedSlot });
// ✅ Fetch AI-Generated STAR Response
export const fetchStarResponse = async (scenario) => {
    return apiRequest("post", "/generate_star_response", { scenario });
  };
// ✅ File Download Function
export const downloadFile = async (fileType, content, format) => {
  const endpoint = fileType === "resume" ? "/generate_resume" : "/generate_cover_letter";
  const requestData = fileType === "resume" ? { resume_text: content, format } : { cover_letter_text: content, format };

  const response = await axios.post(`${API_BASE_URL}${endpoint}`, requestData, { responseType: "blob" });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", `Enhanced_${fileType}.${format}`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
