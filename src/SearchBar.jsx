import React, { useState } from 'react';

function SearchBar({ searchInput, onChangeHandler, onSubmitHandler }) {

  return (
    <form onSubmit={onSubmitHandler}>
      <input type="text" onChange={onChangeHandler} value={searchInput}  />
      <button>Search</button>
    </form>
  );
}

export default SearchBar;
