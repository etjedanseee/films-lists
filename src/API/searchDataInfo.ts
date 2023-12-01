import { ISearchDataItem } from "../types/search"
import { posterSizes } from "../utils/consts"

interface ISearchDataInfo {
  title: string,
  setLoading: (b: boolean) => void,
  setResults: (arr: ISearchDataItem[]) => void
}

export const searchDataInfo = async ({ title, setLoading, setResults }: ISearchDataInfo) => {
  const url = 'https://api.themoviedb.org/3/search/multi'
  const API_KEY = process.env.REACT_APP_MOVIE_DB_API_KEY
  const ACCESS_TOKEN = process.env.REACT_APP_MOVIE_DB_ACCESS_TOKEN
  if (!API_KEY && !ACCESS_TOKEN) {
    throw new Error('No API_KEY and ACCESS_TOKEN')
  }
  setLoading(true)
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN || API_KEY}`
    }
  }
  const results: ISearchDataItem[] = []
  //get genres by movie id
  //fetch(`https://api.themoviedb.org/3/movie/75780?append_to_response=genres`, options).then(item => item.json()).then(val => console.log(val))
  //get genres by serial id
  //fetch(`https://api.themoviedb.org/3/tv/1?append_to_response=genres`, options).then(item => item.json()).then(val => console.log(val))
  try {
    const response = await fetch(`${url}?query=${title}`, options)
    const data = await response.json()
    console.log('data', data)
    const items = data?.results
    if (items && Array.isArray(items) && items.length > 0) {
      const imageSize = posterSizes[2]
      const baseImageUrl = 'https://image.tmdb.org/t/p/';
      items.forEach(item => {
        // console.log('item', item)
        const posterPath = item?.poster_path || item?.backdrop_path || '';
        const obj: ISearchDataItem = {
          id: item?.id,
          title: item?.title || item?.original_title || item?.original_name || '',
          fullPosterUrl: baseImageUrl + imageSize + posterPath,
          mediaType: item?.media_type || 'movie',
          releaseDate: item?.release_date || item?.first_air_date || '',
          vote: item?.vote_average || 0
        }
        results.push(obj)
      })
      setResults(results)
    } else {
      console.log('Ничего не найдено.');
    }
  } catch (e) {
    console.error('Error fetch dataInfo', e)
  } finally {
    setLoading(false)
  }
}
