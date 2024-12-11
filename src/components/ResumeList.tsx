import React, { useCallback } from 'react';
import { getCookie } from '../tools';
import { GoogleDriveStorage, Resume } from '@cooperation/vc-storage';

const SessionDialog = () => {
  const [userSessions, setSessions] = React.useState<
    {
      id: string;
      name: string;
    }[]
  >([]);

  const getSessions = useCallback(async () => {
    const accessToken = getCookie('auth_token');
    if (!accessToken) {
      return null;
    }
    const storage = new GoogleDriveStorage(accessToken);
    const resumeManmager = new Resume(storage);
    const nonSignedResumes = await resumeManmager.find();
    console.log('🚀 ~ getSessions ~ nonSignedResumes:', nonSignedResumes);
    // setSessions(nonSignedResumes);
  }, []);

  React.useEffect(() => {
    try {
      getSessions();
    } catch (error) {
      console.error('🚀 ~ error', error);
    }
  }, [getSessions]);
  return (
    <div>
      {userSessions.map(session => (
        <div key={session.id}>
          <ul>
            <li>
              <h3>{session.name}</h3>
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default SessionDialog;
