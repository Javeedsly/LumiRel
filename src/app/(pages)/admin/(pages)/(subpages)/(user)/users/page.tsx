import React from 'react'
import Aside from '../../../../components/AsideLeft/AsideLeft'
import AsideRight from '../../../../components/AsideRight/AsideRight'
import UsersTable from '../../../../components/Table/UserTable/Usertable'
import "./users.css"

const page = () => {
  return (
    <div className="layout">
      <aside className="aside-left">
        <Aside />
      </aside>      
      <main>
        <UsersTable/>
      </main>
      <aside className="aside-right">
        <AsideRight />
      </aside>
    </div>
  )
}

export default page