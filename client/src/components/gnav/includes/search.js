import React, { useState, useEffect } from 'react';
import { FormControl, Button, Form } from 'react-bootstrap';

function Search() {
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);

  async function onSearchChange(e) {
    setSearch(e.target.value);
    let results = [];

    Array.isArray(items) && items.forEach(item => {
      if (item && typeof item.name === 'string' && item.name.toLowerCase().includes(search.toLowerCase())) {
        console.log(item.name);
        if ( item.name.startsWith(search) ) {
          results.unshift(item);
        } else {
          results.push(item);
        }
      }
    });

    setItems(results);
    showResults();
  }

  function showResults() {
    let results = [];

    Array.isArray(items) && items.forEach(item => {
      results.push(item.name);
    });

    console.log(results);
  }

  useEffect(() => {
    fetch('/items/search', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
    }).then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      if (!response.ok) {
          throw new Error(data);
      } else {
        setItems(data);
      }
    });
  }, []);

  return(
    <Form className="d-flex search-form">
      <FormControl
        type="search"
        placeholder="Search"
        className="me-2"
        aria-label="Search"
        onChange={onSearchChange}
      />
      <Button>Search</Button>
    </Form>
  );
}

export default Search;