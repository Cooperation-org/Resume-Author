import React, { Suspense, lazy } from 'react';
const Skills = lazy(() => import('./Skills'));

const Resume: React.FC = () => {
  return (
    <div>
      <Suspense fallback={<div>Loading Skills...</div>}>
        {/* <Skills /> */}
      </Suspense>
    </div>
  );
};

export default Resume;
