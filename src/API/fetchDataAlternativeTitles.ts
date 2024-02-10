import { MediaType } from "../types/search"

interface fetchDataAlternativeTitlesResponse {
  id: number,
  titles?: {
    iso_3166_1: string,
    title: string,
  }[],
  results?: {
    iso_3166_1: string,
    title: string,
  }[],
}

interface fetchDataTranslationsResponse {
  id: number,
  translations?: {
    iso_3166_1: string,
    data: {
      title?: string,
      name?: string,
    },
  }[],
}

interface fetchDataAlternativeTitlesProps {
  mediaType: MediaType,
  dataId: number,
  setLoading: (b: boolean) => void,
}

export const fetchDataAlternativeTitles = async ({ mediaType, dataId, setLoading }: fetchDataAlternativeTitlesProps) => {
  const alternativeTitlesUrl = `https://api.themoviedb.org/3/${mediaType}/${dataId}/alternative_titles`
  const translationsUrl = `https://api.themoviedb.org/3/${mediaType}/${dataId}/translations`
  const API_KEY = process.env.REACT_APP_MOVIE_DB_API_KEY
  const ACCESS_TOKEN = process.env.REACT_APP_MOVIE_DB_ACCESS_TOKEN
  if (!API_KEY && !ACCESS_TOKEN) {
    throw new Error('No API_KEY and ACCESS_TOKEN')
  }
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${ACCESS_TOKEN || API_KEY}`
    }
  }
  setLoading(true)
  try {
    const response = await fetch(`${alternativeTitlesUrl}?language=en-US`, options)
    const data: fetchDataAlternativeTitlesResponse = await response.json()
    const alternativeTitles = (data?.titles || data?.results || []).map(item => item.title)
    const response2 = await fetch(`${translationsUrl}?language=en-US`, options)
    const data2: fetchDataTranslationsResponse = await response2.json()
    const translationTitles = data2.translations?.map(item => item.data?.name || item.data?.title || '')
      .filter(title => !!title) || []
    return [...alternativeTitles, ...translationTitles]
  } catch (e) {
    console.error('Error fetch alternative titles:', e)
    return []
  } finally {
    setLoading(false)
  }
}