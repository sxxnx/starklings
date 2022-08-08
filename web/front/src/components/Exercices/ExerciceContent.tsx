import React, { FC } from 'react';
import { HashRouter as Router, Route, Link, Routes } from 'react-router-dom';



interface ExerciceContentProps {
  listOfExercices: Array<string>,
  lastSuccessfulExercice: number;
}

const ExerciceContent: FC<ExerciceContentProps> = ({listOfExercices, lastSuccessfulExercice}) => (
  <ul className='exercices'>
    {listOfExercices.map(
      (exercice, index)=> index < lastSuccessfulExercice ? 
        <li className='exercice success'>{exercice}</li>: 
        <li className='exercice not-started'>
          <Link to='../exercice'>{exercice}</Link>
          </li>
    )}
  </ul>
);

export default ExerciceContent;
