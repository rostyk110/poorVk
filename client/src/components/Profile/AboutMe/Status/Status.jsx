import React, {useEffect, useState} from 'react';
import classes from "./Status.module.css"

const Status = props => {
  const [editMode, setEditMode] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    setStatus(props.status)
  }, [props.status])

  const activateEditMode = () => setEditMode(true)
  const onStatusChange = e => setStatus(e.target.value)

  const deactivateEditMode = () => {
    setEditMode(false)
    props.updateUserStatus(status)
  }

  return (
    <div className={classes.status}>
      { props.isMyProfile
        ? !editMode
          ? <span onClick={activateEditMode}>{props.status || 'edit status message'}</span>
          :
          <input autoFocus={true} onBlur={deactivateEditMode} type="text" value={status} onChange={onStatusChange}/>
        : <span onDoubleClick={activateEditMode}>{props.status || 'write some status...'}</span>
      }
    </div>
  )
}

export default Status;
