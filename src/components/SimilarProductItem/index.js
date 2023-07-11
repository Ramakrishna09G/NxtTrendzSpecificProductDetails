// Write your code here
import './index.css'

const SimilarProductItem = props => {
  const {eachProduct} = props
  const {id, imageUrl, price, rating, title, brand} = eachProduct

  return (
    <li className="similar-product-item">
      <img
        src={imageUrl}
        alt={`similar product ${title}`}
        className="similar-product-item-img"
      />
      <h1 className="similar-product-title">{title}</h1>
      <p className="similar-product-brand">by {brand}</p>
      <div className="similar-product-price-and-rating">
        <p className="similar-product-price">Rs {price}/-</p>
        <button type="button" className="rating">
          {rating}
          <img
            src="https://assets.ccbp.in/frontend/react-js/star-img.png"
            alt="star"
            className="star-img"
          />
        </button>
      </div>
    </li>
  )
}

export default SimilarProductItem
