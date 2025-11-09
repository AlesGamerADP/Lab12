'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Author {
  id: string;
  name: string;
  email: string;
  bio?: string;
  nationality?: string;
  birthYear?: number;
  _count?: {
    books: number;
  };
  books?: any[];
}

interface Stats {
  totalAuthors: number;
  totalBooks: number;
  averageBooksPerAuthor: number;
  uniqueGenres: number;
  averagePages: number;
}

export default function Dashboard() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    nationality: '',
    birthYear: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedAuthorBooks, setSelectedAuthorBooks] = useState<any[] | null>(null);
  const [loadingBooks, setLoadingBooks] = useState(false);

  useEffect(() => {
    fetchAuthors();
  }, []);

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/authors');
      if (response.ok) {
        const data = await response.json();
        setAuthors(data);
        calculateStats(data);
      }
    } catch (error) {
      console.error('Error fetching authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (authorsData: Author[]) => {
    const totalAuthors = authorsData.length;
    const totalBooks = authorsData.reduce((sum, author) => sum + (author._count?.books || author.books?.length || 0), 0);
    const averageBooksPerAuthor = totalAuthors > 0 ? Math.round((totalBooks / totalAuthors) * 100) / 100 : 0;
    const allBooks = authorsData.flatMap(author => author.books || []);
    const uniqueGenres = new Set(allBooks.map(book => book.genre).filter(genre => genre !== null && genre !== undefined)).size;
    const booksWithPages = allBooks.filter(book => book.pages !== null && book.pages !== undefined);
    const averagePages = booksWithPages.length > 0
      ? Math.round(booksWithPages.reduce((sum, book) => sum + (book.pages || 0), 0) / booksWithPages.length)
      : 0;

    setStats({
      totalAuthors,
      totalBooks,
      averageBooksPerAuthor,
      uniqueGenres,
      averagePages,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const url = editingAuthor
        ? `/api/authors/${editingAuthor.id}`
        : '/api/authors';

      const method = editingAuthor ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          birthYear: formData.birthYear ? parseInt(formData.birthYear) : null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(editingAuthor ? 'Autor actualizado correctamente' : 'Autor creado correctamente');
        setShowForm(false);
        setEditingAuthor(null);
        resetForm();
        fetchAuthors();
      } else {
        setError(data.error || 'Error al procesar la solicitud');
      }
    } catch (error) {
      setError('Error al procesar la solicitud');
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio || '',
      nationality: author.nationality || '',
      birthYear: author.birthYear?.toString() || '',
    });
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de que deseas eliminar este autor?')) {
      return;
    }

    try {
      const response = await fetch(`/api/authors/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setSuccess('Autor eliminado correctamente');
        fetchAuthors();
      } else {
        const data = await response.json();
        setError(data.error || 'Error al eliminar el autor');
      }
    } catch (error) {
      setError('Error al eliminar el autor');
    }
  };

  const handleViewBooks = async (authorId: string) => {
    setLoadingBooks(true);
    try {
      const response = await fetch(`/api/authors/${authorId}/books`);
      if (response.ok) {
        const data = await response.json();
        setSelectedAuthorBooks(data.books || []);
      } else {
        setError('Error al cargar los libros del autor');
      }
    } catch (error) {
      setError('Error al cargar los libros del autor');
    } finally {
      setLoadingBooks(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      bio: '',
      nationality: '',
      birthYear: '',
    });
  };

  const handleNewAuthor = () => {
    setEditingAuthor(null);
    resetForm();
    setShowForm(true);
    setError('');
    setSuccess('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard de Autores</h1>

        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Autores</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalAuthors}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Total Libros</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.totalBooks}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Promedio Libros/Autor</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averageBooksPerAuthor}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Géneros Únicos</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.uniqueGenres}</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-sm font-medium text-gray-500">Promedio Páginas</h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stats.averagePages}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        <div className="mb-6 flex gap-4">
          <button
            onClick={handleNewAuthor}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            + Crear Nuevo Autor
          </button>
          <Link
            href="/books"
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded inline-block"
          >
            Ver Libros
          </Link>
        </div>

        {showForm && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 text-black">
              {editingAuthor ? 'Editar Autor' : 'Crear Nuevo Autor'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Biografía
                </label>
                <textarea
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nacionalidad
                </label>
                <input
                  type="text"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Año de Nacimiento
                </label>
                <input
                  type="number"
                  value={formData.birthYear}
                  onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                  {editingAuthor ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingAuthor(null);
                    resetForm();
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">Lista de Autores</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nombre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nacionalidad
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Libros
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {authors.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                      No hay autores registrados
                    </td>
                  </tr>
                ) : (
                  authors.map((author) => (
                    <tr key={author.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{author.name}</div>
                        {author.birthYear && (
                          <div className="text-sm text-gray-500">Nacido: {author.birthYear}</div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{author.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{author.nationality || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {author._count?.books || author.books?.length || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleViewBooks(author.id)}
                            className="text-blue-600 hover:text-blue-900"
                          >
                            Ver Libros
                          </button>
                          <button
                            onClick={() => handleEdit(author)}
                            className="text-green-600 hover:text-green-900"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(author.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {selectedAuthorBooks !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-y-auto">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Libros del Autor</h2>
                <button
                  onClick={() => setSelectedAuthorBooks(null)}
                  className="text-gray-500 hover:text-gray-700 text-2xl"
                >
                  ×
                </button>
              </div>
              <div className="p-6">
                {loadingBooks ? (
                  <div className="text-center py-8">Cargando...</div>
                ) : selectedAuthorBooks.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    Este autor no tiene libros registrados
                  </div>
                ) : (
                  <div className="space-y-4">
                    {selectedAuthorBooks.map((book: any) => (
                      <div key={book.id} className="border border-gray-200 rounded-lg p-4">
                        <h3 className="text-lg font-semibold text-gray-900">{book.title}</h3>
                        {book.description && (
                          <p className="text-sm text-gray-600 mt-2">{book.description}</p>
                        )}
                        <div className="mt-2 flex gap-4 text-sm text-gray-500">
                          {book.genre && <span>Género: {book.genre}</span>}
                          {book.publishedYear && <span>Año: {book.publishedYear}</span>}
                          {book.pages && <span>Páginas: {book.pages}</span>}
                          {book.isbn && <span>ISBN: {book.isbn}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
