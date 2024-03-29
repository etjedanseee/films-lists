import React, { useEffect } from 'react'

const NotFoundPage = () => {
  useEffect(() => {
    document.title = `Not found page - Films Lists`
  }, [])

  return (
    <div className='flex-1 flex flex-col justify-center items-center gap-y-3'>
      <div className='text-5xl font-bold'>404</div>
      <div className='text-3xl font-bold'>Not Found Page</div>
    </div>
  )
}

export default NotFoundPage