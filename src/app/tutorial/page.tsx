import { Course } from '@/types/course'
import CourseList from '@/components/CourseList'

async function getCourses(): Promise<Course[]> {
  const response = await fetch('https://cursos-api-cursos.dpbdp1.easypanel.host/courses', {
    next: { revalidate: 3600 } // revalidar a cada hora
  })
  
  if (!response.ok) {
    throw new Error('Failed to fetch courses')
  }

  return response.json()
}

export default async function TutorialPage() {
  const courses = await getCourses()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-8">Tutoriais</h1>
      <CourseList courses={courses} />
    </div>
  )
} 