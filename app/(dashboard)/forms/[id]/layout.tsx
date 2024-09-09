import React from 'react'

function layout({children}: {children: React.ReactNode}) {
  return <div className="flex flex-col flex-grow w-full items-center">{children}</div>
}

export default layout
