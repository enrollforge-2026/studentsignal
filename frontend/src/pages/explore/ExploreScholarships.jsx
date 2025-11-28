import React from 'react';
import { Award } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExploreScholarships = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate('/scholarships');
  }, [navigate]);
  
  return null;
};

export default ExploreScholarships;