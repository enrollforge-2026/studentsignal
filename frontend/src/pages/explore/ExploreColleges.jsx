import React from 'react';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ExploreColleges = () => {
  const navigate = useNavigate();
  
  React.useEffect(() => {
    navigate('/colleges');
  }, [navigate]);
  
  return null;
};

export default ExploreColleges;