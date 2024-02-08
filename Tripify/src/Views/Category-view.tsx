import { useParams } from "react-router-dom"


export default function CategoryView() {
    const { id } = useParams()
  return (
    <div>
      <h1>Category</h1>
      <h1>{id}</h1>
    </div>
  )
}