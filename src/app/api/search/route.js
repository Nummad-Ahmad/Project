// src/app/api/search/route.js

import { RagPipelineResponse, RagResult, RagAnswer, RagDocument } from '@/lib/ragPipelineResponse';

const workspace = 'default';
const pipeline ='Recall-QA';
const apiToken = 'api_eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkNjI3NDM0ZS00NjE2LTQ1NWEtOWJkZS1iNWY4MTJhMTIwNmJ8Njc5OGE4NmEwY2JhZWRiYWQ4YTljODlkIiwiZXhwIjo1MzM4NzI0NDAwLCJhdWQiOlsiaHR0cHM6Ly9hcGkuY2xvdWQuZGVlcHNldC5haSJdfQ.GQhsmsq3H5MP6t9e21_YuiBKQS2dM07w29OmmQdaOsU';
// Construct the API URL for the deepset Cloud Search endpoint
const apiUrl = `https://api.cloud.deepset.ai/api/v1/workspaces/${workspace}/pipelines/${pipeline}/search`;

export async function POST(request) {
  // Extract the query from the incoming request
  const { query } = await request.json();

  console.log(`${__filename}: Received text:`, query);

  try {
    // Prepare the options for the API request to deepset Cloud
    const requestOptions = {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({
        debug: false,
        view_prompts: false,
        queries: [query],
      }),
    };

    console.log(`${__filename}: apiUrl:`, apiUrl);
    console.log(`${__filename}: Request Options:\n`, requestOptions);
    // Send the request to the deepset Cloud API
    const res = await fetch(apiUrl, requestOptions);
    // Parse the JSON response
    const data = await res.json();

    console.log(`${__filename}: Response Data:\n`, data);
    // Create a RagPipelineResponse object from the API response
    const ragResponse = new RagPipelineResponse(data);

    ragResponse.processResults();

    console.log(`${__filename}: Processed and returning:\n`, ragResponse);
    // Return the processed response to the client
    return new Response(JSON.stringify({ response: ragResponse }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // If any error occurs, log it and return an error response
    console.error(`${__filename}: Error:`, error);
    return new Response(JSON.stringify({ error: 'An error occurred' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
