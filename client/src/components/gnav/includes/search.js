import React, { useState, useEffect } from 'react';
import TextField from '@mui/material/TextField';
import { styled } from "@mui/material/styles";
import Autocomplete from '@mui/material/Autocomplete';
import { FormControl, Button, Form } from 'react-bootstrap';

function Search() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);

  async function getSearchedItems() {
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
        setItems(data);
      }
    });
  }

  useEffect(() => {
    console.log('render');
    if (search.trim().length !== 0) {
      getSearchedItems();
    } else {
      setItems([]);
    }
  }, [search]);

  const Input = styled('input')(({ theme }) => ({
    height: 100,
    width: 200,
    backgroundColor: theme.palette.background.paper,
    color: theme.palette.getContrastText(theme.palette.background.paper)
  }));

  return(
    <Form className='d-flex search-form'>
      <Autocomplete
        disablePortal
        freeSolo
        id='combo-box-demo'
        onInputChange={(event, newInputValue) => {
          setSearch(newInputValue);
        }}
        filterOptions={(x) => x}
        options={items}
        sx={{ width: 400 }}
        renderInput={(params) => <TextField {...params} label='Search' size='small'/>}
      />
      <Button>Search</Button>
    </Form>
  );
}

export default Search;