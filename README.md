# Form Builder

### How to run the form-builfer project:  

First make sure that port 3000 is available.  

Then:  
For the first run:
1. Clone the project.
2. Go to the path where you cloned it via cmd.
3. Copy&paste: `cd backend && npm run setupAndRun`

For the next runs:  
- Copy&paste: `cd backend && npm start`

After cloning and running, open: <http://localhost:3000>

### Known issues and Things to think about:
1. Form id - I chose to create another id field for the form schema. This id is different from the doc id and also is auto incremented.  
The reason to do so - I didn't want to expose the form doc Ids to the UI.
I prefered this way because its an exercise. For a real project I thought about cloaking the form doc Id by 1:1 hashing or encrypting and then exposing this new value to the user as the form id.
2. Frontend error handling - I didn't have time to implement this part, despite the importance of it. If I had more time, I would check the status code of the response and act accordinagly (for status code 200 - continue with success flow, for all other statuses - presenting the problem within the web page to the user). Also I would add the React mechanithm of catching errors.
