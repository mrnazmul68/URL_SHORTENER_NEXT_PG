import axios from "axios";

export const handleApiError = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.message || error.message || "Something went wrong"
    );
  }

  if (error instanceof Error) {
    return error.message;
  }
  return "Something went wrong";
};
