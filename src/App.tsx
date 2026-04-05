import { useState } from 'react'
import HomePage from '@/pages/HomePage'
import WorkspacePage from '@/pages/WorkspacePage'
import type { OnitProject } from '@/types/onit'

// ── Mode discriminant ─────────────────────────────────────────
// 'custom' : user-authored brief, fresh project, no demo data
// 'demo'   : Golden Case replay, pre-populated static dataset
export type WorkspaceMode = 'custom' | 'demo'

type AppView = 'home' | 'workspace'

export default function App() {
  const [view, setView] = useState<AppView>('home')
  const [project, setProject] = useState<OnitProject | null>(null)
  const [mode, setMode] = useState<WorkspaceMode>('custom')

  const handleStartProject = (newProject: OnitProject, newMode: WorkspaceMode) => {
    setProject(newProject)
    setMode(newMode)
    setView('workspace')
  }

  const handleBackHome = () => {
    setView('home')
    setProject(null)
    setMode('custom')
  }

  if (view === 'workspace' && project) {
    return <WorkspacePage project={project} mode={mode} onBack={handleBackHome} />
  }

  return <HomePage onStartProject={handleStartProject} />
}
