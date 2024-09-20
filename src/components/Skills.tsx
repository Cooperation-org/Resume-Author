import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../redux/store';
import {
  addSkill,
  removeSkill,
  updateSkill,
} from '../redux/slices/skillsSlice';

const Skills: React.FC = () => {
  const skills = useSelector((state: RootState) => state.skills.skills);
  const dispatch = useDispatch<AppDispatch>();

  const [newSkill, setNewSkill] = useState<string>('');

  const handleAddSkill = () => {
    const skill = { id: Date.now().toString(), name: newSkill };
    dispatch(addSkill(skill));
    setNewSkill(''); // Clear input after adding
  };

  const handleRemoveSkill = (id: string) => {
    dispatch(removeSkill(id));
  };

  const handleUpdateSkill = (id: string, name: string) => {
    dispatch(updateSkill({ id, name }));
  };

  return (
    <div>
      <h3>Skills</h3>
      <ul>
        {skills.map(skill => (
          <li key={skill.id}>
            {skill.name}
            <button onClick={() => handleRemoveSkill(skill.id)}>Remove</button>
            <button
              onClick={() => handleUpdateSkill(skill.id, 'Updated Skill Name')}
            >
              Update
            </button>
          </li>
        ))}
      </ul>
      <input
        value={newSkill}
        onChange={e => setNewSkill(e.target.value)}
        placeholder="Add a skill"
      />
      <button onClick={handleAddSkill}>Add Skill</button>
    </div>
  );
};

export default Skills;
