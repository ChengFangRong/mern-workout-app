import { useState } from 'react'
import { useWorkoutsContext } from '../hooks/useWorkoutsContext'
import { useAuthContext } from '../hooks/useAuthContext'

// date fns
import formatDistanceToNow from 'date-fns/formatDistanceToNow'

const WorkoutDetails = ({ workout }) => {
  const { dispatch } = useWorkoutsContext()
  const { user } = useAuthContext()

  const [isEditing, setIsEditing] = useState(false)
  const [updatedTitle, setUpdatedTitle] = useState(workout.title)
  const [updatedLoad, setUpdatedLoad] = useState(workout.load)
  const [updatedReps, setUpdatedReps] = useState(workout.reps)

  const handleDelete = async () => {
    if (!user) return

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/` + workout._id, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${user.token}` }
    })
    const json = await response.json()

    if (response.ok) {
      dispatch({ type: 'DELETE_WORKOUT', payload: json })
    }
  }

  const handleUpdate = async () => {
    if (!user) return

    const updatedWorkout = { title: updatedTitle, load: updatedLoad, reps: updatedReps }

    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/workouts/` + workout._id, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${user.token}`
      },
      body: JSON.stringify(updatedWorkout)
    })

    const json = await response.json()

    if (response.ok) {


      dispatch({ type: 'UPDATE_WORKOUT', payload: json })

      //to immediately update without refreshing
      setUpdatedTitle(json.title)
      setUpdatedLoad(json.load)
      setUpdatedReps(json.reps)

      setIsEditing(false) // Exit edit mode after updating
    }
  }

  return (
    <div className="workout-details">
      {isEditing ? (
        <div>
          <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} />
          <input type="number" value={updatedLoad} onChange={(e) => setUpdatedLoad(e.target.value)} />
          <input type="number" value={updatedReps} onChange={(e) => setUpdatedReps(e.target.value)} />
          <button onClick={handleUpdate}>Save</button>
          <button onClick={() => setIsEditing(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <h4>{workout.title}</h4>
          <p><strong>Load (kg): </strong>{workout.load}</p>
          <p><strong>Reps: </strong>{workout.reps}</p>
          <p>{formatDistanceToNow(new Date(workout.createdAt), { addSuffix: true })}</p>
          <button onClick={() => setIsEditing(true)}>Edit</button>
          <span className="material-symbols-outlined" onClick={handleDelete}>delete</span>
        </div>
      )}
    </div>
  )
}

export default WorkoutDetails
