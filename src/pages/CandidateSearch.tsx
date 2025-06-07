import { useState, useEffect } from 'react';
import { searchGithub, searchGithubUser } from '../api/API';
import { Card, Button } from "flowbite-react";
import { Candidate } from '../interfaces/Candidate.interface';

const CandidateSearch = () => {
  const [candidate, setCandidate] = useState<Candidate>({} as Candidate);
  const [counter, setCounter] = useState<number>(0);
  const [candidateList, setCandidateList] = useState<Candidate[]>([]);

  useEffect(() => {
    setCounter(0);
    const fetchData = async () => {
      const response = await searchGithub();
      setCandidateList(response);
      if (response && response.length > 0) {
        const candidate_response = await searchGithubUser(response[0].login);
        console.log(candidate_response);
        setCandidate(candidate_response);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchCandidate = async () => {
      if (candidateList.length > 0 && candidateList[counter]) {
        const candidate_response = await searchGithubUser(candidateList[counter].login);
        setCandidate(candidate_response);
      }
    };
    fetchCandidate();
  }, [counter]);

  const handleNext = (_add : boolean) => {
    if (counter < candidateList.length) {
      setCounter(counter + 1);
    }

    if (_add && candidate && candidate.login) {
      const storedCandidates = JSON.parse(localStorage.getItem('candidates') || '[]');
      storedCandidates.push(candidate);
      localStorage.setItem('candidates', JSON.stringify(storedCandidates));
    }
  };


  return (
    <div className='flex flex-col items-center justify-center'>
      <h1 className="text-5xl pb-4">CandidateSearch</h1>
      {counter >= candidateList.length ? (
        <p className="text-xl font-bold text-gray-200 mt-8">No more available candidates, refresh the page</p>
      ) : (
        <>
          <Card
            className="max-w-sm"
            imgAlt={candidate.login || "Candidate"}
            imgSrc={candidate.avatar_url || "noCandidate.jpg"}
          >
            <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              {candidate.login || "Candidate not found"}
              <br />
              <p className='text-lg'>{!candidate.login && "Press \'+\' or \'-\' to load a new candidate"}</p>
            </h5>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Location: {candidate.location || "No location"}
            </p>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Company: {candidate.company || "No company"}
            </p>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Email: {candidate.email || "No email"}
            </p>
            <p className="font-normal text-gray-700 dark:text-gray-400">
              Bio: {candidate.bio || "No bio"}
            </p>
          </Card>
          <div className='flex flex-row justify-between w-full px-5 mt-4'>
            <Button color="red" pill onClick={() => handleNext(false)} disabled={counter >= candidateList.length}>
              -
            </Button>
            <Button color="green" pill onClick={() => handleNext(true)} disabled={counter >= candidateList.length}>
              +
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CandidateSearch;