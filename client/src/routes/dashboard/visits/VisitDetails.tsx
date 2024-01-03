import React from 'react';
import { useParams } from 'react-router-dom';

const VisitDetails = () => {
  const { visitId } = useParams();


  return (
    <div>
      <h1>Visit Details</h1>
      <p>Visit ID: {visitId}</p>

    </div>
  );
};

export default VisitDetails;
