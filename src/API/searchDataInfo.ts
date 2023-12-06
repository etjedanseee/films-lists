import { ISearchDataItem } from "../types/search"
import { baseImageUrl, posterSizes } from "../utils/consts"

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
  try {
    const response = await fetch(`${url}?query=${title}`, options)
    const data = await response.json()
    console.log('data', data)
    const items = data?.results
    if (items && Array.isArray(items) && items.length > 0) {
      const imageSize = posterSizes[2]
      for (const item of items) {
        if (item.media_type === 'person') {
          continue;
        }
        const posterPath = item?.poster_path || item?.backdrop_path || '';
        const obj: ISearchDataItem = {
          dataId: item?.id,
          title: item?.title || item?.original_title || item?.original_name || '',
          fullPosterUrl: posterPath ? baseImageUrl + imageSize + posterPath : '',
          mediaType: item?.media_type || 'movie',
          releaseDate: item?.release_date || item?.first_air_date || '',
          vote: item?.vote_average || 0,
        };
        results.push(obj)
      }
      console.log('results', results)
      setResults(results)
    } else {
      console.log('No found items');
      setResults([])
    }
  } catch (e) {
    console.error('Error fetch dataInfo', e)
  } finally {
    setLoading(false)
  }
}
