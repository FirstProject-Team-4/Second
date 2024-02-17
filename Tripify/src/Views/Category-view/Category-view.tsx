import { useParams } from "react-router-dom"
import './Category-view.css'

export default function CategoryView() {
    const { categoryName } = useParams()
  return (
    <div className="category-view">
      <h1>Category</h1>
      <h1>{categoryName}</h1>
    </div>
  )
}