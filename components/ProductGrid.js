import { Card, List } from "antd";
import Meta from "antd/es/card/Meta";

const ProductGrid = ({products, categories, addItemToCart, isProduct, filterProducts})=>{

    if(isProduct){
      return(
        <List 
          grid={{ gutter: 20}}
          split={false}
          dataSource={products}
          renderItem={product => (
            <List.Item className="grid-card">
              <Card
                  onClick={()=> addItemToCart(product)}
                  hoverable
                  size="small"
                  cover={<img className="grid-image" alt={product.name} src={product.image != null ? product.image : './assets/product-images/not-found.png'}/>}
              >
                <Meta 
                    title={
                      <div className="grid-header">
                        <span>{product.name}</span> 
                        <span>{product.price && `$ ${product.price}`}</span>
                      </div>
                    }
                    description={
                      <div>
                        {product.categories && product.categories.map((c)=>{
                          let category = ""
                          switch(c){
                            case "Caliente":
                              category = <img key={c} className="category-icon" src="./assets/bonfire.png" alt="Caliente"/>;
                              break;
                            case "Frio":
                              category = <img key={c} className="category-icon" src="./assets/snowflake.png" alt="Caliente"/>;
                              break;
                            default:
                              category = c += " ";
                              break;
                          }
                          return category
                        })}
                      </div>
                    }
                    />
              </Card>
            </List.Item>
          )}
        />
      );
    }else{
      return(
        <List 
          grid={{ gutter: 20}}
          split={false}
          dataSource={categories}
          renderItem={category => (
            <List.Item className="grid-card">
              <Card
                  onClick={()=> filterProducts(category.name)}
                  hoverable
                  size="small"
                  cover={<img className="grid-image grid-category" alt={category.name} src={category.image != null ? `./assets/${category.image}` : './assets/product-images/not-found.png'}/>}
              >
                  <Meta 
                      title={
                        <div className="grid-header">
                          <span>{category.name}</span>
                        </div>
                      }
                      />
              </Card>
            </List.Item>
          )}
      />
      );
    }
}

export default ProductGrid;