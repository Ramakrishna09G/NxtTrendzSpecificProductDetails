// Write your code here
import {Component} from 'react'
import {BsPlusSquare, BsDashSquare} from 'react-icons/bs'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'

import Header from '../Header'
import SimilarProductItem from '../SimilarProductItem'

import './index.css'

const apiStatsConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class ProductItemDetails extends Component {
  state = {
    productDetailsList: [],
    apiStatus: apiStatsConstants.inProgress,
    errorMsg: '',
    count: 1,
    similarProductsList: [],
  }

  componentDidMount() {
    this.getProductDetails()
  }

  getProductDetails = async () => {
    this.setState({apiStatus: apiStatsConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = `https://apis.ccbp.in/products/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    console.log(response)
    if (response.ok === true) {
      const responseData = await response.json()
      console.log(responseData)
      const formattedData = {
        id: responseData.id,
        title: responseData.title,
        imageUrl: responseData.image_url,
        price: responseData.price,
        description: responseData.description,
        brand: responseData.brand,
        totalReviews: responseData.total_reviews,
        rating: responseData.rating,
        availability: responseData.availability,
      }
      const formattedList = responseData.similar_products.map(eachProduct => ({
        id: eachProduct.id,
        title: eachProduct.title,
        style: eachProduct.style,
        imageUrl: eachProduct.image_url,
        price: eachProduct.price,
        description: eachProduct.description,
        brand: eachProduct.brand,
        totalReviews: eachProduct.total_reviews,
        rating: eachProduct.rating,
        availability: eachProduct.availability,
      }))
      this.setState({
        productDetailsList: formattedData,
        apiStatus: apiStatsConstants.success,
        similarProductsList: formattedList,
      })
    } else if (response.status === 404) {
      const responseData = await response.json()
      this.setState({
        apiStatus: apiStatsConstants.failure,
        errorMsg: responseData.error_msg,
      })
    }
  }

  onClickMinus = () => {
    const {count} = this.state

    if (count > 1) {
      this.setState({count: count - 1})
    }
  }

  onClickPlus = () => {
    const {count} = this.state
    this.setState({count: count + 1})
  }

  renderProductItemDetailsView = () => {
    const {productDetailsList, count, similarProductsList} = this.state
    const {
      id,
      title,
      imageUrl,
      price,
      description,
      brand,
      totalReviews,
      rating,
      availability,
    } = productDetailsList

    return (
      <>
        <Header />
        <div className="product-details-view-bg-container">
          <div className="product-details-view-container">
            <img src={imageUrl} alt="product" className="product-item-img" />
            <div className="item-details-card">
              <h1 className="title">{title}</h1>
              <p className="price">Rs {price}/-</p>
              <div className="rating-bg-container">
                <button type="button" className="rating">
                  <p className="">{rating}</p>
                  <img
                    src="https://assets.ccbp.in/frontend/react-js/star-img.png"
                    alt="star"
                    className="star-img"
                  />
                </button>
                <p className="reviews">{totalReviews} reviews</p>
              </div>
              <p className="description">{description}</p>
              <p className="available">
                <span className="availability-heading">Available:</span>{' '}
                {availability}
              </p>
              <p className="brand">
                <span className="brand-heading">Brand:</span> {brand}
              </p>
              <hr className="hr-line" />
              <div className="items-counter-container">
                <button
                  type="button"
                  data-testid="minus"
                  className="stock-select-btn"
                  onClick={this.onClickMinus}
                >
                  <BsDashSquare />
                </button>
                <p className="item-count">{count}</p>
                <button
                  type="button"
                  data-testid="plus"
                  className="stock-select-btn"
                  onClick={this.onClickPlus}
                >
                  <BsPlusSquare />
                </button>
              </div>
              <button type="button" className="add-to-cart-btn">
                ADD TO CART
              </button>
            </div>
          </div>
          <div className="similar-products-bg-container">
            <h1 className="similar-product-heading">Similar Products</h1>
            <ul className="similar-products-list-container">
              {similarProductsList.map(eachProduct => (
                <SimilarProductItem
                  key={eachProduct.id}
                  eachProduct={eachProduct}
                />
              ))}
            </ul>
          </div>
        </div>
      </>
    )
  }

  onClickContinueShopping = () => {
    const {history} = this.props
    history.replace('/products')
  }

  renderFailureView = () => {
    const {errorMsg} = this.state

    return (
      <div className="no-products-view-container">
        <img
          src="https://assets.ccbp.in/frontend/react-js/nxt-trendz-error-view-img.png"
          alt="failure view"
          className="nxt-trendz-error-view-img"
        />
        <h1 className="error-msg">{errorMsg}</h1>
        <button
          type="button"
          className="continue-btn"
          onClick={this.onClickContinueShopping}
        >
          Continue Shopping
        </button>
      </div>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0b69ff" height={80} width={80} />
    </div>
  )

  render() {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatsConstants.success:
        return this.renderProductItemDetailsView()
      case apiStatsConstants.failure:
        return this.renderFailureView()
      case apiStatsConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }
}

export default ProductItemDetails
