
import { useQuery } from "@tanstack/react-query";

interface University {
  name: string;
  web_pages: string[];
  domains: string[];
  country: string;
  alpha_two_code: string;
  state_province: string | null;
}

const fetchUniversities = async (): Promise<University[]> => {
  const response = await fetch("http://universities.hipolabs.com/search?country=Vietnam");
  if (!response.ok) {
    throw new Error("Failed to fetch universities");
  }
  return response.json();
};

export const useUniversities = () => {
  return useQuery({
    queryKey: ["universities", "vietnam"],
    queryFn: fetchUniversities,
  });
};
