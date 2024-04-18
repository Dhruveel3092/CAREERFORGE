import React from 'react'
import './JobStyle.css';
const JobsDes = ({result}) => {
  return (
    <>
    <div>
      <h3 className='JobsDes'>{result.length} Jobs</h3>
    </div>
      <section>{result}</section>
    </>
  )
}

export default JobsDes
