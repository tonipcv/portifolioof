export default function CoursesPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Cursos Premium</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Exemplo de card de curso */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6">
              <h2 className="text-xl font-semibold mb-2">Curso de Trading</h2>
              <p className="text-gray-600 mb-4">
                Aprenda estratégias avançadas de trading de criptomoedas
              </p>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                Começar
              </button>
            </div>
          </div>
          
          {/* Adicione mais cards de cursos aqui */}
        </div>
      </div>
    </div>
  );
} 