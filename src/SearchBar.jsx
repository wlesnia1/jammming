import React, { useState } from 'react';

function SearchBar({ searchInput, onChangeHandler, onSubmitHandler }) {

  return (
    <form onSubmit={onSubmitHandler}>
      <input type="text" style={{marginRight: "1rem"}} onChange={onChangeHandler} value={searchInput}  />
      <button>Search</button>
    </form>
  );
}

export default SearchBar;
