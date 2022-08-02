import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material/styles";
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl, Button, Form } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';

function Search() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const searchDom = useLocation().search;
  const query = new URLSearchParams(searchDom).get('query') || '';

  async function getSearchedItems() {
    if (!search) {return;}
    fetch('/items/search', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        search: search
      })
    }).then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      if (!response.ok) {
          throw new Error(data);
      } else {
        setItems(data.slice(0,7));
      }
    });
  }

  async function handleKeyPress(event, selectedSearch) {
    event.preventDefault();
    setSearch(selectedSearch);
    if (!selectedSearch) {
      navigate('/search?query=' + search);
    } else {
      navigate('/search?query=' + selectedSearch);
    }
  }

  useEffect(() => {
    if (!search || search.trim().length !== 0) {
      getSearchedItems();
    } else {
      setItems([]);
    }
  }, [search]);

  return(
    <Form className='d-flex search-form'>
      <Autocomplete
        disablePortal
        freeSolo
        id='combo-box-demo'
        defaultValue={query}
        value={query}
        onInputChange={(event, newInputValue) => {
          if (newInputValue && newInputValue) {
            newInputValue = newInputValue.trimStart();
          }
          setSearch(newInputValue);
        }}
        filterOptions={(x) => x}
        onChange={(event, newInputValue) => {
          if (newInputValue) {
            handleKeyPress(event, newInputValue.label);
          }
        }}
        onKeyPress={(event, newInputValue) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            if (newInputValue && newInputValue.label) {
              handleKeyPress(event, newInputValue.label);
            }
          }
        }}
        options={items}
        sx={{ width: 400 }}
        renderInput={(params) => <TextField {...params} label='Search' size='small'/>}
      />
    </Form>
  );
}

export default Search;