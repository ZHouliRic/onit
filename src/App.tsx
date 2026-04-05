import { useState } from 'react'
import HomePage from '@/pages/HomePage'
import WorkspacePage from '@/pages/WorkspacePage'
import type { OnitProject } from '@/types/onit'

type AppView = 'home' | 'workspace'

export default function App() {
  const [view, setView] = useState<AppView>('home')
  const [project, setProject] = useState<OnitProject | null>(null)

  const handleStartProject = (newProject: OnitProject) => {
    setProject(newProject)
    setView('workspace')
  }

  const handleBackHome = () => {
    setView('home')
    setProject(null)
  }

  if (view === 'workspace' && project) {
    return <WorkspacePage project={project} onBack={handleBackHome} />
  }

  return <HomePage onStartProject={handleStartProject} />
}
