import { listCategories } from '../api/services'
import { useFetch } from './useFetch'

export function useCategories() {
  const { data, loading, error } = useFetch(() => listCategories(), [])
  const categories = Array.isArray(data) ? data : (data?.items ?? [])
  return { categories, loading, error }
}
