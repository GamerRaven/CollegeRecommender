import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';

const useStyles = makeStyles((theme) => ({
  form: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    margin: '0 auto',
    '& .MuiTextField-root, & .MuiSelect-root': {
      margin: theme.spacing(1),
      width: '100%',
      maxWidth: 300,
    },
    '& .MuiButton-root': {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      '& .MuiTextField-root, & .MuiSelect-root': {
        width: 'auto',
      },
    },
  },
  header: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    padding: theme.spacing(2),
    marginBottom: theme.spacing(2),
    textAlign: 'center',
  },
  responseBox: {
    // Add your custom styles for the response box
    marginTop: theme.spacing(2),
    padding: theme.spacing(2),
    border: '1px solid #ccc',
    borderRadius: theme.shape.borderRadius,
  },
}));

function Home() {
  const classes = useStyles();
  const [grade, setGrade] = useState('');
  const [gpa, setGPA] = useState('');
  const [location, setLocation] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  const handleGradeChange = (event) => {
    setGrade(event.target.value);
  };

  const handleGPAChange = (event) => {
    setGPA(event.target.value);
  };

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const handleAdditionalInfoChange = (event) => {
    setAdditionalInfo(event.target.value);
  };

  const [recommendationResult, setRecommendationResult] = useState([]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const prompt = `The user is in grade ${grade}, has a GPA of ${gpa}, lives in ${location}, and has additional information: ${additionalInfo}. Please provide a list of college recommendations separated by commas.`;
  
    try {
      const response = await fetch('https://api.openai.com/v1/engines/text-davinci-002/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer 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',
        },
        body: JSON.stringify({
          prompt: prompt,
          max_tokens: 150,
          n: 1,
          stop: null,
          temperature: 0.7,
        }),
      });
  
      const data = await response.json();
      const text = data.choices[0].text.trim();
      const promptRegex = new RegExp(prompt.replace(/[.*+\-?^${}()|[\]\\]/g, '\\$&'), 'i');
      const filteredText = text.replace(promptRegex, '').trim();      
      const collegesArray = filteredText.split(/[\n,-]+/).map(college => college.trim()).filter(college => college);
      setRecommendationResult(collegesArray);
           
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };
   
  return (
    <div>
    <div className={classes.header}>
      <Typography component="h1" variant="h5">
        College Recommender
      </Typography>
    </div>
      <form className={classes.form} onSubmit={handleSubmit}>
        <FormControl variant="outlined">
          <InputLabel id="grade-label">Grade</InputLabel>
          <Select
            labelId="grade-label"
            label="Grade"
            value={grade}
            onChange={handleGradeChange}
            style={{width:"100px",height:"60px"}}
          >
          <MenuItem value="9">9</MenuItem>
          <MenuItem value="10">10</MenuItem>
          <MenuItem value="11">11</MenuItem>
          <MenuItem value="12">12</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ ml:200 }}>
          <InputLabel id="gpa-label">GPA</InputLabel>
          <Select
            labelId="gpa-label"
            label="GPA"
            value={gpa}
            onChange={handleGPAChange}
            style={{width:"100px",height:"60px"}}
          >
          <MenuItem value="3.0 or lower">3.0 or lower</MenuItem>
          <MenuItem value="3.0 - 3.5">3.0 - 3.5</MenuItem>
          <MenuItem value="3.5 - 4.0">3.5 - 4.0</MenuItem>
          <MenuItem value="4.0 or higher">4.0 or higher</MenuItem>
        </Select>
        </FormControl>
        <TextField
          label="Location"
          variant="outlined"
          value={location}
          onChange={handleLocationChange}
          style={{ marginTop: '1rem' }}
        />
        <TextField
          label="Additional Information"
          variant="outlined"
          value={additionalInfo}
          onChange={handleAdditionalInfoChange}
        />
        <Button type="submit" variant="contained" color="primary">
          Get Recommendations
        </Button>
  </form>
  
  <div
    style={{
      marginTop: '1rem',
      padding: '1rem',
      border: '1px solid rgba(0, 0, 0, 0.23)',
      borderRadius: '4px',
      maxWidth: '800px',
      margin: '1rem auto',
    }}
  >
    <Typography variant="h6">College Recommendations:</Typography>
    {recommendationResult.length > 0 && (
    <ul>
      {recommendationResult.map((college, index) => (
        <li key={index}>
          <Typography variant="body1">{college}</Typography>
        </li>
      ))}
    </ul>)}
  </div>


    </div>
  );
}

export default Home;