import React, { useEffect, useState } from 'react';
import Gnav from '../gnav/gnav';
import SearchResults from './includes/search_results';
import { useLocation } from 'react-router-dom';
import './search_page.scss';

function SearchPage() {
  const search = useLocation().search;
  const query = new URLSearchParams(search).get('query');
  const [searchResults, setsearchResults] = useState([]);

  async function getSearchResults() {
    if (!query) {return [];}
    const response = await fetch('/items/search', {
      headers: { 'Content-Type': 'application/json' },
      method: 'POST',
      body: JSON.stringify({
        search: query
      })
    }).then(async response => {
      const isJson = response.headers.get('content-type')?.includes('application/json');
      const data = isJson ? await response.json() : null;
      if (!response.ok) {
          throw new Error(data);
      } else {
        setsearchResults(data);
      }
    });
  }

  useEffect(() => {
    getSearchResults();
  }, [query]);

  return(
    <div className='search-page-container'>
      <Gnav/>
      {searchResults.length ? (<>
      <div className='results-header'>Results:</div>
      <div className='results-container'>
        <div className='items-table'>
          <div className='row item-col mb-2'>
            <div className='item-name item-element'>Item:</div>
            <div className='item-price item-element'>Type:</div>
          </div>
          {searchResults.map((item, index) => {
            return (
              <SearchResults
                key={index}
                name={item.name}
                type={item.type}
                imgUrl={item.imgUrl}
                id={item.id}
              />
            );
          })}
        </div>
      </div></>) : <><div className='no-results'>No results</div></>}
    </div>
  );
}

export default SearchPage;
