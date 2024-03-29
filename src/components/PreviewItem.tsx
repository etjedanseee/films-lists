import React, { useState } from 'react'
import { ILink, IPreviewDataItem } from '../types/search'
import noPicture from '../assets/noPicture.jpg'
import DataListManager from '../UI/DataListManager'
import { getVoteBgColor } from '../utils/getVoteBgColor'
import { formatVote } from '../utils/formatVote'
import { IInLists } from '../types/data'
import { NavLink } from 'react-router-dom'
interface PreviewItemProps {
  item: IPreviewDataItem,
  sitesResults?: ILink[],
}

const PreviewItem = ({ item, sitesResults }: PreviewItemProps) => {
  const { fullPosterUrl, dataId, mediaType, releaseDate, title, vote } = item
  const [inLists, setInLists] = useState<IInLists>({})
  const [id, setId] = useState<number | null>(null)

  const mediaTypeBgColor = mediaType === 'movie'
    ? 'bg-myblue'
    : 'bg-pink-700'

  return (
    <div className='flex flex-col'>
      <NavLink
        to={`/data/${mediaType}/${dataId}`}
        className='flex-1 cursor-pointer flex flex-col select-none overflow-hidden'
      >
        <div className='relative flex-1'>
          <img
            src={fullPosterUrl || noPicture}
            alt="poster"
            className='flex-1 w-full h-full bg-cover hover:rotate-3 hover:scale-125 duration-500 transition-transform'
            loading='lazy'
          />
          {!!vote && (
            <div className={`absolute top-2 left-0 pl-2 pr-3 py-1 rounded-r-full text-sm 
            ${getVoteBgColor(vote)} text-zinc-800 font-medium
          `}>
              {formatVote(vote)}
            </div>
          )}
          <div className={`absolute bottom-0 left-0 px-2 py-1 ${mediaTypeBgColor} text-xs`}>
            {mediaType === 'tv' ? 'series' : mediaType}
          </div>
        </div>
        <div className='bg-mygray flex flex-col py-3 z-10'>
          <div className='px-3 text-sm leading-tight font-bold mb-1'>{title}</div>
          {releaseDate && <div className='text-xs px-3'>{releaseDate.slice(0, 4)}</div>}
        </div>
      </NavLink>
      {sitesResults && (
        <DataListManager
          previewDataItem={item}
          id={id}
          setId={setId}
          inLists={inLists}
          setInLists={setInLists}
          sitesResults={sitesResults}
          isHideListsTitles={true}
          notes=''
        />
      )}
    </div>
  )
}

export default PreviewItem