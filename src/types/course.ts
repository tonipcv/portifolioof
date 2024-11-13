export interface Lesson {
  id: string
  title: string
  duration: number
  thumbnail: string
  moduleId: string
  order: number
}

export interface Module {
  id: string
  title: string
  description: string
  order: number
  courseId: string
  lessons: Lesson[]
}

export interface Course {
  id: string
  title: string
  description: string
  thumbnail: string
  modules: Module[]
} 