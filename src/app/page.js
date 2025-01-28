// src/app/page.js

'use client';

import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import { addReferences } from '@/utils/ragUtils';

// This component represents the main page of the UI
const HomePage = () => {
  // State variables to manage user input, answer display, and loading status
  const [inputText, setInputText] = useState('');
  const [answerText, setAnswerText] = useState('');
  const [referenceText, setReferenceText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [book, setBook] = useState('');
  const [page, setPage] = useState(0);
  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: inputText }),
      });
    
      const data = await res.json();
      // console.log('Response Data:', data);
      // console.log('Response Data:', data.response.results[0].answers[0].meta.answer_page_number);
      // console.log('Response Data:', data.response.results[0].documents[0].file.name);
      // console.log('Response Data:', data.response.results[0].documents[0].file.name);
      // var answer = capitalizeFirstLetter();
      setAnswerText(data.response.results[0].answers[0].answer);
      setReferenceText(data.response.results[0].documents[0].content);
      setBook(data.response.results[0].documents[0].file.name);
      setPage(data.response.results[0].answers[0].meta.answer_page_number);

    
      // Check if results and answers exist
      // const results = data?.response?.results;
      // if (results?.length > 0 && results[0]?.answers?.length > 0) {
      //   const { answer, file, meta } = results[0].answers[0];
    
      //   if (meta && typeof meta === 'object' && !Array.isArray(meta) && Object.keys(meta).length > 0) {
      //     const { referenceList, answerWithReferences } = addReferences(answer, meta);
      //     setAnswerText(answerWithReferences);
      //     setReferenceText(referenceList);
      //   } else {
      //     setAnswerText(answer);
      //     setReferenceText('No references from reference_predictor found.');
      //   }
      // } else {
      //   setAnswerText('No results found.');
      //   setReferenceText('');
      // }
    } catch (error) {
      console.error('Error:', error);
      setAnswerText('An error occurred while processing your request.');
    } finally {
      setIsLoading(false);
    }
    
  };
  // Component to display a loading message
  const LoadingMessage = () => (
    <Box display="flex" alignItems="center">
      <CircularProgress size={20} style={{ marginRight: '10px' }} />
      <Typography>Generating an answer...</Typography>
    </Box>
  );
  // The main render function for the component
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mt: 4, p: 4, width: '100%' }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', mr: 4, width: '100%' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          Welcome!
        </Typography>
        <TextField
          label="Type your question here"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          variant="outlined"
          sx={{ mb: 2 }}
        />
        <Button variant="contained" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? '...' : 'Submit'}
        </Button>
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '100px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          p: 2,
          borderRadius: '4px',
          mr: 2
        }}
      >
        {isLoading ? <LoadingMessage /> : <ReactMarkdown>{answerText}</ReactMarkdown>}
      </Box>
      <Box
        sx={{
          width: '100%',
          height: '350px',
          overflowY: 'auto',
          border: '1px solid #ccc',
          p: 2,
          borderRadius: '4px',
        }}
      >
        <Typography variant="subtitle1" gutterBottom>
          References:
        </Typography>
        <ReactMarkdown>{referenceText}</ReactMarkdown>
        {
          page != 0 &&
        <p>From {book}, page number {page}</p>
        }
      </Box>
    </Box>
  );
};

export default HomePage;