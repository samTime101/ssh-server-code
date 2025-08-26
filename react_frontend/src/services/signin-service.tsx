import axios, { AxiosError } from 'axios';
import type { User } from '@/types/auth';


// Interface for the data coming FROM your React form component
export interface SignInFormData {
  email: string;
  password: string;
}



// Interface for the entire success response object from DRF
export interface SignInResponse {
  message: string;
  user: User;
  tokens: {
    access: string;
    refresh: string;
  }
}

// Interface for the validation error response from DRF (on 400 Bad Request)
// It's a dictionary where keys are field names and values are arrays of error strings.
export interface DrfValidationError {
  [field: string]: string[];
}


///APi endpoint configuration

// Use your actual backend URL. 
const API_URL = 'http://127.0.0.1:8000/api/signin/';



/**
 * Signs in a user by sending their data to the DRF backend.
 * @param userData - The user data from the signin form.
 * @returns A promise that resolves with the success response from the API.
 * @throws The structured DRF validation error object on 400 Bad Request, or a generic Error for other failures.
 */
export const signInUser = async (userData: SignInFormData): Promise<SignInResponse> => {

  try {
    // Step B: Make the POST request with the correct types and transformed data
    const response = await axios.post<SignInResponse>(API_URL, userData);
    
    // Store tokens and user data in local storage
    if (response.data.tokens && response.data.user) {
      localStorage.setItem('accessToken', response.data.tokens.access);
      localStorage.setItem('refreshToken', response.data.tokens.refresh);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
  } catch (error) {
    // Step C: Implement robust, DRF-aware error handling
    if (axios.isAxiosError(error)) {
      // Give TypeScript a hint about the expected error data shape
      const axiosError = error as AxiosError<DrfValidationError>;

      // Handle DRF validation errors specifically (400 Bad Request)
      if (axiosError.response && axiosError.response.status === 400) {
        // Throw the validation error data itself, so the component can process it
        throw axiosError.response.data;
      }

      // Handle other server-side errors (500, 404, etc.)
      if (axiosError.response) {
        throw new Error(`The server responded with an error: ${axiosError.response.status}`);
      }
      
      // Handle network errors where no response was received
      if (axiosError.request) {
        throw new Error('Could not connect to the server. Please check your network and try again.');
      }
    }

    // Handle non-Axios or other unexpected errors
    throw new Error('An unexpected error occurred during registration.');
  }
};