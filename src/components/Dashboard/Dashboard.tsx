import { useEffect, useState } from 'react'
import CategoryBar from '../CategoryBar/CategoryBar'
import AddTaskCard from '../AddTaskCard/AddTaskCard'
import TaskCard from '../TaskCard/TaskCard'
import './Dashboard.css'
import { IDashboardState } from '../../types'
import Task from '../../../interfaces/Task'
import AppState from '../../../interfaces/AppState'
import ApiClient from '../../../services/apiClient'
import Response from '../../../interfaces/Response'

interface IDashboardProps {
    appState: AppState
    setAppState: React.Dispatch<React.SetStateAction<AppState>>
}

const Dashboard: React.FC<IDashboardProps> = ({ appState, setAppState }) => {
    const [dashboardState, setDashboardState] = useState<IDashboardState>({
        categories: ['Home', 'Chores', 'Work', 'School'],
        tasks: [
            {
                id: 'me',
                title: 'Task Name',
                vibe: 'Playlist Name',
                category: 'Category',
                duration: 10,
                playlistId: 'me'
            },
            {
                id: 'me',
                title: 'Folding Clothes',
                vibe: 'Good Vibes Laundry',
                category: 'Chores',
                duration: 20,
                playlistId: 'me'
            },
            {
                id: 'me',
                title: 'Study',
                vibe: 'Chill Lofi Study Beats',
                category: 'Category',
                duration: 90,
                playlistId: 'me'
            }
        ],
        currentCategory: 'Home'
    })

    useEffect(() => {
        getTasks()
    }, [dashboardState.currentCategory, dashboardState.tasks.length])

    /**
     * <>@todo Implement getTasks() in ApiClient.ts
     */

    const getTasks = async () => {
        try {
            const token = localStorage.getItem('token')!
            const response: Response<Task[]> = await ApiClient.getTasks(token)
            setDashboardState(prevState => ({
                ...prevState,
                tasks: response.data
            }))
        } catch (error) {
            console.error('Failed to get tasks:', error)
        }
    }

    let selectedTasks =
        dashboardState.currentCategory === 'Home'
            ? dashboardState.tasks
            : dashboardState.tasks.filter(
                  task => task.category === dashboardState.currentCategory
              )

    return (
        <>
            <section className='dashboard'>
                <CategoryBar
                    dashboardState={dashboardState}
                    setDashboardState={setDashboardState}
                />
                <AddTaskCard
                    dashboardState={dashboardState}
                    setDashboardState={setDashboardState}
                />
                {selectedTasks.map((task: Task, index) => (
                    <TaskCard
                        key={index}
                        task={task}
                        dashboardState={dashboardState}
                        setDashboardState={setDashboardState}
                        appState={appState}
                        setAppState={setAppState}
                    />
                ))}
            </section>
        </>
    )
}

export default Dashboard
