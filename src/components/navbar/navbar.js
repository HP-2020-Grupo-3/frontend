import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import NavDropdown from 'react-bootstrap/NavDropdown';
import SecurityContext from '../security/securityContext'

class Navegacion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: true,
      dto: null
    };
  }

  render() {
    const { error, isLoaded, dto } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else {
      return (
      <header id="header" class="htc-header header--3 bg__white">
      <div id="sticky-header-with-topbar" class="mainmenu__area sticky__header">
        <div class="justify-content-md-center row">
        <div class="col-md-2 col-lg-2 col-sm-3 col-xs-3">
          <div class="logo">
            <a href="/">
              <h2>Veni de Mary</h2>
            </a>
          </div>
        </div>
          <nav class="mainmenu__nav hidden-xs hidden-sm">
            <ul class="main__menu">
              <li class="drop"><a href="index.html">Home</a></li>
              <li class="drop"><a href="portfolio-card-box-2.html">portfolio</a>
                <ul class="dropdown">
                  <li><a href="portfolio-card-box-2.html">portfolio</a></li>
                  <li><a href="single-portfolio.html">Single portfolio</a></li>
                </ul>
              </li>
              <li class="drop"><a href="blog.html">Blog</a>
                <ul class="dropdown">
                  <li><a href="blog.html">blog 3 column</a></li>
                  <li><a href="blog-details.html">Blog details</a></li>
                </ul>
              </li>
              <li class="drop"><a href="shop.html">Shop</a>
                <ul class="dropdown mega_dropdown">
                  <li><a class="mega__title" href="shop.html">shop layout</a>
                    <ul class="mega__item">
                      <li><a href="shop.html">default shop</a></li>
                    </ul>
                  </li>
                  <li><a class="mega__title" href="shop.html">product details layout</a>
                    <ul class="mega__item">
                      <li><a href="product-details.html">tab style 1</a></li>
                    </ul>
                  </li>
                  <li>
                    <ul class="mega__item">
                      <li>
                        <div class="mega-item-img">
                          <a href="shop.html">
                            <img src="images/feature-img/3.png" alt=""></img>
                          </a>
                        </div>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>
              <li class="drop"><a href="#">pages</a>
                <ul class="dropdown">
                  <li><a href="about.html">about</a></li>
                  <li><a href="#">testimonials <span><i class="zmdi zmdi-chevron-right"></i></span></a>
                    <ul class="lavel-dropdown">
                      <li><a href="customer-review.html">customer review</a></li>
                    </ul>
                  </li>
                  <li><a href="shop.html">shop</a></li>
                  <li><a href="shop-sidebar.html">shop sidebar</a></li>
                  <li><a href="product-details.html">product details</a></li>
                  <li><a href="cart.html">cart</a></li>
                  <li><a href="wishlist.html">wishlist</a></li>
                  <li><a href="checkout.html">checkout</a></li>
                  <li><a href="team.html">team</a></li>
                  <li><a href="login-register.html">login & register</a></li>
                </ul>
              </li>
            </ul>
          </nav>                       
        <div class="col-md-2 col-sm-4 col-xs-3">  
          <ul class="menu-extra main__menu">
          { SecurityContext.getPrincipal() 
          ? <li class="drop"><a href="#"><span class="ti-user"></span> {SecurityContext.getPrincipal().username}</a>
                <ul class="dropdown">
                  <li><a href="/login" onClick={SecurityContext.logout}>Cerrar Sesion</a></li>
                </ul>
            </li>
          : <li class="drop"><a href="/login"><span class="ti-key"></span> Iniciar Sesion</a></li>
          }
          </ul>
        </div>
      </div>
    </div>
  </header>
      );
    }
  }
}

export default Navegacion