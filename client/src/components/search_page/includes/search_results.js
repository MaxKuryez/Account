import React, { useEffect, useState } from 'react';

const SearchResults = ({
  index,
  name,
  type,
  imgUrl,
  id,
}) =>  {
  return(
      <div key={index}><div className='item-img'><img src={imgUrl}></img></div><div className='row item-col' id={id}>
        <div className='item-name item-element'>{name}</div>
        <div className='item-price item-element'>{type}</div>
      </div>
    </div>
  );
}

export default SearchResults;
