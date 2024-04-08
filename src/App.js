import {Component} from 'react'
import Loader from 'react-loader-spinner'

import ProjectItem from './components/ProjectItem'

import './App.css'

const categoriesList = [
  {id: 'ALL', displayText: 'All'},
  {id: 'STATIC', displayText: 'Static'},
  {id: 'RESPONSIVE', displayText: 'Responsive'},
  {id: 'DYNAMIC', displayText: 'Dynamic'},
  {id: 'REACT', displayText: 'React'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

// Replace your code here
class App extends Component {
  state = {
    projectsList: [],
    category: 'ALL',
    apiStatus: apiStatusConstants.initial,
  }

  componentDidMount = () => {
    this.getProjects()
  }

  getProjects = async () => {
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const {category} = this.state
    const apiUrl = `https://apis.ccbp.in/ps/projects?category=${category}`
    const options = {
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)
    if (response.ok) {
      const data = await response.json()
      const updateData = data.projects.map(each => ({
        id: each.id,
        name: each.name,
        imageUrl: each.image_url,
      }))
      this.setState({
        projectsList: updateData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderSuccessView = () => {
    const {projectsList} = this.state

    return (
      <ul className="list-container">
        {projectsList.map(each => (
          <ProjectItem key={each.id} projectDetails={each} />
        ))}
      </ul>
    )
  }

  onChangeCategory = event => {
    this.setState({category: event.target.value}, this.getProjects)
  }

  renderFailureView = () => (
    <div className="failure-card">
      <img
        src="https://assets.ccbp.in/frontend/react-js/projects-showcase/failure-img.png"
        alt="failure view"
        className="failure-img"
      />
      <h1 className="failure-heading">Oops! Something Went Wrong</h1>
      <p className="failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        type="button"
        className="failure-button"
        onClick={this.getProjects}
      >
        Retry
      </button>
    </div>
  )

  renderLoadingView = () => (
    <div data-testid="loader" className="failure-card">
      <Loader type="ThreeDots" color="#328af2" height={50} width={50} />
    </div>
  )

  renderStaticView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    const {category} = this.state

    return (
      <div className="main-container">
        <div className="header-card">
          <img
            src="https://assets.ccbp.in/frontend/react-js/projects-showcase/website-logo-img.png"
            alt="website logo"
            className="website-logo"
          />
        </div>
        <div className="projects-card">
          <select
            value={category}
            onChange={this.onChangeCategory}
            className="select-card"
          >
            {categoriesList.map(each => (
              <option key={each.id} value={each.id} className="option">
                {each.displayText}
              </option>
            ))}
          </select>

          <div>{this.renderStaticView()}</div>
        </div>
      </div>
    )
  }
}

export default App
