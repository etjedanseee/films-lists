import React, { useState, ChangeEvent, FormEvent, useEffect, useRef } from 'react'
import Input from '../UI/Input'
import { searchDataInfo } from '../API/searchDataInfo'
import { useNavigate } from 'react-router-dom'
import { useActions } from '../hooks/useActions'
import { useTypedSelector } from '../hooks/useTypedSelector'

const Search = () => {
  const [search, setSearch] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const lastSearchRef = useRef('')
  const navigate = useNavigate()
  const { lastSearch } = useTypedSelector(state => state.search)
  const { setSearchResults, setSearchLoading, setLastSearch, setSearchTotalPages, setSearchPage } = useActions()

  const onSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
  }

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedSearch = search.trim()
    if (trimmedSearch.length >= 3) {
      if (trimmedSearch !== lastSearchRef.current) {
        setSearchPage(1)
        setLastSearch(trimmedSearch)
        lastSearchRef.current = trimmedSearch
        searchDataInfo({
          title: trimmedSearch,
          page: 1,
          setLoading: setSearchLoading,
          setSearchResults,
          setSearchTotalPages,
        })
      }
      navigate('/search/' + encodeURIComponent(trimmedSearch))
    }
  }

  const onSearchFocus = () => {
    setIsFocused(true)
  }

  const onSearchBlur = () => {
    setIsFocused(false)
  }

  const onCleanSearch = () => {
    setSearch('')
    setLastSearch('')
  }

  useEffect(() => {
    const localLastSearch = localStorage.getItem('lastSearch')
    if (localLastSearch) {
      setSearch(localLastSearch)
      lastSearchRef.current = localLastSearch
    }
  }, [])

  useEffect(() => {
    setSearch(lastSearch)
  }, [lastSearch])

  return (
    <form
      onSubmit={onSubmit}
      className={`flex-1 flex gap-x-2 xs:gap-x-4 ${isFocused || search ? 'max-w-none' : 'max-w-[250px]'}`}
    >
      <Input
        onInputChange={onSearchChange}
        placeholder='Enter movie or series title'
        value={search}
        error={''}
        isFieldDirty={true}
        onBlur={onSearchBlur}
        onFocus={onSearchFocus}
        name='Search'
        className='flex-1'
        py='py-2'
        isCanClean
        onClean={onCleanSearch}
      />
    </form>
  )
}

export default Search